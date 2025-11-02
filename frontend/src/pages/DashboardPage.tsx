import React from 'react'
import { Link } from 'react-router-dom'
import { Plus, TrendingUp, Clock, CheckCircle, AlertCircle, Users, Workflow, Zap, Bot, Settings, BarChart3, FileText, Play, Download, Star } from 'lucide-react'
import { CoronaCard, CoronaButton, CoronaBadge } from '../components/ui'
import { useCoronaDesign } from '../hooks/useCoronaDesign'

const DashboardPage: React.FC = () => {
  const design = useCoronaDesign()
  
  const stats = [
    {
      label: 'Total Workflows',
      value: '12',
      change: '+2 this week',
      icon: Workflow,
      color: design.colors.primary
    },
    {
      label: 'Successful Executions',
      value: '89%',
      change: '+5% from last month',
      icon: CheckCircle,
      color: design.colors.success
    },
    {
      label: 'Active Agents',
      value: '7',
      change: '+1 this week',
      icon: Users,
      color: design.colors.info
    },
    {
      label: 'Processing Time',
      value: '2.3s',
      change: '-0.5s faster',
      icon: TrendingUp,
      color: design.colors.warning
    }
  ]

  const recentWorkflows = [
    {
      id: '1',
      name: 'Customer Support Bot',
      status: 'active',
      executions: 142,
      successRate: 89,
      lastRun: '2 hours ago'
    },
    {
      id: '2',
      name: 'Data Processing Pipeline',
      status: 'running',
      executions: 89,
      successRate: 92,
      lastRun: '5 minutes ago'
    },
    {
      id: '3',
      name: 'Email Automation',
      status: 'paused',
      executions: 67,
      successRate: 78,
      lastRun: '1 day ago'
    }
  ]

  const recentExecutions = [
    {
      id: '1',
      workflow: 'Customer Support Bot',
      status: 'success',
      duration: '1.2s',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      workflow: 'Data Processing Pipeline',
      status: 'success',
      duration: '3.4s',
      timestamp: '5 minutes ago'
    },
    {
      id: '3',
      workflow: 'Email Automation',
      status: 'failed',
      duration: '0.8s',
      timestamp: '1 day ago'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'running':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'paused':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const pageStyles: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: design.colors.bgPrimary,
    padding: design.spacing.lg,
    fontFamily: design.typography.fontFamily,
  }

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: design.spacing.xl,
  }

  const titleStyles: React.CSSProperties = {
    ...design.text('heading'),
    fontSize: design.typography.sizes['3xl'],
    marginBottom: design.spacing.sm,
  }

  const subtitleStyles: React.CSSProperties = {
    ...design.text('body'),
    fontSize: design.typography.sizes.lg,
    color: design.colors.textSecondary,
  }

  return (
    <div style={pageStyles}>
      {/* Header */}
      <div style={headerStyles}>
        <div>
          <h1 style={titleStyles}>Dashboard</h1>
          <p style={subtitleStyles}>
            Welcome back! Here's what's happening with your workflows.
          </p>
        </div>
        <Link to="/workflow/new">
          <CoronaButton variant="primary" size="lg">
            <Plus style={{ width: '20px', height: '20px', marginRight: design.spacing.sm }} />
            New Workflow
          </CoronaButton>
        </Link>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: design.spacing.lg,
        marginBottom: design.spacing.xl,
      }}>
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <CoronaCard key={index} variant="elevated">
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  margin: `0 auto ${design.spacing.md} auto`,
                  borderRadius: '50%',
                  backgroundColor: `${stat.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon 
                    style={{ 
                      width: '30px', 
                      height: '30px', 
                      color: stat.color 
                    }}
                  />
                </div>
                <p style={{
                  ...design.text('caption'),
                  marginBottom: design.spacing.sm,
                }}>
                  {stat.label}
                </p>
                <p style={{
                  ...design.text('heading'),
                  fontSize: design.typography.sizes['2xl'],
                  marginBottom: design.spacing.sm,
                }}>
                  {stat.value}
                </p>
                <CoronaBadge variant="success" size="sm">
                  {stat.change}
                </CoronaBadge>
              </div>
            </CoronaCard>
          )
        })}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: design.spacing.lg,
        marginBottom: design.spacing.xl,
      }}>
        {/* Recent Workflows */}
        <CoronaCard variant="elevated">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: design.spacing.md,
          }}>
            <h3 style={{
              ...design.text('heading'),
              fontSize: design.typography.sizes.xl,
            }}>Recent Workflows</h3>
            <Link to="/dashboard" style={{
              ...design.text('caption'),
              color: design.colors.primary,
              textDecoration: 'none',
            }}>
              View all
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: design.spacing.sm }}>
            {recentWorkflows.map((workflow) => (
              <div
                key={workflow.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: design.spacing.sm,
                  borderRadius: '0.375rem',
                  backgroundColor: design.colors.bgSecondary,
                  border: `1px solid ${design.colors.borderPrimary}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: design.spacing.sm }}>
                  {getStatusIcon(workflow.status)}
                  <div>
                    <h4 style={{
                      ...design.text('label'),
                      fontSize: design.typography.sizes.sm,
                    }}>
                      {workflow.name}
                    </h4>
                    <p style={{
                      ...design.text('caption'),
                      fontSize: design.typography.sizes.xs,
                    }}>
                      {workflow.executions} executions • {workflow.successRate}% success
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{
                    ...design.text('caption'),
                    fontSize: design.typography.sizes.xs,
                  }}>{workflow.lastRun}</p>
                </div>
              </div>
            ))}
          </div>
        </CoronaCard>

        {/* Recent Executions */}
        <CoronaCard variant="elevated">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: design.spacing.md,
          }}>
            <h3 style={{
              ...design.text('heading'),
              fontSize: design.typography.sizes.xl,
            }}>Recent Executions</h3>
            <Link to="/executions" style={{
              ...design.text('caption'),
              color: design.colors.primary,
              textDecoration: 'none',
            }}>
              View all
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: design.spacing.sm }}>
            {recentExecutions.map((execution) => (
              <div
                key={execution.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: design.spacing.sm,
                  borderRadius: '0.375rem',
                  backgroundColor: design.colors.bgSecondary,
                  border: `1px solid ${design.colors.borderPrimary}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: design.spacing.sm }}>
                  {getStatusIcon(execution.status)}
                  <div>
                    <h4 style={{
                      ...design.text('label'),
                      fontSize: design.typography.sizes.sm,
                    }}>
                      {execution.workflow}
                    </h4>
                    <p style={{
                      ...design.text('caption'),
                      fontSize: design.typography.sizes.xs,
                    }}>
                      Duration: {execution.duration}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{
                    ...design.text('caption'),
                    fontSize: design.typography.sizes.xs,
                  }}>{execution.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </CoronaCard>
      </div>

      {/* Quick Actions */}
      <CoronaCard variant="elevated">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: design.spacing.lg,
        }}>
          <h3 style={{
            ...design.text('heading'),
            fontSize: design.typography.sizes.xl,
          }}>Quick Actions</h3>
          <CoronaBadge variant="primary" size="md">6 Actions</CoronaBadge>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: design.spacing.md,
        }}>
          <Link to="/workflow/new" style={{ textDecoration: 'none' }}>
            <CoronaCard variant="outlined" style={{
              height: '120px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: `${design.colors.primary}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: design.spacing.sm,
              }}>
                <Plus style={{ width: '24px', height: '24px', color: design.colors.primary }} />
              </div>
              <h3 style={{
                ...design.text('label'),
                fontSize: design.typography.sizes.sm,
                marginBottom: design.spacing.xs,
              }}>Create Workflow</h3>
              <p style={{
                ...design.text('caption'),
                fontSize: design.typography.sizes.xs,
              }}>Start from scratch</p>
            </CoronaCard>
          </Link>
          
          <Link to="/templates" style={{ textDecoration: 'none' }}>
            <CoronaCard variant="outlined" style={{
              height: '120px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: `${design.colors.success}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: design.spacing.sm,
              }}>
                <Zap style={{ width: '24px', height: '24px', color: design.colors.success }} />
              </div>
              <h3 style={{
                ...design.text('label'),
                fontSize: design.typography.sizes.sm,
                marginBottom: design.spacing.xs,
              }}>Use Template</h3>
              <p style={{
                ...design.text('caption'),
                fontSize: design.typography.sizes.xs,
              }}>Browse templates</p>
            </CoronaCard>
          </Link>
          
          <Link to="/agents" style={{ textDecoration: 'none' }}>
            <CoronaCard variant="outlined" style={{
              height: '120px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: `${design.colors.info}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: design.spacing.sm,
              }}>
                <Users style={{ width: '24px', height: '24px', color: design.colors.info }} />
              </div>
              <h3 style={{
                ...design.text('label'),
                fontSize: design.typography.sizes.sm,
                marginBottom: design.spacing.xs,
              }}>Browse Agents</h3>
              <p style={{
                ...design.text('caption'),
                fontSize: design.typography.sizes.xs,
              }}>Find new agents</p>
            </CoronaCard>
          </Link>

          <Link to="/workflow" style={{ textDecoration: 'none' }}>
            <CoronaCard variant="outlined" style={{
              height: '120px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: `${design.colors.warning}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: design.spacing.sm,
              }}>
                <Play style={{ width: '24px', height: '24px', color: design.colors.warning }} />
              </div>
              <h3 style={{
                ...design.text('label'),
                fontSize: design.typography.sizes.sm,
                marginBottom: design.spacing.xs,
              }}>Run Workflow</h3>
              <p style={{
                ...design.text('caption'),
                fontSize: design.typography.sizes.xs,
              }}>Execute workflows</p>
            </CoronaCard>
          </Link>

          <Link to="/analytics" style={{ textDecoration: 'none' }}>
            <CoronaCard variant="outlined" style={{
              height: '120px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: `${design.colors.primary}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: design.spacing.sm,
              }}>
                <BarChart3 style={{ width: '24px', height: '24px', color: design.colors.primary }} />
              </div>
              <h3 style={{
                ...design.text('label'),
                fontSize: design.typography.sizes.sm,
                marginBottom: design.spacing.xs,
              }}>Analytics</h3>
              <p style={{
                ...design.text('caption'),
                fontSize: design.typography.sizes.xs,
              }}>View insights</p>
            </CoronaCard>
          </Link>

          <Link to="/settings" style={{ textDecoration: 'none' }}>
            <CoronaCard variant="outlined" style={{
              height: '120px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: `${design.colors.secondary}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: design.spacing.sm,
              }}>
                <Settings style={{ width: '24px', height: '24px', color: design.colors.secondary }} />
              </div>
              <h3 style={{
                ...design.text('label'),
                fontSize: design.typography.sizes.sm,
                marginBottom: design.spacing.xs,
              }}>Settings</h3>
              <p style={{
                ...design.text('caption'),
                fontSize: design.typography.sizes.xs,
              }}>Configure app</p>
            </CoronaCard>
          </Link>
        </div>
      </CoronaCard>
    </div>
  )
}

export default DashboardPage