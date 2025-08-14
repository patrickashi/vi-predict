import React from 'react'
import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Trophy, Target, Award, TrendingUp, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react'
import { Layout } from '../components/Layout/Layout'

export function GameweeksHistory() {
  const { leagueId, playerId } = useParams()
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedGameweek, setExpandedGameweek] = useState<string | null>(null)
  const gameweeksPerPage = 10

  // Get player data based on playerId (similar to PlayerDashboard)
  const getPlayerData = (playerId?: string) => {
    if (!playerId) return null
    
    const players = {
      'marcus-johnson': { name: 'Marcus Johnson', team: 'MJ United', avatar: '👨‍💼' },
      'sarah-williams': { name: 'Sarah Williams', team: 'SW Predictions', avatar: '👩‍💻' },
      'david-chen': { name: 'David Chen', team: 'Chen FC', avatar: '👨‍🎓' },
      'emma-davis': { name: 'Emma Davis', team: 'Davis Dynasty', avatar: '👩‍🔬' },
      'james-wilson': { name: 'James Wilson', team: 'Wilson Warriors', avatar: '👨‍🚀' },
      'lisa-anderson': { name: 'Lisa Anderson', team: 'Anderson FC', avatar: '👩‍🎨' },
      'michael-brown': { name: 'Michael Brown', team: 'Brown Bulls', avatar: '👨‍🏫' },
      'jennifer-taylor': { name: 'Jennifer Taylor', team: 'Taylor Titans', avatar: '👩‍⚕️' },
      'robert-miller': { name: 'Robert Miller', team: 'Miller Magic', avatar: '👨‍💼' },
      'amanda-garcia': { name: 'Amanda Garcia', team: 'Garcia Giants', avatar: '👩‍🎤' },
      'chris-martinez': { name: 'Chris Martinez', team: 'Martinez Marvels', avatar: '👨‍🎨' },
      'alex-rakeem': { name: 'Alex Rakeem', team: 'Rakeem Rangers', avatar: '👨‍💻' },
    }
    
    return players[playerId as keyof typeof players]
  }

  // Get league name based on leagueId
  const getLeagueName = (leagueId?: string) => {
    if (!leagueId) return null
    
    const leagues = {
      'gp-team': 'GP Team',
      'dc-warriors': "Dc's Warriors",
      'invincibles': 'Invincibles',
      'arsenal-club-league': 'Arsenal Club League',
      'global-league': 'Global League',
      'nigeria-country-league': 'Nigeria Country League',
    }
    return leagues[leagueId as keyof typeof leagues]
  }

  const player = getPlayerData(playerId)
  const leagueName = getLeagueName(leagueId)
  const isPlayerSpecific = !!(leagueId && playerId && player)

  // Generate comprehensive gameweeks data (from GW 1 to current GW 20)
  const generateGameweeksData = () => {
    const teams = [
      'Arsenal', 'Chelsea', 'Liverpool', 'Man United', 'Man City', 'Tottenham',
      'Newcastle', 'Brighton', 'West Ham', 'Aston Villa', 'Crystal Palace',
      'Fulham', 'Brentford', 'Wolves', 'Everton', 'Burnley', 'Sheffield United',
      'Luton Town', 'Bournemouth', 'Nottingham Forest'
    ]

    const gameweeks = []
    for (let gw = 20; gw >= 1; gw--) { // Reverse order (most recent first)
      // Generate matches for this gameweek
      const matches = []
      const numMatches = 10
      
      for (let i = 0; i < numMatches; i++) {
        const homeTeam = teams[Math.floor(Math.random() * teams.length)]
        let awayTeam = teams[Math.floor(Math.random() * teams.length)]
        while (awayTeam === homeTeam) {
          awayTeam = teams[Math.floor(Math.random() * teams.length)]
        }
        
        const homeScore = Math.floor(Math.random() * 5)
        const awayScore = Math.floor(Math.random() * 4)
        const predictionHome = Math.floor(Math.random() * 4)
        const predictionAway = Math.floor(Math.random() * 4)
        
        // Determine result type
        let result = 'wrong'
        let matchPoints = 0
        
        if (homeScore === predictionHome && awayScore === predictionAway) {
          result = 'exact'
          matchPoints = 15
        } else {
          const actualResult = homeScore > awayScore ? 'home' : homeScore < awayScore ? 'away' : 'draw'
          const predictedResult = predictionHome > predictionAway ? 'home' : predictionHome < predictionAway ? 'away' : 'draw'
          
          if (actualResult === predictedResult) {
            result = 'correct'
            matchPoints = 10
          }
        }
        
        const isBanker = i === 0 && Math.random() > 0.7 // Occasionally make first match a banker
        if (isBanker && result !== 'wrong') {
          matchPoints *= 2 // Double points for banker
        }
        
        matches.push({
          homeTeam,
          awayTeam,
          homeScore,
          awayScore,
          predictionHome,
          predictionAway,
          banker: isBanker,
          points: matchPoints,
          result
        })
      }
      
      // Calculate summary stats from matches
      const totalPredictions = matches.length
      const correctPredictions = matches.filter(m => m.result === 'correct' || m.result === 'exact').length
      const correctScores = matches.filter(m => m.result === 'exact').length
      const accuracy = Math.round((correctPredictions / totalPredictions) * 100)
      const points = matches.reduce((sum, match) => sum + match.points, 0)
      
      gameweeks.push({
        gameWeek: `GW ${gw}`,
        totalPredictions,
        correctPredictions,
        correctScores,
        accuracy,
        points,
        date: new Date(2024, 7, 15 + (gw * 7)).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        status: gw === 20 ? 'current' : gw > 20 ? 'upcoming' : 'completed',
        rank: Math.floor(Math.random() * 50) + 1, // Random rank 1-50
        totalPlayers: 156,
        matches
      })
    }
    return gameweeks
  }

  const allGameweeks = generateGameweeksData()
  
  // Pagination
  const totalPages = Math.ceil(allGameweeks.length / gameweeksPerPage)
  const startIndex = (currentPage - 1) * gameweeksPerPage
  const endIndex = startIndex + gameweeksPerPage
  const currentGameweeks = allGameweeks.slice(startIndex, endIndex)

  // Calculate season totals
  const seasonStats = {
    totalPoints: allGameweeks.reduce((sum, gw) => sum + gw.points, 0),
    totalPredictions: allGameweeks.reduce((sum, gw) => sum + gw.totalPredictions, 0),
    totalCorrect: allGameweeks.reduce((sum, gw) => sum + gw.correctPredictions, 0),
    totalExactScores: allGameweeks.reduce((sum, gw) => sum + gw.correctScores, 0),
    averageAccuracy: Math.round(allGameweeks.reduce((sum, gw) => sum + gw.accuracy, 0) / allGameweeks.length),
    bestGameweek: allGameweeks.reduce((best, gw) => gw.points > best.points ? gw : best, allGameweeks[0]),
    worstGameweek: allGameweeks.reduce((worst, gw) => gw.points < worst.points ? gw : worst, allGameweeks[0])
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current':
        return 'bg-primary-600/20 text-primary-400 border-primary-500/30'
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'upcoming':
        return 'bg-secondary-600/20 text-secondary-400 border-secondary-500/30'
      default:
        return 'bg-secondary-600/20 text-secondary-400 border-secondary-500/30'
    }
  }

  const getResultColor = (result: string) => {
    switch (result) {
      case 'exact': return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400'
      case 'correct': return 'bg-green-500/20 border-green-500/30 text-green-400'
      case 'wrong': return 'bg-red-500/20 border-red-500/30 text-red-400'
      default: return 'bg-secondary-800/50 border-secondary-700 text-secondary-400'
    }
  }

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'exact': return '🎯'
      case 'correct': return '✅'
      case 'wrong': return '❌'
      default: return '⚪'
    }
  }

  const toggleGameweekExpansion = (gameweekId: string) => {
    setExpandedGameweek(expandedGameweek === gameweekId ? null : gameweekId)
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

  return (
    <Layout>
      <div className="space-y-8">
        {/* Back Button */}
        <div>
          {isPlayerSpecific ? (
            <Link 
              to={`/leagues/${leagueId}/player/${playerId}`}
              className="inline-flex items-center space-x-2 text-secondary-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to {player?.name}'s Dashboard</span>
            </Link>
          ) : (
            <Link 
              to="/dashboard"
              className="inline-flex items-center space-x-2 text-secondary-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
          )}
        </div>

        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            {isPlayerSpecific && player && (
              <div className="text-4xl">{player.avatar}</div>
            )}
            <Calendar className="w-8 h-8 text-primary-400" />
            <h1 className="text-4xl font-bold text-white">
              {isPlayerSpecific && player 
                ? `${player.name}'s Gameweeks History` 
                : 'Gameweeks History'
              }
            </h1>
          </div>
          <p className="text-secondary-400">
            {isPlayerSpecific && player && leagueName
              ? `${player.name}'s performance in ${leagueName} across all gameweeks`
              : 'Complete overview of your performance across all gameweeks'
            }
          </p>
        </div>

        {/* Season Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <span className="text-2xl font-bold text-white">{seasonStats.totalPoints}</span>
            </div>
            <p className="text-secondary-400 text-sm">Season Total Points</p>
          </div>
          
          <div className="glass-card p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Target className="w-6 h-6 text-green-400" />
              <span className="text-2xl font-bold text-white">{seasonStats.totalCorrect}</span>
            </div>
            <p className="text-secondary-400 text-sm">Total Correct Results</p>
          </div>
          
          <div className="glass-card p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Award className="w-6 h-6 text-yellow-400" />
              <span className="text-2xl font-bold text-white">{seasonStats.totalExactScores}</span>
            </div>
            <p className="text-secondary-400 text-sm">Total Exact Scores</p>
          </div>
          
          <div className="glass-card p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <TrendingUp className="w-6 h-6 text-primary-400" />
              <span className="text-2xl font-bold text-white">{seasonStats.averageAccuracy}%</span>
            </div>
            <p className="text-secondary-400 text-sm">Average Accuracy</p>
          </div>
        </div>

        {/* Best/Worst Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Best Performance</h3>
                <p className="text-secondary-400 text-sm">Your highest scoring gameweek</p>
              </div>
            </div>
            <div className="bg-secondary-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-bold text-lg">{seasonStats.bestGameweek.gameWeek}</div>
                  <div className="text-secondary-400 text-sm">{seasonStats.bestGameweek.date}</div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-bold text-2xl">{seasonStats.bestGameweek.points}</div>
                  <div className="text-secondary-400 text-sm">points</div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-red-400 rotate-180" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Room for Improvement</h3>
                <p className="text-secondary-400 text-sm">Your lowest scoring gameweek</p>
              </div>
            </div>
            <div className="bg-secondary-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-bold text-lg">{seasonStats.worstGameweek.gameWeek}</div>
                  <div className="text-secondary-400 text-sm">{seasonStats.worstGameweek.date}</div>
                </div>
                <div className="text-right">
                  <div className="text-red-400 font-bold text-2xl">{seasonStats.worstGameweek.points}</div>
                  <div className="text-secondary-400 text-sm">points</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gameweeks Table */}
        <div className="glass-card p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">All Gameweeks</h2>
            <div className="text-secondary-400 text-sm">
              Showing {startIndex + 1}-{Math.min(endIndex, allGameweeks.length)} of {allGameweeks.length} gameweeks
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary-700">
                  <th className="text-left py-4 px-4 text-secondary-400 font-medium">Gameweek</th>
                  <th className="text-left py-4 px-4 text-secondary-400 font-medium">Date</th>
                  <th className="text-left py-4 px-4 text-secondary-400 font-medium">Status</th>
                  <th className="text-left py-4 px-4 text-secondary-400 font-medium">Predictions</th>
                  <th className="text-left py-4 px-4 text-secondary-400 font-medium">Correct</th>
                  <th className="text-left py-4 px-4 text-secondary-400 font-medium">Exact Scores</th>
                  <th className="text-left py-4 px-4 text-secondary-400 font-medium">Accuracy</th>
                  <th className="text-left py-4 px-4 text-secondary-400 font-medium">Points</th>
                  <th className="text-left py-4 px-4 text-secondary-400 font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                {currentGameweeks.map((gameweek, index) => (
                  <React.Fragment key={index}>
                    <tr className="border-b border-secondary-800 hover:bg-secondary-800/30 transition-colors">
                      <td className="py-4 px-4">
                        <div className="text-white font-bold">{gameweek.gameWeek}</div>
                      </td>
                      <td className="py-4 px-4 text-secondary-300">{gameweek.date}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(gameweek.status)}`}>
                          {gameweek.status === 'current' ? 'Current' : 
                           gameweek.status === 'completed' ? 'Completed' : 'Upcoming'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-white">{gameweek.totalPredictions}</td>
                      <td className="py-4 px-4 text-green-400 font-medium">{gameweek.correctPredictions}</td>
                      <td className="py-4 px-4 text-yellow-400 font-medium">{gameweek.correctScores}</td>
                      <td className="py-4 px-4 text-white">{gameweek.accuracy}%</td>
                      <td className="py-4 px-4">
                        <div className="text-white font-bold text-lg">{gameweek.points}</div>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => toggleGameweekExpansion(gameweek.gameWeek)}
                          className="flex items-center space-x-2 text-primary-400 hover:text-primary-300 transition-colors"
                        >
                          <span className="text-sm font-medium">
                            {expandedGameweek === gameweek.gameWeek ? 'Hide' : 'Show'}
                          </span>
                          {expandedGameweek === gameweek.gameWeek ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                    
                    {/* Expanded Match Details */}
                    {expandedGameweek === gameweek.gameWeek && (
                      <tr className="border-b border-secondary-800">
                        <td colSpan={9} className="py-6 px-4 bg-secondary-800/30">
                          <div className="space-y-4">
                            <h4 className="text-white font-semibold text-lg mb-4 flex items-center space-x-2">
                              <Trophy className="w-5 h-5 text-primary-400" />
                              <span>{gameweek.gameWeek} Match Details</span>
                            </h4>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              {gameweek.matches.map((match, matchIndex) => (
                                <div key={matchIndex} className={`rounded-lg p-4 border-2 ${getResultColor(match.result)}`}>
                                  <div className="flex items-center justify-between">
                                    {/* Match Info */}
                                    <div className="flex items-center space-x-4 flex-1">
                                      <div className="text-center">
                                        <div className="text-white font-bold text-sm truncate">{match.homeTeam}</div>
                                        <div className="text-secondary-400 text-xs">vs</div>
                                        <div className="text-white font-bold text-sm truncate">{match.awayTeam}</div>
                                      </div>
                                      
                                      <div className="text-center">
                                        <div className="text-xs text-secondary-400 mb-1">Predicted</div>
                                        <div className="text-white font-bold">
                                          {match.predictionHome} - {match.predictionAway}
                                        </div>
                                      </div>
                                      
                                      <div className="text-center">
                                        <div className="text-xs text-secondary-400 mb-1">Actual</div>
                                        <div className="text-white font-bold">
                                          {match.homeScore} - {match.awayScore}
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* Result and Points */}
                                    <div className="flex items-center space-x-3">
                                      {match.banker && (
                                        <div className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs font-bold border border-yellow-500/30">
                                          🏆 BANKER
                                        </div>
                                      )}
                                      
                                      <div className="text-center">
                                        <div className="text-lg mb-1">{getResultIcon(match.result)}</div>
                                        <div className="text-white font-bold">{match.points}</div>
                                        <div className="text-xs text-secondary-400">pts</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center space-x-2">
              {renderPaginationButtons()}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}