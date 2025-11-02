import React from 'react'
import { CoronaCard, CoronaButton, CoronaBadge } from '../components/ui'
import { useCoronaDesign } from '../hooks/useCoronaDesign'
import { Bot, Workflow, Zap, Users, Star, Download, Eye } from 'lucide-react'

export const DesignSystemTestPage: React.FC = () => {
  const design = useCoronaDesign()
  
  const pageStyles: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: design.colors.bgPrimary,
    padding: design.spacing.xl,
    fontFamily: design.typography.fontFamily,
  }

  return (
    <div style={pageStyles}>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="af-text-4xl af-font-bold af-text-primary mb-4">
            AgentFlow Design System Test
          </h1>
          <p className="af-text-xl af-text-secondary">
            Testing all AgentFlow components and effects
          </p>
        </div>

        {/* Card Variants */}
        <div>
          <h2 className="af-text-2xl af-font-semibold af-text-primary mb-6">Card Variants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="af-card--gradient-border">
              <h3 className="af-text-xl af-font-semibold af-text-primary mb-2">Gradient Border Card</h3>
              <p className="af-text-secondary mb-4">
                This card has the signature animated gradient border effect.
              </p>
              <CoronaBadge variant="primary">Active</CoronaBadge>
            </div>

            <div className="af-card--glass">
              <h3 className="af-text-xl af-font-semibold af-text-primary mb-2">Glass Card</h3>
              <p className="af-text-secondary mb-4">
                This card uses glassmorphism with backdrop-filter blur.
              </p>
              <CoronaBadge variant="success">Online</CoronaBadge>
            </div>

            <div className="af-card--glass-light">
              <h3 className="af-text-xl af-font-semibold af-text-primary mb-2">Glass Light Card</h3>
              <p className="af-text-secondary mb-4">
                This card uses light glassmorphism effect.
              </p>
              <CoronaBadge variant="warning">Pending</CoronaBadge>
            </div>

            <div className="af-card--glass-strong">
              <h3 className="af-text-xl af-font-semibold af-text-primary mb-2">Glass Strong Card</h3>
              <p className="af-text-secondary mb-4">
                This card uses strong glassmorphism effect.
              </p>
              <CoronaBadge variant="danger">Error</CoronaBadge>
            </div>
          </div>
        </div>

        {/* Button Variants */}
        <div>
          <h2 className="af-text-2xl af-font-semibold af-text-primary mb-6">Button Variants</h2>
          <div className="flex flex-wrap gap-4">
            <CoronaButton variant="primary">Primary Button</CoronaButton>
            <CoronaButton variant="success">Success Button</CoronaButton>
            <CoronaButton variant="danger">Danger Button</CoronaButton>
            <CoronaButton variant="ghost">Ghost Button</CoronaButton>
          </div>
        </div>

        {/* Badge Variants */}
        <div>
          <h2 className="af-text-2xl af-font-semibold af-text-primary mb-6">Badge Variants</h2>
          <div className="flex flex-wrap gap-4">
            <CoronaBadge variant="primary">Primary Badge</CoronaBadge>
            <CoronaBadge variant="success">Success Badge</CoronaBadge>
            <CoronaBadge variant="warning">Warning Badge</CoronaBadge>
            <CoronaBadge variant="danger">Danger Badge</CoronaBadge>
          </div>
        </div>

        {/* Horizontal Layout */}
        <div>
          <h2 className="af-text-2xl af-font-semibold af-text-primary mb-6">Horizontal Layout</h2>
          <div className="flex flex-wrap gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="af-card--glass-light">
                <h4 className="af-text-lg af-font-medium af-text-primary mb-2">
                  Card {i}
                </h4>
                <p className="af-text-secondary">
                  This is a horizontally scrollable card layout.
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Icons with Colors */}
        <div>
          <h2 className="af-text-2xl af-font-semibold af-text-primary mb-6">Icons with Colors</h2>
          <div className="flex flex-wrap gap-6">
            <div className="text-center">
              <Bot className="h-12 w-12 mb-2" style={{ color: 'var(--af-accent-primary)' }} />
              <p className="af-text-sm af-text-secondary">Primary</p>
            </div>
            <div className="text-center">
              <Workflow className="h-12 w-12 mb-2" style={{ color: 'var(--af-accent-success)' }} />
              <p className="af-text-sm af-text-secondary">Success</p>
            </div>
            <div className="text-center">
              <Zap className="h-12 w-12 mb-2" style={{ color: 'var(--af-accent-warning)' }} />
              <p className="af-text-sm af-text-secondary">Warning</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 mb-2" style={{ color: 'var(--af-accent-purple)' }} />
              <p className="af-text-sm af-text-secondary">Purple</p>
            </div>
          </div>
        </div>

        {/* Typography */}
        <div>
          <h2 className="af-text-2xl af-font-semibold af-text-primary mb-6">Typography</h2>
          <div className="space-y-4">
            <h1 className="af-text-4xl af-font-bold af-text-primary">Heading 1</h1>
            <h2 className="af-text-3xl af-font-semibold af-text-primary">Heading 2</h2>
            <h3 className="af-text-2xl af-font-medium af-text-primary">Heading 3</h3>
            <h4 className="af-text-xl af-font-medium af-text-primary">Heading 4</h4>
            <p className="af-text-lg af-text-secondary">Large paragraph text</p>
            <p className="af-text-base af-text-secondary">Regular paragraph text</p>
            <p className="af-text-sm af-text-muted">Small muted text</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DesignSystemTestPage



