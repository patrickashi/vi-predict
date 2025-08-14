import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout/Layout';
import { ChevronLeft, ChevronRight, Clock, Save, Trophy, Target, Calendar, Loader2, AlertCircle } from 'lucide-react';

// --- TYPE DEFINITIONS for the new API response ---
interface ApiFixture {
  id: number;
  home_team: string;
  away_team: string;
  match_time: string;
  prediction_deadline: string;
  home_team_form: string;
  away_team_form: string;
}

interface ApiGameweek { 
  id: number; 
  number: number; 
}

interface ApiPrediction { 
  id: number;
  fixture: number;
  home_score: number; 
  away_score: number; 
  is_banker: boolean;
  points: number;
  result_status: string;
}

interface ApiFixturesResponse { 
  gameweek: ApiGameweek; 
  fixtures: ApiFixture[]; 
}

interface ApiPredictionsResponse {
  gameweek: ApiGameweek;
  predictions: ApiPrediction[];
}

// --- TYPE DEFINITIONS for your component's design structure ---
interface UiFixture { 
  id: string; 
  homeTeam: string; 
  awayTeam: string; 
  time: string; 
  homeForm: string; 
  awayForm: string; 
}

interface UiMatchDay { 
  id: string; 
  date: string; 
  fixtures: UiFixture[]; 
}


// --- Helper Components ---
const FixturesLoader = () => (
  <div className="flex justify-center items-center py-16">
    <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
  </div>
);

const NoFixturesDisplay = () => (
  <div className="glass-card p-6 sm:p-8 flex flex-col items-center text-center max-w-lg mx-auto">
    <Calendar className="w-12 h-12 sm:w-16 sm:h-16 text-secondary-400 mb-4 sm:mb-6" />
    <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">No Fixtures Available</h3>
    <p className="text-secondary-400 mb-4 sm:mb-6 text-sm sm:text-base">
      There are currently no fixtures scheduled for this gameweek. 
      New fixtures will appear here once they've been added to the system.
    </p>
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
      <button 
        onClick={() => window.location.reload()} 
        className="btn-secondary px-4 py-2 text-sm sm:text-base"
      >
        Refresh Page
      </button>
      <a href="/dashboard" className="btn-primary px-4 py-2 text-sm sm:text-base">
        Back to Dashboard
      </a>
    </div>
  </div>
);

const ErrorDisplay = ({ message, isNotFound = false }: { message: string; isNotFound?: boolean }) => (
  <div className="glass-card p-6 sm:p-8 flex flex-col items-center text-center max-w-lg mx-auto">
    {isNotFound ? (
      <Calendar className="w-12 h-12 sm:w-16 sm:h-16 text-secondary-400 mb-4 sm:mb-6" />
    ) : (
      <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-400 mb-4 sm:mb-6" />
    )}
    
    <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">
      {isNotFound ? "No Gameweek Found" : "Could not load fixtures"}
    </h3>
    
    <p className="text-secondary-400 mb-4 sm:mb-6 text-sm sm:text-base">
      {isNotFound 
        ? "There's no active gameweek at the moment. Check back later when the new gameweek begins."
        : message
      }
    </p>
    
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
      <button 
        onClick={() => window.location.reload()} 
        className="btn-secondary px-4 py-2 text-sm sm:text-base"
      >
        Try Again
      </button>
      <a href="/dashboard" className="btn-primary px-4 py-2 text-sm sm:text-base">
        Back to Dashboard
      </a>
    </div>
  </div>
);

export function Fixtures() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameweekData, setGameweekData] = useState<{ deadline: string; timeLeft: string; matches: UiMatchDay[] } | null>(null);
  const [predictions, setPredictions] = useState<Record<string, { home: string; away: string; banker: boolean }>>({});
  const [currentGameweek, setCurrentGameweek] = useState<number | string>('...');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.headers
      }
    });
    const responseData = await response.json().catch(() => ({}));
    if (!response.ok) {
      const errorMessage = responseData.detail || responseData.message || 'An API error occurred.';
      throw new Error(errorMessage);
    }
    return responseData;
  };

