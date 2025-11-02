import React from 'react'
import { CoronaCard } from '../ui/CoronaCard'
import { CoronaBadge } from '../ui/CoronaBadge'
import { useCoronaDesign } from '../../hooks/useCoronaDesign'
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
  const design = useCoronaDesign()

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
    <div className="w-80 p-4 overflow-y-auto" style={{ backgroundColor: design.colors.bgSecondary, borderRight: `1px solid ${design.colors.borderPrimary}` }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: design.spacing.lg }}>
        {/* Header */}
        <div>
          <h2 style={{ 
            ...design.text('heading'),
            color: design.colors.textPrimary,
            marginBottom: design.spacing.sm,
            fontSize: design.typography.sizes.lg,
            fontWeight: design.typography.weights.semibold
          }}>
            Agent Palette
          </h2>
          <p style={{ 
            ...design.text('body'),
            color: design.colors.textSecondary,
            fontSize: design.typography.sizes.sm
          }}>
            Drag agents to the canvas to build your workflow
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: design.colors.textMuted }} />
          <input
            type="text"
            placeholder="Search agents..."
            style={{
              width: '100%',
              paddingLeft: '2.5rem',
              paddingRight: design.spacing.md,
              paddingTop: design.spacing.sm,
              paddingBottom: design.spacing.sm,
              backgroundColor: design.colors.bgTertiary,
              border: `1px solid ${design.colors.borderPrimary}`,
              borderRadius: design.spacing.sm,
              color: design.colors.textPrimary,
              fontSize: design.typography.sizes.sm,
              outline: 'none',
              transition: 'all 0.2s ease-in-out',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = design.colors.primary
              e.target.style.boxShadow = `0 0 0 2px ${design.colors.primary}20`
            }}
            onBlur={(e) => {
              e.target.style.borderColor = design.colors.borderPrimary
              e.target.style.boxShadow = 'none'
            }}
          />
        </div>

        {/* Node Categories */}
        {nodeCategories.map((category) => (
          <div key={category.name}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: design.spacing.sm, 
              marginBottom: design.spacing.sm 
            }}>
              <category.icon className="h-4 w-4" style={{ color: design.colors.textPrimary }} />
              <h3 style={{ 
                ...design.text('body'),
                fontWeight: design.typography.weights.medium,
                color: design.colors.textPrimary
              }}>
                {category.name}
              </h3>
              <CoronaBadge variant={category.color as any} size="sm">
                {category.nodes.length}
              </CoronaBadge>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: design.spacing.sm }}>
              {category.nodes.map((node) => (
                <div
                  key={node.id}
                  draggable
                  onDragStart={(event) => onDragStart(event, node)}
                  style={{
                    padding: design.spacing.sm,
                    backgroundColor: design.colors.bgTertiary,
                    borderRadius: design.spacing.sm,
                    cursor: 'grab',
                    transition: 'all 0.2s ease-in-out',
                    border: `1px solid ${design.colors.borderPrimary}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = design.colors.primary + '20'
                    e.currentTarget.style.borderColor = design.colors.primary
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.boxShadow = `0 4px 12px rgba(0, 0, 0, 0.3)`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = design.colors.bgTertiary
                    e.currentTarget.style.borderColor = design.colors.borderPrimary
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: design.spacing.sm }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      background: `linear-gradient(135deg, ${design.colors.primary}, ${design.colors.secondary})`,
                      borderRadius: design.spacing.sm,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'transform 0.2s ease-in-out',
                    }}>
                      <category.icon className="h-4 w-4" style={{ color: design.colors.white }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ 
                        ...design.text('body'),
                        fontWeight: design.typography.weights.semibold,
                        color: design.colors.textPrimary,
                        fontSize: design.typography.sizes.sm,
                        marginBottom: design.spacing.xs,
                        lineHeight: 1.4
                      }}>
                        {node.name}
                      </h4>
                      <p style={{ 
                        ...design.text('caption'),
                        color: design.colors.textSecondary,
                        fontSize: design.typography.sizes.xs,
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
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
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: design.spacing.sm, 
            marginBottom: design.spacing.sm 
          }}>
            <Shield className="h-4 w-4" style={{ color: design.colors.textPrimary }} />
            <h3 style={{ 
              ...design.text('body'),
              fontWeight: design.typography.weights.medium,
              color: design.colors.textPrimary
            }}>
              Custom Agents
            </h3>
          </div>
          
          <div style={{
            padding: design.spacing.md,
            backgroundColor: design.colors.bgTertiary,
            borderRadius: design.spacing.sm,
            border: `2px dashed ${design.colors.borderPrimary}`,
            textAlign: 'center'
          }}>
            <Image className="h-8 w-8 mx-auto mb-2" style={{ color: design.colors.textMuted }} />
            <p style={{ 
              ...design.text('body'),
              color: design.colors.textSecondary,
              fontSize: design.typography.sizes.sm,
              marginBottom: design.spacing.sm
            }}>
              Create your own custom agents
            </p>
            <button style={{
              ...design.text('caption'),
              color: design.colors.primary,
              fontWeight: design.typography.weights.medium,
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'color 0.2s ease-in-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = design.colors.secondary
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = design.colors.primary
            }}
            >
              + Create Custom Agent
            </button>
          </div>
        </div>

        {/* Recent Nodes */}
        <div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: design.spacing.sm, 
            marginBottom: design.spacing.sm 
          }}>
            <BarChart3 className="h-4 w-4" style={{ color: design.colors.textPrimary }} />
            <h3 style={{ 
              ...design.text('body'),
              fontWeight: design.typography.weights.medium,
              color: design.colors.textPrimary
            }}>
              Recently Used
            </h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: design.spacing.sm }}>
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
                style={{
                  padding: design.spacing.sm,
                  backgroundColor: design.colors.bgTertiary,
                  borderRadius: design.spacing.sm,
                  cursor: 'grab',
                  transition: 'all 0.2s ease-in-out',
                  border: `1px solid ${design.colors.borderPrimary}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = design.colors.primary + '20'
                  e.currentTarget.style.borderColor = design.colors.primary
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = design.colors.bgTertiary
                  e.currentTarget.style.borderColor = design.colors.borderPrimary
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: design.spacing.sm }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    background: `linear-gradient(135deg, ${design.colors.primary}, ${design.colors.secondary})`,
                    borderRadius: design.spacing.xs,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Code className="h-3 w-3" style={{ color: design.colors.white }} />
                  </div>
                  <span style={{ 
                    ...design.text('body'),
                    color: design.colors.textPrimary,
                    fontSize: design.typography.sizes.sm
                  }}>
                    {node.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
