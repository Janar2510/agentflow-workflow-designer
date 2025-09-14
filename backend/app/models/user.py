from sqlalchemy import Column, String, DateTime, Boolean, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
import uuid

class User(Base):
    __tablename__ = "profiles"  # Matches Supabase auth.users table
    
    id = Column(UUID(as_uuid=True), primary_key=True)  # References auth.users.id
    username = Column(String(50), unique=True, nullable=False, index=True)
    full_name = Column(String(100), nullable=True)
    avatar_url = Column(Text, nullable=True)
    plan_type = Column(String(20), default="free")  # free, pro, enterprise
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Community relationships
    forum_posts = relationship("ForumPost", back_populates="author", cascade="all, delete-orphan")
    forum_comments = relationship("ForumComment", back_populates="author", cascade="all, delete-orphan")
    reputation = relationship("UserReputation", back_populates="user", uselist=False, cascade="all, delete-orphan")
    user_badges = relationship("UserBadge", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("CommunityNotification", back_populates="user", cascade="all, delete-orphan")
    
    # Existing relationships (from other models)
    workflows = relationship("Workflow", back_populates="user", cascade="all, delete-orphan")
    agents = relationship("Agent", back_populates="author", cascade="all, delete-orphan")
    executions = relationship("WorkflowExecution", back_populates="user", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User(id={self.id}, username={self.username})>"







