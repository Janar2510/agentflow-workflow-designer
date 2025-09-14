from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from datetime import datetime
import uuid

from app.models.template import WorkflowTemplate
from app.schemas.template import TemplateCreate

class TemplateService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def list_templates(
        self, 
        category: Optional[str] = None,
        difficulty: Optional[str] = None,
        featured: Optional[bool] = None,
        skip: int = 0, 
        limit: int = 100
    ) -> List[WorkflowTemplate]:
        """List workflow templates"""
        query = select(WorkflowTemplate)
        
        if category:
            query = query.where(WorkflowTemplate.category == category)
        
        if difficulty:
            query = query.where(WorkflowTemplate.difficulty == difficulty)
        
        if featured is not None:
            query = query.where(WorkflowTemplate.is_featured == featured)
        
        query = query.offset(skip).limit(limit).order_by(WorkflowTemplate.downloads.desc())
        
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def get_template(self, template_id: uuid.UUID) -> Optional[WorkflowTemplate]:
        """Get template by ID"""
        result = await self.db.execute(
            select(WorkflowTemplate).where(WorkflowTemplate.id == template_id)
        )
        return result.scalar_one_or_none()
    
    async def create_template(self, template_data: TemplateCreate, author_id: str) -> WorkflowTemplate:
        """Create a new template"""
        template = WorkflowTemplate(
            id=uuid.uuid4(),
            name=template_data.name,
            description=template_data.description,
            category=template_data.category,
            difficulty=template_data.difficulty,
            workflow_data=template_data.workflow_data,
            preview_image_url=template_data.preview_image_url,
            author_id=author_id,
            is_featured=template_data.is_featured or False
        )
        
        self.db.add(template)
        await self.db.commit()
        await self.db.refresh(template)
        
        return template








