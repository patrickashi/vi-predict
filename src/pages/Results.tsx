import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout/Layout';
import { ChevronLeft, ChevronRight, Trophy, Target, Award, TrendingUp, Calendar, Crown, ListChecks, BarChart2, Loader2, AlertCircle } from 'lucide-react';

// --- TYPE DEFINITIONS for the new, rich API response ---
interface ApiUserStats {
    total_points: number;
    correct_results: number;
    exact_scores: number;
    accuracy: number;
    wrong_results: number;
}
interface ApiMatchResult {
    fixture_id: number;
    home_team: string;
    away_team: string;
    actual_home_score: number;
    actual_away_score: number;
    predicted_home_score: number;
    predicted_away_score: number;
    points_earned: number;
    is_banker: boolean;
    result_status: 'exact' | 'correct' | 'wrong';
}
interface ApiGlobalBenchmarks {
    highest_points: number;
    average_points: number;
}
interface ApiResponseData {
    user_stats: ApiUserStats;
    matches: ApiMatchResult[];
    global_benchmarks: ApiGlobalBenchmarks;
}

// --- Helper Components for Loading/Error states ---
const ResultsLoader = () => (<div className="flex justify-center items-center py-20"><Loader2 className="w-12 h-12 text-primary-500 animate-spin" /></div>);
const ErrorDisplay = ({ message }: { message: string }) => (<div className="glass-card p-6 flex flex-col items-center text-center"><AlertCircle className="w-12 h-12 text-red-400 mb-4" /><h3 className="text-xl font-semibold text-white mb-2">Could not load results</h3><p className="text-secondary-400">{message}</p></div>);

export function Results() {
  // --- STATE MANAGEMENT ---
  const [currentGameweek, setCurrentGameweek] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resultsData, setResultsData] = useState<{
    totalPoints: number;
    correctPredictions: number;
    correctScores: number;
    accuracy: number;
    matches: any[];
    highestPoints: number;
    averagePoints: number;
    wrongResults: number;
  } | null>(null);
  
  // --- API HELPER ---
  const apiCall = async (endpoint: string) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' },
    });
    const responseData = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(responseData.detail || `Failed to fetch from ${endpoint}`);
    return responseData;
  };

  // --- DATA FETCHING & TRANSFORMATION ---
  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);
      setResultsData(null);
      try {
        const response = await apiCall(`/predictions/gameweek/${currentGameweek}/user-stats/`);
        const apiData: ApiResponseData = response.data;

        if (!apiData || !apiData.user_stats || !apiData.matches || !apiData.global_benchmarks) {
            throw new Error("Results data from API is incomplete or missing.");
        }

        // Transform the rich API data into your component's `resultsData` structure
        const transformedData = {
          totalPoints: apiData.user_stats.total_points,
          correctPredictions: apiData.user_stats.correct_results,
          correctScores: apiData.user_stats.exact_scores,
          accuracy: Math.round(apiData.user_stats.accuracy),
          highestPoints: apiData.global_benchmarks.highest_points,
          averagePoints: Math.round(apiData.global_benchmarks.average_points),
          wrongResults: apiData.user_stats.wrong_results,
          matches: apiData.matches.map(p => ({
            id: p.fixture_id,
            homeTeam: p.home_team,
            awayTeam: p.away_team,
            homeScore: p.actual_home_score,
            awayScore: p.actual_away_score,
            prediction: { home: p.predicted_home_score, away: p.predicted_away_score },
            points: p.points_earned,
            banker: p.is_banker,
            result: p.result_status,
            homeForm: '', // API does not provide form, default to empty
            awayForm: '', // API does not provide form, default to empty
          }))
        };
        setResultsData(transformedData);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [currentGameweek]);

  // --- Helper Functions (Your original code) ---
  const getResultColor = (result: string) => { switch (result) { case 'exact': return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400'; case 'correct': return 'bg-green-500/20 border-green-500/30 text-green-400'; case 'wrong': return 'bg-red-500/20 border-red-500/30 text-red-400'; default: return 'bg-secondary-800/50 border-secondary-700 text-secondary-400'; } };
  const getResultIcon = (result: string) => { switch (result) { case 'exact': return '🎯'; case 'correct': return '✅'; case 'wrong': return '❌'; default: return '⚪'; } };
  const getFormColor = (result: string) => { switch (result) { case 'W': return 'bg-green-500'; case 'D': return 'bg-yellow-500'; case 'L': return 'bg-red-500'; default: return 'bg-secondary-600'; } };

  if (isLoading) return <Layout><ResultsLoader /></Layout>;
  if (error) return <Layout><ErrorDisplay message={error} /></Layout>;
  if (!resultsData) return <Layout><ErrorDisplay message="No results found for this gameweek." /></Layout>;

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header (Responsive) */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 md:space-x-4 mb-4">
            <button onClick={() => setCurrentGameweek(prev => Math.max(1, prev - 1))} className="p-2 text-secondary-400 hover:text-white transition-colors rounded-lg hover:bg-secondary-800 disabled:opacity-50" disabled={currentGameweek <= 1}><ChevronLeft className="w-6 h-6" /></button>
            <div className="flex items-center space-x-2 md:space-x-3"><Trophy className="w-7 h-7 md:w-8 md:h-8 text-primary-400" /><h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Gameweek {currentGameweek} Results</h1></div>
            <button onClick={() => setCurrentGameweek(prev => prev + 1)} className="p-2 text-secondary-400 hover:text-white transition-colors rounded-lg hover:bg-secondary-800"><ChevronRight className="w-6 h-6" /></button>
          </div>
        </div>

        {/* Stats Overview (Responsive) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="glass-card p-4 md:p-6 text-center"><div className="flex items-center justify-center space-x-2 mb-2"><Trophy className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" /><span className="text-xl md:text-2xl font-bold text-white">{resultsData.totalPoints}</span></div><p className="text-secondary-400 text-xs md:text-sm">Total Points</p></div>
          <div className="glass-card p-4 md:p-6 text-center"><div className="flex items-center justify-center space-x-2 mb-2"><Target className="w-5 h-5 md:w-6 md:h-6 text-green-400" /><span className="text-xl md:text-2xl font-bold text-white">{resultsData.correctPredictions}</span></div><p className="text-secondary-400 text-xs md:text-sm">Correct Results</p></div>
          <div className="glass-card p-4 md:p-6 text-center"><div className="flex items-center justify-center space-x-2 mb-2"><Award className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" /><span className="text-xl md:text-2xl font-bold text-white">{resultsData.correctScores}</span></div><p className="text-secondary-400 text-xs md:text-sm">Exact Scores</p></div>
          <div className="glass-card p-4 md:p-6 text-center"><div className="flex items-center justify-center space-x-2 mb-2"><TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-primary-400" /><span className="text-xl md:text-2xl font-bold text-white">{resultsData.accuracy}%</span></div><p className="text-secondary-400 text-xs md:text-sm">Accuracy</p></div>
        </div>

        {/* Results */}
        <div className="glass-card p-4 md:p-8">
          <div className="mb-8"><div className="flex items-center justify-between mb-4"><div className="text-center"><div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 backdrop-blur-md border border-yellow-500/30 rounded-xl p-3 shadow-lg inline-block"><Crown className="w-6 h-6 text-yellow-400 mx-auto mb-2" /><div className="text-2xl font-bold text-yellow-400 animate-pulse">{resultsData.highestPoints}</div></div><div className="text-yellow-300/80 text-sm font-medium mt-2">Highest Points</div></div><div className="text-center hidden sm:block"><div className="flex items-center justify-center space-x-2 mb-2"><ListChecks className="w-6 h-6 text-white" /><h3 className="text-2xl font-bold text-white">Match Results</h3></div><p className="text-secondary-400">Your predictions vs actual results</p></div><div className="text-center"><div className="flex items-center justify-center space-x-2"><BarChart2 className="w-5 h-5 text-green-400" /><div className="text-lg font-bold text-green-400">{resultsData.averagePoints}</div></div><div className="text-secondary-400 text-sm">Average Points</div></div></div></div>
          
          <div className="space-y-4">
            {resultsData.matches.map((match, index) => (
              <div key={match.id || index} className={`rounded-xl p-4 md:p-6 border-2 ${getResultColor(match.result)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-center space-x-2 sm:space-x-4 md:space-x-6 flex-1">
                    <div className="flex items-center justify-end min-w-0 flex-1"><div className="text-right"><div className="text-white font-bold text-base md:text-lg truncate mb-1">{match.homeTeam}</div><div className="hidden md:flex justify-end space-x-1">{match.homeForm.split('').map((r, i) => (<div key={i} className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold text-white ${getFormColor(r)}`}>{r}</div>))}</div></div></div>
                    <div className="flex items-center space-x-1 md:space-x-2"><div className="w-10 h-10 md:w-12 md:h-12 bg-primary-600 text-white rounded-lg flex items-center justify-center text-lg md:text-xl font-bold">{match.homeScore}</div><div className="text-secondary-400 text-xs md:text-sm font-medium">({match.prediction.home})</div></div>
                    <div className="text-secondary-400 font-bold text-lg md:text-xl px-1 md:px-3">VS</div>
                    <div className="flex items-center space-x-1 md:space-x-2"><div className="text-secondary-400 text-xs md:text-sm font-medium">({match.prediction.away})</div><div className="w-10 h-10 md:w-12 md:h-12 bg-primary-600 text-white rounded-lg flex items-center justify-center text-lg md:text-xl font-bold">{match.awayScore}</div></div>
                    <div className="flex items-center justify-start min-w-0 flex-1"><div className="text-left"><div className="text-white font-bold text-base md:text-lg truncate mb-1">{match.awayTeam}</div><div className="hidden md:flex space-x-1">{match.awayForm.split('').map((r, i) => (<div key={i} className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold text-white ${getFormColor(r)}`}>{r}</div>))}</div></div></div>
                  </div>
                  <div className="ml-2 sm:ml-4 md:ml-6 flex items-center space-x-2 md:space-x-4">
                    {match.banker && (<div className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs md:text-sm font-bold border border-yellow-500/30 hidden sm:block">🏆 BANKER</div>)}
                    <div className="text-center"><div className="text-xl md:text-2xl mb-1">{getResultIcon(match.result)}</div><div className="text-xl md:text-2xl font-bold text-white">{match.points}</div><div className="text-xs text-secondary-400">points</div></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="glass-card p-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Gameweek Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center"><div className="text-4xl mb-2">🎯</div><div className="text-xl font-bold text-yellow-400">{resultsData.correctScores}</div><div className="text-secondary-400">Perfect Scores</div></div>
            <div className="text-center"><div className="text-4xl mb-2">✅</div><div className="text-xl font-bold text-green-400">{resultsData.correctPredictions}</div><div className="text-secondary-400">Correct Results</div></div>
            <div className="text-center"><div className="text-4xl mb-2">❌</div><div className="text-xl font-bold text-red-400">{resultsData.wrongResults}</div><div className="text-secondary-400">Wrong Results</div></div>
          </div>
        </div>
      </div>
    </Layout>
  )
}