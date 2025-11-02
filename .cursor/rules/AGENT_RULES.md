# AgentFlow Agent Development Rules

## Overview

This document outlines the rules, standards, and best practices for developing custom agents in AgentFlow. All agents must follow these guidelines to ensure compatibility, security, and maintainability.

## Agent Interface Contract

### Required Interface

All agents MUST implement the following interface:

```python
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from datetime import datetime

class AgentInterface(ABC):
    """Base interface that all AgentFlow agents must implement"""
    
    def __init__(self, config: Dict[str, Any], llm: Optional[Any] = None):
        """
        Initialize the agent with configuration and optional LLM instance
        
        Args:
            config: Agent configuration dictionary
            llm: Optional language model instance
        """
        self.config = config
        self.llm = llm
        self._validate_config()
    
    @abstractmethod
    async def execute(self, input_data: Dict[str, Any], context: Any) -> Dict[str, Any]:
        """
        Execute the agent with input data and execution context
        
        Args:
            input_data: Input data for the agent
            context: Execution context containing workflow state
            
        Returns:
            Dict containing:
            - output: Primary result of agent execution
            - variables: Variables to pass to next agents
            - metadata: Execution metadata
            
        Raises:
            AgentExecutionError: If agent execution fails
            ValidationError: If input data is invalid
        """
        pass
    
    def _validate_config(self) -> None:
        """Validate agent configuration - MUST be implemented"""
        pass
    
    def get_schema(self) -> Dict[str, Any]:
        """Return agent schema definition"""
        return {
            "input_schema": self.input_schema,
            "output_schema": self.output_schema,
            "config_schema": self.config_schema
        }
```

### Response Format

All agents MUST return responses in this exact format:

```python
{
    "output": Any,  # Primary result of agent execution
    "variables": Dict[str, Any],  # Variables for next agents
    "metadata": {
        "agent_type": str,  # Agent type identifier
        "execution_time": float,  # Execution time in seconds
        "timestamp": str,  # ISO timestamp
        "status": str,  # "completed", "failed", "partial"
        "version": str  # Agent version
    }
}
```

## Configuration Schema

### Required Configuration Fields

```python
config_schema = {
    "type": "object",
    "properties": {
        "timeout": {
            "type": "integer",
            "default": 300,
            "description": "Maximum execution time in seconds"
        },
        "retry_count": {
            "type": "integer",
            "default": 3,
            "description": "Number of retry attempts on failure"
        },
        "error_handling": {
            "type": "string",
            "enum": ["fail", "continue", "retry"],
            "default": "fail",
            "description": "Error handling strategy"
        }
    },
    "required": []
}
```

### Input Schema

```python
input_schema = {
    "type": "object",
    "properties": {
        # Define input properties based on agent requirements
    },
    "required": [
        # List required input fields
    ]
}
```

### Output Schema

```python
output_schema = {
    "type": "object",
    "properties": {
        "output": {
            "type": "object",
            "description": "Primary agent output"
        },
        "variables": {
            "type": "object",
            "description": "Variables for next agents"
        },
        "metadata": {
            "type": "object",
            "description": "Execution metadata"
        }
    },
    "required": ["output", "variables", "metadata"]
}
```

## Error Handling

### Required Error Types

```python
class AgentError(Exception):
    """Base exception for agent errors"""
    pass

class AgentExecutionError(AgentError):
    """Raised when agent execution fails"""
    def __init__(self, message: str, error_code: str = None, details: Dict = None):
        super().__init__(message)
        self.error_code = error_code
        self.details = details or {}

class AgentValidationError(AgentError):
    """Raised when input validation fails"""
    pass

class AgentTimeoutError(AgentError):
    """Raised when agent execution times out"""
    pass
```

### Error Handling Implementation

```python
async def execute(self, input_data: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """Execute agent with proper error handling"""
    start_time = time.time()
    
    try:
        # Validate input
        self._validate_input(input_data)
        
        # Execute agent logic
        result = await self._execute_logic(input_data, context)
        
        return {
            "output": result,
            "variables": self._extract_variables(result),
            "metadata": {
                "agent_type": self.__class__.__name__,
                "execution_time": time.time() - start_time,
                "timestamp": datetime.utcnow().isoformat(),
                "status": "completed",
                "version": self.version
            }
        }
        
    except AgentValidationError as e:
        raise AgentExecutionError(
            f"Input validation failed: {e}",
            error_code="VALIDATION_ERROR",
            details={"field": getattr(e, 'field', None)}
        )
    except asyncio.TimeoutError:
        raise AgentTimeoutError("Agent execution timed out")
    except Exception as e:
        raise AgentExecutionError(
            f"Agent execution failed: {e}",
            error_code="EXECUTION_ERROR",
            details={"exception_type": type(e).__name__}
        )
```

