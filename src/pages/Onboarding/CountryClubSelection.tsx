import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Trophy, Search, ChevronDown, Loader2 } from 'lucide-react';

// --- TYPE DEFINITIONS ---
// This tells TypeScript the exact shape of your API data, removing all "red underlines".
interface League {
  id: number;
  name: string;
}

interface Country {
  id: number;
  name: string;
  flag: string | null;
}

interface Club {
  id: number;
  name: string;
  logo: string | null;
  league: League | null;
}

// --- A SIMPLE LOADER COMPONENT ---
// Used while we check the user's onboarding status.
const FullScreenLoader = () => (
    <div className="min-h-screen bg-secondary-950 flex items-center justify-center">
      <Loader2 className="w-16 h-16 text-primary-500 animate-spin" />
    </div>
);


export function CountryClubSelection() {
  const navigate = useNavigate();

  // --- STATE MANAGEMENT ---
  // State for the initial status check
  const [isCheckingStatus, setIsCheckingStatus] = useState<boolean>(true);

  // States for the form itself
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);
  const [selectedClub, setSelectedClub] = useState<string>('');
  const [selectedClubId, setSelectedClubId] = useState<number | null>(null);
  
  const [countrySearch, setCountrySearch] = useState<string>('');
  const [clubSearch, setClubSearch] = useState<string>('');
  
  const [showCountryDropdown, setShowCountryDropdown] = useState<boolean>(false);
  const [showClubDropdown, setShowClubDropdown] = useState<boolean>(false);

  const [countries, setCountries] = useState<Country[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  
  const [isLoadingCountries, setIsLoadingCountries] = useState<boolean>(true);
  const [isLoadingClubs, setIsLoadingClubs] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // --- API HELPER FUNCTION ---
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.vi-predict.com/api';
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '', ...options.headers },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(`HTTP ${response.status}: ${errorData.message || errorData.detail || 'Unknown error'}`);
      }
      return response.status === 204 ? null : await response.json();
    } catch (err) {
      console.error(`API call to ${endpoint} failed:`, err);
      throw err;
    }
  };

  // --- DATA FETCHING & STATUS CHECKS ---

  // 1. PRIMARY EFFECT: Check onboarding status first.
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const response = await apiCall('/onboarding/status/');
        // IMPORTANT: Adjust `response.is_complete` to match your actual API response key
        if (response && response.is_complete) {
          navigate('/dashboard', { replace: true });
        } else {
          // If not complete, we can proceed to show the form.
          setIsCheckingStatus(false);
        }
      } catch (err) {
        console.error("Onboarding status check failed. Assuming user needs onboarding.");
        setIsCheckingStatus(false); // Show the form even if the check fails
      }
    };
    checkOnboardingStatus();
  }, [navigate]);

  // 2. SECONDARY EFFECTS: Fetch form data only if the user needs onboarding.
  useEffect(() => {
    // Don't run these fetches until the status check is done.
    if (isCheckingStatus) return;

    const fetchInitialData = async () => {
        // Fetch countries
        try {
            const countryData: Country[] = await apiCall('/onboarding/countries/');
            setCountries(countryData?.data || []);
        } catch (err) {
            setError('Could not load countries. Please refresh the page.');
        } finally {
            setIsLoadingCountries(false);
        }

        // Fetch any existing preferences to pre-fill the form
        try {
            const prefData = await apiCall('/onboarding/preferences/');
            if (prefData?.country) {
                setSelectedCountry(prefData.country.name);
                setSelectedCountryId(prefData.country.id);
                setCountrySearch(prefData.country.name);
            }
            if (prefData?.club) {
                setSelectedClub(prefData.club.name);
                setSelectedClubId(prefData.club.id);
                setClubSearch(prefData.club.name);
            }
        } catch (err) {
            console.log("No existing preferences found. That's okay.");
        }
    };

    fetchInitialData();
  }, [isCheckingStatus]); // This block runs only once after the status check passes.


  // 3. DEBOUNCED SEARCH: Fetch clubs when user interacts with the club dropdown.
 // In CountryClubSelection.tsx, replace the club-fetching useEffect with this:

useEffect(() => {
    // This gatekeeper logic is correct and should remain.
    if (isCheckingStatus || !showClubDropdown) return;

    const fetchClubs = async () => {
      setIsLoadingClubs(true);
      try {
        const params = new URLSearchParams();
        if (clubSearch.trim()) params.append('search', clubSearch.trim());
        if (selectedCountryId) params.append('country_id', selectedCountryId.toString());
        
        // --- MODIFICATION START ---
        // The server requires a GET request, so we will not specify a method or body.
        // However, we will explicitly pass an empty options object to ensure our
        // apiCall helper function sends the default headers, including 'Content-Type'.
        
        const clubData = await apiCall(
          // The endpoint with query parameters
          `/onboarding/clubs/?${params.toString()}`,
          
          // Pass an empty options object. Our `apiCall` helper will merge
          // its default headers (like Content-Type and Authorization) into this.
          {} 
        );
        // --- MODIFICATION END ---
        
        // This part is correct, assuming the response structure is consistent.
        setClubs(clubData?.data || []);

      } catch (err) {
        console.error('Error fetching clubs:', err);
      } finally {
        setIsLoadingClubs(false);
      }
    };

    // The debounce logic is correct and should remain.
    const debounceTimeout = setTimeout(fetchClubs, 300);
    return () => clearTimeout(debounceTimeout);

}, [clubSearch, selectedCountryId, showClubDropdown, isCheckingStatus]);
  // --- EVENT HANDLERS ---
  const filteredCountries = countries.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase()));
  const handleCountrySelect = (country: Country) => { /* ... (handler code is unchanged) ... */ setSelectedCountry(country.name); setSelectedCountryId(country.id); setCountrySearch(country.name); setShowCountryDropdown(false); setSelectedClub(''); setSelectedClubId(null); setClubSearch(''); };
  const handleClubSelect = (club: Club) => { /* ... (handler code is unchanged) ... */ setSelectedClub(club.name); setSelectedClubId(club.id); setClubSearch(club.name); setShowClubDropdown(false); };
  const handleSubmit = async (e: React.FormEvent) => { /* ... (handler code is unchanged) ... */ e.preventDefault(); if (!selectedCountryId || !selectedClubId) { setError('Please select both your country and favorite club.'); return; } setIsSubmitting(true); setError(''); try { await apiCall('/onboarding/complete/', { method: 'POST', body: JSON.stringify({ country_id: selectedCountryId, club_id: selectedClubId }) }); navigate('/dashboard'); } catch (err) { setError(err instanceof Error ? err.message : 'An unknown error occurred.'); } finally { setIsSubmitting(false); } };
  const handleSkip = async () => { /* ... (handler code is unchanged) ... */ setIsSubmitting(true); try { await apiCall('/onboarding/skip/', { method: 'POST' }); } catch (err) { console.error('Skip failed:', err); } finally { setIsSubmitting(false); navigate('/dashboard'); } };
  
  // --- RENDER LOGIC ---
  // While checking status, show a full-screen loader.
  if (isCheckingStatus) {
    return <FullScreenLoader />;
  }
  
  // After check is complete, render the full onboarding page.
  return (
    <div className="min-h-screen bg-secondary-950 flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6"><div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center"><div className="w-10 h-10 border-4 border-white rounded-full"></div></div></div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to VI-Predict!</h1>
          <p className="text-secondary-400">Let's personalize your experience by selecting your country and favorite football club.</p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-8">
          {error && (<div className="mb-6 p-3 bg-red-900/50 border border-red-700 rounded-lg text-center"><p className="text-red-300 text-sm font-semibold">{error}</p></div>)}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Country Selection */}
            <div>
              <label className="block text-white font-medium mb-3"><div className="flex items-center space-x-2"><Globe className="w-5 h-5 text-primary-400" /><span>Select Your Country</span></div></label>
              <div className="relative">
                <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 w-5 h-5" /><input type="text" value={countrySearch} onChange={(e) => { setCountrySearch(e.target.value); setShowCountryDropdown(true); if (!e.target.value) setSelectedCountryId(null); }} onFocus={() => setShowCountryDropdown(true)} onBlur={() => setTimeout(() => setShowCountryDropdown(false), 200)} className="input-field w-full pl-12 pr-12" placeholder={isLoadingCountries ? "Loading countries..." : "Search for your country..."} disabled={isLoadingCountries} /><div className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-400">{isLoadingCountries ? <Loader2 className="w-5 h-5 animate-spin" /> : <ChevronDown className={`w-5 h-5 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />}</div></div>
                {showCountryDropdown && (<div className="absolute z-20 w-full mt-2 bg-secondary-800 border border-secondary-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">{!isLoadingCountries && (filteredCountries.length > 0 ? (filteredCountries.map((c) => (<button key={c.id} type="button" onMouseDown={() => handleCountrySelect(c)} className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-secondary-700"><span className="text-2xl">{c.flag || '🌍'}</span><span className="text-white">{c.name}</span></button>))) : (<div className="px-4 py-3 text-secondary-400 text-center">No countries found</div>))}</div>)}
              </div>
            </div>
            {/* Club Selection */}
            <div>
              <label className="block text-white font-medium mb-3"><div className="flex items-center space-x-2"><Trophy className="w-5 h-5 text-primary-400" /><span>Select Your Favorite Club</span></div></label>
              <div className="relative">
                <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 w-5 h-5" /><input type="text" value={clubSearch} onChange={(e) => setClubSearch(e.target.value)} onFocus={() => setShowClubDropdown(true)} onBlur={() => setTimeout(() => setShowClubDropdown(false), 200)} className="input-field w-full pl-12 pr-12" placeholder="Search for your favorite club..." /><div className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-400">{isLoadingClubs ? <Loader2 className="w-5 h-5 animate-spin" /> : <ChevronDown className={`w-5 h-5 transition-transform ${showClubDropdown ? 'rotate-180' : ''}`} />}</div></div>
                {showClubDropdown && (<div className="absolute z-10 w-full mt-2 bg-secondary-800 border border-secondary-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">{isLoadingClubs ? (<div className="px-4 py-3 text-secondary-400 text-center flex items-center justify-center space-x-2"><Loader2 className="w-4 h-4 animate-spin" /> <span>Loading...</span></div>) : clubs.length > 0 ? (clubs.map((club) => (<button key={club.id} type="button" onMouseDown={() => handleClubSelect(club)} className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-secondary-700">{club.logo ? <img src={club.logo} alt={club.name} className="w-6 h-6 object-contain"/> : <span className="text-2xl">⚽</span>}<div className="flex-1"><div className="text-white font-medium">{club.name}</div>{club.league && <div className="text-secondary-400 text-sm">{club.league.name}</div>}</div></button>))) : (<div className="px-4 py-3 text-secondary-400 text-center">{clubSearch ? 'No clubs found' : 'Type to search'}</div>)}</div>)}
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4"><button type="submit" disabled={isSubmitting || !selectedClubId || !selectedCountryId} className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2">{isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}<span>{isSubmitting ? 'Saving...' : 'Complete Setup'}</span></button><button type="button" onClick={handleSkip} disabled={isSubmitting} className="btn-secondary flex-1 disabled:opacity-50">Skip for Now</button></div>
          </form>
        </div>
        <div className="text-center mt-6"><p className="text-secondary-400 text-sm">You can always update these preferences later in your settings</p></div>
      </div>
    </div>
  );
}