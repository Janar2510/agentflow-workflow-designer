import React, { useState, useEffect } from 'react'
import { useCoronaDesign } from '../../contexts/CoronaDesignContext'

interface AnimatedIconProps {
  icon: React.ReactNode
  color: string
  size?: number
  animationType?: 'float' | 'pulse' | 'rotate' | 'bounce' | 'glow'
  duration?: number
  delay?: number
}

const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  icon,
  color,
  size = 48,
  animationType = 'float',
  duration = 2,
  delay = 0
}) => {
  const design = useCoronaDesign()
  const [isHovered, setIsHovered] = useState(false)

  const getAnimationStyles = () => {
    const baseStyles: React.CSSProperties = {
      width: `${size}px`,
      height: `${size}px`,
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
      filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
      transform: isHovered ? 'scale(1.1)' : 'scale(1)'
    }

    switch (animationType) {
      case 'float':
        return {
          ...baseStyles,
          animation: `float ${duration}s ease-in-out infinite`,
          animationDelay: `${delay}s`
        }
      case 'pulse':
        return {
          ...baseStyles,
          animation: `pulse ${duration}s ease-in-out infinite`,
          animationDelay: `${delay}s`
        }
      case 'rotate':
        return {
          ...baseStyles,
          animation: `rotate ${duration}s linear infinite`,
          animationDelay: `${delay}s`
        }
      case 'bounce':
        return {
          ...baseStyles,
          animation: `bounce ${duration}s ease-in-out infinite`,
          animationDelay: `${delay}s`
        }
      case 'glow':
        return {
          ...baseStyles,
          animation: `glow ${duration}s ease-in-out infinite`,
          animationDelay: `${delay}s`,
          filter: `drop-shadow(0 0 20px ${color}80) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))`
        }
      default:
        return baseStyles
    }
  }

  return (
    <div
      style={getAnimationStyles()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {icon}
    </div>
  )
}

export default AnimatedIcon








