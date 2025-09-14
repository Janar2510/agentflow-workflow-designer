import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  Home, 
  Workflow, 
  Plus, 
  FileText, 
  Store, 
  Settings, 
  BarChart3,
  Users,
  Zap,
  MessageCircle,
  MessageSquare,
  Users2
} from 'lucide-react'
import { useWorkflowStore } from '../../stores/workflowStore'
import { cn } from '../../lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'My Workflows', href: '/dashboard', icon: Workflow },
  { name: 'Templates', href: '/templates', icon: FileText },
  { name: 'Agent Marketplace', href: '/marketplace', icon: Store },
  { name: 'Community', href: '/community', icon: MessageCircle },
  { name: 'Community Forum', href: '/community-real', icon: MessageSquare },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Team', href: '/team', icon: Users2 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

const quickActions = [
  { name: 'New Workflow', href: '/workflow/new', icon: Plus, variant: 'primary' as const },
  { name: 'Quick Start', href: '/templates?featured=true', icon: Zap, variant: 'success' as const },
]

export const Sidebar: React.FC = () => {
  const { sidebarOpen } = useWorkflowStore()

  return (
    <aside className={cn(
      'fixed left-0 top-0 z-40 h-full w-64 bg-white border-r border-gray-300 transition-transform duration-300',
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    )}>
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gradient-primary to-gradient-secondary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">AF</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">AgentFlow</h2>
              <p className="text-xs text-gray-500">Visual AI Workflows</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b border-gray-300">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Quick Actions
          </h3>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <NavLink
                key={action.name}
                to={action.href}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                    isActive
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-bg-tertiary'
                  )
                }
              >
                <action.icon className="h-4 w-4" />
                {action.name}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Navigation
          </h3>
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                      isActive
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-bg-tertiary'
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-300">
          <div className="agentflow-glass p-3 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-gray-900">System Status</span>
            </div>
            <p className="text-xs text-gray-500">
              All systems operational
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
