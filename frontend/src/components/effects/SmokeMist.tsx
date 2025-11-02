import { useEffect, useRef } from 'react'
import './SmokeMist.css'

export const SmokeMist: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Create animated smoke particles
    const container = containerRef.current
    if (!container) return

    const particles: HTMLDivElement[] = []
    const particleCount = 30

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div')
      particle.className = 'smoke-particle'
      
      // Random properties - slower, wind-like movement
      const size = Math.random() * 200 + 100
      const x = Math.random() * 100
      const y = Math.random() * 100
      const duration = Math.random() * 60 + 40 // Slower: 40-100s instead of 20-50s
      const delay = Math.random() * 15
      const opacity = Math.random() * 0.3 + 0.1
      
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      particle.style.left = `${x}%`
      particle.style.top = `${y}%`
      particle.style.animationDuration = `${duration}s`
      particle.style.animationDelay = `${delay}s`
      particle.style.opacity = `${opacity}`
      
      container.appendChild(particle)
      particles.push(particle)
    }

    return () => {
      particles.forEach(particle => particle.remove())
    }
  }, [])

  return (
    <div ref={containerRef} className="smoke-mist-container">
      <div className="smoke-mist-overlay smoke-mist-layer-1" />
      <div className="smoke-mist-overlay smoke-mist-layer-2" />
    </div>
  )
}

export default SmokeMist

