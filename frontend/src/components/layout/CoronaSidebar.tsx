import React, { useState } from 'react'
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
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Store,
  BarChart3,
  Users2,
  Zap,
  Plus
} from 'lucide-react'
import { useCoronaDesign } from '../../contexts/CoronaDesignContext'
import ProfileDropdown from '../ui/ProfileDropdown'

interface CoronaSidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export const CoronaSidebar: React.FC<CoronaSidebarProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation()
  const design = useCoronaDesign()

  const navigation = [
    { name: 'Home', href: '/', icon: Home, color: '#007AFF' },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, color: '#007AFF' },
    { name: 'Workflow Editor', href: '/workflow', icon: Workflow, color: '#5AC8FA' },
    { name: 'Templates', href: '/templates', icon: FileText, color: '#FF9500' },
    { name: 'Agents', href: '/agents', icon: Bot, color: '#34C759' },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, color: '#FF9500' },
    { name: 'Community', href: '/community', icon: MessageCircle, color: '#8b5cf6' },
    { name: 'Community Test', href: '/community-test', icon: MessageSquare, color: '#8b5cf6' },
    { name: 'Settings', href: '/settings', icon: Settings, color: '#6b7280' },
  ]

  const quickActions = [
    { name: 'New Workflow', href: '/workflow/new', icon: Plus, color: '#007AFF' },
    { name: 'Quick Start', href: '/templates?featured=true', icon: Zap, color: '#34C759' },
  ]

  const isActive = (path: string) => location.pathname === path

  const sidebarStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 100,
    width: isCollapsed ? '80px' : '280px',
    backgroundColor: design.colors.bgSecondary,
    borderRight: `1px solid ${design.colors.borderPrimary}`,
    transition: 'width 0.3s ease-in-out',
    overflow: 'visible'
  }

  const toggleButtonStyles: React.CSSProperties = {
    position: 'absolute',
    top: '20px',
    right: isCollapsed ? '24px' : '-16px',
    zIndex: 1000,
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: design.colors.primary,
    border: `2px solid ${design.colors.bgSecondary}`,
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease-in-out',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
  }

  const userProfileStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: design.spacing.lg,
    borderBottom: `1px solid ${design.colors.borderPrimary}`,
    marginBottom: design.spacing.md
  }

  const avatarStyles: React.CSSProperties = {
    width: isCollapsed ? '40px' : '60px',
    height: isCollapsed ? '40px' : '60px',
    borderRadius: '50%',
    backgroundColor: design.colors.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: isCollapsed ? 0 : design.spacing.sm,
    transition: 'all 0.3s ease-in-out',
    fontSize: isCollapsed ? '16px' : '24px',
    color: 'white',
    fontWeight: 'bold'
  }

  const userNameStyles: React.CSSProperties = {
    fontFamily: design.typography.fontFamily,
    fontSize: design.typography.sizes.base,
    color: design.colors.textPrimary,
    fontWeight: design.typography.weights.semibold,
    textAlign: 'center',
    opacity: isCollapsed ? 0 : 1,
    transition: 'opacity 0.3s ease-in-out',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  }

  const navStyles: React.CSSProperties = {
    flex: 1,
    padding: `0 ${design.spacing.md}`,
    display: 'flex',
    flexDirection: 'column',
    gap: design.spacing.xs
  }

  const menuItemStyles = (active: boolean, itemColor: string): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: isCollapsed ? 'center' : 'flex-start',
    padding: isCollapsed ? design.spacing.sm : `${design.spacing.sm} ${design.spacing.md}`,
    borderRadius: '0.75rem',
    fontSize: design.typography.sizes.sm,
    fontWeight: design.typography.weights.medium,
    textDecoration: 'none',
    transition: 'all 0.2s ease-in-out',
    backgroundColor: active ? `${itemColor}20` : 'transparent',
    color: active ? itemColor : design.colors.textSecondary,
    border: active ? `1px solid ${itemColor}40` : '1px solid transparent',
    position: 'relative',
    overflow: 'visible',
    width: isCollapsed ? '48px' : 'auto',
    height: '48px',
    margin: isCollapsed ? '0 auto' : '0'
  })

  const iconContainerStyles = (itemColor: string, active: boolean): React.CSSProperties => ({
    width: isCollapsed ? '32px' : '40px',
    height: isCollapsed ? '32px' : '40px',
    borderRadius: '50%',
    backgroundColor: active ? itemColor : `${itemColor}20`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: isCollapsed ? 0 : design.spacing.md,
    transition: 'all 0.3s ease-in-out',
    flexShrink: 0
  })

  const iconStyles = (itemColor: string, active: boolean): React.CSSProperties => ({
    width: isCollapsed ? '16px' : '20px',
    height: isCollapsed ? '16px' : '20px',
    color: active ? 'white' : itemColor,
    transition: 'all 0.2s ease-in-out'
  })

  const textStyles: React.CSSProperties = {
    fontFamily: design.typography.fontFamily,
    fontSize: design.typography.sizes.sm,
    color: 'inherit',
    fontWeight: 'inherit',
    opacity: isCollapsed ? 0 : 1,
    transition: 'opacity 0.3s ease-in-out',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  }

  const tooltipStyles: React.CSSProperties = {
    position: 'absolute',
    left: '100%',
    top: '50%',
    transform: 'translateY(-50%) translateX(-10px)',
    marginLeft: design.spacing.md,
    padding: `${design.spacing.sm} ${design.spacing.md}`,
    backgroundColor: design.colors.bgTertiary,
    color: design.colors.textPrimary,
    borderRadius: '0.5rem',
    fontSize: design.typography.sizes.sm,
    fontWeight: design.typography.weights.medium,
    whiteSpace: 'nowrap',
    opacity: 0,
    pointerEvents: 'none',
    transition: 'all 0.2s ease-in-out',
    zIndex: 9999,
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)',
    border: `1px solid ${design.colors.borderPrimary}`,
    minWidth: '120px',
    textAlign: 'center'
  }

  return (
    <div style={sidebarStyles}>
      {/* Toggle Button */}
      <button
        style={toggleButtonStyles}
        onClick={onToggle}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = design.colors.secondary
          e.currentTarget.style.transform = 'scale(1.1)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = design.colors.primary
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* User Profile */}
        <div style={userProfileStyles}>
          <div style={avatarStyles}>
            SJ
          </div>
          <div style={userNameStyles}>
            Stella Johnson
          </div>
        </div>

        {/* Profile Dropdown */}
        <div style={{ padding: `0 ${design.spacing.md}`, marginBottom: design.spacing.md }}>
          <ProfileDropdown isCollapsed={isCollapsed} />
        </div>

        {/* Quick Actions */}
        <div style={{ padding: `0 ${design.spacing.md}`, marginBottom: design.spacing.md }}>
          <div style={{
            fontFamily: design.typography.fontFamily,
            fontSize: design.typography.sizes.xs,
            color: design.colors.textMuted,
            fontWeight: design.typography.weights.semibold,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: design.spacing.sm,
            opacity: isCollapsed ? 0 : 1,
            transition: 'opacity 0.3s ease-in-out'
          }}>
            Quick Actions
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: design.spacing.xs }}>
            {quickActions.map((action) => {
              const Icon = action.icon
              const active = isActive(action.href)
              return (
                <Link
                  key={action.name}
                  to={action.href}
                  style={menuItemStyles(active, action.color)}
                  onMouseEnter={(e) => {
                    if (isCollapsed) {
                      const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement
                      if (tooltip) {
                        tooltip.style.opacity = '1'
                        tooltip.style.transform = 'translateY(-50%) translateX(0)'
                      }
                    }
                    e.currentTarget.style.backgroundColor = `${action.color}20`
                  }}
                  onMouseLeave={(e) => {
                    if (isCollapsed) {
                      const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement
                      if (tooltip) {
                        tooltip.style.opacity = '0'
                        tooltip.style.transform = 'translateY(-50%) translateX(-10px)'
                      }
                    }
                    e.currentTarget.style.backgroundColor = active ? `${action.color}20` : 'transparent'
                  }}
                >
                  <div style={iconContainerStyles(action.color, active)}>
                    <Icon style={iconStyles(action.color, active)} />
                  </div>
                  <span style={textStyles}>{action.name}</span>
                  {isCollapsed && (
                    <div className="tooltip" style={tooltipStyles}>
                      {action.name}
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Main Navigation */}
        <nav style={navStyles}>
          <div style={{
            fontFamily: design.typography.fontFamily,
            fontSize: design.typography.sizes.xs,
            color: design.colors.textMuted,
            fontWeight: design.typography.weights.semibold,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: design.spacing.sm,
            opacity: isCollapsed ? 0 : 1,
            transition: 'opacity 0.3s ease-in-out'
          }}>
            Navigation
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: design.spacing.xs }}>
            {navigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  style={menuItemStyles(active, item.color)}
                  onMouseEnter={(e) => {
                    if (isCollapsed) {
                      const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement
                      if (tooltip) {
                        tooltip.style.opacity = '1'
                        tooltip.style.transform = 'translateY(-50%) translateX(0)'
                      }
                    }
                    e.currentTarget.style.backgroundColor = `${item.color}20`
                  }}
                  onMouseLeave={(e) => {
                    if (isCollapsed) {
                      const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement
                      if (tooltip) {
                        tooltip.style.opacity = '0'
                        tooltip.style.transform = 'translateY(-50%) translateX(-10px)'
                      }
                    }
                    e.currentTarget.style.backgroundColor = active ? `${item.color}20` : 'transparent'
                  }}
                >
                  <div style={iconContainerStyles(item.color, active)}>
                    <Icon style={iconStyles(item.color, active)} />
                  </div>
                  <span style={textStyles}>{item.name}</span>
                  {isCollapsed && (
                    <div className="tooltip" style={tooltipStyles}>
                      {item.name}
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        <div style={{
          padding: design.spacing.md,
          borderTop: `1px solid ${design.colors.borderPrimary}`,
          marginTop: 'auto'
        }}>
          <div style={{
            fontFamily: design.typography.fontFamily,
            fontSize: design.typography.sizes.xs,
            color: design.colors.textMuted,
            opacity: isCollapsed ? 0 : 1,
            transition: 'opacity 0.3s ease-in-out',
            textAlign: 'center'
          }}>
            {isCollapsed ? 'AF' : 'AgentFlow v1.0'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoronaSidebar
