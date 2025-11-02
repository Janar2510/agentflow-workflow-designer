# AgentFlow Debugging Guide

## Overview

This guide provides comprehensive debugging strategies, tools, and techniques for troubleshooting issues in AgentFlow applications.

## Debugging Philosophy

### Debug-First Development

1. **Log Everything**: Comprehensive logging at all levels
2. **Fail Fast**: Early validation and error detection
3. **Clear Error Messages**: Descriptive error messages with context
4. **Reproducible Issues**: Consistent debugging environment
5. **Progressive Debugging**: Start broad, narrow down to specifics

## Frontend Debugging

### React Developer Tools

#### Component Debugging

```typescript
// Enable React DevTools
import { createRoot } from 'react-dom/client';

// Add debugging props
interface WorkflowEditorProps {
  debug?: boolean;
  onDebugEvent?: (event: string, data: any) => void;
}

const WorkflowEditor: React.FC<WorkflowEditorProps> = ({ 
  debug = false, 
  onDebugEvent 
}) => {
  // Debug logging
  useEffect(() => {
    if (debug) {
      console.log('WorkflowEditor mounted', { nodes, edges });
    }
  }, [debug, nodes, edges]);

  // Debug event handler
  const handleDebugEvent = (event: string, data: any) => {
    if (debug) {
      console.log(`[DEBUG] ${event}:`, data);
      onDebugEvent?.(event, data);
    }
  };
};
```

#### State Debugging

```typescript
// Zustand store with debugging
import { devtools } from 'zustand/middleware';

export const useWorkflowStore = create<WorkflowState>()(
  devtools(
    (set, get) => ({
      // ... store implementation
    }),
    {
      name: 'workflow-store',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
);

// Debug state changes
const WorkflowDebugger = () => {
  const state = useWorkflowStore();
  
  useEffect(() => {
    console.log('Workflow state changed:', state);
  }, [state]);
  
  return null;
};
```

### Network Debugging

```typescript
// API client with debugging
class APIClient {
  private debug: boolean;

  constructor(debug = false) {
    this.debug = debug;
  }

  async request<T>(config: AxiosRequestConfig): Promise<T> {
    if (this.debug) {
      console.log('[API] Request:', {
        method: config.method,
        url: config.url,
        data: config.data,
        headers: config.headers
      });
    }

    try {
      const response = await axios.request<T>(config);
      
      if (this.debug) {
        console.log('[API] Response:', {
          status: response.status,
          data: response.data,
          headers: response.headers
        });
      }
      
      return response.data;
    } catch (error) {
      if (this.debug) {
        console.error('[API] Error:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        });
      }
      throw error;
    }
  }
}
```

### WebSocket Debugging

```typescript
// WebSocket client with debugging
class WebSocketClient {
  private debug: boolean;
  private ws: WebSocket | null = null;

  constructor(debug = false) {
    this.debug = debug;
  }

  connect(url: string) {
    this.ws = new WebSocket(url);
    
    this.ws.onopen = () => {
      if (this.debug) {
        console.log('[WS] Connected to:', url);
      }
    };

    this.ws.onmessage = (event) => {
      if (this.debug) {
        console.log('[WS] Message received:', event.data);
      }
      this.handleMessage(JSON.parse(event.data));
    };

    this.ws.onerror = (error) => {
      if (this.debug) {
        console.error('[WS] Error:', error);
      }
    };

    this.ws.onclose = (event) => {
      if (this.debug) {
        console.log('[WS] Closed:', event.code, event.reason);
      }
    };
  }

  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      if (this.debug) {
        console.log('[WS] Sending:', data);
      }
      this.ws.send(JSON.stringify(data));
    }
  }
}
```

## Backend Debugging

### Logging Configuration

