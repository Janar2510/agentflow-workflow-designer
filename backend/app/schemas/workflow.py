from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID

class WorkflowNode(BaseModel):
    id: str
    type: str
    position: Dict[str, float]
    data: Dict[str, Any]

class WorkflowEdge(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None
    type: Optional[str] = "default"
    animated: Optional[bool] = True
    style: Optional[Dict[str, Any]] = None

class WorkflowData(BaseModel):
    nodes: List[WorkflowNode]
    edges: List[WorkflowEdge]
    viewport: Optional[Dict[str, Any]] = None

class ExecutionConfig(BaseModel):
    timeout: Optional[int] = 3600
    retries: Optional[int] = 3
    parallel: Optional[bool] = False
    variables: Optional[Dict[str, Any]] = {}

class WorkflowBase(BaseModel):
    name: str
    description: Optional[str] = None
    tags: Optional[List[str]] = []
    is_public: Optional[bool] = False

class WorkflowCreate(WorkflowBase):
    workflow_data: WorkflowData
    execution_config: Optional[ExecutionConfig] = ExecutionConfig()

class WorkflowUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None
    workflow_data: Optional[WorkflowData] = None
    execution_config: Optional[ExecutionConfig] = None
    is_public: Optional[bool] = None
    status: Optional[str] = None

class WorkflowInDB(WorkflowBase):
    id: UUID
    user_id: UUID
    version: int
    status: str
    workflow_data: WorkflowData
    execution_config: ExecutionConfig
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Workflow(WorkflowInDB):
    pass

class WorkflowExecuteRequest(BaseModel):
    input_data: Optional[Dict[str, Any]] = {}

class WorkflowExecuteResponse(BaseModel):
    execution_id: UUID
    status: str
    message: Optional[str] = None








