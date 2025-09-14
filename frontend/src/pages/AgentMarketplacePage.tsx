import React, { useState } from 'react'
import { Search, Star, Download, Filter, Bot, BarChart3, Link, MessageCircle, Eye, Database } from 'lucide-react'
import { AgentFlowCard, AgentFlowButton, AgentFlowBadge } from '../components/ui'

export const AgentMarketplacePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const agents = [
    {
      id: '1',
      name: 'LLM Text Generator',
      description: 'Generate high-quality text using large language models with customizable parameters',
      category: 'LLM',
      rating: 4.9,
      downloads: 3247,
      price: 'Free',
      tags: ['Built-in', 'Text Generation', 'AI'],
      icon: Bot
    },
    {
      id: '2',
      name: 'Data Processor',
      description: 'Process and transform data with pandas operations, filtering, and aggregation',
      category: 'Data',
      rating: 4.7,
      downloads: 2156,
      price: 'Free',
      tags: ['Built-in', 'Data Processing', 'Analytics'],
      icon: BarChart3
    },
    {
      id: '3',
      name: 'API Caller',
      description: 'Make HTTP requests to external APIs with authentication and error handling',
      category: 'Integration',
      rating: 4.6,
      downloads: 1892,
      price: 'Free',
      tags: ['Built-in', 'API', 'Integration'],
      icon: Link
    },
    {
      id: '4',
      name: 'Email Sender',
      description: 'Send emails with templates, attachments, and delivery tracking',
      category: 'Communication',
      rating: 4.8,
      downloads: 1456,
      price: 'Free',
      tags: ['Built-in', 'Email', 'Communication'],
      icon: MessageCircle
    },
    {
      id: '5',
      name: 'Image Analyzer',
      description: 'Analyze images using computer vision for object detection and classification',
      category: 'Vision',
      rating: 4.5,
      downloads: 987,
      price: 'Free',
      tags: ['Built-in', 'Computer Vision', 'AI'],
      icon: Eye
    },
    {
      id: '6',
      name: 'Database Connector',
      description: 'Connect to various databases and execute queries with result processing',
      category: 'Data',
      rating: 4.4,
      downloads: 743,
      price: 'Free',
      tags: ['Built-in', 'Database', 'Data'],
      icon: Database
    }
  ]

  const categories = [
    { name: 'All', icon: Filter },
    { name: 'LLM', icon: Bot },
    { name: 'Data', icon: BarChart3 },
    { name: 'Tools', icon: Filter },
    { name: 'Integration', icon: Link },
    { name: 'Communication', icon: MessageCircle },
    { name: 'Vision', icon: Eye }
  ]

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || agent.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'LLM': return 'primary'
      case 'Data': return 'success'
      case 'Integration': return 'warning'
      case 'Communication': return 'primary'
      case 'Vision': return 'danger'
      default: return 'primary'
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Agent Marketplace
          </h1>
          <p className="text-gray-400">
            Discover and integrate powerful AI agents for your workflows.
          </p>
        </div>
        <AgentFlowButton variant="primary">
          <Bot className="h-4 w-4 mr-2" />
          Create Agent
        </AgentFlowButton>
      </div>

      {/* Search and Filters */}
      <AgentFlowCard variant="glass" className="mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.name
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {category.name}
                </button>
              )
            })}
          </div>
        </div>
      </AgentFlowCard>

      {/* Built-in Agents */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Star className="h-5 w-5 text-yellow-400" />
          <h2 className="text-xl font-semibold text-white">Built-in Agents</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => {
            const Icon = agent.icon
            return (
              <AgentFlowCard key={agent.id} variant="glass" className="group hover:scale-105 transition-transform relative overflow-hidden">
                {/* Black Preview Card - 2px smaller than whole card */}
                <div className="mb-4">
                  <div className="bg-black rounded-lg mx-auto flex items-center justify-center shadow-lg" style={{ width: 'calc(100% - 4px)', height: '80px', margin: '2px' }}>
                    <div className="text-gray-400 text-xs">Preview</div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {agent.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-400">{agent.rating}</span>
                          </div>
                          <AgentFlowBadge variant={getCategoryColor(agent.category)}>
                            {agent.category}
                          </AgentFlowBadge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-400">{agent.price}</div>
                      <div className="text-xs text-gray-400">{agent.downloads} downloads</div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {agent.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {agent.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <AgentFlowButton variant="primary" className="flex-1">
                      Use Agent
                    </AgentFlowButton>
                    <div className="flex items-center gap-4 text-sm text-gray-400 ml-4">
                      <div className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        {agent.downloads}
                      </div>
                    </div>
                  </div>
                </div>
              </AgentFlowCard>
            )
          })}
        </div>
      </div>

      {/* Community Agents */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-6">Community Agents</h2>
        
        <AgentFlowCard variant="glass" className="text-center py-12">
          <div className="space-y-4">
            <Bot className="h-12 w-12 text-gray-400 mx-auto" />
            <h3 className="text-lg font-semibold text-white">No community agents yet</h3>
            <p className="text-gray-400">
              Community agents will appear here when users start sharing their custom agents.
            </p>
            <AgentFlowButton variant="ghost">
              Be the first to share an agent
            </AgentFlowButton>
          </div>
        </AgentFlowCard>
      </div>
    </div>
  )
}

export default AgentMarketplacePage