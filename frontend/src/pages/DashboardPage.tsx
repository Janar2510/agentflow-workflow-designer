import React from 'react'
import { Link } from 'react-router-dom'
import { Plus, TrendingUp, Clock, CheckCircle, AlertCircle, Users, Workflow, Zap, Bot, Settings, BarChart3, FileText, Play, Download, Star } from 'lucide-react'
import { AgentFlowCard, AgentFlowButton, AgentFlowBadge } from '../components/ui'

const DashboardPage: React.FC = () => {
  const stats = [
    {
      label: 'Total Workflows',
      value: '12',
      change: '+2 this week',
      icon: Workflow,
      color: '#007AFF'
    },
    {
      label: 'Successful Executions',
      value: '89%',
      change: '+5% from last month',
      icon: CheckCircle,
      color: '#00FF87'
    },
    {
      label: 'Active Agents',
      value: '7',
      change: '+1 this week',
      icon: Users,
      color: '#8B5CF6'
    },
    {
      label: 'Processing Time',
      value: '2.3s',
      change: '-0.5s faster',
      icon: TrendingUp,
      color: '#FFB800'
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

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: 'var(--af-bg-primary)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold" style={{ color: 'var(--af-text-primary)' }}>
            Dashboard
          </h1>
          <p className="text-lg mt-2" style={{ color: 'var(--af-text-secondary)' }}>
            Welcome back! Here's what's happening with your workflows.
          </p>
        </div>
        <Link to="/workflow/new">
          <AgentFlowButton variant="primary" size="lg">
            <Plus className="h-5 w-5 mr-2" />
            New Workflow
          </AgentFlowButton>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <AgentFlowCard
              key={index}
              variant="glass"
              className="af-card--gradient-border af-fade-in group hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: `${stat.color}20` }}>
                  <Icon 
                    className="h-8 w-8" 
                    style={{ color: stat.color }}
                  />
                </div>
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--af-text-secondary)' }}>
                  {stat.label}
                </p>
                <p className="text-3xl font-bold mb-2" style={{ color: 'var(--af-text-primary)' }}>
                  {stat.value}
                </p>
                <AgentFlowBadge variant="success" size="sm">
                  {stat.change}
                </AgentFlowBadge>
              </div>
            </AgentFlowCard>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Workflows */}
        <AgentFlowCard variant="glass" className="af-card--gradient-border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold" style={{ color: 'var(--af-text-primary)' }}>Recent Workflows</h3>
            <Link to="/dashboard" className="text-sm hover:underline" style={{ color: 'var(--af-accent-primary)' }}>
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentWorkflows.map((workflow) => (
              <div
                key={workflow.id}
                className="flex items-center justify-between p-4 rounded-lg hover:scale-105 transition-all duration-200 group"
                style={{ backgroundColor: 'var(--af-bg-tertiary)' }}
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(workflow.status)}
                  <div>
                    <h4 className="font-medium" style={{ color: 'var(--af-text-primary)' }}>
                      {workflow.name}
                    </h4>
                    <p className="text-sm" style={{ color: 'var(--af-text-secondary)' }}>
                      {workflow.executions} executions • {workflow.successRate}% success
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: 'var(--af-text-muted)' }}>{workflow.lastRun}</p>
                </div>
              </div>
            ))}
          </div>
        </AgentFlowCard>

        {/* Recent Executions */}
        <AgentFlowCard variant="glass" className="af-card--gradient-border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold" style={{ color: 'var(--af-text-primary)' }}>Recent Executions</h3>
            <Link to="/executions" className="text-sm hover:underline" style={{ color: 'var(--af-accent-primary)' }}>
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentExecutions.map((execution) => (
              <div
                key={execution.id}
                className="flex items-center justify-between p-4 rounded-lg hover:scale-105 transition-all duration-200 group"
                style={{ backgroundColor: 'var(--af-bg-tertiary)' }}
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(execution.status)}
                  <div>
                    <h4 className="font-medium" style={{ color: 'var(--af-text-primary)' }}>
                      {execution.workflow}
                    </h4>
                    <p className="text-sm" style={{ color: 'var(--af-text-secondary)' }}>
                      Duration: {execution.duration}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: 'var(--af-text-muted)' }}>{execution.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </AgentFlowCard>
      </div>

      {/* Quick Actions */}
      <AgentFlowCard variant="glass" className="af-card--gradient-border">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-semibold" style={{ color: 'var(--af-text-primary)' }}>Quick Actions</h3>
          <AgentFlowBadge variant="primary" size="lg">6 Actions</AgentFlowBadge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <Link to="/workflow/new" className="group">
            <AgentFlowCard variant="glass" className="h-36 flex flex-col items-center justify-center hover:scale-105 transition-all duration-300 group-hover:shadow-lg">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: 'var(--af-accent-primary)20' }}>
                <Plus className="h-7 w-7" style={{ color: 'var(--af-accent-primary)' }} />
              </div>
              <h3 className="font-semibold text-sm text-center mb-1" style={{ color: 'var(--af-text-primary)' }}>Create Workflow</h3>
              <p className="text-xs text-center" style={{ color: 'var(--af-text-secondary)' }}>Start from scratch</p>
            </AgentFlowCard>
          </Link>
          
          <Link to="/templates" className="group">
            <AgentFlowCard variant="glass" className="h-36 flex flex-col items-center justify-center hover:scale-105 transition-all duration-300 group-hover:shadow-lg">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: 'var(--af-accent-success)20' }}>
                <Zap className="h-7 w-7" style={{ color: 'var(--af-accent-success)' }} />
              </div>
              <h3 className="font-semibold text-sm text-center mb-1" style={{ color: 'var(--af-text-primary)' }}>Use Template</h3>
              <p className="text-xs text-center" style={{ color: 'var(--af-text-secondary)' }}>Browse templates</p>
            </AgentFlowCard>
          </Link>
          
          <Link to="/agents" className="group">
            <AgentFlowCard variant="glass" className="h-36 flex flex-col items-center justify-center hover:scale-105 transition-all duration-300 group-hover:shadow-lg">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: 'var(--af-accent-purple)20' }}>
                <Users className="h-7 w-7" style={{ color: 'var(--af-accent-purple)' }} />
              </div>
              <h3 className="font-semibold text-sm text-center mb-1" style={{ color: 'var(--af-text-primary)' }}>Browse Agents</h3>
              <p className="text-xs text-center" style={{ color: 'var(--af-text-secondary)' }}>Find new agents</p>
            </AgentFlowCard>
          </Link>

          <Link to="/workflow" className="group">
            <AgentFlowCard variant="glass" className="h-36 flex flex-col items-center justify-center hover:scale-105 transition-all duration-300 group-hover:shadow-lg">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: 'var(--af-accent-warning)20' }}>
                <Play className="h-7 w-7" style={{ color: 'var(--af-accent-warning)' }} />
              </div>
              <h3 className="font-semibold text-sm text-center mb-1" style={{ color: 'var(--af-text-primary)' }}>Run Workflow</h3>
              <p className="text-xs text-center" style={{ color: 'var(--af-text-secondary)' }}>Execute workflows</p>
            </AgentFlowCard>
          </Link>

          <Link to="/analytics" className="group">
            <AgentFlowCard variant="glass" className="h-36 flex flex-col items-center justify-center hover:scale-105 transition-all duration-300 group-hover:shadow-lg">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: 'var(--af-accent-primary)20' }}>
                <BarChart3 className="h-7 w-7" style={{ color: 'var(--af-accent-primary)' }} />
              </div>
              <h3 className="font-semibold text-sm text-center mb-1" style={{ color: 'var(--af-text-primary)' }}>Analytics</h3>
              <p className="text-xs text-center" style={{ color: 'var(--af-text-secondary)' }}>View insights</p>
            </AgentFlowCard>
          </Link>

          <Link to="/settings" className="group">
            <AgentFlowCard variant="glass" className="h-36 flex flex-col items-center justify-center hover:scale-105 transition-all duration-300 group-hover:shadow-lg">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: 'var(--af-text-muted)20' }}>
                <Settings className="h-7 w-7" style={{ color: 'var(--af-text-muted)' }} />
              </div>
              <h3 className="font-semibold text-sm text-center mb-1" style={{ color: 'var(--af-text-primary)' }}>Settings</h3>
              <p className="text-xs text-center" style={{ color: 'var(--af-text-secondary)' }}>Configure app</p>
            </AgentFlowCard>
          </Link>
        </div>
      </AgentFlowCard>
    </div>
  )
}

export default DashboardPage