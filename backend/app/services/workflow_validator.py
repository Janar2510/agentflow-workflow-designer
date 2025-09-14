import logging
from typing import Dict, List, Any, Tuple, Set
from datetime import datetime

logger = logging.getLogger(__name__)

class WorkflowValidationError(Exception):
    """Custom exception for workflow validation errors"""
    pass

class WorkflowValidator:
    """Service for validating workflow structure and configuration"""
    
    def __init__(self):
        self.valid_node_types = {'agent', 'condition', 'trigger', 'action'}
        self.valid_agent_types = {
            'llm_text_generator',
            'data_processor', 
            'api_caller',
            'code_analyzer'
        }
    
    async def validate_workflow(self, workflow_data: Dict[str, Any]) -> Dict[str, Any]:
        """Validate a complete workflow"""
        
        validation_result = {
            'is_valid': True,
            'errors': [],
            'warnings': [],
            'node_errors': {},
            'edge_errors': {},
            'recommendations': []
        }
        
        try:
            # Extract nodes and edges
            nodes = workflow_data.get('nodes', [])
            edges = workflow_data.get('edges', [])
            
            # Validate basic structure
            await self._validate_basic_structure(nodes, edges, validation_result)
            
            # Validate nodes
            await self._validate_nodes(nodes, validation_result)
            
            # Validate edges
            await self._validate_edges(nodes, edges, validation_result)
            
            # Validate workflow logic
            await self._validate_workflow_logic(nodes, edges, validation_result)
            
            # Check for cycles
            await self._validate_acyclic(nodes, edges, validation_result)
            
            # Validate agent configurations
            await self._validate_agent_configs(nodes, validation_result)
            
            # Generate recommendations
            await self._generate_recommendations(nodes, edges, validation_result)
            
            # Set overall validity
            validation_result['is_valid'] = len(validation_result['errors']) == 0
            
        except Exception as e:
            logger.error(f"Workflow validation failed: {e}", exc_info=True)
            validation_result['is_valid'] = False
            validation_result['errors'].append(f"Validation error: {str(e)}")
        
        return validation_result
    
    async def _validate_basic_structure(self, nodes: List[Dict], edges: List[Dict], result: Dict[str, Any]):
        """Validate basic workflow structure"""
        
        # Check for empty workflow
        if not nodes:
            result['errors'].append("Workflow must contain at least one node")
            return
        
        # Check for too many nodes
        if len(nodes) > 100:
            result['warnings'].append("Workflow has many nodes - consider breaking into smaller workflows")
        
        # Check for orphaned nodes
        connected_nodes = set()
        for edge in edges:
            connected_nodes.add(edge.get('source'))
            connected_nodes.add(edge.get('target'))
        
        orphaned_nodes = [node for node in nodes if node['id'] not in connected_nodes and len(nodes) > 1]
        if orphaned_nodes:
            result['warnings'].append(f"Orphaned nodes found: {[n['id'] for n in orphaned_nodes]}")
    
    async def _validate_nodes(self, nodes: List[Dict], result: Dict[str, Any]):
        """Validate individual nodes"""
        
        node_ids = set()
        
        for i, node in enumerate(nodes):
            node_id = node.get('id')
            
            # Check for duplicate node IDs
            if node_id in node_ids:
                result['errors'].append(f"Duplicate node ID: {node_id}")
                result['node_errors'][node_id] = result['node_errors'].get(node_id, [])
                result['node_errors'][node_id].append("Duplicate node ID")
            else:
                node_ids.add(node_id)
            
            # Validate node structure
            await self._validate_node_structure(node, result)
            
            # Validate node type
            await self._validate_node_type(node, result)
            
            # Validate node data
            await self._validate_node_data(node, result)
    
    async def _validate_node_structure(self, node: Dict[str, Any], result: Dict[str, Any]):
        """Validate node structure"""
        
        node_id = node.get('id')
        required_fields = ['id', 'type', 'position', 'data']
        
        for field in required_fields:
            if field not in node:
                result['errors'].append(f"Node {node_id} missing required field: {field}")
                result['node_errors'][node_id] = result['node_errors'].get(node_id, [])
                result['node_errors'][node_id].append(f"Missing required field: {field}")
    
    async def _validate_node_type(self, node: Dict[str, Any], result: Dict[str, Any]):
        """Validate node type"""
        
        node_id = node.get('id')
        node_type = node.get('type')
        
        if node_type not in self.valid_node_types:
            result['errors'].append(f"Node {node_id} has invalid type: {node_type}")
            result['node_errors'][node_id] = result['node_errors'].get(node_id, [])
            result['node_errors'][node_id].append(f"Invalid node type: {node_type}")
    
    async def _validate_node_data(self, node: Dict[str, Any], result: Dict[str, Any]):
        """Validate node data configuration"""
        
        node_id = node.get('id')
        node_type = node.get('type')
        data = node.get('data', {})
        
        # Validate agent type for agent nodes
        if node_type == 'agent':
            agent_type = data.get('agentType')
            if not agent_type:
                result['errors'].append(f"Agent node {node_id} missing agentType")
                result['node_errors'][node_id] = result['node_errors'].get(node_id, [])
                result['node_errors'][node_id].append("Missing agentType")
            elif agent_type not in self.valid_agent_types:
                result['warnings'].append(f"Agent node {node_id} has unknown agent type: {agent_type}")
        
        # Validate required data fields
        required_data_fields = ['label']
        for field in required_data_fields:
            if field not in data:
                result['warnings'].append(f"Node {node_id} missing recommended field: {field}")
    
    async def _validate_edges(self, nodes: List[Dict], edges: List[Dict], result: Dict[str, Any]):
        """Validate edges"""
        
        node_ids = {node['id'] for node in nodes}
        edge_ids = set()
        
        for i, edge in enumerate(edges):
            edge_id = edge.get('id')
            
            # Check for duplicate edge IDs
            if edge_id in edge_ids:
                result['errors'].append(f"Duplicate edge ID: {edge_id}")
                result['edge_errors'][edge_id] = result['edge_errors'].get(edge_id, [])
                result['edge_errors'][edge_id].append("Duplicate edge ID")
            else:
                edge_ids.add(edge_id)
            
            # Validate edge structure
            await self._validate_edge_structure(edge, result)
            
            # Validate edge references
            await self._validate_edge_references(edge, node_ids, result)
    
    async def _validate_edge_structure(self, edge: Dict[str, Any], result: Dict[str, Any]):
        """Validate edge structure"""
        
        edge_id = edge.get('id')
        required_fields = ['id', 'source', 'target']
        
        for field in required_fields:
            if field not in edge:
                result['errors'].append(f"Edge {edge_id} missing required field: {field}")
                result['edge_errors'][edge_id] = result['edge_errors'].get(edge_id, [])
                result['edge_errors'][edge_id].append(f"Missing required field: {field}")
    
    async def _validate_edge_references(self, edge: Dict[str, Any], node_ids: Set[str], result: Dict[str, Any]):
        """Validate edge references to nodes"""
        
        edge_id = edge.get('id')
        source = edge.get('source')
        target = edge.get('target')
        
        if source not in node_ids:
            result['errors'].append(f"Edge {edge_id} references non-existent source node: {source}")
            result['edge_errors'][edge_id] = result['edge_errors'].get(edge_id, [])
            result['edge_errors'][edge_id].append(f"Non-existent source node: {source}")
        
        if target not in node_ids:
            result['errors'].append(f"Edge {edge_id} references non-existent target node: {target}")
            result['edge_errors'][edge_id] = result['edge_errors'].get(edge_id, [])
            result['edge_errors'][edge_id].append(f"Non-existent target node: {target}")
    
    async def _validate_workflow_logic(self, nodes: List[Dict], edges: List[Dict], result: Dict[str, Any]):
        """Validate workflow logic"""
        
        # Check for entry points (nodes with no incoming edges)
        incoming_edges = {edge['target'] for edge in edges}
        entry_points = [node for node in nodes if node['id'] not in incoming_edges]
        
        if not entry_points:
            result['warnings'].append("No entry points found - workflow may not be executable")
        
        # Check for exit points (nodes with no outgoing edges)
        outgoing_edges = {edge['source'] for edge in edges}
        exit_points = [node for node in nodes if node['id'] not in outgoing_edges]
        
        if not exit_points:
            result['warnings'].append("No exit points found - workflow may not complete")
        
        # Check for trigger nodes
        trigger_nodes = [node for node in nodes if node.get('type') == 'trigger']
        if not trigger_nodes:
            result['warnings'].append("No trigger nodes found - workflow may not start automatically")
    
    async def _validate_acyclic(self, nodes: List[Dict], edges: List[Dict], result: Dict[str, Any]):
        """Validate that workflow is acyclic"""
        
        # Build adjacency list
        graph = {node['id']: [] for node in nodes}
        for edge in edges:
            source = edge['source']
            target = edge['target']
            if source in graph and target in graph:
                graph[source].append(target)
        
        # Check for cycles using DFS
        visited = set()
        rec_stack = set()
        
        def has_cycle(node):
            if node in rec_stack:
                return True
            if node in visited:
                return False
            
            visited.add(node)
            rec_stack.add(node)
            
            for neighbor in graph[node]:
                if has_cycle(neighbor):
                    return True
            
            rec_stack.remove(node)
            return False
        
        for node_id in graph:
            if node_id not in visited:
                if has_cycle(node_id):
                    result['errors'].append("Workflow contains cycles - this is not allowed")
                    return
    
    async def _validate_agent_configs(self, nodes: List[Dict], result: Dict[str, Any]):
        """Validate agent configurations"""
        
        for node in nodes:
            if node.get('type') != 'agent':
                continue
            
            node_id = node['id']
            data = node.get('data', {})
            agent_type = data.get('agentType')
            config = data.get('config', {})
            
            if not agent_type:
                continue
            
            # Validate agent-specific configuration
            if agent_type == 'llm_text_generator':
                await self._validate_llm_config(node_id, config, result)
            elif agent_type == 'data_processor':
                await self._validate_data_processor_config(node_id, config, result)
            elif agent_type == 'api_caller':
                await self._validate_api_caller_config(node_id, config, result)
            elif agent_type == 'code_analyzer':
                await self._validate_code_analyzer_config(node_id, config, result)
    
    async def _validate_llm_config(self, node_id: str, config: Dict[str, Any], result: Dict[str, Any]):
        """Validate LLM agent configuration"""
        
        if 'temperature' in config:
            temp = config['temperature']
            if not isinstance(temp, (int, float)) or temp < 0 or temp > 2:
                result['warnings'].append(f"Node {node_id}: temperature should be between 0 and 2")
        
        if 'max_tokens' in config:
            tokens = config['max_tokens']
            if not isinstance(tokens, int) or tokens < 1 or tokens > 4000:
                result['warnings'].append(f"Node {node_id}: max_tokens should be between 1 and 4000")
    
    async def _validate_data_processor_config(self, node_id: str, config: Dict[str, Any], result: Dict[str, Any]):
        """Validate data processor configuration"""
        
        operation = config.get('operation')
        if operation and operation not in ['filter', 'transform', 'aggregate', 'sort', 'group', 'merge', 'deduplicate']:
            result['warnings'].append(f"Node {node_id}: unknown operation '{operation}'")
    
    async def _validate_api_caller_config(self, node_id: str, config: Dict[str, Any], result: Dict[str, Any]):
        """Validate API caller configuration"""
        
        timeout = config.get('timeout')
        if timeout and (not isinstance(timeout, (int, float)) or timeout < 1 or timeout > 300):
            result['warnings'].append(f"Node {node_id}: timeout should be between 1 and 300 seconds")
        
        retries = config.get('retries')
        if retries and (not isinstance(retries, int) or retries < 0 or retries > 10):
            result['warnings'].append(f"Node {node_id}: retries should be between 0 and 10")
    
    async def _validate_code_analyzer_config(self, node_id: str, config: Dict[str, Any], result: Dict[str, Any]):
        """Validate code analyzer configuration"""
        
        language = config.get('language')
        if language and language not in ['python', 'javascript', 'java', 'cpp', 'csharp']:
            result['warnings'].append(f"Node {node_id}: unsupported language '{language}'")
    
    async def _generate_recommendations(self, nodes: List[Dict], edges: List[Dict], result: Dict[str, Any]):
        """Generate workflow improvement recommendations"""
        
        recommendations = []
        
        # Check for workflow complexity
        if len(nodes) > 20:
            recommendations.append("Consider breaking this workflow into smaller, more manageable pieces")
        
        # Check for node naming
        unnamed_nodes = [node for node in nodes if not node.get('data', {}).get('label')]
        if unnamed_nodes:
            recommendations.append("Add descriptive labels to all nodes for better clarity")
        
        # Check for error handling
        has_error_handling = any(
            node.get('type') == 'condition' and 
            'error' in node.get('data', {}).get('label', '').lower()
            for node in nodes
        )
        if not has_error_handling and len(nodes) > 5:
            recommendations.append("Consider adding error handling nodes for better reliability")
        
        # Check for monitoring
        has_monitoring = any(
            node.get('type') == 'action' and 
            'log' in node.get('data', {}).get('label', '').lower()
            for node in nodes
        )
        if not has_monitoring:
            recommendations.append("Consider adding logging/monitoring nodes for better observability")
        
        result['recommendations'] = recommendations

