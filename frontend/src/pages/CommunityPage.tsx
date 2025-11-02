import React, { useState, useEffect } from 'react'
import { MessageCircle, Trophy, Bell, Users, TrendingUp, Star, Eye, Heart, Reply } from 'lucide-react'
import { CoronaCard, CoronaButton, CoronaBadge } from '../components/ui'
import { useCoronaDesign } from '../hooks/useCoronaDesign'

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
  const design = useCoronaDesign()
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
      <div style={{
        minHeight: '100vh',
        backgroundColor: design.colors.bgPrimary,
        padding: design.spacing.xl,
        fontFamily: design.typography.fontFamily,
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
            <div style={{
              height: '2rem',
              backgroundColor: design.colors.bgTertiary,
              borderRadius: design.spacing.sm,
              width: '16rem',
              marginBottom: design.spacing.lg
            }}></div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', 
              gap: design.spacing.lg,
              '@media (min-width: 1024px)': { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }
            }}>
              <div style={{ 
                gridColumn: 'span 2',
                display: 'flex',
                flexDirection: 'column',
                gap: design.spacing.md
              }}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} style={{
                    backgroundColor: design.colors.cardBg,
                    borderRadius: design.spacing.sm,
                    padding: design.spacing.lg,
                    border: `1px solid ${design.colors.borderPrimary}`
                  }}>
                    <div style={{
                      height: '1rem',
                      backgroundColor: design.colors.bgTertiary,
                      borderRadius: design.spacing.xs,
                      width: '75%',
                      marginBottom: design.spacing.sm
                    }}></div>
                    <div style={{
                      height: '0.75rem',
                      backgroundColor: design.colors.bgTertiary,
                      borderRadius: design.spacing.xs,
                      width: '50%',
                      marginBottom: design.spacing.md
                    }}></div>
                    <div style={{
                      height: '0.75rem',
                      backgroundColor: design.colors.bgTertiary,
                      borderRadius: design.spacing.xs,
                      width: '100%'
                    }}></div>
                  </div>
                ))}
              </div>
              <div style={{
                backgroundColor: design.colors.cardBg,
                borderRadius: design.spacing.sm,
                padding: design.spacing.lg,
                border: `1px solid ${design.colors.borderPrimary}`
              }}>
                <div style={{
                  height: '1.5rem',
                  backgroundColor: design.colors.bgTertiary,
                  borderRadius: design.spacing.sm,
                  width: '8rem',
                  marginBottom: design.spacing.md
                }}></div>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: design.spacing.sm,
                    marginBottom: design.spacing.sm
                  }}>
                    <div style={{
                      width: '2rem',
                      height: '2rem',
                      backgroundColor: design.colors.bgTertiary,
                      borderRadius: '50%'
                    }}></div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        height: '0.75rem',
                        backgroundColor: design.colors.bgTertiary,
                        borderRadius: design.spacing.xs,
                        width: '6rem',
                        marginBottom: design.spacing.xs
                      }}></div>
                      <div style={{
                        height: '0.5rem',
                        backgroundColor: design.colors.bgTertiary,
                        borderRadius: design.spacing.xs,
                        width: '4rem'
                      }}></div>
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
        <div style={{ marginBottom: design.spacing.lg }}>
          <h1 style={{
            ...design.text('heading'),
            fontSize: design.typography.sizes['4xl'],
            fontWeight: design.typography.weights.bold,
            background: `linear-gradient(135deg, ${design.colors.primary}, ${design.colors.secondary})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: design.spacing.md,
            color: design.colors.textPrimary
          }}>
            Community Hub
          </h1>
          <p style={{
            ...design.text('body'),
            color: design.colors.textSecondary,
            fontSize: design.typography.sizes.lg
          }}>
            Connect, learn, and share with the AgentFlow community
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: design.spacing.xs,
          marginBottom: design.spacing.lg,
          backgroundColor: design.colors.cardBg,
          borderRadius: design.spacing.sm,
          padding: design.spacing.xs,
          border: `1px solid ${design.colors.borderPrimary}`,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <button
            onClick={() => setActiveTab('discussions')}
            style={{
              flex: 1,
              padding: `${design.spacing.md} ${design.spacing.lg}`,
              borderRadius: design.spacing.sm,
              fontFamily: design.typography.fontFamily,
              fontWeight: design.typography.weights.medium,
              transition: 'all 0.2s ease-in-out',
              backgroundColor: activeTab === 'discussions' ? design.colors.primary + '20' : 'transparent',
              color: activeTab === 'discussions' ? design.colors.primary : design.colors.textSecondary,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: design.spacing.sm
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'discussions') {
                e.currentTarget.style.color = design.colors.textPrimary
                e.currentTarget.style.backgroundColor = design.colors.bgTertiary
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'discussions') {
                e.currentTarget.style.color = design.colors.textSecondary
                e.currentTarget.style.backgroundColor = 'transparent'
              }
            }}
          >
            <MessageCircle className="w-5 h-5" />
            Discussions
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            style={{
              flex: 1,
              padding: `${design.spacing.md} ${design.spacing.lg}`,
              borderRadius: design.spacing.sm,
              fontFamily: design.typography.fontFamily,
              fontWeight: design.typography.weights.medium,
              transition: 'all 0.2s ease-in-out',
              backgroundColor: activeTab === 'leaderboard' ? design.colors.primary + '20' : 'transparent',
              color: activeTab === 'leaderboard' ? design.colors.primary : design.colors.textSecondary,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: design.spacing.sm
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'leaderboard') {
                e.currentTarget.style.color = design.colors.textPrimary
                e.currentTarget.style.backgroundColor = design.colors.bgTertiary
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'leaderboard') {
                e.currentTarget.style.color = design.colors.textSecondary
                e.currentTarget.style.backgroundColor = 'transparent'
              }
            }}
          >
            <Trophy className="w-5 h-5" />
            Leaderboard
          </button>
          <button
            onClick={() => setActiveTab('events')}
            style={{
              flex: 1,
              padding: `${design.spacing.md} ${design.spacing.lg}`,
              borderRadius: design.spacing.sm,
              fontFamily: design.typography.fontFamily,
              fontWeight: design.typography.weights.medium,
              transition: 'all 0.2s ease-in-out',
              backgroundColor: activeTab === 'events' ? design.colors.primary + '20' : 'transparent',
              color: activeTab === 'events' ? design.colors.primary : design.colors.textSecondary,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: design.spacing.sm
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'events') {
                e.currentTarget.style.color = design.colors.textPrimary
                e.currentTarget.style.backgroundColor = design.colors.bgTertiary
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'events') {
                e.currentTarget.style.color = design.colors.textSecondary
                e.currentTarget.style.backgroundColor = 'transparent'
              }
            }}
          >
            <Bell className="w-5 h-5" />
            Events
          </button>
        </div>

        {/* Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
          gap: design.spacing.lg,
          '@media (min-width: 1024px)': { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }
        }}>
          {/* Main Content */}
          <div style={{ gridColumn: 'span 2' }}>
            {activeTab === 'discussions' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: design.spacing.lg }}>
                {/* Recent Discussions */}
                <div>
                  <h2 style={{
                    ...design.text('heading'),
                    fontSize: design.typography.sizes['2xl'],
                    fontWeight: design.typography.weights.semibold,
                    marginBottom: design.spacing.lg,
                    color: design.colors.textPrimary
                  }}>
                    Recent Discussions
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: design.spacing.md }}>
                    {posts.map((post) => (
                      <CoronaCard key={post.id} style={{ padding: design.spacing.lg }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          marginBottom: design.spacing.md
                        }}>
                          <div style={{ flex: 1 }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: design.spacing.sm,
                              marginBottom: design.spacing.sm
                            }}>
                              <h3 style={{
                                ...design.text('heading'),
                                fontSize: design.typography.sizes.lg,
                                fontWeight: design.typography.weights.semibold,
                                color: design.colors.textPrimary,
                                cursor: 'pointer',
                                transition: 'color 0.2s ease-in-out'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = design.colors.primary
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = design.colors.textPrimary
                              }}
                              >
                                {post.title}
                              </h3>
                              {post.is_pinned && (
                                <CoronaBadge variant="warning" size="sm">
                                  📌 Pinned
                                </CoronaBadge>
                              )}
                              {post.is_featured && (
                                <CoronaBadge variant="success" size="sm">
                                  ⭐ Featured
                                </CoronaBadge>
                              )}
                            </div>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: design.spacing.md,
                              fontSize: design.typography.sizes.sm,
                              color: design.colors.textSecondary,
                              marginBottom: design.spacing.sm
                            }}>
                              <span style={{ display: 'flex', alignItems: 'center' }}>
                                <Users className="w-4 h-4" style={{ marginRight: design.spacing.xs, color: design.colors.textSecondary }} />
                                {post.author.username}
                              </span>
                              <span style={{ display: 'flex', alignItems: 'center' }}>
                                <span 
                                  style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    marginRight: design.spacing.sm,
                                    backgroundColor: post.category.color
                                  }}
                                ></span>
                                {post.category.name}
                              </span>
                              <CoronaBadge 
                                variant={getPostTypeColor(post.post_type)}
                                size="sm"
                              >
                                {getPostTypeLabel(post.post_type)}
                              </CoronaBadge>
                            </div>
                            <p style={{
                              ...design.text('body'),
                              color: design.colors.textSecondary,
                              marginBottom: design.spacing.md,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>
                              {post.content}
                            </p>
                          </div>
                        </div>
                        
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: design.spacing.lg,
                            fontSize: design.typography.sizes.sm,
                            color: design.colors.textSecondary
                          }}>
                            <span style={{ display: 'flex', alignItems: 'center' }}>
                              <Eye className="w-4 h-4" style={{ marginRight: design.spacing.xs, color: design.colors.textSecondary }} />
                              {post.view_count.toLocaleString()}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center' }}>
                              <Reply className="w-4 h-4" style={{ marginRight: design.spacing.xs, color: design.colors.textSecondary }} />
                              {post.reply_count}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center' }}>
                              <Heart className="w-4 h-4" style={{ marginRight: design.spacing.xs, color: design.colors.textSecondary }} />
                              {post.like_count}
                            </span>
                          </div>
                          <span style={{
                            fontSize: design.typography.sizes.sm,
                            color: design.colors.textMuted
                          }}>
                            {getTimeAgo(post.last_activity_at)}
                          </span>
                        </div>
                      </CoronaCard>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'leaderboard' && (
              <div>
                <h2 style={{
                  ...design.text('heading'),
                  fontSize: design.typography.sizes['2xl'],
                  fontWeight: design.typography.weights.semibold,
                  marginBottom: design.spacing.lg,
                  color: design.colors.textPrimary
                }}>
                  🏆 Top Contributors
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: design.spacing.md }}>
                  {leaderboard.map((user, index) => (
                    <CoronaCard key={user.user_id} style={{ padding: design.spacing.lg }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: design.spacing.md
                      }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: design.colors.white,
                          fontWeight: design.typography.weights.bold,
                          backgroundColor: index === 0 ? design.colors.warning : 
                                         index === 1 ? design.colors.secondary : 
                                         index === 2 ? '#CD7F32' : design.colors.bgTertiary
                        }}>
                          {index + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: design.spacing.sm,
                            marginBottom: design.spacing.xs
                          }}>
                            <h3 style={{
                              ...design.text('heading'),
                              fontWeight: design.typography.weights.semibold,
                              color: design.colors.textPrimary
                            }}>
                              {user.username}
                            </h3>
                            <CoronaBadge variant="primary" size="sm">
                              {user.reputation_points.toLocaleString()} pts
                            </CoronaBadge>
                          </div>
                          <div style={{
                            fontSize: design.typography.sizes.sm,
                            color: design.colors.textSecondary
                          }}>
                            {user.agents_created} agents • {user.agents_sold.toLocaleString()} sales • {user.posts_created} posts
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{
                            ...design.text('heading'),
                            fontSize: design.typography.sizes['2xl'],
                            fontWeight: design.typography.weights.bold,
                            color: design.colors.textPrimary
                          }}>
                            #{user.rank_position}
                          </div>
                        </div>
                      </div>
                    </CoronaCard>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'events' && (
              <div>
                <h2 style={{
                  ...design.text('heading'),
                  fontSize: design.typography.sizes['2xl'],
                  fontWeight: design.typography.weights.semibold,
                  marginBottom: design.spacing.lg,
                  color: design.colors.textPrimary
                }}>
                  Community Events
                </h2>
                <div style={{
                  textAlign: 'center',
                  padding: `${design.spacing.xl} 0`
                }}>
                  <Bell className="w-16 h-16 mx-auto mb-4" style={{ color: design.colors.textMuted }} />
                  <h3 style={{
                    ...design.text('heading'),
                    fontSize: design.typography.sizes.lg,
                    fontWeight: design.typography.weights.medium,
                    marginBottom: design.spacing.sm,
                    color: design.colors.textPrimary
                  }}>
                    No events scheduled
                  </h3>
                  <p style={{
                    ...design.text('body'),
                    color: design.colors.textSecondary
                  }}>
                    Check back later for upcoming community events!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: design.spacing.lg }}>
            {/* Quick Stats */}
            <CoronaCard style={{ padding: design.spacing.lg }}>
              <h3 style={{
                ...design.text('heading'),
                fontSize: design.typography.sizes.lg,
                fontWeight: design.typography.weights.semibold,
                marginBottom: design.spacing.md,
                color: design.colors.textPrimary
              }}>
                Community Stats
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: design.spacing.sm }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: design.colors.textSecondary }}>Total Posts</span>
                  <span style={{ fontWeight: design.typography.weights.semibold, color: design.colors.textPrimary }}>1,234</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: design.colors.textSecondary }}>Active Users</span>
                  <span style={{ fontWeight: design.typography.weights.semibold, color: design.colors.textPrimary }}>567</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: design.colors.textSecondary }}>Agents Created</span>
                  <span style={{ fontWeight: design.typography.weights.semibold, color: design.colors.textPrimary }}>89</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: design.colors.textSecondary }}>Workflows Shared</span>
                  <span style={{ fontWeight: design.typography.weights.semibold, color: design.colors.textPrimary }}>234</span>
                </div>
              </div>
            </CoronaCard>

            {/* Quick Actions */}
            <CoronaCard style={{ padding: design.spacing.lg }}>
              <h3 style={{
                ...design.text('heading'),
                fontSize: design.typography.sizes.lg,
                fontWeight: design.typography.weights.semibold,
                marginBottom: design.spacing.md,
                color: design.colors.textPrimary
              }}>
                Quick Actions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: design.spacing.sm }}>
                <CoronaButton variant="primary" style={{ width: '100%' }}>
                  <MessageCircle className="w-4 h-4" style={{ marginRight: design.spacing.sm }} />
                  Start Discussion
                </CoronaButton>
                <CoronaButton variant="outline-primary" style={{ width: '100%' }}>
                  <TrendingUp className="w-4 h-4" style={{ marginRight: design.spacing.sm }} />
                  Browse Agents
                </CoronaButton>
                <CoronaButton variant="outline-primary" style={{ width: '100%' }}>
                  <Star className="w-4 h-4" style={{ marginRight: design.spacing.sm }} />
                  Share Workflow
                </CoronaButton>
              </div>
            </CoronaCard>

            {/* Recent Activity */}
            <CoronaCard style={{ padding: design.spacing.lg }}>
              <h3 style={{
                ...design.text('heading'),
                fontSize: design.typography.sizes.lg,
                fontWeight: design.typography.weights.semibold,
                marginBottom: design.spacing.md,
                color: design.colors.textPrimary
              }}>
                Recent Activity
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: design.spacing.sm }}>
                <div style={{ fontSize: design.typography.sizes.sm }}>
                  <span style={{ color: design.colors.textSecondary }}>Sarah Chen</span> created a new tutorial
                  <div style={{ fontSize: design.typography.sizes.xs, color: design.colors.textMuted, marginTop: design.spacing.xs }}>2 hours ago</div>
                </div>
                <div style={{ fontSize: design.typography.sizes.sm }}>
                  <span style={{ color: design.colors.textSecondary }}>Mike Johnson</span> asked a question
                  <div style={{ fontSize: design.typography.sizes.xs, color: design.colors.textMuted, marginTop: design.spacing.xs }}>4 hours ago</div>
                </div>
                <div style={{ fontSize: design.typography.sizes.sm }}>
                  <span style={{ color: design.colors.textSecondary }}>Alex Thompson</span> shared a workflow
                  <div style={{ fontSize: design.typography.sizes.xs, color: design.colors.textMuted, marginTop: design.spacing.xs }}>6 hours ago</div>
                </div>
              </div>
            </CoronaCard>
          </div>
        </div>
      </div>
    </div>
  )
}
