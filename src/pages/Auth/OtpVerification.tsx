import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, ArrowLeft, Shield, RefreshCw } from 'lucide-react';
import vlogo from "../../images/vlogo.png";

export function OtpVerification() {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const email = location.state?.email;
  const token = location.state?.token; // This might be a temporary token from signup
  
  const MAX_ATTEMPTS = 3;
  const COOLDOWN_SECONDS = 60;
  const OTP_LENGTH = 6;

  useEffect(() => {
    if (!email) {
      console.warn("No email found in location state. Redirecting to sign up.");
      navigate('/signup');
    }
  }, [email, navigate]);

  // Helper functions (no changes to their internal logic)
  const maskEmail = (email: string) => { if (!email) return 'user@example.com'; const [username, domain] = email.split('@'); if (username.length <= 1) return email; const maskedUsername = username[0] + '*'.repeat(Math.min(username.length - 1, 3)); return `${maskedUsername}@${domain}`; };
  useEffect(() => { if (resendCooldown > 0) { const timer = setTimeout(() => { setResendCooldown(r => r - 1); }, 1000); return () => clearTimeout(timer); } }, [resendCooldown]);
  const formatCountdown = (seconds: number) => { const mins = Math.floor(seconds / 60); const secs = seconds % 60; return `${mins}:${secs.toString().padStart(2, '0')}`; };
  const handleOtpChange = (value: string) => { const numericValue = value.replace(/\D/g, '').slice(0, OTP_LENGTH); setOtp(numericValue); setError(''); setSuccessMessage(''); };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== OTP_LENGTH) {
      setError(`Please enter a ${OTP_LENGTH}-digit verification code.`);
      return;
    }
    if (isBlocked) {
      setError('Too many failed attempts. Please request a new verification code.');
      return;
    }

    setIsVerifying(true);
    setError('');
    setSuccessMessage('');

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/verify-otp/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ otp_code: otp, purpose: "email_verification", email: email }),
      });

      const data = await response.json();

      if (response.ok) {
        // --- MODIFICATION START ---
        
        // 1. Update success message to inform the user about the next step.
        setSuccessMessage('Email verified successfully! Redirecting to sign in...');
        
        // 2. Remove token storage. The SignIn component will handle the real auth token.
        
        // 3. Navigate to the '/signin' page, passing the email in the state.
        setTimeout(() => {
          navigate('/signin', { 
            replace: true, // Prevents user from going "back" to this OTP page
            state: { email: email } 
          });
        }, 1500);

        // --- MODIFICATION END ---

      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= MAX_ATTEMPTS) {
          setIsBlocked(true);
          setError('Too many failed attempts. Please request a new verification code.');
        } else {
          const remainingAttempts = MAX_ATTEMPTS - newAttempts;
          const errorMessage = data.detail || data.error || `Invalid verification code.`;
          setError(`${errorMessage} ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.`);
        }
        
        setOtp('');
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setError('Network error. Please check your connection and try again.');
      setOtp('');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    // This function's logic remains the same.
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    setError('');
    setSuccessMessage('');
    setIsBlocked(false);
    setAttempts(0);
    setOtp('');
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/resend-otp/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ email: email, purpose: "email_verification" }),
      });
      if (response.ok) {
        setResendCooldown(COOLDOWN_SECONDS);
        setSuccessMessage('New verification code sent to your email!');
      } else {
        const data = await response.json();
        setError(data.detail || 'Failed to resend verification code. Please try again.');
      }
    } catch (err) {
      console.error('Resend OTP error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsResending(false);
    }
  };

  const canResend = resendCooldown === 0 && !isResending;

  if (!email) {
    return null; // Render nothing while redirecting
  }

  // The entire JSX structure below is unchanged.
  return (
    <div className="min-h-screen bg-secondary-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
              <img 
              src={vlogo} 
              alt="VI-Predict Logo" 
              className="w-6 h-6 object-contain"
              />
            </div>
            <span className="text-2xl font-bold text-white">VI-Predict</span>
          </Link>
          <div className="w-16 h-16 bg-primary-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-primary-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Verify Your Email</h1>
          <p className="text-secondary-400 mb-4">
            We've sent a {OTP_LENGTH}-digit verification code to
          </p>
          <p className="text-white font-medium">{maskEmail(email)}</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-3 text-center">
                Enter Verification Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => handleOtpChange(e.target.value)}
                  className="input-field w-full text-center text-2xl font-mono tracking-widest"
                  placeholder="000000"
                  maxLength={OTP_LENGTH}
                  disabled={isVerifying || isBlocked}
                  autoComplete="one-time-code"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <Shield className={`w-5 h-5 ${otp.length === OTP_LENGTH ? 'text-green-400' : 'text-secondary-400'}`} />
                </div>
              </div>
              <p className="text-secondary-400 text-sm text-center mt-2">
                {otp.length}/{OTP_LENGTH} digits entered
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <p className="text-green-400 text-sm text-center">{successMessage}</p>
              </div>
            )}

            {!isBlocked && attempts > 0 && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="text-yellow-400 text-sm text-center">
                  {MAX_ATTEMPTS - attempts} attempt{MAX_ATTEMPTS - attempts !== 1 ? 's' : ''} remaining
                </p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isVerifying || otp.length !== OTP_LENGTH || isBlocked}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </div>
              ) : (
                'Verify Code'
              )}
            </button>
          </form>

          {/* Resend Section */}
          <div className="mt-6 text-center">
            <p className="text-secondary-400 text-sm mb-4">
              Didn't receive the code?
            </p>
            
            {canResend ? (
              <button
                onClick={handleResendOtp}
                className="text-primary-400 hover:text-primary-300 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!email}
              >
                Resend Verification Code
              </button>
            ) : (
              <div className="text-secondary-400">
                {isResending ? (
                  <div className="flex items-center justify-center space-x-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sending new code...</span>
                  </div>
                ) : (
                  <span>
                    Resend code in {formatCountdown(resendCooldown)}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Back to Sign Up */}
          <div className="mt-6">
            <Link
              to="/signup"
              className="flex items-center justify-center space-x-2 text-secondary-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to sign up</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}