```python
# backend/app/core/logging.py
import logging
import structlog
from pythonjsonlogger import jsonlogger

def setup_logging(debug: bool = False):
    """Setup structured logging for debugging"""
    
    # Configure structlog
    structlog.configure(
        processors=[
            structlog.stdlib.filter_by_level,
            structlog.stdlib.add_logger_name,
            structlog.stdlib.add_log_level,
            structlog.stdlib.PositionalArgumentsFormatter(),
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            structlog.processors.UnicodeDecoder(),
            structlog.processors.JSONRenderer()
        ],
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )
    
    # Configure root logger
    level = logging.DEBUG if debug else logging.INFO
    logging.basicConfig(
        level=level,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(),
            logging.FileHandler('agentflow.log')
        ]
    )

# Usage in main.py
setup_logging(debug=settings.DEBUG)
logger = structlog.get_logger(__name__)
```

### API Debugging

```python
# backend/app/api/debug.py
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
import traceback
import sys

router = APIRouter(prefix="/debug", tags=["debug"])

@router.get("/health")
async def debug_health():
    """Debug health check with detailed system info"""
    import psutil
    import platform
    
    return {
        "status": "healthy",
        "system": {
            "platform": platform.platform(),
            "python_version": platform.python_version(),
            "cpu_count": psutil.cpu_count(),
            "memory_total": psutil.virtual_memory().total,
            "memory_available": psutil.virtual_memory().available
        },
        "database": await check_database_connection(),
        "redis": await check_redis_connection()
    }

@router.get("/logs")
async def get_recent_logs(lines: int = 100):
    """Get recent application logs"""
    try:
        with open('agentflow.log', 'r') as f:
            log_lines = f.readlines()
            return {"logs": log_lines[-lines:]}
    except FileNotFoundError:
        return {"logs": [], "error": "Log file not found"}

@router.get("/exceptions")
async def get_recent_exceptions():
    """Get recent exceptions for debugging"""
    # This would typically come from a log aggregation system
    return {"exceptions": []}

@router.post("/test-workflow")
async def test_workflow(workflow_data: dict):
    """Test workflow execution in debug mode"""
    try:
        from app.services.execution_engine import ExecutionEngine
        
        engine = ExecutionEngine()
        result = await engine.execute_workflow(
            workflow_data=workflow_data,
            input_data={"test": "data"},
            user_id="debug-user",
            workflow_id="debug-workflow"
        )
        
        return {
            "status": "success",
            "result": result
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "traceback": traceback.format_exc()
        }
```

### Database Debugging

```python
# backend/app/core/database.py
import logging
from sqlalchemy import event
from sqlalchemy.engine import Engine

logger = logging.getLogger(__name__)

@event.listens_for(Engine, "before_cursor_execute")
def receive_before_cursor_execute(conn, cursor, statement, parameters, context, executemany):
    """Log SQL queries for debugging"""
    logger.debug(f"SQL Query: {statement}")
    if parameters:
        logger.debug(f"Parameters: {parameters}")

@event.listens_for(Engine, "after_cursor_execute")
def receive_after_cursor_execute(conn, cursor, statement, parameters, context, executemany):
    """Log query execution time"""
    logger.debug(f"Query executed in {context.get('elapsed', 0)}ms")

# Database connection debugging
async def debug_database_connection():
    """Debug database connection issues"""
    try:
        from app.core.database import get_db
        async with get_db() as db:
            result = await db.execute("SELECT 1")
            return {"status": "connected", "result": result.scalar()}
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        return {"status": "failed", "error": str(e)}
```

### Agent Debugging

