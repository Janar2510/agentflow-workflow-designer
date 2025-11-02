import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Package, Lightbulb, BookOpen, Users } from 'lucide-react'
import { useCoronaDesign } from '../../contexts/CoronaDesignContext'

interface DropdownItem {
  name: string
  href: string
  icon?: React.ComponentType<any>
  description?: string
}

interface CoronaDropdownProps {
  label: string
  items: DropdownItem[]
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  icon?: React.ComponentType<any>
}

export const CoronaDropdown: React.FC<CoronaDropdownProps> = ({ 
  label, 
  items, 
  variant = 'primary',
  icon: Icon
}) => {
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

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          button: {
            color: design.colors.primary,
            borderColor: design.colors.primary,
            backgroundColor: 'transparent'
          },
          hover: {
            backgroundColor: `${design.colors.primary}20`,
            color: design.colors.primary
          }
        }
      case 'secondary':
        return {
          button: {
            color: design.colors.secondary,
            borderColor: design.colors.secondary,
            backgroundColor: 'transparent'
          },
          hover: {
            backgroundColor: `${design.colors.secondary}20`,
            color: design.colors.secondary
          }
        }
      case 'success':
        return {
          button: {
            color: design.colors.success,
            borderColor: design.colors.success,
            backgroundColor: 'transparent'
          },
          hover: {
            backgroundColor: `${design.colors.success}20`,
            color: design.colors.success
          }
        }
      case 'warning':
        return {
          button: {
            color: design.colors.warning,
            borderColor: design.colors.warning,
            backgroundColor: 'transparent'
          },
          hover: {
            backgroundColor: `${design.colors.warning}20`,
            color: design.colors.warning
          }
        }
      case 'danger':
        return {
          button: {
            color: design.colors.danger,
            borderColor: design.colors.danger,
            backgroundColor: 'transparent'
          },
          hover: {
            backgroundColor: `${design.colors.danger}20`,
            color: design.colors.danger
          }
        }
      default:
        return {
          button: {
            color: design.colors.primary,
            borderColor: design.colors.primary,
            backgroundColor: 'transparent'
          },
          hover: {
            backgroundColor: `${design.colors.primary}20`,
            color: design.colors.primary
          }
        }
    }
  }

  const variantStyles = getVariantStyles()

  const containerStyles: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block'
  }

  const buttonStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: `${design.spacing.sm} ${design.spacing.md}`,
    borderRadius: '0.5rem',
    border: `1px solid ${variantStyles.button.borderColor}`,
    backgroundColor: variantStyles.button.backgroundColor,
    color: variantStyles.button.color,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    fontSize: design.typography.sizes.sm,
    fontWeight: design.typography.weights.medium,
    gap: design.spacing.sm,
    outline: 'none'
  }

  const chevronStyles: React.CSSProperties = {
    width: '16px',
    height: '16px',
    transition: 'transform 0.2s ease-in-out',
    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
  }

  const dropdownStyles: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
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

  const itemStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: `${design.spacing.sm} ${design.spacing.md}`,
    color: design.colors.textPrimary,
    textDecoration: 'none',
    transition: 'all 0.2s ease-in-out',
    cursor: 'pointer',
    gap: design.spacing.sm,
    fontSize: design.typography.sizes.sm,
    fontWeight: design.typography.weights.medium,
    borderBottom: `1px solid ${design.colors.borderPrimary}`
  }

  const itemIconStyles: React.CSSProperties = {
    width: '20px',
    height: '20px',
    color: design.colors.textSecondary,
    flexShrink: 0
  }

  const itemContentStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  }

  const itemNameStyles: React.CSSProperties = {
    ...design.typography,
    fontSize: design.typography.sizes.sm,
    fontWeight: design.typography.weights.medium,
    color: design.colors.textPrimary,
    marginBottom: design.spacing.xs
  }

  const itemDescriptionStyles: React.CSSProperties = {
    ...design.typography,
    fontSize: design.typography.sizes.xs,
    color: design.colors.textMuted
  }

  const dividerStyles: React.CSSProperties = {
    height: '1px',
    backgroundColor: design.colors.borderPrimary,
    margin: `${design.spacing.xs} 0`
  }

  return (
    <div style={containerStyles} ref={dropdownRef}>
      <button
        style={buttonStyles}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={(e) => {
          Object.assign(e.currentTarget.style, variantStyles.hover)
        }}
        onMouseLeave={(e) => {
          Object.assign(e.currentTarget.style, variantStyles.button)
        }}
      >
        {Icon && <Icon size={16} />}
        {label}
        <ChevronDown style={chevronStyles} />
      </button>

      <div style={dropdownStyles}>
        {items.map((item, index) => {
          const ItemIcon = item.icon
          return (
            <React.Fragment key={index}>
              <a
                href={item.href}
                style={itemStyles}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${variantStyles.button.color}20`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                {ItemIcon && <ItemIcon style={itemIconStyles} />}
                <div style={itemContentStyles}>
                  <div style={itemNameStyles}>{item.name}</div>
                  {item.description && (
                    <div style={itemDescriptionStyles}>{item.description}</div>
                  )}
                </div>
              </a>
              {index < items.length - 1 && <div style={dividerStyles} />}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default CoronaDropdown
