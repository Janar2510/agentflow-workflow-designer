from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from sqlalchemy.orm import selectinload
from typing import List, Optional
from datetime import datetime
import uuid

from app.models.execution import WorkflowExecution, AgentLog

class ExecutionService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_execution(self, execution_id: uuid.UUID, user_id: str) -> Optional[WorkflowExecution]:
        """Get execution by ID"""
        result = await self.db.execute(
            select(WorkflowExecution)
            .where(WorkflowExecution.id == execution_id)
            .where(WorkflowExecution.user_id == user_id)
        )
        return result.scalar_one_or_none()
    
    async def list_executions(
        self, 
        user_id: str,
        workflow_id: Optional[uuid.UUID] = None,
        status: Optional[str] = None,
        skip: int = 0, 
        limit: int = 100
    ) -> List[WorkflowExecution]:
        """List user's executions"""
        query = select(WorkflowExecution).where(WorkflowExecution.user_id == user_id)
        
        if workflow_id:
            query = query.where(WorkflowExecution.workflow_id == workflow_id)
        
        if status:
            query = query.where(WorkflowExecution.status == status)
        
        query = query.offset(skip).limit(limit).order_by(WorkflowExecution.started_at.desc())
        
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def cancel_execution(self, execution_id: uuid.UUID, user_id: str) -> bool:
        """Cancel running execution"""
        result = await self.db.execute(
            update(WorkflowExecution)
            .where(WorkflowExecution.id == execution_id)
            .where(WorkflowExecution.user_id == user_id)
            .where(WorkflowExecution.status == "running")
            .values(
                status="cancelled",
                completed_at=datetime.utcnow()
            )
        )
        await self.db.commit()
        
        return result.rowcount > 0
    
    async def get_execution_logs(self, execution_id: uuid.UUID, user_id: str) -> List[AgentLog]:
        """Get execution logs"""
        # First verify the execution belongs to the user
        execution = await self.get_execution(execution_id, user_id)
        if not execution:
            return []
        
        result = await self.db.execute(
            select(AgentLog)
            .where(AgentLog.execution_id == execution_id)
            .order_by(AgentLog.step_index, AgentLog.started_at)
        )
        return result.scalars().all()
















