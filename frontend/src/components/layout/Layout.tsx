import React from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useWorkflowStore } from '../../stores/workflowStore'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { sidebarOpen } = useWorkflowStore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarOpen ? 'ml-64' : 'ml-0'
      }`}>
        {/* Header */}
        <Header />
        
        {/* Page Content */}
        <main className="flex-1 p-6">
          <div className="agentflow-container">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
