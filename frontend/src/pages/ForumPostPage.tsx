import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Heart, Reply, Share2, Flag, MoreHorizontal, 
  Eye, MessageCircle, Clock, User, ThumbsUp, ThumbsDown 
} from 'lucide-react'
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
  updated_at: string
  tags: string[]
}

interface ForumComment {
  id: string
  content: string
  author: {
    username: string
    full_name?: string
    avatar_url?: string
  }
  like_count: number
  is_solution: boolean
  created_at: string
  updated_at: string
  replies?: ForumComment[]
}

export const ForumPostPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>()
  const navigate = useNavigate()
  const [post, setPost] = useState<ForumPost | null>(null)
  const [comments, setComments] = useState<ForumComment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    // Mock data - replace with actual API call
    setPost({
      id: postId || '1',
      title: 'Best practices for chaining multiple AI agents',
      content: `I've been working on complex workflows and wanted to share some insights about chaining multiple AI agents effectively.

## Key Principles

1. **Clear Input/Output Contracts**: Each agent should have well-defined input and output schemas. This makes it easier to chain them together and debug issues.

2. **Error Handling**: Always implement proper error handling between agents. If one agent fails, the entire workflow shouldn't crash.

3. **State Management**: Use a centralized state management system to pass data between agents. This makes debugging much easier.

4. **Testing**: Test each agent individually before chaining them together. This helps isolate issues.

## Common Patterns

### Sequential Processing
When you need to process data in a specific order:
\`\`\`python
# Agent 1: Data validation
# Agent 2: Data transformation  
# Agent 3: Data analysis
\`\`\`

### Parallel Processing
When you can process multiple streams simultaneously:
\`\`\`python
# Agent 1 & 2: Process different data streams
# Agent 3: Combine results
\`\`\`

### Conditional Processing
When you need different processing paths based on data:
\`\`\`python
# Agent 1: Data classification
# Agent 2A or 2B: Different processing based on classification
\`\`\`

## Tools I Recommend

- **AgentFlow**: Great for visual workflow design
- **LangChain**: Excellent for LLM-based agents
- **CrewAI**: Good for multi-agent coordination

What patterns have you found most effective? I'd love to hear your experiences!`,
      author: {
        username: 'Sarah Chen',
        full_name: 'Sarah Chen',
        avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
      },
      category: {
        name: 'Tutorials',
        color: '#f093fb',
        icon: '📚'
      },
      post_type: 'tutorial',
      view_count: 1200,
      reply_count: 34,
      like_count: 89,
      is_pinned: false,
      is_featured: true,
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T14:30:00Z',
      tags: ['ai-agents', 'workflow', 'best-practices', 'tutorial']
    })

    setComments([
      {
        id: '1',
        content: 'Great post! I\'ve been using similar patterns in my projects. One thing I\'d add is to always log the intermediate results between agents for debugging.',
        author: {
          username: 'Alex Thompson',
          full_name: 'Alex Thompson',
          avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
        },
        like_count: 12,
        is_solution: false,
        created_at: '2024-01-15T11:00:00Z',
        updated_at: '2024-01-15T11:00:00Z'
      },
      {
        id: '2',
        content: 'Thanks for sharing! I\'m curious about error handling - do you have any specific strategies for handling partial failures in parallel processing?',
        author: {
          username: 'Mike Johnson',
          full_name: 'Mike Johnson',
          avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
        },
        like_count: 5,
        is_solution: false,
        created_at: '2024-01-15T12:15:00Z',
        updated_at: '2024-01-15T12:15:00Z'
      },
      {
        id: '3',
        content: 'For parallel processing error handling, I use a circuit breaker pattern. If one agent fails, I continue with the others and collect partial results. Then I have a final agent that decides whether to proceed with partial data or retry.',
        author: {
          username: 'Sarah Chen',
          full_name: 'Sarah Chen',
          avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
        },
        like_count: 18,
        is_solution: true,
        created_at: '2024-01-15T13:30:00Z',
        updated_at: '2024-01-15T13:30:00Z'
      }
    ])

    setLoading(false)
  }, [postId])

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

  const handleLike = () => {
    setLiked(!liked)
    // TODO: Implement actual like functionality
  }

  const handleComment = () => {
    if (newComment.trim()) {
      // TODO: Implement actual comment submission
      setNewComment('')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-32 mb-6"></div>
            <div className="bg-white rounded-lg p-8 mb-6">
              <div className="h-8 bg-slate-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2 mb-6"></div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                <div className="h-4 bg-slate-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Post not found</h1>
          <p className="text-slate-600 mb-6">The post you're looking for doesn't exist or has been removed.</p>
          <AgentFlowButton onClick={() => navigate('/community')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Community
          </AgentFlowButton>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <AgentFlowButton
          variant="outline"
          onClick={() => navigate('/community')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Community
        </AgentFlowButton>

        {/* Post */}
        <AgentFlowCard className="p-8 mb-6">
          {/* Post Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-4">
                <h1 className="text-3xl font-bold text-slate-900">{post.title}</h1>
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
              
              <div className="flex items-center space-x-4 text-sm text-slate-600 mb-4">
                <div className="flex items-center">
                  <img
                    src={post.author.avatar_url || `https://ui-avatars.com/api/?name=${post.author.username}&background=667eea&color=fff`}
                    alt={post.author.username}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span className="font-medium">{post.author.username}</span>
                </div>
                <div className="flex items-center">
                  <span 
                    className="w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: post.category.color }}
                  ></span>
                  {post.category.name}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {getTimeAgo(post.created_at)}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <AgentFlowBadge key={tag} variant="secondary" size="sm">
                    #{tag}
                  </AgentFlowBadge>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <AgentFlowButton
                variant="outline"
                size="sm"
                onClick={handleLike}
                className={liked ? 'text-red-500 border-red-500' : ''}
              >
                <Heart className={`w-4 h-4 mr-1 ${liked ? 'fill-current' : ''}`} />
                {post.like_count}
              </AgentFlowButton>
              <AgentFlowButton variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </AgentFlowButton>
              <AgentFlowButton variant="outline" size="sm">
                <Flag className="w-4 h-4" />
              </AgentFlowButton>
            </div>
          </div>

          {/* Post Content */}
          <div className="prose prose-slate max-w-none mb-6">
            <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
              {post.content}
            </div>
          </div>

          {/* Post Stats */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-200">
            <div className="flex items-center space-x-6 text-sm text-slate-600">
              <span className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                {post.view_count.toLocaleString()} views
              </span>
              <span className="flex items-center">
                <MessageCircle className="w-4 h-4 mr-1" />
                {post.reply_count} replies
              </span>
              <span className="flex items-center">
                <Heart className="w-4 h-4 mr-1" />
                {post.like_count} likes
              </span>
            </div>
          </div>
        </AgentFlowCard>

        {/* Comments Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-900">
            Comments ({comments.length})
          </h2>

          {/* New Comment Form */}
          <AgentFlowCard className="p-6">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Add a comment</h3>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full h-32 p-4 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex justify-end mt-4">
              <AgentFlowButton onClick={handleComment} disabled={!newComment.trim()}>
                <Reply className="w-4 h-4 mr-2" />
                Post Comment
              </AgentFlowButton>
            </div>
          </AgentFlowCard>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <AgentFlowCard key={comment.id} className="p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={comment.author.avatar_url || `https://ui-avatars.com/api/?name=${comment.author.username}&background=667eea&color=fff`}
                    alt={comment.author.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-slate-900">{comment.author.username}</span>
                      {comment.is_solution && (
                        <AgentFlowBadge variant="success" size="sm">
                          ✓ Solution
                        </AgentFlowBadge>
                      )}
                      <span className="text-sm text-slate-500">
                        {getTimeAgo(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-slate-700 mb-4 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center text-sm text-slate-600 hover:text-slate-900">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        {comment.like_count}
                      </button>
                      <button className="flex items-center text-sm text-slate-600 hover:text-slate-900">
                        <ThumbsDown className="w-4 h-4 mr-1" />
                      </button>
                      <button className="text-sm text-slate-600 hover:text-slate-900">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </AgentFlowCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

