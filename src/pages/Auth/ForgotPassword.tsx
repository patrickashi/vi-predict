import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, KeyRound, Eye, EyeOff, Loader2 } from 'lucide-react';
import vlogo from "../../images/vlogo.png";

// --- API HELPER ---
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
        ...options,
        headers: { 'Content-Type': 'application/json', ...options.headers },
    });
    const responseData = await response.json().catch(() => ({}));
    if (!response.ok) {
        const errorMsg = responseData.errors?.detail || responseData.message || responseData.detail || 'An API error occurred.';
        throw new Error(errorMsg);
    }
    return responseData;
};

export function ForgotPassword() {
  // --- STATE MANAGEMENT for the multi-step form ---
  const [step, setStep] = useState<'enterEmail' | 'resetPassword' | 'success'>('enterEmail');
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState({ otp_code: '', new_password: '', new_password_confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // --- HANDLERS ---
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
        const response = await apiCall('/auth/forgot-password/', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
        setSuccessMessage(response.message || "Password reset code sent!");
        setStep('resetPassword');
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to send reset code.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.new_password !== formData.new_password_confirm) {
        setError('Passwords do not match.');
        return;
    }
    setIsLoading(true);
    setError('');
    try {
        const payload = {
            email,
            otp_code: formData.otp_code,
            new_password: formData.new_password,
            new_password_confirm: formData.new_password_confirm,
        };
        const response = await apiCall('/auth/reset-password/', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        setSuccessMessage(response.message || 'Password has been reset successfully!');
        setStep('success');
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to reset password.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };


  // --- RENDER LOGIC ---

  const renderEnterEmailForm = () => (
    <div className="glass-card p-8">
      <form onSubmit={handleEmailSubmit} className="space-y-6">
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <div>
          <label className="block text-white font-medium mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 w-5 h-5" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field w-full pl-12" placeholder="Enter your email" required disabled={isLoading}/>
          </div>
        </div>
        <button type="submit" className="btn-primary w-full" disabled={isLoading}>
          {isLoading ? <div className="flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin" /></div> : 'Send Reset Code'}
        </button>
      </form>
      <div className="mt-6">
        <Link to="/signin" className="flex items-center justify-center space-x-2 text-secondary-400 hover:text-white transition-colors"><ArrowLeft className="w-4 h-4" /><span>Back to sign in</span></Link>
      </div>
    </div>
  );

  const renderResetPasswordForm = () => (
    <div className="glass-card p-8">
      <p className="text-center text-secondary-300 mb-6">A reset code was sent to <strong className="text-white">{email}</strong>. Please enter it below.</p>
      <form onSubmit={handleResetSubmit} className="space-y-6">
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <div>
          <label className="block text-white font-medium mb-2">Verification Code (OTP)</label>
          <div className="relative"><KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 w-5 h-5" /><input type="text" name="otp_code" value={formData.otp_code} onChange={handleInputChange} className="input-field w-full pl-12" placeholder="Enter 6-digit code" required disabled={isLoading} /></div>
        </div>
        <div>
          <label className="block text-white font-medium mb-2">New Password</label>
          <div className="relative"><input type={showPassword ? 'text' : 'password'} name="new_password" value={formData.new_password} onChange={handleInputChange} className="input-field w-full pr-12" placeholder="Enter new password" required disabled={isLoading} /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-white">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div>
        </div>
        <div>
          <label className="block text-white font-medium mb-2">Confirm New Password</label>
          <div className="relative"><input type={showPasswordConfirm ? 'text' : 'password'} name="new_password_confirm" value={formData.new_password_confirm} onChange={handleInputChange} className="input-field w-full pr-12" placeholder="Confirm new password" required disabled={isLoading} /><button type="button" onClick={() => setShowPasswordConfirm(!showPasswordConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-white">{showPasswordConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div>
        </div>
        <button type="submit" className="btn-primary w-full" disabled={isLoading}>
          {isLoading ? <div className="flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin" /></div> : 'Reset Password'}
        </button>
      </form>
    </div>
  );

  const renderSuccessMessage = () => (
    <div className="glass-card p-8 text-center">
      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"><Mail className="w-8 h-8 text-green-400" /></div>
      <h2 className="text-2xl font-bold text-white mb-4">Password Reset!</h2>
      <p className="text-secondary-300 mb-6">{successMessage}</p>
      <Link to="/signin" className="btn-primary w-full inline-block text-center">Back to Sign In</Link>
    </div>
  );

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
          <h1 className="text-3xl font-bold text-white mb-2">
            {step === 'enterEmail' && 'Forgot Password?'}
            {step === 'resetPassword' && 'Reset Your Password'}
            {step === 'success' && 'Success!'}
          </h1>
          <p className="text-secondary-400">
            {step === 'enterEmail' && "No worries, we'll send you reset instructions."}
            {step === 'resetPassword' && 'Create a new, strong password.'}
            {step === 'success' && 'You can now sign in with your new password.'}
          </p>
        </div>
        {step === 'enterEmail' && renderEnterEmailForm()}
        {step === 'resetPassword' && renderResetPasswordForm()}
        {step === 'success' && renderSuccessMessage()}
      </div>
    </div>
  );
}