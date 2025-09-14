import React from 'react'
import { Link } from 'react-router-dom'
import { Workflow, Zap, Users } from 'lucide-react'
import Spline from '@splinetool/react-spline'

const HomePage: React.FC = () => {
  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: '256px',
      right: 0,
      bottom: 0,
      zIndex: 100,
      overflow: 'visible',
      background: 'transparent',
      paddingLeft: '20px'
    }}>
      {/* Spline 3D Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none'
      }}>
        <Spline scene="https://prod.spline.design/dg5xFQKxIPDV401j/scene.splinecode" />
            </div>

      {/* CSS for animated gradient borders */}
      <style>{`
        @property --af-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        
        .af-card--animated-border {
          animation: af-rotate 3s linear infinite;
        }
        
        @keyframes af-rotate {
          to {
            --af-angle: 360deg;
          }
        }
      `}</style>

      {/* Content - positioned above background */}
      <div style={{ position: 'relative', zIndex: 2, padding: 'var(--af-space-8)', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="af-container">
          <div className="af-flex af-flex-col af-items-center" style={{ height: '100%', justifyContent: 'center' }}>
            {/* Single Get Started Button - positioned in exact middle */}
            <div className="af-flex af-justify-center" style={{ marginBottom: 'var(--af-space-8)' }}>
              <Link to="/workflow-editor">
                <button className="af-btn af-btn--primary af-btn--lg">
                  <Workflow className="af-w-5 af-h-5 af-mr-2" />
                  Get Started
                </button>
              </Link>
        </div>
          </div>
        </div>

        {/* Cards Grid - positioned 90px from BOTTOM edge */}
        <div style={{ 
          display: 'flex',
          gap: '10px',
          position: 'absolute',
          bottom: '120px',
          left: '20px',
          right: '20px',
          width: 'calc(100% - 40px)'
        }}>
              {/* Feature Cards - Layered Gradient Border Design */}
              <div style={{ position: 'relative', width: '100%', height: '180px' }}>
                {/* Layer 1: Animated gradient border */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: '1rem',
                  background: 'conic-gradient(from 0deg, #00FFFF, #8B5CF6, #FF00FF, #00FFFF)',
                  animation: 'gradient-rotate 3s linear infinite',
                  zIndex: 1
                }} />
                
                {/* Layer 2: Blur layer */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: '1rem',
                  background: 'conic-gradient(from 0deg, #00FFFF, #8B5CF6, #FF00FF, #00FFFF)',
                  filter: 'blur(15px)',
                  opacity: 0.6,
                  animation: 'gradient-rotate 3s linear infinite',
                  zIndex: 2
                }} />
                
                {/* Layer 3: Black card with content (2px smaller) */}
                <div style={{
                  position: 'absolute',
                  top: '2px',
                  left: '2px',
                  right: '2px',
                  bottom: '2px',
                  background: '#1a1a2e',
                  borderRadius: '0.875rem',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 3
                }}>
                  <div className="af-mb-4">
                    <Workflow className="af-w-10 af-h-10 af-mx-auto" style={{ color: 'var(--af-color-primary)' }} />
          </div>
                  <h3 className="af-text-lg af-font-semibold af-mb-3" style={{ color: 'var(--af-color-text-primary)' }}>Visual Design</h3>
                  <p className="af-text-sm" style={{ color: 'var(--af-color-text-secondary)' }}>
              Drag and drop agents to create complex workflows without writing code.
            </p>
                </div>
          </div>
          
              {/* Card 2: AI Agents */}
              <div style={{ position: 'relative', width: '100%', height: '180px' }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: '1rem',
                  background: 'conic-gradient(from 0deg, #00FFFF, #8B5CF6, #FF00FF, #00FFFF)',
                  animation: 'gradient-rotate 3s linear infinite',
                  zIndex: 1
                }} />
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: '1rem',
                  background: 'conic-gradient(from 0deg, #00FFFF, #8B5CF6, #FF00FF, #00FFFF)',
                  filter: 'blur(15px)',
                  opacity: 0.6,
                  animation: 'gradient-rotate 3s linear infinite',
                  zIndex: 2
                }} />
                <div style={{
                  position: 'absolute',
                  top: '2px',
                  left: '2px',
                  right: '2px',
                  bottom: '2px',
                  background: '#1a1a2e',
                  borderRadius: '0.875rem',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 3
                }}>
                  <div className="af-mb-4">
                    <Users className="af-w-10 af-h-10 af-mx-auto" style={{ color: 'var(--af-color-success)' }} />
                  </div>
                  <h3 className="af-text-lg af-font-semibold af-mb-3" style={{ color: 'var(--af-color-text-primary)' }}>AI Agents</h3>
                  <p className="af-text-sm" style={{ color: 'var(--af-color-text-secondary)' }}>
              Access a library of pre-built AI agents for common tasks and workflows.
            </p>
                </div>
          </div>
          
              {/* Card 3: Real-time Execution */}
              <div style={{ position: 'relative', width: '100%', height: '180px' }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: '1rem',
                  background: 'conic-gradient(from 0deg, #00FFFF, #8B5CF6, #FF00FF, #00FFFF)',
                  animation: 'gradient-rotate 3s linear infinite',
                  zIndex: 1
                }} />
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: '1rem',
                  background: 'conic-gradient(from 0deg, #00FFFF, #8B5CF6, #FF00FF, #00FFFF)',
                  filter: 'blur(15px)',
                  opacity: 0.6,
                  animation: 'gradient-rotate 3s linear infinite',
                  zIndex: 2
                }} />
                <div style={{
                  position: 'absolute',
                  top: '2px',
                  left: '2px',
                  right: '2px',
                  bottom: '2px',
                  background: '#1a1a2e',
                  borderRadius: '0.875rem',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 3
                }}>
                  <div className="af-mb-4">
                    <Zap className="af-w-10 af-h-10 af-mx-auto" style={{ color: 'var(--af-color-warning)' }} />
                  </div>
                  <h3 className="af-text-lg af-font-semibold af-mb-3" style={{ color: 'var(--af-color-text-primary)' }}>Real-time Execution</h3>
                  <p className="af-text-sm" style={{ color: 'var(--af-color-text-secondary)' }}>
              Monitor workflow execution in real-time with detailed logs and metrics.
            </p>
                </div>
          </div>
          
              {/* Card 4: Collaboration */}
              <div style={{ position: 'relative', width: '100%', height: '180px' }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: '1rem',
                  background: 'conic-gradient(from 0deg, #00FFFF, #8B5CF6, #FF00FF, #00FFFF)',
                  animation: 'gradient-rotate 3s linear infinite',
                  zIndex: 1
                }} />
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: '1rem',
                  background: 'conic-gradient(from 0deg, #00FFFF, #8B5CF6, #FF00FF, #00FFFF)',
                  filter: 'blur(15px)',
                  opacity: 0.6,
                  animation: 'gradient-rotate 3s linear infinite',
                  zIndex: 2
                }} />
                <div style={{
                  position: 'absolute',
                  top: '2px',
                  left: '2px',
                  right: '2px',
                  bottom: '2px',
                  background: '#1a1a2e',
                  borderRadius: '0.875rem',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 3
                }}>
                  <div className="af-mb-4">
                    <Users className="af-w-10 af-h-10 af-mx-auto" style={{ color: 'var(--af-color-accent)' }} />
                  </div>
                  <h3 className="af-text-lg af-font-semibold af-mb-3" style={{ color: 'var(--af-color-text-primary)' }}>Collaboration</h3>
                  <p className="af-text-sm" style={{ color: 'var(--af-color-text-secondary)' }}>
              Work together with your team in real-time on the same workflow.
            </p>
          </div>
        </div>
          </div>
        </div>
    </div>
  )
}

export default HomePage