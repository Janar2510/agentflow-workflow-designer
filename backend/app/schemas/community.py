from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID

# =============================================================================
# FORUM SCHEMAS
# =============================================================================

class ForumCategoryBase(BaseModel):
    name: str = Field(..., max_length=100)
    description: Optional[str] = None
    slug: str = Field(..., max_length=100)
    color: str = Field(default="#667eea", max_length=7)
    icon: str = Field(default="💬", max_length=10)
    sort_order: int = Field(default=0)
    is_active: bool = Field(default=True)

class ForumCategoryCreate(ForumCategoryBase):
    pass

class ForumCategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = None
    color: Optional[str] = Field(None, max_length=7)
    icon: Optional[str] = Field(None, max_length=10)
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None

class ForumCategory(ForumCategoryBase):
    id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True

class ForumPostBase(BaseModel):
    title: str = Field(..., max_length=200)
    content: str
    category_id: Optional[UUID] = None
    post_type: str = Field(default="discussion", max_length=20)
    tags: List[str] = Field(default_factory=list)
    status: str = Field(default="published", max_length=20)

class ForumPostCreate(ForumPostBase):
    pass

class ForumPostUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    content: Optional[str] = None
    category_id: Optional[UUID] = None
    post_type: Optional[str] = Field(None, max_length=20)
    tags: Optional[List[str]] = None
    status: Optional[str] = Field(None, max_length=20)
    is_pinned: Optional[bool] = None
    is_featured: Optional[bool] = None

class ForumPost(ForumPostBase):
    id: UUID
    author_id: UUID
    slug: str
    view_count: int
    reply_count: int
    like_count: int
    is_pinned: bool
    is_featured: bool
    last_activity_at: datetime
    created_at: datetime
    updated_at: datetime
    
    # Relationships
    author: Optional[Dict[str, Any]] = None
    category: Optional[ForumCategory] = None
    
    class Config:
        from_attributes = True

class ForumCommentBase(BaseModel):
    content: str
    parent_id: Optional[UUID] = None

class ForumCommentCreate(ForumCommentBase):
    pass

class ForumCommentUpdate(BaseModel):
    content: Optional[str] = None
    is_solution: Optional[bool] = None

class ForumComment(ForumCommentBase):
    id: UUID
    post_id: UUID
    author_id: UUID
    like_count: int
    is_solution: bool
    created_at: datetime
    updated_at: datetime
    
    # Relationships
    author: Optional[Dict[str, Any]] = None
    replies: Optional[List['ForumComment']] = None
    
    class Config:
        from_attributes = True

# =============================================================================
# REPUTATION SCHEMAS
# =============================================================================

class UserReputationBase(BaseModel):
    points: int = Field(default=0)
    level: str = Field(default="newbie", max_length=20)
    badges: List[str] = Field(default_factory=list)

class UserReputationUpdate(BaseModel):
    points: Optional[int] = None
    level: Optional[str] = Field(None, max_length=20)
    badges: Optional[List[str]] = None

class UserReputation(UserReputationBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class ReputationEventBase(BaseModel):
    event_type: str = Field(..., max_length=50)
    points: int
    description: Optional[str] = None
    related_id: Optional[UUID] = None

class ReputationEventCreate(ReputationEventBase):
    user_id: UUID

class ReputationEvent(ReputationEventBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True

# =============================================================================
# LEADERBOARD SCHEMAS
# =============================================================================

class CommunityLeaderboard(BaseModel):
    user_id: UUID
    username: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    reputation_points: int
    agents_created: int
    agents_sold: int
    posts_created: int
    comments_created: int
    total_likes_received: int
    rank_position: Optional[int] = None
    last_updated: datetime
    
    class Config:
        from_attributes = True

# =============================================================================
# BADGES SCHEMAS
# =============================================================================

class CommunityBadgeBase(BaseModel):
    name: str = Field(..., max_length=100)
    description: str
    icon: str = Field(..., max_length=10)
    color: str = Field(default="#667eea", max_length=7)
    criteria: Dict[str, Any]
    is_active: bool = Field(default=True)

class CommunityBadgeCreate(CommunityBadgeBase):
    pass

class CommunityBadgeUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = None
    icon: Optional[str] = Field(None, max_length=10)
    color: Optional[str] = Field(None, max_length=7)
    criteria: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None

class CommunityBadge(CommunityBadgeBase):
    id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserBadgeBase(BaseModel):
    badge_id: UUID

class UserBadgeCreate(UserBadgeBase):
    user_id: UUID

class UserBadge(UserBadgeBase):
    id: UUID
    user_id: UUID
    earned_at: datetime
    badge: Optional[CommunityBadge] = None
    
    class Config:
        from_attributes = True

# =============================================================================
# NOTIFICATIONS SCHEMAS
# =============================================================================

class CommunityNotificationBase(BaseModel):
    type: str = Field(..., max_length=50)
    title: str = Field(..., max_length=200)
    message: str
    related_id: Optional[UUID] = None

class CommunityNotificationCreate(CommunityNotificationBase):
    user_id: UUID

class CommunityNotificationUpdate(BaseModel):
    is_read: Optional[bool] = None

class CommunityNotification(CommunityNotificationBase):
    id: UUID
    user_id: UUID
    is_read: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# =============================================================================
# EVENTS SCHEMAS
# =============================================================================

class CommunityEventBase(BaseModel):
    title: str = Field(..., max_length=200)
    description: str
    event_type: str = Field(..., max_length=50)
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_featured: bool = Field(default=False)

class CommunityEventCreate(CommunityEventBase):
    created_by: UUID

class CommunityEventUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    event_type: Optional[str] = Field(None, max_length=50)
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_featured: Optional[bool] = None

class CommunityEvent(CommunityEventBase):
    id: UUID
    created_by: UUID
    created_at: datetime
    creator: Optional[Dict[str, Any]] = None
    
    class Config:
        from_attributes = True

# =============================================================================
# LIKES SCHEMAS
# =============================================================================

class PostLikeBase(BaseModel):
    post_id: UUID

class PostLikeCreate(PostLikeBase):
    user_id: UUID

class PostLike(PostLikeBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True

class CommentLikeBase(BaseModel):
    comment_id: UUID

class CommentLikeCreate(CommentLikeBase):
    user_id: UUID

class CommentLike(CommentLikeBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True

# =============================================================================
# RESPONSE SCHEMAS
# =============================================================================

class CommunityStats(BaseModel):
    posts_created: int
    comments_created: int
    likes_received: int
    reputation_points: int
    level: str
    badges_count: int

class ForumPostListResponse(BaseModel):
    posts: List[ForumPost]
    total: int
    page: int
    per_page: int
    total_pages: int

class ForumCommentListResponse(BaseModel):
    comments: List[ForumComment]
    total: int
    page: int
    per_page: int
    total_pages: int

class LeaderboardResponse(BaseModel):
    leaderboard: List[CommunityLeaderboard]
    total: int
    user_rank: Optional[int] = None

class NotificationListResponse(BaseModel):
    notifications: List[CommunityNotification]
    total: int
    unread_count: int
    page: int
    per_page: int
    total_pages: int

