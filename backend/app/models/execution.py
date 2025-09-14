from sqlalchemy import Column, String, DateTime, Integer, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
import uuid

class WorkflowExecution(Base):
    __tablename__ = "workflow_executions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workflow_id = Column(UUID(as_uuid=True), ForeignKey("workflows.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(20), default="running")  # running, completed, failed, cancelled
    trigger_type = Column(String(20), nullable=False)  # manual, schedule, webhook, api
    input_data = Column(JSONB, nullable=True)
    output_data = Column(JSONB, nullable=True)
    error_message = Column(Text, nullable=True)
    execution_time = Column(Integer, nullable=True)  # milliseconds
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    logs = Column(JSONB, default=[])  # Execution logs
    
    # Relationships
    workflow = relationship("Workflow", back_populates="executions")
    user = relationship("User")
    agent_logs = relationship("AgentLog", back_populates="execution", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<WorkflowExecution(id={self.id}, workflow_id={self.workflow_id}, status={self.status})>"

class AgentLog(Base):
    __tablename__ = "agent_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    execution_id = Column(UUID(as_uuid=True), ForeignKey("workflow_executions.id", ondelete="CASCADE"), nullable=False)
    agent_id = Column(UUID(as_uuid=True), ForeignKey("agents.id"), nullable=True)
    agent_name = Column(String(100), nullable=False)
    step_index = Column(Integer, nullable=False)
    status = Column(String(20), nullable=False)  # started, completed, failed, skipped
    input_data = Column(JSONB, nullable=True)
    output_data = Column(JSONB, nullable=True)
    error_message = Column(Text, nullable=True)
    execution_time = Column(Integer, nullable=True)  # milliseconds
    memory_usage = Column(Integer, nullable=True)  # bytes
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    debug_info = Column(JSONB, default={})
    
    # Relationships
    execution = relationship("WorkflowExecution", back_populates="agent_logs")
    agent = relationship("Agent")
    
    def __repr__(self):
        return f"<AgentLog(id={self.id}, execution_id={self.execution_id}, agent_name={self.agent_name}, status={self.status})>"