```python
# backend/app/services/agent_runner.py
import asyncio
import traceback
from typing import Dict, Any

class DebugAgentRunner(AgentRunner):
    """Agent runner with enhanced debugging capabilities"""
    
    async def execute_agent(self, agent_type: str, config: Dict[str, Any], 
                          input_data: Dict[str, Any], context: Any) -> Dict[str, Any]:
        """Execute agent with debugging"""
        
        logger.info(
            "agent_execution_started",
            agent_type=agent_type,
            config=config,
            input_data=input_data
        )
        
        try:
            # Pre-execution validation
            self._validate_agent_input(agent_type, config, input_data)
            
            # Execute with timeout
            result = await asyncio.wait_for(
                self._execute_agent_internal(agent_type, config, input_data, context),
                timeout=config.get('timeout', 300)
            )
            
            logger.info(
                "agent_execution_completed",
                agent_type=agent_type,
                result=result
            )
            
            return result
            
        except asyncio.TimeoutError:
            logger.error(
                "agent_execution_timeout",
                agent_type=agent_type,
                timeout=config.get('timeout', 300)
            )
            raise AgentTimeoutError(f"Agent {agent_type} timed out")
            
        except Exception as e:
            logger.error(
                "agent_execution_failed",
                agent_type=agent_type,
                error=str(e),
                traceback=traceback.format_exc()
            )
            raise AgentExecutionError(f"Agent {agent_type} failed: {e}")
    
    def _validate_agent_input(self, agent_type: str, config: Dict[str, Any], 
                            input_data: Dict[str, Any]) -> None:
        """Validate agent input for debugging"""
        
        # Check agent exists
        if agent_type not in self.agent_registry:
            raise ValueError(f"Unknown agent type: {agent_type}")
        
        # Check required config
        agent_def = self.agent_registry[agent_type]
        required_config = agent_def.get('required_config', [])
        for field in required_config:
            if field not in config:
                raise ValueError(f"Missing required config field: {field}")
        
        # Check input schema
        input_schema = agent_def.get('input_schema', {})
        if input_schema:
            self._validate_against_schema(input_data, input_schema)
    
    def _validate_against_schema(self, data: Dict[str, Any], schema: Dict[str, Any]) -> None:
        """Validate data against JSON schema"""
        import jsonschema
        try:
            jsonschema.validate(data, schema)
        except jsonschema.ValidationError as e:
            raise ValueError(f"Input validation failed: {e.message}")
```

## Workflow Execution Debugging

### Execution Engine Debugging

```python
# backend/app/services/execution_engine.py
class DebugExecutionEngine(ExecutionEngine):
    """Execution engine with debugging capabilities"""
    
    async def execute_workflow(self, workflow_data: Dict[str, Any], 
                             input_data: Dict[str, Any], user_id: str, 
                             workflow_id: str) -> Dict[str, Any]:
        """Execute workflow with comprehensive debugging"""
        
        execution_id = str(uuid.uuid4())
        
        logger.info(
            "workflow_execution_started",
            execution_id=execution_id,
            workflow_id=workflow_id,
            user_id=user_id,
            node_count=len(workflow_data.get('nodes', [])),
            edge_count=len(workflow_data.get('edges', []))
        )
        
        try:
            # Build execution graph
            execution_graph = self._build_execution_graph(
                workflow_data.get('nodes', []),
                workflow_data.get('edges', [])
            )
            
            logger.debug(
                "execution_graph_built",
                execution_id=execution_id,
                entry_points=execution_graph['entry_points'],
                graph_structure=execution_graph['graph']
            )
            
            # Execute workflow
            result = await self._execute_graph_debug(
                execution_id, execution_graph, input_data, user_id
            )
            
            logger.info(
                "workflow_execution_completed",
                execution_id=execution_id,
                execution_time=result.get('execution_time', 0),
                node_results=len(result.get('results', {}))
            )
            
            return result
            
        except Exception as e:
            logger.error(
                "workflow_execution_failed",
                execution_id=execution_id,
                error=str(e),
                traceback=traceback.format_exc()
            )
            raise
    
    async def _execute_graph_debug(self, execution_id: str, execution_graph: Dict, 
                                 input_data: Dict[str, Any], user_id: str) -> Dict[str, Any]:
        """Execute graph with detailed debugging"""
        
        graph = execution_graph['graph']
        completed_nodes = set()
        node_results = {}
        ready_nodes = set(execution_graph['entry_points'])
        
        logger.debug(
            "graph_execution_started",
            execution_id=execution_id,
            ready_nodes=list(ready_nodes)
        )
        
        while ready_nodes:
            current_batch = list(ready_nodes)
            ready_nodes.clear()
            
            logger.debug(
                "executing_batch",
                execution_id=execution_id,
                batch_nodes=current_batch
            )
            
            # Execute batch in parallel
            tasks = []
            for node_id in current_batch:
                task = asyncio.create_task(
                    self._execute_node_debug(execution_id, node_id, graph[node_id], 
                                           node_results, input_data)
                )
                tasks.append((node_id, task))
            
            # Wait for batch completion
            for node_id, task in tasks:
                try:
                    result = await task
                    node_results[node_id] = result
                    completed_nodes.add(node_id)
                    
                    logger.debug(
                        "node_execution_completed",
                        execution_id=execution_id,
                        node_id=node_id,
                        result=result
                    )
                    
                    # Check if dependents are ready
                    for dependent_id in graph[node_id]['dependents']:
                        if dependent_id not in completed_nodes:
                            dependencies = graph[dependent_id]['dependencies']
                            if all(dep in completed_nodes for dep in dependencies):
                                ready_nodes.add(dependent_id)
                                
                except Exception as e:
                    logger.error(
                        "node_execution_failed",
                        execution_id=execution_id,
                        node_id=node_id,
                        error=str(e),
                        traceback=traceback.format_exc()
                    )
                    raise
        
        return {
            'status': 'completed',
            'results': node_results,
            'execution_time': time.time() - start_time
        }
```

## Performance Debugging

### Performance Monitoring

```python
# backend/app/core/performance.py
import time
import psutil
import asyncio
from functools import wraps
from typing import Callable, Any

class PerformanceMonitor:
    """Monitor application performance"""
    
    def __init__(self):
        self.metrics = {}
        self.start_time = time.time()
    
    def measure_function(self, func_name: str = None):
        """Decorator to measure function execution time"""
        def decorator(func: Callable) -> Callable:
            @wraps(func)
            async def async_wrapper(*args, **kwargs) -> Any:
                start_time = time.time()
                try:
                    result = await func(*args, **kwargs)
                    execution_time = time.time() - start_time
                    
                    self.record_metric(
                        f"{func_name or func.__name__}_execution_time",
                        execution_time
                    )
                    
                    return result
                except Exception as e:
                    execution_time = time.time() - start_time
                    self.record_metric(
                        f"{func_name or func.__name__}_error_time",
                        execution_time
                    )
                    raise
            
            @wraps(func)
            def sync_wrapper(*args, **kwargs) -> Any:
                start_time = time.time()
                try:
                    result = func(*args, **kwargs)
                    execution_time = time.time() - start_time
                    
                    self.record_metric(
                        f"{func_name or func.__name__}_execution_time",
                        execution_time
                    )
                    
                    return result
                except Exception as e:
                    execution_time = time.time() - start_time
                    self.record_metric(
                        f"{func_name or func.__name__}_error_time",
                        execution_time
                    )
                    raise
            
            return async_wrapper if asyncio.iscoroutinefunction(func) else sync_wrapper
        return decorator
    
    def record_metric(self, name: str, value: float) -> None:
        """Record a performance metric"""
        if name not in self.metrics:
            self.metrics[name] = []
        self.metrics[name].append(value)
    
    def get_system_metrics(self) -> Dict[str, Any]:
        """Get current system metrics"""
        process = psutil.Process()
        return {
            "cpu_percent": psutil.cpu_percent(),
            "memory_percent": psutil.virtual_memory().percent,
            "process_memory_mb": process.memory_info().rss / 1024 / 1024,
            "process_cpu_percent": process.cpu_percent(),
            "uptime_seconds": time.time() - self.start_time
        }
    
    def get_performance_report(self) -> Dict[str, Any]:
        """Generate performance report"""
        report = {
            "system_metrics": self.get_system_metrics(),
            "function_metrics": {}
        }
        
        for name, values in self.metrics.items():
            if values:
                report["function_metrics"][name] = {
                    "count": len(values),
                    "min": min(values),
                    "max": max(values),
                    "avg": sum(values) / len(values),
                    "total": sum(values)
                }
        
        return report

# Global performance monitor
perf_monitor = PerformanceMonitor()

# Usage example
@perf_monitor.measure_function("workflow_execution")
async def execute_workflow(workflow_data: Dict[str, Any]) -> Dict[str, Any]:
    # Workflow execution logic
    pass
```

## Debugging Tools

### Debug CLI

```python
# backend/cli/debug.py
import click
import asyncio
import json
from pathlib import Path

@click.group()
def debug():
    """Debug tools for AgentFlow"""
    pass

@debug.command()
@click.option('--workflow-file', required=True, help='Path to workflow JSON file')
@click.option('--input-file', help='Path to input JSON file')
@click.option('--verbose', '-v', is_flag=True, help='Verbose output')
def test_workflow(workflow_file: str, input_file: str, verbose: bool):
    """Test workflow execution locally"""
    
    # Load workflow
    with open(workflow_file, 'r') as f:
        workflow_data = json.load(f)
    
    # Load input data
    input_data = {}
    if input_file:
        with open(input_file, 'r') as f:
            input_data = json.load(f)
    
    # Execute workflow
    async def run_test():
        from app.services.execution_engine import ExecutionEngine
        
        engine = ExecutionEngine()
        result = await engine.execute_workflow(
            workflow_data=workflow_data,
            input_data=input_data,
            user_id="debug-user",
            workflow_id="debug-workflow"
        )
        
        if verbose:
            click.echo(json.dumps(result, indent=2))
        else:
            click.echo(f"Status: {result.get('status', 'unknown')}")
            click.echo(f"Execution time: {result.get('execution_time', 0):.2f}s")
    
    asyncio.run(run_test())

@debug.command()
@click.option('--agent-type', required=True, help='Agent type to test')
@click.option('--config-file', help='Path to config JSON file')
@click.option('--input-file', help='Path to input JSON file')
def test_agent(agent_type: str, config_file: str, input_file: str):
    """Test individual agent execution"""
    
    # Load config
    config = {}
    if config_file:
        with open(config_file, 'r') as f:
            config = json.load(f)
    
    # Load input data
    input_data = {}
    if input_file:
        with open(input_file, 'r') as f:
            input_data = json.load(f)
    
    # Execute agent
    async def run_test():
        from app.services.agent_runner import AgentRunner
        
        runner = AgentRunner()
        result = await runner.execute_agent(
            agent_type=agent_type,
            config=config,
            input_data=input_data,
            context=None
        )
        
        click.echo(json.dumps(result, indent=2))
    
    asyncio.run(run_test())

@debug.command()
def system_info():
    """Show system information"""
    import platform
    import psutil
    
    info = {
        "platform": platform.platform(),
        "python_version": platform.python_version(),
        "cpu_count": psutil.cpu_count(),
        "memory_total": psutil.virtual_memory().total,
        "memory_available": psutil.virtual_memory().available,
        "disk_usage": psutil.disk_usage('/').percent
    }
    
    click.echo(json.dumps(info, indent=2))

if __name__ == '__main__':
    debug()
```

### Debug Dashboard

```python
# backend/app/api/debug_dashboard.py
from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

router = APIRouter(prefix="/debug", tags=["debug"])
templates = Jinja2Templates(directory="templates")

@router.get("/dashboard", response_class=HTMLResponse)
async def debug_dashboard(request: Request):
    """Debug dashboard for monitoring application state"""
    
    # Get system metrics
    from app.core.performance import perf_monitor
    performance_data = perf_monitor.get_performance_report()
    
    # Get recent logs
    recent_logs = await get_recent_logs(50)
    
    # Get active workflows
    active_workflows = await get_active_workflows()
    
    # Get database stats
    db_stats = await get_database_stats()
    
    return templates.TemplateResponse("debug_dashboard.html", {
        "request": request,
        "performance": performance_data,
        "logs": recent_logs,
        "workflows": active_workflows,
        "database": db_stats
    })
```

