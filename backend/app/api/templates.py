from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import uuid

from app.core.database import get_db
from app.services.auth_service import AuthService
from app.services.template_service import TemplateService
from app.schemas.template import WorkflowTemplate, TemplateCreate

router = APIRouter()
auth_service = AuthService()

@router.get("/", response_model=List[WorkflowTemplate])
async def list_templates(
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    featured: Optional[bool] = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    """List workflow templates"""
    service = TemplateService(db)
    
    templates = await service.list_templates(
        category=category,
        difficulty=difficulty,
        featured=featured,
        skip=skip,
        limit=limit
    )
    return templates

@router.get("/{template_id}", response_model=WorkflowTemplate)
async def get_template(
    template_id: uuid.UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get template by ID"""
    service = TemplateService(db)
    
    template = await service.get_template(template_id)
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    return template

@router.post("/", response_model=WorkflowTemplate)
async def create_template(
    template_data: TemplateCreate,
    current_user = Depends(auth_service.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new template"""
    service = TemplateService(db)
    
    try:
        template = await service.create_template(
            template_data=template_data,
            author_id=current_user.id
        )
        return template
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))







