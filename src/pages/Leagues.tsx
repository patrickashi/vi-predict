import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout/Layout'
import { Plus, Users, Globe, Shield, Trophy, AlertCircle, CheckCircle, Loader } from 'lucide-react'

// Types based on our backend API responses
interface League {
  id: number
  name: string
  code?: string
  type: 'public' | 'private'
  category: 'general' | 'country' | 'club'
  description: string
  member_count: number
  max_members?: number
  is_unlimited: boolean
  is_member: boolean
  is_owner: boolean
  can_join: boolean
  join_status: string
  country_name?: string
  country_flag?: string
  club_name?: string
  club_logo?: string
}

interface LeagueSection {
  league: League | null
  rank: number | null
  message: string
  action: string | null
  country_name?: string
  country_flag?: string
  club_name?: string
  club_logo?: string
}

interface LeaguesSection {
  leagues: Array<{ league: League; rank: number | null; role: string }>
  count: number
  message: string
  action: string | null
}

interface LeagueOverview {
  country_league: LeagueSection
  club_league: LeagueSection
  global_league: LeagueSection
  private_leagues: LeaguesSection
  public_leagues: LeaguesSection
  total_leagues: { count: number; message: string }
  user_info: { username: string; has_completed_onboarding: boolean }
  quick_actions: Array<{
    type: string
    title: string
    description: string
    priority: 'high' | 'medium' | 'low'
  }>
}

interface JoinRequest {
  id: number
  user: number
  username: string
  user_full_name: string
  message: string
  created_at: string
}

