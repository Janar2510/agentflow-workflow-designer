from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from typing import List, Optional
from datetime import datetime
import uuid

from app.models.agent import Agent
from app.schemas.agent import AgentCreate, AgentUpdate

class AgentService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def list_agents(
        self, 
        category: Optional[str] = None,
        search: Optional[str] = None,
        skip: int = 0, 
        limit: int = 100
    ) -> List[Agent]:
        """List available agents"""
        query = select(Agent).where(Agent.is_public == True)
        
        if category:
            query = query.where(Agent.category == category)
        
        if search:
            query = query.where(
                Agent.name.ilike(f"%{search}%") | 
                Agent.display_name.ilike(f"%{search}%") |
                Agent.description.ilike(f"%{search}%")
            )
        
        query = query.offset(skip).limit(limit).order_by(Agent.downloads.desc())
        
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def get_agent(self, agent_id: uuid.UUID) -> Optional[Agent]:
        """Get agent by ID"""
        result = await self.db.execute(
            select(Agent).where(Agent.id == agent_id)
        )
        return result.scalar_one_or_none()
    
    async def create_agent(self, agent_data: AgentCreate, author_id: str) -> Agent:
        """Create a new custom agent"""
        agent = Agent(
            id=uuid.uuid4(),
            name=agent_data.name,
            display_name=agent_data.display_name,
            description=agent_data.description,
            category=agent_data.category,
            icon_url=agent_data.icon_url,
            config_schema=agent_data.config_schema,
            input_schema=agent_data.input_schema,
            output_schema=agent_data.output_schema,
            code_template=agent_data.code_template,
            is_builtin=False,
            is_public=agent_data.is_public or True,
            author_id=author_id
        )
        
        self.db.add(agent)
        await self.db.commit()
        await self.db.refresh(agent)
        
        return agent
    
    async def update_agent(
        self, 
        agent_id: uuid.UUID, 
        agent_data: AgentUpdate, 
        user_id: str
    ) -> Optional[Agent]:
        """Update agent"""
        # Check if user owns the agent
        agent = await self.get_agent(agent_id)
        if not agent or agent.author_id != user_id:
            return None
        
        update_data = agent_data.dict(exclude_unset=True)
        
        if not update_data:
            return agent
        
        update_data["updated_at"] = datetime.utcnow()
        
        await self.db.execute(
            update(Agent)
            .where(Agent.id == agent_id)
            .values(**update_data)
        )
        await self.db.commit()
        
        return await self.get_agent(agent_id)
    
    async def delete_agent(self, agent_id: uuid.UUID, user_id: str) -> bool:
        """Delete agent"""
        # Check if user owns the agent
        agent = await self.get_agent(agent_id)
        if not agent or agent.author_id != user_id:
            return False
        
        result = await self.db.execute(
            delete(Agent)
            .where(Agent.id == agent_id)
        )
        await self.db.commit()
        
        return result.rowcount > 0
















