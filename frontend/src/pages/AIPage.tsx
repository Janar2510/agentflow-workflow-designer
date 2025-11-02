import React, { useState, useEffect, useRef } from 'react'
import { useCoronaDesign } from '../contexts/CoronaDesignContext'
import { CoronaButton } from '../components/ui/CoronaButton'
import Aurora from '../components/ui/Aurora'
import GradientText from '../components/ui/GradientText'
import { 
  Brain, 
  Zap, 
  Eye, 
  MessageSquare, 
  BarChart3, 
  Shield, 
  Cpu, 
  Database,
  ArrowRight,
  Play,
  CheckCircle,
  Star,
  TrendingUp,
  Target,
  Lightbulb,
  Globe,
  Lock,
  Sparkles,
  Activity,
  Layers
} from 'lucide-react'

// SpotlightCard component with cursor-following spotlight effect
const SpotlightCard: React.FC<{
  children: React.ReactNode
  style?: React.CSSProperties
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void
}> = ({ children, style, onMouseEnter, onMouseLeave }) => {
  const design = useCoronaDesign()
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  
  const cardStyles: React.CSSProperties = {
    position: 'relative',
    borderRadius: '1.5rem',
    border: `1px solid ${design.colors.borderPrimary}`,
    backgroundColor: design.colors.bgSecondary,
    padding: '2rem',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    ...style
  }

  const spotlightStyles: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '1.5rem',
    background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, ${design.colors.primary}30, transparent 80%)`,
    opacity: isHovered ? 1 : 0,
    transition: 'opacity 0.3s ease',
    pointerEvents: 'none'
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      setMousePosition({ x, y })
    }
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(true)
    onMouseEnter?.(e)
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(false)
    onMouseLeave?.(e)
  }

  return (
    <div
      className="card-spotlight"
      style={cardStyles}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div style={spotlightStyles} />
      {children}
    </div>
  )
}

const AIPage: React.FC = () => {
  const design = useCoronaDesign()
  const [isVisible, setIsVisible] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const [hoveredCapability, setHoveredCapability] = useState<number | null>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const pageStyles: React.CSSProperties = {
    minHeight: '100vh',
    background: `radial-gradient(1200px 800px at 10% -20%, ${design.colors.bgSecondary} 0%, ${design.colors.bgPrimary} 60%), ${design.colors.bgPrimary}`,
    fontFamily: design.typography.fontFamily,
    color: design.colors.textPrimary,
    overflow: 'hidden',
    position: 'relative'
  }

  const containerStyles: React.CSSProperties = {
    width: 'min(1120px, 92%)',
    margin: '0 auto'
  }

  const heroStyles: React.CSSProperties = {
    padding: '96px 0 64px',
    textAlign: 'center',
    position: 'relative',
    zIndex: 2,
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
    transition: 'all 0.8s ease-out'
  }

  const eyebrowStyles: React.CSSProperties = {
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: design.colors.secondary,
    fontWeight: design.typography.weights.semibold,
    marginBottom: design.spacing.sm,
    fontSize: design.typography.sizes.lg
  }

  const titleStyles: React.CSSProperties = {
    fontSize: 'clamp(2.2rem, 5vw, 4rem)',
    lineHeight: 1.05,
    margin: 0,
    fontWeight: design.typography.weights.bold,
    background: `linear-gradient(135deg, ${design.colors.primary}, ${design.colors.secondary})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  }

  const subtitleStyles: React.CSSProperties = {
    margin: '16px auto 24px',
    color: design.colors.textSecondary,
    maxWidth: '860px',
    fontSize: design.typography.sizes.xl,
    lineHeight: 1.6
  }

  const gridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gap: design.spacing.md
  }

  const cardStyles: React.CSSProperties = {
    gridColumn: 'span 6',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  }

  const cardHoverStyles: React.CSSProperties = {
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 25px ${design.colors.primary}20`,
    borderColor: design.colors.primary
  }

  const cardTitleStyles: React.CSSProperties = {
    fontSize: design.typography.sizes.lg,
    fontWeight: design.typography.weights.semibold,
    marginBottom: design.spacing.sm,
    color: design.colors.textPrimary
  }

  const cardDescriptionStyles: React.CSSProperties = {
    fontSize: design.typography.sizes.base,
    color: design.colors.textSecondary,
    lineHeight: 1.5,
    marginBottom: design.spacing.md
  }

  const linkStyles: React.CSSProperties = {
    color: design.colors.primary,
    textDecoration: 'none',
    fontWeight: design.typography.weights.semibold,
    fontSize: design.typography.sizes.sm
  }

  const ctaStyles: React.CSSProperties = {
    display: 'flex',
    gap: design.spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: design.spacing.xl,
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
    transition: 'all 0.8s ease-out 0.4s'
  }

  const featuresGridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: design.spacing.xl,
    marginBottom: design.spacing['4xl']
  }

  const featureCardStyles = (index: number): React.CSSProperties => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
    transition: `all 0.6s ease-out ${index * 0.1}s`,
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden'
  })

  const capabilitiesGridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: design.spacing.xl,
    marginBottom: design.spacing['4xl']
  }

  const capabilityCardStyles = (index: number): React.CSSProperties => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
    transition: `all 0.6s ease-out ${0.8 + index * 0.1}s`,
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden'
  })

  const statsSectionStyles: React.CSSProperties = {
    background: `linear-gradient(135deg, ${design.colors.bgSecondary}, ${design.colors.bgTertiary})`,
    borderRadius: '1.5rem',
    padding: design.spacing['3xl'],
    marginBottom: design.spacing['4xl'],
    position: 'relative',
    overflow: 'hidden'
  }

  const statsGridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: design.spacing.xl,
    textAlign: 'center'
  }

  const statNumberStyles: React.CSSProperties = {
    fontSize: design.typography.sizes['4xl'],
    fontWeight: design.typography.weights.bold,
    color: design.colors.primary,
    marginBottom: design.spacing.sm
  }

  const statLabelStyles: React.CSSProperties = {
    fontSize: design.typography.sizes.lg,
    color: design.colors.textSecondary,
    fontWeight: design.typography.weights.medium
  }

  const features = [
    {
      icon: Brain,
      title: 'Intelligent Decision Making',
      description: 'Our AI analyzes patterns and makes smart decisions to optimize your workflows automatically.',
      color: design.colors.primary,
      details: [
        'Pattern recognition across all data sources',
        'Predictive analytics for workflow optimization',
        'Automatic decision trees based on business rules',
        'Continuous learning from user behavior'
      ]
    },
    {
      icon: MessageSquare,
      title: 'Natural Language Processing',
      description: 'Build workflows using natural language. Just describe what you want, and our AI builds it for you.',
      color: design.colors.secondary,
      details: [
        'Voice-to-workflow conversion',
        'Smart text analysis and extraction',
        'Multi-language support',
        'Context-aware conversation handling'
      ]
    },
    {
      icon: Eye,
      title: 'Computer Vision',
      description: 'Process images, documents, and visual content with advanced computer vision capabilities.',
      color: design.colors.success,
      details: [
        'Document text extraction (OCR)',
        'Image classification and tagging',
        'Visual quality assessment',
        'Automated visual content moderation'
      ]
    },
    {
      icon: BarChart3,
      title: 'Predictive Analytics',
      description: 'Forecast trends, predict outcomes, and make data-driven decisions with our advanced analytics engine.',
      color: design.colors.warning,
      details: [
        'Time series forecasting',
        'Anomaly detection',
        'Customer behavior prediction',
        'Revenue and growth projections'
      ]
    }
  ]

  const capabilities = [
    {
      icon: Zap,
      title: 'Smart Automation',
      description: 'AI-powered automation that learns and adapts to your business needs.',
      color: '#FF6B6B',
      metrics: '95% accuracy'
    },
    {
      icon: Target,
      title: 'Predictive Modeling',
      description: 'Build predictive models to forecast business outcomes and trends.',
      color: '#4ECDC4',
      metrics: '87% precision'
    },
    {
      icon: Lightbulb,
      title: 'Intelligent Insights',
      description: 'Get actionable insights from your data with AI-powered analysis.',
      color: '#45B7D1',
      metrics: '3x faster'
    },
    {
      icon: Globe,
      title: 'Multi-Language AI',
      description: 'Process and understand content in 50+ languages automatically.',
      color: '#96CEB4',
      metrics: '50+ languages'
    },
    {
      icon: Shield,
      title: 'AI Security',
      description: 'Enterprise-grade security with AI-powered threat detection.',
      color: '#FECA57',
      metrics: '99.9% secure'
    },
    {
      icon: Cpu,
      title: 'Edge Computing',
      description: 'Process AI workloads at the edge for faster, more efficient operations.',
      color: '#FF9FF3',
      metrics: '10x faster'
    }
  ]

  const stats = [
    { number: '99.7%', label: 'AI Accuracy Rate' },
    { number: '50+', label: 'AI Models Available' },
    { number: '10M+', label: 'AI Predictions Daily' },
    { number: '99.9%', label: 'Uptime Guarantee' }
  ]

  return (
    <div style={pageStyles}>
      {/* Aurora Background Effect */}
      <Aurora 
        colorStops={['#3b1f6b', '#1f6b3b', '#1f3b6b']}
        amplitude={0.7}
        blend={0.8}
        speed={0.3}
      />
      
      {/* ===================== HERO ===================== */}
      <section style={heroStyles}>
        <div style={containerStyles}>
          <p style={eyebrowStyles}>AI-powered automation</p>
          <GradientText 
            colors={['#5227FF', '#40ffaa', '#4079ff', '#40ffaa', '#5227FF']}
            animationSpeed={30}
            className="slow"
          >
            <h1 style={titleStyles}>AI Capabilities</h1>
          </GradientText>
          <p style={subtitleStyles}>
            Harness the power of cutting-edge artificial intelligence to create intelligent, 
            self-learning workflows that adapt to your business needs. From natural language 
            processing to predictive analytics, our AI capabilities transform how you work.
          </p>
          <div style={ctaStyles}>
            <CoronaButton 
              variant="primary" 
              size="lg"
              style={{
              background: `linear-gradient(135deg, ${design.colors.primary}, ${design.colors.secondary})`,
              padding: `${design.spacing.md} ${design.spacing.xl}`,
              fontSize: design.typography.sizes.lg,
              fontWeight: design.typography.weights.semibold
              }}
            >
              <Play style={{ marginRight: design.spacing.sm }} />
              Try AI Features
            </CoronaButton>
            <CoronaButton 
              variant="secondary" 
              size="lg"
              style={{
                padding: `${design.spacing.md} ${design.spacing.xl}`,
                fontSize: design.typography.sizes.lg,
                fontWeight: design.typography.weights.semibold
              }}
            >
              View AI Documentation
              <ArrowRight style={{ marginLeft: design.spacing.sm }} />
            </CoronaButton>
          </div>
        </div>
      </section>

      {/* =============== AI FEATURES GRID =============== */}
      <section style={{ padding: '72px 0', position: 'relative', zIndex: 2 }}>
        <div style={containerStyles}>
          <div style={gridStyles}>
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <SpotlightCard
                  key={index}
                  style={cardStyles}
                  onMouseEnter={(e) => {
                    Object.assign(e.currentTarget.style, cardHoverStyles)
                    setActiveFeature(index)
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.borderColor = design.colors.borderPrimary
                    setActiveFeature(0)
                  }}
                >
                  <h3 style={cardTitleStyles}>{feature.title}</h3>
                  <p style={cardDescriptionStyles}>{feature.description}</p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: design.spacing.md
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: design.spacing.sm
                    }}>
                      <Icon style={{
                        width: '20px',
                        height: '20px',
                        color: feature.color
                      }} />
                      <span style={{
                        fontSize: design.typography.sizes.sm,
                        color: design.colors.textSecondary
                      }}>{feature.metrics}</span>
                    </div>
                  </div>
                  <a href="#" style={linkStyles}>
                    Learn More →
                  </a>
                </SpotlightCard>
              )
            })}
          </div>
        </div>
      </section>


      {/* ================== CTA SECTION ================== */}
      <section style={{ padding: '72px 0', position: 'relative', zIndex: 2 }}>
        <div style={containerStyles}>
          <div style={gridStyles}>
            <SpotlightCard style={{
              ...cardStyles,
              gridColumn: 'span 12',
              textAlign: 'center',
              padding: design.spacing['3xl']
            }}>
              <GradientText 
                colors={['#5227FF', '#40ffaa', '#4079ff', '#40ffaa', '#5227FF']}
                animationSpeed={30}
                className="slow"
              >
                <h2 style={{
                  fontSize: 'clamp(2.2rem, 5vw, 4rem)',
                  lineHeight: 1.05,
                  margin: 0,
                  fontWeight: design.typography.weights.bold,
                  marginBottom: design.spacing.lg
                }}>
                  Ready to Experience AI-Powered Automation?
                </h2>
              </GradientText>
              <p style={{
                fontSize: design.typography.sizes.lg,
                color: design.colors.textSecondary,
                maxWidth: '600px',
                margin: '0 auto',
                marginBottom: design.spacing.xl
              }}>
                Start building intelligent workflows today. Our AI learns from your data 
                and continuously improves to deliver better results.
              </p>
              <div style={{
                display: 'flex',
                gap: design.spacing.lg,
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                <CoronaButton 
                  variant="primary" 
                  size="lg"
                  style={{
                    background: `linear-gradient(135deg, ${design.colors.primary}, ${design.colors.secondary})`,
                    padding: `${design.spacing.lg} ${design.spacing['2xl']}`,
                    fontSize: design.typography.sizes.lg,
                    fontWeight: design.typography.weights.semibold
                  }}
                >
                  <Sparkles style={{ marginRight: design.spacing.sm }} />
                  Start with AI
                </CoronaButton>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: design.spacing.sm,
                  color: design.colors.textSecondary
                }}>
                  <Lock style={{ color: design.colors.success }} />
                  <span>Enterprise-grade security</span>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AIPage


