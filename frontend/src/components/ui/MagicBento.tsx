import React, { useEffect, useRef, useState } from 'react'
import { useCoronaDesign } from '../../contexts/CoronaDesignContext'
import './MagicBento.css'

interface MagicBentoProps {
  textAutoHide?: boolean
  enableStars?: boolean
  enableSpotlight?: boolean
  enableBorderGlow?: boolean
  enableTilt?: boolean
  enableMagnetism?: boolean
  clickEffect?: boolean
  spotlightRadius?: number
  particleCount?: number
  glowColor?: string
  children?: React.ReactNode
}

const MagicBento: React.FC<MagicBentoProps> = ({
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  enableTilt = true,
  enableMagnetism = true,
  clickEffect = true,
  spotlightRadius = 300,
  particleCount = 12,
  glowColor = "132, 0, 255",
  children
}) => {
  const design = useCoronaDesign()
  const containerRef = useRef<HTMLDivElement>(null)
  const spotlightRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  // Convert Corona colors to RGB values
  const getRGBFromColor = (color: string) => {
    // Extract RGB values from hex or CSS color
    if (color.startsWith('#')) {
      const hex = color.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16)
      const g = parseInt(hex.substr(2, 2), 16)
      const b = parseInt(hex.substr(4, 2), 16)
      return `${r}, ${g}, ${b}`
    }
    return glowColor // fallback
  }

  const primaryRGB = getRGBFromColor(design.colors.primary)
  const secondaryRGB = getRGBFromColor(design.colors.secondary)

  useEffect(() => {
    const container = containerRef.current
    const spotlight = spotlightRef.current

    if (!container || !spotlight) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setMousePosition({ x, y })

      if (enableSpotlight) {
        spotlight.style.left = `${x}px`
        spotlight.style.top = `${y}px`
      }
    }

    const handleMouseEnter = () => {
      setIsHovered(true)
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
    }

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseenter', handleMouseEnter)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseenter', handleMouseEnter)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [enableSpotlight])

  const containerStyles: React.CSSProperties = {
    position: 'relative',
    display: 'grid',
    gap: '24px',
    padding: '40px',
    maxWidth: '100vw',
    fontSize: 'clamp(1rem, 0.9rem + 0.5vw, 1.5rem)',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridTemplateRows: 'repeat(2, 1fr)',
    userSelect: 'none',
    overflow: 'hidden',
    margin: '0 auto',
    width: '100%',
    height: '80vh',
    minHeight: '600px'
  }

  const spotlightStyles: React.CSSProperties = {
    position: 'absolute',
    width: `${spotlightRadius}px`,
    height: `${spotlightRadius}px`,
    background: `radial-gradient(circle, rgba(${primaryRGB}, 0.1) 0%, transparent 70%)`,
    borderRadius: '50%',
    pointerEvents: 'none',
    transform: 'translate(-50%, -50%)',
    zIndex: 200,
    mixBlendMode: 'screen',
    willChange: 'transform, opacity',
    opacity: isHovered ? 1 : 0,
    transition: 'opacity 0.3s ease'
  }

  return (
    <div 
      ref={containerRef}
      style={containerStyles}
      className="bento-section card-grid"
    >
      {enableSpotlight && (
        <div
          ref={spotlightRef}
          style={spotlightStyles}
          className="global-spotlight"
        />
      )}
      {children}
    </div>
  )
}

export default MagicBento
