import React from 'react'
import { AgentFlowCard } from '../components/ui/AgentFlowCard'
import { AgentFlowButton } from '../components/ui/AgentFlowButton'
import { AgentFlowBadge } from '../components/ui/AgentFlowBadge'
import { MessageCircle, Users, Zap, TrendingUp } from 'lucide-react'

export const TestCommunityPage: React.FC = () => {
  console.log('TestCommunityPage is rendering!')
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            🎉 Community Test Page 🎉
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            If you can see this, the routing is working!
          </p>
          <AgentFlowBadge variant="success" size="lg">
            ✅ Success! Community components are accessible
          </AgentFlowBadge>
        </div>

        {/* Test Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <AgentFlowCard className="text-center">
            <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Community Forum</h3>
            <p className="text-slate-600 mb-4">Connect with other users and share knowledge</p>
            <AgentFlowButton variant="primary" size="sm">
              View Forum
            </AgentFlowButton>
          </AgentFlowCard>

          <AgentFlowCard className="text-center">
            <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Leaderboard</h3>
            <p className="text-slate-600 mb-4">See top contributors and active members</p>
            <AgentFlowButton variant="success" size="sm">
              View Rankings
            </AgentFlowButton>
          </AgentFlowCard>

          <AgentFlowCard className="text-center">
            <Zap className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Events</h3>
            <p className="text-slate-600 mb-4">Join community events and workshops</p>
            <AgentFlowButton variant="outline" size="sm">
              View Events
            </AgentFlowButton>
          </AgentFlowCard>
        </div>

        {/* Stats */}
        <AgentFlowCard className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <div className="text-center">
            <TrendingUp className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Community Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">1,234</div>
                <div className="text-slate-600">Total Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">567</div>
                <div className="text-slate-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">89</div>
                <div className="text-slate-600">Agents Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">234</div>
                <div className="text-slate-600">Workflows Shared</div>
              </div>
            </div>
          </div>
        </AgentFlowCard>
      </div>
    </div>
  )
}

