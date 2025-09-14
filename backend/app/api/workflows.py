from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, WebSocket
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import uuid
import logging

from app.core.database import get_db
from app.services.auth_service import AuthService
from app.services.workflow_service import WorkflowService
from app.schemas.workflow import (
    WorkflowCreate,
    WorkflowUpdate,
    Workflow,
    WorkflowExecuteRequest,
    WorkflowExecuteResponse
)

router = APIRouter()
auth_service = AuthService()
logger = logging.getLogger(__name__)

@router.post("/", response_model=Workflow)
async def create_workflow(
    workflow_data: WorkflowCreate,
    current_user = Depends(auth_service.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new workflow"""
    service = WorkflowService(db)
    
    try:
        workflow = await service.create_workflow(
            user_id=current_user.id,
            workflow_data=workflow_data
        )
        return workflow
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[Workflow])
async def list_workflows(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    search: Optional[str] = None,
    current_user = Depends(auth_service.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List user's workflows"""
    service = WorkflowService(db)
    
    workflows = await service.list_user_workflows(
        user_id=current_user.id,
        skip=skip,
        limit=limit,
        category=category,
        search=search
    )
    return workflows

@router.get("/{workflow_id}", response_model=Workflow)
async def get_workflow(
    workflow_id: uuid.UUID,
    current_user = Depends(auth_service.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get workflow by ID"""
    service = WorkflowService(db)
    
    workflow = await service.get_workflow(
        workflow_id=workflow_id,
        user_id=current_user.id
    )
    
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    return workflow

@router.put("/{workflow_id}", response_model=Workflow)
async def update_workflow(
    workflow_id: uuid.UUID,
    workflow_data: WorkflowUpdate,
    current_user = Depends(auth_service.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update workflow"""
    service = WorkflowService(db)
    
    try:
        workflow = await service.update_workflow(
            workflow_id=workflow_id,
            user_id=current_user.id,
            workflow_data=workflow_data
        )
        return workflow
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{workflow_id}")
async def delete_workflow(
    workflow_id: uuid.UUID,
    current_user = Depends(auth_service.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete workflow"""
    service = WorkflowService(db)
    
    success = await service.delete_workflow(
        workflow_id=workflow_id,
        user_id=current_user.id
    )
    
    if not success:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    return {"message": "Workflow deleted successfully"}

@router.get("/{workflow_id}/executions")
async def list_workflow_executions(
    workflow_id: uuid.UUID,
    skip: int = 0,
    limit: int = 50,
    current_user = Depends(auth_service.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List executions for a workflow"""
    from app.models.execution import WorkflowExecution
    from sqlalchemy import select, desc
    
    result = await db.execute(
        select(WorkflowExecution)
        .where(WorkflowExecution.workflow_id == workflow_id)
        .where(WorkflowExecution.user_id == current_user.id)
        .order_by(desc(WorkflowExecution.created_at))
        .offset(skip)
        .limit(limit)
    )
    
    executions = result.scalars().all()
    
    return [
        {
            "id": str(execution.id),
            "status": execution.status,
            "trigger_type": execution.trigger_type,
            "created_at": execution.created_at.isoformat(),
            "completed_at": execution.completed_at.isoformat() if execution.completed_at else None,
            "error_message": execution.error_message
        }
        for execution in executions
    ]

@router.get("/executions/{execution_id}")
async def get_execution_status(
    execution_id: uuid.UUID,
    current_user = Depends(auth_service.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get execution status and details"""
    from app.models.execution import WorkflowExecution
    from sqlalchemy import select
    
    result = await db.execute(
        select(WorkflowExecution)
        .where(WorkflowExecution.id == execution_id)
        .where(WorkflowExecution.user_id == current_user.id)
    )
    
    execution = result.scalar_one_or_none()
    
    if not execution:
        raise HTTPException(status_code=404, detail="Execution not found")
    
    return {
        "id": str(execution.id),
        "workflow_id": str(execution.workflow_id),
        "status": execution.status,
        "trigger_type": execution.trigger_type,
        "input_data": execution.input_data,
        "output_data": execution.output_data,
        "error_message": execution.error_message,
        "created_at": execution.created_at.isoformat(),
        "completed_at": execution.completed_at.isoformat() if execution.completed_at else None,
        "logs": execution.logs or []
    }

@router.post("/executions/{execution_id}/cancel")
async def cancel_execution(
    execution_id: uuid.UUID,
    current_user = Depends(auth_service.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Cancel a running execution"""
    from app.models.execution import WorkflowExecution
    from sqlalchemy import select, update
    from datetime import datetime
    
    # Check if execution exists and belongs to user
    result = await db.execute(
        select(WorkflowExecution)
        .where(WorkflowExecution.id == execution_id)
        .where(WorkflowExecution.user_id == current_user.id)
    )
    
    execution = result.scalar_one_or_none()
    
    if not execution:
        raise HTTPException(status_code=404, detail="Execution not found")
    
    if execution.status not in ["running", "queued"]:
        raise HTTPException(status_code=400, detail="Execution cannot be cancelled")
    
    # Update status to cancelled
    await db.execute(
        update(WorkflowExecution)
        .where(WorkflowExecution.id == execution_id)
        .values(
            status="cancelled",
            completed_at=datetime.utcnow()
        )
    )
    await db.commit()
    
    return {"message": "Execution cancelled successfully"}

@router.get("/{workflow_id}/logs")
async def get_workflow_logs(
    workflow_id: uuid.UUID,
    execution_id: Optional[uuid.UUID] = None,
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(auth_service.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get workflow execution logs"""
    from app.models.execution import WorkflowExecution
    from sqlalchemy import select, desc
    
    query = select(WorkflowExecution).where(WorkflowExecution.workflow_id == workflow_id)
    query = query.where(WorkflowExecution.user_id == current_user.id)
    
    if execution_id:
        query = query.where(WorkflowExecution.id == execution_id)
    
    result = await db.execute(
        query.order_by(desc(WorkflowExecution.created_at))
        .offset(skip)
        .limit(limit)
    )
    
    executions = result.scalars().all()
    
    logs = []
    for execution in executions:
        if execution.logs:
            for log in execution.logs:
                logs.append({
                    "execution_id": str(execution.id),
                    "timestamp": log.get("timestamp"),
                    "level": log.get("level"),
                    "message": log.get("message"),
                    "node_id": log.get("node_id"),
                    "data": log.get("data")
                })
    
    return logs

@router.post("/{workflow_id}/validate")
async def validate_workflow(
    workflow_id: uuid.UUID,
    current_user = Depends(auth_service.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Validate workflow structure and configuration"""
    from app.services.workflow_validator import WorkflowValidator
    from app.services.workflow_service import WorkflowService
    
    # Get workflow
    service = WorkflowService(db)
    workflow = await service.get_workflow(workflow_id, current_user.id)
    
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    # Validate workflow
    validator = WorkflowValidator()
    validation_result = await validator.validate_workflow(workflow.workflow_data)
    
    return validation_result

@router.post("/validate")
async def validate_workflow_data(
    workflow_data: dict,
    current_user = Depends(auth_service.get_current_user)
):
    """Validate workflow data without saving"""
    from app.services.workflow_validator import WorkflowValidator
    
    validator = WorkflowValidator()
    validation_result = await validator.validate_workflow(workflow_data)
    
    return validation_result

@router.websocket("/{workflow_id}/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    workflow_id: str,
    token: str = None
):
    """WebSocket endpoint for real-time workflow collaboration and monitoring"""
    from app.services.websocket_manager import ConnectionManager
    from app.services.auth_service import AuthService
    
    # Initialize connection manager (in production, this would be a singleton)
    manager = ConnectionManager()
    
    # Authenticate user (simplified - in production, validate JWT token)
    user_id = None
    if token:
        try:
            # In production, decode and validate JWT token
            # For now, we'll use a simple approach
            auth_service = AuthService()
            # user_id = auth_service.verify_token(token)
            user_id = "user_123"  # Placeholder
        except Exception as e:
            logger.error(f"WebSocket authentication failed: {e}")
            await websocket.close(code=1008, reason="Authentication failed")
            return
    
    # Connect to workflow
    await manager.connect(websocket, workflow_id, user_id)
    
    try:
        while True:
            # Receive message
            data = await websocket.receive_json()
            
            # Handle message
            await manager.handle_message(workflow_id, data)
            
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        # Disconnect
        manager.disconnect(websocket, workflow_id)

@router.post("/{workflow_id}/execute", response_model=WorkflowExecuteResponse)
async def execute_workflow(
    workflow_id: uuid.UUID,
    execute_request: WorkflowExecuteRequest,
    background_tasks: BackgroundTasks,
    current_user = Depends(auth_service.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Execute workflow"""
    service = WorkflowService(db)
    
    # Get workflow
    workflow = await service.get_workflow(workflow_id, current_user.id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    # Create execution record
    execution = await service.create_execution(
        workflow_id=workflow_id,
        user_id=current_user.id,
        input_data=execute_request.input_data,
        trigger_type="manual"
    )
    
    # Queue execution
    background_tasks.add_task(
        _execute_workflow_background,
        execution.id,
        workflow.workflow_data,
        execute_request.input_data
    )
    
    return WorkflowExecuteResponse(
        execution_id=execution.id,
        status="queued",
        message="Workflow execution queued"
    )

async def _execute_workflow_background(
    execution_id: uuid.UUID,
    workflow_data: dict,
    input_data: dict
):
    """Background task to execute workflow"""
    from app.services.execution_engine import ExecutionEngine
    from app.core.database import get_db
    
    execution_engine = ExecutionEngine()
    
    try:
        # Start execution engine
        await execution_engine.start()
        
        # Get execution details from database
        async with get_db() as db:
            from app.models.execution import WorkflowExecution
            from sqlalchemy import select
            
            result = await db.execute(
                select(WorkflowExecution)
                .where(WorkflowExecution.id == execution_id)
            )
            execution = result.scalar_one_or_none()
            
            if not execution:
                logger.error(f"Execution {execution_id} not found")
                return
            
            # Execute workflow
            await execution_engine.execute_workflow(
                execution_id=execution_id,
                workflow_data=workflow_data,
                input_data=input_data,
                user_id=execution.user_id,
                workflow_id=execution.workflow_id
            )
            
    except Exception as e:
        logger.error(f"Background execution failed: {e}", exc_info=True)
        
        # Update execution status to failed
        async with get_db() as db:
            from app.models.execution import WorkflowExecution
            from sqlalchemy import update
            from datetime import datetime
            
            await db.execute(
                update(WorkflowExecution)
                .where(WorkflowExecution.id == execution_id)
                .values(
                    status="failed",
                    completed_at=datetime.utcnow(),
                    error_message=str(e)
                )
            )
            await db.commit()
    
    finally:
        # Stop execution engine
        await execution_engine.stop()







