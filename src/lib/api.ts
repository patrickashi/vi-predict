// API configuration and service layer for Django REST Framework backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

// API client with authentication
class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
    this.token = localStorage.getItem('authToken')
  }

  setToken(token: string | null) {
    this.token = token
    if (token) {
      localStorage.setItem('authToken', token)
    } else {
      localStorage.removeItem('authToken')
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const config: RequestInit = {
      ...options,
      headers,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Authentication endpoints
  async signIn(email: string, password: string) {
    return this.request<{ token: string; user: any }>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async signUp(email: string, password: string, firstName: string, lastName: string) {
    return this.request<{ token: string; user: any }>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      }),
    })
  }

  async resetPassword(email: string) {
    return this.request<{ message: string }>('/auth/password-reset/', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  async getCurrentUser() {
    return this.request<any>('/auth/user/')
  }

  async signOut() {
    try {
      await this.request('/auth/logout/', { method: 'POST' })
    } finally {
      this.setToken(null)
    }
  }

  // League endpoints
  async getLeagues() {
    return this.request<any[]>('/leagues/')
  }

  async createLeague(data: {
    name: string
    description?: string
    type: 'public' | 'private'
    maxMembers?: number
  }) {
    return this.request<any>('/leagues/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async joinLeague(inviteCode: string) {
    return this.request<any>('/leagues/join/', {
      method: 'POST',
      body: JSON.stringify({ invite_code: inviteCode }),
    })
  }

  async getLeagueDetails(leagueId: string) {
    return this.request<any>(`/leagues/${leagueId}/`)
  }

  // Match and prediction endpoints
  async getMatches(gameweek?: number) {
    const params = gameweek ? `?gameweek=${gameweek}` : ''
    return this.request<any[]>(`/matches/${params}`)
  }

  async getPredictions(gameweek?: number) {
    const params = gameweek ? `?gameweek=${gameweek}` : ''
    return this.request<any[]>(`/predictions/${params}`)
  }

  async savePredictions(predictions: any[]) {
    return this.request<any>('/predictions/', {
      method: 'POST',
      body: JSON.stringify({ predictions }),
    })
  }

  async getResults(gameweek?: number) {
    const params = gameweek ? `?gameweek=${gameweek}` : ''
    return this.request<any[]>(`/results/${params}`)
  }

  // User stats and dashboard
  async getUserStats() {
    return this.request<any>('/users/stats/')
  }

  async updateProfile(data: any) {
    return this.request<any>('/users/profile/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request<any>('/users/change-password/', {
      method: 'POST',
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)