from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import uuid

from app.core.database import get_db
from app.services.auth_service import AuthService
from app.services.execution_service import ExecutionService
from app.schemas.execution import WorkflowExecution, AgentLog

router = APIRouter()
auth_service = AuthService()

@router.get("/{execution_id}", response_model=WorkflowExecution)
async def get_execution(
    execution_id: uuid.UUID,
    current_user = Depends(auth_service.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get execution by ID"""
    service = ExecutionService(db)
    
    execution = await service.get_execution(
        execution_id=execution_id,
        user_id=current_user.id
    )
    
    if not execution:
        raise HTTPException(status_code=404, detail="Execution not found")
    
    return execution

@router.get("/", response_model=List[WorkflowExecution])
async def list_executions(
    workflow_id: Optional[uuid.UUID] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(auth_service.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List user's executions"""
    service = ExecutionService(db)
    
    executions = await service.list_executions(
        user_id=current_user.id,
        workflow_id=workflow_id,
        status=status,
        skip=skip,
        limit=limit
    )
    return executions

@router.post("/{execution_id}/cancel")
async def cancel_execution(
    execution_id: uuid.UUID,
    current_user = Depends(auth_service.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Cancel running execution"""
    service = ExecutionService(db)
    
    success = await service.cancel_execution(
        execution_id=execution_id,
        user_id=current_user.id
    )
    
    if not success:
        raise HTTPException(status_code=404, detail="Execution not found")
    
    return {"message": "Execution cancelled successfully"}

@router.get("/{execution_id}/logs", response_model=List[AgentLog])
async def get_execution_logs(
    execution_id: uuid.UUID,
    current_user = Depends(auth_service.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get execution logs"""
    service = ExecutionService(db)
    
    logs = await service.get_execution_logs(
        execution_id=execution_id,
        user_id=current_user.id
    )
    
    return logs
















