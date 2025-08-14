import React from 'react'
import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout/Layout'
import { ArrowLeft, Search, Trophy, TrendingUp, TrendingDown, Crown, Medal, Star, ChevronLeft, ChevronRight } from 'lucide-react'

export function LeaguePlayers() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const playersPerPage = 20

  // Mock league data
  const getLeagueInfo = (leagueId: string) => {
    const leagues = {
      'gp-team': { name: 'GP Team', type: 'Private' },
      'dc-warriors': { name: "Dc's Warriors", type: 'Public' },
      'invincibles': { name: 'Invincibles', type: 'Private' },
      'arsenal-club-league': { name: 'Arsenal Club League', type: 'Club' },
      'global-league': { name: 'Global League', type: 'Global' },
      'nigeria-country-league': { name: 'Nigeria Country League', type: 'Country' },
    }
    return leagues[leagueId as keyof typeof leagues] || { name: 'Unknown League', type: 'Unknown' }
  }

  // Generate mock players data
  const generatePlayers = () => {
    const firstNames = ['Alex', 'Sarah', 'David', 'Emma', 'James', 'Lisa', 'Michael', 'Jennifer', 'Robert', 'Amanda', 'Chris', 'Maria', 'John', 'Jessica', 'Daniel', 'Ashley', 'Matthew', 'Emily', 'Andrew', 'Michelle', 'Joshua', 'Stephanie', 'Ryan', 'Nicole', 'Brandon', 'Elizabeth', 'Tyler', 'Rebecca', 'Kevin', 'Rachel']
    const lastNames = ['Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker']
    const avatars = ['👨‍💼', '👩‍💻', '👨‍🎓', '👩‍🔬', '👨‍🚀', '👩‍🎨', '👨‍🏫', '👩‍⚕️', '👨‍💻', '👩‍🎤', '👨‍🎨', '👩‍🚀', '👨‍🔬', '👩‍🏫', '👨‍⚕️', '👩‍💼', '👨‍🎤', '👩‍🎓', '👨‍🎨', '👩‍💻']

    const players = []
    for (let i = 1; i <= 156; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
      const avatar = avatars[Math.floor(Math.random() * avatars.length)]
      const points = Math.floor(Math.random() * 800) + 800 // 800-1600 points
      const recentPoints = Math.floor(Math.random() * 50) + 40 // 40-90 recent points
      const trends = ['up', 'down', 'same']
      const trend = trends[Math.floor(Math.random() * trends.length)]
      
      let badge = null
      if (i === 1) badge = 'crown'
      else if (i <= 3) badge = 'medal'
      else if (i <= 10) badge = 'star'

      players.push({
        rank: i,
        name: `${firstName} ${lastName}`,
        team: `${firstName} FC`,
        points,
        recentPoints,
        trend,
        avatar,
        badge,
        isCurrentUser: i === 12, // Demo user at rank 12
        accuracy: Math.floor(Math.random() * 40) + 50, // 50-90% accuracy
        correctScores: Math.floor(Math.random() * 15) + 5, // 5-20 correct scores
        predictions: Math.floor(Math.random() * 50) + 80, // 80-130 predictions
      })
    }
    return players
  }

  const league = getLeagueInfo(id || 'gp-team')
  const allPlayers = generatePlayers()

  // Filter players based on search query
  const filteredPlayers = allPlayers.filter(player =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    player.team.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Pagination
  const totalPages = Math.ceil(filteredPlayers.length / playersPerPage)
  const startIndex = (currentPage - 1) * playersPerPage
  const endIndex = startIndex + playersPerPage
  const currentPlayers = filteredPlayers.slice(startIndex, endIndex)

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
    if (rank <= 10) return 'bg-gradient-to-r from-primary-500/10 to-primary-600/10 border-primary-500/20'
    return 'bg-secondary-800/50 border-secondary-700'
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderPaginationButtons = () => {
    const buttons = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg border border-secondary-700 text-secondary-300 hover:text-white hover:bg-secondary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
    )

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            currentPage === i
              ? 'bg-primary-600 border-primary-600 text-white'
              : 'border-secondary-700 text-secondary-300 hover:text-white hover:bg-secondary-800'
          }`}
        >
          {i}
        </button>
      )
    }

    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg border border-secondary-700 text-secondary-300 hover:text-white hover:bg-secondary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    )

    return buttons
  }

  const handlePlayerClick = (playerName: string) => {
    // Convert player name to URL-friendly format
    const playerId = playerName.toLowerCase().replace(/\s+/g, '-')
    navigate(`/leagues/${id}/player/${playerId}`)
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Back Button */}
        <div>
          <Link 
            to={`/leagues/${id}`}
            className="inline-flex items-center space-x-2 text-secondary-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to {league.name}</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">{league.name} - All Members</h1>
          <p className="text-secondary-400">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredPlayers.length)} of {filteredPlayers.length} members
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search players..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1) // Reset to first page when searching
              }}
              className="input-field w-full pl-12"
            />
          </div>
        </div>

        {/* Players List */}
        <div className="glass-card p-8">
          <div className="space-y-3">
            {currentPlayers.map((player, index) => (
              <button 
                key={index} 
                onClick={() => handlePlayerClick(player.name)}
                className={`w-full rounded-xl p-6 border-2 transition-all duration-200 hover:scale-[1.01] cursor-pointer ${
                  player.isCurrentUser 
                    ? 'bg-primary-600/10 border-primary-500/30 ring-2 ring-primary-500/20' 
                    : getRankStyle(player.rank)
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Rank and Badge */}
                    <div className="flex items-center space-x-2">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                        player.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                        player.rank === 2 ? 'bg-gray-400/20 text-gray-400' :
                        player.rank === 3 ? 'bg-orange-500/20 text-orange-400' :
                        'bg-secondary-700 text-white'
                      }`}>
                        {player.rank}
                      </div>
                      {getBadgeIcon(player.badge)}
                    </div>
                    
                    {/* Avatar and Info */}
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className="text-3xl">{player.avatar}</div>
                      <div className="min-w-0 flex-1">
                        <div className={`font-bold text-lg truncate ${
                          player.isCurrentUser ? 'text-primary-400' : 'text-white'
                        }`}>
                          {player.name} {player.isCurrentUser && '(You)'}
                        </div>
                        <div className="text-secondary-400 text-sm truncate">{player.team}</div>
                        <div className="flex items-center space-x-4 text-xs text-secondary-500 mt-1">
                          <span>{player.accuracy}% accuracy</span>
                          <span>{player.correctScores} exact scores</span>
                          <span>{player.predictions} predictions</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-white font-bold text-lg">{player.recentPoints}</div>
                      <div className="text-secondary-400 text-xs">Recent</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-white font-bold text-xl">{player.points}</div>
                      <div className="text-secondary-400 text-xs">Total</div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(player.trend)}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center space-x-2">
              {renderPaginationButtons()}
            </div>
          )}

          {/* No results */}
          {filteredPlayers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-secondary-400 text-lg mb-2">No players found</div>
              <p className="text-secondary-500">Try adjusting your search query</p>
            </div>
          )}
        </div>

        {/* League Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-card p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Trophy className="w-6 h-6 text-primary-400" />
              <span className="text-2xl font-bold text-white">{filteredPlayers.length}</span>
            </div>
            <p className="text-secondary-400 text-sm">Total Members</p>
          </div>
          
          <div className="glass-card p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Crown className="w-6 h-6 text-yellow-400" />
              <span className="text-2xl font-bold text-white">{filteredPlayers[0]?.points || 0}</span>
            </div>
            <p className="text-secondary-400 text-sm">Leading Score</p>
          </div>
          
          <div className="glass-card p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <span className="text-2xl font-bold text-white">
                {Math.round(filteredPlayers.reduce((acc, p) => acc + p.accuracy, 0) / filteredPlayers.length) || 0}%
              </span>
            </div>
            <p className="text-secondary-400 text-sm">Avg Accuracy</p>
          </div>
          
          <div className="glass-card p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Medal className="w-6 h-6 text-orange-400" />
              <span className="text-2xl font-bold text-white">
                {Math.round(filteredPlayers.reduce((acc, p) => acc + p.correctScores, 0) / filteredPlayers.length) || 0}
              </span>
            </div>
            <p className="text-secondary-400 text-sm">Avg Exact Scores</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}