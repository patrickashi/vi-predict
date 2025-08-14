import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// --- Import your page components ---
import { Home } from './pages/Home';
import { SignIn } from './pages/Auth/SignIn';
import { SignUp } from './pages/Auth/SignUp';
import { ForgotPassword } from './pages/Auth/ForgotPassword';
import { Dashboard } from './pages/Dashboard';
import { Leagues } from './pages/Leagues';
import { LeagueDetails } from './pages/LeagueDetails';
import { LeaguePlayers } from './pages/LeaguePlayers';
import { Fixtures } from './pages/Fixtures';
import { Results } from './pages/Results';
import { Settings } from './pages/Settings';
import { Help } from './pages/Help';
import { GameweeksHistory } from './pages/GameweeksHistory';
import { About } from './pages/About';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';
import { CountryClubSelection } from './pages/Onboarding/CountryClubSelection';
import { OtpVerification } from './pages/Auth/OtpVerification';
import { PlayerDashboard } from './pages/PlayerDashboard';

const queryClient = new QueryClient();

// --- MODIFICATION: Helper component to protect routes ---
// This component checks if a user is logged in. If not, it redirects them to the sign-in page.
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = !!localStorage.getItem('authToken');
  return isAuthenticated ? children : <Navigate to="/signin" replace />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Routes>
            {/* --- Public Routes --- */}
            {/* These routes are accessible to everyone, logged in or not. */}
            <Route path="/home" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/verify-otp" element={<OtpVerification />} />
            <Route path="/about" element={<About />} />
            <Route path="/help" element={<Help />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            
            {/* --- Protected Routes --- */}
            {/* These routes require the user to be logged in. */}
            <Route 
              path="/onboarding/country-club-selection" 
              element={<PrivateRoute><CountryClubSelection /></PrivateRoute>} 
            />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/leagues" element={<PrivateRoute><Leagues /></PrivateRoute>} />
            <Route path="/leagues/:id" element={<PrivateRoute><LeagueDetails /></PrivateRoute>} />
            <Route path="/leagues/:id/players" element={<PrivateRoute><LeaguePlayers /></PrivateRoute>} />
            <Route path="/leagues/:leagueId/player/:playerId" element={<PrivateRoute><PlayerDashboard /></PrivateRoute>} />
            <Route path="/fixtures" element={<PrivateRoute><Fixtures /></PrivateRoute>} />
            <Route path="/prediction" element={<PrivateRoute><Fixtures /></PrivateRoute>} />
            <Route path="/results" element={<PrivateRoute><Results /></PrivateRoute>} />
            <Route path="/leaderboard" element={<PrivateRoute><Leagues /></PrivateRoute>} />
            <Route path="/gameweeks" element={<PrivateRoute><Fixtures /></PrivateRoute>} />
            <Route path="/gameweeks-history" element={<PrivateRoute><GameweeksHistory /></PrivateRoute>} />
            <Route path="/leagues/:leagueId/player/:playerId/gameweeks-history" element={<PrivateRoute><GameweeksHistory /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            
            {/* --- Root & Catch-all Routes --- */}
            {/* The main entry point of the app. It redirects based on auth state. */}
            <Route 
              path="/" 
              element={
                localStorage.getItem('authToken') 
                  ? <Navigate to="/dashboard" replace /> 
                  : <Navigate to="/signin" replace />
              } 
            />
            {/* Any other unknown path will redirect to the root, which then handles auth redirection. */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;