# AgentFlow API Documentation

## Overview

The AgentFlow API provides a comprehensive REST API for managing workflows, agents, and executions. All endpoints require authentication unless otherwise specified.

## Base URL

```
https://api.agentflow.com/v1
```

## Authentication

All API requests require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "username": "johndoe",
  "full_name": "John Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "full_name": "John Doe",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "access_token": "jwt-token",
  "token_type": "bearer"
}
```

#### POST /auth/login
Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "full_name": "John Doe"
  },
  "access_token": "jwt-token",
  "token_type": "bearer"
}
```

#### GET /auth/me
Get current user information.

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "johndoe",
  "full_name": "John Doe",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### Workflows

#### GET /workflows
List user's workflows.

**Query Parameters:**
- `skip` (integer): Number of workflows to skip (default: 0)
- `limit` (integer): Maximum number of workflows to return (default: 100)
- `category` (string): Filter by category
- `status` (string): Filter by status (draft, published, archived)

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "My Workflow",
    "description": "A sample workflow",
    "status": "draft",
    "is_public": false,
    "tags": ["automation", "ai"],
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

#### POST /workflows
Create a new workflow.

**Request Body:**
```json
{
  "name": "My Workflow",
  "description": "A sample workflow",
  "workflow_data": {
    "nodes": [
      {
        "id": "node-1",
        "type": "agent",
        "position": { "x": 100, "y": 100 },
        "data": {
          "agentType": "llm_text_generator",
          "config": {
            "temperature": 0.7,
            "max_tokens": 1000
          },
          "label": "Text Generator"
        }
      }
    ],
    "edges": []
  },
  "execution_config": {
    "timeout": 300,
    "retry_count": 3
  },
  "tags": ["automation", "ai"]
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "My Workflow",
  "description": "A sample workflow",
  "status": "draft",
  "is_public": false,
  "tags": ["automation", "ai"],
  "workflow_data": { ... },
  "execution_config": { ... },
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### GET /workflows/{workflow_id}
Get a specific workflow.

**Response:**
```json
{
  "id": "uuid",
  "name": "My Workflow",
  "description": "A sample workflow",
  "status": "draft",
  "is_public": false,
  "tags": ["automation", "ai"],
  "workflow_data": { ... },
  "execution_config": { ... },
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### PUT /workflows/{workflow_id}
Update a workflow.

**Request Body:**
```json
{
  "name": "Updated Workflow",
  "description": "Updated description",
  "workflow_data": { ... },
  "execution_config": { ... },
  "tags": ["updated", "tags"]
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Updated Workflow",
  "description": "Updated description",
  "status": "draft",
  "is_public": false,
  "tags": ["updated", "tags"],
  "workflow_data": { ... },
  "execution_config": { ... },
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### DELETE /workflows/{workflow_id}
Delete a workflow.

**Response:**
```json
{
  "message": "Workflow deleted successfully"
}
```

#### POST /workflows/{workflow_id}/execute
Execute a workflow.

**Request Body:**
```json
{
  "input_data": {
    "prompt": "Generate a creative story",
    "max_tokens": 500
  },
  "trigger_type": "manual"
}
```

**Response:**
```json
{
  "execution_id": "uuid",
  "status": "queued",
  "message": "Workflow execution started"
}
```

### Agents

#### GET /agents
List available agents.

**Query Parameters:**
- `category` (string): Filter by category (llm, tool, api, custom)
- `is_public` (boolean): Filter by public availability
- `search` (string): Search in name and description

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "llm_text_generator",
    "display_name": "LLM Text Generator",
    "description": "Generates text using large language models",
    "category": "llm",
    "icon_url": "https://example.com/icon.png",
    "config_schema": { ... },
    "input_schema": { ... },
    "output_schema": { ... },
    "is_builtin": true,
    "is_public": true,
    "downloads": 1500,
    "rating": 4.5,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### GET /agents/{agent_id}
Get a specific agent.

**Response:**
```json
{
  "id": "uuid",
  "name": "llm_text_generator",
  "display_name": "LLM Text Generator",
  "description": "Generates text using large language models",
  "category": "llm",
  "icon_url": "https://example.com/icon.png",
  "config_schema": { ... },
  "input_schema": { ... },
  "output_schema": { ... },
  "code_template": "class LLMTextGeneratorAgent: ...",
  "is_builtin": true,
  "is_public": true,
  "downloads": 1500,
  "rating": 4.5,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Executions

#### GET /executions
List workflow executions.

**Query Parameters:**
- `workflow_id` (string): Filter by workflow ID
- `status` (string): Filter by status (running, completed, failed, cancelled)
- `skip` (integer): Number of executions to skip
- `limit` (integer): Maximum number of executions to return

**Response:**
```json
[
  {
    "id": "uuid",
    "workflow_id": "uuid",
    "status": "completed",
    "trigger_type": "manual",
    "input_data": { ... },
    "output_data": { ... },
    "execution_time": 1500,
    "started_at": "2024-01-01T00:00:00Z",
    "completed_at": "2024-01-01T00:00:01Z"
  }
]
```

#### GET /executions/{execution_id}
Get a specific execution.

**Response:**
```json
{
  "id": "uuid",
  "workflow_id": "uuid",
  "status": "completed",
  "trigger_type": "manual",
  "input_data": { ... },
  "output_data": { ... },
  "execution_time": 1500,
  "started_at": "2024-01-01T00:00:00Z",
  "completed_at": "2024-01-01T00:00:01Z",
  "logs": [
    {
      "id": "uuid",
      "agent_id": "uuid",
      "agent_name": "LLM Text Generator",
      "step_index": 0,
      "status": "completed",
      "input_data": { ... },
      "output_data": { ... },
      "execution_time": 500,
      "started_at": "2024-01-01T00:00:00Z",
      "completed_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /executions/{execution_id}/cancel
Cancel a running execution.

**Response:**
```json
{
  "message": "Execution cancelled successfully"
}
```

### Templates

#### GET /templates
List workflow templates.

**Query Parameters:**
- `category` (string): Filter by category
- `difficulty` (string): Filter by difficulty (beginner, intermediate, advanced)
- `is_featured` (boolean): Filter by featured status

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Content Generation Pipeline",
    "description": "A complete content generation workflow",
    "category": "content",
    "difficulty": "intermediate",
    "workflow_data": { ... },
    "preview_image_url": "https://example.com/preview.png",
    "author_id": "uuid",
    "is_featured": true,
    "downloads": 500,
    "rating": 4.8,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### GET /templates/{template_id}
Get a specific template.

**Response:**
```json
{
  "id": "uuid",
  "name": "Content Generation Pipeline",
  "description": "A complete content generation workflow",
  "category": "content",
  "difficulty": "intermediate",
  "workflow_data": { ... },
  "preview_image_url": "https://example.com/preview.png",
  "author_id": "uuid",
  "is_featured": true,
  "downloads": 500,
  "rating": 4.8,
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### POST /templates/{template_id}/use
Create a workflow from a template.

**Request Body:**
```json
{
  "name": "My Content Pipeline",
  "description": "Customized content generation workflow"
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "My Content Pipeline",
  "description": "Customized content generation workflow",
  "status": "draft",
  "workflow_data": { ... },
  "created_at": "2024-01-01T00:00:00Z"
}
```

## WebSocket API

### Connection

Connect to the WebSocket endpoint for real-time updates:

```
wss://api.agentflow.com/ws/{workflow_id}
```

### Message Types

#### Cursor Update
```json
{
  "type": "cursor_update",
  "user_id": "uuid",
  "position": { "x": 100, "y": 200 },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

#### Node Update
```json
{
  "type": "node_update",
  "node_id": "node-1",
  "changes": { "position": { "x": 150, "y": 250 } },
  "user_id": "uuid",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

#### Execution Update
```json
{
  "type": "execution_update",
  "execution_id": "uuid",
  "workflow_id": "uuid",
  "update": {
    "node_id": "node-1",
    "status": "completed",
    "result": { ... }
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

#### Chat Message
```json
{
  "type": "chat_message",
  "user_id": "uuid",
  "message": "Hello team!",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Error Responses

All error responses follow this format:

```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

### Common Error Codes

- `INVALID_CREDENTIALS`: Authentication failed
- `WORKFLOW_NOT_FOUND`: Workflow does not exist
- `AGENT_NOT_FOUND`: Agent does not exist
- `EXECUTION_FAILED`: Workflow execution failed
- `VALIDATION_ERROR`: Request validation failed
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INSUFFICIENT_PERMISSIONS`: User lacks required permissions

## Rate Limiting

API requests are rate limited per user:

- **Authentication**: 10 requests per minute
- **Workflow Operations**: 100 requests per minute
- **Execution Operations**: 50 requests per minute
- **General API**: 1000 requests per hour

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Pagination

List endpoints support pagination using `skip` and `limit` parameters:

```
GET /workflows?skip=20&limit=10
```

Response includes pagination metadata:

```json
{
  "data": [...],
  "pagination": {
    "total": 100,
    "skip": 20,
    "limit": 10,
    "has_more": true
  }
}
```

## SDKs

Official SDKs are available for:

- **JavaScript/TypeScript**: `npm install @agentflow/sdk`
- **Python**: `pip install agentflow-sdk`
- **Go**: `go get github.com/agentflow/sdk-go`

## Support

For API support and questions:

- **Documentation**: https://docs.agentflow.com
- **GitHub Issues**: https://github.com/agentflow/agentflow/issues
- **Discord Community**: https://discord.gg/agentflow
- **Email Support**: support@agentflow.com
