## Security Requirements

### Input Validation

```python
def _validate_input(self, input_data: Dict[str, Any]) -> None:
    """Validate input data against schema"""
    try:
        jsonschema.validate(input_data, self.input_schema)
    except jsonschema.ValidationError as e:
        raise AgentValidationError(f"Input validation failed: {e.message}")

def _sanitize_input(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
    """Sanitize input data to prevent security issues"""
    sanitized = {}
    for key, value in input_data.items():
        if isinstance(value, str):
            # Remove potentially dangerous characters
            sanitized[key] = value.replace('<script>', '').replace('</script>', '')
        elif isinstance(value, dict):
            sanitized[key] = self._sanitize_input(value)
        else:
            sanitized[key] = value
    return sanitized
```

### API Key Management

```python
def _get_api_key(self, service: str) -> str:
    """Safely retrieve API keys from environment"""
    key_name = f"{service.upper()}_API_KEY"
    api_key = os.getenv(key_name)
    
    if not api_key:
        raise AgentExecutionError(
            f"API key not found for {service}",
            error_code="MISSING_API_KEY"
        )
    
    return api_key
```

### Rate Limiting

```python
import asyncio
from datetime import datetime, timedelta

class RateLimiter:
    def __init__(self, max_requests: int, time_window: int):
        self.max_requests = max_requests
        self.time_window = time_window
        self.requests = []
        self._lock = asyncio.Lock()
    
    async def acquire(self) -> None:
        async with self._lock:
            now = datetime.utcnow()
            # Remove old requests
            self.requests = [req for req in self.requests if now - req < timedelta(seconds=self.time_window)]
            
            if len(self.requests) >= self.max_requests:
                sleep_time = (self.requests[0] + timedelta(seconds=self.time_window) - now).total_seconds()
                await asyncio.sleep(sleep_time)
            
            self.requests.append(now)
```

## Performance Requirements

### Timeout Handling

```python
async def execute(self, input_data: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """Execute with timeout handling"""
    timeout = self.config.get('timeout', 300)
    
    try:
        result = await asyncio.wait_for(
            self._execute_logic(input_data, context),
            timeout=timeout
        )
        return result
    except asyncio.TimeoutError:
        raise AgentTimeoutError(f"Agent execution timed out after {timeout} seconds")
```

### Memory Management

```python
import gc
import psutil
import os

def _check_memory_usage(self) -> None:
    """Check and log memory usage"""
    process = psutil.Process(os.getpid())
    memory_mb = process.memory_info().rss / 1024 / 1024
    
    if memory_mb > 500:  # 500MB threshold
        logger.warning(f"High memory usage: {memory_mb:.2f}MB")
        gc.collect()  # Force garbage collection
```

### Caching

```python
from functools import lru_cache
import hashlib

class CachedAgent(AgentInterface):
    def __init__(self, config: Dict[str, Any], llm: Optional[Any] = None):
        super().__init__(config, llm)
        self.cache = {}
        self.cache_ttl = config.get('cache_ttl', 3600)  # 1 hour default
    
    def _get_cache_key(self, input_data: Dict[str, Any]) -> str:
        """Generate cache key from input data"""
        input_str = json.dumps(input_data, sort_keys=True)
        return hashlib.md5(input_str.encode()).hexdigest()
    
    async def execute(self, input_data: Dict[str, Any], context: Any) -> Dict[str, Any]:
        cache_key = self._get_cache_key(input_data)
        
        # Check cache
        if cache_key in self.cache:
            cached_result, timestamp = self.cache[cache_key]
            if time.time() - timestamp < self.cache_ttl:
                return cached_result
        
        # Execute and cache result
        result = await self._execute_logic(input_data, context)
        self.cache[cache_key] = (result, time.time())
        
        return result
```

## Logging and Monitoring

### Structured Logging

```python
import structlog
import logging

logger = structlog.get_logger(__name__)

async def execute(self, input_data: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """Execute with structured logging"""
    execution_id = getattr(context, 'execution_id', 'unknown')
    
    logger.info(
        "agent_execution_started",
        agent_type=self.__class__.__name__,
        execution_id=execution_id,
        input_keys=list(input_data.keys())
    )
    
    try:
        result = await self._execute_logic(input_data, context)
        
        logger.info(
            "agent_execution_completed",
            agent_type=self.__class__.__name__,
            execution_id=execution_id,
            execution_time=time.time() - start_time
        )
        
        return result
        
    except Exception as e:
        logger.error(
            "agent_execution_failed",
            agent_type=self.__class__.__name__,
            execution_id=execution_id,
            error=str(e),
            error_type=type(e).__name__
        )
        raise
```

### Metrics Collection

```python
from prometheus_client import Counter, Histogram, Gauge

# Define metrics
agent_executions = Counter(
    'agentflow_agent_executions_total',
    'Total agent executions',
    ['agent_type', 'status']
)

agent_duration = Histogram(
    'agentflow_agent_duration_seconds',
    'Agent execution duration',
    ['agent_type']
)

agent_memory_usage = Gauge(
    'agentflow_agent_memory_bytes',
    'Agent memory usage',
    ['agent_type']
)

class MonitoredAgent(AgentInterface):
    async def execute(self, input_data: Dict[str, Any], context: Any) -> Dict[str, Any]:
        agent_type = self.__class__.__name__
        
        with agent_duration.labels(agent_type=agent_type).time():
            try:
                result = await self._execute_logic(input_data, context)
                agent_executions.labels(agent_type=agent_type, status='success').inc()
                return result
            except Exception as e:
                agent_executions.labels(agent_type=agent_type, status='error').inc()
                raise
```

## Testing Requirements

### Unit Tests

```python
import pytest
from unittest.mock import AsyncMock, patch

class TestCustomAgent:
    @pytest.fixture
    def agent(self):
        config = {
            "timeout": 30,
            "retry_count": 3
        }
        return CustomAgent(config)
    
    @pytest.mark.asyncio
    async def test_execute_success(self, agent):
        input_data = {"text": "Hello world"}
        context = AsyncMock()
        
        result = await agent.execute(input_data, context)
        
        assert "output" in result
        assert "variables" in result
        assert "metadata" in result
        assert result["metadata"]["status"] == "completed"
    
    @pytest.mark.asyncio
    async def test_execute_validation_error(self, agent):
        input_data = {}  # Missing required fields
        
        with pytest.raises(AgentValidationError):
            await agent.execute(input_data, None)
    
    @pytest.mark.asyncio
    async def test_execute_timeout(self, agent):
        agent.config["timeout"] = 0.1  # Very short timeout
        
        with patch.object(agent, '_execute_logic', side_effect=asyncio.sleep(1)):
            with pytest.raises(AgentTimeoutError):
                await agent.execute({"text": "test"}, None)
```

### Integration Tests

```python
@pytest.mark.asyncio
async def test_agent_in_workflow():
    """Test agent execution within a workflow context"""
    workflow_data = {
        "nodes": [
            {
                "id": "node-1",
                "type": "agent",
                "data": {
                    "agentType": "custom_agent",
                    "config": {"timeout": 30}
                }
            }
        ],
        "edges": []
    }
    
    execution_engine = ExecutionEngine()
    result = await execution_engine.execute_workflow(workflow_data, {"input": "test"})
    
    assert result["status"] == "completed"
    assert "node-1" in result["results"]
```

## Documentation Requirements

### Agent Documentation Template

```python
class CustomAgent(AgentInterface):
    """
    Custom Agent for [specific purpose]
    
    This agent [description of what it does].
    
    Configuration:
        timeout (int): Maximum execution time in seconds (default: 300)
        retry_count (int): Number of retry attempts (default: 3)
        [other config options]
    
    Input Schema:
        input_field (str): Description of input field
        [other input fields]
    
    Output Schema:
        output (Any): Primary output of the agent
        variables (Dict): Variables for next agents
        metadata (Dict): Execution metadata
    
    Example:
        ```python
        agent = CustomAgent({
            "timeout": 60,
            "retry_count": 2
        })
        
        result = await agent.execute({
            "input_field": "example input"
        }, context)
        ```
    
    Raises:
        AgentValidationError: If input validation fails
        AgentExecutionError: If agent execution fails
        AgentTimeoutError: If execution times out
    """
    
    def __init__(self, config: Dict[str, Any], llm: Optional[Any] = None):
        super().__init__(config, llm)
        self.timeout = config.get('timeout', 300)
        self.retry_count = config.get('retry_count', 3)
    
    # ... implementation
```

## Versioning and Compatibility

### Semantic Versioning

```python
class AgentInterface(ABC):
    version = "1.0.0"  # Semantic version
    
    def get_version(self) -> str:
        """Get agent version"""
        return self.version
    
    def is_compatible_with(self, required_version: str) -> bool:
        """Check if agent is compatible with required version"""
        from packaging import version
        return version.parse(self.version) >= version.parse(required_version)
```

### Backward Compatibility

```python
def _handle_legacy_config(self, config: Dict[str, Any]) -> Dict[str, Any]:
    """Handle legacy configuration format"""
    if "old_config_key" in config:
        config["new_config_key"] = config.pop("old_config_key")
    
    return config
```

## Best Practices

### Code Organization

```python
# agent_file.py
class CustomAgent(AgentInterface):
    """Main agent class"""
    pass

class CustomAgentConfig:
    """Configuration validation and defaults"""
    pass

class CustomAgentError(AgentError):
    """Agent-specific exceptions"""
    pass

# Export only the main class
__all__ = ['CustomAgent']
```

### Resource Management

```python
class ResourceManagedAgent(AgentInterface):
    def __init__(self, config: Dict[str, Any], llm: Optional[Any] = None):
        super().__init__(config, llm)
        self._resources = []
    
    async def _acquire_resources(self):
        """Acquire necessary resources"""
        pass
    
    async def _release_resources(self):
        """Release acquired resources"""
        for resource in self._resources:
            try:
                await resource.close()
            except Exception as e:
                logger.warning(f"Failed to release resource: {e}")
        self._resources.clear()
    
    async def execute(self, input_data: Dict[str, Any], context: Any) -> Dict[str, Any]:
        try:
            await self._acquire_resources()
            return await self._execute_logic(input_data, context)
        finally:
            await self._release_resources()
```

### Configuration Validation

```python
import jsonschema

def _validate_config(self) -> None:
    """Validate agent configuration"""
    schema = {
        "type": "object",
        "properties": {
            "timeout": {"type": "integer", "minimum": 1, "maximum": 3600},
            "retry_count": {"type": "integer", "minimum": 0, "maximum": 10},
            "api_key": {"type": "string", "minLength": 1}
        },
        "required": ["api_key"],
        "additionalProperties": False
    }
    
    try:
        jsonschema.validate(self.config, schema)
    except jsonschema.ValidationError as e:
        raise ValueError(f"Invalid configuration: {e.message}")
```

## Agent Registry

### Registration

```python
# agents/registry.py
AGENT_REGISTRY = {
    "custom_agent": {
        "class": CustomAgent,
        "module": "agents.custom_agent",
        "version": "1.0.0",
        "description": "Custom agent for specific tasks",
        "category": "custom",
        "tags": ["nlp", "processing"]
    }
}

def register_agent(name: str, agent_class: type, **metadata):
    """Register a new agent"""
    AGENT_REGISTRY[name] = {
        "class": agent_class,
        "module": agent_class.__module__,
        "version": getattr(agent_class, 'version', '1.0.0'),
        **metadata
    }

def get_agent(name: str) -> type:
    """Get agent class by name"""
    if name not in AGENT_REGISTRY:
        raise ValueError(f"Agent '{name}' not found in registry")
    return AGENT_REGISTRY[name]["class"]
```

## Compliance Checklist

Before submitting an agent, ensure it meets all requirements:

- [ ] Implements `AgentInterface` correctly
- [ ] Returns response in required format
- [ ] Includes proper error handling
- [ ] Validates input data
- [ ] Implements timeout handling
- [ ] Includes structured logging
- [ ] Has comprehensive tests
- [ ] Follows security best practices
- [ ] Includes documentation
- [ ] Uses semantic versioning
- [ ] Handles resource cleanup
- [ ] Implements rate limiting (if applicable)
- [ ] Includes metrics collection
- [ ] Validates configuration
- [ ] Handles edge cases
- [ ] Is backward compatible
- [ ] Follows code style guidelines

## Conclusion

Following these rules ensures that all AgentFlow agents are secure, reliable, and maintainable. Agents that don't comply with these standards will be rejected from the registry and cannot be used in production workflows.











