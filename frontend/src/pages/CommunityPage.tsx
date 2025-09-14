import React, { useState, useEffect } from 'react'
import { MessageCircle, Trophy, Bell, Users, TrendingUp, Star, Eye, Heart, Reply } from 'lucide-react'
import { AgentFlowCard, AgentFlowButton, AgentFlowBadge } from '../components/ui'

interface ForumPost {
  id: string
  title: string
  content: string
  author: {
    username: string
    full_name?: string
    avatar_url?: string
  }
  category: {
    name: string
    color: string
    icon: string
  }
  post_type: string
  view_count: number
  reply_count: number
  like_count: number
  is_pinned: boolean
  is_featured: boolean
  created_at: string
  last_activity_at: string
}

interface LeaderboardUser {
  user_id: string
  username: string
  full_name?: string
  avatar_url?: string
  reputation_points: number
  agents_created: number
  agents_sold: number
  posts_created: number
  comments_created: number
  total_likes_received: number
  rank_position: number
}

export const CommunityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'discussions' | 'leaderboard' | 'events'>('discussions')
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for now - replace with actual API calls
    setPosts([
      {
        id: '1',
        title: 'Best practices for chaining multiple AI agents',
        content: 'I\'ve been working on complex workflows and wanted to share some insights...',
        author: { username: 'Sarah Chen', full_name: 'Sarah Chen' },
        category: { name: 'Tutorials', color: '#f093fb', icon: '📚' },
        post_type: 'tutorial',
        view_count: 1200,
        reply_count: 34,
        like_count: 89,
        is_pinned: false,
        is_featured: true,
        created_at: '2024-01-15T10:30:00Z',
        last_activity_at: '2024-01-15T14:30:00Z'
      },
      {
        id: '2',
        title: 'New GPT-4 integration features released!',
        content: 'We\'re excited to announce new features for GPT-4 integration...',
        author: { username: 'AgentFlow Team', full_name: 'AgentFlow Team' },
        category: { name: 'Announcements', color: '#fed6e3', icon: '📢' },
        post_type: 'announcement',
        view_count: 5300,
        reply_count: 89,
        like_count: 156,
        is_pinned: true,
        is_featured: true,
        created_at: '2024-01-15T08:00:00Z',
        last_activity_at: '2024-01-15T16:45:00Z'
      },
      {
        id: '3',
        title: 'Troubleshooting: Agent timeout issues',
        content: 'I\'m experiencing timeout issues with my data processing agent...',
        author: { username: 'Mike Johnson', full_name: 'Mike Johnson' },
        category: { name: 'Help & Support', color: '#fa709a', icon: '🆘' },
        post_type: 'question',
        view_count: 445,
        reply_count: 12,
        like_count: 23,
        is_pinned: false,
        is_featured: false,
        created_at: '2024-01-14T15:20:00Z',
        last_activity_at: '2024-01-15T09:15:00Z'
      },
      {
        id: '4',
        title: 'Share your coolest workflow creations!',
        content: 'Let\'s see what amazing workflows the community has built...',
        author: { username: 'Community Mod', full_name: 'Community Mod' },
        category: { name: 'Showcase', color: '#4facfe', icon: '🎨' },
        post_type: 'showcase',
        view_count: 8900,
        reply_count: 156,
        like_count: 234,
        is_pinned: false,
        is_featured: true,
        created_at: '2024-01-13T12:00:00Z',
        last_activity_at: '2024-01-15T11:30:00Z'
      }
    ])

    setLeaderboard([
      {
        user_id: '1',
        username: 'Alex Thompson',
        full_name: 'Alex Thompson',
        reputation_points: 15420,
        agents_created: 42,
        agents_sold: 3200,
        posts_created: 28,
        comments_created: 156,
        total_likes_received: 890,
        rank_position: 1
      },
      {
        user_id: '2',
        username: 'Maria Garcia',
        full_name: 'Maria Garcia',
        reputation_points: 12850,
        agents_created: 38,
        agents_sold: 2800,
        posts_created: 22,
        comments_created: 134,
        total_likes_received: 756,
        rank_position: 2
      },
      {
        user_id: '3',
        username: 'David Kim',
        full_name: 'David Kim',
        reputation_points: 11200,
        agents_created: 31,
        agents_sold: 2100,
        posts_created: 18,
        comments_created: 98,
        total_likes_received: 623,
        rank_position: 3
      },
      {
        user_id: '4',
        username: 'Lisa Wang',
        full_name: 'Lisa Wang',
        reputation_points: 9850,
        agents_created: 28,
        agents_sold: 1900,
        posts_created: 15,
        comments_created: 87,
        total_likes_received: 534,
        rank_position: 4
      },
      {
        user_id: '5',
        username: 'James Wilson',
        full_name: 'James Wilson',
        reputation_points: 8750,
        agents_created: 24,
        agents_sold: 1500,
        posts_created: 12,
        comments_created: 76,
        total_likes_received: 456,
        rank_position: 5
      }
    ])

    setLoading(false)
  }, [])

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }

  const getPostTypeColor = (postType: string) => {
    switch (postType) {
      case 'tutorial': return 'info'
      case 'announcement': return 'success'
      case 'question': return 'warning'
      case 'showcase': return 'secondary'
      default: return 'primary'
    }
  }

  const getPostTypeLabel = (postType: string) => {
    switch (postType) {
      case 'tutorial': return 'Tutorial'
      case 'announcement': return 'News'
      case 'question': return 'Help'
      case 'showcase': return 'Showcase'
      default: return 'Discussion'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-lg p-6">
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2 mb-4"></div>
                    <div className="h-3 bg-slate-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-lg p-6">
                <div className="h-6 bg-slate-200 rounded w-32 mb-4"></div>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-slate-200 rounded w-24 mb-1"></div>
                      <div className="h-2 bg-slate-200 rounded w-16"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Community Hub
          </h1>
          <p className="text-slate-600 text-lg">
            Connect, learn, and share with the AgentFlow community
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('discussions')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'discussions'
                ? 'bg-blue-100 text-blue-700'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageCircle className="w-5 h-5 inline mr-2" />
            Discussions
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'leaderboard'
                ? 'bg-blue-100 text-blue-700'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Trophy className="w-5 h-5 inline mr-2" />
            Leaderboard
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'events'
                ? 'bg-blue-100 text-blue-700'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bell className="w-5 h-5 inline mr-2" />
            Events
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'discussions' && (
              <div className="space-y-6">
                {/* Recent Discussions */}
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900 mb-6">Recent Discussions</h2>
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <AgentFlowCard key={post.id} className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-semibold text-slate-900 hover:text-blue-600 cursor-pointer">
                                {post.title}
                              </h3>
                              {post.is_pinned && (
                                <AgentFlowBadge variant="warning" size="sm">
                                  📌 Pinned
                                </AgentFlowBadge>
                              )}
                              {post.is_featured && (
                                <AgentFlowBadge variant="success" size="sm">
                                  ⭐ Featured
                                </AgentFlowBadge>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-slate-600 mb-3">
                              <span className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                {post.author.username}
                              </span>
                              <span className="flex items-center">
                                <span 
                                  className="w-2 h-2 rounded-full mr-2"
                                  style={{ backgroundColor: post.category.color }}
                                ></span>
                                {post.category.name}
                              </span>
                              <AgentFlowBadge 
                                variant={getPostTypeColor(post.post_type)}
                                size="sm"
                              >
                                {getPostTypeLabel(post.post_type)}
                              </AgentFlowBadge>
                            </div>
                            <p className="text-slate-700 line-clamp-2 mb-4">
                              {post.content}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6 text-sm text-slate-600">
                            <span className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              {post.view_count.toLocaleString()}
                            </span>
                            <span className="flex items-center">
                              <Reply className="w-4 h-4 mr-1" />
                              {post.reply_count}
                            </span>
                            <span className="flex items-center">
                              <Heart className="w-4 h-4 mr-1" />
                              {post.like_count}
                            </span>
                          </div>
                          <span className="text-sm text-slate-500">
                            {getTimeAgo(post.last_activity_at)}
                          </span>
                        </div>
                      </AgentFlowCard>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'leaderboard' && (
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-6">🏆 Top Contributors</h2>
                <div className="space-y-4">
                  {leaderboard.map((user, index) => (
                    <AgentFlowCard key={user.user_id} className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                          index === 0 ? 'bg-yellow-500' : 
                          index === 1 ? 'bg-gray-400' : 
                          index === 2 ? 'bg-amber-600' : 'bg-slate-300'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-slate-900">{user.username}</h3>
                            <AgentFlowBadge variant="primary" size="sm">
                              {user.reputation_points.toLocaleString()} pts
                            </AgentFlowBadge>
                          </div>
                          <div className="text-sm text-slate-600">
                            {user.agents_created} agents • {user.agents_sold.toLocaleString()} sales • {user.posts_created} posts
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-slate-900">
                            #{user.rank_position}
                          </div>
                        </div>
                      </div>
                    </AgentFlowCard>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'events' && (
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-6">Community Events</h2>
                <div className="text-center py-12">
                  <Bell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No events scheduled</h3>
                  <p className="text-slate-600">Check back later for upcoming community events!</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <AgentFlowCard className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Community Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Posts</span>
                  <span className="font-semibold">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Active Users</span>
                  <span className="font-semibold">567</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Agents Created</span>
                  <span className="font-semibold">89</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Workflows Shared</span>
                  <span className="font-semibold">234</span>
                </div>
              </div>
            </AgentFlowCard>

            {/* Quick Actions */}
            <AgentFlowCard className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <AgentFlowButton variant="primary" className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Start Discussion
                </AgentFlowButton>
                <AgentFlowButton variant="outline" className="w-full">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Browse Agents
                </AgentFlowButton>
                <AgentFlowButton variant="outline" className="w-full">
                  <Star className="w-4 h-4 mr-2" />
                  Share Workflow
                </AgentFlowButton>
              </div>
            </AgentFlowCard>

            {/* Recent Activity */}
            <AgentFlowCard className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="text-sm">
                  <span className="text-slate-600">Sarah Chen</span> created a new tutorial
                  <div className="text-xs text-slate-500">2 hours ago</div>
                </div>
                <div className="text-sm">
                  <span className="text-slate-600">Mike Johnson</span> asked a question
                  <div className="text-xs text-slate-500">4 hours ago</div>
                </div>
                <div className="text-sm">
                  <span className="text-slate-600">Alex Thompson</span> shared a workflow
                  <div className="text-xs text-slate-500">6 hours ago</div>
                </div>
              </div>
            </AgentFlowCard>
          </div>
        </div>
      </div>
    </div>
  )
}
