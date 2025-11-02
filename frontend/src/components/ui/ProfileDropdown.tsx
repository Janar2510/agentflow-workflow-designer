import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, User, Bell, Settings, HelpCircle, LogOut } from 'lucide-react'
import { useCoronaDesign } from '../../contexts/CoronaDesignContext'

interface ProfileDropdownProps {
  isCollapsed?: boolean
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ isCollapsed = false }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const design = useCoronaDesign()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const dropdownItems = [
    { 
      name: 'Profile', 
      icon: User, 
      color: '#007AFF',
      action: () => console.log('Profile clicked')
    },
    { 
      name: 'Notifications', 
      icon: Bell, 
      color: '#FF9500',
      action: () => console.log('Notifications clicked')
    },
    { 
      name: 'Settings', 
      icon: Settings, 
      color: '#6b7280',
      action: () => console.log('Settings clicked')
    },
    { 
      name: 'Help & Support', 
      icon: HelpCircle, 
      color: '#34C759',
      action: () => console.log('Help clicked')
    },
    { 
      name: 'Sign Out', 
      icon: LogOut, 
      color: '#FF3B30',
      action: () => console.log('Sign out clicked')
    }
  ]

  const containerStyles: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    width: '100%'
  }

  const triggerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${design.spacing.sm} ${design.spacing.md}`,
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    color: design.colors.textPrimary,
    fontSize: design.typography.sizes.sm,
    fontWeight: design.typography.weights.medium,
    width: '100%',
    gap: design.spacing.sm
  }

  const leftSectionStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: design.spacing.sm,
    flex: 1
  }

  const chevronStyles: React.CSSProperties = {
    width: '16px',
    height: '16px',
    color: design.colors.textSecondary,
    transition: 'all 0.2s ease-in-out',
    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    opacity: isCollapsed ? 0 : 1
  }

  const dropdownStyles: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: design.spacing.sm,
    backgroundColor: design.colors.bgTertiary,
    border: `1px solid ${design.colors.borderPrimary}`,
    borderRadius: '0.75rem',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
    zIndex: 1000,
    overflow: 'hidden',
    minWidth: '200px',
    opacity: isOpen ? 1 : 0,
    visibility: isOpen ? 'visible' : 'hidden',
    transform: isOpen ? 'translateY(0)' : 'translateY(-10px)',
    transition: 'all 0.2s ease-in-out'
  }

  const dropdownItemStyles = (itemColor: string): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    padding: `${design.spacing.sm} ${design.spacing.md}`,
    color: design.colors.textPrimary,
    textDecoration: 'none',
    transition: 'all 0.2s ease-in-out',
    cursor: 'pointer',
    gap: design.spacing.sm,
    fontSize: design.typography.sizes.sm,
    fontWeight: design.typography.weights.medium
  })

  const itemIconStyles = (itemColor: string): React.CSSProperties => ({
    width: '20px',
    height: '20px',
    color: itemColor,
    transition: 'all 0.2s ease-in-out'
  })

  const itemTextStyles: React.CSSProperties = {
    fontFamily: design.typography.fontFamily,
    fontSize: design.typography.sizes.sm,
    color: 'inherit',
    fontWeight: 'inherit'
  }

  return (
    <div style={containerStyles} ref={dropdownRef}>
      <button
        style={triggerStyles}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = design.colors.bgTertiary
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
      >
        <div style={leftSectionStyles}>
          <span style={{ 
            fontFamily: design.typography.fontFamily,
            fontSize: design.typography.sizes.sm,
            color: design.colors.textPrimary,
            fontWeight: design.typography.weights.medium,
            opacity: isCollapsed ? 0 : 1,
            transition: 'opacity 0.3s ease-in-out'
          }}>
            Profile
          </span>
        </div>
        <ChevronDown style={chevronStyles} />
      </button>

      <div style={dropdownStyles}>
        {dropdownItems.map((item, index) => {
          const Icon = item.icon
          return (
            <div
              key={item.name}
              style={dropdownItemStyles(item.color)}
              onClick={() => {
                item.action()
                setIsOpen(false)
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${item.color}20`
                e.currentTarget.style.color = item.color
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = design.colors.textPrimary
              }}
            >
              <Icon style={itemIconStyles(item.color)} />
              <span style={itemTextStyles}>{item.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProfileDropdown








