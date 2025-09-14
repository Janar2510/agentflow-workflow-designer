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
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'

interface WorkflowToolbarProps {
  onSave: () => void
  onRun: () => void
  onStop?: () => void
  onOpenWorkflowManager?: () => void
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
  isReadOnly = false,
  selectedNodes = [],
  isExecuting = false,
  hasUnsavedChanges = false
}) => {
  return (
    <div className="bg-white border-b border-gray-300 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenWorkflowManager}
            className="flex items-center gap-2"
          >
            <FolderOpen className="h-4 w-4" />
            Workflows
          </Button>
          
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-gray-900">
              Workflow Editor
            </h1>
            {hasUnsavedChanges && (
              <Badge variant="warning" size="sm">
                Unsaved
              </Badge>
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
          <Button variant="ghost" size="sm" className="p-2">
            <Eye className="h-4 w-4" />
          </Button>

          {/* Save */}
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={onSave}
            disabled={isReadOnly}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save
          </Button>

          {/* Run/Stop */}
          {isExecuting ? (
            <Button 
              variant="danger" 
              size="sm"
              onClick={onStop}
              className="flex items-center gap-2"
            >
              <Square className="h-4 w-4" />
              Stop
            </Button>
          ) : (
            <Button 
              size="sm" 
              onClick={onRun}
              disabled={isReadOnly}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Run
            </Button>
          )}

          {/* Divider */}
          <div className="w-px h-6 bg-border-primary mx-2"></div>

          {/* Import/Export */}
          <Button variant="ghost" size="sm" className="p-2" title="Import">
            <Upload className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="sm" className="p-2" title="Export">
            <Download className="h-4 w-4" />
          </Button>

          {/* Share */}
          <Button variant="ghost" size="sm" className="p-2" title="Share">
            <Share2 className="h-4 w-4" />
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="sm" className="p-2" title="Settings">
            <Settings className="h-4 w-4" />
          </Button>

          {/* More Actions */}
          <Button variant="ghost" size="sm" className="p-2" title="More actions">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
