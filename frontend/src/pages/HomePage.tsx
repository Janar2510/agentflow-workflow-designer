import React, { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LaserFlow from '../components/effects/LaserFlow'
import DottedSurface from '../components/effects/DottedSurface'
import SmokeMist from '../components/effects/SmokeMist'
import { 
  Zap, 
  Brain, 
  Workflow, 
  GitBranch, 
  Shield, 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  Rocket,
  Code,
  Database,
  Cloud,
  CheckSquare,
  Circle,
  Home,
  Calendar,
  Inbox,
  FileText,
  Settings,
  Clock,
  Video,
  Plus,
  Search,
  BarChart3,
  MessageCircle,
  Video as VideoIcon,
  Mic,
  Share2,
  Maximize,
  UserPlus,
  Palette,
  X
} from 'lucide-react'
import './HomePage.css'

export const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const revealImgRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: -9999, y: -9999 })
  const featuresSectionRef = useRef<HTMLDivElement>(null)
  const [featureCardsMouse, setFeatureCardsMouse] = useState<Record<number, { x: number; y: number }>>({})

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll')
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect()
        const isVisible = rect.top < window.innerHeight * 0.8
        if (isVisible) {
          el.classList.add('visible')
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setMousePos({ x, y: y + rect.height * 0.5 })
  }

  const handleMouseLeave = () => {
    setMousePos({ x: -9999, y: -9999 })
  }

  const handleFeatureCardMouseMove = (index: number, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setFeatureCardsMouse(prev => ({ ...prev, [index]: { x, y } }))
  }

  const handleFeatureCardMouseLeave = (index: number) => {
    setFeatureCardsMouse(prev => {
      const newState = { ...prev }
      delete newState[index]
      return newState
    })
  }

  const handleButtonMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    e.currentTarget.style.setProperty('--mouse-x', `${x}%`)
    e.currentTarget.style.setProperty('--mouse-y', `${y}%`)
  }

  const handleButtonMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.setProperty('--mouse-x', '50%')
    e.currentTarget.style.setProperty('--mouse-y', '50%')
  }

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'AI-Powered Agents',
      description: 'Build intelligent workflows with LLM-powered agents that understand context and make decisions.',
      color: '#FF79C6'
    },
    {
      icon: <Workflow className="w-8 h-8" />,
      title: 'Visual Workflow Builder',
      description: 'Design complex automation flows with our intuitive drag-and-drop interface.',
      color: '#8BE9FD'
    },
    {
      icon: <GitBranch className="w-8 h-8" />,
      title: 'Conditional Logic',
      description: 'Create dynamic workflows with branching paths and conditional execution.',
      color: '#50FA7B'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Enterprise Security',
      description: 'Bank-grade encryption and security for your sensitive workflow data.',
      color: '#FFB86C'
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'Real-time Execution',
      description: 'Watch your workflows execute in real-time with live status updates.',
      color: '#BD93F9'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Lightning Fast',
      description: 'Optimized performance for workflows that execute in milliseconds.',
      color: '#F1FA8C'
    }
  ]

  const useCases = [
    {
      icon: <Code className="w-6 h-6" />,
      title: 'Development Automation',
      description: 'Automate code reviews, testing, and deployment pipelines.'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Customer Support',
      description: 'Build intelligent chatbots and support ticket automation.'
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: 'Data Processing',
      description: 'Transform and analyze data with AI-powered workflows.'
    },
    {
      icon: <Cloud className="w-6 h-6" />,
      title: 'Cloud Integration',
      description: 'Connect and orchestrate multiple cloud services seamlessly.'
    }
  ]

  return (
    <div className="home-page">
      {/* Hero Section with LaserFlow */}
      <section
        ref={heroRef}
        className="hero-section"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background Elements - Behind Mist */}
        <div className="background-elements">
          <div className="bg-element bg-element-1">
            <CheckSquare className="bg-icon" />
            <span>Feature Testing</span>
          </div>
          <div className="bg-element bg-element-2">
            <CheckSquare className="bg-icon" />
            <span>Code Implementation</span>
          </div>
          <div className="bg-element bg-element-3">
            <CheckSquare className="bg-icon" />
            <span>Debug Sessions</span>
          </div>
          <div className="bg-element bg-element-4">
            <Circle className="bg-icon progress" />
            <span>Progress</span>
          </div>
          <div className="bg-element bg-element-5">
            <Circle className="bg-icon progress" />
            <span>Analytics</span>
          </div>
          <div className="bg-grid-pattern" />
        </div>

        {/* Smoke/Mist Effect */}
        <SmokeMist />

        {/* Laser Flow Animation */}
        <div className="laser-flow-wrapper">
          <LaserFlow
            className=""
            style={{}}
            dpr={undefined}
            horizontalBeamOffset={0.18}
            verticalBeamOffset={0.0}
            horizontalSizing={0.3}
            verticalSizing={2.5}
            wispDensity={1.5}
            wispSpeed={15.0}
            wispIntensity={6.0}
            flowSpeed={0.35}
            flowStrength={0.35}
            fogIntensity={0.4}
            fogScale={0.25}
            fogFallSpeed={0.4}
            mouseTiltStrength={0.02}
            mouseSmoothTime={0.0}
            decay={1.2}
            falloffStart={1.8}
            color="#8BE9FD"
          />
        </div>

        {/* Animated Workflow Box */}
        <div className="workflow-box-container">
          <div className="workflow-box">
            {/* Dotted Surface Background */}
            <DottedSurface className="workflow-box-background" />
            
            {/* Workflow Box Title */}
            <div className="workflow-box-title">
              <h2 className="workflow-title-text">Agent Flow Builder in action</h2>
            </div>
            
            {/* Animated Nodes */}
            <div className="animated-nodes">
              {/* Trigger Node */}
              <div className="demo-node trigger-node" style={{ '--delay': '0s' } as React.CSSProperties}>
                <div className="node-glow" style={{ '--glow-color': '#FF79C6' } as React.CSSProperties} />
                <div className="node-content">
                  <Zap className="node-icon" />
                  <span className="node-label">Trigger</span>
                </div>
                <div className="node-pulse" />
                {/* Connection Points */}
                <div className="connection-point connection-point-right" />
              </div>

              {/* Agent Node */}
              <div className="demo-node agent-node" style={{ '--delay': '0.6s' } as React.CSSProperties}>
                <div className="node-glow" style={{ '--glow-color': '#8BE9FD' } as React.CSSProperties} />
                <div className="node-content">
                  <Brain className="node-icon" />
                  <span className="node-label">AI Agent</span>
                </div>
                <div className="node-pulse" />
                {/* Connection Points */}
                <div className="connection-point connection-point-left" />
                <div className="connection-point connection-point-right" />
              </div>

              {/* Action Node */}
              <div className="demo-node action-node" style={{ '--delay': '1.2s' } as React.CSSProperties}>
                <div className="node-glow" style={{ '--glow-color': '#50FA7B' } as React.CSSProperties} />
                <div className="node-content">
                  <Rocket className="node-icon" />
                  <span className="node-label">Action</span>
                </div>
                <div className="node-pulse" />
                {/* Connection Points */}
                <div className="connection-point connection-point-left" />
              </div>

              {/* Connection Line 1 - positioned absolutely between nodes */}
              <div className="connection-line-wrapper">
                <div className="connection-line connection-line-1" style={{ '--delay': '0.3s' } as React.CSSProperties}>
                  <div className="connection-dot-moving dot-1" />
                </div>
              </div>

              {/* Connection Line 2 - positioned absolutely between nodes */}
              <div className="connection-line-wrapper">
                <div className="connection-line connection-line-2" style={{ '--delay': '0.9s' } as React.CSSProperties}>
                  <div className="connection-dot-moving dot-2" />
                </div>
              </div>
            </div>

            {/* Workflow Stats */}
            <div className="workflow-stats">
              <div className="stat-item" style={{ '--delay': '1.5s' } as React.CSSProperties}>
                <CheckCircle2 className="stat-icon" />
                <span className="stat-value">99.9%</span>
                <span className="stat-label">Uptime</span>
              </div>
              <div className="stat-item" style={{ '--delay': '1.7s' } as React.CSSProperties}>
                <Zap className="stat-icon" />
                <span className="stat-value">&lt;50ms</span>
                <span className="stat-label">Response</span>
              </div>
              <div className="stat-item" style={{ '--delay': '1.9s' } as React.CSSProperties}>
                <Workflow className="stat-icon" />
                <span className="stat-value">1M+</span>
                <span className="stat-label">Executions</span>
              </div>
        </div>
          </div>
        </div>

        {/* Reveal Effect Overlay */}
        <div
          ref={revealImgRef}
          className="reveal-overlay"
          style={{
            '--mx': `${mousePos.x}px`,
            '--my': `${mousePos.y}px`
          } as React.CSSProperties}
        />

        {/* Hero Content */}
        <div className="hero-content">
          <h1 className="hero-title hero-title-bold">
            Everything App
            <br />
            for your teams
          </h1>
          <p className="hero-subtitle">
            AgentFlow, an open-source platform, serves as an all-in-one
            <br />
            replacement of Linear, Jira, Slack, and Notion.
          </p>
          <div className="hero-actions">
            <button 
              className="cta-button primary single flashlight-button"
              onMouseMove={handleButtonMouseMove}
              onMouseLeave={handleButtonMouseLeave}
              onClick={() => navigate('/workflows')}
            >
              SEE IN ACTION
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" ref={featuresSectionRef}>
        <div className="section-container">
          <div className="section-header animate-on-scroll">
            <h2 className="section-title">Everything you need</h2>
            <p className="section-subtitle">
              Powerful features to build, deploy, and scale your AI workflows
            </p>
          </div>
          
          <div className="bento-grid">
            {features.map((feature, index) => {
              const mousePos = featureCardsMouse[index]
              const tiltX = mousePos ? (mousePos.y - 50) / 10 : 0
              const tiltY = mousePos ? (50 - mousePos.x) / 10 : 0
              
              return (
                <div 
                  key={index} 
                  className={`bento-card bento-card-${index + 1} animate-on-scroll`}
                  style={{ 
                    '--delay': `${index * 0.1}s`,
                    '--accent-color': feature.color,
                    '--mouse-x': mousePos ? `${mousePos.x}%` : '50%',
                    '--mouse-y': mousePos ? `${mousePos.y}%` : '50%',
                    '--tilt-x': `${tiltX}deg`,
                    '--tilt-y': `${tiltY}deg`,
                    transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
                  } as React.CSSProperties}
                  onMouseMove={(e) => handleFeatureCardMouseMove(index, e)}
                  onMouseLeave={() => handleFeatureCardMouseLeave(index)}
                >
                  <div className="bento-flashlight" />
                  <div className="feature-icon" style={{ color: feature.color }}>
                    {feature.icon}
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                  <div className="feature-glow" style={{ backgroundColor: feature.color }} />
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="use-cases-section">
        <div className="section-container">
          <div className="section-header animate-on-scroll">
            <h2 className="section-title">Built for every team</h2>
            <p className="section-subtitle">
              From startups to enterprises, AgentFlow adapts to your needs
            </p>
          </div>
          
          <div className="use-cases-grid">
            {useCases.map((useCase, index) => {
              // Vary glow positions for visual interest
              const glowVariants = [
                'bottom', // Bottom edge glow
                'corner', // Corner glow
                'right',  // Right side glow
                'bottom', // Bottom edge glow
                'corner', // Corner glow
                'right'   // Right side glow
              ]
              const glowVariant = glowVariants[index % glowVariants.length]
              
              return (
                <div 
                  key={index} 
                  className={`use-case-card use-case-card-${glowVariant} animate-on-scroll`}
                  style={{ '--delay': `${index * 0.15}s` } as React.CSSProperties}
                >
                  <div className="use-case-card-glow" />
                  <div className="use-case-icon-wrapper">
                    <div className="use-case-icon-glow" />
                    <div className="use-case-icon">
                      {useCase.icon}
                    </div>
                  </div>
                  <h3 className="use-case-title">{useCase.title}</h3>
                  <p className="use-case-description">{useCase.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Community Preview Section */}
      <section className="community-preview-section">
        <div className="section-container">
          <div className="section-header animate-on-scroll">
            <h2 className="section-title">Sync with AgentFlow. Both ways.</h2>
            <p className="section-subtitle">
              Manage your workflows efficiently with AgentFlow's bidirectional synchronization. 
              Use AgentFlow as an advanced front-end for your AI agent workflows and automation.
            </p>
            <div className="community-cta">
              <button 
                className="cta-button primary single flashlight-button"
                onClick={() => navigate('/community')}
                onMouseMove={handleButtonMouseMove}
                onMouseLeave={handleButtonMouseLeave}
              >
                Explore Community
                <ArrowRight className="w-5 h-5" />
              </button>
                </div>
          </div>
          
          <div className="community-window-container animate-on-scroll">
            <div className="community-window">
              {/* Left Sidebar */}
              <div className="community-sidebar">
                <div className="sidebar-item">
                  <Home className="sidebar-icon" />
                </div>
                <div className="sidebar-item">
                  <Calendar className="sidebar-icon" />
                </div>
                <div className="sidebar-item">
                  <Inbox className="sidebar-icon" />
                </div>
                <div className="sidebar-item">
                  <FileText className="sidebar-icon" />
                </div>
                <div className="sidebar-item">
                  <Settings className="sidebar-icon" />
                </div>
                <div className="sidebar-item">
                  <CheckSquare className="sidebar-icon" />
                </div>
                <div className="sidebar-item">
                  <Clock className="sidebar-icon" />
                </div>
                <div className="sidebar-item">
                  <Video className="sidebar-icon" />
                </div>
                <div className="sidebar-item">
                  <Plus className="sidebar-icon" />
                </div>
                
                {/* Progress Section */}
                <div className="sidebar-progress">
                  <div className="progress-header">TO DO</div>
                  <div className="progress-circle">
                    <svg className="progress-ring" viewBox="0 0 36 36">
                      <circle
                        className="progress-ring-bg"
                        cx="18"
                        cy="18"
                        r="15.915"
                      />
                      <circle
                        className="progress-ring-fill"
                        cx="18"
                        cy="18"
                        r="15.915"
                        strokeDasharray={`${56} 100`}
                      />
                    </svg>
                    <span className="progress-text">56%</span>
                  </div>
                </div>
          </div>
          
              {/* Main Content */}
              <div className="community-content">
                {/* Header */}
                <div className="community-header">
                  <div className="search-bar">
                    <Search className="search-icon" />
                    <span>Q Search...</span>
                  </div>
                  <div className="header-buttons">
                    <button className="header-btn">View</button>
                    <button className="header-btn">Show</button>
                  </div>
                </div>

                {/* Task Sections */}
                <div className="task-sections">
                  {/* IN PROGRESS Section */}
                  <div className="task-section">
                    <div className="task-section-header">
                      <h3 className="task-section-title">IN PROGRESS - 6</h3>
                    </div>
                    <div className="task-list">
                      {[
                        { id: 'WF-51', title: 'Store workflow data as JSON instead of XML', progress: '2/3', tag: 'MVP', tagColor: '#007AFF', time: '24 hrs', date: '12 Mar', avatar: 'BC' },
                        { id: 'WF-60', title: 'Feature Request: Document analysis workflow', progress: '1/3', tag: 'PreMVP', tagColor: '#AF52DE', time: '5 jun 2024', date: '13 Mar', avatar: 'CP', count: 4 },
                        { id: 'WF-58', title: 'Improve workflow grouping', progress: '2/3', tag: 'Marketing', tagColor: '#FF9500', time: '14 hrs', date: '15 Mar', avatar: 'JD', count: 2 },
                        { id: 'WF-45', title: 'Storage adapter configuration', progress: '1/3', tag: 'MVP', tagColor: '#007AFF', time: '12 hrs', date: '16 Mar', avatar: 'SM', count: 6 },
                        { id: 'WF-67', title: 'Create workspace templates', progress: '3/3', tag: 'PreMVP', tagColor: '#AF52DE', time: '28 hrs', date: '12 Mar', avatar: 'AB' },
                        { id: 'WF-44', title: 'BUG > Copy workflow link does not work', progress: '1/3', tag: 'Marketing', tagColor: '#FF9500', time: '8 hrs', date: '13 Mar', avatar: 'NM', count: 3 },
                      ].map((task, idx) => (
                        <div key={idx} className="task-item">
                          <div className="task-icon">
                            {idx % 2 === 0 ? <BarChart3 className="icon" /> : <Clock className="icon" />}
                          </div>
                          <div className="task-id">{task.id}</div>
                          <div className="task-title">{task.title}</div>
                          <div className="task-progress">{task.progress}</div>
                          {task.count && <div className="task-count">{task.count}</div>}
                          <div className="task-tag" style={{ backgroundColor: `${task.tagColor}20`, color: task.tagColor, borderColor: `${task.tagColor}40` }}>
                            {task.tag}
                          </div>
                          <div className="task-time">{task.time}</div>
                          <div className="task-date">{task.date}</div>
                          <div className="task-avatar">{task.avatar}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* UNDER REVIEW Section */}
                  <div className="task-section">
                    <div className="task-section-header">
                      <h3 className="task-section-title">UNDER REVIEW - 3</h3>
                    </div>
                    <div className="task-list">
                      {[
                        { id: 'WF-67', title: 'Team > change workflow icon', progress: '2/3', tag: 'Marketing', tagColor: '#FF9500', time: '14 hrs', date: '15 Mar', avatar: 'CP' },
                        { id: 'WF-45', title: 'Feature Request: Lock workflow content', progress: '3/3', tag: 'PreMVP', tagColor: '#AF52DE', time: '9 jun 2024', date: '16 Mar', avatar: 'JD', count: 2 },
                        { id: 'WF-44', title: 'Create the potential partners list', progress: '2/3', tag: 'Marketing', tagColor: '#FF9500', time: '18 hrs', date: '17 Mar', avatar: 'SM', count: 5 },
                      ].map((task, idx) => (
                        <div key={idx} className="task-item">
                          <div className="task-icon">
                            <MessageCircle className="icon" />
                          </div>
                          <div className="task-id">{task.id}</div>
                          <div className="task-title">{task.title}</div>
                          <div className="task-progress">{task.progress}</div>
                          {task.count && <div className="task-count">{task.count}</div>}
                          <div className="task-tag" style={{ backgroundColor: `${task.tagColor}20`, color: task.tagColor, borderColor: `${task.tagColor}40` }}>
                            {task.tag}
                          </div>
                          <div className="task-time">{task.time}</div>
                          <div className="task-date">{task.date}</div>
                          <div className="task-avatar">{task.avatar}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* TODO Section */}
                  <div className="task-section">
                    <div className="task-section-header">
                      <h3 className="task-section-title">TODO</h3>
                    </div>
                  </div>
                </div>
          </div>
        </div>
          </div>
        </div>
      </section>

      {/* Community Collaboration Section */}
      <section className="community-collaboration-section">
        <div className="section-container">
          <div className="section-header animate-on-scroll">
            <h2 className="section-title">Work together. Like in the office.</h2>
            <p className="section-subtitle">
              Create customized virtual workspace environments for any team or project with real-time collaboration, 
              high-quality communication, and seamless workflow sharing.
            </p>
          </div>

          <div className="collaboration-workspace-container animate-on-scroll">
            {/* Virtual Workspace Background */}
            <div className="virtual-workspace-bg">
              {/* Workspace Rooms */}
              <div className="workspace-room workspace-room-active" style={{ top: '15%', left: '10%' }}>
                <div className="room-glow" />
                <div className="room-label">Workflow Studio</div>
                <div className="room-participants">
                  <div className="room-avatar" />
                  <div className="room-avatar" />
                  <div className="room-avatar" />
                  <div className="room-avatar" />
                </div>
              </div>

              <div className="workspace-room workspace-room-active" style={{ top: '35%', left: '10%' }}>
                <div className="room-glow" />
                <div className="room-label">Agent Development</div>
                <div className="room-time">Active now</div>
                <div className="room-participants">
                  <div className="room-avatar" />
                  <div className="room-avatar" />
                </div>
              </div>

              <div className="workspace-room workspace-room-active" style={{ top: '10%', right: '15%' }}>
                <div className="room-glow" />
                <div className="room-label">Team Sync</div>
                <div className="room-participants">
                  <div className="room-avatar" />
                  <div className="room-avatar" />
                </div>
              </div>

              <div className="workspace-room workspace-room-active" style={{ top: '30%', right: '15%' }}>
                <div className="room-glow" />
                <div className="room-label">All Hands</div>
                <div className="room-participants">
                  <div className="room-avatar" />
                  <div className="room-avatar" />
                </div>
              </div>

              <div className="workspace-room workspace-room-active" style={{ bottom: '20%', left: '15%' }}>
                <div className="room-glow" />
                <div className="room-label">Code Review</div>
                <div className="room-time">Starts at 14:00</div>
                <div className="room-participants">
                  <div className="room-avatar" />
                </div>
              </div>
            </div>

            {/* Collaboration Interface Card */}
            <div className="collaboration-card">
              <div className="collaboration-card-header">
                <div className="collab-header-left">
                  <h3 className="collab-title">Workflow Design Session</h3>
                  <p className="collab-participants">4 participants</p>
                </div>
              </div>

              <div className="collaboration-main-area">
                {/* Main Participant */}
                <div className="collab-main-participant">
                  <div className="participant-video">
                    <div className="participant-avatar-large">
                      <Users className="participant-icon" />
                    </div>
                    <div className="participant-name">Sarah Chen</div>
                  </div>
                </div>

                {/* Side Participants */}
                <div className="collab-side-participants">
                  <div className="collab-participant-small">
                    <div className="participant-video-small">
                      <div className="participant-avatar-small">
                        <Code className="participant-icon-small" />
                      </div>
                    </div>
                    <div className="participant-controls-small">
                      <Mic className="mic-icon" />
                      <div className="participant-dots" />
                    </div>
                    <div className="participant-name-small">Alex Rivera</div>
                  </div>

                  <div className="collab-participant-small">
                    <div className="participant-video-small">
                      <div className="participant-avatar-small">
                        <Workflow className="participant-icon-small" />
                      </div>
                    </div>
                    <div className="participant-controls-small">
                      <Mic className="mic-icon" />
                      <div className="participant-dots" />
                    </div>
                    <div className="participant-name-small">Jordan Kim</div>
                  </div>

                  <div className="collab-participant-small">
                    <div className="participant-video-small">
                      <div className="participant-avatar-small">
                        <Brain className="participant-icon-small" />
                      </div>
                    </div>
                    <div className="participant-controls-small">
                      <Mic className="mic-icon" />
                      <div className="participant-dots" />
                    </div>
                    <div className="participant-name-small">Taylor Morgan</div>
                  </div>
                </div>
              </div>

              {/* Collaboration Controls */}
              <div className="collaboration-controls">
                <button className="collab-control-btn">
                  <Share2 className="control-icon" />
                </button>
                <button className="collab-control-btn">
                  <Mic className="control-icon" />
                </button>
                <button className="collab-control-btn collab-control-btn-danger">
                  <X className="control-icon" />
                </button>
                <button className="collab-control-btn">
                  <VideoIcon className="control-icon" />
                </button>
                <button className="collab-control-btn">
                  <Maximize className="control-icon" />
                </button>
              </div>

              <p className="collaboration-description">
                Collaborating with remote teams is seamless in your virtual workspace environment. 
                Enjoy real-time communication within your workflow space without additional software hassle.
              </p>
            </div>

            {/* Feature Labels */}
            <div className="collaboration-features">
              <div className="collab-feature-item">
                <Palette className="feature-icon" />
                <span className="feature-label">Customize</span>
              </div>
              <div className="collab-feature-item">
                <VideoIcon className="feature-icon" />
                <span className="feature-label">Audio and Video</span>
              </div>
              <div className="collab-feature-item">
                <UserPlus className="feature-icon" />
                <span className="feature-label">Invite</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container animate-on-scroll">
          <div className="cta-glow" />
          <h2 className="cta-title">Ready to transform your workflow?</h2>
          <p className="cta-subtitle">
            Join thousands of teams already building with AgentFlow
          </p>
          <button 
            className="cta-button primary large flashlight-button"
            onClick={() => navigate('/workflows')}
            onMouseMove={handleButtonMouseMove}
            onMouseLeave={handleButtonMouseLeave}
          >
            <Rocket className="w-6 h-6" />
            Start Building Now
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </section>
    </div>
  )
}

export default HomePage
