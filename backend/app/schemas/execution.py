from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID

class WorkflowExecutionBase(BaseModel):
    workflow_id: UUID
    user_id: UUID
    status: str
    trigger_type: str
    input_data: Optional[Dict[str, Any]] = None
    output_data: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None
    execution_time: Optional[int] = None

class WorkflowExecutionInDB(WorkflowExecutionBase):
    id: UUID
    started_at: datetime
    completed_at: Optional[datetime] = None
    logs: List[Dict[str, Any]] = []

    class Config:
        from_attributes = True

class WorkflowExecution(WorkflowExecutionInDB):
    pass

class AgentLogBase(BaseModel):
    execution_id: UUID
    agent_id: Optional[UUID] = None
    agent_name: str
    step_index: int
    status: str
    input_data: Optional[Dict[str, Any]] = None
    output_data: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None
    execution_time: Optional[int] = None
    memory_usage: Optional[int] = None

class AgentLogInDB(AgentLogBase):
    id: UUID
    started_at: datetime
    completed_at: Optional[datetime] = None
    debug_info: Dict[str, Any] = {}

    class Config:
        from_attributes = True

class AgentLog(AgentLogInDB):
    pass








