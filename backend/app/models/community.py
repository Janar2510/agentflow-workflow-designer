from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, ForeignKey, ARRAY, DECIMAL, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import uuid

from app.core.database import Base

class ForumCategory(Base):
    """Forum categories for organizing discussions"""
    __tablename__ = "forum_categories"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    slug = Column(String(100), unique=True, nullable=False)
    color = Column(String(7), default="#667eea")
    icon = Column(String(10), default="💬")
    sort_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    posts = relationship("ForumPost", back_populates="category")

class ForumPost(Base):
    """Forum posts/discussions"""
    __tablename__ = "forum_posts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    author_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    category_id = Column(UUID(as_uuid=True), ForeignKey("forum_categories.id", ondelete="SET NULL"))
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    slug = Column(String(250), unique=True, nullable=False)
    status = Column(String(20), default="published")  # draft, published, archived, locked
    post_type = Column(String(20), default="discussion")  # discussion, question, tutorial, announcement, showcase
    tags = Column(ARRAY(String), default=[])
    view_count = Column(Integer, default=0)
    reply_count = Column(Integer, default=0)
    like_count = Column(Integer, default=0)
    is_pinned = Column(Boolean, default=False)
    is_featured = Column(Boolean, default=False)
    last_activity_at = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    author = relationship("User", back_populates="forum_posts")
    category = relationship("ForumCategory", back_populates="posts")
    comments = relationship("ForumComment", back_populates="post", cascade="all, delete-orphan")
    likes = relationship("PostLike", back_populates="post", cascade="all, delete-orphan")

class ForumComment(Base):
    """Comments/replies to forum posts"""
    __tablename__ = "forum_comments"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    post_id = Column(UUID(as_uuid=True), ForeignKey("forum_posts.id", ondelete="CASCADE"), nullable=False)
    author_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    parent_id = Column(UUID(as_uuid=True), ForeignKey("forum_comments.id", ondelete="CASCADE"))  # For nested replies
    content = Column(Text, nullable=False)
    like_count = Column(Integer, default=0)
    is_solution = Column(Boolean, default=False)  # For marking solutions to questions
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    post = relationship("ForumPost", back_populates="comments")
    author = relationship("User", back_populates="forum_comments")
    parent = relationship("ForumComment", remote_side=[id], back_populates="replies")
    replies = relationship("ForumComment", back_populates="parent", cascade="all, delete-orphan")
    likes = relationship("CommentLike", back_populates="comment", cascade="all, delete-orphan")

class PostLike(Base):
    """Likes on forum posts"""
    __tablename__ = "post_likes"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    post_id = Column(UUID(as_uuid=True), ForeignKey("forum_posts.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    post = relationship("ForumPost", back_populates="likes")
    user = relationship("User")
    
    # Constraints
    __table_args__ = (UniqueConstraint('post_id', 'user_id', name='unique_post_like'),)

class CommentLike(Base):
    """Likes on forum comments"""
    __tablename__ = "comment_likes"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    comment_id = Column(UUID(as_uuid=True), ForeignKey("forum_comments.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    comment = relationship("ForumComment", back_populates="likes")
    user = relationship("User")
    
    # Constraints
    __table_args__ = (UniqueConstraint('comment_id', 'user_id', name='unique_comment_like'),)

class UserReputation(Base):
    """User reputation system"""
    __tablename__ = "user_reputation"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), unique=True, nullable=False)
    points = Column(Integer, default=0)
    level = Column(String(20), default="newbie")  # newbie, member, contributor, expert, guru
    badges = Column(ARRAY(String), default=[])
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="reputation")

class ReputationEvent(Base):
    """Reputation events for tracking changes"""
    __tablename__ = "reputation_events"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    event_type = Column(String(50), nullable=False)  # post_created, comment_created, post_liked, etc.
    points = Column(Integer, nullable=False)
    description = Column(Text)
    related_id = Column(UUID(as_uuid=True))  # ID of related post, comment, agent, etc.
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User")

class CommunityLeaderboard(Base):
    """Community leaderboard (materialized view)"""
    __tablename__ = "community_leaderboard"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), primary_key=True)
    username = Column(String(50), nullable=False)
    full_name = Column(String(100))
    avatar_url = Column(String(500))
    reputation_points = Column(Integer, default=0)
    agents_created = Column(Integer, default=0)
    agents_sold = Column(Integer, default=0)
    posts_created = Column(Integer, default=0)
    comments_created = Column(Integer, default=0)
    total_likes_received = Column(Integer, default=0)
    rank_position = Column(Integer)
    last_updated = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User")

class CommunityNotification(Base):
    """Community notifications"""
    __tablename__ = "community_notifications"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(50), nullable=False)  # post_reply, comment_reply, post_liked, etc.
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    related_id = Column(UUID(as_uuid=True))  # ID of related post, comment, etc.
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="notifications")

class CommunityBadge(Base):
    """Community badges"""
    __tablename__ = "community_badges"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    icon = Column(String(10), nullable=False)
    color = Column(String(7), default="#667eea")
    criteria = Column(JSONB, nullable=False)  # JSON criteria for earning the badge
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user_badges = relationship("UserBadge", back_populates="badge")

class UserBadge(Base):
    """User badges (many-to-many relationship)"""
    __tablename__ = "user_badges"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    badge_id = Column(UUID(as_uuid=True), ForeignKey("community_badges.id", ondelete="CASCADE"), nullable=False)
    earned_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="user_badges")
    badge = relationship("CommunityBadge", back_populates="user_badges")
    
    # Constraints
    __table_args__ = (UniqueConstraint('user_id', 'badge_id', name='unique_user_badge'),)

class CommunityEvent(Base):
    """Community events/announcements"""
    __tablename__ = "community_events"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    event_type = Column(String(50), nullable=False)  # announcement, contest, webinar, update, maintenance
    start_date = Column(DateTime(timezone=True))
    end_date = Column(DateTime(timezone=True))
    is_featured = Column(Boolean, default=False)
    created_by = Column(UUID(as_uuid=True), ForeignKey("profiles.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    creator = relationship("User")

