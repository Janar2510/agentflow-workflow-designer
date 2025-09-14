import React from 'react'
import { Menu, Bell, Settings, User, LogOut } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useWorkflowStore } from '../../stores/workflowStore'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'

export const Header: React.FC = () => {
  const { user, logout } = useAuth()
  const { toggleSidebar, sidebarOpen } = useWorkflowStore()

  return (
    <header className="bg-white border-b border-gray-300 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="p-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-gradient-primary to-gradient-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AF</span>
            </div>
            <h1 className="text-xl font-bold text-gradient">
              AgentFlow
            </h1>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search workflows, agents..."
              className="w-full px-4 py-2 bg-bg-tertiary border border-gray-300 rounded-lg text-gray-900 placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="p-2 relative">
            <Bell className="h-5 w-5" />
            <Badge 
              variant="danger" 
              size="sm" 
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center"
            >
              3
            </Badge>
          </Button>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.full_name || user?.username}
              </p>
              <p className="text-xs text-gray-500">
                {user?.plan_type?.toUpperCase()}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="p-2">
                <Settings className="h-5 w-5" />
              </Button>
              
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-gradient-secondary rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout}
                className="p-2 text-gray-500 hover:text-red-500"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
