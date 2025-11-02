from sqlalchemy import Column, String, DateTime, Boolean, Integer, Text, ForeignKey, Numeric
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
import uuid

class WorkflowTemplate(Base):
    __tablename__ = "workflow_templates"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(50), nullable=False)
    difficulty = Column(String(20), default="beginner")  # beginner, intermediate, advanced
    workflow_data = Column(JSONB, nullable=False)
    preview_image_url = Column(Text, nullable=True)
    author_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    is_featured = Column(Boolean, default=False)
    downloads = Column(Integer, default=0)
    rating = Column(Numeric(3, 2), default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    author = relationship("User")
    
    def __repr__(self):
        return f"<WorkflowTemplate(id={self.id}, name={self.name}, category={self.category})>"
















