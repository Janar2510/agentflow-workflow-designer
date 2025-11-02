import React from 'react'
import { CoronaCard, CoronaButton, CoronaBadge } from '../components/ui'
import { useCoronaDesign } from '../hooks/useCoronaDesign'
import { MessageCircle, Users, Zap, TrendingUp } from 'lucide-react'

export const TestCommunityPage: React.FC = () => {
  const design = useCoronaDesign()
  console.log('TestCommunityPage is rendering!')
  
  const pageStyles: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: design.colors.bgPrimary,
    padding: design.spacing.xl,
    fontFamily: design.typography.fontFamily,
  }

  return (
    <div style={pageStyles}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: design.spacing.xl }}>
          <h1 style={{
            ...design.text('heading'),
            fontSize: design.typography.sizes['5xl'],
            fontWeight: design.typography.weights.bold,
            background: `linear-gradient(135deg, ${design.colors.primary}, ${design.colors.secondary})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: design.spacing.md,
            color: design.colors.textPrimary
          }}>
            🎉 Community Test Page 🎉
          </h1>
          <p style={{
            ...design.text('body'),
            fontSize: design.typography.sizes.xl,
            color: design.colors.textSecondary,
            marginBottom: design.spacing.lg
          }}>
            If you can see this, the routing is working!
          </p>
          <CoronaBadge variant="success" size="lg">
            ✅ Success! Community components are accessible
          </CoronaBadge>
        </div>

        {/* Test Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
          gap: design.spacing.lg,
          marginBottom: design.spacing.lg,
          '@media (min-width: 768px)': { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
          '@media (min-width: 1024px)': { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }
        }}>
          <CoronaCard style={{ textAlign: 'center' }}>
            <MessageCircle className="h-12 w-12 mx-auto mb-4" style={{ color: design.colors.primary }} />
            <h3 style={{
              ...design.text('heading'),
              fontSize: design.typography.sizes.xl,
              fontWeight: design.typography.weights.semibold,
              marginBottom: design.spacing.sm,
              color: design.colors.textPrimary
            }}>
              Community Forum
            </h3>
            <p style={{
              ...design.text('body'),
              color: design.colors.textSecondary,
              marginBottom: design.spacing.md
            }}>
              Connect with other users and share knowledge
            </p>
            <CoronaButton variant="primary" size="sm">
              View Forum
            </CoronaButton>
          </CoronaCard>

          <CoronaCard style={{ textAlign: 'center' }}>
            <Users className="h-12 w-12 mx-auto mb-4" style={{ color: design.colors.success }} />
            <h3 style={{
              ...design.text('heading'),
              fontSize: design.typography.sizes.xl,
              fontWeight: design.typography.weights.semibold,
              marginBottom: design.spacing.sm,
              color: design.colors.textPrimary
            }}>
              Leaderboard
            </h3>
            <p style={{
              ...design.text('body'),
              color: design.colors.textSecondary,
              marginBottom: design.spacing.md
            }}>
              See top contributors and active members
            </p>
            <CoronaButton variant="success" size="sm">
              View Rankings
            </CoronaButton>
          </CoronaCard>

          <CoronaCard style={{ textAlign: 'center' }}>
            <Zap className="h-12 w-12 mx-auto mb-4" style={{ color: design.colors.secondary }} />
            <h3 style={{
              ...design.text('heading'),
              fontSize: design.typography.sizes.xl,
              fontWeight: design.typography.weights.semibold,
              marginBottom: design.spacing.sm,
              color: design.colors.textPrimary
            }}>
              Events
            </h3>
            <p style={{
              ...design.text('body'),
              color: design.colors.textSecondary,
              marginBottom: design.spacing.md
            }}>
              Join community events and workshops
            </p>
            <CoronaButton variant="outline-primary" size="sm">
              View Events
            </CoronaButton>
          </CoronaCard>
        </div>

        {/* Stats */}
        <CoronaCard style={{
          background: `linear-gradient(135deg, ${design.colors.primary}20, ${design.colors.secondary}20)`,
          border: `1px solid ${design.colors.primary}40`
        }}>
          <div style={{ textAlign: 'center' }}>
            <TrendingUp className="h-16 w-16 mx-auto mb-4" style={{ color: design.colors.primary }} />
            <h2 style={{
              ...design.text('heading'),
              fontSize: design.typography.sizes['3xl'],
              fontWeight: design.typography.weights.bold,
              marginBottom: design.spacing.sm,
              color: design.colors.textPrimary
            }}>
              Community Stats
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: design.spacing.md,
              marginTop: design.spacing.lg,
              '@media (min-width: 768px)': { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  ...design.text('heading'),
                  fontSize: design.typography.sizes['2xl'],
                  fontWeight: design.typography.weights.bold,
                  color: design.colors.primary
                }}>
                  1,234
                </div>
                <div style={{
                  ...design.text('body'),
                  color: design.colors.textSecondary
                }}>
                  Total Posts
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  ...design.text('heading'),
                  fontSize: design.typography.sizes['2xl'],
                  fontWeight: design.typography.weights.bold,
                  color: design.colors.success
                }}>
                  567
                </div>
                <div style={{
                  ...design.text('body'),
                  color: design.colors.textSecondary
                }}>
                  Active Users
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  ...design.text('heading'),
                  fontSize: design.typography.sizes['2xl'],
                  fontWeight: design.typography.weights.bold,
                  color: design.colors.secondary
                }}>
                  89
                </div>
                <div style={{
                  ...design.text('body'),
                  color: design.colors.textSecondary
                }}>
                  Agents Created
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  ...design.text('heading'),
                  fontSize: design.typography.sizes['2xl'],
                  fontWeight: design.typography.weights.bold,
                  color: design.colors.warning
                }}>
                  234
                </div>
                <div style={{
                  ...design.text('body'),
                  color: design.colors.textSecondary
                }}>
                  Workflows Shared
                </div>
              </div>
            </div>
          </div>
        </CoronaCard>
      </div>
    </div>
  )
}

