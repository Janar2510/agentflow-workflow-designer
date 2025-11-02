import React, { useState, useEffect, useRef } from 'react'
import { useCoronaDesign } from '../contexts/CoronaDesignContext'
import { CoronaButton } from '../components/ui/CoronaButton'
import Aurora from '../components/ui/Aurora'
import GradientText from '../components/ui/GradientText'
import { 
  Zap, 
  Database, 
  Mail, 
  MessageSquare, 
  Calendar, 
  FileText, 
  CreditCard, 
  Users,
  ShoppingCart,
  BarChart3,
  Globe,
  Shield,
  ArrowRight,
  CheckCircle,
  Search,
  Filter,
  Plus,
  ExternalLink
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

const IntegrationsPage: React.FC = () => {
  const design = useCoronaDesign()
  const [isVisible, setIsVisible] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [hoveredIntegration, setHoveredIntegration] = useState<number | null>(null)

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

  const searchSectionStyles: React.CSSProperties = {
    display: 'flex',
    gap: design.spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: design.spacing['3xl'],
    flexWrap: 'wrap',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
    transition: 'all 0.8s ease-out 0.4s'
  }

  const searchInputStyles: React.CSSProperties = {
    flex: 1,
    maxWidth: '400px',
    padding: `${design.spacing.md} ${design.spacing.lg}`,
    borderRadius: '0.75rem',
    border: `1px solid ${design.colors.borderPrimary}`,
    backgroundColor: design.colors.bgTertiary,
    color: design.colors.textPrimary,
    fontSize: design.typography.sizes.base,
    outline: 'none',
    transition: 'all 0.3s ease'
  }

  const categoryFilterStyles: React.CSSProperties = {
    display: 'flex',
    gap: design.spacing.sm,
    flexWrap: 'wrap'
  }

  const categoryButtonStyles = (isActive: boolean): React.CSSProperties => ({
    padding: `${design.spacing.sm} ${design.spacing.md}`,
    borderRadius: '0.5rem',
    border: `1px solid ${isActive ? design.colors.primary : design.colors.borderPrimary}`,
    backgroundColor: isActive ? `${design.colors.primary}20` : 'transparent',
    color: isActive ? design.colors.primary : design.colors.textSecondary,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: design.typography.sizes.sm,
    fontWeight: design.typography.weights.medium
  })

  const integrationsGridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: design.spacing.xl,
    marginBottom: design.spacing['4xl']
  }

  const integrationCardStyles = (index: number): React.CSSProperties => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
    transition: `all 0.6s ease-out ${index * 0.1}s`,
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden'
  })

  const integrationIconStyles: React.CSSProperties = {
    width: '50px',
    height: '50px',
    borderRadius: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: design.spacing.md,
    fontSize: '24px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  }

  const categories = [
    { id: 'all', name: 'All', count: 500 },
    { id: 'productivity', name: 'Productivity', count: 120 },
    { id: 'marketing', name: 'Marketing', count: 85 },
    { id: 'sales', name: 'Sales', count: 95 },
    { id: 'support', name: 'Support', count: 70 },
    { id: 'analytics', name: 'Analytics', count: 60 },
    { id: 'development', name: 'Development', count: 80 }
  ]

  const integrations = [
    {
      name: 'Slack',
      category: 'productivity',
      icon: MessageSquare,
      color: '#4A154B',
      description: 'Connect your workflows with Slack channels, users, and bots.',
      status: 'active',
      users: '2.5M+'
    },
    {
      name: 'Salesforce',
      category: 'sales',
      icon: Users,
      color: '#00A1E0',
      description: 'Sync leads, contacts, and opportunities with your CRM.',
      status: 'active',
      users: '1.8M+'
    },
    {
      name: 'HubSpot',
      category: 'marketing',
      icon: BarChart3,
      color: '#FF7A59',
      description: 'Automate marketing campaigns and lead nurturing.',
      status: 'active',
      users: '1.2M+'
    },
    {
      name: 'Google Workspace',
      category: 'productivity',
      icon: Mail,
      color: '#4285F4',
      description: 'Integrate with Gmail, Drive, Calendar, and Docs.',
      status: 'active',
      users: '3.1M+'
    },
    {
      name: 'Stripe',
      category: 'sales',
      icon: CreditCard,
      color: '#635BFF',
      description: 'Process payments and manage subscriptions automatically.',
      status: 'active',
      users: '950K+'
    },
    {
      name: 'Zendesk',
      category: 'support',
      icon: MessageSquare,
      color: '#17494D',
      description: 'Automate ticket creation and customer support workflows.',
      status: 'active',
      users: '800K+'
    },
    {
      name: 'Shopify',
      category: 'sales',
      icon: ShoppingCart,
      color: '#96BF48',
      description: 'Sync orders, products, and customer data from your store.',
      status: 'active',
      users: '1.5M+'
    },
    {
      name: 'Notion',
      category: 'productivity',
      icon: FileText,
      color: '#000000',
      description: 'Create and update Notion pages and databases automatically.',
      status: 'active',
      users: '600K+'
    },
    {
      name: 'Calendly',
      category: 'productivity',
      icon: Calendar,
      color: '#0069FF',
      description: 'Automate scheduling and meeting management.',
      status: 'active',
      users: '400K+'
    },
    {
      name: 'Mixpanel',
      category: 'analytics',
      icon: BarChart3,
      color: '#7856FF',
      description: 'Track user behavior and send events automatically.',
      status: 'active',
      users: '350K+'
    },
    {
      name: 'GitHub',
      category: 'development',
      icon: Database,
      color: '#181717',
      description: 'Automate code deployments and repository management.',
      status: 'active',
      users: '700K+'
    },
    {
      name: 'Webhook',
      category: 'development',
      icon: Zap,
      color: '#FF6B6B',
      description: 'Send custom webhooks to any endpoint with your data.',
      status: 'active',
      users: '500K+'
    }
  ]

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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
          <p style={eyebrowStyles}>Connect everything</p>
          <GradientText 
            colors={['#5227FF', '#40ffaa', '#4079ff', '#40ffaa', '#5227FF']}
            animationSpeed={30}
            className="slow"
          >
            <h1 style={titleStyles}>Integrations</h1>
          </GradientText>
          <p style={subtitleStyles}>
            AgentFlow integrates with 500+ tools and platforms to create powerful, 
            automated workflows that connect your entire tech stack. From CRM to marketing 
            automation, we make it easy to build the perfect workflow for your business.
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <div style={searchSectionStyles}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search style={{
            position: 'absolute',
            left: design.spacing.md,
            top: '50%',
            transform: 'translateY(-50%)',
            color: design.colors.textSecondary,
            width: '20px',
            height: '20px'
          }} />
          <input
            type="text"
            placeholder="Search integrations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              ...searchInputStyles,
              paddingLeft: '48px'
            }}
          />
        </div>
        <div style={categoryFilterStyles}>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              style={categoryButtonStyles(selectedCategory === category.id)}
              onMouseEnter={(e) => {
                if (selectedCategory !== category.id) {
                  e.currentTarget.style.backgroundColor = design.colors.bgTertiary
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== category.id) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* =============== INTEGRATIONS GRID =============== */}
      <section style={{ padding: '72px 0', position: 'relative', zIndex: 2 }}>
        <div style={containerStyles}>
          <div style={gridStyles}>
            {filteredIntegrations.map((integration, index) => {
              const Icon = integration.icon
              return (
                <SpotlightCard
                  key={index}
                  style={cardStyles}
                  onMouseEnter={(e) => {
                    Object.assign(e.currentTarget.style, cardHoverStyles)
                    setHoveredIntegration(index)
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.borderColor = design.colors.borderPrimary
                    setHoveredIntegration(null)
                  }}
                >
                  <h3 style={cardTitleStyles}>{integration.name}</h3>
                  <p style={cardDescriptionStyles}>{integration.description}</p>
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
                        color: integration.color
                      }} />
                      <span style={{
                        fontSize: design.typography.sizes.sm,
                        color: design.colors.textSecondary
                      }}>{integration.status}</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: design.spacing.xs
                    }}>
                      <CheckCircle style={{
                        width: '16px',
                        height: '16px',
                        color: design.colors.success,
                        fill: 'currentColor'
                      }} />
                      <span style={{
                        fontSize: design.typography.sizes.sm,
                        color: design.colors.textSecondary
                      }}>{integration.users}</span>
                    </div>
                  </div>
                  <a href="#" style={linkStyles}>
                    Connect →
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
                  Don't See Your Tool?
                </h2>
              </GradientText>
              <p style={{
                fontSize: design.typography.sizes.lg,
                color: design.colors.textSecondary,
                maxWidth: '600px',
                margin: '0 auto',
                marginBottom: design.spacing.xl
              }}>
                We're constantly adding new integrations. Request your favorite tool 
                or build a custom integration with our powerful API.
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
                  Request Integration
                  <ArrowRight style={{ marginLeft: design.spacing.sm }} />
                </CoronaButton>
                <CoronaButton 
                  variant="outline" 
                  size="lg"
                  style={{
                    padding: `${design.spacing.lg} ${design.spacing['2xl']}`,
                    fontSize: design.typography.sizes.lg,
                    fontWeight: design.typography.weights.semibold
                  }}
                >
                  View API Docs
                  <ExternalLink style={{ marginLeft: design.spacing.sm }} />
                </CoronaButton>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </section>
    </div>
  )
}

export default IntegrationsPage


