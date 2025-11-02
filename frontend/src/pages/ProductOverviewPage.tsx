import React, { useState, useRef } from 'react'
import { useCoronaDesign } from '../contexts/CoronaDesignContext'
import { CoronaButton } from '../components/ui/CoronaButton'
import Aurora from '../components/ui/Aurora'
import GradientText from '../components/ui/GradientText'
import './ProductOverviewPage.css'

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

const ProductOverviewPage: React.FC = () => {
  const design = useCoronaDesign()

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
    zIndex: 2
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
    fontWeight: design.typography.weights.bold
  }

  const sectionTitleStyles: React.CSSProperties = {
    fontSize: 'clamp(2.2rem, 5vw, 4rem)',
    lineHeight: 1.05,
    margin: 0,
    fontWeight: design.typography.weights.bold
  }

  const subtitleStyles: React.CSSProperties = {
    margin: '16px auto 24px',
    color: design.colors.textSecondary,
    maxWidth: '860px',
    fontSize: design.typography.sizes.xl,
    lineHeight: 1.6
  }

  const badgesStyles: React.CSSProperties = {
    display: 'flex',
    gap: design.spacing.sm,
    justifyContent: 'center',
    flexWrap: 'wrap',
    margin: '24px 0'
  }

  const badgeStyles: React.CSSProperties = {
    border: `1px solid ${design.colors.primary}40`,
    padding: '6px 10px',
    borderRadius: '999px',
    fontSize: design.typography.sizes.xs,
    background: `${design.colors.primary}10`,
    color: design.colors.textPrimary
  }

  const ctaGroupStyles: React.CSSProperties = {
    display: 'flex',
    gap: design.spacing.md,
    justifyContent: 'center',
    marginTop: design.spacing.md
  }

  const sectionStyles: React.CSSProperties = {
    padding: '72px 0',
    position: 'relative',
    zIndex: 2
  }

  const sectionHeadStyles: React.CSSProperties = {
    marginBottom: '24px',
    textAlign: 'center'
  }

  const kickerStyles: React.CSSProperties = {
    color: design.colors.textSecondary,
    fontWeight: design.typography.weights.semibold,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: design.spacing.sm,
    fontSize: design.typography.sizes.xl
  }


  const introStyles: React.CSSProperties = {
    color: design.colors.textSecondary,
    maxWidth: '760px',
    margin: '0 auto',
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

  const stripStyles: React.CSSProperties = {
    padding: '48px 0',
    background: `radial-gradient(900px 600px at 80% -30%, ${design.colors.primary}20, transparent), linear-gradient(180deg, ${design.colors.secondary}10, transparent 60%)`
  }

  const tripletsStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: design.spacing.md
  }

  const ctaBannerStyles: React.CSSProperties = {
    marginTop: '24px',
    padding: design.spacing.lg,
    borderRadius: design.spacing.lg,
    background: `linear-gradient(180deg, ${design.colors.primary}10, ${design.colors.primary}05)`,
    border: `1px solid ${design.colors.primary}40`,
    textAlign: 'center'
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
          <p style={eyebrowStyles}>Think it. Build it. Extend it.</p>
          <GradientText 
            colors={['#5227FF', '#40ffaa', '#4079ff', '#40ffaa', '#5227FF']}
            animationSpeed={30}
            className="slow"
          >
            <h1 style={titleStyles}>Automate without limits</h1>
          </GradientText>
          <p style={subtitleStyles}>
            Simple enough to ship in hours, sophisticated enough to scale. Build automations
            and AI agent workflows with full control.
          </p>
          <div style={badgesStyles}>
            <span style={badgeStyles}>Visual building</span>
            <span style={badgeStyles}>Powerful debugging</span>
            <span style={badgeStyles}>Secure deployments</span>
          </div>
          <div style={ctaGroupStyles}>
            <CoronaButton
              variant="primary"
              size="lg"
              style={{
                background: `linear-gradient(180deg, ${design.colors.primary}, ${design.colors.secondary})`,
                color: design.colors.bgPrimary,
                padding: `${design.spacing.md} ${design.spacing.lg}`,
                fontWeight: design.typography.weights.semibold
              }}
            >
              Get Started
            </CoronaButton>
            <CoronaButton
              variant="secondary"
              size="lg"
              style={{
                background: 'transparent',
                borderColor: `${design.colors.primary}40`,
                color: design.colors.textPrimary,
                padding: `${design.spacing.md} ${design.spacing.lg}`,
                fontWeight: design.typography.weights.semibold
              }}
            >
              Product overview
            </CoronaButton>
          </div>
        </div>
      </section>

      {/* =============== VISUAL BUILDING =============== */}
      <section style={sectionStyles}>
        <div style={containerStyles}>
          <header style={sectionHeadStyles}>
            <p style={kickerStyles}>Build faster with a leading visual editor</p>
            <GradientText 
              colors={['#5227FF', '#40ffaa', '#4079ff', '#40ffaa', '#5227FF']}
              animationSpeed={30}
              className="slow"
            >
              <h2 style={sectionTitleStyles}>Visual building</h2>
            </GradientText>
            <p style={introStyles}>Iterate instantly, combine native nodes with custom code, and see outputs as you go.</p>
          </header>

          <div style={gridStyles}>
            <SpotlightCard
              style={cardStyles}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, cardHoverStyles)
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.borderColor = design.colors.borderPrimary
              }}
            >
              <h3 style={cardTitleStyles}>No boilerplate</h3>
              <p style={cardDescriptionStyles}>400+ pre-configured integrations help you skip repetitive setup. Connect anything else with the HTTP Request node or import cURL.</p>
              <a href="#" style={linkStyles}>View integrations →</a>
            </SpotlightCard>

            <SpotlightCard
              style={cardStyles}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, cardHoverStyles)
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.borderColor = design.colors.borderPrimary
              }}
            >
              <h3 style={cardTitleStyles}>Fast iteration</h3>
              <p style={cardDescriptionStyles}>Execute a single step, replay data, and see results beside your node settings for tight feedback loops.</p>
              <a href="#" style={linkStyles}>Learn more →</a>
            </SpotlightCard>

            <SpotlightCard
              style={cardStyles}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, cardHoverStyles)
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.borderColor = design.colors.borderPrimary
              }}
            >
              <h3 style={cardTitleStyles}>Fall back to code</h3>
              <p style={cardDescriptionStyles}>Write custom JavaScript or Python in the Code node. Use expressions and templating for dynamic parameters.</p>
              <a href="#" style={linkStyles}>See expressions →</a>
            </SpotlightCard>

            <SpotlightCard
              style={cardStyles}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, cardHoverStyles)
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.borderColor = design.colors.borderPrimary
              }}
            >
              <h3 style={cardTitleStyles}>Merge, loop, filter</h3>
              <p style={cardDescriptionStyles}>Branch with switches and IFs, loop data, deduplicate, split lists, aggregate, and reshape with transformers.</p>
              <a href="#" style={linkStyles}>Explore transformers →</a>
            </SpotlightCard>

            <SpotlightCard
              style={cardStyles}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, cardHoverStyles)
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.borderColor = design.colors.borderPrimary
              }}
            >
              <h3 style={cardTitleStyles}>Diverse triggers</h3>
              <p style={cardDescriptionStyles}>Start from app events, cron, webhooks, chats, or other workflows to nest and compose systems.</p>
              <a href="#" style={linkStyles}>See triggers →</a>
            </SpotlightCard>

            <SpotlightCard
              style={cardStyles}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, cardHoverStyles)
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.borderColor = design.colors.borderPrimary
              }}
            >
              <h3 style={cardTitleStyles}>AI nodes</h3>
              <p style={cardDescriptionStyles}>Prototype chat and summarization quickly. Use your preferred model and keep data flow under your control.</p>
              <a href="#" style={linkStyles}>Dive into AI →</a>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* ================= AI VALUE STRIP ================= */}
      <section style={stripStyles}>
        <div style={{...containerStyles, ...stripStyles}}>
          <div style={{ textAlign: 'center', marginBottom: design.spacing.lg }}>
            <GradientText 
              colors={['#5227FF', '#40ffaa', '#4079ff', '#40ffaa', '#5227FF']}
              animationSpeed={30}
              className="slow"
            >
              <h2 style={sectionTitleStyles}>AI that actually creates value</h2>
            </GradientText>
          </div>
          <div style={tripletsStyles}>
            <SpotlightCard
              style={{...cardStyles, gridColumn: 'unset', padding: design.spacing.md}}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, cardHoverStyles)
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.borderColor = design.colors.borderPrimary
              }}
            >
              <h3 style={cardTitleStyles}>Conversational workflows</h3>
              <p style={cardDescriptionStyles}>Use built-in AI nodes to chat with your data and orchestrate multi-step agents.</p>
            </SpotlightCard>
            <SpotlightCard
              style={{...cardStyles, gridColumn: 'unset', padding: design.spacing.md}}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, cardHoverStyles)
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.borderColor = design.colors.borderPrimary
              }}
            >
              <h3 style={cardTitleStyles}>Ready-to-deploy scaffolding</h3>
              <p style={cardDescriptionStyles}>Stage and production flows with model flexibility — even run locally.</p>
            </SpotlightCard>
            <SpotlightCard
              style={{...cardStyles, gridColumn: 'unset', padding: design.spacing.md}}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, cardHoverStyles)
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.borderColor = design.colors.borderPrimary
              }}
            >
              <h3 style={cardTitleStyles}>Modular apps</h3>
              <p style={cardDescriptionStyles}>Build on your preferred AI stack and embed intelligence into existing processes.</p>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* ================ SECURE DEPLOYMENTS ================ */}
      <section style={sectionStyles}>
        <div style={containerStyles}>
          <header style={sectionHeadStyles}>
            <p style={kickerStyles}>Deploy & self-host</p>
            <GradientText 
              colors={['#5227FF', '#40ffaa', '#4079ff', '#40ffaa', '#5227FF']}
              animationSpeed={30}
              className="slow"
            >
              <h2 style={sectionTitleStyles}>Secure deployments</h2>
            </GradientText>
            <p style={introStyles}>Reliable, scalable, and enterprise-ready. Choose cloud or self-host, control environments, and keep secrets safe.</p>
          </header>

          <div style={gridStyles}>
            <SpotlightCard
              style={cardStyles}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, cardHoverStyles)
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.borderColor = design.colors.borderPrimary
              }}
            >
              <h3 style={cardTitleStyles}>Use environments</h3>
              <p style={cardDescriptionStyles}>Git-based source control with push–pull between staging and production.</p>
              <a href="#" style={linkStyles}>More on environments →</a>
            </SpotlightCard>

            <SpotlightCard
              style={cardStyles}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, cardHoverStyles)
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.borderColor = design.colors.borderPrimary
              }}
            >
              <h3 style={cardTitleStyles}>Host on-premise or cloud</h3>
              <p style={cardDescriptionStyles}>Deploy via Docker or Kubernetes, air-gapped if required, or choose AgentFlow Cloud.</p>
              <a href="#" style={linkStyles}>Set it up →</a>
            </SpotlightCard>

            <SpotlightCard
              style={cardStyles}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, cardHoverStyles)
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.borderColor = design.colors.borderPrimary
              }}
            >
              <h3 style={cardTitleStyles}>Scale up</h3>
              <p style={cardDescriptionStyles}>Queue mode for multi-instance execution with workers; high throughput per instance.</p>
              <a href="#" style={linkStyles}>Get the details →</a>
            </SpotlightCard>

            <SpotlightCard
              style={cardStyles}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, cardHoverStyles)
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.borderColor = design.colors.borderPrimary
              }}
            >
              <h3 style={cardTitleStyles}>Trust: SOC 2</h3>
              <p style={cardDescriptionStyles}>Third-party audited. Regular external penetration testing.</p>
              <a href="#" style={linkStyles}>Read more →</a>
            </SpotlightCard>

            <SpotlightCard
              style={cardStyles}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, cardHoverStyles)
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.borderColor = design.colors.borderPrimary
              }}
            >
              <h3 style={cardTitleStyles}>Fetch secrets securely</h3>
              <p style={cardDescriptionStyles}>Pull from AWS Secrets Manager, Azure Key Vault, Google Cloud, HashiCorp Vault, or Infisical — without storing in AgentFlow.</p>
              <a href="#" style={linkStyles}>Read more →</a>
            </SpotlightCard>

            <SpotlightCard
              style={cardStyles}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, cardHoverStyles)
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.borderColor = design.colors.borderPrimary
              }}
            >
              <h3 style={cardTitleStyles}>Limit access</h3>
              <p style={cardDescriptionStyles}>Use projects and roles to scope workflow and credential access by team.</p>
              <a href="#" style={linkStyles}>Learn more →</a>
            </SpotlightCard>
          </div>

          <div style={ctaBannerStyles}>
            <GradientText 
              colors={['#5227FF', '#40ffaa', '#4079ff', '#40ffaa', '#5227FF']}
              animationSpeed={30}
              className="slow"
            >
              <h3 style={{...sectionTitleStyles, marginBottom: design.spacing.sm}}>Deploy with confidence</h3>
            </GradientText>
            <p style={{...cardDescriptionStyles, marginBottom: design.spacing.lg}}>Promote via Git, secure secrets, and scale across environments.</p>
            <CoronaButton
              variant="primary"
              size="lg"
              style={{
                background: `linear-gradient(180deg, ${design.colors.primary}, ${design.colors.secondary})`,
                color: design.colors.bgPrimary,
                padding: `${design.spacing.md} ${design.spacing.lg}`,
                fontWeight: design.typography.weights.semibold
              }}
            >
              Start building
            </CoronaButton>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProductOverviewPage