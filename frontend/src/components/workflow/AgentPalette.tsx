import React from 'react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { 
  Code, 
  Database, 
  Globe, 
  Zap, 
  FileText, 
  Mail, 
  Search,
  BarChart3,
  Shield,
  Image,
  Settings
} from 'lucide-react'

const nodeCategories = [
  {
    name: 'Triggers',
    icon: Zap,
    color: 'agentflow-badge--warning',
    nodes: [
      { id: 'manual_trigger', name: 'Manual Trigger', description: 'Start workflow manually', nodeType: 'trigger' },
      { id: 'schedule_trigger', name: 'Schedule Trigger', description: 'Trigger on schedule', nodeType: 'trigger' },
      { id: 'webhook_trigger', name: 'Webhook Trigger', description: 'Trigger via webhook', nodeType: 'trigger' },
      { id: 'file_trigger', name: 'File Trigger', description: 'Trigger on file change', nodeType: 'trigger' }
    ]
  },
  {
    name: 'AI Agents',
    icon: Code,
    color: 'agentflow-badge--primary',
    nodes: [
      { id: 'llm_text_generator', name: 'Text Generator', description: 'Generate text using LLMs', nodeType: 'agent' },
      { id: 'llm_chat', name: 'Chat Agent', description: 'Conversational AI agent', nodeType: 'agent' },
      { id: 'llm_summarizer', name: 'Text Summarizer', description: 'Summarize long texts', nodeType: 'agent' },
      { id: 'llm_translator', name: 'Translator', description: 'Translate between languages', nodeType: 'agent' }
    ]
  },
  {
    name: 'Data Processing',
    icon: Database,
    color: 'agentflow-badge--success',
    nodes: [
      { id: 'data_processor', name: 'Data Processor', description: 'Process and transform data', nodeType: 'agent' },
      { id: 'data_analyzer', name: 'Data Analyzer', description: 'Analyze data patterns', nodeType: 'agent' },
      { id: 'data_validator', name: 'Data Validator', description: 'Validate data quality', nodeType: 'agent' },
      { id: 'data_converter', name: 'Data Converter', description: 'Convert data formats', nodeType: 'agent' },
      { id: 'database_query', name: 'Database Query', description: 'Execute database operations', nodeType: 'agent' }
    ]
  },
  {
    name: 'Code Analysis',
    icon: BarChart3,
    color: 'agentflow-badge--info',
    nodes: [
      { id: 'code_analyzer', name: 'Code Analyzer', description: 'Analyze code quality and security', nodeType: 'agent' },
      { id: 'condition', name: 'Condition', description: 'Branch based on condition', nodeType: 'condition' },
      { id: 'switch', name: 'Switch', description: 'Multiple condition branches', nodeType: 'condition' },
      { id: 'loop', name: 'Loop', description: 'Repeat actions', nodeType: 'condition' }
    ]
  },
  {
    name: 'Communication',
    icon: Mail,
    color: 'agentflow-badge--danger',
    nodes: [
      { id: 'email_sender', name: 'Email Sender', description: 'Send emails with attachments', nodeType: 'agent' },
      { id: 'email_action', name: 'Send Email', description: 'Send email notifications', nodeType: 'action' },
      { id: 'notification_action', name: 'Notification', description: 'Send notifications', nodeType: 'action' },
      { id: 'webhook_action', name: 'Webhook', description: 'Call external webhook', nodeType: 'action' }
    ]
  },
  {
    name: 'File Operations',
    icon: FileText,
    color: 'agentflow-badge--secondary',
    nodes: [
      { id: 'file_handler', name: 'File Handler', description: 'Read, write, and manage files', nodeType: 'agent' },
      { id: 'file_upload', name: 'File Upload', description: 'Handle file uploads', nodeType: 'agent' },
      { id: 'file_processor', name: 'File Processor', description: 'Process uploaded files', nodeType: 'agent' }
    ]
  },
  {
    name: 'Integration',
    icon: Globe,
    color: 'agentflow-badge--secondary',
    nodes: [
      { id: 'api_caller', name: 'API Caller', description: 'Make HTTP API calls', nodeType: 'agent' },
      { id: 'webhook_handler', name: 'Webhook Handler', description: 'Handle webhook events', nodeType: 'agent' },
      { id: 'database_action', name: 'Database', description: 'Database operations', nodeType: 'action' }
    ]
  }
]

export const AgentPalette: React.FC = () => {
  const onDragStart = (event: React.DragEvent, node: any) => {
    const dragData = JSON.stringify({
      nodeType: node.nodeType,
      agentType: node.id,
      label: node.name
    })
    event.dataTransfer.setData('application/reactflow', dragData)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div className="w-80 bg-white border-r border-gray-300 p-4 overflow-y-auto">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Agent Palette
          </h2>
          <p className="text-sm text-gray-600">
            Drag agents to the canvas to build your workflow
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search agents..."
            className="w-full pl-10 pr-4 py-2 bg-bg-tertiary border border-gray-300 rounded-lg text-gray-900 placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Node Categories */}
        {nodeCategories.map((category) => (
          <div key={category.name}>
            <div className="flex items-center gap-2 mb-3">
              <category.icon className="h-4 w-4 text-gray-900" />
              <h3 className="font-medium text-gray-900">{category.name}</h3>
              <Badge variant={category.color as any} size="sm">
                {category.nodes.length}
              </Badge>
            </div>
            
            <div className="space-y-2">
              {category.nodes.map((node) => (
                <div
                  key={node.id}
                  draggable
                  onDragStart={(event) => onDragStart(event, node)}
                  className="p-3 bg-bg-tertiary rounded-lg cursor-grab hover:bg-bg-glass transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-gradient-primary to-gradient-secondary rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <category.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm mb-1">
                        {node.name}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {node.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Custom Agents */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-4 w-4 text-gray-900" />
            <h3 className="font-medium text-gray-900">Custom Agents</h3>
          </div>
          
          <div className="p-4 bg-bg-tertiary rounded-lg border-2 border-dashed border-gray-300 text-center">
            <Image className="h-8 w-8 text-gray-500 mx-auto mb-2" />
            <p className="text-sm text-gray-500 mb-3">
              Create your own custom agents
            </p>
            <button className="text-xs text-blue-500 hover:text-gradient-secondary font-medium">
              + Create Custom Agent
            </button>
          </div>
        </div>

        {/* Recent Nodes */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="h-4 w-4 text-gray-900" />
            <h3 className="font-medium text-gray-900">Recently Used</h3>
          </div>
          
          <div className="space-y-2">
            {[
              { name: 'Text Generator', id: 'llm_text_generator', nodeType: 'agent' },
              { name: 'Data Processor', id: 'data_processor', nodeType: 'agent' },
              { name: 'Condition', id: 'condition', nodeType: 'condition' },
              { name: 'Send Email', id: 'email_action', nodeType: 'action' }
            ].map((node) => (
              <div
                key={node.id}
                draggable
                onDragStart={(event) => onDragStart(event, node)}
                className="p-2 bg-bg-tertiary rounded cursor-grab hover:bg-bg-glass transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-gradient-primary to-gradient-secondary rounded flex items-center justify-center">
                    <Code className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm text-gray-900">{node.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
