import React, { useState } from 'react'
import { Search, Star, Download, Eye } from 'lucide-react'
import { CoronaCard, CoronaButton, CoronaBadge } from '../components/ui'
import { useCoronaDesign } from '../hooks/useCoronaDesign'

export const WorkflowTemplatesPage: React.FC = () => {
  const design = useCoronaDesign()
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

  const pageStyles: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: design.colors.bgPrimary,
    padding: design.spacing.lg,
    fontFamily: design.typography.fontFamily,
  }

  const headerStyles: React.CSSProperties = {
    marginBottom: design.spacing.xl,
  }

  const titleStyles: React.CSSProperties = {
    ...design.text('heading'),
    fontSize: design.typography.sizes['2xl'],
    marginBottom: design.spacing.sm,
  }

  const subtitleStyles: React.CSSProperties = {
    ...design.text('body'),
    color: design.colors.textSecondary,
  }

  return (
    <div style={pageStyles}>
      {/* Header */}
      <div style={headerStyles}>
        <h1 style={titleStyles}>
          Workflow Templates
        </h1>
        <p style={subtitleStyles}>
          Get started quickly with pre-built workflow templates.
        </p>
      </div>

      {/* Search and Filters */}
      <CoronaCard variant="elevated" style={{ marginBottom: design.spacing.xl }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: design.spacing.md,
        }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1 }}>
            <Search style={{
              position: 'absolute',
              left: design.spacing.sm,
              top: '50%',
              transform: 'translateY(-50%)',
              color: design.colors.textMuted,
              width: '16px',
              height: '16px',
            }} />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: design.spacing.xl,
                paddingRight: design.spacing.sm,
                paddingTop: design.spacing.sm,
                paddingBottom: design.spacing.sm,
                backgroundColor: design.colors.bgSecondary,
                border: `1px solid ${design.colors.borderPrimary}`,
                borderRadius: '0.375rem',
                color: design.colors.textPrimary,
                fontFamily: design.typography.fontFamily,
                fontSize: design.typography.sizes.base,
                outline: 'none',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = design.colors.primary
                e.target.style.boxShadow = `0 0 0 2px ${design.colors.primary}20`
              }}
              onBlur={(e) => {
                e.target.style.borderColor = design.colors.borderPrimary
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>

          {/* Category Filters */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: design.spacing.sm,
          }}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category === 'All' ? '' : category)}
                style={{
                  padding: `${design.spacing.xs} ${design.spacing.sm}`,
                  borderRadius: '0.375rem',
                  fontSize: design.typography.sizes.sm,
                  fontWeight: design.typography.weights.medium,
                  transition: 'all 0.15s ease-in-out',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: selectedCategory === category || (category === 'All' && !selectedCategory)
                    ? design.colors.primary
                    : design.colors.bgSecondary,
                  color: selectedCategory === category || (category === 'All' && !selectedCategory)
                    ? design.colors.white
                    : design.colors.textSecondary,
                }}
                onMouseEnter={(e) => {
                  if (!(selectedCategory === category || (category === 'All' && !selectedCategory))) {
                    e.currentTarget.style.backgroundColor = design.colors.bgTertiary
                  }
                }}
                onMouseLeave={(e) => {
                  if (!(selectedCategory === category || (category === 'All' && !selectedCategory))) {
                    e.currentTarget.style.backgroundColor = design.colors.bgSecondary
                  }
                }}
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
      </CoronaCard>

      {/* Featured Templates */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Star className="h-5 w-5 text-yellow-400" />
          <h2 className="text-xl font-semibold text-white">Featured Templates</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTemplates.map((template) => (
            <CoronaCard key={template.id} variant="elevated" className="group hover:scale-105 transition-transform relative overflow-hidden">
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
                  <CoronaBadge variant={getDifficultyColor(template.difficulty)}>
                    {template.difficulty.toUpperCase()}
                  </CoronaBadge>
                  <CoronaBadge variant="primary">
                    {template.category}
                  </CoronaBadge>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <CoronaButton variant="primary" className="flex-1">
                    Use Template
                  </CoronaButton>
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
            </CoronaCard>
          ))}
        </div>
      </div>

      {/* All Templates */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-6">All Templates</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherTemplates.map((template) => (
            <CoronaCard key={template.id} variant="elevated" className="group hover:scale-105 transition-transform relative overflow-hidden">
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
                  <CoronaBadge variant={getDifficultyColor(template.difficulty)}>
                    {template.difficulty.toUpperCase()}
                  </CoronaBadge>
                  <CoronaBadge variant="primary">
                    {template.category}
                  </CoronaBadge>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <CoronaButton variant="primary" className="flex-1">
                    Use Template
                  </CoronaButton>
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
            </CoronaCard>
          ))}
        </div>
      </div>
    </div>
  )
}

export default WorkflowTemplatesPage