import React from 'react'
import { WorkflowEditorWithProvider } from '../components/workflow/WorkflowEditor'
import { useCoronaDesign } from '../hooks/useCoronaDesign'

export const WorkflowEditorPage: React.FC = () => {
  const design = useCoronaDesign()
  
  const handleSave = (workflowData: any) => {
    console.log('Saving workflow:', workflowData)
    // TODO: Implement actual save functionality
  }

  const pageStyles: React.CSSProperties = {
    height: '100vh',
    backgroundColor: design.colors.bgPrimary,
    fontFamily: design.typography.fontFamily,
  }

  return (
    <div style={pageStyles}>
      <WorkflowEditorWithProvider 
        onSave={handleSave}
        isReadOnly={false}
      />
    </div>
  )
}

export default WorkflowEditorPage