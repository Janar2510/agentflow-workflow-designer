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
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Dashboard
          </h1>
          <p className="text-gray-400 mt-1">
            Welcome back! Here's what's happening with your workflows.
          </p>
        </div>
        <Link to="/workflow/new">
          <AgentFlowButton variant="primary">
            <Plus className="h-4 w-4 mr-2" />
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
              className="af-fade-in relative overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Black Preview Card - 2px smaller than whole card */}
              <div className="mb-4">
                <div className="bg-black rounded-lg mx-auto flex items-center justify-center shadow-lg" style={{ width: 'calc(100% - 4px)', height: '60px', margin: '2px' }}>
                  <Icon 
                    className="h-8 w-8" 
                    style={{ color: stat.color }}
                  />
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm font-medium mb-1 text-gray-400">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-white">
                  {stat.value}
                </p>
                <p className="text-xs mt-1 text-green-400">
                  {stat.change}
                </p>
              </div>
            </AgentFlowCard>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Workflows */}
        <AgentFlowCard variant="glass">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Recent Workflows</h3>
            <Link to="/dashboard" className="text-sm text-blue-400 hover:text-blue-300">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentWorkflows.map((workflow) => (
              <div
                key={workflow.id}
                className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(workflow.status)}
                  <div>
                    <h4 className="font-medium text-white">
                      {workflow.name}
                    </h4>
                    <p className="text-sm text-gray-400">
                      {workflow.executions} executions • {workflow.successRate}% success
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{workflow.lastRun}</p>
                </div>
              </div>
            ))}
          </div>
        </AgentFlowCard>

        {/* Recent Executions */}
        <AgentFlowCard variant="glass">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Recent Executions</h3>
            <Link to="/executions" className="text-sm text-blue-400 hover:text-blue-300">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentExecutions.map((execution) => (
              <div
                key={execution.id}
                className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(execution.status)}
                  <div>
                    <h4 className="font-medium text-white">
                      {execution.workflow}
                    </h4>
                    <p className="text-sm text-gray-400">
                      Duration: {execution.duration}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{execution.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </AgentFlowCard>
      </div>

      {/* Quick Actions */}
      <AgentFlowCard variant="glass">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Quick Actions</h3>
          <AgentFlowBadge variant="primary">6 Actions</AgentFlowBadge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Link to="/workflow/new" className="group">
            <AgentFlowCard variant="glass" className="h-32 flex flex-col items-center justify-center hover:scale-105 transition-all duration-200 hover:shadow-lg border-2 border-transparent hover:border-blue-500/30">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-500/30 transition-colors">
                <Plus className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="font-medium text-white text-sm text-center">Create Workflow</h3>
              <p className="text-xs text-gray-400 text-center mt-1">Start from scratch</p>
            </AgentFlowCard>
          </Link>
          
          <Link to="/templates" className="group">
            <AgentFlowCard variant="glass" className="h-32 flex flex-col items-center justify-center hover:scale-105 transition-all duration-200 hover:shadow-lg border-2 border-transparent hover:border-green-500/30">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-500/30 transition-colors">
                <Zap className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="font-medium text-white text-sm text-center">Use Template</h3>
              <p className="text-xs text-gray-400 text-center mt-1">Browse templates</p>
            </AgentFlowCard>
          </Link>
          
          <Link to="/marketplace" className="group">
            <AgentFlowCard variant="glass" className="h-32 flex flex-col items-center justify-center hover:scale-105 transition-all duration-200 hover:shadow-lg border-2 border-transparent hover:border-purple-500/30">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-500/30 transition-colors">
                <Users className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="font-medium text-white text-sm text-center">Browse Agents</h3>
              <p className="text-xs text-gray-400 text-center mt-1">Find new agents</p>
            </AgentFlowCard>
          </Link>

          <Link to="/workflow" className="group">
            <AgentFlowCard variant="glass" className="h-32 flex flex-col items-center justify-center hover:scale-105 transition-all duration-200 hover:shadow-lg border-2 border-transparent hover:border-orange-500/30">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-orange-500/30 transition-colors">
                <Play className="h-6 w-6 text-orange-400" />
              </div>
              <h3 className="font-medium text-white text-sm text-center">Run Workflow</h3>
              <p className="text-xs text-gray-400 text-center mt-1">Execute workflows</p>
            </AgentFlowCard>
          </Link>

          <Link to="/analytics" className="group">
            <AgentFlowCard variant="glass" className="h-32 flex flex-col items-center justify-center hover:scale-105 transition-all duration-200 hover:shadow-lg border-2 border-transparent hover:border-cyan-500/30">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-cyan-500/30 transition-colors">
                <BarChart3 className="h-6 w-6 text-cyan-400" />
              </div>
              <h3 className="font-medium text-white text-sm text-center">Analytics</h3>
              <p className="text-xs text-gray-400 text-center mt-1">View insights</p>
            </AgentFlowCard>
          </Link>

          <Link to="/settings" className="group">
            <AgentFlowCard variant="glass" className="h-32 flex flex-col items-center justify-center hover:scale-105 transition-all duration-200 hover:shadow-lg border-2 border-transparent hover:border-gray-500/30">
              <div className="w-12 h-12 bg-gray-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-gray-500/30 transition-colors">
                <Settings className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="font-medium text-white text-sm text-center">Settings</h3>
              <p className="text-xs text-gray-400 text-center mt-1">Configure app</p>
            </AgentFlowCard>
          </Link>
        </div>
      </AgentFlowCard>
    </div>
  )
}

export default DashboardPage