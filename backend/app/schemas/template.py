from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
from uuid import UUID

class WorkflowTemplateBase(BaseModel):
    name: str
    description: str
    category: str
    difficulty: str
    workflow_data: Dict[str, Any]
    preview_image_url: Optional[str] = None

class TemplateCreate(WorkflowTemplateBase):
    is_featured: Optional[bool] = False

class WorkflowTemplateInDB(WorkflowTemplateBase):
    id: UUID
    author_id: Optional[UUID] = None
    is_featured: bool
    downloads: int
    rating: float
    created_at: datetime

    class Config:
        from_attributes = True

class WorkflowTemplate(WorkflowTemplateInDB):
    pass

class WorkflowTemplateCreate(WorkflowTemplateBase):
    """Schema for creating a new workflow template"""
    pass

class WorkflowTemplateUpdate(BaseModel):
    """Schema for updating a workflow template"""
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    difficulty: Optional[str] = None
    workflow_data: Optional[Dict[str, Any]] = None
    preview_image_url: Optional[str] = None
    is_featured: Optional[bool] = None

class WorkflowTemplateResponse(WorkflowTemplateInDB):
    """Response schema for workflow template API endpoints"""
    pass

class WorkflowTemplateSearchRequest(BaseModel):
    """Schema for advanced template search"""
    search_text: Optional[str] = Field(None, description="Search text for name or description")
    categories: Optional[List[str]] = Field(None, description="Filter by categories")
    difficulties: Optional[List[str]] = Field(None, description="Filter by difficulty levels")
    is_featured: Optional[bool] = Field(None, description="Filter by featured status")
    min_rating: Optional[float] = Field(None, ge=0, le=5, description="Minimum rating")
    sort_by: Optional[str] = Field("rating", description="Sort field")
    sort_order: Optional[str] = Field("desc", description="Sort order (asc/desc)")
    limit: Optional[int] = Field(20, ge=1, le=100, description="Number of results")
    offset: Optional[int] = Field(0, ge=0, description="Number of results to skip")

class WorkflowTemplateStatsResponse(BaseModel):
    """Schema for template statistics"""
    template_id: UUID
    downloads: int
    rating: float
    created_at: datetime
    last_updated: datetime







