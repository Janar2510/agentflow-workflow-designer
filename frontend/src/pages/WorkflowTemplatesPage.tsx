import React, { useState } from 'react'
import { Search, Star, Download, Eye } from 'lucide-react'
import { AgentFlowCard, AgentFlowButton, AgentFlowBadge } from '../components/ui'

export const WorkflowTemplatesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [sortBy, setSortBy] = useState('popular')

  const templates = [
    {
      id: '1',
      name: 'Customer Support Bot',
      description: 'Automated customer support with sentiment analysis and response generation',
      category: 'Customer Service',
      difficulty: 'intermediate',
      rating: 4.8,
      downloads: 1247,
      featured: true,
      preview: '/api/placeholder/300/200'
    },
    {
      id: '2',
      name: 'Data Processing Pipeline',
      description: 'ETL pipeline for processing and transforming large datasets',
      category: 'Data Processing',
      difficulty: 'advanced',
      rating: 4.6,
      downloads: 892,
      featured: true,
      preview: '/api/placeholder/300/200'
    },
    {
      id: '3',
      name: 'Content Moderation',
      description: 'AI-powered content moderation with image and text analysis',
      category: 'Content Management',
      difficulty: 'beginner',
      rating: 4.7,
      downloads: 2156,
      featured: true,
      preview: '/api/placeholder/300/200'
    },
    {
      id: '4',
      name: 'Email Marketing Automation',
      description: 'Automated email campaigns with personalization and A/B testing',
      category: 'Marketing',
      difficulty: 'intermediate',
      rating: 4.5,
      downloads: 1567,
      featured: false,
      preview: '/api/placeholder/300/200'
    },
    {
      id: '5',
      name: 'Financial Data Analysis',
      description: 'Real-time financial data processing and trend analysis',
      category: 'Finance',
      difficulty: 'advanced',
      rating: 4.9,
      downloads: 743,
      featured: false,
      preview: '/api/placeholder/300/200'
    },
    {
      id: '6',
      name: 'Social Media Scheduler',
      description: 'Automated social media posting with content optimization',
      category: 'Marketing',
      difficulty: 'beginner',
      rating: 4.3,
      downloads: 1892,
      featured: false,
      preview: '/api/placeholder/300/200'
    }
  ]

  const categories = ['All', 'Customer Service', 'Data Processing', 'Content Management', 'Sales', 'Finance', 'Marketing']
  const difficulties = ['beginner', 'intermediate', 'advanced']
  const sortOptions = ['popular', 'newest', 'rating', 'downloads']

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || template.category === selectedCategory
    const matchesDifficulty = !selectedDifficulty || template.difficulty === selectedDifficulty
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const featuredTemplates = filteredTemplates.filter(template => template.featured)
  const otherTemplates = filteredTemplates.filter(template => !template.featured)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'success'
      case 'intermediate': return 'warning'
      case 'advanced': return 'danger'
      default: return 'primary'
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Workflow Templates
        </h1>
        <p className="text-gray-400">
          Get started quickly with pre-built workflow templates.
        </p>
      </div>

      {/* Search and Filters */}
      <AgentFlowCard variant="glass" className="mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category === 'All' ? '' : category)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category || (category === 'All' && !selectedCategory)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Difficulty and Sort */}
          <div className="flex gap-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Levels</option>
              {difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty} className="capitalize">
                  {difficulty}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sortOptions.map((option) => (
                <option key={option} value={option} className="capitalize">
                  {option === 'popular' ? 'Most Popular' : option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </AgentFlowCard>

      {/* Featured Templates */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Star className="h-5 w-5 text-yellow-400" />
          <h2 className="text-xl font-semibold text-white">Featured Templates</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTemplates.map((template) => (
            <AgentFlowCard key={template.id} variant="glass" className="group hover:scale-105 transition-transform relative overflow-hidden">
              {/* Black Preview Card - 2px smaller than whole card */}
              <div className="mb-4">
                <div className="bg-black rounded-lg mx-auto flex items-center justify-center shadow-lg" style={{ width: 'calc(100% - 4px)', height: '80px', margin: '2px' }}>
                  <div className="text-gray-400 text-xs">Preview</div>
                </div>
              </div>

              {/* Template Info */}
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {template.name}
                  </h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-400">{template.rating}</span>
                  </div>
                </div>

                <p className="text-gray-400 text-sm line-clamp-2">
                  {template.description}
                </p>

                <div className="flex items-center gap-2">
                  <AgentFlowBadge variant={getDifficultyColor(template.difficulty)}>
                    {template.difficulty.toUpperCase()}
                  </AgentFlowBadge>
                  <AgentFlowBadge variant="primary">
                    {template.category}
                  </AgentFlowBadge>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <AgentFlowButton variant="primary" className="flex-1">
                    Use Template
                  </AgentFlowButton>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      {template.downloads}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      View
                    </div>
                  </div>
                </div>
              </div>
            </AgentFlowCard>
          ))}
        </div>
      </div>

      {/* All Templates */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-6">All Templates</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherTemplates.map((template) => (
            <AgentFlowCard key={template.id} variant="glass" className="group hover:scale-105 transition-transform relative overflow-hidden">
              {/* Black Preview Card - 2px smaller than whole card */}
              <div className="mb-4">
                <div className="bg-black rounded-lg mx-auto flex items-center justify-center shadow-lg" style={{ width: 'calc(100% - 4px)', height: '80px', margin: '2px' }}>
                  <div className="text-gray-400 text-xs">Preview</div>
                </div>
              </div>

              {/* Template Info */}
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {template.name}
                  </h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-400">{template.rating}</span>
                  </div>
                </div>

                <p className="text-gray-400 text-sm line-clamp-2">
                  {template.description}
                </p>

                <div className="flex items-center gap-2">
                  <AgentFlowBadge variant={getDifficultyColor(template.difficulty)}>
                    {template.difficulty.toUpperCase()}
                  </AgentFlowBadge>
                  <AgentFlowBadge variant="primary">
                    {template.category}
                  </AgentFlowBadge>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <AgentFlowButton variant="primary" className="flex-1">
                    Use Template
                  </AgentFlowButton>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      {template.downloads}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      View
                    </div>
                  </div>
                </div>
              </div>
            </AgentFlowCard>
          ))}
        </div>
      </div>
    </div>
  )
}

export default WorkflowTemplatesPage