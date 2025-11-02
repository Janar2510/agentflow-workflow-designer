import React from 'react'
import { 
  Save, 
  Play, 
  Square, 
  Download, 
  Upload, 
  Settings, 
  Share2, 
  Eye,
  EyeOff,
  MoreHorizontal,
  FolderOpen
} from 'lucide-react'
import { CoronaButton } from '../ui/CoronaButton'
import { CoronaBadge } from '../ui/CoronaBadge'

interface WorkflowToolbarProps {
  onSave: () => void
  onRun: () => void
  onStop?: () => void
  onOpenWorkflowManager?: () => void
  onClearWorkflow?: () => void
  onEmergencyReset?: () => void
  isReadOnly?: boolean
  selectedNodes?: string[]
  isExecuting?: boolean
  hasUnsavedChanges?: boolean
}

export const WorkflowToolbar: React.FC<WorkflowToolbarProps> = ({
  onSave,
  onRun,
  onStop,
  onOpenWorkflowManager,
  onClearWorkflow,
  onEmergencyReset,
  isReadOnly = false,
  selectedNodes = [],
  isExecuting = false,
  hasUnsavedChanges = false
}) => {
  return (
    <div className="px-6 py-4" style={{ backgroundColor: '#1a1a2e', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <CoronaButton
            variant="ghost"
            size="sm"
            onClick={onOpenWorkflowManager}
            className="flex items-center gap-2"
          >
            <FolderOpen className="h-4 w-4" />
            Workflows
          </CoronaButton>
          
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-gray-900">
              Workflow Editor
            </h1>
            {hasUnsavedChanges && (
              <CoronaBadge variant="warning" size="sm">
                Unsaved
              </CoronaBadge>
            )}
          </div>
          
          {selectedNodes.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{selectedNodes.length} node{selectedNodes.length > 1 ? 's' : ''} selected</span>
            </div>
          )}
        </div>

        {/* Center Section - Execution Status */}
        <div className="flex items-center gap-4">
          {isExecuting ? (
            <div className="flex items-center gap-2 text-yellow-500">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Executing...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-500">
              <div className="w-2 h-2 bg-text-muted rounded-full"></div>
              <span className="text-sm">Ready</span>
            </div>
          )}
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <CoronaButton variant="ghost" size="sm" className="p-2">
            <Eye className="h-4 w-4" />
          </CoronaButton>

          {/* Save */}
          <CoronaButton 
            variant="secondary" 
            size="sm" 
            onClick={onSave}
            disabled={isReadOnly}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save
          </CoronaButton>

          {/* Clear Workflow */}
          {onClearWorkflow && (
            <CoronaButton 
              variant="outline" 
              size="sm" 
              onClick={onClearWorkflow}
              disabled={isReadOnly}
              className="flex items-center gap-2 text-red-500 border-red-500 hover:bg-red-50"
            >
              <Square className="h-4 w-4" />
              Clear
            </CoronaButton>
          )}

          {/* Emergency Reset */}
          {onEmergencyReset && (
            <CoronaButton 
              variant="primary" 
              size="sm" 
              onClick={onEmergencyReset}
              disabled={isReadOnly}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            >
              <Play className="h-4 w-4" />
              Reset
            </CoronaButton>
          )}

          {/* Run/Stop */}
          {isExecuting ? (
            <CoronaButton 
              variant="danger" 
              size="sm"
              onClick={onStop}
              className="flex items-center gap-2"
            >
              <Square className="h-4 w-4" />
              Stop
            </CoronaButton>
          ) : (
            <CoronaButton 
              size="sm" 
              onClick={onRun}
              disabled={isReadOnly}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Run
            </CoronaButton>
          )}

          {/* Divider */}
          <div className="w-px h-6 bg-border-primary mx-2"></div>

          {/* Import/Export */}
          <CoronaButton variant="ghost" size="sm" className="p-2" title="Import">
            <Upload className="h-4 w-4" />
          </CoronaButton>
          
          <CoronaButton variant="ghost" size="sm" className="p-2" title="Export">
            <Download className="h-4 w-4" />
          </CoronaButton>

          {/* Share */}
          <CoronaButton variant="ghost" size="sm" className="p-2" title="Share">
            <Share2 className="h-4 w-4" />
          </CoronaButton>

          {/* Settings */}
          <CoronaButton variant="ghost" size="sm" className="p-2" title="Settings">
            <Settings className="h-4 w-4" />
          </CoronaButton>

          {/* More Actions */}
          <CoronaButton variant="ghost" size="sm" className="p-2" title="More actions">
            <MoreHorizontal className="h-4 w-4" />
          </CoronaButton>
        </div>
      </div>
    </div>
  )
}
