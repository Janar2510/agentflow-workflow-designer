import React from 'react'
import { WorkflowEditorWithProvider } from '../components/workflow/WorkflowEditor'

export const WorkflowEditorPage: React.FC = () => {
  const handleSave = (workflowData: any) => {
    console.log('Saving workflow:', workflowData)
    // TODO: Implement actual save functionality
  }

  return (
    <div className="h-screen">
      <WorkflowEditorWithProvider 
        onSave={handleSave}
        isReadOnly={false}
      />
    </div>
  )
}

export default WorkflowEditorPage