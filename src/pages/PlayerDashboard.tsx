import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Layout } from '../components/Layout/Layout'
import { ArrowLeft, Trophy, Target, Percent, Award, TrendingUp, TrendingDown, Crown, Medal, Star } from 'lucide-react'

export function PlayerDashboard() {
  const { leagueId, playerId } = useParams()
  
  // Mock function to get player data based on playerId
  const getPlayerData = (playerId: string) => {
    const players = {
      'marcus-johnson': {
        name: 'Marcus Johnson',
        team: 'MJ United',
        avatar: '👨‍💼',
        rank: 1,
        badge: 'crown',
        stats: {
          totalPoints: 1450,
          totalPredictions: 180,
          accuracy: 78,
          correctScores: 24,
        },
        hotTeams: [
          { team: 'Arsenal', accuracy: 92 },
          { team: 'Liverpool', accuracy: 88 },
          { team: 'Man City', accuracy: 85 },
        ],
        coldTeams: [
          { team: 'Burnley', accuracy: 45 },
          { team: 'Sheffield United', accuracy: 38 },
          { team: 'Luton Town', accuracy: 32 },
        ],
        recentGameWeeks: [
          { gameWeek: 'GW 20', totalPredictions: 10, correctPredictions: 7, correctScores: 3, accuracy: 70, points: 95 },
          { gameWeek: 'GW 19', totalPredictions: 10, correctPredictions: 8, correctScores: 2, accuracy: 80, points: 110 },
          { gameWeek: 'GW 18', totalPredictions: 10, correctPredictions: 6, correctScores: 4, accuracy: 60, points: 120 },
          { gameWeek: 'GW 17', totalPredictions: 10, correctPredictions: 9, correctScores: 1, accuracy: 90, points: 105 },
          { gameWeek: 'GW 16', totalPredictions: 10, correctPredictions: 7, correctScores: 2, accuracy: 70, points: 100 },
        ]
      },
      'sarah-williams': {
        name: 'Sarah Williams',
        team: 'SW Predictions',
        avatar: '👩‍💻',
        rank: 2,
        badge: 'medal',
        stats: {
          totalPoints: 1420,
          totalPredictions: 175,
          accuracy: 76,
          correctScores: 22,
        },
        hotTeams: [
          { team: 'Chelsea', accuracy: 89 },
          { team: 'Newcastle', accuracy: 84 },
          { team: 'Brighton', accuracy: 81 },
        ],
        coldTeams: [
          { team: 'Everton', accuracy: 42 },
          { team: 'Crystal Palace', accuracy: 39 },
          { team: 'Brentford', accuracy: 35 },
        ],
        recentGameWeeks: [
          { gameWeek: 'GW 20', totalPredictions: 10, correctPredictions: 6, correctScores: 2, accuracy: 60, points: 90 },
          { gameWeek: 'GW 19', totalPredictions: 10, correctPredictions: 8, correctScores: 3, accuracy: 80, points: 125 },
          { gameWeek: 'GW 18', totalPredictions: 10, correctPredictions: 7, correctScores: 2, accuracy: 70, points: 100 },
          { gameWeek: 'GW 17', totalPredictions: 10, correctPredictions: 8, correctScores: 1, accuracy: 80, points: 95 },
          { gameWeek: 'GW 16', totalPredictions: 10, correctPredictions: 6, correctScores: 3, accuracy: 60, points: 105 },
        ]
      },
      'david-chen': {
        name: 'David Chen',
        team: 'Chen FC',
        avatar: '👨‍🎓',
        rank: 3,
        badge: 'medal',
        stats: {
          totalPoints: 1395,
          totalPredictions: 170,
          accuracy: 74,
          correctScores: 20,
        },
        hotTeams: [
          { team: 'Tottenham', accuracy: 87 },
          { team: 'West Ham', accuracy: 83 },
          { team: 'Fulham', accuracy: 79 },
        ],
        coldTeams: [
          { team: 'Wolves', accuracy: 41 },
          { team: 'Bournemouth', accuracy: 37 },
          { team: 'Nottingham Forest', accuracy: 33 },
        ],
        recentGameWeeks: [
          { gameWeek: 'GW 20', totalPredictions: 10, correctPredictions: 7, correctScores: 1, accuracy: 70, points: 85 },
          { gameWeek: 'GW 19', totalPredictions: 10, correctPredictions: 6, correctScores: 2, accuracy: 60, points: 90 },
          { gameWeek: 'GW 18', totalPredictions: 10, correctPredictions: 8, correctScores: 2, accuracy: 80, points: 110 },
          { gameWeek: 'GW 17', totalPredictions: 10, correctPredictions: 7, correctScores: 3, accuracy: 70, points: 115 },
          { gameWeek: 'GW 16', totalPredictions: 10, correctPredictions: 5, correctScores: 1, accuracy: 50, points: 65 },
        ]
      },
      'emma-davis': {
        name: 'Emma Davis',
        team: 'Davis Dynasty',
        avatar: '👩‍🔬',
        rank: 4,
        badge: 'star',
        stats: {
          totalPoints: 1380,
          totalPredictions: 165,
          accuracy: 72,
          correctScores: 18,
        },
        hotTeams: [
          { team: 'Manchester United', accuracy: 85 },
          { team: 'Aston Villa', accuracy: 82 },
          { team: 'Sheffield United', accuracy: 78 },
        ],
        coldTeams: [
          { team: 'Luton Town', accuracy: 38 },
          { team: 'Burnley', accuracy: 35 },
          { team: 'Crystal Palace', accuracy: 32 },
        ],
        recentGameWeeks: [
          { gameWeek: 'GW 20', totalPredictions: 10, correctPredictions: 5, correctScores: 2, accuracy: 50, points: 80 },
          { gameWeek: 'GW 19', totalPredictions: 10, correctPredictions: 7, correctScores: 1, accuracy: 70, points: 85 },
          { gameWeek: 'GW 18', totalPredictions: 10, correctPredictions: 8, correctScores: 3, accuracy: 80, points: 125 },
          { gameWeek: 'GW 17', totalPredictions: 10, correctPredictions: 6, correctScores: 2, accuracy: 60, points: 90 },
          { gameWeek: 'GW 16', totalPredictions: 10, correctPredictions: 7, correctScores: 1, accuracy: 70, points: 85 },
        ]
      },
      'james-wilson': {
        name: 'James Wilson',
        team: 'Wilson Warriors',
        avatar: '👨‍🚀',
        rank: 5,
        badge: 'star',
        stats: {
          totalPoints: 1365,
          totalPredictions: 160,
          accuracy: 70,
          correctScores: 16,
        },
        hotTeams: [
          { team: 'Liverpool', accuracy: 88 },
          { team: 'Brighton', accuracy: 84 },
          { team: 'Brentford', accuracy: 80 },
        ],
        coldTeams: [
          { team: 'Everton', accuracy: 40 },
          { team: 'Wolves', accuracy: 36 },
          { team: 'Nottingham Forest', accuracy: 33 },
        ],
        recentGameWeeks: [
          { gameWeek: 'GW 20', totalPredictions: 10, correctPredictions: 8, correctScores: 2, accuracy: 80, points: 110 },
          { gameWeek: 'GW 19', totalPredictions: 10, correctPredictions: 5, correctScores: 1, accuracy: 50, points: 65 },
          { gameWeek: 'GW 18', totalPredictions: 10, correctPredictions: 7, correctScores: 2, accuracy: 70, points: 100 },
          { gameWeek: 'GW 17', totalPredictions: 10, correctPredictions: 6, correctScores: 3, accuracy: 60, points: 105 },
          { gameWeek: 'GW 16', totalPredictions: 10, correctPredictions: 8, correctScores: 1, accuracy: 80, points: 95 },
        ]
      },
      'lisa-anderson': {
        name: 'Lisa Anderson',
        team: 'Anderson FC',
        avatar: '👩‍🎨',
        rank: 6,
        badge: null,
        stats: {
          totalPoints: 1340,
          totalPredictions: 155,
          accuracy: 68,
          correctScores: 14,
        },
        hotTeams: [
          { team: 'Arsenal', accuracy: 86 },
          { team: 'Tottenham', accuracy: 82 },
          { team: 'West Ham', accuracy: 78 },
        ],
        coldTeams: [
          { team: 'Bournemouth', accuracy: 42 },
          { team: 'Sheffield United', accuracy: 38 },
          { team: 'Luton Town', accuracy: 35 },
        ],
        recentGameWeeks: [
          { gameWeek: 'GW 20', totalPredictions: 10, correctPredictions: 6, correctScores: 1, accuracy: 60, points: 75 },
          { gameWeek: 'GW 19', totalPredictions: 10, correctPredictions: 7, correctScores: 2, accuracy: 70, points: 100 },
          { gameWeek: 'GW 18', totalPredictions: 10, correctPredictions: 5, correctScores: 1, accuracy: 50, points: 65 },
          { gameWeek: 'GW 17', totalPredictions: 10, correctPredictions: 8, correctScores: 2, accuracy: 80, points: 110 },
          { gameWeek: 'GW 16', totalPredictions: 10, correctPredictions: 6, correctScores: 3, accuracy: 60, points: 105 },
        ]
      },
      'michael-brown': {
        name: 'Michael Brown',
        team: 'Brown Bulls',
        avatar: '👨‍🏫',
        rank: 7,
        badge: null,
        stats: {
          totalPoints: 1325,
          totalPredictions: 150,
          accuracy: 66,
          correctScores: 12,
        },
        hotTeams: [
          { team: 'Manchester City', accuracy: 89 },
          { team: 'Newcastle', accuracy: 85 },
          { team: 'Fulham', accuracy: 81 },
        ],
        coldTeams: [
          { team: 'Crystal Palace', accuracy: 44 },
          { team: 'Burnley', accuracy: 40 },
          { team: 'Everton', accuracy: 37 },
        ],
        recentGameWeeks: [
          { gameWeek: 'GW 20', totalPredictions: 10, correctPredictions: 7, correctScores: 2, accuracy: 70, points: 100 },
          { gameWeek: 'GW 19', totalPredictions: 10, correctPredictions: 6, correctScores: 1, accuracy: 60, points: 75 },
          { gameWeek: 'GW 18', totalPredictions: 10, correctPredictions: 8, correctScores: 1, accuracy: 80, points: 95 },
          { gameWeek: 'GW 17', totalPredictions: 10, correctPredictions: 5, correctScores: 2, accuracy: 50, points: 80 },
          { gameWeek: 'GW 16', totalPredictions: 10, correctPredictions: 7, correctScores: 3, accuracy: 70, points: 115 },
        ]
      },
      'jennifer-taylor': {
        name: 'Jennifer Taylor',
        team: 'Taylor Titans',
        avatar: '👩‍⚕️',
        rank: 8,
        badge: null,
        stats: {
          totalPoints: 1310,
          totalPredictions: 145,
          accuracy: 64,
          correctScores: 10,
        },
        hotTeams: [
          { team: 'Chelsea', accuracy: 87 },
          { team: 'Brighton', accuracy: 83 },
          { team: 'Brentford', accuracy: 79 },
        ],
        coldTeams: [
          { team: 'Wolves', accuracy: 46 },
          { team: 'Nottingham Forest', accuracy: 42 },
          { team: 'Luton Town', accuracy: 39 },
        ],
        recentGameWeeks: [
          { gameWeek: 'GW 20', totalPredictions: 10, correctPredictions: 5, correctScores: 1, accuracy: 50, points: 65 },
          { gameWeek: 'GW 19', totalPredictions: 10, correctPredictions: 8, correctScores: 2, accuracy: 80, points: 110 },
          { gameWeek: 'GW 18', totalPredictions: 10, correctPredictions: 6, correctScores: 1, accuracy: 60, points: 75 },
          { gameWeek: 'GW 17', totalPredictions: 10, correctPredictions: 7, correctScores: 2, accuracy: 70, points: 100 },
          { gameWeek: 'GW 16', totalPredictions: 10, correctPredictions: 4, correctScores: 1, accuracy: 40, points: 55 },
        ]
      },
      'robert-miller': {
        name: 'Robert Miller',
        team: 'Miller Magic',
        avatar: '👨‍💼',
        rank: 9,
        badge: null,
        stats: {
          totalPoints: 1295,
          totalPredictions: 140,
          accuracy: 62,
          correctScores: 8,
        },
        hotTeams: [
          { team: 'Liverpool', accuracy: 84 },
          { team: 'Aston Villa', accuracy: 80 },
          { team: 'West Ham', accuracy: 76 },
        ],
        coldTeams: [
          { team: 'Sheffield United', accuracy: 48 },
          { team: 'Burnley', accuracy: 44 },
          { team: 'Crystal Palace', accuracy: 41 },
        ],
        recentGameWeeks: [
          { gameWeek: 'GW 20', totalPredictions: 10, correctPredictions: 8, correctScores: 1, accuracy: 80, points: 95 },
          { gameWeek: 'GW 19', totalPredictions: 10, correctPredictions: 5, correctScores: 2, accuracy: 50, points: 80 },
          { gameWeek: 'GW 18', totalPredictions: 10, correctPredictions: 7, correctScores: 1, accuracy: 70, points: 85 },
          { gameWeek: 'GW 17', totalPredictions: 10, correctPredictions: 6, correctScores: 1, accuracy: 60, points: 75 },
          { gameWeek: 'GW 16', totalPredictions: 10, correctPredictions: 8, correctScores: 2, accuracy: 80, points: 110 },
        ]
      },
      'amanda-garcia': {
        name: 'Amanda Garcia',
        team: 'Garcia Giants',
        avatar: '👩‍🎤',
        rank: 10,
        badge: null,
        stats: {
          totalPoints: 1280,
          totalPredictions: 135,
          accuracy: 60,
          correctScores: 6,
        },
        hotTeams: [
          { team: 'Arsenal', accuracy: 82 },
          { team: 'Manchester United', accuracy: 78 },
          { team: 'Tottenham', accuracy: 74 },
        ],
        coldTeams: [
          { team: 'Everton', accuracy: 50 },
          { team: 'Bournemouth', accuracy: 46 },
          { team: 'Wolves', accuracy: 43 },
        ],
        recentGameWeeks: [
          { gameWeek: 'GW 20', totalPredictions: 10, correctPredictions: 6, correctScores: 2, accuracy: 60, points: 90 },
          { gameWeek: 'GW 19', totalPredictions: 10, correctPredictions: 7, correctScores: 1, accuracy: 70, points: 85 },
          { gameWeek: 'GW 18', totalPredictions: 10, correctPredictions: 5, correctScores: 1, accuracy: 50, points: 65 },
          { gameWeek: 'GW 17', totalPredictions: 10, correctPredictions: 8, correctScores: 1, accuracy: 80, points: 95 },
          { gameWeek: 'GW 16', totalPredictions: 10, correctPredictions: 4, correctScores: 2, accuracy: 40, points: 70 },
        ]
      },
      'chris-martinez': {
        name: 'Chris Martinez',
        team: 'Martinez Marvels',
        avatar: '👨‍🎨',
        rank: 11,
        badge: null,
        stats: {
          totalPoints: 1265,
          totalPredictions: 130,
          accuracy: 58,
          correctScores: 4,
        },
        hotTeams: [
          { team: 'Manchester City', accuracy: 85 },
          { team: 'Brighton', accuracy: 81 },
          { team: 'Fulham', accuracy: 77 },
        ],
        coldTeams: [
          { team: 'Nottingham Forest', accuracy: 52 },
          { team: 'Luton Town', accuracy: 48 },
          { team: 'Sheffield United', accuracy: 45 },
        ],
        recentGameWeeks: [
          { gameWeek: 'GW 20', totalPredictions: 10, correctPredictions: 5, correctScores: 1, accuracy: 50, points: 65 },
          { gameWeek: 'GW 19', totalPredictions: 10, correctPredictions: 6, correctScores: 2, accuracy: 60, points: 90 },
          { gameWeek: 'GW 18', totalPredictions: 10, correctPredictions: 7, correctScores: 1, accuracy: 70, points: 85 },
          { gameWeek: 'GW 17', totalPredictions: 10, correctPredictions: 4, correctScores: 1, accuracy: 40, points: 55 },
          { gameWeek: 'GW 16', totalPredictions: 10, correctPredictions: 8, correctScores: 1, accuracy: 80, points: 95 },
        ]
      },
      'alex-rakeem': {
        name: 'Alex Rakeem',
        team: 'Rakeem Rangers',
        avatar: '👨‍💻',
        rank: 12,
        badge: null,
        stats: {
          totalPoints: 1250,
          totalPredictions: 125,
          accuracy: 56,
          correctScores: 2,
        },
        hotTeams: [
          { team: 'Arsenal', accuracy: 79 },
          { team: 'Chelsea', accuracy: 75 },
          { team: 'Liverpool', accuracy: 71 },
        ],
        coldTeams: [
          { team: 'Burnley', accuracy: 54 },
          { team: 'Crystal Palace', accuracy: 50 },
          { team: 'Everton', accuracy: 47 },
        ],
        recentGameWeeks: [
          { gameWeek: 'GW 20', totalPredictions: 10, correctPredictions: 6, correctScores: 1, accuracy: 60, points: 75 },
          { gameWeek: 'GW 19', totalPredictions: 10, correctPredictions: 5, correctScores: 1, accuracy: 50, points: 65 },
          { gameWeek: 'GW 18', totalPredictions: 10, correctPredictions: 7, correctScores: 1, accuracy: 70, points: 85 },
          { gameWeek: 'GW 17', totalPredictions: 10, correctPredictions: 6, correctScores: 1, accuracy: 60, points: 75 },
          { gameWeek: 'GW 16', totalPredictions: 10, correctPredictions: 5, correctScores: 2, accuracy: 50, points: 80 },
        ]
      }
    }
    
    return players[playerId as keyof typeof players]
  }

  // Mock function to get league name
  const getLeagueName = (leagueId: string) => {
    const leagues = {
      'gp-team': 'GP Team',
      'dc-warriors': "Dc's Warriors",
      'invincibles': 'Invincibles',
      'arsenal-club-league': 'Arsenal Club League',
      'global-league': 'Global League',
      'nigeria-country-league': 'Nigeria Country League',
    }
    return leagues[leagueId as keyof typeof leagues] || 'Unknown League'
  }

  const player = getPlayerData(playerId || 'marcus-johnson')
  const leagueName = getLeagueName(leagueId || 'gp-team')

  const getBadgeIcon = (badge: string | null) => {
    switch (badge) {
      case 'crown':
        return <Crown className="w-6 h-6 text-yellow-400" />
      case 'medal':
        return <Medal className="w-6 h-6 text-gray-400" />
      case 'star':
        return <Star className="w-6 h-6 text-orange-400" />
      default:
        return null
    }
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-400'
    if (rank === 2) return 'text-gray-400'
    if (rank === 3) return 'text-orange-400'
    if (rank <= 10) return 'text-primary-400'
    return 'text-white'
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Back Button */}
        <div>
          <Link 
            to={`/leagues/${leagueId}`}
            className="inline-flex items-center space-x-2 text-secondary-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to {leagueName}</span>
          </Link>
        </div>

        {/* Player Header */}
        <div className="glass-card p-8">
          <div className="flex items-center space-x-6">
            <div className="text-6xl">{player.avatar}</div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{player.name}</h1>
                {getBadgeIcon(player.badge)}
              </div>
              <p className="text-xl text-secondary-300 mb-3">{player.team}</p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-primary-400" />
                  <span className={`text-lg font-bold ${getRankColor(player.rank)}`}>
                    Rank #{player.rank}
                  </span>
                </div>
                <div className="text-secondary-400">in {leagueName}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary-400 mb-1">
                {player.stats.totalPoints}
              </div>
              <div className="text-secondary-400">Total Points</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-600/20 rounded-lg">
                <Trophy className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <p className="text-secondary-400 text-sm">Total Points for the season</p>
                <p className="text-2xl font-bold text-white">{player.stats.totalPoints}</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-600/20 rounded-lg">
                <Target className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <p className="text-secondary-400 text-sm">Total Predictions</p>
                <p className="text-2xl font-bold text-white">{player.stats.totalPredictions}</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-600/20 rounded-lg">
                <Percent className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <p className="text-secondary-400 text-sm">% Accuracy</p>
                <p className="text-2xl font-bold text-white">{player.stats.accuracy}</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-600/20 rounded-lg">
                <Award className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <p className="text-secondary-400 text-sm">No of Correct Scores</p>
                <p className="text-2xl font-bold text-white">{player.stats.correctScores}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hot and Cold Teams */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <div className="flex items-center space-x-2 mb-6">
              <TrendingUp className="w-5 h-5 text-red-400" />
              <h3 className="text-xl font-semibold text-white">{player.name.split(' ')[0]}'s Hot Teams</h3>
            </div>
            <div className="space-y-4">
              {player.hotTeams.map((team, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-white">{team.team}</span>
                  <span className="text-primary-400 font-medium">{team.accuracy}% Accuracy</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center space-x-2 mb-6">
              <TrendingDown className="w-5 h-5 text-blue-400" />
              <h3 className="text-xl font-semibold text-white">{player.name.split(' ')[0]}'s Cold Teams</h3>
            </div>
            <div className="space-y-4">
              {player.coldTeams.map((team, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-white">{team.team}</span>
                  <span className="text-secondary-400 font-medium">{team.accuracy}% Accuracy</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Game Weeks */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">{player.name.split(' ')[0]}'s Recent Game Weeks</h3>
            <Link 
              to={`/leagues/${leagueId}/player/${playerId}/gameweeks-history`}
              className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors"
            >
              View all ↗
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary-700">
                  <th className="text-left py-3 px-4 text-secondary-400 font-medium">Game Week</th>
                  <th className="text-left py-3 px-4 text-secondary-400 font-medium">Total Predictions</th>
                  <th className="text-left py-3 px-4 text-secondary-400 font-medium">No of Correct Predictions</th>
                  <th className="text-left py-3 px-4 text-secondary-400 font-medium">No of Correct Scores</th>
                  <th className="text-left py-3 px-4 text-secondary-400 font-medium">% Accuracy</th>
                  <th className="text-left py-3 px-4 text-secondary-400 font-medium">Points</th>
                </tr>
              </thead>
              <tbody>
                {player.recentGameWeeks.map((week, index) => (
                  <tr key={index} className="border-b border-secondary-800 hover:bg-secondary-800/30">
                    <td className="py-3 px-4 text-white font-medium">{week.gameWeek}</td>
                    <td className="py-3 px-4 text-white">{week.totalPredictions}</td>
                    <td className="py-3 px-4 text-white">{week.correctPredictions}</td>
                    <td className="py-3 px-4 text-white">{week.correctScores}</td>
                    <td className="py-3 px-4 text-white">{week.accuracy}%</td>
                    <td className="py-3 px-4 text-white font-medium">{week.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Performance Insights</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🔥</div>
              <div className="text-xl font-bold text-green-400">
                {Math.max(...player.recentGameWeeks.map(gw => gw.points))}
              </div>
              <div className="text-secondary-400 text-sm">Best Gameweek</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-2">📈</div>
              <div className="text-xl font-bold text-primary-400">
                {Math.round(player.recentGameWeeks.reduce((sum, gw) => sum + gw.points, 0) / player.recentGameWeeks.length)}
              </div>
              <div className="text-secondary-400 text-sm">Avg Points/GW</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-xl font-bold text-yellow-400">
                {player.recentGameWeeks.reduce((sum, gw) => sum + gw.correctScores, 0)}
              </div>
              <div className="text-secondary-400 text-sm">Recent Exact Scores</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}