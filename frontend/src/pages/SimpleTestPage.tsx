import React from 'react'

export const SimpleTestPage: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'var(--af-bg-primary)', 
      color: 'var(--af-text-primary)',
      padding: '2rem',
      fontFamily: 'var(--af-font-primary)'
    }}>
      <h1 style={{ 
        fontSize: '2rem', 
        fontWeight: 'bold', 
        marginBottom: '2rem',
        color: 'var(--af-text-primary)'
      }}>
        AgentFlow Design System Test
      </h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          marginBottom: '1rem',
          color: 'var(--af-text-primary)'
        }}>
          CSS Variables Test
        </h2>
        <p style={{ color: 'var(--af-text-secondary)' }}>
          If you can see this text in the correct colors, the CSS variables are working.
        </p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          marginBottom: '1rem',
          color: 'var(--af-text-primary)'
        }}>
          Gradient Border Card Test
        </h2>
        <div 
          className="af-card--gradient-border"
          style={{ 
            padding: '1rem', 
            marginBottom: '1rem',
            backgroundColor: 'var(--af-bg-secondary)',
            borderRadius: 'var(--af-radius-xl)'
          }}
        >
          <h3 style={{ color: 'var(--af-text-primary)', marginBottom: '0.5rem' }}>
            Gradient Border Card
          </h3>
          <p style={{ color: 'var(--af-text-secondary)' }}>
            This card should have an animated gradient border.
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          marginBottom: '1rem',
          color: 'var(--af-text-primary)'
        }}>
          Glass Card Test
        </h2>
        <div 
          className="af-card--glass"
          style={{ 
            padding: '1rem', 
            marginBottom: '1rem',
            backgroundColor: 'var(--af-bg-glass)',
            borderRadius: 'var(--af-radius-xl)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--af-border-glass)'
          }}
        >
          <h3 style={{ color: 'var(--af-text-primary)', marginBottom: '0.5rem' }}>
            Glass Card
          </h3>
          <p style={{ color: 'var(--af-text-secondary)' }}>
            This card should have a glassmorphism effect.
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          marginBottom: '1rem',
          color: 'var(--af-text-primary)'
        }}>
          Button Test
        </h2>
        <button 
          className="af-btn af-btn--primary"
          style={{ 
            padding: '0.75rem 1.5rem',
            borderRadius: 'var(--af-radius-lg)',
            border: 'none',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, var(--af-accent-primary), var(--af-gradient-secondary))',
            color: 'var(--af-text-primary)',
            fontWeight: 'var(--af-font-medium)'
          }}
        >
          Primary Button
        </button>
      </div>
    </div>
  )
}

export default SimpleTestPage











