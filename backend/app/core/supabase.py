"""
Supabase integration for AgentFlow
Handles database connections, authentication, and real-time subscriptions
"""

import os
from typing import Optional, Dict, Any, List
from supabase import create_client, Client
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class SupabaseClient:
    """Supabase client wrapper with additional functionality"""
    
    def __init__(self):
        self.client: Optional[Client] = None
        self._initialize_client()
    
    def _initialize_client(self):
        """Initialize Supabase client"""
        try:
            self.client = create_client(
                settings.SUPABASE_URL,
                settings.SUPABASE_ANON_KEY
            )
            logger.info("✅ Supabase client initialized successfully")
        except Exception as e:
            logger.error(f"❌ Failed to initialize Supabase client: {e}")
            raise
    
    def get_client(self) -> Client:
        """Get the Supabase client instance"""
        if not self.client:
            self._initialize_client()
        return self.client
    
    async def get_user(self, access_token: str) -> Optional[Dict[str, Any]]:
        """Get user information from access token"""
        try:
            response = self.client.auth.get_user(access_token)
            return response.user.model_dump() if response.user else None
        except Exception as e:
            logger.error(f"Failed to get user: {e}")
            return None
    
    async def create_workflow(self, workflow_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new workflow in Supabase"""
        try:
            response = self.client.table('workflows').insert(workflow_data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Failed to create workflow: {e}")
            raise
    
    async def get_workflow(self, workflow_id: str, user_id: str) -> Optional[Dict[str, Any]]:
        """Get workflow by ID for a specific user"""
        try:
            response = self.client.table('workflows').select('*').eq('id', workflow_id).eq('user_id', user_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Failed to get workflow: {e}")
            return None
    
    async def list_workflows(self, user_id: str, limit: int = 100, offset: int = 0) -> List[Dict[str, Any]]:
        """List workflows for a user"""
        try:
            response = self.client.table('workflows').select('*').eq('user_id', user_id).range(offset, offset + limit - 1).execute()
            return response.data or []
        except Exception as e:
            logger.error(f"Failed to list workflows: {e}")
            return []
    
    async def update_workflow(self, workflow_id: str, user_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update workflow"""
        try:
            response = self.client.table('workflows').update(updates).eq('id', workflow_id).eq('user_id', user_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Failed to update workflow: {e}")
            return None
    
    async def delete_workflow(self, workflow_id: str, user_id: str) -> bool:
        """Delete workflow"""
        try:
            response = self.client.table('workflows').delete().eq('id', workflow_id).eq('user_id', user_id).execute()
            return len(response.data) > 0
        except Exception as e:
            logger.error(f"Failed to delete workflow: {e}")
            return False
    
    async def create_execution(self, execution_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create workflow execution record"""
        try:
            response = self.client.table('workflow_executions').insert(execution_data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Failed to create execution: {e}")
            raise
    
    async def update_execution(self, execution_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update execution status"""
        try:
            response = self.client.table('workflow_executions').update(updates).eq('id', execution_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Failed to update execution: {e}")
            return None
    
    async def get_execution(self, execution_id: str, user_id: str) -> Optional[Dict[str, Any]]:
        """Get execution by ID"""
        try:
            response = self.client.table('workflow_executions').select('*').eq('id', execution_id).eq('user_id', user_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Failed to get execution: {e}")
            return None
    
    async def list_executions(self, workflow_id: str, user_id: str, limit: int = 50, offset: int = 0) -> List[Dict[str, Any]]:
        """List executions for a workflow"""
        try:
            response = self.client.table('workflow_executions').select('*').eq('workflow_id', workflow_id).eq('user_id', user_id).order('started_at', desc=True).range(offset, offset + limit - 1).execute()
            return response.data or []
        except Exception as e:
            logger.error(f"Failed to list executions: {e}")
            return []
    
    async def create_agent_log(self, log_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create agent execution log"""
        try:
            response = self.client.table('agent_logs').insert(log_data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Failed to create agent log: {e}")
            raise
    
    async def get_agents(self, category: Optional[str] = None, is_public: bool = True) -> List[Dict[str, Any]]:
        """Get available agents"""
        try:
            query = self.client.table('agents').select('*')
            if category:
                query = query.eq('category', category)
            if is_public:
                query = query.eq('is_public', True)
            
            response = query.execute()
            return response.data or []
        except Exception as e:
            logger.error(f"Failed to get agents: {e}")
            return []
    
    async def get_agent(self, agent_id: str) -> Optional[Dict[str, Any]]:
        """Get agent by ID"""
        try:
            response = self.client.table('agents').select('*').eq('id', agent_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Failed to get agent: {e}")
            return None
    
    async def search_workflows(self, query: str, user_id: str, limit: int = 20) -> List[Dict[str, Any]]:
        """Search workflows by name or description"""
        try:
            response = self.client.table('workflows').select('*').or_(f'name.ilike.%{query}%,description.ilike.%{query}%').eq('user_id', user_id).limit(limit).execute()
            return response.data or []
        except Exception as e:
            logger.error(f"Failed to search workflows: {e}")
            return []
    
    async def get_workflow_templates(self, category: Optional[str] = None, difficulty: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get workflow templates"""
        try:
            query = self.client.table('workflow_templates').select('*')
            if category:
                query = query.eq('category', category)
            if difficulty:
                query = query.eq('difficulty', difficulty)
            
            response = query.order('rating', desc=True).execute()
            return response.data or []
        except Exception as e:
            logger.error(f"Failed to get templates: {e}")
            return []
    
    async def create_collaboration_session(self, session_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create collaboration session"""
        try:
            response = self.client.table('collaboration_sessions').upsert(session_data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Failed to create collaboration session: {e}")
            raise
    
    async def get_active_collaborators(self, workflow_id: str) -> List[Dict[str, Any]]:
        """Get active collaborators for a workflow"""
        try:
            response = self.client.table('collaboration_sessions').select('*').eq('workflow_id', workflow_id).eq('is_active', True).execute()
            return response.data or []
        except Exception as e:
            logger.error(f"Failed to get active collaborators: {e}")
            return []
    
    async def record_analytics(self, analytics_data: Dict[str, Any]) -> Dict[str, Any]:
        """Record analytics data"""
        try:
            response = self.client.table('workflow_analytics').insert(analytics_data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Failed to record analytics: {e}")
            raise
    
    def subscribe_to_workflow_updates(self, workflow_id: str, callback):
        """Subscribe to real-time workflow updates"""
        try:
            subscription = self.client.table('workflow_executions').on('INSERT', callback).eq('workflow_id', workflow_id).subscribe()
            return subscription
        except Exception as e:
            logger.error(f"Failed to subscribe to workflow updates: {e}")
            return None

# Global Supabase client instance
supabase_client = SupabaseClient()

def get_supabase() -> SupabaseClient:
    """Get the global Supabase client instance"""
    return supabase_client

