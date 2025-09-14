# Agent modules package

from .code_analyzer import CodeAnalyzerAgent
from .data_processor import DataProcessorAgent
from .api_caller import APICallerAgent
from .file_handler import FileHandlerAgent
from .email_sender import EmailSenderAgent
from .database_query import DatabaseQueryAgent

# Agent registry for easy access
AGENT_REGISTRY = {
    'code_analyzer': CodeAnalyzerAgent,
    'data_processor': DataProcessorAgent,
    'api_caller': APICallerAgent,
    'file_handler': FileHandlerAgent,
    'email_sender': EmailSenderAgent,
    'database_query': DatabaseQueryAgent,
}

def get_agent_class(agent_type: str):
    """Get agent class by type"""
    return AGENT_REGISTRY.get(agent_type)

def list_available_agents():
    """List all available agent types"""
    return list(AGENT_REGISTRY.keys())
