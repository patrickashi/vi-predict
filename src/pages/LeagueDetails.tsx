import React from 'react'
import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout/Layout'
import { Shield, Trophy, TrendingUp, TrendingDown, Users, Calendar, Award, Target, ArrowLeft, Crown, Medal, Star, UserCheck, UserX, Clock } from 'lucide-react'

export function LeagueDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pendingRequests, setPendingRequests] = useState([
    { id: '1', username: 'john_doe', email: 'john@example.com', requestedAt: '2025-01-20T10:30:00Z', avatar: '👨‍💼' },
    { id: '2', username: 'sarah_smith', email: 'sarah@example.com', requestedAt: '2025-01-20T09:15:00Z', avatar: '👩‍💻' },
    { id: '3', username: 'mike_wilson', email: 'mike@example.com', requestedAt: '2025-01-19T16:45:00Z', avatar: '👨‍🎓' },
  ])
  
  // Mock league data based on ID
  const getLeagueData = (leagueId: string) => {
    const leagues = {
      'gp-team': {
        name: 'GP Team',
        type: 'Private',
        description: 'Elite prediction league for GP Team members',
        members: 25,
        maxMembers: 50,
        createdBy: 'Alex Rakeem',
        createdAt: '2024-08-15',
        inviteCode: 'GP2024',
        currentGameweek: 20,
        totalGameweeks: 38,
        prize: '$500 Winner Takes All',
        isAdmin: true, // Current user is the admin
        leaderboard: [
          { rank: 1, name: 'Marcus Johnson', team: 'MJ United', points: 1450, recentPoints: 85, trend: 'up', avatar: '👨‍💼', badge: 'crown' },
          { rank: 2, name: 'Sarah Williams', team: 'SW Predictions', points: 1420, recentPoints: 78, trend: 'up', avatar: '👩‍💻', badge: 'medal' },
          { rank: 3, name: 'David Chen', team: 'Chen FC', points: 1395, recentPoints: 82, trend: 'same', avatar: '👨‍🎓', badge: 'medal' },
          { rank: 4, name: 'Emma Davis', team: 'Davis Dynasty', points: 1380, recentPoints: 75, trend: 'down', avatar: '👩‍🔬', badge: 'star' },
          { rank: 5, name: 'James Wilson', team: 'Wilson Warriors', points: 1365, recentPoints: 88, trend: 'up', avatar: '👨‍🚀', badge: 'star' },
          { rank: 6, name: 'Lisa Anderson', team: 'Anderson FC', points: 1340, recentPoints: 72, trend: 'down', avatar: '👩‍🎨', badge: null },
          { rank: 7, name: 'Michael Brown', team: 'Brown Bulls', points: 1325, recentPoints: 79, trend: 'up', avatar: '👨‍🏫', badge: null },
          { rank: 8, name: 'Jennifer Taylor', team: 'Taylor Titans', points: 1310, recentPoints: 71, trend: 'down', avatar: '👩‍⚕️', badge: null },
          { rank: 9, name: 'Robert Miller', team: 'Miller Magic', points: 1295, recentPoints: 83, trend: 'up', avatar: '👨‍💼', badge: null },
          { rank: 10, name: 'Amanda Garcia', team: 'Garcia Giants', points: 1280, recentPoints: 76, trend: 'same', avatar: '👩‍🎤', badge: null },
          { rank: 11, name: 'Chris Martinez', team: 'Martinez Marvels', points: 1265, recentPoints: 74, trend: 'down', avatar: '👨‍🎨', badge: null },
          { rank: 12, name: 'Alex Rakeem', team: 'Rakeem Rangers', points: 1250, recentPoints: 80, trend: 'up', avatar: '👨‍💻', badge: null, isCurrentUser: true },
        ]
      },
      'dc-warriors': {
        name: "Dc's Warriors",
        type: 'Public',
        description: 'Open league for all football prediction enthusiasts',
        members: 156,
        maxMembers: 200,
        createdBy: 'DC Master',
        createdAt: '2024-07-20',
        inviteCode: null,
        currentGameweek: 20,
        totalGameweeks: 38,
        prize: 'Glory and Bragging Rights',
        isAdmin: false, // Current user is not the admin
        leaderboard: [
          { rank: 1, name: 'Prediction King', team: 'Royal Predictions', points: 1580, recentPoints: 92, trend: 'up', avatar: '👑', badge: 'crown' },
          { rank: 2, name: 'Football Sage', team: 'Sage Selections', points: 1565, recentPoints: 89, trend: 'up', avatar: '🧙‍♂️', badge: 'medal' },
          { rank: 3, name: 'Goal Prophet', team: 'Prophet FC', points: 1540, recentPoints: 85, trend: 'same', avatar: '🔮', badge: 'medal' },
          { rank: 4, name: 'Score Master', team: 'Master Class', points: 1520, recentPoints: 87, trend: 'up', avatar: '🎯', badge: 'star' },
          { rank: 5, name: 'Match Wizard', team: 'Wizard United', points: 1505, recentPoints: 83, trend: 'down', avatar: '🧙‍♀️', badge: 'star' },
          // ... more entries
          { rank: 110, name: 'Alex Rakeem', team: 'Rakeem Rangers', points: 890, recentPoints: 65, trend: 'up', avatar: '👨‍💻', badge: null, isCurrentUser: true },
        ]
      }
    }
    
    return leagues[leagueId as keyof typeof leagues] || leagues['gp-team']
  }

  const league = getLeagueData(id || 'gp-team')

  const handlePlayerClick = (playerName: string) => {
    // Convert player name to URL-friendly format
    const playerId = playerName.toLowerCase().replace(/\s+/g, '-')
    navigate(`/leagues/${id}/player/${playerId}`)
  }

  const handleApproveRequest = (requestId: string) => {
    setPendingRequests(prev => prev.filter(req => req.id !== requestId))
    // In a real app, this would make an API call to approve the request
    alert('Request approved! User has been added to the league.')
  }

  const handleRejectRequest = (requestId: string) => {
    setPendingRequests(prev => prev.filter(req => req.id !== requestId))
    // In a real app, this would make an API call to reject the request
    alert('Request rejected.')
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />
      default:
        return <div className="w-4 h-4 flex items-center justify-center text-secondary-400">—</div>
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-400'
      case 'down':
        return 'text-red-400'
      default:
        return 'text-secondary-400'
    }
  }

  const getBadgeIcon = (badge: string | null) => {
    switch (badge) {
      case 'crown':
        return <Crown className="w-5 h-5 text-yellow-400" />
      case 'medal':
        return <Medal className="w-5 h-5 text-gray-400" />
      case 'star':
        return <Star className="w-5 h-5 text-orange-400" />
      default:
        return null
    }
  }

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/30'
    if (rank === 2) return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30'
    if (rank === 3) return 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 border-orange-500/30'
    if (rank <= 5) return 'bg-gradient-to-r from-primary-500/10 to-primary-600/10 border-primary-500/20'
    return 'bg-secondary-800/50 border-secondary-700'
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Back Button */}
        <div>
          <Link 
            to="/leagues" 
            className="inline-flex items-center space-x-2 text-secondary-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Leagues</span>
          </Link>
        </div>

        {/* League Header */}
        <div className="glass-card p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-primary-600/20 rounded-xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary-400" />
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-white">{league.name}</h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    league.type === 'Private' 
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                      : 'bg-green-500/20 text-green-400 border border-green-500/30'
                  }`}>
                    {league.type}
                  </span>
                </div>
                <p className="text-secondary-300 mb-3">{league.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-400">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{league.members} members</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Created {new Date(league.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Trophy className="w-4 h-4" />
                    <span>GW {league.currentGameweek}/{league.totalGameweeks}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-3">
              {league.inviteCode && (
                <div className="bg-secondary-800/50 rounded-lg p-4 text-center">
                  <p className="text-secondary-400 text-sm mb-1">Invite Code</p>
                  <p className="text-white font-mono text-lg">{league.inviteCode}</p>
                </div>
              )}
              <div className="bg-primary-600/10 rounded-lg p-4 text-center border border-primary-500/20">
                <p className="text-primary-400 text-sm mb-1">Prize Pool</p>
                <p className="text-white font-semibold">{league.prize}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Section - Pending Join Requests */}
        {league.isAdmin && league.type === 'Private' && (
          <div className="glass-card p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <UserCheck className="w-6 h-6 text-primary-400" />
                <h2 className="text-2xl font-bold text-white">Pending Join Requests</h2>
                {pendingRequests.length > 0 && (
                  <span className="bg-primary-600/20 text-primary-400 px-3 py-1 rounded-full text-sm font-medium border border-primary-500/30">
                    {pendingRequests.length} pending
                  </span>
                )}
              </div>
            </div>
            
            {pendingRequests.length > 0 ? (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="bg-secondary-800/50 rounded-xl p-6 border border-secondary-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">{request.avatar}</div>
                        <div>
                          <div className="text-white font-bold text-lg">{request.username}</div>
                          <div className="text-secondary-400 text-sm">{request.email}</div>
                          <div className="flex items-center space-x-2 mt-1">
                            <Clock className="w-4 h-4 text-secondary-500" />
                            <span className="text-secondary-500 text-xs">
                              Requested {formatTimeAgo(request.requestedAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleApproveRequest(request.id)}
                          className="flex items-center space-x-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 px-4 py-2 rounded-lg font-medium transition-colors border border-green-500/30"
                        >
                          <UserCheck className="w-4 h-4" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.id)}
                          className="flex items-center space-x-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 px-4 py-2 rounded-lg font-medium transition-colors border border-red-500/30"
                        >
                          <UserX className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-secondary-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCheck className="w-8 h-8 text-secondary-400" />
                </div>
                <h4 className="text-white font-medium mb-2">No pending requests</h4>
                <p className="text-secondary-400 text-sm">
                  All join requests have been processed. New requests will appear here.
                </p>
              </div>
            )}
          </div>
        )}

        {/* League Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-card p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Users className="w-6 h-6 text-primary-400" />
              <span className="text-2xl font-bold text-white">{league.members}</span>
            </div>
            <p className="text-secondary-400 text-sm">Total Members</p>
          </div>
          
          <div className="glass-card p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Target className="w-6 h-6 text-green-400" />
              <span className="text-2xl font-bold text-white">{league.currentGameweek}</span>
            </div>
            <p className="text-secondary-400 text-sm">Current Gameweek</p>
          </div>
          
          <div className="glass-card p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Award className="w-6 h-6 text-yellow-400" />
              <span className="text-2xl font-bold text-white">{league.leaderboard[0]?.points || 0}</span>
            </div>
            <p className="text-secondary-400 text-sm">Leading Score</p>
          </div>
          
          <div className="glass-card p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Trophy className="w-6 h-6 text-primary-400" />
              <span className="text-2xl font-bold text-white">{Math.round((league.currentGameweek / league.totalGameweeks) * 100)}%</span>
            </div>
            <p className="text-secondary-400 text-sm">Season Progress</p>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="glass-card p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">League Leaderboard</h2>
            <div className="flex items-center space-x-2 text-sm text-secondary-400">
              <Trophy className="w-4 h-4" />
              <span>Updated after GW {league.currentGameweek}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            {league.leaderboard.map((member, index) => (
              <button 
                key={index} 
                onClick={() => handlePlayerClick(member.name)}
                className={`w-full rounded-xl p-6 border-2 transition-all duration-200 hover:scale-[1.02] cursor-pointer ${
                  member.isCurrentUser 
                    ? 'bg-primary-600/10 border-primary-500/30 ring-2 ring-primary-500/20' 
                    : getRankStyle(member.rank)
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Rank and Badge */}
                    <div className="flex items-center space-x-2">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                        member.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                        member.rank === 2 ? 'bg-gray-400/20 text-gray-400' :
                        member.rank === 3 ? 'bg-orange-500/20 text-orange-400' :
                        'bg-secondary-700 text-white'
                      }`}>
                        {member.rank}
                      </div>
                      {getBadgeIcon(member.badge)}
                    </div>
                    
                    {/* Avatar and Info */}
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className="text-3xl">{member.avatar}</div>
                      <div className="min-w-0 flex-1">
                        <div className={`font-bold text-lg truncate ${
                          member.isCurrentUser ? 'text-primary-400' : 'text-white'
                        }`}>
                          {member.name} {member.isCurrentUser && '(You)'}
                        </div>
                        <div className="text-secondary-400 text-sm truncate">{member.team}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-white font-bold text-lg">{member.recentPoints}</div>
                      <div className="text-secondary-400 text-xs">Recent</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-white font-bold text-xl">{member.points}</div>
                      <div className="text-secondary-400 text-xs">Total</div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(member.trend)}
                      <span className={`text-sm font-medium ${getTrendColor(member.trend)}`}>
                        {member.trend === 'up' ? '+' : member.trend === 'down' ? '-' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* View All Members Button */}
        <div className="text-center">
          <Link
            to={`/leagues/${id}/players`}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <span>View All Members</span>
            <span>({league.members})</span>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-secondary-800/50 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-white">
                  <span className="font-semibold">Marcus Johnson</span> moved to #1 position
                </p>
                <p className="text-secondary-400 text-sm">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-secondary-800/50 rounded-lg">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-white">
                  <span className="font-semibold">New member</span> Jennifer Taylor joined the league
                </p>
                <p className="text-secondary-400 text-sm">1 day ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-secondary-800/50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-white">
                  <span className="font-semibold">Gameweek 20</span> predictions deadline passed
                </p>
                <p className="text-secondary-400 text-sm">3 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}