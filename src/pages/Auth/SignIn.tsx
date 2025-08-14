// src/pages/Auth/SignIn.tsx
import vlogo from "../../images/vlogo.png";

import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';

// A reusable apiCall helper function
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '', 
      ...options.headers,
    },
  });
  const responseData = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = responseData.detail || responseData.message || 'An API error occurred.';
    throw new Error(errorMsg);
  }
  return responseData;
};

export function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Signing In...');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (location.state?.email) {
      setFormData(prev => ({ ...prev, email: location.state.email }));
    }
  }, [location.state]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in both fields.");
      return;
    }
    
    setIsLoading(true);
    setLoadingMessage('Signing In...');
    setError('');

    try {
      const loginResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginData.message || loginData.detail || 'Invalid email or password.');
      }

      const token = loginData.data?.tokens?.access;
      if (!token) {
        throw new Error("Login successful, but no auth token was provided.");
      }

      localStorage.setItem('authToken', token);

      setLoadingMessage('Checking your setup...');
      const statusResponse = await apiCall('/onboarding/status/');
      
      // --- THE ONLY CHANGE IS HERE ---
      // We are now checking for the 'completed_onboarding' key from your Postman response.
      const isOnboarded = statusResponse.data?.completed_onboarding === true;

      if (isOnboarded) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding/country-club-selection');
      }

    } catch (err) {
      localStorage.removeItem('authToken'); 
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
            

            
            <Link to="/home" className="inline-flex items-center space-x-2 mb-8">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                <img 
                  src={vlogo} 
                  alt="VI-Predict Logo" 
                  className="w-6 h-6 object-contain"
                />
              </div>
              <span className="text-2xl font-bold text-white">VI-Predict</span>
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-secondary-400">Sign in to your account to continue</p>
        </div>
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (<div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center"><p className="text-red-400 text-sm">{error}</p></div>)}
            <div>
              <label className="block text-white font-medium mb-2">Email</label>
              <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 w-5 h-5" /><input type="email" name="email" value={formData.email} onChange={handleInputChange} className="input-field w-full pl-12" placeholder="Enter your email" required disabled={isLoading} /></div>
            </div>
            <div>
              <label className="block text-white font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 w-5 h-5" />
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} className="input-field w-full pl-12 pr-12" placeholder="Enter your password" required disabled={isLoading} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-white">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between"><label className="flex items-center space-x-2"><input type="checkbox" className="w-4 h-4 text-primary-600 bg-secondary-700 border-secondary-600 rounded focus:ring-primary-500" /><span className="text-secondary-300 text-sm">Remember me</span></label><Link to="/forgot-password" className="text-primary-400 hover:text-primary-300 text-sm font-medium">Forgot password?</Link></div>
            <button type="submit" className="btn-primary w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2"><Loader2 className="w-5 h-5 animate-spin" /><span>{loadingMessage}</span></div>
              ) : ( 'Sign In' )}
            </button>
          </form>
          <div className="mt-6 text-center"><p className="text-secondary-400">Don't have an account?{' '}<Link to="/signup" className="text-primary-400 hover:text-primary-300 font-medium">Sign up</Link></p></div>
        </div>
      </div>
    </div>
  )
}