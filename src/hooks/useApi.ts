import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/api'

// Leagues
export function useLeagues() {
  return useQuery({
    queryKey: ['leagues'],
    queryFn: () => apiClient.getLeagues(),
  })
}

export function useCreateLeague() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiClient.createLeague,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leagues'] })
    },
  })
}

export function useJoinLeague() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (inviteCode: string) => apiClient.joinLeague(inviteCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leagues'] })
    },
  })
}

export function useLeagueDetails(leagueId: string) {
  return useQuery({
    queryKey: ['league', leagueId],
    queryFn: () => apiClient.getLeagueDetails(leagueId),
    enabled: !!leagueId,
  })
}

// Matches and Predictions
export function useMatches(gameweek?: number) {
  return useQuery({
    queryKey: ['matches', gameweek],
    queryFn: () => apiClient.getMatches(gameweek),
  })
}

export function usePredictions(gameweek?: number) {
  return useQuery({
    queryKey: ['predictions', gameweek],
    queryFn: () => apiClient.getPredictions(gameweek),
  })
}

export function useSavePredictions() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiClient.savePredictions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['predictions'] })
    },
  })
}

export function useResults(gameweek?: number) {
  return useQuery({
    queryKey: ['results', gameweek],
    queryFn: () => apiClient.getResults(gameweek),
  })
}

// User Stats
export function useUserStats() {
  return useQuery({
    queryKey: ['userStats'],
    queryFn: () => apiClient.getUserStats(),
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiClient.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userStats'] })
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      apiClient.changePassword(currentPassword, newPassword),
  })
}