useEffect(() => {
  const fetchAndTransformFixtures = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch fixtures first
      const fixturesResponse = await apiCall('/fixtures/current/');
      const fixturesData: ApiFixturesResponse = fixturesResponse.data;
      
      if (!fixturesData || !fixturesData.fixtures) {
        throw new Error("No fixtures data available.");
      }

      // If no fixtures in the response, show friendly no-fixtures state
      if (fixturesData.fixtures.length === 0) {
        setGameweekData({
          deadline: 'No fixtures',
          timeLeft: 'N/A',
          matches: []
        });
        setCurrentGameweek(fixturesData.gameweek?.number || 'N/A');
        setIsLoading(false);
        return;
      }
      
      setCurrentGameweek(fixturesData.gameweek.number);

      // Try to fetch predictions, but don't fail if they don't exist
      let predictionsData: ApiPredictionsResponse | null = null;
      try {
        const predictionsResponse = await apiCall('/predictions/current/');
        predictionsData = predictionsResponse.data;
      } catch (predError) {
        // Predictions might not exist yet - that's okay, we'll use empty predictions
        console.log('No predictions found, starting with empty predictions');
      }

      // Load existing user predictions (if any)
      const initialPredictions: Record<string, any> = {};
      if (predictionsData && predictionsData.predictions) {
        predictionsData.predictions.forEach((prediction) => {
          initialPredictions[String(prediction.fixture)] = {
            home: String(prediction.home_score),
            away: String(prediction.away_score),
            banker: prediction.is_banker
          };
        });
      }
      setPredictions(initialPredictions);

      // Group fixtures by date
      const groupedFixtures = fixturesData.fixtures.reduce((acc, fixture) => {
        const dateObj = new Date(fixture.match_time);
        const formattedDate = dateObj.toLocaleDateString('en-GB', { 
          weekday: 'short', 
          day: 'numeric', 
          month: 'short' 
        });
        if (!acc[formattedDate]) acc[formattedDate] = [];
        acc[formattedDate].push({
          id: String(fixture.id),
          homeTeam: fixture.home_team,
          awayTeam: fixture.away_team,
          time: dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          homeForm: fixture.home_team_form || '',
          awayForm: fixture.away_team_form || ''
        });
        return acc;
      }, {} as Record<string, UiFixture[]>);

      const matchesForUi: UiMatchDay[] = Object.entries(groupedFixtures).map(([date, fixtures], index) => ({
        id: String(index + 1),
        date,
        fixtures
      }));

      // Calculate earliest deadline
      let earliestDeadline = 'N/A';
      if (fixturesData.fixtures.length > 0) {
        earliestDeadline = new Date(fixturesData.fixtures[0].prediction_deadline).toLocaleString('en-GB', {
          hour: '2-digit', 
          minute: '2-digit', 
          weekday: 'short', 
          day: 'numeric', 
          month: 'short'
        });
      }

      setGameweekData({
        deadline: earliestDeadline,
        timeLeft: 'N/A',
        matches: matchesForUi
      });

    } catch (err) {
      console.error('Error fetching fixtures:', err);
      
      // Check if it's a 404 error specifically
      const is404Error = err instanceof Error && (
        err.message.includes('404') || 
        err.message.includes('Not Found') ||
        err.message.includes('not found')
      );
      
      if (is404Error) {
        setError('NOT_FOUND');
      } else {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  fetchAndTransformFixtures();
}, []);

  const handlePredictionChange = (matchId: string, type: 'home' | 'away', value: string) => {
    const cleanValue = value.replace(/\D/g, '').slice(0, 2);
    setPredictions(prev => ({
      ...prev,
      [matchId]: {
        ...(prev[matchId] || { banker: false, home: '', away: '' }),
        [type]: cleanValue
      }
    }));
    setSaveError('');
    setSaveSuccess('');
  };

  const handleBankerChange = (matchId: string) => {
    setPredictions(prev => {
      const newPredictions = { ...prev };
      
      // Clear all banker selections first
      Object.keys(newPredictions).forEach(id => {
        if (newPredictions[id]) {
          newPredictions[id].banker = false;
        }
      });
      
      // Ensure this fixture exists in predictions state
      if (!newPredictions[matchId]) {
        newPredictions[matchId] = { home: '', away: '', banker: false };
      }
      
      // Toggle banker for this fixture
      newPredictions[matchId].banker = !newPredictions[matchId].banker;
      
      return newPredictions;
    });
    setSaveError('');
    setSaveSuccess('');
  };

  const getFormColor = (result: string) => {
    switch (result) {
      case 'W': return 'bg-green-500';
      case 'D': return 'bg-yellow-500';
      case 'L': return 'bg-red-500';
      default: return 'bg-secondary-600';
    }
  };

  const handleSavePredictions = async () => {
    setIsSaving(true);
    setSaveError('');
    setSaveSuccess('');

    // Get all fixture IDs from gameweekData
    const allFixtureIds = gameweekData?.matches.flatMap(day => day.fixtures.map(f => f.id)) || [];
    
    // Create predictions array for ALL fixtures
    const predictionsArray = allFixtureIds.map(fixtureId => {
      const pred = predictions[fixtureId];
      return {
        fixture: parseInt(fixtureId, 10),
        home_score: parseInt(pred?.home || '0', 10),
        away_score: parseInt(pred?.away || '0', 10),
        is_banker: pred?.banker || false,
      };
    });

    const payload = { predictions: predictionsArray };

    try {
      const response = await apiCall('/predictions/', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setSaveSuccess(response.message || "All predictions saved successfully!");
      
      // Optionally refresh predictions from server after successful save
      // to ensure UI is in sync with server state
      setTimeout(async () => {
        try {
          const predictionsResponse = await apiCall('/predictions/current/');
          const predictionsData: ApiPredictionsResponse = predictionsResponse.data;
          
          if (predictionsData && predictionsData.predictions) {
            const updatedPredictions: Record<string, any> = {};
            predictionsData.predictions.forEach((prediction) => {
              updatedPredictions[String(prediction.fixture)] = {
                home: String(prediction.home_score),
                away: String(prediction.away_score),
                banker: prediction.is_banker
              };
            });
            setPredictions(updatedPredictions);
          }
        } catch (refreshError) {
          // Silent fail on refresh - predictions are already saved
          console.error('Failed to refresh predictions after save:', refreshError);
        }
      }, 1000);
      
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save predictions.');
    } finally {
      setIsSaving(false);
    }
  };

  // Count predictions that have been changed (either scores filled or banker selected)
  const totalPredictionsMade = Object.values(predictions).filter(p => 
    (p.home.trim() !== '' && p.away.trim() !== '') || p.banker
  ).length;

  const bankerSelected = Object.values(predictions).some(p => p.banker);

if (isLoading) return <Layout><FixturesLoader /></Layout>;

if (error === 'NOT_FOUND') {
  return (
    <Layout>
      <ErrorDisplay message="" isNotFound={true} />
    </Layout>
  );
}

if (error) {
  return (
    <Layout>
      <ErrorDisplay message={error} />
    </Layout>
  );
}

if (!gameweekData) {
  return (
    <Layout>
      <ErrorDisplay message="No fixtures data available." isNotFound={true} />
    </Layout>
  );
}

// Handle case where gameweek exists but no fixtures
if (gameweekData.matches.length === 0) {
  return (
    <Layout>
      <div className="space-y-3 sm:space-y-4 max-w-[95vw] md:max-w-[90vw] lg:max-w-[85vw] xl:max-w-[80vw] 2xl:max-w-[75vw] mx-auto px-2 sm:px-4 lg:px-6">
        {/* Header for empty state */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
            <button disabled className="p-1 sm:p-1.5 text-secondary-400 rounded-lg disabled:opacity-50">
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-primary-400" />
              <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white">Gameweek {currentGameweek}</h1>
            </div>
            <button disabled className="p-1 sm:p-1.5 text-secondary-400 rounded-lg disabled:opacity-50">
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
        
        <NoFixturesDisplay />
      </div>
    </Layout>
  );
}
  return (
    <Layout>
      <div className="space-y-3 sm:space-y-4 lg:space-y-5 max-w-[95vw] md:max-w-[90vw] lg:max-w-[85vw] xl:max-w-[80vw] 2xl:max-w-[75vw] mx-auto px-2 sm:px-3 lg:px-4 xl:px-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
            <button disabled className="p-1 sm:p-1.5 text-secondary-400 rounded-lg disabled:opacity-50">
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </button>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 text-primary-400" />
              <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white">Gameweek {currentGameweek}</h1>
            </div>
            <button disabled className="p-1 sm:p-1.5 text-secondary-400 rounded-lg disabled:opacity-50">
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </button>
          </div>
          
          <div className="flex items-center justify-center flex-wrap gap-x-3 sm:gap-x-4 lg:gap-x-5 gap-y-1.5 sm:gap-y-2 text-xs sm:text-sm mb-3 sm:mb-4">
            <div className="flex items-center space-x-1 sm:space-x-1.5">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-secondary-400" />
              <span className="text-secondary-300">Deadline: {gameweekData.deadline}</span>
            </div>
            {gameweekData.timeLeft !== 'N/A' && (
              <div className="text-red-400 font-medium bg-red-500/10 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm">
                ⏰ {gameweekData.timeLeft}
              </div>
            )}
          </div>
          
          <div className="flex justify-center space-x-2 sm:space-x-3 lg:space-x-4 mb-3 sm:mb-4 lg:mb-5">
            <div className="bg-primary-600/10 border border-primary-500/20 rounded-lg px-2 py-1 sm:px-2.5 sm:py-1.5 lg:px-3 lg:py-2">
              <div className="flex items-center space-x-1 sm:space-x-1.5">
                <Target className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-primary-400" />
                <span className="text-white font-medium text-xs sm:text-sm">{totalPredictionsMade} Predictions</span>
              </div>
            </div>
            <div className={`border rounded-lg px-2 py-1 sm:px-2.5 sm:py-1.5 lg:px-3 lg:py-2 ${bankerSelected ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-secondary-800/50 border-secondary-700'}`}>
              <div className="flex items-center space-x-1 sm:space-x-1.5">
                <Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-yellow-400" />
                <span className="text-white font-medium text-xs sm:text-sm">{bankerSelected ? 'Banker Selected' : 'No Banker'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fixtures */}
        <div className="space-y-2.5 sm:space-y-3 lg:space-y-4">
          {gameweekData.matches.map((day) => (
            <div key={day.id} className="glass-card p-2 sm:p-3 lg:p-4">
              <h3 className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-white mb-2.5 sm:mb-3 lg:mb-4 text-center border-b border-secondary-700 pb-2 sm:pb-2.5 lg:pb-3">
                {day.date}
              </h3>
              
              <div className="space-y-2 sm:space-y-2.5 lg:space-y-3">
                {day.fixtures.map((fixture) => (
                  <div key={fixture.id} className="bg-secondary-800/50 rounded-xl p-2 sm:p-2.5 lg:p-3 xl:p-4 hover:bg-secondary-800/70 transition-colors">
                    
                    {/* Mobile Layout */}
                    <div className="sm:hidden">
                      {/* Teams and Score Inputs Row */}
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <div className="text-white font-bold text-sm truncate flex-1 text-right">
                            {fixture.homeTeam}
                          </div>
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="\d*"
                            maxLength={2}
                            value={predictions[fixture.id]?.home || ''}
                            onChange={(e) => handlePredictionChange(fixture.id, 'home', e.target.value)}
                            disabled={isSaving}
                            className="w-9 h-9 bg-secondary-700 border-2 border-secondary-600 text-white text-lg font-bold text-center rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="0"
                          />
                        </div>

                        <div className="flex flex-col items-center mx-2.5">
                          <div className="text-secondary-400 font-bold text-xs">VS</div>
                          <div className="text-primary-400 font-medium text-xs bg-primary-600/10 px-1.5 py-0.5 rounded-full mt-0.5">
                            {fixture.time}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="\d*"
                            maxLength={2}
                            value={predictions[fixture.id]?.away || ''}
                            onChange={(e) => handlePredictionChange(fixture.id, 'away', e.target.value)}
                            disabled={isSaving}
                            className="w-9 h-9 bg-secondary-700 border-2 border-secondary-600 text-white text-lg font-bold text-center rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="0"
                          />
                          <div className="text-white font-bold text-sm truncate flex-1">
                            {fixture.awayTeam}
                          </div>
                        </div>
                      </div>

                      {/* Form and Banker Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-1">
                          {fixture.homeForm.split('').slice(0, 5).map((result, i) => (
                            <div key={i} className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-xs font-bold text-white ${getFormColor(result)}`}>
                              {result}
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-col items-center">
                          <label className="flex flex-col items-center cursor-pointer">
                            <Trophy className={`w-4 h-4 mb-1 ${predictions[fixture.id]?.banker ? 'text-yellow-400' : 'text-secondary-600'}`} />
                            <input
                              type="checkbox"
                              checked={predictions[fixture.id]?.banker || false}
                              onChange={() => handleBankerChange(fixture.id)}
                              disabled={isSaving}
                              className="w-3.5 h-3.5 text-yellow-500 bg-secondary-700 border-secondary-600 rounded focus:ring-yellow-500 disabled:opacity-50"
                            />
                            <span className="text-xs text-secondary-300 font-medium mt-0.5">Banker</span>
                          </label>
                        </div>

                        <div className="flex space-x-1">
                          {fixture.awayForm.split('').slice(0, 5).map((result, i) => (
                            <div key={i} className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-xs font-bold text-white ${getFormColor(result)}`}>
                              {result}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Desktop/Tablet Layout */}
                    <div className="hidden sm:flex items-center justify-between">
                      {/* Home Team */}
                      <div className="flex items-center space-x-2 lg:space-x-3 flex-1">
                        <div className="text-right min-w-0 flex-1">
                          <div className="text-white font-bold text-xs sm:text-sm lg:text-base xl:text-lg mb-1 truncate">
                            {fixture.homeTeam}
                          </div>
                          <div className="flex justify-end space-x-0.5 mb-1">
                            {fixture.homeForm.split('').map((result, i) => (
                              <div key={i} className={`w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 rounded-full flex items-center justify-center text-xs font-bold text-white ${getFormColor(result)}`}>
                                {result}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Home Score Input */}
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="\d*"
                          maxLength={2}
                          value={predictions[fixture.id]?.home || ''}
                          onChange={(e) => handlePredictionChange(fixture.id, 'home', e.target.value)}
                          disabled={isSaving}
                          className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 bg-secondary-700 border-2 border-secondary-600 text-white text-sm lg:text-base xl:text-lg font-bold text-center rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="0"
                        />
                      </div>

                      {/* VS and Time */}
                      <div className="flex flex-col items-center space-y-1 mx-2.5 sm:mx-3 lg:mx-4">
                        <div className="text-secondary-400 font-bold text-xs sm:text-sm lg:text-base">VS</div>
                        <div className="text-primary-400 font-medium text-xs sm:text-sm bg-primary-600/10 px-1.5 py-0.5 lg:px-2 lg:py-1 rounded-full">
                          {fixture.time}
                        </div>
                      </div>

                      {/* Away Team */}
                      <div className="flex items-center space-x-2 lg:space-x-3 flex-1">
                        {/* Away Score Input */}
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="\d*"
                          maxLength={2}
                          value={predictions[fixture.id]?.away || ''}
                          onChange={(e) => handlePredictionChange(fixture.id, 'away', e.target.value)}
                          disabled={isSaving}
                          className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 bg-secondary-700 border-2 border-secondary-600 text-white text-sm lg:text-base xl:text-lg font-bold text-center rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="0"
                        />
                        
                        <div className="text-left min-w-0 flex-1">
                          <div className="text-white font-bold text-xs sm:text-sm lg:text-base xl:text-lg mb-1 truncate">
                            {fixture.awayTeam}
                          </div>
                          <div className="flex space-x-0.5 mb-1">
                            {fixture.awayForm.split('').map((result, i) => (
                              <div key={i} className={`w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 rounded-full flex items-center justify-center text-xs font-bold text-white ${getFormColor(result)}`}>
                                {result}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Banker */}
                      <div className="ml-2 lg:ml-3">
                        <label className="flex flex-col items-center space-y-1 cursor-pointer">
                          <Trophy className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${predictions[fixture.id]?.banker ? 'text-yellow-400' : 'text-secondary-600'}`} />
                          <input
                            type="checkbox"
                            checked={predictions[fixture.id]?.banker || false}
                            onChange={() => handleBankerChange(fixture.id)}
                            disabled={isSaving}
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-500 bg-secondary-700 border-secondary-600 rounded focus:ring-yellow-500 disabled:opacity-50"
                          />
                          <span className="text-xs text-secondary-300 font-medium">Banker</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="text-center space-y-2 sm:space-y-3 pb-3 sm:pb-4 lg:pb-5">
          {saveError && <p className="text-red-400 text-xs sm:text-sm font-medium">{saveError}</p>}
          {saveSuccess && <p className="text-green-400 text-xs sm:text-sm font-medium">{saveSuccess}</p>}
          
          <button
            onClick={handleSavePredictions}
            disabled={isSaving}
            className="btn-primary flex items-center space-x-1.5 sm:space-x-2 mx-auto text-xs sm:text-sm lg:text-base px-4 py-2.5 sm:px-5 sm:py-3 lg:px-6 lg:py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : <Save className="w-4 h-4 sm:w-5 sm:h-5" />}
            <span>
              {isSaving 
                ? 'Saving...' 
                : `Save All Predictions ${totalPredictionsMade > 0 ? `(${totalPredictionsMade} changed)` : ''}`
              }
            </span>
          </button>
        </div>
      </div>
    </Layout>
  );
}