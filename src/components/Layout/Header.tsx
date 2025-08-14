import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, User, LogOut, Loader2 } from 'lucide-react';
import vlogo from "../../images/vlogo.png";

interface HeaderProps {
  showSignIn?: boolean;
}

// A reusable API call function can be placed here or imported
const apiCall = async (endpoint: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error("No auth token found");
    
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error("Failed to fetch user profile");
    return response.json();
};

export function Header({ showSignIn = false }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // --- MODIFICATION: State to hold the user's name ---
  const [username, setUsername] = useState('User');
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Leagues', href: '/leagues' },
    { name: 'Game Weeks', href: '/gameweeks' },
    { name: 'Results', href: '/results' },
    { name: 'Help', href: '/help' },
  ];

  // --- MODIFICATION: Fetch user profile when the component mounts ---
  useEffect(() => {
    // Only fetch the profile if the user is supposed to be logged in
    if (!showSignIn) {
      const fetchUserProfile = async () => {
        setIsLoading(true);
        try {
          const response = await apiCall('/auth/profile/');
          // Use the username from the API response, with a fallback
          setUsername(response.data.username || 'User');
        } catch (error) {
          console.error("Header fetch profile error:", error);
          // If fetching fails (e.g., token expired), you might want to log the user out
          // handleSignOut(); // Optional: uncomment to auto-logout on profile fetch failure
          setUsername('User'); // Fallback to a generic name
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchUserProfile();
    } else {
      setIsLoading(false);
    }
  }, [showSignIn]); // Re-run if the sign-in state changes

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    navigate('/home');
    setShowUserMenu(false);
  };

  return (
    <header className="bg-secondary-900/95 backdrop-blur-sm border-b border-secondary-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo (Unchanged) */}
          <Link to="/home" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
              <img 
              src={vlogo} 
              alt="VI-Predict Logo" 
              className="w-6 h-6 object-contain"
              />
            </div>
            <span className="text-xl font-bold text-white">VI-Predict</span>
          </Link>

          {/* Desktop Navigation (Unchanged) */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} to={item.href} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(item.href) ? 'text-primary-400 bg-primary-600/10' : 'text-secondary-300 hover:text-white hover:bg-secondary-800'}`}>
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {showSignIn ? (
              <Link to="/signin" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Sign In
              </Link>
            ) : (
              <>
                <div className="relative">
                  <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center space-x-2 text-sm p-2 rounded-lg hover:bg-secondary-800 transition-colors">
                    <User className="w-5 h-5 text-primary-400" />
                    {/* --- MODIFICATION: Display the username from state --- */}
                    <span className="text-white font-medium capitalize">
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : username}
                    </span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-secondary-800 rounded-lg shadow-lg border border-secondary-700 py-2 z-50">
                      <Link to="/settings" onClick={() => setShowUserMenu(false)} className="flex items-center space-x-2 px-4 py-2 text-secondary-300 hover:text-white hover:bg-secondary-700 transition-colors">
                        <User className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                      <button onClick={handleSignOut} className="flex items-center space-x-2 px-4 py-2 text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-colors w-full text-left">
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Mobile menu button (Unchanged) */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-secondary-400 hover:text-white transition-colors">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation (Unchanged) */}
      {isMenuOpen && (
        <div className="md:hidden bg-secondary-900 border-t border-secondary-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link key={item.name} to={item.href} onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive(item.href) ? 'text-primary-400 bg-primary-600/10' : 'text-secondary-300 hover:text-white hover:bg-secondary-800'}`}>
                {item.name}
              </Link>
            ))}
            {!showSignIn && (
              <div className="border-t border-secondary-700 pt-2 mt-2">
                <Link to="/settings" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-2 px-3 py-2 text-secondary-300 hover:text-white hover:bg-secondary-800 transition-colors rounded-md">
                  <User className="w-4 h-4" />
                  <span>Settings</span>
                </Link>
                <button onClick={() => { handleSignOut(); setIsMenuOpen(false); }} className="flex items-center space-x-2 px-3 py-2 text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-colors w-full text-left rounded-md">
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}