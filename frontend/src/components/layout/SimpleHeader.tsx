import React from 'react'
import { useNavigate } from 'react-router-dom'
import './SimpleHeader.css'

export const SimpleHeader: React.FC = () => {
  const navigate = useNavigate()

  return (
    <header className="simple-header">
      <div className="simple-header-container">
        <div className="simple-header-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <img 
            src="/agent-flow-logo.png" 
            alt="AgentFlow" 
            className="logo-image"
          />
          <span className="logo-text">AgentFlow</span>
        </div>
        
        <div className="simple-header-actions">
          <button
            className="simple-header-button sign-in-button"
            onClick={() => navigate('/login')}
          >
            Sign In
          </button>
          <button
            className="simple-header-button get-started-button"
            onClick={() => navigate('/register')}
          >
            Get Started
          </button>
        </div>
      </div>
    </header>
  )
}

export default SimpleHeader