export function Leagues() {
  const [activeTab, setActiveTab] = useState<'overview' | 'create' | 'join' | 'success'>('overview')
  const [overview, setOverview] = useState<LeagueOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isPrivateExpanded, setIsPrivateExpanded] = useState(true)
  const [isPublicExpanded, setIsPublicExpanded] = useState(true)
  const [createdLeague, setCreatedLeague] = useState<League | null>(null)
  const navigate = useNavigate()

  // Helper function to make authenticated API calls
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('authToken')
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    // Only add Authorization header if we have a token
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }))
      throw new Error(errorData.message || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Load leagues overview on component mount
  useEffect(() => {
    loadOverview()
  }, [])

  const loadOverview = async () => {
    try {
      setLoading(true)
      setError(null)
              const response = await apiCall('/leagues/overview/')
      setOverview(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leagues')
    } finally {
      setLoading(false)
    }
  }

  const handleLeagueClick = (league: League) => {
    navigate(`/leagues/${league.id}`)
  }

  // Filter leagues based on search query
  const filterLeagues = (leagues: Array<{ league: League; rank: number | null; role: string }>) => {
    if (!searchQuery.trim()) return leagues
    return leagues.filter(item =>
      item.league.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const CreateLeagueForm = () => {
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      maxMembers: '',
      type: 'public' as 'public' | 'private',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setIsSubmitting(true)
      setFormError(null)

      try {
        const payload: any = {
          name: formData.name,
          type: formData.type,
          description: formData.description,
        }

        // Only add max_members for private leagues
        if (formData.type === 'private' && formData.maxMembers) {
          payload.max_members = parseInt(formData.maxMembers)
        }

        const response = await apiCall('/leagues/', {
          method: 'POST',
          body: JSON.stringify(payload),
        })

        setCreatedLeague(response.data)
        setActiveTab('success')
        
        // Refresh overview to show new league
        loadOverview()
        
      } catch (err) {
        setFormError(err instanceof Error ? err.message : 'Failed to create league')
      } finally {
        setIsSubmitting(false)
      }
    }

    return (
      <div className="max-w-md mx-auto">
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Create League</h2>
          
          {formError && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{formError}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">League Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="input-field w-full"
                placeholder="Enter league name"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                League Description <span className="text-secondary-400">(optional)</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="input-field w-full h-24 resize-none"
                placeholder="Enter description"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="public"
                  checked={formData.type === 'public'}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'public' | 'private' }))}
                  className="w-4 h-4 text-primary-600"
                  disabled={isSubmitting}
                />
                <span className="text-white">Public</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="private"
                  checked={formData.type === 'private'}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'public' | 'private' }))}
                  className="w-4 h-4 text-primary-600"
                  disabled={isSubmitting}
                />
                <span className="text-white">Private</span>
              </label>
            </div>

            {formData.type === 'private' && (
              <div>
                <label className="block text-white font-medium mb-2">
                  Max Members <span className="text-secondary-400">(Only Applicable to Private leagues)</span>
                </label>
                <input
                  type="number"
                  value={formData.maxMembers}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxMembers: e.target.value }))}
                  className="input-field w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Enter number (2-1000)"
                  min="2"
                  max="1000"
                  disabled={isSubmitting}
                />
              </div>
            )}

            <button 
              type="submit" 
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Creating League...</span>
                </div>
              ) : (
                'Create League'
              )}
            </button>
          </form>
        </div>
      </div>
    )
  }

  const JoinLeagueForm = () => {
    const [joinData, setJoinData] = useState({
      code: '',
      leagueId: '',
      message: '',
      joinType: 'private' as 'private' | 'public'
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [joinError, setJoinError] = useState<string | null>(null)
    const [joinSuccess, setJoinSuccess] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setIsSubmitting(true)
      setJoinError(null)
      setJoinSuccess(null)

      try {
        const payload: any = {}
        
        if (joinData.joinType === 'private') {
          if (!joinData.code.trim()) {
            throw new Error('Invite code is required for private leagues')
          }
          payload.code = joinData.code.trim().toUpperCase()
          if (joinData.message.trim()) {
            payload.message = joinData.message.trim()
          }
        } else {
          if (!joinData.leagueId.trim()) {
            throw new Error('League ID is required for public leagues')
          }
          payload.league_id = parseInt(joinData.leagueId)
        }

        const response = await apiCall('/leagues/join/', {
          method: 'POST',
          body: JSON.stringify(payload),
        })

        setJoinSuccess(response.message)
        
        // Refresh overview to show new league membership
        loadOverview()
        
        // Reset form
        setJoinData({ code: '', leagueId: '', message: '', joinType: 'private' })
        
        // Auto-navigate back to overview after success
        setTimeout(() => {
          setActiveTab('overview')
        }, 2000)
        
      } catch (err) {
        setJoinError(err instanceof Error ? err.message : 'Failed to join league')
      } finally {
        setIsSubmitting(false)
      }
    }

    return (
      <div className="max-w-md mx-auto">
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Join League</h2>
          
          {joinError && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{joinError}</p>
            </div>
          )}

          {joinSuccess && (
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-6 flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <p className="text-green-300 text-sm">{joinSuccess}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Join Type Selection */}
            <div>
              <label className="block text-white font-medium mb-3">League Type</label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="joinType"
                    value="private"
                    checked={joinData.joinType === 'private'}
                    onChange={(e) => setJoinData(prev => ({ ...prev, joinType: e.target.value as 'private' | 'public' }))}
                    className="w-4 h-4 text-primary-600"
                    disabled={isSubmitting}
                  />
                  <span className="text-white">Private (with invite code)</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="joinType"
                    value="public"
                    checked={joinData.joinType === 'public'}
                    onChange={(e) => setJoinData(prev => ({ ...prev, joinType: e.target.value as 'private' | 'public' }))}
                    className="w-4 h-4 text-primary-600"
                    disabled={isSubmitting}
                  />
                  <span className="text-white">Public (with league ID)</span>
                </label>
              </div>
            </div>

            {joinData.joinType === 'private' ? (
              <>
                <div>
                  <label className="block text-white font-medium mb-2">Enter Invite Code</label>
                  <input
                    type="text"
                    value={joinData.code}
                    onChange={(e) => setJoinData(prev => ({ ...prev, code: e.target.value }))}
                    className="input-field w-full"
                    placeholder="Enter invite code (e.g., GP2024)"
                    required
                    disabled={isSubmitting}
                    maxLength={8}
                  />
                  <p className="text-secondary-400 text-sm mt-2">
                    For private leagues, your request will need admin approval.
                  </p>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Message <span className="text-secondary-400">(optional)</span>
                  </label>
                  <textarea
                    value={joinData.message}
                    onChange={(e) => setJoinData(prev => ({ ...prev, message: e.target.value }))}
                    className="input-field w-full h-20 resize-none"
                    placeholder="Optional message to league owner..."
                    disabled={isSubmitting}
                    maxLength={200}
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="block text-white font-medium mb-2">League ID</label>
                <input
                  type="number"
                  value={joinData.leagueId}
                  onChange={(e) => setJoinData(prev => ({ ...prev, leagueId: e.target.value }))}
                  className="input-field w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Enter public league ID"
                  required
                  disabled={isSubmitting}
                />
                <p className="text-secondary-400 text-sm mt-2">
                  You can join public leagues instantly with their ID.
                </p>
              </div>
            )}

            <button 
              type="submit" 
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>
                    {joinData.joinType === 'private' ? 'Sending Request...' : 'Joining League...'}
                  </span>
                </div>
              ) : (
                joinData.joinType === 'private' ? 'Send Join Request' : 'Join League'
              )}
            </button>
          </form>

          {/* Link to discoverable leagues */}
          <div className="mt-6 pt-6 border-t border-secondary-700">
            <p className="text-secondary-400 text-sm text-center mb-3">
              Or browse public leagues to find their IDs:
            </p>
            <button
              onClick={() => navigate('/leagues/discover')}
              className="btn-secondary w-full text-sm"
            >
              Discover Public Leagues
            </button>
          </div>
        </div>
      </div>
    )
  }

  const LeagueCreatedSuccess = () => {
    const handleCopyCode = () => {
      if (createdLeague?.code) {
        navigator.clipboard.writeText(createdLeague.code)
        // You might want to show a toast notification here
        alert('Invite code copied to clipboard!')
      }
    }

    const handleBackToOverview = () => {
      setCreatedLeague(null)
      setActiveTab('overview')
    }

    if (!createdLeague) return null

    return (
      <div className="max-w-md mx-auto">
        <div className="glass-card p-8 text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-8 h-8 text-green-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">League Created Successfully!</h2>
          <p className="text-secondary-300 mb-6">
            Your {createdLeague.type} league "<span className="text-white font-medium">{createdLeague.name}</span>" has been created.
          </p>

          {createdLeague.type === 'private' && createdLeague.code && (
            <div className="bg-secondary-800/50 rounded-lg p-6 mb-6">
              <h3 className="text-white font-semibold mb-3">Share this invite code with your friends:</h3>
              <div className="bg-secondary-700 rounded-lg p-4 mb-4">
                <div className="text-3xl font-mono font-bold text-primary-400 tracking-wider">
                  {createdLeague.code}
                </div>
              </div>
              <button
                onClick={handleCopyCode}
                className="btn-secondary w-full mb-3"
              >
                📋 Copy Invite Code
              </button>
              <p className="text-secondary-400 text-sm">
                Friends can use this code to request to join your private league
              </p>
            </div>
          )}

          {createdLeague.type === 'public' && (
            <div className="bg-secondary-800/50 rounded-lg p-6 mb-6">
              <h3 className="text-white font-semibold mb-3">Your public league is now discoverable!</h3>
              <p className="text-secondary-400 text-sm">
                League ID: <span className="text-primary-400 font-mono">{createdLeague.id}</span>
              </p>
              <p className="text-secondary-400 text-sm mt-2">
                Anyone can join your public league instantly using this ID.
              </p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleBackToOverview}
              className="btn-primary w-full"
            >
              View My Leagues
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className="btn-secondary w-full"
            >
              Create Another League
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-96">
          <div className="flex items-center space-x-3 text-white">
            <Loader className="w-6 h-6 animate-spin" />
            <span>Loading leagues...</span>
          </div>
        </div>
      </Layout>
    )
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <div className="max-w-md mx-auto">
          <div className="glass-card p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Error Loading Leagues</h2>
            <p className="text-secondary-300 mb-6">{error}</p>
            <button onClick={loadOverview} className="btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  if (!overview) {
    return (
      <Layout>
        <div className="text-center text-white">No league data available</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-8">Leagues</h1>
          
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-primary-600 text-white'
                  : 'bg-secondary-800 text-secondary-300 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                activeTab === 'create' || activeTab === 'success'
                  ? 'bg-primary-600 text-white'
                  : 'bg-secondary-800 text-secondary-300 hover:text-white'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Create League</span>
            </button>
            <button
              onClick={() => setActiveTab('join')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                activeTab === 'join'
                  ? 'bg-primary-600 text-white'
                  : 'bg-secondary-800 text-secondary-300 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Join League</span>
            </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search leagues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field w-full pl-10"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary-400 hover:text-white"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            {overview.quick_actions.length > 0 && (
              <div className="max-w-4xl mx-auto">
                <h3 className="text-lg font-semibold text-white mb-4">Suggested Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {overview.quick_actions.map((action, index) => (
                    <div
                      key={index}
                      className={`glass-card p-4 border-l-4 ${
                        action.priority === 'high' ? 'border-red-400' :
                        action.priority === 'medium' ? 'border-yellow-400' :
                        'border-blue-400'
                      }`}
                    >
                      <h4 className="text-white font-medium mb-1">{action.title}</h4>
                      <p className="text-secondary-300 text-sm">{action.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Country League */}
            {overview.country_league.league ? (
              <button 
                onClick={() => handleLeagueClick(overview.country_league.league!)}
                className="glass-card p-6 w-full text-left hover:bg-secondary-800/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Shield className="w-6 h-6 text-primary-400" />
                  <h3 className="text-xl font-semibold text-white">Country</h3>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{overview.country_league.country_flag}</span>
                    <span className="text-white">{overview.country_league.country_name}</span>
                  </div>
                  <span className="text-primary-400 font-medium">
                    {overview.country_league.rank && `#${overview.country_league.rank}`}
                  </span>
                </div>
                <p className="text-secondary-300 text-sm mt-2">{overview.country_league.message}</p>
              </button>
            ) : (
              <div className="glass-card p-6 border border-secondary-600 border-dashed">
                <div className="flex items-center space-x-3 mb-4">
                  <Shield className="w-6 h-6 text-secondary-400" />
                  <h3 className="text-xl font-semibold text-white">Country</h3>
                </div>
                <p className="text-secondary-300">{overview.country_league.message}</p>
              </div>
            )}

            {/* Main Leagues */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Global League */}
              {overview.global_league.league ? (
                <button 
                  onClick={() => handleLeagueClick(overview.global_league.league!)}
                  className="glass-card p-6 text-left hover:bg-secondary-800/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <Globe className="w-6 h-6 text-secondary-400" />
                    <h3 className="text-xl font-semibold text-white">Global League</h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">{overview.global_league.league.name}</span>
                    <span className="text-primary-400 font-medium">
                      {overview.global_league.rank && `#${overview.global_league.rank}`}
                    </span>
                  </div>
                  <p className="text-secondary-300 text-sm mt-2">{overview.global_league.message}</p>
                </button>
              ) : (
                <div className="glass-card p-6 border border-secondary-600 border-dashed">
                  <div className="flex items-center space-x-3 mb-4">
                    <Globe className="w-6 h-6 text-secondary-400" />
                    <h3 className="text-xl font-semibold text-white">Global League</h3>
                  </div>
                  <p className="text-secondary-300">{overview.global_league.message}</p>
                </div>
              )}

              {/* Club League */}
              {overview.club_league.league ? (
                <button 
                  // onClick={() => handleLeagueClick(overview.club_league.league!)}
                  className="glass-card p-6 text-left hover:bg-secondary-800/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <Trophy className="w-6 h-6 text-secondary-400" />
                    <h3 className="text-xl font-semibold text-white">Club League</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{overview.club_league.club_logo}</span>
                      <span className="text-white font-medium">{overview.club_league.club_name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-secondary-300 text-sm">{overview.club_league.message}</span>
                      <span className="text-primary-400 font-medium">
                        {overview.club_league.rank && `#${overview.club_league.rank}`}
                      </span>
                    </div>
                  </div>
                </button>
              ) : (
                <div className="glass-card p-6 border border-secondary-600 border-dashed">
                  <div className="flex items-center space-x-3 mb-4">
                    <Trophy className="w-6 h-6 text-secondary-400" />
                    <h3 className="text-xl font-semibold text-white">Club League</h3>
                  </div>
                  <p className="text-secondary-300">{overview.club_league.message}</p>
                </div>
              )}
            </div>

            {/* Private and Public Leagues */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Private Leagues */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-6 h-6 text-secondary-400" />
                    <h3 className="text-xl font-semibold text-white">Private Leagues</h3>
                  </div>
                  <button 
                    onClick={() => setIsPrivateExpanded(!isPrivateExpanded)}
                    className="text-secondary-400 hover:text-white text-sm transition-colors flex items-center space-x-1"
                  >
                    <span>{overview.private_leagues.count} leagues</span>
                    <span className={`transform transition-transform duration-300 ${isPrivateExpanded ? 'rotate-180' : ''}`}>
                      ▲
                    </span>
                  </button>
                </div>
                <div className={`space-y-3 transition-all duration-300 overflow-hidden ${
                  isPrivateExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  {overview.private_leagues.leagues.length > 0 ? (
                    <>
                      {filterLeagues(overview.private_leagues.leagues).map((item, index) => (
                        <button 
                          key={index} 
                          // onClick={() => handleLeagueClick(item.league)}
                          className="bg-secondary-800/50 rounded-lg p-3 w-full text-left hover:bg-secondary-700/50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-white font-medium">{item.league.name}</div>
                              <div className="text-secondary-400 text-sm">
                                {item.role === 'owner' ? 'Owner' : 'Member'} • {item.league.member_count} members
                              </div>
                            </div>
                            <span className="text-primary-400 font-medium">
                              {item.rank && `#${item.rank}`}
                            </span>
                          </div>
                        </button>
                      ))}
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-secondary-300 mb-4">{overview.private_leagues.message}</p>
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => setActiveTab('create')}
                          className="btn-primary text-sm py-2"
                        >
                          Create Private League
                        </button>
                        <button
                          onClick={() => setActiveTab('join')}
                          className="btn-secondary text-sm py-2"
                        >
                          Join with Code
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Public Leagues */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Users className="w-6 h-6 text-secondary-400" />
                    <h3 className="text-xl font-semibold text-white">Public Leagues</h3>
                  </div>
                  <button 
                    onClick={() => setIsPublicExpanded(!isPublicExpanded)}
                    className="text-secondary-400 hover:text-white text-sm transition-colors flex items-center space-x-1"
                  >
                    <span>{overview.public_leagues.count} leagues</span>
                    <span className={`transform transition-transform duration-300 ${isPublicExpanded ? 'rotate-180' : ''}`}>
                      ▲
                    </span>
                  </button>
                </div>
                <div className={`space-y-3 transition-all duration-300 overflow-hidden ${
                  isPublicExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  {overview.public_leagues.leagues.length > 0 ? (
                    <>
                      {filterLeagues(overview.public_leagues.leagues).map((item, index) => (
                        <button 
                          key={index} 
                          // onClick={() => handleLeagueClick(item.league)}
                          className="bg-secondary-800/50 rounded-lg p-3 w-full text-left hover:bg-secondary-700/50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-white font-medium">{item.league.name}</div>
                              <div className="text-secondary-400 text-sm">
                                {item.role === 'owner' ? 'Owner' : 'Member'} • {item.league.member_count} members
                              </div>
                            </div>
                            <span className="text-primary-400 font-medium">
                              {item.rank && `#${item.rank}`}
                            </span>
                          </div>
                        </button>
                      ))}
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-secondary-300 mb-4">{overview.public_leagues.message}</p>
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => navigate('/leagues/discover')}
                          className="btn-primary text-sm py-2"
                        >
                          Discover Public Leagues
                        </button>
                        <button
                          onClick={() => setActiveTab('create')}
                          className="btn-secondary text-sm py-2"
                        >
                          Create Public League
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Total Summary */}
            <div className="text-center">
              <p className="text-secondary-300">{overview.total_leagues.message}</p>
            </div>
          </div>
        )}

        {activeTab === 'create' && <CreateLeagueForm />}
        {activeTab === 'success' && <LeagueCreatedSuccess />}
        {activeTab === 'join' && <JoinLeagueForm />}
      </div>
    </Layout>
  )
}