import React, { useState } from 'react'
import CoronaSidebar from './CoronaSidebar'
import CoronaHeader from './CoronaHeader'
import { useCoronaDesign } from '../../contexts/CoronaDesignContext'

interface AppLayoutProps {
  children: React.ReactNode
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const design = useCoronaDesign()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: design.colors.bgPrimary,
      color: design.colors.textPrimary,
      fontFamily: design.typography.fontFamily
    }}>
      {/* Corona Admin Sidebar */}
      <CoronaSidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={toggleSidebar} 
      />

      {/* Main content */}
      <div style={{ 
        marginLeft: sidebarCollapsed ? '80px' : '280px',
        transition: 'margin-left 0.3s ease-in-out'
      }}>
        {/* Header with dropdown menus and Create Agent button */}
        <CoronaHeader />

        {/* Page content */}
        <main style={{ 
          flex: 1, 
          padding: design.spacing.lg,
          backgroundColor: design.colors.bgPrimary,
          minHeight: 'calc(100vh - 64px)'
        }}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default AppLayout