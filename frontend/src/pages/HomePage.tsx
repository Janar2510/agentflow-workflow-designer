import React from 'react'
import { Link } from 'react-router-dom'
import { Workflow, Zap, Users, Bot, BarChart3 } from 'lucide-react'
import Spline from '@splinetool/react-spline'
import { AgentFlowCard, AgentFlowButton, AgentFlowBadge } from '../components/ui'

const HomePage: React.FC = () => {
  const features = [
    {
      icon: Workflow,
      title: 'Visual Design',
      description: 'Drag and drop agents to create complex workflows without writing code.',
      color: 'var(--af-accent-primary)',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Bot,
      title: 'AI Agents',
      description: 'Access a library of pre-built AI agents for common tasks and workflows.',
      color: 'var(--af-accent-success)',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Zap,
      title: 'Real-time Execution',
      description: 'Monitor workflow execution in real-time with detailed logs and metrics.',
      color: 'var(--af-accent-warning)',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Work together with your team in real-time on the same workflow.',
      color: 'var(--af-accent-purple)',
      gradient: 'from-purple-500 to-pink-500'
    }
  ]

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Spline 3D Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Spline scene="https://prod.spline.design/dg5xFQKxIPDV401j/scene.splinecode" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-6">
              AgentFlow
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Visual Multi-Agent Workflow Designer - Create, deploy, and monitor AI agent workflows without writing orchestration code.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/workflow">
                <AgentFlowButton variant="primary" size="lg" className="text-lg px-8 py-4">
                  <Workflow className="w-6 h-6 mr-3" />
                  Get Started
                </AgentFlowButton>
              </Link>
              <Link to="/templates">
                <AgentFlowButton variant="outline" size="lg" className="text-lg px-8 py-4">
                  <Zap className="w-6 h-6 mr-3" />
                  Browse Templates
                </AgentFlowButton>
              </Link>
            </div>
          </div>
        </div>

        {/* Feature Cards Section */}
        <div className="px-6 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Powerful Features
              </h2>
              <p className="text-gray-400 text-lg">
                Everything you need to build and manage AI workflows
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <AgentFlowCard
                    key={index}
                    variant="glass"
                    className="af-card--gradient-border af-fade-in group hover:scale-105 transition-all duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </AgentFlowCard>
                )
              })}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="px-6 pb-20">
          <div className="max-w-4xl mx-auto">
            <AgentFlowCard variant="glass" className="af-card--gradient-border">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-8">
                  Trusted by Developers Worldwide
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div>
                    <div className="text-3xl font-bold text-blue-400 mb-2">10K+</div>
                    <div className="text-gray-400 text-sm">Workflows Created</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-400 mb-2">50K+</div>
                    <div className="text-gray-400 text-sm">Successful Executions</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-400 mb-2">1K+</div>
                    <div className="text-gray-400 text-sm">Active Users</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-yellow-400 mb-2">99.9%</div>
                    <div className="text-gray-400 text-sm">Uptime</div>
                  </div>
                </div>
              </div>
            </AgentFlowCard>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage