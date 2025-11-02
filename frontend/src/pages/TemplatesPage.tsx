import React, { useState, useEffect, useRef } from 'react'
import { useCoronaDesign } from '../contexts/CoronaDesignContext'
import { CoronaButton } from '../components/ui/CoronaButton'
import Aurora from '../components/ui/Aurora'
import GradientText from '../components/ui/GradientText'
import { 
  Zap, 
  Users, 
  Mail, 
  ShoppingCart, 
  BarChart3, 
  Calendar, 
  MessageSquare, 
  FileText,
  ArrowRight,
  Play,
  Star,
  Download,
  Eye,
  Clock,
  Tag,
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

const TemplatesPage: React.FC = () => {
  const design = useCoronaDesign()
  const [isVisible, setIsVisible] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [hoveredTemplate, setHoveredTemplate] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

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

  const controlsStyles: React.CSSProperties = {
    display: 'flex',
    gap: design.spacing.lg,
    justifyContent: 'space-between',
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

  const viewToggleStyles: React.CSSProperties = {
    display: 'flex',
    gap: design.spacing.xs,
    border: `1px solid ${design.colors.borderPrimary}`,
    borderRadius: '0.5rem',
    overflow: 'hidden'
  }

  const viewButtonStyles = (isActive: boolean): React.CSSProperties => ({
    padding: `${design.spacing.sm} ${design.spacing.md}`,
    backgroundColor: isActive ? design.colors.primary : 'transparent',
    color: isActive ? 'white' : design.colors.textSecondary,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: design.typography.sizes.sm,
    border: 'none',
    outline: 'none'
  })

  const templatesGridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: viewMode === 'grid' 
      ? 'repeat(auto-fill, minmax(350px, 1fr))' 
      : '1fr',
    gap: design.spacing.xl,
    marginBottom: design.spacing['4xl']
  }

  const templateCardStyles = (index: number): React.CSSProperties => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
    transition: `all 0.6s ease-out ${index * 0.1}s`,
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden'
  })

  const categories = [
    { id: 'all', name: 'All Templates', count: 150 },
    { id: 'marketing', name: 'Marketing', count: 45 },
    { id: 'sales', name: 'Sales', count: 35 },
    { id: 'support', name: 'Support', count: 25 },
    { id: 'hr', name: 'HR', count: 20 },
    { id: 'finance', name: 'Finance', count: 15 },
    { id: 'productivity', name: 'Productivity', count: 10 }
  ]

  const templates = [
    {
      name: 'Lead Nurturing Campaign',
      category: 'marketing',
      icon: Mail,
      color: '#FF6B6B',
      description: 'Automatically nurture leads through email sequences based on their behavior and engagement.',
      difficulty: 'Beginner',
      timeToSetup: '5 min',
      rating: 4.8,
      uses: '12.5K',
      tags: ['Email', 'Marketing', 'Automation'],
      preview: 'Email sequence with 5 touchpoints'
    },
    {
      name: 'Customer Onboarding',
      category: 'support',
      icon: Users,
      color: '#4ECDC4',
      description: 'Welcome new customers with automated onboarding emails, tasks, and follow-ups.',
      difficulty: 'Intermediate',
      timeToSetup: '15 min',
      rating: 4.9,
      uses: '8.2K',
      tags: ['Onboarding', 'Customer Success', 'Email'],
      preview: 'Multi-step onboarding workflow'
    },
    {
      name: 'E-commerce Order Processing',
      category: 'sales',
      icon: ShoppingCart,
      color: '#45B7D1',
      description: 'Process orders, update inventory, and send confirmation emails automatically.',
      difficulty: 'Advanced',
      timeToSetup: '30 min',
      rating: 4.7,
      uses: '15.3K',
      tags: ['E-commerce', 'Orders', 'Inventory'],
      preview: 'Complete order fulfillment flow'
    },
    {
      name: 'Social Media Scheduler',
      category: 'marketing',
      icon: MessageSquare,
      color: '#96CEB4',
      description: 'Schedule and publish content across multiple social media platforms.',
      difficulty: 'Beginner',
      timeToSetup: '10 min',
      rating: 4.6,
      uses: '6.8K',
      tags: ['Social Media', 'Scheduling', 'Content'],
      preview: 'Multi-platform posting workflow'
    },
    {
      name: 'Invoice Generation',
      category: 'finance',
      icon: FileText,
      color: '#FECA57',
      description: 'Generate and send invoices automatically based on project completion or time tracking.',
      difficulty: 'Intermediate',
      timeToSetup: '20 min',
      rating: 4.8,
      uses: '4.1K',
      tags: ['Finance', 'Invoicing', 'Billing'],
      preview: 'Automated invoice creation'
    },
    {
      name: 'Meeting Scheduler',
      category: 'productivity',
      icon: Calendar,
      color: '#FF9FF3',
      description: 'Automatically schedule meetings based on availability and send calendar invites.',
      difficulty: 'Beginner',
      timeToSetup: '8 min',
      rating: 4.9,
      uses: '9.7K',
      tags: ['Calendar', 'Scheduling', 'Meetings'],
      preview: 'Smart scheduling workflow'
    },
    {
      name: 'Data Sync & Backup',
      category: 'productivity',
      icon: BarChart3,
      color: '#54A0FF',
      description: 'Sync data between systems and create automated backups of important information.',
      difficulty: 'Advanced',
      timeToSetup: '25 min',
      rating: 4.7,
      uses: '3.2K',
      tags: ['Data', 'Sync', 'Backup'],
      preview: 'Multi-system data synchronization'
    },
    {
      name: 'Customer Feedback Collection',
      category: 'support',
      icon: MessageSquare,
      color: '#5F27CD',
      description: 'Collect and analyze customer feedback through surveys and review requests.',
      difficulty: 'Intermediate',
      timeToSetup: '12 min',
      rating: 4.5,
      uses: '7.4K',
      tags: ['Feedback', 'Surveys', 'Reviews'],
      preview: 'Automated feedback collection'
    }
  ]

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return design.colors.success
      case 'Intermediate': return design.colors.warning
      case 'Advanced': return design.colors.danger
      default: return design.colors.textSecondary
    }
  }

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
          <p style={eyebrowStyles}>Pre-built workflows</p>
          <GradientText 
            colors={['#5227FF', '#40ffaa', '#4079ff', '#40ffaa', '#5227FF']}
            animationSpeed={30}
            className="slow"
          >
            <h1 style={titleStyles}>Workflow Templates</h1>
          </GradientText>
          <p style={subtitleStyles}>
            Jumpstart your automation with our library of 150+ professionally designed templates. 
            From marketing campaigns to customer support, find the perfect workflow for your business needs.
          </p>
        </div>
      </section>

      {/* Controls Section */}
      <div style={controlsStyles}>
        <div style={{ display: 'flex', gap: design.spacing.lg, alignItems: 'center', flex: 1 }}>
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
              placeholder="Search templates..."
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
        <div style={viewToggleStyles}>
          <button
            onClick={() => setViewMode('grid')}
            style={viewButtonStyles(viewMode === 'grid')}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            style={viewButtonStyles(viewMode === 'list')}
          >
            List
          </button>
        </div>
      </div>

      {/* =============== TEMPLATES GRID =============== */}
      <section style={{ padding: '72px 0', position: 'relative', zIndex: 2 }}>
        <div style={containerStyles}>
          <div style={gridStyles}>
            {filteredTemplates.map((template, index) => {
              const Icon = template.icon
              return (
                <SpotlightCard
                  key={index}
                  style={cardStyles}
                  onMouseEnter={(e) => {
                    Object.assign(e.currentTarget.style, cardHoverStyles)
                    setHoveredTemplate(index)
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.borderColor = design.colors.borderPrimary
                    setHoveredTemplate(null)
                  }}
                >
                  <h3 style={cardTitleStyles}>{template.name}</h3>
                  <p style={cardDescriptionStyles}>{template.description}</p>
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
                        color: template.color
                      }} />
                      <span style={{
                        fontSize: design.typography.sizes.sm,
                        color: design.colors.textSecondary
                      }}>{template.difficulty}</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: design.spacing.xs
                    }}>
                      <Star style={{
                        width: '16px',
                        height: '16px',
                        color: design.colors.warning,
                        fill: 'currentColor'
                      }} />
                      <span style={{
                        fontSize: design.typography.sizes.sm,
                        color: design.colors.textSecondary
                      }}>{template.rating}</span>
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: design.spacing.xs,
                    marginBottom: design.spacing.md
                  }}>
                    {template.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} style={{
                        padding: '4px 8px',
                        backgroundColor: `${template.color}20`,
                        color: template.color,
                        borderRadius: '4px',
                        fontSize: design.typography.sizes.xs,
                        fontWeight: design.typography.weights.medium
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a href="#" style={linkStyles}>
                    Use Template →
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
                  Can't Find What You Need?
                </h2>
              </GradientText>
              <p style={{
                fontSize: design.typography.sizes.lg,
                color: design.colors.textSecondary,
                maxWidth: '600px',
                margin: '0 auto',
                marginBottom: design.spacing.xl
              }}>
                Create your own custom workflow from scratch or request a template 
                tailored to your specific business needs.
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
                  <Plus style={{ marginRight: design.spacing.sm }} />
                  Create Custom Workflow
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
                  Request Template
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

export default TemplatesPage


