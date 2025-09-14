"""
Agent Marketplace API endpoints
Handles agent discovery, management, and marketplace functionality
"""

from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, Dict, Any
import uuid
import logging

from app.core.database import get_db
from app.core.supabase import get_supabase
from app.services.auth_service import AuthService
from app.schemas.agent import (
    AgentCreate,
    AgentUpdate,
    AgentResponse,
    AgentReviewCreate,
    AgentReviewResponse,
    AgentSearchRequest,
    AgentStatsResponse
)

router = APIRouter()
auth_service = AuthService()
logger = logging.getLogger(__name__)

@router.get("/", response_model=List[AgentResponse])
async def list_agents(
    category: Optional[str] = Query(None, description="Filter by agent category"),
    search: Optional[str] = Query(None, description="Search agents by name or description"),
    is_public: bool = Query(True, description="Show only public agents"),
    limit: int = Query(50, ge=1, le=100, description="Number of agents to return"),
    offset: int = Query(0, ge=0, description="Number of agents to skip"),
    sort_by: str = Query("rating", description="Sort by field"),
    sort_order: str = Query("desc", description="Sort order (asc/desc)"),
    current_user = Depends(auth_service.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List available agents with filtering and search"""
    
    try:
        supabase = get_supabase()
        
        # Build query
        query = supabase.client.table('agents').select('*')
        
        if category:
            query = query.eq('category', category)
        
        if is_public:
            query = query.eq('is_public', True)
        
        if search:
            query = query.or_(f'display_name.ilike.%{search}%,description.ilike.%{search}%')
        
        # Apply sorting
        if sort_by in ['rating', 'downloads', 'created_at', 'updated_at']:
            query = query.order(sort_by, desc=(sort_order == 'desc'))
        else:
            query = query.order('rating', desc=True)
        
        # Apply pagination
        query = query.range(offset, offset + limit - 1)
        
        response = query.execute()
        agents = response.data or []
        
        # Convert to response format
        return [
            AgentResponse(
                id=agent['id'],
                name=agent['name'],
                display_name=agent['display_name'],
                description=agent['description'],
                category=agent['category'],
                icon_url=agent['icon_url'],
                config_schema=agent['config_schema'],
                input_schema=agent['input_schema'],
                output_schema=agent['output_schema'],
                code_template=agent['code_template'],
                is_builtin=agent['is_builtin'],
                is_public=agent['is_public'],
                author_id=agent['author_id'],
                downloads=agent['downloads'],
                rating=agent['rating'],
                created_at=agent['created_at'],
                updated_at=agent['updated_at']
            )
            for agent in agents
        ]
        
    except Exception as e:
        logger.error(f"Failed to list agents: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve agents")

@router.get("/{agent_id}", response_model=AgentResponse)
async def get_agent(
    agent_id: str,
    current_user = Depends(auth_service.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get agent by ID"""
    
    try:
        supabase = get_supabase()
        agent = await supabase.get_agent(agent_id)
        
        if not agent:
            raise HTTPException(status_code=404, detail="Agent not found")
        
        return AgentResponse(
            id=agent['id'],
            name=agent['name'],
            display_name=agent['display_name'],
            description=agent['description'],
            category=agent['category'],
            icon_url=agent['icon_url'],
            config_schema=agent['config_schema'],
            input_schema=agent['input_schema'],
            output_schema=agent['output_schema'],
            code_template=agent['code_template'],
            is_builtin=agent['is_builtin'],
            is_public=agent['is_public'],
            author_id=agent['author_id'],
            downloads=agent['downloads'],
            rating=agent['rating'],
            created_at=agent['created_at'],
            updated_at=agent['updated_at']
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get agent: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve agent")

@router.post("/", response_model=AgentResponse)
async def create_agent(
    agent_data: AgentCreate,
    current_user = Depends(auth_service.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new agent"""
    
    try:
        supabase = get_supabase()
        
        # Prepare agent data
        agent_dict = {
            'name': agent_data.name,
            'display_name': agent_data.display_name,
            'description': agent_data.description,
            'category': agent_data.category,
            'icon_url': agent_data.icon_url,
            'config_schema': agent_data.config_schema,
            'input_schema': agent_data.input_schema,
            'output_schema': agent_data.output_schema,
            'code_template': agent_data.code_template,
            'is_builtin': False,
            'is_public': agent_data.is_public,
            'author_id': current_user.id
        }
        
        # Create agent in Supabase
        response = supabase.client.table('agents').insert(agent_dict).execute()
        
        if not response.data:
            raise HTTPException(status_code=400, detail="Failed to create agent")
        
        agent = response.data[0]
        
        return AgentResponse(
            id=agent['id'],
            name=agent['name'],
            display_name=agent['display_name'],
            description=agent['description'],
            category=agent['category'],
            icon_url=agent['icon_url'],
            config_schema=agent['config_schema'],
            input_schema=agent['input_schema'],
            output_schema=agent['output_schema'],
            code_template=agent['code_template'],
            is_builtin=agent['is_builtin'],
            is_public=agent['is_public'],
            author_id=agent['author_id'],
            downloads=agent['downloads'],
            rating=agent['rating'],
            created_at=agent['created_at'],
            updated_at=agent['updated_at']
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to create agent: {e}")
        raise HTTPException(status_code=500, detail="Failed to create agent")

@router.put("/{agent_id}", response_model=AgentResponse)
async def update_agent(
    agent_id: str,
    agent_data: AgentUpdate,
    current_user = Depends(auth_service.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update agent (only by author)"""
    
    try:
        supabase = get_supabase()
        
        # Check if agent exists and user is author
        agent = await supabase.get_agent(agent_id)
        if not agent:
            raise HTTPException(status_code=404, detail="Agent not found")
        
        if agent['author_id'] != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized to update this agent")
        
        # Prepare update data
        update_data = agent_data.dict(exclude_unset=True)
        
        # Update agent
        response = supabase.client.table('agents').update(update_data).eq('id', agent_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=400, detail="Failed to update agent")
        
        updated_agent = response.data[0]
        
        return AgentResponse(
            id=updated_agent['id'],
            name=updated_agent['name'],
            display_name=updated_agent['display_name'],
            description=updated_agent['description'],
            category=updated_agent['category'],
            icon_url=updated_agent['icon_url'],
            config_schema=updated_agent['config_schema'],
            input_schema=updated_agent['input_schema'],
            output_schema=updated_agent['output_schema'],
            code_template=updated_agent['code_template'],
            is_builtin=updated_agent['is_builtin'],
            is_public=updated_agent['is_public'],
            author_id=updated_agent['author_id'],
            downloads=updated_agent['downloads'],
            rating=updated_agent['rating'],
            created_at=updated_agent['created_at'],
            updated_at=updated_agent['updated_at']
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update agent: {e}")
        raise HTTPException(status_code=500, detail="Failed to update agent")

@router.delete("/{agent_id}")
async def delete_agent(
    agent_id: str,
    current_user = Depends(auth_service.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete agent (only by author)"""
    
    try:
        supabase = get_supabase()
        
        # Check if agent exists and user is author
        agent = await supabase.get_agent(agent_id)
        if not agent:
            raise HTTPException(status_code=404, detail="Agent not found")
        
        if agent['author_id'] != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized to delete this agent")
        
        # Delete agent
        response = supabase.client.table('agents').delete().eq('id', agent_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=400, detail="Failed to delete agent")
        
        return {"message": "Agent deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete agent: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete agent")

@router.post("/{agent_id}/download")
async def download_agent(
    agent_id: str,
    current_user = Depends(auth_service.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Record agent download"""
    
    try:
        supabase = get_supabase()
        
        # Increment download count
        response = supabase.client.table('agents').update({
            'downloads': supabase.client.table('agents').select('downloads').eq('id', agent_id).execute().data[0]['downloads'] + 1
        }).eq('id', agent_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Agent not found")
        
        return {"message": "Download recorded successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to record download: {e}")
        raise HTTPException(status_code=500, detail="Failed to record download")

@router.get("/{agent_id}/reviews", response_model=List[AgentReviewResponse])
async def get_agent_reviews(
    agent_id: str,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user = Depends(auth_service.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get reviews for an agent"""
    
    try:
        supabase = get_supabase()
        
        response = supabase.client.table('agent_reviews').select(
            '*, profiles:user_id(username, avatar_url)'
        ).eq('agent_id', agent_id).order('created_at', desc=True).range(offset, offset + limit - 1).execute()
        
        reviews = response.data or []
        
        return [
            AgentReviewResponse(
                id=review['id'],
                agent_id=review['agent_id'],
                user_id=review['user_id'],
                username=review['profiles']['username'] if review.get('profiles') else 'Anonymous',
                avatar_url=review['profiles']['avatar_url'] if review.get('profiles') else None,
                rating=review['rating'],
                review_text=review['review_text'],
                created_at=review['created_at'],
                updated_at=review['updated_at']
            )
            for review in reviews
        ]
        
    except Exception as e:
        logger.error(f"Failed to get agent reviews: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve reviews")

@router.post("/{agent_id}/reviews", response_model=AgentReviewResponse)
async def create_agent_review(
    agent_id: str,
    review_data: AgentReviewCreate,
    current_user = Depends(auth_service.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create or update agent review"""
    
    try:
        supabase = get_supabase()
        
        # Check if agent exists
        agent = await supabase.get_agent(agent_id)
        if not agent:
            raise HTTPException(status_code=404, detail="Agent not found")
        
        # Prepare review data
        review_dict = {
            'agent_id': agent_id,
            'user_id': current_user.id,
            'rating': review_data.rating,
            'review_text': review_data.review_text
        }
        
        # Upsert review (create or update)
        response = supabase.client.table('agent_reviews').upsert(review_dict).execute()
        
        if not response.data:
            raise HTTPException(status_code=400, detail="Failed to create review")
        
        review = response.data[0]
        
        return AgentReviewResponse(
            id=review['id'],
            agent_id=review['agent_id'],
            user_id=review['user_id'],
            username=current_user.username,
            avatar_url=current_user.avatar_url,
            rating=review['rating'],
            review_text=review['review_text'],
            created_at=review['created_at'],
            updated_at=review['updated_at']
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to create review: {e}")
        raise HTTPException(status_code=500, detail="Failed to create review")

@router.get("/{agent_id}/stats", response_model=AgentStatsResponse)
async def get_agent_stats(
    agent_id: str,
    current_user = Depends(auth_service.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get agent statistics"""
    
    try:
        supabase = get_supabase()
        
        # Get agent
        agent = await supabase.get_agent(agent_id)
        if not agent:
            raise HTTPException(status_code=404, detail="Agent not found")
        
        # Get review stats
        reviews_response = supabase.client.table('agent_reviews').select('rating').eq('agent_id', agent_id).execute()
        reviews = reviews_response.data or []
        
        total_reviews = len(reviews)
        avg_rating = sum(review['rating'] for review in reviews) / total_reviews if total_reviews > 0 else 0
        rating_distribution = {}
        for i in range(1, 6):
            rating_distribution[str(i)] = sum(1 for review in reviews if review['rating'] == i)
        
        return AgentStatsResponse(
            agent_id=agent_id,
            downloads=agent['downloads'],
            total_reviews=total_reviews,
            average_rating=round(avg_rating, 2),
            rating_distribution=rating_distribution,
            created_at=agent['created_at'],
            last_updated=agent['updated_at']
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get agent stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve agent statistics")

@router.post("/search")
async def search_agents(
    search_request: AgentSearchRequest,
    current_user = Depends(auth_service.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Advanced agent search with filters"""
    
    try:
        supabase = get_supabase()
        
        # Build search query
        query = supabase.client.table('agents').select('*')
        
        if search_request.categories:
            query = query.in_('category', search_request.categories)
        
        if search_request.is_public is not None:
            query = query.eq('is_public', search_request.is_public)
        
        if search_request.min_rating:
            query = query.gte('rating', search_request.min_rating)
        
        if search_request.search_text:
            query = query.or_(f'display_name.ilike.%{search_request.search_text}%,description.ilike.%{search_request.search_text}%')
        
        # Apply sorting
        sort_field = search_request.sort_by or 'rating'
        sort_order = search_request.sort_order or 'desc'
        query = query.order(sort_field, desc=(sort_order == 'desc'))
        
        # Apply pagination
        limit = min(search_request.limit or 20, 100)
        offset = search_request.offset or 0
        query = query.range(offset, offset + limit - 1)
        
        response = query.execute()
        agents = response.data or []
        
        return {
            'agents': [
                AgentResponse(
                    id=agent['id'],
                    name=agent['name'],
                    display_name=agent['display_name'],
                    description=agent['description'],
                    category=agent['category'],
                    icon_url=agent['icon_url'],
                    config_schema=agent['config_schema'],
                    input_schema=agent['input_schema'],
                    output_schema=agent['output_schema'],
                    code_template=agent['code_template'],
                    is_builtin=agent['is_builtin'],
                    is_public=agent['is_public'],
                    author_id=agent['author_id'],
                    downloads=agent['downloads'],
                    rating=agent['rating'],
                    created_at=agent['created_at'],
                    updated_at=agent['updated_at']
                )
                for agent in agents
            ],
            'total': len(agents),
            'offset': offset,
            'limit': limit
        }
        
    except Exception as e:
        logger.error(f"Failed to search agents: {e}")
        raise HTTPException(status_code=500, detail="Failed to search agents")

@router.get("/categories/list")
async def get_agent_categories(
    current_user = Depends(auth_service.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get list of available agent categories"""
    
    try:
        supabase = get_supabase()
        
        response = supabase.client.table('agents').select('category').eq('is_public', True).execute()
        categories = list(set(agent['category'] for agent in response.data or []))
        
        return {
            'categories': sorted(categories),
            'total': len(categories)
        }
        
    except Exception as e:
        logger.error(f"Failed to get categories: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve categories")