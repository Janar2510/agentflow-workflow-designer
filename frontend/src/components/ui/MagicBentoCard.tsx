import React, { useState, useRef, useEffect } from 'react'
import { useCoronaDesign } from '../../contexts/CoronaDesignContext'
import './MagicBento.css'

interface MagicBentoCardProps {
  title: string
  description: string
  icon?: React.ReactNode
  label?: string
  ctaText?: string
  ctaAction?: () => void
  glowColor?: string
  enableBorderGlow?: boolean
  enableTilt?: boolean
  enableMagnetism?: boolean
  clickEffect?: boolean
  textAutoHide?: boolean
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
}

const MagicBentoCard: React.FC<MagicBentoCardProps> = ({
  title,
  description,
  icon,
  label,
  ctaText,
  ctaAction,
  glowColor,
  enableBorderGlow = true,
  enableTilt = true,
  enableMagnetism = true,
  clickEffect = true,
  textAutoHide = true,
  className = '',
  style = {},
  onClick
}) => {
  const design = useCoronaDesign()
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [glowIntensity, setGlowIntensity] = useState(0)

  // Convert Corona colors to RGB values
  const getRGBFromColor = (color: string) => {
    if (color.startsWith('#')) {
      const hex = color.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16)
      const g = parseInt(hex.substr(2, 2), 16)
      const b = parseInt(hex.substr(4, 2), 16)
      return `${r}, ${g}, ${b}`
    }
    return glowColor || '132, 0, 255'
  }

  const primaryRGB = getRGBFromColor(design.colors.primary)
  const secondaryRGB = getRGBFromColor(design.colors.secondary)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      setMousePosition({ x, y })

      if (enableTilt) {
        const rotateX = (y - 50) * 0.1
        const rotateY = (x - 50) * 0.1
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`
      }
    }

    const handleMouseEnter = () => {
      setIsHovered(true)
      setGlowIntensity(1)
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
      setGlowIntensity(0)
      if (enableTilt) {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
      }
    }

    const handleClick = () => {
      if (clickEffect) {
        card.style.transform = 'scale(0.95)'
        setTimeout(() => {
          card.style.transform = isHovered 
            ? `perspective(1000px) rotateX(${(mousePosition.y - 50) * 0.1}deg) rotateY(${(mousePosition.x - 50) * 0.1}deg) translateZ(10px)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
        }, 150)
      }
      onClick?.()
    }

    card.addEventListener('mousemove', handleMouseMove)
    card.addEventListener('mouseenter', handleMouseEnter)
    card.addEventListener('mouseleave', handleMouseLeave)
    card.addEventListener('click', handleClick)

    return () => {
      card.removeEventListener('mousemove', handleMouseMove)
      card.removeEventListener('mouseenter', handleMouseEnter)
      card.removeEventListener('mouseleave', handleMouseLeave)
      card.removeEventListener('click', handleClick)
    }
  }, [enableTilt, enableMagnetism, clickEffect, isHovered, mousePosition])

  const cardStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    aspectRatio: '4/3',
    minHeight: '200px',
    width: '100%',
    maxWidth: '100%',
    padding: design.spacing.md,
    borderRadius: design.spacing.md,
    border: `1px solid ${design.colors.borderPrimary}`,
    background: `linear-gradient(135deg, ${design.colors.bgSecondary}, ${design.colors.bgTertiary})`,
    fontFamily: design.typography.fontFamily,
    fontWeight: design.typography.weights.normal,
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    transformStyle: 'preserve-3d',
    boxShadow: `0 4px 12px rgba(0, 0, 0, 0.15)`,
    ...style
  }

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: design.spacing.sm,
    position: 'relative',
    color: design.colors.textPrimary,
    marginBottom: design.spacing.md
  }

  const contentStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    color: design.colors.textPrimary,
    flex: 1,
    gap: design.spacing.xs
  }

  const titleStyles: React.CSSProperties = {
    fontWeight: design.typography.weights.semibold,
    fontSize: design.typography.sizes.sm,
    margin: '0 0 0.25em',
    color: design.colors.textPrimary,
    lineHeight: 1.2,
    ...(textAutoHide && {
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      WebkitLineClamp: 1,
      lineClamp: 1
    })
  }

  const descriptionStyles: React.CSSProperties = {
    fontSize: design.typography.sizes.xs,
    lineHeight: 1.4,
    opacity: 0.9,
    color: design.colors.textSecondary,
    marginBottom: design.spacing.sm,
    ...(textAutoHide && {
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      WebkitLineClamp: 2,
      lineClamp: 2
    })
  }

  const labelStyles: React.CSSProperties = {
    fontSize: design.typography.sizes.xs,
    color: 'white',
    backgroundColor: `${design.colors.primary}80`,
    padding: `${design.spacing.xs} ${design.spacing.sm}`,
    borderRadius: design.spacing.xs,
    fontWeight: design.typography.weights.medium,
    alignSelf: 'flex-start',
    boxShadow: `0 2px 8px ${design.colors.primary}40`
  }

  const iconStyles: React.CSSProperties = {
    width: '24px',
    height: '24px',
    color: 'white',
    flexShrink: 0,
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
  }

  const ctaButtonStyles: React.CSSProperties = {
    marginTop: 'auto',
    padding: `${design.spacing.xs} ${design.spacing.sm}`,
    backgroundColor: 'transparent',
    border: `1px solid ${design.colors.primary}`,
    borderRadius: design.spacing.xs,
    color: design.colors.primary,
    fontSize: design.typography.sizes.xs,
    fontWeight: design.typography.weights.medium,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: design.spacing.xs,
    alignSelf: 'flex-start'
  }

  const borderGlowStyles: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    padding: '6px',
    background: `radial-gradient(
      ${glowIntensity * 200}px circle at ${mousePosition.x}% ${mousePosition.y}%,
      rgba(${primaryRGB}, ${glowIntensity * 0.8}) 0%,
      rgba(${primaryRGB}, ${glowIntensity * 0.4}) 30%,
      transparent 60%
    )`,
    borderRadius: 'inherit',
    mask: `
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0)
    `,
    maskComposite: 'subtract',
    WebkitMask: `
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0)
    `,
    WebkitMaskComposite: 'xor',
    pointerEvents: 'none',
    transition: 'opacity 0.3s ease',
    zIndex: 1
  }

  return (
    <div
      ref={cardRef}
      className={`magic-bento-card card ${enableBorderGlow ? 'card--border-glow' : ''} ${textAutoHide ? 'card--text-autohide' : ''} ${className}`}
      style={{
        ...cardStyles,
        '--glow-x': `${mousePosition.x}%`,
        '--glow-y': `${mousePosition.y}%`,
        '--glow-intensity': glowIntensity,
        '--glow-radius': '200px',
        '--border-color': design.colors.borderPrimary,
        '--background-dark': design.colors.bgSecondary,
        '--white': design.colors.textPrimary,
        '--purple-primary': design.colors.primary,
        '--purple-glow': `${design.colors.primary}20`,
        '--purple-border': design.colors.primary
      } as React.CSSProperties}
    >
      {enableBorderGlow && (
        <div style={borderGlowStyles} />
      )}
      
      <div className="card__header" style={headerStyles}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: design.spacing.sm }}>
          {icon}
          {label && <span className="card__label" style={labelStyles}>{label}</span>}
        </div>
        <div className="card__content" style={contentStyles}>
          <h3 className="card__title" style={titleStyles}>{title}</h3>
          <p className="card__description" style={descriptionStyles}>{description}</p>
          {ctaText && (
            <button
              style={ctaButtonStyles}
              onClick={(e) => {
                e.stopPropagation()
                ctaAction?.()
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = design.colors.primary
                e.currentTarget.style.color = 'white'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = design.colors.primary
              }}
            >
              {ctaText} →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default MagicBentoCard
