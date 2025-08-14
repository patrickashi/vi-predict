// src/pages/Dashboard.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import { TrendingUp, TrendingDown, Trophy, Target, Percent, Award, Loader2, AlertCircle } from 'lucide-react';

// --- TYPE DEFINITIONS for API data ---
interface CurrentSeasonStats {
  total_points: number;
  total_predictions: number;
  accuracy: string; // Comes as a string like "35.70"
  exact_scores: number;
  global_rank: number;
}

interface RecentGameweek {
  // Assuming the structure based on your original dummy data
  id: number; // It's good practice for lists to have a unique ID
  gameweek_name: string; // e.g., "GW 20"
  total_predictions: number;
  correct_results: number;
  exact_scores: number;
  accuracy: string;
  points_earned: number;
}

interface TeamAccuracy {
  team: string;
  accuracy: number;
}

interface DashboardData {
  current_season_stats: CurrentSeasonStats;
  recent_gameweeks: RecentGameweek[];
  global_rank: number;
  leagues_count: number;
  rank_movement: string;
  hot_teams: TeamAccuracy[];
  cold_teams: TeamAccuracy[];
}

// --- Helper Components for Loading/Error states ---
const DashboardLoader = () => (
  <div className="flex justify-center items-center py-20">
    <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
  </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
    <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
    <h3 className="text-xl font-semibold text-white mb-2">Could not load dashboard</h3>
    <p className="text-secondary-400">{message}</p>
  </div>
);

export function Dashboard() {
  // --- STATE MANAGEMENT ---
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- API HELPER ---
  const apiCall = async (endpoint: string) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Failed to fetch data from ${endpoint}`);
    }
    return response.json();
  };

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await apiCall('/stats/dashboard/');
        // The actual data is nested inside the 'data' key
        setDashboardData(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
        console.error("Dashboard fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []); // Empty dependency array means this runs once on mount

  // Using optional chaining (?.) and fallback values (|| 0) for safety
  const stats = dashboardData?.current_season_stats;
  const recentGameWeeks = dashboardData?.recent_gameweeks || [];
  const hotTeams = dashboardData?.hot_teams || [];
  const coldTeams = dashboardData?.cold_teams || [];

  return (
    <Layout>
      {isLoading ? (
        <DashboardLoader />
      ) : error ? (
        <ErrorDisplay message={error} />
      ) : (
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary-600/20 rounded-lg">
                  <Trophy className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <p className="text-secondary-400 text-sm">Total Points</p>
                  <p className="text-2xl font-bold text-white">{stats?.total_points || 0}</p>
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
                  <p className="text-2xl font-bold text-white">{stats?.total_predictions || 0}</p>
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
                  <p className="text-2xl font-bold text-white">{parseFloat(stats?.accuracy || '0').toFixed(0)}</p>
                </div>
              </div>
            </div>
            <div className="glass-card p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary-600/20 rounded-lg">
                  <Award className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <p className="text-secondary-400 text-sm">Correct Scores</p>
                  <p className="text-2xl font-bold text-white">{stats?.exact_scores || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hot and Cold Teams */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hot Teams */}
            <div className="glass-card p-6">
              <div className="flex items-center space-x-2 mb-6">
                <TrendingUp className="w-5 h-5 text-red-400" />
                <h3 className="text-xl font-semibold text-white">Your Hot Teams</h3>
              </div>
              <div className="space-y-4">
                {hotTeams.length > 0 ? (
                  hotTeams.map((team, index) => (
                    <div key={`hot-${index}`} className="flex items-center justify-between">
                      <span className="text-white">{team.team}</span>
                      <span className="text-primary-400 font-medium">{team.accuracy}% Accuracy</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-secondary-400 text-sm">No hot teams yet</p>
                    <p className="text-secondary-500 text-xs mt-1">Make more predictions to see your best teams</p>
                  </div>
                )}
              </div>
            </div>

            {/* Cold Teams */}
            <div className="glass-card p-6">
              <div className="flex items-center space-x-2 mb-6">
                <TrendingDown className="w-5 h-5 text-blue-400" />
                <h3 className="text-xl font-semibold text-white">Your Cold Teams</h3>
              </div>
              <div className="space-y-4">
                {coldTeams.length > 0 ? (
                  coldTeams.map((team, index) => (
                    <div key={`cold-${index}`} className="flex items-center justify-between">
                      <span className="text-white">{team.team}</span>
                      <span className="text-secondary-400 font-medium">{team.accuracy}% Accuracy</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-secondary-400 text-sm">No cold teams</p>
                    <p className="text-secondary-500 text-xs mt-1">Great! You're predicting well across all teams</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Game Weeks */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Recent Game Weeks</h3>

              {/* use link /gameweeks-history  when page backend is available */}
              <Link to="#" className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors">
                View all ↗
              </Link> 
            </div>
            <div className="overflow-x-auto">
              {recentGameWeeks.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-secondary-700">
                      <th className="text-left py-3 px-4 text-secondary-400 font-medium">Game Week</th>
                      <th className="text-left py-3 px-4 text-secondary-400 font-medium">Predictions</th>
                      <th className="text-left py-3 px-4 text-secondary-400 font-medium">Correct Results</th>
                      <th className="text-left py-3 px-4 text-secondary-400 font-medium">Correct Scores</th>
                      <th className="text-left py-3 px-4 text-secondary-400 font-medium">% Accuracy</th>
                      <th className="text-left py-3 px-4 text-secondary-400 font-medium">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentGameWeeks.map((week) => (
                      // IMPORTANT: Use a unique key from your data, like week.id
                      <tr key={week.id} className="border-b border-secondary-800 hover:bg-secondary-800/30">
                        <td className="py-3 px-4 text-white font-medium">{week.gameweek_name}</td>
                        <td className="py-3 px-4 text-white">{week.total_predictions}</td>
                        <td className="py-3 px-4 text-white">{week.correct_results}</td>
                        <td className="py-3 px-4 text-white">{week.exact_scores}</td>
                        <td className="py-3 px-4 text-white">{parseFloat(week.accuracy).toFixed(0)}%</td>
                        <td className="py-3 px-4 text-white font-medium">{week.points_earned}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-10">
                  <p className="text-secondary-400">No recent gameweek data available.</p>
                  <p className="text-sm text-secondary-500 mt-2">Make some predictions to get started!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}