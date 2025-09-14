from fastapi import APIRouter, Depends, HTTPException, Query, Path
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, asc, and_, or_
from sqlalchemy.orm import selectinload, joinedload
from typing import List, Optional
from uuid import UUID
import math

from app.core.database import get_db
from app.models.community import (
    ForumCategory, ForumPost, ForumComment, PostLike, CommentLike,
    UserReputation, ReputationEvent, CommunityLeaderboard,
    CommunityBadge, UserBadge, CommunityNotification, CommunityEvent
)
from app.schemas.community import (
    ForumCategory as ForumCategorySchema,
    ForumCategoryCreate, ForumCategoryUpdate,
    ForumPost as ForumPostSchema,
    ForumPostCreate, ForumPostUpdate,
    ForumComment as ForumCommentSchema,
    ForumCommentCreate, ForumCommentUpdate,
    UserReputation as UserReputationSchema,
    ReputationEventCreate,
    CommunityLeaderboard as CommunityLeaderboardSchema,
    CommunityBadge as CommunityBadgeSchema,
    CommunityBadgeCreate, CommunityBadgeUpdate,
    UserBadge as UserBadgeSchema,
    UserBadgeCreate,
    CommunityNotification as CommunityNotificationSchema,
    CommunityNotificationCreate, CommunityNotificationUpdate,
    CommunityEvent as CommunityEventSchema,
    CommunityEventCreate, CommunityEventUpdate,
    CommunityStats, ForumPostListResponse, ForumCommentListResponse,
    LeaderboardResponse, NotificationListResponse
)
from app.models.user import User

router = APIRouter(prefix="/community", tags=["community"])

# =============================================================================
# FORUM CATEGORIES
# =============================================================================

@router.get("/categories", response_model=List[ForumCategorySchema])
async def get_forum_categories(
    db: AsyncSession = Depends(get_db)
):
    """Get all active forum categories"""
    result = await db.execute(
        select(ForumCategory)
        .where(ForumCategory.is_active == True)
        .order_by(ForumCategory.sort_order, ForumCategory.name)
    )
    return result.scalars().all()

