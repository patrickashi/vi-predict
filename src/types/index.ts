export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  country?: string
  favoriteClub?: string
  createdAt: string
}

export interface League {
  id: string
  name: string
  description?: string
  type: 'public' | 'private' | 'global' | 'club'
  maxMembers?: number
  createdBy: string
  createdAt: string
  inviteCode?: string
}

export interface LeagueMember {
  id: string
  leagueId: string
  userId: string
  joinedAt: string
  totalPoints: number
  recentPoints: number
  rank: number
}

export interface Match {
  id: string
  homeTeam: string
  awayTeam: string
  kickoffTime: string
  gameweek: number
  homeScore?: number
  awayScore?: number
  status: 'upcoming' | 'live' | 'finished'
}

export interface Prediction {
  id: string
  userId: string
  matchId: string
  homeScore: number
  awayScore: number
  isBanker: boolean
  points?: number
  createdAt: string
}

export interface UserStats {
  totalPoints: number
  totalPredictions: number
  accuracy: number
  correctScores: number
  hotTeams: Array<{ team: string; accuracy: number }>
  coldTeams: Array<{ team: string; accuracy: number }>
}