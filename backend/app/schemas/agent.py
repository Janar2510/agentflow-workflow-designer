from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
from uuid import UUID

class AgentBase(BaseModel):
    name: str
    display_name: str
    description: str
    category: str
    icon_url: Optional[str] = None
    config_schema: Dict[str, Any]
    input_schema: Dict[str, Any]
    output_schema: Dict[str, Any]
    code_template: Optional[str] = None

class AgentCreate(AgentBase):
    is_public: Optional[bool] = True

class AgentUpdate(BaseModel):
    display_name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    icon_url: Optional[str] = None
    config_schema: Optional[Dict[str, Any]] = None
    input_schema: Optional[Dict[str, Any]] = None
    output_schema: Optional[Dict[str, Any]] = None
    code_template: Optional[str] = None
    is_public: Optional[bool] = None

class AgentInDB(AgentBase):
    id: UUID
    is_builtin: bool
    is_public: bool
    author_id: Optional[UUID] = None
    downloads: int
    rating: float
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Agent(AgentInDB):
    pass

class AgentResponse(AgentInDB):
    """Agent response model for API endpoints"""
    pass

class AgentReviewBase(BaseModel):
    rating: int = Field(..., ge=1, le=5, description="Rating from 1 to 5")
    review_text: Optional[str] = Field(None, description="Review text")

class AgentReviewCreate(AgentReviewBase):
    pass

class AgentReviewUpdate(AgentReviewBase):
    pass

class AgentReviewInDB(AgentReviewBase):
    id: UUID
    agent_id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class AgentReviewResponse(AgentReviewInDB):
    username: Optional[str] = None
    avatar_url: Optional[str] = None

class AgentSearchRequest(BaseModel):
    search_text: Optional[str] = Field(None, description="Search text for name or description")
    categories: Optional[List[str]] = Field(None, description="Filter by categories")
    is_public: Optional[bool] = Field(None, description="Filter by public status")
    min_rating: Optional[float] = Field(None, ge=0, le=5, description="Minimum rating")
    sort_by: Optional[str] = Field("rating", description="Sort field")
    sort_order: Optional[str] = Field("desc", description="Sort order (asc/desc)")
    limit: Optional[int] = Field(20, ge=1, le=100, description="Number of results")
    offset: Optional[int] = Field(0, ge=0, description="Number of results to skip")

class AgentStatsResponse(BaseModel):
    agent_id: UUID
    downloads: int
    total_reviews: int
    average_rating: float
    rating_distribution: Dict[str, int]
    created_at: datetime
    last_updated: datetime







