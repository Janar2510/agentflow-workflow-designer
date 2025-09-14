from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from sqlalchemy.orm import selectinload
from typing import List, Optional
from datetime import datetime
import uuid

from app.models.workflow import Workflow
from app.models.execution import WorkflowExecution
from app.schemas.workflow import WorkflowCreate, WorkflowUpdate, WorkflowExecuteRequest

class WorkflowService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create_workflow(self, user_id: str, workflow_data: WorkflowCreate) -> Workflow:
        """Create a new workflow"""
        workflow = Workflow(
            id=uuid.uuid4(),
            user_id=user_id,
            name=workflow_data.name,
            description=workflow_data.description,
            tags=workflow_data.tags or [],
            is_public=workflow_data.is_public or False,
            workflow_data=workflow_data.workflow_data.dict(),
            execution_config=workflow_data.execution_config.dict() if workflow_data.execution_config else {}
        )
        
        self.db.add(workflow)
        await self.db.commit()
        await self.db.refresh(workflow)
        
        return workflow
    
    async def get_workflow(self, workflow_id: uuid.UUID, user_id: str) -> Optional[Workflow]:
        """Get workflow by ID"""
        result = await self.db.execute(
            select(Workflow)
            .where(Workflow.id == workflow_id)
            .where(Workflow.user_id == user_id)
        )
        return result.scalar_one_or_none()
    
    async def list_user_workflows(
        self, 
        user_id: str, 
        skip: int = 0, 
        limit: int = 100,
        category: Optional[str] = None,
        search: Optional[str] = None
    ) -> List[Workflow]:
        """List user's workflows"""
        query = select(Workflow).where(Workflow.user_id == user_id)
        
        if category:
            query = query.where(Workflow.tags.contains([category]))
        
        if search:
            query = query.where(
                Workflow.name.ilike(f"%{search}%") | 
                Workflow.description.ilike(f"%{search}%")
            )
        
        query = query.offset(skip).limit(limit).order_by(Workflow.updated_at.desc())
        
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def update_workflow(
        self, 
        workflow_id: uuid.UUID, 
        user_id: str, 
        workflow_data: WorkflowUpdate
    ) -> Optional[Workflow]:
        """Update workflow"""
        update_data = workflow_data.dict(exclude_unset=True)
        
        if not update_data:
            return await self.get_workflow(workflow_id, user_id)
        
        update_data["updated_at"] = datetime.utcnow()
        
        # Convert Pydantic models to dicts
        if "workflow_data" in update_data:
            update_data["workflow_data"] = update_data["workflow_data"].dict()
        if "execution_config" in update_data:
            update_data["execution_config"] = update_data["execution_config"].dict()
        
        await self.db.execute(
            update(Workflow)
            .where(Workflow.id == workflow_id)
            .where(Workflow.user_id == user_id)
            .values(**update_data)
        )
        await self.db.commit()
        
        return await self.get_workflow(workflow_id, user_id)
    
    async def delete_workflow(self, workflow_id: uuid.UUID, user_id: str) -> bool:
        """Delete workflow"""
        result = await self.db.execute(
            delete(Workflow)
            .where(Workflow.id == workflow_id)
            .where(Workflow.user_id == user_id)
        )
        await self.db.commit()
        
        return result.rowcount > 0
    
    async def create_execution(
        self, 
        workflow_id: uuid.UUID, 
        user_id: str, 
        input_data: dict, 
        trigger_type: str
    ) -> WorkflowExecution:
        """Create workflow execution record"""
        execution = WorkflowExecution(
            id=uuid.uuid4(),
            workflow_id=workflow_id,
            user_id=user_id,
            trigger_type=trigger_type,
            input_data=input_data,
            status="running"
        )
        
        self.db.add(execution)
        await self.db.commit()
        await self.db.refresh(execution)
        
        return execution
