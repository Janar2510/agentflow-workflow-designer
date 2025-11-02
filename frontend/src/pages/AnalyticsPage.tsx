import React from 'react'
import { useCoronaDesign } from '../contexts/CoronaDesignContext'
import CoronaCard from '../components/ui/CoronaCard'
import CoronaButton from '../components/ui/CoronaButton'
import CoronaBadge from '../components/ui/CoronaBadge'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Zap, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Activity,
  Target,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

const AnalyticsPage: React.FC = () => {
  const design = useCoronaDesign()

  // Mock data for analytics
  const stats = [
    {
      title: 'Total Workflows',
      value: '1,247',
      change: '+12.5%',
      trend: 'up',
      icon: BarChart3,
      color: '#007AFF'
    },
    {
      title: 'Active Agents',
      value: '89',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: '#34C759'
    },
    {
      title: 'Executions Today',
      value: '3,456',
      change: '+23.1%',
      trend: 'up',
      icon: Zap,
      color: '#FF9500'
    },
    {
      title: 'Success Rate',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up',
      icon: CheckCircle,
      color: '#34C759'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'workflow',
      title: 'Customer Support Bot executed successfully',
      time: '2 minutes ago',
      status: 'success',
      icon: CheckCircle
    },
    {
      id: 2,
      type: 'agent',
      title: 'New agent "Data Analyzer" created',
      time: '15 minutes ago',
      status: 'info',
      icon: Users
    },
    {
      id: 3,
      type: 'workflow',
      title: 'Email Marketing workflow failed',
      time: '1 hour ago',
      status: 'error',
      icon: AlertCircle
    },
    {
      id: 4,
      type: 'system',
      title: 'System maintenance completed',
      time: '2 hours ago',
      status: 'info',
      icon: Activity
    }
  ]

  const topWorkflows = [
    { name: 'Customer Onboarding', executions: 1247, success: 98.2 },
    { name: 'Email Marketing', executions: 892, success: 94.5 },
    { name: 'Data Processing', executions: 756, success: 96.8 },
    { name: 'Lead Qualification', executions: 634, success: 92.1 },
    { name: 'Content Generation', executions: 523, success: 89.7 }
  ]

  const pageStyles: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: design.colors.bgPrimary,
    padding: design.spacing.lg
  }

  const headerStyles: React.CSSProperties = {
    marginBottom: design.spacing.xl,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }

  const titleStyles: React.CSSProperties = {
    ...design.typography,
    fontSize: design.typography.sizes['3xl'],
    fontWeight: design.typography.weights.bold,
    background: `linear-gradient(135deg, ${design.colors.primary}, ${design.colors.secondary})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    color: design.colors.textPrimary
  }

  const subtitleStyles: React.CSSProperties = {
    ...design.typography,
    fontSize: design.typography.sizes.lg,
    color: design.colors.textSecondary,
    marginTop: design.spacing.sm
  }

  const statsGridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: design.spacing.lg,
    marginBottom: design.spacing.xl
  }

  const statCardStyles = (color: string): React.CSSProperties => ({
    padding: design.spacing.lg,
    borderRadius: '0.75rem',
    background: `linear-gradient(135deg, ${color}20, ${color}10)`,
    border: `1px solid ${color}40`,
    position: 'relative',
    overflow: 'hidden'
  })

  const statIconStyles = (color: string): React.CSSProperties => ({
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: design.spacing.md,
    color: 'white'
  })

  const statValueStyles: React.CSSProperties = {
    ...design.typography,
    fontSize: design.typography.sizes['2xl'],
    fontWeight: design.typography.weights.bold,
    color: design.colors.textPrimary,
    marginBottom: design.spacing.xs
  }

  const statTitleStyles: React.CSSProperties = {
    ...design.typography,
    fontSize: design.typography.sizes.sm,
    color: design.colors.textSecondary,
    marginBottom: design.spacing.sm
  }

  const changeStyles = (trend: string): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: design.spacing.xs,
    fontSize: design.typography.sizes.sm,
    fontWeight: design.typography.weights.medium,
    color: trend === 'up' ? design.colors.success : design.colors.danger
  })

  const contentGridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: design.spacing.lg
  }

  const activityItemStyles = (status: string): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    padding: design.spacing.md,
    borderRadius: '0.5rem',
    backgroundColor: design.colors.bgSecondary,
    border: `1px solid ${design.colors.borderPrimary}`,
    marginBottom: design.spacing.sm,
    transition: 'all 0.2s ease-in-out'
  })

  const activityIconStyles = (status: string): React.CSSProperties => ({
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: status === 'success' ? design.colors.success : 
                   status === 'error' ? design.colors.danger : design.colors.info,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: design.spacing.md,
    color: 'white'
  })

  const workflowItemStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: design.spacing.md,
    borderRadius: '0.5rem',
    backgroundColor: design.colors.bgSecondary,
    border: `1px solid ${design.colors.borderPrimary}`,
    marginBottom: design.spacing.sm,
    transition: 'all 0.2s ease-in-out'
  }

  return (
    <div style={pageStyles}>
      {/* Header */}
      <div style={headerStyles}>
        <div>
          <h1 style={titleStyles}>
            Analytics Dashboard
          </h1>
          <p style={subtitleStyles}>
            Monitor your AI workflows and agent performance
          </p>
        </div>
        <div style={{ display: 'flex', gap: design.spacing.md }}>
          <CoronaButton variant="outline">
            <Clock style={{ width: '16px', height: '16px', marginRight: design.spacing.sm }} />
            Last 30 days
          </CoronaButton>
          <CoronaButton variant="primary">
            <Target style={{ width: '16px', height: '16px', marginRight: design.spacing.sm }} />
            Export Report
          </CoronaButton>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={statsGridStyles}>
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <CoronaCard key={index} style={statCardStyles(stat.color)}>
              <div style={statIconStyles(stat.color)}>
                <Icon size={24} />
              </div>
              <div style={statValueStyles}>{stat.value}</div>
              <div style={statTitleStyles}>{stat.title}</div>
              <div style={changeStyles(stat.trend)}>
                {stat.trend === 'up' ? (
                  <ArrowUpRight size={16} />
                ) : (
                  <ArrowDownRight size={16} />
                )}
                {stat.change}
              </div>
            </CoronaCard>
          )
        })}
      </div>

      {/* Content Grid */}
      <div style={contentGridStyles}>
        {/* Recent Activity */}
        <CoronaCard>
          <div style={{
            ...design.typography,
            fontSize: design.typography.sizes.xl,
            fontWeight: design.typography.weights.bold,
            color: design.colors.textPrimary,
            marginBottom: design.spacing.lg,
            display: 'flex',
            alignItems: 'center',
            gap: design.spacing.sm
          }}>
            <Activity size={24} />
            Recent Activity
          </div>
          <div>
            {recentActivities.map((activity) => {
              const Icon = activity.icon
              return (
                <div key={activity.id} style={activityItemStyles(activity.status)}>
                  <div style={activityIconStyles(activity.status)}>
                    <Icon size={16} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      ...design.typography,
                      fontSize: design.typography.sizes.sm,
                      fontWeight: design.typography.weights.medium,
                      color: design.colors.textPrimary,
                      marginBottom: design.spacing.xs
                    }}>
                      {activity.title}
                    </div>
                    <div style={{
                      ...design.typography,
                      fontSize: design.typography.sizes.xs,
                      color: design.colors.textMuted
                    }}>
                      {activity.time}
                    </div>
                  </div>
                  <CoronaBadge 
                    variant={activity.status === 'success' ? 'success' : 
                            activity.status === 'error' ? 'danger' : 'info'}
                  >
                    {activity.status}
                  </CoronaBadge>
                </div>
              )
            })}
          </div>
        </CoronaCard>

        {/* Top Workflows */}
        <CoronaCard>
          <div style={{
            ...design.typography,
            fontSize: design.typography.sizes.xl,
            fontWeight: design.typography.weights.bold,
            color: design.colors.textPrimary,
            marginBottom: design.spacing.lg,
            display: 'flex',
            alignItems: 'center',
            gap: design.spacing.sm
          }}>
            <TrendingUp size={24} />
            Top Workflows
          </div>
          <div>
            {topWorkflows.map((workflow, index) => (
              <div key={index} style={workflowItemStyles}>
                <div>
                  <div style={{
                    ...design.typography,
                    fontSize: design.typography.sizes.sm,
                    fontWeight: design.typography.weights.medium,
                    color: design.colors.textPrimary,
                    marginBottom: design.spacing.xs
                  }}>
                    {workflow.name}
                  </div>
                  <div style={{
                    ...design.typography,
                    fontSize: design.typography.sizes.xs,
                    color: design.colors.textMuted
                  }}>
                    {workflow.executions.toLocaleString()} executions
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    ...design.typography,
                    fontSize: design.typography.sizes.sm,
                    fontWeight: design.typography.weights.bold,
                    color: design.colors.success,
                    marginBottom: design.spacing.xs
                  }}>
                    {workflow.success}%
                  </div>
                  <div style={{
                    ...design.typography,
                    fontSize: design.typography.sizes.xs,
                    color: design.colors.textMuted
                  }}>
                    success rate
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CoronaCard>
      </div>
    </div>
  )
}

export default AnalyticsPage








