from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, Dict, Any
import uuid
import logging

from app.core.database import get_db
from app.core.supabase import get_supabase
from app.services.auth_service import AuthService
from app.schemas.template import (
    WorkflowTemplateCreate,
    WorkflowTemplateUpdate,
    WorkflowTemplateResponse,
    WorkflowTemplateSearchRequest,
    WorkflowTemplateStatsResponse
)

router = APIRouter()
auth_service = AuthService()
logger = logging.getLogger(__name__)

@router.get("/", response_model=List[WorkflowTemplateResponse])
async def list_templates(
    category: Optional[str] = Query(None, description="Filter by template category"),
    difficulty: Optional[str] = Query(None, description="Filter by difficulty level"),
    search: Optional[str] = Query(None, description="Search templates by name or description"),
    is_featured: Optional[bool] = Query(None, description="Show only featured templates"),
    limit: int = Query(50, ge=1, le=100, description="Number of templates to return"),
    offset: int = Query(0, ge=0, description="Number of templates to skip"),
    sort_by: str = Query("rating", description="Sort by field"),
    sort_order: str = Query("desc", description="Sort order (asc/desc)"),
    current_user = Depends(auth_service.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List workflow templates with filtering and search"""
    
    try:
        supabase = get_supabase()
        
        # Build query
        query = supabase.client.table('workflow_templates').select('*')
        
        if category:
            query = query.eq('category', category)
        
        if difficulty:
            query = query.eq('difficulty', difficulty)
        
        if is_featured is not None:
            query = query.eq('is_featured', is_featured)
        
        if search:
            query = query.or_(f'name.ilike.%{search}%,description.ilike.%{search}%')
        
        # Apply sorting
        if sort_by in ['rating', 'downloads', 'created_at']:
            query = query.order(sort_by, desc=(sort_order == 'desc'))
        else:
            query = query.order('rating', desc=True)
        
        # Apply pagination
        query = query.range(offset, offset + limit - 1)
        
        response = query.execute()
        templates = response.data or []
        
        # Convert to response format
        return [
            WorkflowTemplateResponse(
                id=template['id'],
                name=template['name'],
                description=template['description'],
                category=template['category'],
                difficulty=template['difficulty'],
                workflow_data=template['workflow_data'],
                preview_image_url=template['preview_image_url'],
                author_id=template['author_id'],
                is_featured=template['is_featured'],
                downloads=template['downloads'],
                rating=template['rating'],
                created_at=template['created_at']
            )
            for template in templates
        ]
        
    except Exception as e:
        logger.error(f"Failed to list templates: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve templates")

@router.get("/{template_id}", response_model=WorkflowTemplateResponse)
async def get_template(
    template_id: str,
    current_user = Depends(auth_service.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get template by ID"""
    
    try:
        supabase = get_supabase()
        
        response = supabase.client.table('workflow_templates').select('*').eq('id', template_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Template not found")
        
        template = response.data[0]
        
        return WorkflowTemplateResponse(
            id=template['id'],
            name=template['name'],
            description=template['description'],
            category=template['category'],
            difficulty=template['difficulty'],
            workflow_data=template['workflow_data'],
            preview_image_url=template['preview_image_url'],
            author_id=template['author_id'],
            is_featured=template['is_featured'],
            downloads=template['downloads'],
            rating=template['rating'],
            created_at=template['created_at']
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get template: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve template")

@router.post("/", response_model=WorkflowTemplateResponse)
async def create_template(
    template_data: WorkflowTemplateCreate,
    current_user = Depends(auth_service.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new workflow template"""
    
    try:
        supabase = get_supabase()
        
        # Prepare template data
        template_dict = {
            'name': template_data.name,
            'description': template_data.description,
            'category': template_data.category,
            'difficulty': template_data.difficulty,
            'workflow_data': template_data.workflow_data,
            'preview_image_url': template_data.preview_image_url,
            'author_id': current_user.id,
            'is_featured': False
        }
        
        # Create template in Supabase
        response = supabase.client.table('workflow_templates').insert(template_dict).execute()
        
        if not response.data:
            raise HTTPException(status_code=400, detail="Failed to create template")
        
        template = response.data[0]
        
        return WorkflowTemplateResponse(
            id=template['id'],
            name=template['name'],
            description=template['description'],
            category=template['category'],
            difficulty=template['difficulty'],
            workflow_data=template['workflow_data'],
            preview_image_url=template['preview_image_url'],
            author_id=template['author_id'],
            is_featured=template['is_featured'],
            downloads=template['downloads'],
            rating=template['rating'],
            created_at=template['created_at']
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to create template: {e}")
        raise HTTPException(status_code=500, detail="Failed to create template")

@router.post("/{template_id}/use")
async def use_template(
    template_id: str,
    workflow_name: str,
    current_user = Depends(auth_service.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new workflow from template"""
    
    try:
        supabase = get_supabase()
        
        # Get template
        template_response = supabase.client.table('workflow_templates').select('*').eq('id', template_id).execute()
        
        if not template_response.data:
            raise HTTPException(status_code=404, detail="Template not found")
        
        template = template_response.data[0]
        
        # Create workflow from template
        workflow_data = {
            'name': workflow_name,
            'description': f"Created from template: {template['name']}",
            'workflow_data': template['workflow_data'],
            'execution_config': {},
            'user_id': current_user.id,
            'is_public': False
        }
        
        workflow_response = supabase.client.table('workflows').insert(workflow_data).execute()
        
        if not workflow_response.data:
            raise HTTPException(status_code=400, detail="Failed to create workflow from template")
        
        # Record template download
        supabase.client.table('workflow_templates').update({
            'downloads': template['downloads'] + 1
        }).eq('id', template_id).execute()
        
        return {
            "message": "Workflow created successfully from template",
            "workflow_id": workflow_response.data[0]['id']
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to use template: {e}")
        raise HTTPException(status_code=500, detail="Failed to create workflow from template")

