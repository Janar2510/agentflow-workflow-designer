import asyncio
import logging
from typing import Dict, Any, Optional
from datetime import datetime
import importlib
import sys
from pathlib import Path

from langchain.agents import AgentExecutor
from langchain.chat_models import ChatOpenAI
from langchain.tools import BaseTool
from crewai import Crew, Agent, Task

from app.agents import AGENT_REGISTRY, get_agent_class

logger = logging.getLogger(__name__)

class AgentRunner:
    """Service for executing different types of AI agents"""
    
    def __init__(self):
        self.agent_registry: Dict[str, Dict[str, Any]] = {}
        self.tool_registry: Dict[str, BaseTool] = {}
        self.llm = None
        
    async def initialize(self):
        """Initialize the agent runner"""
        logger.info("🤖 Initializing AgentRunner")
        
        # Initialize LLM
        self.llm = ChatOpenAI(
            model="gpt-4",
            temperature=0.1,
            streaming=True
        )
        
        # Load built-in agents
        await self._load_builtin_agents()
        
        # Load custom agents
        await self._load_custom_agents()
        
        logger.info(f"✅ Loaded {len(self.agent_registry)} agents")
    
    async def execute_agent(
        self,
        agent_type: str,
        config: Dict[str, Any],
        input_data: Dict[str, Any],
        context: Any
    ) -> Dict[str, Any]:
        """Execute an agent with given configuration and input"""
        
        if agent_type not in self.agent_registry:
            raise ValueError(f"Unknown agent type: {agent_type}")
        
        agent_def = self.agent_registry[agent_type]
        execution_method = agent_def['execution_method']
        
        logger.info(f"🏃 Executing agent: {agent_type}")
        
        try:
            if execution_method == 'langchain':
                return await self._execute_langchain_agent(agent_def, config, input_data, context)
            elif execution_method == 'crewai':
                return await self._execute_crewai_agent(agent_def, config, input_data, context)
            elif execution_method == 'custom':
                return await self._execute_custom_agent(agent_def, config, input_data, context)
            else:
                raise ValueError(f"Unknown execution method: {execution_method}")
                
        except Exception as e:
            logger.error(f"Agent execution failed: {e}", exc_info=True)
            raise
    
    async def _execute_langchain_agent(
        self,
        agent_def: Dict[str, Any],
        config: Dict[str, Any],
        input_data: Dict[str, Any],
        context: Any
    ) -> Dict[str, Any]:
        """Execute a LangChain-based agent"""
        
        # Build agent executor
        tools = self._get_tools_for_agent(agent_def, config)
        
        agent_executor = AgentExecutor.from_agent_and_tools(
            agent=agent_def['agent_class'](llm=self.llm),
            tools=tools,
            verbose=True,
            max_iterations=config.get('max_iterations', 10),
            max_execution_time=config.get('max_execution_time', 300)
        )
        
        # Prepare input
        agent_input = self._prepare_agent_input(input_data, config)
        
        # Execute
        result = await agent_executor.arun(agent_input)
        
        return {
            'output': result,
            'variables': self._extract_variables_from_result(result, config),
            'metadata': {
                'agent_type': 'langchain',
                'execution_time': datetime.utcnow().isoformat()
            }
        }
    
    async def _execute_crewai_agent(
        self,
        agent_def: Dict[str, Any],
        config: Dict[str, Any],
        input_data: Dict[str, Any],
        context: Any
    ) -> Dict[str, Any]:
        """Execute a CrewAI-based agent"""
        
        # Create agent
        agent = Agent(
            role=config.get('role', agent_def['default_role']),
            goal=config.get('goal', agent_def['default_goal']),
            backstory=config.get('backstory', agent_def['default_backstory']),
            tools=self._get_tools_for_agent(agent_def, config),
            llm=self.llm,
            verbose=True
        )
        
        # Create task
        task = Task(
            description=self._prepare_task_description(input_data, config),
            agent=agent,
            expected_output=config.get('expected_output', 'Detailed analysis and recommendations')
        )
        
        # Create crew and execute
        crew = Crew(
            agents=[agent],
            tasks=[task],
            verbose=2
        )
        
        result = crew.kickoff()
        
        return {
            'output': str(result),
            'variables': self._extract_variables_from_result(str(result), config),
            'metadata': {
                'agent_type': 'crewai',
                'execution_time': datetime.utcnow().isoformat()
            }
        }
    
    async def _execute_custom_agent(
        self,
        agent_def: Dict[str, Any],
        config: Dict[str, Any],
        input_data: Dict[str, Any],
        context: Any
    ) -> Dict[str, Any]:
        """Execute a custom agent"""
        
        # Load custom agent module
        module = importlib.import_module(agent_def['module_path'])
        agent_class = getattr(module, agent_def['class_name'])
        
        # Initialize agent
        agent = agent_class(config=config, llm=self.llm)
        
        # Execute
        result = await agent.execute(input_data, context)
        
        return result
    
    def _get_tools_for_agent(self, agent_def: Dict[str, Any], config: Dict[str, Any]) -> list:
        """Get tools for an agent based on configuration"""
        
        tools = []
        tool_names = config.get('tools', agent_def.get('default_tools', []))
        
        for tool_name in tool_names:
            if tool_name in self.tool_registry:
                tools.append(self.tool_registry[tool_name])
            else:
                logger.warning(f"Tool not found: {tool_name}")
        
        return tools
    
    def _prepare_agent_input(self, input_data: Dict[str, Any], config: Dict[str, Any]) -> str:
        """Prepare input string for agent execution"""
        
        template = config.get('input_template', '{input}')
        
        # Simple template substitution
        formatted_input = template.format(**input_data)
        
        return formatted_input
    
    def _prepare_task_description(self, input_data: Dict[str, Any], config: Dict[str, Any]) -> str:
        """Prepare task description for CrewAI agents"""
        
        template = config.get('task_template', 'Process the following input: {input}')
        
        return template.format(**input_data)
    
    def _extract_variables_from_result(self, result: str, config: Dict[str, Any]) -> Dict[str, Any]:
        """Extract variables from agent result"""
        
        # Simple extraction based on configuration
        variable_patterns = config.get('variable_extraction', {})
        variables = {}
        
        for var_name, pattern in variable_patterns.items():
            # Simple regex extraction (could be more sophisticated)
            import re
            match = re.search(pattern, result)
            if match:
                variables[var_name] = match.group(1) if match.groups() else match.group(0)
        
        return variables
    
    async def _load_builtin_agents(self):
        """Load built-in agent definitions"""
        
        # LLM Text Generator Agent
        self.agent_registry['llm_text_generator'] = {
            'name': 'LLM Text Generator',
            'description': 'Generates text using large language models',
            'execution_method': 'langchain',
            'category': 'llm',
            'input_schema': {
                'type': 'object',
                'properties': {
                    'prompt': {'type': 'string', 'description': 'Input prompt'},
                    'max_tokens': {'type': 'integer', 'default': 1000}
                },
                'required': ['prompt']
            },
            'output_schema': {
                'type': 'object',
                'properties': {
                    'generated_text': {'type': 'string'}
                }
            },
            'config_schema': {
                'type': 'object',
                'properties': {
                    'temperature': {'type': 'number', 'default': 0.7},
                    'max_tokens': {'type': 'integer', 'default': 1000},
                    'input_template': {'type': 'string', 'default': '{prompt}'}
                }
            }
        }
        
        # Data Processor Agent
        self.agent_registry['data_processor'] = {
            'name': 'Data Processor',
            'description': 'Processes and transforms data',
            'execution_method': 'custom',
            'category': 'data',
            'module_path': 'app.agents.data_processor',
            'class_name': 'DataProcessorAgent',
            'input_schema': {
                'type': 'object',
                'properties': {
                    'data': {'type': 'array', 'description': 'Input data'},
                    'operation': {'type': 'string', 'description': 'Processing operation'}
                },
                'required': ['data', 'operation']
            }
        }
        
        # API Caller Agent
        self.agent_registry['api_caller'] = {
            'name': 'API Caller',
            'description': 'Makes HTTP API calls and processes responses',
            'execution_method': 'custom',
            'category': 'integration',
            'module_path': 'app.agents.api_caller',
            'class_name': 'APICallerAgent',
            'input_schema': {
                'type': 'object',
                'properties': {
                    'url': {'type': 'string', 'description': 'API endpoint URL'},
                    'method': {'type': 'string', 'default': 'GET'},
                    'headers': {'type': 'object', 'default': {}},
                    'data': {'type': 'object', 'default': {}}
                },
                'required': ['url']
            }
        }
        
        # Code Analyzer Agent
        self.agent_registry['code_analyzer'] = {
            'name': 'Code Analyzer',
            'description': 'Analyzes code quality, security, and best practices',
            'execution_method': 'custom',
            'category': 'analysis',
            'module_path': 'app.agents.code_analyzer',
            'class_name': 'CodeAnalyzerAgent',
            'input_schema': {
                'type': 'object',
                'properties': {
                    'code': {'type': 'string', 'description': 'Code to analyze'},
                    'language': {'type': 'string', 'description': 'Programming language', 'default': 'python'}
                },
                'required': ['code']
            },
            'output_schema': {
                'type': 'object',
                'properties': {
                    'analysis': {'type': 'object'},
                    'summary': {'type': 'string'},
                    'recommendations': {'type': 'array'}
                }
            },
            'config_schema': {
                'type': 'object',
                'properties': {
                    'language': {'type': 'string', 'default': 'python'},
                    'analysis_level': {'type': 'string', 'default': 'comprehensive'}
                }
            }
        }
        
        # File Handler Agent
        self.agent_registry['file_handler'] = {
            'name': 'File Handler',
            'description': 'Handles file operations and management',
            'execution_method': 'custom',
            'category': 'utility',
            'module_path': 'app.agents.file_handler',
            'class_name': 'FileHandlerAgent',
            'input_schema': {
                'type': 'object',
                'properties': {
                    'operation': {'type': 'string', 'description': 'File operation'},
                    'file_path': {'type': 'string', 'description': 'File path'},
                    'content': {'type': 'string', 'description': 'File content'},
                    'parameters': {'type': 'object', 'description': 'Operation parameters'}
                },
                'required': ['operation']
            },
            'output_schema': {
                'type': 'object',
                'properties': {
                    'file_path': {'type': 'string'},
                    'content': {'type': 'string'},
                    'metadata': {'type': 'object'}
                }
            },
            'config_schema': {
                'type': 'object',
                'properties': {
                    'max_file_size': {'type': 'integer', 'default': 10485760}
                }
            }
        }
        
        # Email Sender Agent
        self.agent_registry['email_sender'] = {
            'name': 'Email Sender',
            'description': 'Sends emails with various configurations',
            'execution_method': 'custom',
            'category': 'communication',
            'module_path': 'app.agents.email_sender',
            'class_name': 'EmailSenderAgent',
            'input_schema': {
                'type': 'object',
                'properties': {
                    'to': {'type': 'array', 'description': 'Recipient emails'},
                    'subject': {'type': 'string', 'description': 'Email subject'},
                    'body': {'type': 'string', 'description': 'Email body'},
                    'html_body': {'type': 'string', 'description': 'HTML email body'},
                    'attachments': {'type': 'array', 'description': 'Email attachments'}
                },
                'required': ['to', 'subject']
            },
            'output_schema': {
                'type': 'object',
                'properties': {
                    'status': {'type': 'string'},
                    'message_id': {'type': 'string'}
                }
            },
            'config_schema': {
                'type': 'object',
                'properties': {
                    'smtp_server': {'type': 'string', 'default': 'smtp.gmail.com'},
                    'smtp_port': {'type': 'integer', 'default': 587},
                    'username': {'type': 'string'},
                    'password': {'type': 'string'},
                    'use_tls': {'type': 'boolean', 'default': True}
                }
            }
        }
        
        # Database Query Agent
        self.agent_registry['database_query'] = {
            'name': 'Database Query',
            'description': 'Executes database operations and queries',
            'execution_method': 'custom',
            'category': 'data',
            'module_path': 'app.agents.database_query',
            'class_name': 'DatabaseQueryAgent',
            'input_schema': {
                'type': 'object',
                'properties': {
                    'operation': {'type': 'string', 'description': 'Database operation'},
                    'query': {'type': 'string', 'description': 'SQL query'},
                    'parameters': {'type': 'object', 'description': 'Query parameters'}
                },
                'required': ['query']
            },
            'output_schema': {
                'type': 'object',
                'properties': {
                    'data': {'type': 'array'},
                    'rows_affected': {'type': 'integer'}
                }
            },
            'config_schema': {
                'type': 'object',
                'properties': {
                    'db_type': {'type': 'string', 'default': 'sqlite'},
                    'connection_string': {'type': 'string'},
                    'host': {'type': 'string', 'default': 'localhost'},
                    'port': {'type': 'integer', 'default': 5432},
                    'database': {'type': 'string'},
                    'username': {'type': 'string'},
                    'password': {'type': 'string'}
                }
            }
        }
    
    async def _load_custom_agents(self):
        """Load custom agent definitions from agent registry"""
        
        # This would load agents from the database or file system
        # For now, we'll keep it simple
        pass
    
    async def cleanup(self):
        """Cleanup agent runner resources"""
        logger.info("🧹 Cleaning up AgentRunner")
        
        # Cleanup any persistent connections or resources
        pass







