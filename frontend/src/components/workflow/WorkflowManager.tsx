import React, { useState } from 'react'
import { Plus, FolderOpen, Save, Trash2, Copy, Download, Upload, AlertCircle } from 'lucide-react'
import { CoronaButton } from '../ui/CoronaButton'
import { CoronaCard } from '../ui/CoronaCard'
import { Input } from '../ui/Input'
import { useWorkflowStore } from '../../stores/workflowStore'

interface WorkflowManagerProps {
  onWorkflowSelect?: (workflowId: string) => void
  onClose?: () => void
}

export const WorkflowManager: React.FC<WorkflowManagerProps> = ({
  onWorkflowSelect,
  onClose
}) => {
  const {
    workflows,
    currentWorkflow,
    createWorkflow,
    loadWorkflow,
    deleteWorkflow,
    duplicateWorkflow,
    exportWorkflow,
    importWorkflow
  } = useWorkflowStore()

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newWorkflowName, setNewWorkflowName] = useState('')
  const [newWorkflowDescription, setNewWorkflowDescription] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [importData, setImportData] = useState('')

  const handleCreateWorkflow = () => {
    if (newWorkflowName.trim()) {
      createWorkflow(newWorkflowName.trim(), newWorkflowDescription.trim())
      setNewWorkflowName('')
      setNewWorkflowDescription('')
      setShowCreateForm(false)
    }
  }

  const handleLoadWorkflow = (workflowId: string) => {
    loadWorkflow(workflowId)
    onWorkflowSelect?.(workflowId)
  }

  const handleDeleteWorkflow = (workflowId: string) => {
    if (confirm('Are you sure you want to delete this workflow?')) {
      deleteWorkflow(workflowId)
    }
  }

  const handleDuplicateWorkflow = (workflowId: string) => {
    duplicateWorkflow(workflowId)
  }

  const handleExportWorkflow = () => {
    const data = exportWorkflow()
    if (data) {
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${currentWorkflow?.name || 'workflow'}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const handleImportWorkflow = () => {
    try {
      importWorkflow(importData)
      setImportData('')
      setShowImportDialog(false)
    } catch (error) {
      alert('Failed to import workflow. Please check the file format.')
    }
  }

  const filteredWorkflows = workflows.filter(workflow =>
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="w-96 p-4 overflow-y-auto" style={{ backgroundColor: '#1a1a2e', borderRight: '1px solid rgba(255, 255, 255, 0.1)' }}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold" style={{ color: '#ffffff' }}>Workflows</h2>
          <CoronaButton variant="ghost" size="sm" onClick={onClose}>
            ×
          </CoronaButton>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search workflows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <CoronaButton
            variant="primary"
            size="sm"
            onClick={() => setShowCreateForm(true)}
            className="flex-1"
          >
            <Plus className="w-4 h-4 mr-2" />
            New
          </CoronaButton>
          <CoronaButton
            variant="secondary"
            size="sm"
            onClick={() => setShowImportDialog(true)}
          >
            <Upload className="w-4 h-4" />
          </CoronaButton>
          <CoronaButton
            variant="secondary"
            size="sm"
            onClick={handleExportWorkflow}
            disabled={!currentWorkflow}
          >
            <Download className="w-4 h-4" />
          </CoronaButton>
        </div>

        {/* Create Workflow Form */}
        {showCreateForm && (
          <CoronaCard className="p-4">
            <h3 className="font-medium text-gray-900 mb-3">Create New Workflow</h3>
            <div className="space-y-3">
              <Input
                placeholder="Workflow name"
                value={newWorkflowName}
                onChange={setNewWorkflowName}
              />
              <textarea
                placeholder="Description (optional)"
                value={newWorkflowDescription}
                onChange={(e) => setNewWorkflowDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
              <div className="flex gap-2">
                <CoronaButton
                  variant="primary"
                  size="sm"
                  onClick={handleCreateWorkflow}
                  disabled={!newWorkflowName.trim()}
                >
                  Create
                </CoronaButton>
                <CoronaButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </CoronaButton>
              </div>
            </div>
          </CoronaCard>
        )}

        {/* Import Dialog */}
        {showImportDialog && (
          <CoronaCard className="p-4">
            <h3 className="font-medium text-gray-900 mb-3">Import Workflow</h3>
            <div className="space-y-3">
              <textarea
                placeholder="Paste workflow JSON data here"
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={6}
              />
              <div className="flex gap-2">
                <CoronaButton
                  variant="primary"
                  size="sm"
                  onClick={handleImportWorkflow}
                  disabled={!importData.trim()}
                >
                  Import
                </CoronaButton>
                <CoronaButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowImportDialog(false)}
                >
                  Cancel
                </CoronaButton>
              </div>
            </div>
          </CoronaCard>
        )}

        {/* Workflow List */}
        <div className="space-y-2">
          {filteredWorkflows.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              {searchTerm ? 'No workflows found' : 'No workflows yet'}
            </div>
          ) : (
            filteredWorkflows.map((workflow) => (
              <CoronaCard
                key={workflow.id}
                className={`p-3 cursor-pointer transition-colors ${
                  currentWorkflow?.id === workflow.id
                    ? 'bg-blue-50 border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleLoadWorkflow(workflow.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm mb-1">
                      {workflow.name}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {workflow.description || 'No description'}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-400">
                        v{workflow.version}
                      </span>
                      <span className="text-xs text-gray-400">
                        {workflow.status}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(workflow.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 ml-2">
                    <CoronaButton
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e?.stopPropagation()
                        handleDuplicateWorkflow(workflow.id)
                      }}
                      className="p-1"
                    >
                      <Copy className="w-3 h-3" />
                    </CoronaButton>
                    <CoronaButton
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e?.stopPropagation()
                        handleDeleteWorkflow(workflow.id)
                      }}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </CoronaButton>
                  </div>
                </div>
              </CoronaCard>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
