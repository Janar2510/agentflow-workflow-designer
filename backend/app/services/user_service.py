from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from sqlalchemy.orm import selectinload
from typing import Optional
from datetime import datetime
import uuid

from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.services.auth_service import AuthService

class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.auth_service = AuthService()
    
    async def get_user_by_id(self, user_id: str) -> Optional[User]:
        """Get user by ID"""
        result = await self.db.execute(
            select(User).where(User.id == user_id)
        )
        return result.scalar_one_or_none()
    
    async def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        result = await self.db.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()
    
    async def get_user_by_username(self, username: str) -> Optional[User]:
        """Get user by username"""
        result = await self.db.execute(
            select(User).where(User.username == username)
        )
        return result.scalar_one_or_none()
    
    async def create_user(self, user_data: UserCreate) -> User:
        """Create a new user"""
        # Hash password
        hashed_password = self.auth_service.get_password_hash(user_data.password)
        
        # Create user
        user = User(
            id=uuid.uuid4(),
            email=user_data.email,
            username=user_data.username,
            full_name=user_data.full_name,
            avatar_url=user_data.avatar_url,
            hashed_password=hashed_password,
            is_active=True,
            is_verified=False,
            plan_type="free"
        )
        
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        
        return user
    
    async def update_user(self, user_id: str, user_data: UserUpdate) -> Optional[User]:
        """Update user information"""
        update_data = user_data.dict(exclude_unset=True)
        
        if not update_data:
            return await self.get_user_by_id(user_id)
        
        # Hash password if provided
        if "password" in update_data:
            update_data["hashed_password"] = self.auth_service.get_password_hash(update_data.pop("password"))
        
        update_data["updated_at"] = datetime.utcnow()
        
        await self.db.execute(
            update(User)
            .where(User.id == user_id)
            .values(**update_data)
        )
        await self.db.commit()
        
        return await self.get_user_by_id(user_id)
    
    async def update_last_login(self, user_id: str) -> None:
        """Update user's last login timestamp"""
        await self.db.execute(
            update(User)
            .where(User.id == user_id)
            .values(last_login=datetime.utcnow())
        )
        await self.db.commit()
    
    async def deactivate_user(self, user_id: str) -> bool:
        """Deactivate user account"""
        await self.db.execute(
            update(User)
            .where(User.id == user_id)
            .values(is_active=False, updated_at=datetime.utcnow())
        )
        await self.db.commit()
        return True
    
    async def verify_user(self, user_id: str) -> bool:
        """Verify user account"""
        await self.db.execute(
            update(User)
            .where(User.id == user_id)
            .values(is_verified=True, updated_at=datetime.utcnow())
        )
        await self.db.commit()
        return True
















