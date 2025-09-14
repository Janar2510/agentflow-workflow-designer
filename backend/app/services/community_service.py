from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, and_, or_
from sqlalchemy.orm import selectinload, joinedload
from typing import List, Optional, Dict, Any
from uuid import UUID
import math

from app.models.community import (
    ForumCategory, ForumPost, ForumComment, PostLike, CommentLike,
    UserReputation, ReputationEvent, CommunityLeaderboard,
    CommunityBadge, UserBadge, CommunityNotification, CommunityEvent
)
from app.schemas.community import (
    ForumCategoryCreate, ForumCategoryUpdate,
    ForumPostCreate, ForumPostUpdate,
    ForumCommentCreate, ForumCommentUpdate,
    ReputationEventCreate,
    CommunityBadgeCreate, CommunityBadgeUpdate,
    UserBadgeCreate,
    CommunityNotificationCreate, CommunityNotificationUpdate,
    CommunityEventCreate, CommunityEventUpdate
)

class CommunityService:
    """Service for community-related operations"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    # =============================================================================
    # FORUM CATEGORIES
    # =============================================================================
    
    async def get_categories(self) -> List[ForumCategory]:
        """Get all active forum categories"""
        result = await self.db.execute(
            select(ForumCategory)
            .where(ForumCategory.is_active == True)
            .order_by(ForumCategory.sort_order, ForumCategory.name)
        )
        return result.scalars().all()
    
    async def create_category(self, category_data: ForumCategoryCreate) -> ForumCategory:
        """Create a new forum category"""
        category = ForumCategory(**category_data.dict())
        self.db.add(category)
        await self.db.commit()
        await self.db.refresh(category)
        return category
    
    async def update_category(self, category_id: UUID, category_data: ForumCategoryUpdate) -> ForumCategory:
        """Update a forum category"""
        result = await self.db.execute(
            select(ForumCategory).where(ForumCategory.id == category_id)
        )
        category = result.scalar_one_or_none()
        if not category:
            raise ValueError("Category not found")
        
        for field, value in category_data.dict(exclude_unset=True).items():
            setattr(category, field, value)
        
        await self.db.commit()
        await self.db.refresh(category)
        return category
    
    # =============================================================================
    # FORUM POSTS
    # =============================================================================
    
    async def get_posts(
        self,
        page: int = 1,
        per_page: int = 20,
        category_id: Optional[UUID] = None,
        post_type: Optional[str] = None,
        search: Optional[str] = None,
        sort_by: str = "last_activity",
        sort_order: str = "desc"
    ) -> Dict[str, Any]:
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
            query = query.order_by(sort_column)
        
        # Get total count
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.db.execute(count_query)
        total = total_result.scalar()
        
        # Apply pagination
        offset = (page - 1) * per_page
        query = query.offset(offset).limit(per_page)
        
        # Load relationships
        query = query.options(
            joinedload(ForumPost.author),
            joinedload(ForumPost.category)
        )
        
        result = await self.db.execute(query)
        posts = result.scalars().all()
        
        return {
            "posts": posts,
            "total": total,
            "page": page,
            "per_page": per_page,
            "total_pages": math.ceil(total / per_page)
        }
    
    async def get_post(self, post_id: UUID) -> ForumPost:
        """Get a specific forum post"""
        result = await self.db.execute(
            select(ForumPost)
            .where(ForumPost.id == post_id)
            .options(
                joinedload(ForumPost.author),
                joinedload(ForumPost.category)
            )
        )
        post = result.scalar_one_or_none()
        if not post:
            raise ValueError("Post not found")
        
        # Increment view count
        post.view_count += 1
        await self.db.commit()
        
        return post
    
    async def create_post(self, post_data: ForumPostCreate, author_id: UUID) -> ForumPost:
        """Create a new forum post"""
        # Generate slug from title
        slug = post_data.title.lower().replace(" ", "-").replace("_", "-")
        
        post = ForumPost(
            **post_data.dict(),
            author_id=author_id,
            slug=slug
        )
        self.db.add(post)
        await self.db.commit()
        await self.db.refresh(post)
        
        # Create reputation event
        await self._create_reputation_event(
            user_id=author_id,
            event_type="post_created",
            points=10,
            description="Created a forum post",
            related_id=post.id
        )
        
        return post
    
    async def update_post(self, post_id: UUID, post_data: ForumPostUpdate, user_id: UUID) -> ForumPost:
        """Update a forum post"""
        result = await self.db.execute(
            select(ForumPost).where(ForumPost.id == post_id)
        )
        post = result.scalar_one_or_none()
        if not post:
            raise ValueError("Post not found")
        
        if post.author_id != user_id:
            raise ValueError("Not authorized to update this post")
        
        for field, value in post_data.dict(exclude_unset=True).items():
            setattr(post, field, value)
        
        await self.db.commit()
        await self.db.refresh(post)
        return post
    
    async def delete_post(self, post_id: UUID, user_id: UUID) -> bool:
        """Delete a forum post"""
        result = await self.db.execute(
            select(ForumPost).where(ForumPost.id == post_id)
        )
        post = result.scalar_one_or_none()
        if not post:
            raise ValueError("Post not found")
        
        if post.author_id != user_id:
            raise ValueError("Not authorized to delete this post")
        
        await self.db.delete(post)
        await self.db.commit()
        return True
    
    # =============================================================================
    # FORUM COMMENTS
    # =============================================================================
    
    async def get_comments(
        self,
        post_id: UUID,
        page: int = 1,
        per_page: int = 50
    ) -> Dict[str, Any]:
        """Get comments for a forum post"""
        query = select(ForumComment).where(ForumComment.post_id == post_id)
        
        # Get total count
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.db.execute(count_query)
        total = total_result.scalar()
        
        # Apply pagination
        offset = (page - 1) * per_page
        query = query.offset(offset).limit(per_page)
        
        # Load relationships
        query = query.options(
            joinedload(ForumComment.author),
            joinedload(ForumComment.replies)
        )
        
        result = await self.db.execute(query)
        comments = result.scalars().all()
        
        return {
            "comments": comments,
            "total": total,
            "page": page,
            "per_page": per_page,
            "total_pages": math.ceil(total / per_page)
        }
    
    async def create_comment(self, post_id: UUID, comment_data: ForumCommentCreate, author_id: UUID) -> ForumComment:
        """Create a comment on a forum post"""
        comment = ForumComment(
            **comment_data.dict(),
            post_id=post_id,
            author_id=author_id
        )
        self.db.add(comment)
        await self.db.commit()
        await self.db.refresh(comment)
        
        # Create reputation event
        await self._create_reputation_event(
            user_id=author_id,
            event_type="comment_created",
            points=5,
            description="Created a forum comment",
            related_id=comment.id
        )
        
        return comment
    
    async def update_comment(self, comment_id: UUID, comment_data: ForumCommentUpdate, user_id: UUID) -> ForumComment:
        """Update a forum comment"""
        result = await self.db.execute(
            select(ForumComment).where(ForumComment.id == comment_id)
        )
        comment = result.scalar_one_or_none()
        if not comment:
            raise ValueError("Comment not found")
        
        if comment.author_id != user_id:
            raise ValueError("Not authorized to update this comment")
        
        for field, value in comment_data.dict(exclude_unset=True).items():
            setattr(comment, field, value)
        
        await self.db.commit()
        await self.db.refresh(comment)
        return comment
    
    async def delete_comment(self, comment_id: UUID, user_id: UUID) -> bool:
        """Delete a forum comment"""
        result = await self.db.execute(
            select(ForumComment).where(ForumComment.id == comment_id)
        )
        comment = result.scalar_one_or_none()
        if not comment:
            raise ValueError("Comment not found")
        
        if comment.author_id != user_id:
            raise ValueError("Not authorized to delete this comment")
        
        await self.db.delete(comment)
        await self.db.commit()
        return True
    
    # =============================================================================
    # LIKES
    # =============================================================================
    
    async def toggle_post_like(self, post_id: UUID, user_id: UUID) -> str:
        """Like/unlike a forum post"""
        result = await self.db.execute(
            select(PostLike).where(
                and_(PostLike.post_id == post_id, PostLike.user_id == user_id)
            )
        )
        existing_like = result.scalar_one_or_none()
        
        if existing_like:
            await self.db.delete(existing_like)
            action = "unliked"
        else:
            like = PostLike(post_id=post_id, user_id=user_id)
            self.db.add(like)
            action = "liked"
        
        await self.db.commit()
        return action
    
    async def toggle_comment_like(self, comment_id: UUID, user_id: UUID) -> str:
        """Like/unlike a forum comment"""
        result = await self.db.execute(
            select(CommentLike).where(
                and_(CommentLike.comment_id == comment_id, CommentLike.user_id == user_id)
            )
        )
        existing_like = result.scalar_one_or_none()
        
        if existing_like:
            await self.db.delete(existing_like)
            action = "unliked"
        else:
            like = CommentLike(comment_id=comment_id, user_id=user_id)
            self.db.add(like)
            action = "liked"
        
        await self.db.commit()
        return action
    
    # =============================================================================
    # REPUTATION SYSTEM
    # =============================================================================
    
    async def _create_reputation_event(
        self,
        user_id: UUID,
        event_type: str,
        points: int,
        description: str,
        related_id: Optional[UUID] = None
    ) -> ReputationEvent:
        """Create a reputation event"""
        event = ReputationEvent(
            user_id=user_id,
            event_type=event_type,
            points=points,
            description=description,
            related_id=related_id
        )
        self.db.add(event)
        await self.db.commit()
        await self.db.refresh(event)
        return event
    
    async def get_user_reputation(self, user_id: UUID) -> UserReputation:
        """Get user's reputation"""
        result = await self.db.execute(
            select(UserReputation).where(UserReputation.user_id == user_id)
        )
        reputation = result.scalar_one_or_none()
        
        if not reputation:
            # Create initial reputation
            reputation = UserReputation(user_id=user_id)
            self.db.add(reputation)
            await self.db.commit()
            await self.db.refresh(reputation)
        
        return reputation
    
    async def update_user_reputation(self, user_id: UUID, points: int) -> UserReputation:
        """Update user's reputation points"""
        reputation = await self.get_user_reputation(user_id)
        reputation.points += points
        
        # Update level based on points
        if reputation.points >= 10000:
            reputation.level = "guru"
        elif reputation.points >= 5000:
            reputation.level = "expert"
        elif reputation.points >= 1000:
            reputation.level = "contributor"
        elif reputation.points >= 100:
            reputation.level = "member"
        else:
            reputation.level = "newbie"
        
        await self.db.commit()
        await self.db.refresh(reputation)
        return reputation
    
    # =============================================================================
    # LEADERBOARD
    # =============================================================================
    
    async def get_leaderboard(self, limit: int = 50) -> List[CommunityLeaderboard]:
        """Get community leaderboard"""
        query = select(CommunityLeaderboard).order_by(CommunityLeaderboard.rank_position)
        
        if limit:
            query = query.limit(limit)
        
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def update_leaderboard(self) -> bool:
        """Update the community leaderboard"""
        # This would typically call the database function we created
        # For now, we'll implement a basic version
        
        # Clear existing leaderboard
        await self.db.execute(select(CommunityLeaderboard).delete())
        
        # Get user stats and create leaderboard entries
        # This is a simplified version - in production, you'd use the database function
        
        await self.db.commit()
        return True
    
    # =============================================================================
    # NOTIFICATIONS
    # =============================================================================
    
    async def get_user_notifications(
        self,
        user_id: UUID,
        page: int = 1,
        per_page: int = 20,
        unread_only: bool = False
    ) -> Dict[str, Any]:
        """Get user's notifications"""
        query = select(CommunityNotification).where(CommunityNotification.user_id == user_id)
        
        if unread_only:
            query = query.where(CommunityNotification.is_read == False)
        
        # Get total count
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.db.execute(count_query)
        total = total_result.scalar()
        
        # Get unread count
        unread_result = await self.db.execute(
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
        
        result = await self.db.execute(query)
        notifications = result.scalars().all()
        
        return {
            "notifications": notifications,
            "total": total,
            "unread_count": unread_count,
            "page": page,
            "per_page": per_page,
            "total_pages": math.ceil(total / per_page)
        }
    
    async def create_notification(
        self,
        user_id: UUID,
        notification_type: str,
        title: str,
        message: str,
        related_id: Optional[UUID] = None
    ) -> CommunityNotification:
        """Create a notification for a user"""
        notification = CommunityNotification(
            user_id=user_id,
            type=notification_type,
            title=title,
            message=message,
            related_id=related_id
        )
        self.db.add(notification)
        await self.db.commit()
        await self.db.refresh(notification)
        return notification
    
    async def mark_notification_read(self, notification_id: UUID, user_id: UUID) -> bool:
        """Mark a notification as read"""
        result = await self.db.execute(
            select(CommunityNotification).where(
                and_(
                    CommunityNotification.id == notification_id,
                    CommunityNotification.user_id == user_id
                )
            )
        )
        notification = result.scalar_one_or_none()
        if not notification:
            return False
        
        notification.is_read = True
        await self.db.commit()
        return True
    
    async def mark_all_notifications_read(self, user_id: UUID) -> bool:
        """Mark all notifications as read for a user"""
        await self.db.execute(
            select(CommunityNotification)
            .where(CommunityNotification.user_id == user_id)
            .update({"is_read": True})
        )
        await self.db.commit()
        return True
    
    # =============================================================================
    # BADGES
    # =============================================================================
    
    async def get_badges(self) -> List[CommunityBadge]:
        """Get all active badges"""
        result = await self.db.execute(
            select(CommunityBadge).where(CommunityBadge.is_active == True)
        )
        return result.scalars().all()
    
    async def get_user_badges(self, user_id: UUID) -> List[UserBadge]:
        """Get user's badges"""
        result = await self.db.execute(
            select(UserBadge)
            .where(UserBadge.user_id == user_id)
            .options(joinedload(UserBadge.badge))
        )
        return result.scalars().all()
    
    async def award_badge(self, user_id: UUID, badge_id: UUID) -> UserBadge:
        """Award a badge to a user"""
        # Check if user already has this badge
        result = await self.db.execute(
            select(UserBadge).where(
                and_(UserBadge.user_id == user_id, UserBadge.badge_id == badge_id)
            )
        )
        existing_badge = result.scalar_one_or_none()
        
        if existing_badge:
            return existing_badge
        
        user_badge = UserBadge(user_id=user_id, badge_id=badge_id)
        self.db.add(user_badge)
        await self.db.commit()
        await self.db.refresh(user_badge)
        return user_badge
    
    # =============================================================================
    # EVENTS
    # =============================================================================
    
    async def get_events(self, featured_only: bool = False) -> List[CommunityEvent]:
        """Get community events"""
        query = select(CommunityEvent)
        
        if featured_only:
            query = query.where(CommunityEvent.is_featured == True)
        
        query = query.order_by(desc(CommunityEvent.created_at))
        
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def create_event(self, event_data: CommunityEventCreate) -> CommunityEvent:
        """Create a community event"""
        event = CommunityEvent(**event_data.dict())
        self.db.add(event)
        await self.db.commit()
        await self.db.refresh(event)
        return event

