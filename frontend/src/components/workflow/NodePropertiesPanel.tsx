import React, { useState } from 'react'
import { X, Save, RefreshCw } from 'lucide-react'
import { CoronaButton } from '../ui/CoronaButton'
import { CoronaCard } from '../ui/CoronaCard'
import { useCoronaDesign } from '../../hooks/useCoronaDesign'

interface NodePropertiesPanelProps {
  selectedNode: any
  onClose: () => void
  onUpdateNode: (nodeId: string, data: any) => void
}

export const NodePropertiesPanel: React.FC<NodePropertiesPanelProps> = ({
  selectedNode,
  onClose,
  onUpdateNode
}) => {
  const design = useCoronaDesign()
  const [formData, setFormData] = useState(selectedNode?.data || {})
  const [isDirty, setIsDirty] = useState(false)

  if (!selectedNode) return null

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
    setIsDirty(true)
  }

  const handleSave = () => {
    onUpdateNode(selectedNode.id, formData)
    setIsDirty(false)
  }

  const handleReset = () => {
    setFormData(selectedNode.data)
    setIsDirty(false)
  }

  const renderAgentConfig = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: design.spacing.md }}>
      <div>
        <label style={{ 
          ...design.text('body'),
          color: design.colors.textPrimary,
          marginBottom: design.spacing.xs,
          display: 'block'
        }}>
          Agent Type
        </label>
        <select
          value={formData.agentType || ''}
          onChange={(e) => handleInputChange('agentType', e.target.value)}
          style={{
            width: '100%',
            padding: `${design.spacing.sm} ${design.spacing.md}`,
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
        >
          <option value="llm_text_generator">Text Generator</option>
          <option value="llm_chat">Chat Agent</option>
          <option value="llm_summarizer">Text Summarizer</option>
          <option value="data_processor">Data Processor</option>
          <option value="api_caller">API Caller</option>
        </select>
      </div>

      <div>
        <label style={{ 
          ...design.text('body'),
          color: design.colors.textPrimary,
          marginBottom: design.spacing.xs,
          display: 'block'
        }}>
          Model
        </label>
        <select
          value={formData.config?.model || 'gpt-3.5-turbo'}
          onChange={(e) => handleInputChange('config', { ...formData.config, model: e.target.value })}
          style={{
            width: '100%',
            padding: `${design.spacing.sm} ${design.spacing.md}`,
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
        >
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          <option value="gpt-4">GPT-4</option>
          <option value="claude-3">Claude 3</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Temperature
        </label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={formData.config?.temperature || 0.7}
          onChange={(e) => handleInputChange('config', { ...formData.config, temperature: parseFloat(e.target.value) })}
          className="w-full"
        />
        <div className="text-xs text-gray-500 text-center">
          {formData.config?.temperature || 0.7}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Max Tokens
        </label>
        <input
          type="number"
          value={formData.config?.maxTokens || 1000}
          onChange={(e) => handleInputChange('config', { ...formData.config, maxTokens: parseInt(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  )

  const renderConditionConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Condition Expression
        </label>
        <textarea
          value={formData.condition || ''}
          onChange={(e) => handleInputChange('condition', e.target.value)}
          placeholder="e.g., data.value > 10"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          True Label
        </label>
        <input
          type="text"
          value={formData.config?.trueLabel || 'True'}
          onChange={(e) => handleInputChange('config', { ...formData.config, trueLabel: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          False Label
        </label>
        <input
          type="text"
          value={formData.config?.falseLabel || 'False'}
          onChange={(e) => handleInputChange('config', { ...formData.config, falseLabel: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  )

  const renderTriggerConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Trigger Type
        </label>
        <select
          value={formData.triggerType || 'manual'}
          onChange={(e) => handleInputChange('triggerType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="manual">Manual</option>
          <option value="schedule">Schedule</option>
          <option value="webhook">Webhook</option>
          <option value="file">File Change</option>
        </select>
      </div>

      {formData.triggerType === 'schedule' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cron Expression
          </label>
          <input
            type="text"
            value={formData.config?.cron || '0 9 * * *'}
            onChange={(e) => handleInputChange('config', { ...formData.config, cron: e.target.value })}
            placeholder="0 9 * * *"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {formData.triggerType === 'webhook' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Webhook URL
          </label>
          <input
            type="url"
            value={formData.config?.webhookUrl || ''}
            onChange={(e) => handleInputChange('config', { ...formData.config, webhookUrl: e.target.value })}
            placeholder="https://api.example.com/webhook"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  )

  const renderActionConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Action Type
        </label>
        <select
          value={formData.actionType || 'notification'}
          onChange={(e) => handleInputChange('actionType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="email">Email</option>
          <option value="notification">Notification</option>
          <option value="webhook">Webhook</option>
          <option value="database">Database</option>
        </select>
      </div>

      {formData.actionType === 'email' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To Email
            </label>
            <input
              type="email"
              value={formData.config?.toEmail || ''}
              onChange={(e) => handleInputChange('config', { ...formData.config, toEmail: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={formData.config?.subject || ''}
              onChange={(e) => handleInputChange('config', { ...formData.config, subject: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </>
      )}
    </div>
  )

  const renderConfigForm = () => {
    switch (selectedNode.type) {
      case 'agentNode':
        return renderAgentConfig()
      case 'conditionNode':
        return renderConditionConfig()
      case 'triggerNode':
        return renderTriggerConfig()
      case 'actionNode':
        return renderActionConfig()
      default:
        return <div>No configuration available</div>
    }
  }

  return (
    <div style={{
      width: '320px',
      height: '100vh',
      backgroundColor: design.colors.bgSecondary,
      borderLeft: `1px solid ${design.colors.borderPrimary}`,
      padding: design.spacing.md,
      overflowY: 'auto',
      position: 'fixed',
      right: 0,
      top: 0,
      zIndex: 1000,
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: design.spacing.md, height: '100%' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          paddingBottom: design.spacing.sm,
          borderBottom: `1px solid ${design.colors.borderPrimary}`
        }}>
          <h3 style={{ 
            ...design.text('heading'),
            color: design.colors.textPrimary,
            margin: 0
          }}>
            Node Properties
          </h3>
          <button
            onClick={onClose}
            style={{
              padding: design.spacing.xs,
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: design.spacing.xs,
              cursor: 'pointer',
              color: design.colors.textMuted,
              transition: 'all 0.2s ease-in-out',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = design.colors.bgTertiary
              e.currentTarget.style.color = design.colors.textPrimary
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = design.colors.textMuted
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Node Info */}
        <CoronaCard style={{ padding: design.spacing.sm }}>
          <div style={{ 
            ...design.text('body'),
            color: design.colors.textSecondary
          }}>
            <div style={{ 
              fontWeight: design.typography.weights.semibold,
              color: design.colors.textPrimary,
              marginBottom: design.spacing.xs
            }}>
              {selectedNode.data?.label || 'Unnamed Node'}
            </div>
            <div style={{ 
              ...design.text('caption'),
              color: design.colors.textMuted
            }}>
              Type: {selectedNode.type}
            </div>
          </div>
        </CoronaCard>

        {/* Configuration Form */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: design.spacing.md,
          flex: 1,
          overflowY: 'auto'
        }}>
          <div>
            <label style={{ 
              ...design.text('body'),
              color: design.colors.textPrimary,
              marginBottom: design.spacing.xs,
              display: 'block'
            }}>
              Label
            </label>
            <input
              type="text"
              value={formData.label || ''}
              onChange={(e) => handleInputChange('label', e.target.value)}
              style={{
                width: '100%',
                padding: `${design.spacing.sm} ${design.spacing.md}`,
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

          {renderConfigForm()}
        </div>

        {/* Actions */}
        <div style={{ 
          display: 'flex', 
          gap: design.spacing.sm, 
          paddingTop: design.spacing.md, 
          borderTop: `1px solid ${design.colors.borderPrimary}`,
          marginTop: 'auto'
        }}>
          <CoronaButton
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={!isDirty}
            style={{ flex: 1 }}
          >
            <Save className="w-4 h-4" style={{ marginRight: design.spacing.xs }} />
            Save
          </CoronaButton>
          <CoronaButton
            variant="secondary"
            size="sm"
            onClick={handleReset}
            disabled={!isDirty}
          >
            <RefreshCw className="w-4 h-4" />
          </CoronaButton>
        </div>
      </div>
    </div>
  )
}
