import React from 'react'
import { useNavigate } from 'react-router-dom'
import CoronaDropdown from '../ui/CoronaDropdown'
import { Package, Lightbulb, BookOpen, Users, Bot } from 'lucide-react'
import { useCoronaDesign } from '../../contexts/CoronaDesignContext'

export const CoronaHeader: React.FC = () => {
  const design = useCoronaDesign()
  const navigate = useNavigate()

  const productItems = [
    {
      name: 'Product overview',
      href: '/product-overview',
      icon: Package,
      description: 'Complete overview of AgentFlow capabilities'
    },
    {
      name: 'Integrations',
      href: '/integrations',
      icon: Package,
      description: 'Connect with your favorite tools and platforms'
    },
    {
      name: 'Templates',
      href: '/templates',
      icon: Package,
      description: 'Pre-built workflow templates'
    },
    {
      name: 'AI',
      href: '/ai',
      icon: Package,
      description: 'Advanced AI capabilities and features'
    }
  ]

  const useCasesItems = [
    {
      name: 'Customer Support',
      href: '/use-cases/customer-support',
      icon: Lightbulb,
      description: 'Automate customer service workflows'
    },
    {
      name: 'Content Creation',
      href: '/use-cases/content-creation',
      icon: Lightbulb,
      description: 'Generate content with AI agents'
    },
    {
      name: 'Data Processing',
      href: '/use-cases/data-processing',
      icon: Lightbulb,
      description: 'Process and analyze data automatically'
    },
    {
      name: 'Lead Generation',
      href: '/use-cases/lead-generation',
      icon: Lightbulb,
      description: 'Identify and qualify potential customers'
    }
  ]

  const docsItems = [
    {
      name: 'Getting Started',
      href: '/docs/getting-started',
      icon: BookOpen,
      description: 'Quick start guide'
    },
    {
      name: 'API Reference',
      href: '/docs/api',
      icon: BookOpen,
      description: 'Complete API documentation'
    },
    {
      name: 'Tutorials',
      href: '/docs/tutorials',
      icon: BookOpen,
      description: 'Step-by-step tutorials'
    },
    {
      name: 'Examples',
      href: '/docs/examples',
      icon: BookOpen,
      description: 'Real-world examples'
    }
  ]

  const communityItems = [
    {
      name: 'Community Hub',
      href: '/community',
      icon: Users,
      description: 'Join discussions and get help'
    },
    {
      name: 'Community Test',
      href: '/community-test',
      icon: Users,
      description: 'Test community features'
    },
    {
      name: 'Discord',
      href: 'https://discord.gg/agentflow',
      icon: Users,
      description: 'Join our Discord server'
    },
    {
      name: 'GitHub',
      href: 'https://github.com/agentflow',
      icon: Users,
      description: 'Contribute to the project'
    }
  ]

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `0 ${design.spacing.lg}`,
    height: '64px',
    backgroundColor: design.colors.bgSecondary,
    borderBottom: `1px solid ${design.colors.borderPrimary}`,
    position: 'sticky',
    top: 0,
    zIndex: 40
  }

  const leftSectionStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: design.spacing.lg
  }

  const rightSectionStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: design.spacing.md
  }



  const dropdownGroupStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: design.spacing.sm
  }

  return (
    <header style={headerStyles}>
      <div style={leftSectionStyles}>
        <div style={dropdownGroupStyles}>
          <CoronaDropdown
            label="Product"
            items={productItems}
            variant="primary"
            icon={Package}
          />
          <CoronaDropdown
            label="Use Cases"
            items={useCasesItems}
            variant="secondary"
            icon={Lightbulb}
          />
          <CoronaDropdown
            label="Docs"
            items={docsItems}
            variant="success"
            icon={BookOpen}
          />
          <CoronaDropdown
            label="Community"
            items={communityItems}
            variant="warning"
            icon={Users}
          />
        </div>
      </div>

      <div style={rightSectionStyles}>
        {/* Get Started Button */}
        <button
          onClick={() => navigate('/register')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: `${design.spacing.sm} ${design.spacing.md}`,
            borderRadius: '0.5rem',
            fontSize: design.typography.sizes.sm,
            fontWeight: design.typography.weights.medium,
            background: `linear-gradient(135deg, ${design.colors.primary}, ${design.colors.secondary})`,
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            gap: design.spacing.sm
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Bot style={{ height: '16px', width: '16px' }} />
          Get Started
        </button>
      </div>
    </header>
  )
}

export default CoronaHeader
