from sqlalchemy import Column, String, DateTime, Boolean, Integer, Text, ForeignKey, Numeric
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
import uuid

class Agent(Base):
    __tablename__ = "agents"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False, unique=True)
    display_name = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(50), nullable=False)  # llm, tool, api, custom, data, integration
    icon_url = Column(Text, nullable=True)
    config_schema = Column(JSONB, nullable=False)  # JSON schema for configuration
    input_schema = Column(JSONB, nullable=False)   # Input data schema
    output_schema = Column(JSONB, nullable=False)  # Output data schema
    code_template = Column(Text, nullable=True)    # Python code template
    is_builtin = Column(Boolean, default=False)
    is_public = Column(Boolean, default=True)
    author_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    downloads = Column(Integer, default=0)
    rating = Column(Numeric(3, 2), default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    author = relationship("User", back_populates="agents")
    
    def __repr__(self):
        return f"<Agent(id={self.id}, name={self.name}, category={self.category})>"








