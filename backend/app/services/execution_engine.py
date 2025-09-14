import asyncio
import logging
from datetime import datetime
from typing import Dict, List, Any, Optional
import uuid
from dataclasses import dataclass

from app.core.database import get_db
from app.services.agent_runner import AgentRunner
from app.services.websocket_manager import ConnectionManager

logger = logging.getLogger(__name__)

@dataclass
class ExecutionContext:
    """Execution context for workflow runs"""
    execution_id: uuid.UUID
    workflow_id: uuid.UUID
    user_id: uuid.UUID
    input_data: Dict[str, Any]
    variables: Dict[str, Any]
    started_at: datetime
    current_step: int = 0
    logs: List[Dict[str, Any]] = None
    
    def __post_init__(self):
        if self.logs is None:
            self.logs = []

class ExecutionEngine:
    """Core execution engine for AgentFlow workflows"""
    
    def __init__(self, connection_manager: Optional[ConnectionManager] = None):
        self.running_executions: Dict[uuid.UUID, ExecutionContext] = {}
        self.agent_runner = AgentRunner()
        self.connection_manager = connection_manager
        self._shutdown_event = asyncio.Event()
        
    async def start(self):
        """Start the execution engine"""
        logger.info("🚀 Starting ExecutionEngine")
        await self.agent_runner.initialize()
        
        # Start background task for monitoring executions
        asyncio.create_task(self._execution_monitor())
        
    async def stop(self):
        """Stop the execution engine"""
        logger.info("🛑 Stopping ExecutionEngine")
        self._shutdown_event.set()
        
        # Cancel all running executions
        for execution_id in list(self.running_executions.keys()):
            await self.cancel_execution(execution_id)
            
        await self.agent_runner.cleanup()
        
    async def execute_workflow(
        self,
        execution_id: uuid.UUID,
        workflow_data: Dict[str, Any],
        input_data: Dict[str, Any],
        user_id: uuid.UUID,
        workflow_id: uuid.UUID
    ) -> Dict[str, Any]:
        """Execute a complete workflow"""
        
        context = ExecutionContext(
            execution_id=execution_id,
            workflow_id=workflow_id,
            user_id=user_id,
            input_data=input_data,
            variables=input_data.copy(),
            started_at=datetime.utcnow()
        )
        
        self.running_executions[execution_id] = context
        
        try:
            # Parse workflow nodes and edges
            nodes = workflow_data.get('nodes', [])
            edges = workflow_data.get('edges', [])
            
            # Build execution graph
            execution_graph = self._build_execution_graph(nodes, edges)
            
            # Execute workflow steps
            result = await self._execute_graph(context, execution_graph)
            
            await self._update_execution_status(execution_id, "completed", result)
            return result
            
        except Exception as e:
            logger.error(f"Workflow execution failed: {e}", exc_info=True)
            await self._update_execution_status(execution_id, "failed", error=str(e))
            raise
        finally:
            # Cleanup
            if execution_id in self.running_executions:
                del self.running_executions[execution_id]
    
    def _build_execution_graph(self, nodes: List[Dict], edges: List[Dict]) -> Dict[str, Any]:
        """Build execution graph from workflow nodes and edges"""
        
        # Create node lookup
        node_map = {node['id']: node for node in nodes}
        
        # Build adjacency list for execution order
        graph = {node['id']: {'node': node, 'dependencies': [], 'dependents': []} for node in nodes}
        
        for edge in edges:
            source_id = edge['source']
            target_id = edge['target']
            
            if source_id in graph and target_id in graph:
                graph[target_id]['dependencies'].append(source_id)
                graph[source_id]['dependents'].append(target_id)
        
        # Find entry points (nodes with no dependencies)
        entry_points = [node_id for node_id, data in graph.items() if not data['dependencies']]
        
        return {
            'graph': graph,
            'entry_points': entry_points,
            'nodes': node_map
        }
    
    async def _execute_graph(self, context: ExecutionContext, execution_graph: Dict) -> Dict[str, Any]:
        """Execute the workflow graph"""
        
        graph = execution_graph['graph']
        completed_nodes = set()
        node_results = {}
        
        # Start with entry points
        ready_nodes = set(execution_graph['entry_points'])
        
        while ready_nodes:
            # Execute ready nodes in parallel
            tasks = []
            current_batch = list(ready_nodes)
            ready_nodes.clear()
            
            for node_id in current_batch:
                task = asyncio.create_task(
                    self._execute_node(context, graph[node_id]['node'], node_results)
                )
                tasks.append((node_id, task))
            
            # Wait for batch completion
            for node_id, task in tasks:
                try:
                    result = await task
                    node_results[node_id] = result
                    completed_nodes.add(node_id)
                    
                    # Emit progress update
                    await self._emit_progress_update(context, node_id, "completed", result)
                    
                    # Check if dependents are ready
                    for dependent_id in graph[node_id]['dependents']:
                        if dependent_id not in completed_nodes:
                            dependencies = graph[dependent_id]['dependencies']
                            if all(dep in completed_nodes for dep in dependencies):
                                ready_nodes.add(dependent_id)
                                
                except Exception as e:
                    logger.error(f"Node {node_id} execution failed: {e}")
                    await self._emit_progress_update(context, node_id, "failed", error=str(e))
                    raise
        
        return {
            'status': 'completed',
            'results': node_results,
            'execution_time': (datetime.utcnow() - context.started_at).total_seconds()
        }
    
    async def _execute_node(
        self, 
        context: ExecutionContext, 
        node: Dict[str, Any], 
        previous_results: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Execute a single agent node"""
        
        node_id = node['id']
        agent_type = node['data']['agentType']
        agent_config = node['data'].get('config', {})
        
        # Emit start event
        await self._emit_progress_update(context, node_id, "started")
        
        # Prepare input data from previous nodes and context variables
        input_data = self._prepare_node_input(node, previous_results, context.variables)
        
        # Execute the agent
        start_time = datetime.utcnow()
        
        try:
            result = await self.agent_runner.execute_agent(
                agent_type=agent_type,
                config=agent_config,
                input_data=input_data,
                context=context
            )
            
            execution_time = (datetime.utcnow() - start_time).total_seconds()
            
            # Update context variables if the agent provides outputs
            if isinstance(result, dict) and 'variables' in result:
                context.variables.update(result['variables'])
            
            return {
                'status': 'completed',
                'result': result,
                'execution_time': execution_time,
                'timestamp': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            execution_time = (datetime.utcnow() - start_time).total_seconds()
            
            return {
                'status': 'failed',
                'error': str(e),
                'execution_time': execution_time,
                'timestamp': datetime.utcnow().isoformat()
            }
    
    def _prepare_node_input(
        self, 
        node: Dict[str, Any], 
        previous_results: Dict[str, Any], 
        context_variables: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Prepare input data for a node from previous results and context"""
        
        input_data = {
            'variables': context_variables.copy(),
            'previous_results': previous_results
        }
        
        # Add any node-specific input mappings
        node_config = node['data'].get('config', {})
        if 'inputMapping' in node_config:
            for key, value in node_config['inputMapping'].items():
                if value.startswith('$'):
                    # Variable reference
                    var_name = value[1:]
                    if var_name in context_variables:
                        input_data[key] = context_variables[var_name]
                else:
                    # Static value
                    input_data[key] = value
        
        return input_data
    
    async def _emit_progress_update(
        self, 
        context: ExecutionContext, 
        node_id: str, 
        status: str, 
        result: Any = None, 
        error: str = None
    ):
        """Emit progress update via WebSocket"""
        
        update = {
            'type': 'node_update',
            'execution_id': str(context.execution_id),
            'node_id': node_id,
            'status': status,
            'timestamp': datetime.utcnow().isoformat()
        }
        
        if result is not None:
            update['result'] = result
        if error is not None:
            update['error'] = error
        
        # Add to context logs
        context.logs.append(update)
        
        # Emit via WebSocket if connection manager is available
        if self.connection_manager:
            await self.connection_manager.broadcast_to_workflow(
                str(context.workflow_id), 
                update
            )
    
    async def _update_execution_status(
        self, 
        execution_id: uuid.UUID, 
        status: str, 
        result: Any = None, 
        error: str = None
    ):
        """Update execution status in database"""
        
        async with get_db() as db:
            from app.models.execution import WorkflowExecution
            from sqlalchemy import update
            
            await db.execute(
                update(WorkflowExecution)
                .where(WorkflowExecution.id == execution_id)
                .values(
                    status=status,
                    completed_at=datetime.utcnow(),
                    output_data=result,
                    error_message=error
                )
            )
            await db.commit()
    
    async def cancel_execution(self, execution_id: uuid.UUID):
        """Cancel a running execution"""
        
        if execution_id in self.running_executions:
            context = self.running_executions[execution_id]
            
            # Update status
            await self._update_execution_status(execution_id, "cancelled")
            
            # Emit cancellation event
            if self.connection_manager:
                await self.connection_manager.broadcast_to_workflow(
                    str(context.workflow_id),
                    {
                        'type': 'execution_cancelled',
                        'execution_id': str(execution_id),
                        'timestamp': datetime.utcnow().isoformat()
                    }
                )
            
            # Remove from running executions
            del self.running_executions[execution_id]
    
    async def _execution_monitor(self):
        """Background task to monitor execution health"""
        
        while not self._shutdown_event.is_set():
            try:
                # Check for stale executions (running longer than 1 hour)
                current_time = datetime.utcnow()
                stale_executions = []
                
                for execution_id, context in self.running_executions.items():
                    if (current_time - context.started_at).total_seconds() > 3600:
                        stale_executions.append(execution_id)
                
                # Cancel stale executions
                for execution_id in stale_executions:
                    logger.warning(f"Cancelling stale execution: {execution_id}")
                    await self.cancel_execution(execution_id)
                
                await asyncio.sleep(60)  # Check every minute
                
            except Exception as e:
                logger.error(f"Execution monitor error: {e}", exc_info=True)
                await asyncio.sleep(60)