@router.post("/categories", response_model=ForumCategorySchema)
async def create_forum_category(
    category: ForumCategoryCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new forum category (admin only)"""
    # TODO: Add admin authentication check
    db_category = ForumCategory(**category.dict())
    db.add(db_category)
    await db.commit()
    await db.refresh(db_category)
    return db_category

@router.put("/categories/{category_id}", response_model=ForumCategorySchema)
async def update_forum_category(
    category_id: UUID,
    category: ForumCategoryUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update a forum category (admin only)"""
    # TODO: Add admin authentication check
    result = await db.execute(
        select(ForumCategory).where(ForumCategory.id == category_id)
    )
    db_category = result.scalar_one_or_none()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    for field, value in category.dict(exclude_unset=True).items():
        setattr(db_category, field, value)
    
    await db.commit()
    await db.refresh(db_category)
    return db_category

# =============================================================================
# FORUM POSTS
# =============================================================================

@router.get("/posts", response_model=ForumPostListResponse)
async def get_forum_posts(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    category_id: Optional[UUID] = None,
    post_type: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: str = Query("last_activity", regex="^(created_at|last_activity|like_count|reply_count)$"),
    sort_order: str = Query("desc", regex="^(asc|desc)$"),
    db: AsyncSession = Depends(get_db)
):
    """Get forum posts with filtering and pagination"""
    query = select(ForumPost).where(ForumPost.status == "published")
    
    # Apply filters
    if category_id:
        query = query.where(ForumPost.category_id == category_id)
    if post_type:
        query = query.where(ForumPost.post_type == post_type)
    if search:
        query = query.where(
            or_(
                ForumPost.title.ilike(f"%{search}%"),
                ForumPost.content.ilike(f"%{search}%")
            )
        )
    
    # Apply sorting
    sort_column = getattr(ForumPost, sort_by)
    if sort_order == "desc":
        query = query.order_by(desc(sort_column))
    else:
        query = query.order_by(asc(sort_column))
    
    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Apply pagination
    offset = (page - 1) * per_page
    query = query.offset(offset).limit(per_page)
    
    # Load relationships
    query = query.options(
        joinedload(ForumPost.author),
        joinedload(ForumPost.category)
    )
    
    result = await db.execute(query)
    posts = result.scalars().all()
    
    total_pages = math.ceil(total / per_page)
    
    return ForumPostListResponse(
        posts=posts,
        total=total,
        page=page,
        per_page=per_page,
        total_pages=total_pages
    )

@router.get("/posts/{post_id}", response_model=ForumPostSchema)
async def get_forum_post(
    post_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific forum post"""
    result = await db.execute(
        select(ForumPost)
        .where(ForumPost.id == post_id)
        .options(
            joinedload(ForumPost.author),
            joinedload(ForumPost.category)
        )
    )
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Increment view count
    post.view_count += 1
    await db.commit()
    
    return post

@router.post("/posts", response_model=ForumPostSchema)
async def create_forum_post(
    post: ForumPostCreate,
    author_id: UUID,  # TODO: Get from authentication
    db: AsyncSession = Depends(get_db)
):
    """Create a new forum post"""
    # Generate slug from title
    slug = post.title.lower().replace(" ", "-").replace("_", "-")
    
    db_post = ForumPost(
        **post.dict(),
        author_id=author_id,
        slug=slug
    )
    db.add(db_post)
    await db.commit()
    await db.refresh(db_post)
    
    # Create reputation event
    reputation_event = ReputationEvent(
        user_id=author_id,
        event_type="post_created",
        points=10,
        description="Created a forum post",
        related_id=db_post.id
    )
    db.add(reputation_event)
    await db.commit()
    
    return db_post

@router.put("/posts/{post_id}", response_model=ForumPostSchema)
async def update_forum_post(
    post_id: UUID,
    post: ForumPostUpdate,
    user_id: UUID,  # TODO: Get from authentication
    db: AsyncSession = Depends(get_db)
):
    """Update a forum post"""
    result = await db.execute(
        select(ForumPost).where(ForumPost.id == post_id)
    )
    db_post = result.scalar_one_or_none()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    if db_post.author_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this post")
    
    for field, value in post.dict(exclude_unset=True).items():
        setattr(db_post, field, value)
    
    await db.commit()
    await db.refresh(db_post)
    return db_post

@router.delete("/posts/{post_id}")
async def delete_forum_post(
    post_id: UUID,
    user_id: UUID,  # TODO: Get from authentication
    db: AsyncSession = Depends(get_db)
):
    """Delete a forum post"""
    result = await db.execute(
        select(ForumPost).where(ForumPost.id == post_id)
    )
    db_post = result.scalar_one_or_none()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    if db_post.author_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this post")
    
    await db.delete(db_post)
    await db.commit()
    return {"message": "Post deleted successfully"}

# =============================================================================
# FORUM COMMENTS
# =============================================================================

@router.get("/posts/{post_id}/comments", response_model=ForumCommentListResponse)
async def get_forum_comments(
    post_id: UUID,
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Get comments for a forum post"""
    query = select(ForumComment).where(ForumComment.post_id == post_id)
    
    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Apply pagination
    offset = (page - 1) * per_page
    query = query.offset(offset).limit(per_page)
    
    # Load relationships
    query = query.options(
        joinedload(ForumComment.author),
        joinedload(ForumComment.replies)
    )
    
    result = await db.execute(query)
    comments = result.scalars().all()
    
    total_pages = math.ceil(total / per_page)
    
    return ForumCommentListResponse(
        comments=comments,
        total=total,
        page=page,
        per_page=per_page,
        total_pages=total_pages
    )

@router.post("/posts/{post_id}/comments", response_model=ForumCommentSchema)
async def create_forum_comment(
    post_id: UUID,
    comment: ForumCommentCreate,
    author_id: UUID,  # TODO: Get from authentication
    db: AsyncSession = Depends(get_db)
):
    """Create a comment on a forum post"""
    db_comment = ForumComment(
        **comment.dict(),
        post_id=post_id,
        author_id=author_id
    )
    db.add(db_comment)
    await db.commit()
    await db.refresh(db_comment)
    
    # Create reputation event
    reputation_event = ReputationEvent(
        user_id=author_id,
        event_type="comment_created",
        points=5,
        description="Created a forum comment",
        related_id=db_comment.id
    )
    db.add(reputation_event)
    await db.commit()
    
    return db_comment

@router.put("/comments/{comment_id}", response_model=ForumCommentSchema)
async def update_forum_comment(
    comment_id: UUID,
    comment: ForumCommentUpdate,
    user_id: UUID,  # TODO: Get from authentication
    db: AsyncSession = Depends(get_db)
):
    """Update a forum comment"""
    result = await db.execute(
        select(ForumComment).where(ForumComment.id == comment_id)
    )
    db_comment = result.scalar_one_or_none()
    if not db_comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    if db_comment.author_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this comment")
    
    for field, value in comment.dict(exclude_unset=True).items():
        setattr(db_comment, field, value)
    
    await db.commit()
    await db.refresh(db_comment)
    return db_comment

@router.delete("/comments/{comment_id}")
async def delete_forum_comment(
    comment_id: UUID,
    user_id: UUID,  # TODO: Get from authentication
    db: AsyncSession = Depends(get_db)
):
    """Delete a forum comment"""
    result = await db.execute(
        select(ForumComment).where(ForumComment.id == comment_id)
    )
    db_comment = result.scalar_one_or_none()
    if not db_comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    if db_comment.author_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this comment")
    
    await db.delete(db_comment)
    await db.commit()
    return {"message": "Comment deleted successfully"}

# =============================================================================
# LIKES
# =============================================================================

@router.post("/posts/{post_id}/like")
async def like_post(
    post_id: UUID,
    user_id: UUID,  # TODO: Get from authentication
    db: AsyncSession = Depends(get_db)
):
    """Like/unlike a forum post"""
    # Check if like already exists
    result = await db.execute(
        select(PostLike).where(
            and_(PostLike.post_id == post_id, PostLike.user_id == user_id)
        )
    )
    existing_like = result.scalar_one_or_none()
    
    if existing_like:
        # Unlike
        await db.delete(existing_like)
        action = "unliked"
    else:
        # Like
        like = PostLike(post_id=post_id, user_id=user_id)
        db.add(like)
        action = "liked"
    
    await db.commit()
    return {"action": action}

@router.post("/comments/{comment_id}/like")
async def like_comment(
    comment_id: UUID,
    user_id: UUID,  # TODO: Get from authentication
    db: AsyncSession = Depends(get_db)
):
    """Like/unlike a forum comment"""
    # Check if like already exists
    result = await db.execute(
        select(CommentLike).where(
            and_(CommentLike.comment_id == comment_id, CommentLike.user_id == user_id)
        )
    )
    existing_like = result.scalar_one_or_none()
    
    if existing_like:
        # Unlike
        await db.delete(existing_like)
        action = "unliked"
    else:
        # Like
        like = CommentLike(comment_id=comment_id, user_id=user_id)
        db.add(like)
        action = "liked"
    
    await db.commit()
    return {"action": action}

# =============================================================================
# LEADERBOARD
# =============================================================================

@router.get("/leaderboard", response_model=LeaderboardResponse)
async def get_leaderboard(
    limit: int = Query(50, ge=1, le=100),
    user_id: Optional[UUID] = None,  # TODO: Get from authentication
    db: AsyncSession = Depends(get_db)
):
    """Get community leaderboard"""
    query = select(CommunityLeaderboard).order_by(CommunityLeaderboard.rank_position)
    
    if limit:
        query = query.limit(limit)
    
    result = await db.execute(query)
    leaderboard = result.scalars().all()
    
    # Find user's rank if user_id provided
    user_rank = None
    if user_id:
        user_result = await db.execute(
            select(CommunityLeaderboard.rank_position)
            .where(CommunityLeaderboard.user_id == user_id)
        )
        user_rank = user_result.scalar_one_or_none()
    
    return LeaderboardResponse(
        leaderboard=leaderboard,
        total=len(leaderboard),
        user_rank=user_rank
    )

# =============================================================================
# USER STATS
# =============================================================================

@router.get("/users/{user_id}/stats", response_model=CommunityStats)
async def get_user_community_stats(
    user_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get user's community statistics"""
    # This would typically use the database function we created
    # For now, we'll calculate it manually
    
    # Get posts count
    posts_result = await db.execute(
        select(func.count(ForumPost.id)).where(ForumPost.author_id == user_id)
    )
    posts_created = posts_result.scalar() or 0
    
    # Get comments count
    comments_result = await db.execute(
        select(func.count(ForumComment.id)).where(ForumComment.author_id == user_id)
    )
    comments_created = comments_result.scalar() or 0
    
    # Get likes received
    likes_result = await db.execute(
        select(func.sum(ForumPost.like_count)).where(ForumPost.author_id == user_id)
    )
    likes_received = likes_result.scalar() or 0
    
    # Get reputation
    reputation_result = await db.execute(
        select(UserReputation).where(UserReputation.user_id == user_id)
    )
    reputation = reputation_result.scalar_one_or_none()
    
    if reputation:
        reputation_points = reputation.points
        level = reputation.level
    else:
        reputation_points = 0
        level = "newbie"
    
    # Get badges count
    badges_result = await db.execute(
        select(func.count(UserBadge.id)).where(UserBadge.user_id == user_id)
    )
    badges_count = badges_result.scalar() or 0
    
    return CommunityStats(
        posts_created=posts_created,
        comments_created=comments_created,
        likes_received=likes_received,
        reputation_points=reputation_points,
        level=level,
        badges_count=badges_count
    )

# =============================================================================
# NOTIFICATIONS
# =============================================================================

@router.get("/notifications", response_model=NotificationListResponse)
async def get_user_notifications(
    user_id: UUID,  # TODO: Get from authentication
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    unread_only: bool = False,
    db: AsyncSession = Depends(get_db)
):
    """Get user's notifications"""
    query = select(CommunityNotification).where(CommunityNotification.user_id == user_id)
    
    if unread_only:
        query = query.where(CommunityNotification.is_read == False)
    
    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Get unread count
    unread_result = await db.execute(
        select(func.count()).where(
            and_(
                CommunityNotification.user_id == user_id,
                CommunityNotification.is_read == False
            )
        )
    )
    unread_count = unread_result.scalar()
    
    # Apply pagination
    offset = (page - 1) * per_page
    query = query.order_by(desc(CommunityNotification.created_at))
    query = query.offset(offset).limit(per_page)
    
    result = await db.execute(query)
    notifications = result.scalars().all()
    
    total_pages = math.ceil(total / per_page)
    
    return NotificationListResponse(
        notifications=notifications,
        total=total,
        unread_count=unread_count,
        page=page,
        per_page=per_page,
        total_pages=total_pages
    )

@router.put("/notifications/{notification_id}/read")
async def mark_notification_read(
    notification_id: UUID,
    user_id: UUID,  # TODO: Get from authentication
    db: AsyncSession = Depends(get_db)
):
    """Mark a notification as read"""
    result = await db.execute(
        select(CommunityNotification).where(
            and_(
                CommunityNotification.id == notification_id,
                CommunityNotification.user_id == user_id
            )
        )
    )
    notification = result.scalar_one_or_none()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    notification.is_read = True
    await db.commit()
    return {"message": "Notification marked as read"}

@router.put("/notifications/read-all")
async def mark_all_notifications_read(
    user_id: UUID,  # TODO: Get from authentication
    db: AsyncSession = Depends(get_db)
):
    """Mark all notifications as read"""
    await db.execute(
        select(CommunityNotification)
        .where(CommunityNotification.user_id == user_id)
        .update({"is_read": True})
    )
    await db.commit()
    return {"message": "All notifications marked as read"}