## Common Issues and Solutions

### Frontend Issues

#### ReactFlow Not Rendering
```typescript
// Check if ReactFlow is properly initialized
useEffect(() => {
  if (reactFlowInstance) {
    console.log('ReactFlow instance:', reactFlowInstance);
    console.log('Nodes:', reactFlowInstance.getNodes());
    console.log('Edges:', reactFlowInstance.getEdges());
  }
}, [reactFlowInstance]);
```

#### State Not Updating
```typescript
// Check if state updates are being applied
const WorkflowEditor = () => {
  const { nodes, updateNodes } = useWorkflowStore();
  
  useEffect(() => {
    console.log('Nodes updated:', nodes);
  }, [nodes]);
  
  // Ensure state updates are immutable
  const handleNodeUpdate = (nodeId: string, updates: any) => {
    updateNodes(nodes.map(node => 
      node.id === nodeId ? { ...node, ...updates } : node
    ));
  };
};
```

### Backend Issues

#### Database Connection Issues
```python
# Check database connection
async def debug_database():
    try:
        from app.core.database import get_db
        async with get_db() as db:
            result = await db.execute("SELECT 1")
            print(f"Database connected: {result.scalar()}")
    except Exception as e:
        print(f"Database connection failed: {e}")
        import traceback
        traceback.print_exc()
```

#### Agent Execution Failures
```python
# Debug agent execution
async def debug_agent(agent_type: str, config: dict, input_data: dict):
    try:
        from app.services.agent_runner import AgentRunner
        runner = AgentRunner()
        result = await runner.execute_agent(agent_type, config, input_data, None)
        print(f"Agent executed successfully: {result}")
    except Exception as e:
        print(f"Agent execution failed: {e}")
        import traceback
        traceback.print_exc()
```

### WebSocket Issues

#### Connection Drops
```typescript
// Implement reconnection logic
class WebSocketClient {
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect(url: string) {
    this.ws = new WebSocket(url);
    
    this.ws.onclose = (event) => {
      if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        setTimeout(() => {
          console.log(`Reconnecting... (attempt ${this.reconnectAttempts})`);
          this.connect(url);
        }, this.reconnectDelay * this.reconnectAttempts);
      }
    };
  }
}
```

## Debugging Best Practices

### 1. Use Structured Logging
```python
# Good
logger.info(
    "workflow_execution_started",
    workflow_id=workflow_id,
    user_id=user_id,
    node_count=len(nodes)
)

# Bad
logger.info(f"Workflow {workflow_id} started for user {user_id}")
```

### 2. Include Context in Errors
```python
# Good
try:
    result = await execute_agent(agent_type, config, input_data)
except Exception as e:
    logger.error(
        "agent_execution_failed",
        agent_type=agent_type,
        config=config,
        input_data=input_data,
        error=str(e)
    )
    raise

# Bad
try:
    result = await execute_agent(agent_type, config, input_data)
except Exception as e:
    logger.error(f"Agent failed: {e}")
    raise
```

### 3. Use Debug Flags
```python
# Enable debug mode
DEBUG = os.getenv('DEBUG', 'false').lower() == 'true'

if DEBUG:
    logger.setLevel(logging.DEBUG)
    # Enable additional debugging features
```

### 4. Test in Isolation
```python
# Test individual components
async def test_agent_isolation():
    agent = CustomAgent({"timeout": 30})
    result = await agent.execute({"input": "test"}, None)
    assert result["status"] == "completed"
```

### 5. Monitor Performance
```python
# Use performance monitoring
@perf_monitor.measure_function("critical_operation")
async def critical_operation():
    # Operation logic
    pass
```

This debugging guide provides comprehensive tools and techniques for troubleshooting AgentFlow applications effectively.
















