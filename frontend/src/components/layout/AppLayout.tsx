import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  LayoutDashboard, 
  Workflow, 
  FileText, 
  Bot, 
  Settings, 
  UserPlus, 
  LogIn,
  MessageCircle,
  MessageSquare
} from 'lucide-react'

interface AppLayoutProps {
  children: React.ReactNode
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation()

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Workflow Editor', href: '/workflow', icon: Workflow },
    { name: 'Templates', href: '/templates', icon: FileText },
    { name: 'Agents', href: '/agents', icon: Bot },
    { name: 'Community', href: '/community', icon: MessageCircle },
    { name: 'Community Test', href: '/community-test', icon: MessageSquare },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  const authNavigation = [
    { name: 'Login', href: '/login', icon: LogIn },
    { name: 'Register', href: '/register', icon: UserPlus },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0f0f1c',
      color: '#ffffff',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>

      {/* Sidebar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 50,
        width: '256px',
        transform: 'translateX(0)',
        backgroundColor: '#1a1a2e',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%' 
        }}>
          {/* Logo */}
          <div style={{
            display: 'flex',
            height: '64px',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Bot style={{ height: '2rem', width: '2rem', marginRight: '0.75rem', color: '#007AFF' }} />
              <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ffffff' }}>
                AgentFlow
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <nav style={{ 
            flex: 1, 
            padding: '1rem', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '0.5rem' 
          }}>
            {navigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    backgroundColor: active ? 'linear-gradient(135deg, #007AFF, #8b5cf6)' : 'transparent',
                    background: active ? 'linear-gradient(135deg, #007AFF, #8b5cf6)' : 'transparent',
                    color: active ? '#ffffff' : '#a0a9c0'
                  }}
                >
                  <Icon style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.75rem' }} />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Auth Navigation */}
          <div style={{
            padding: '1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {authNavigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem 1rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      textDecoration: 'none',
                      color: '#a0a9c0',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Icon style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.75rem' }} />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ marginLeft: '256px' }}>
        {/* Top bar */}
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          display: 'flex',
          height: '64px',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          backgroundColor: 'rgba(26, 26, 46, 0.8)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                background: 'linear-gradient(135deg, #007AFF, #3b82f6)',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Bot style={{ height: '1rem', width: '1rem', marginRight: '0.5rem' }} />
              Create Agent
            </button>
          </div>
        </div>

        {/* Page content */}
        <main style={{ flex: 1, padding: '1.5rem' }}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default AppLayout