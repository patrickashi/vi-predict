import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from '../components/Layout/Layout';
import { User, Bell, Shield, Palette, Loader2, Eye, EyeOff } from 'lucide-react';

// --- TYPE DEFINITIONS & HELPERS (Defined outside the main component for stability) ---
interface UserProfile { first_name: string; last_name: string; email: string; }
const apiCall = async (endpoint: string, options: RequestInit = {}) => { const token = localStorage.getItem('authToken'); const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, { ...options, headers: { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '', ...options.headers }, }); const responseData = await response.json().catch(() => ({})); if (!response.ok) { const errorMsg = responseData.errors?.detail || responseData.message || responseData.detail || Object.values(responseData).flat().join(' ') || 'An API error occurred.'; throw new Error(errorMsg); } return responseData; };
const SettingsLoader = () => (<div className="flex justify-center items-center py-20"><Loader2 className="w-10 h-10 text-primary-500 animate-spin" /></div>);
const ErrorDisplay = ({ message }: { message: string }) => (<div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-center"><p className="text-red-400 text-sm">{message}</p></div>);

// --- STABLE SUB-COMPONENTS TO PREVENT RE-RENDERING ISSUES ---
const PersonalInformationForm = React.memo(({ profileData, handleProfileChange, handleProfileSubmit, isUpdatingProfile, updateProfileError, updateProfileSuccess }: any) => (
  <div>
    <h3 className="text-xl font-semibold text-white mb-6">Personal Information</h3>
    <form onSubmit={handleProfileSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div><label className="block text-white font-medium mb-2">First Name</label><input type="text" name="firstName" value={profileData.firstName} onChange={handleProfileChange} className="input-field w-full" disabled={isUpdatingProfile} /></div>
        <div><label className="block text-white font-medium mb-2">Last Name</label><input type="text" name="lastName" value={profileData.lastName} onChange={handleProfileChange} className="input-field w-full" disabled={isUpdatingProfile} /></div>
      </div>
      {updateProfileError && <p className="text-sm text-red-400">{updateProfileError}</p>}
      {updateProfileSuccess && <p className="text-sm text-green-400">{updateProfileSuccess}</p>}
      <button type="submit" className="btn-primary" disabled={isUpdatingProfile}>{isUpdatingProfile ? <div className="flex items-center space-x-2"><Loader2 className="w-5 h-5 animate-spin" /><span>Updating...</span></div> : 'Update Profile'}</button>
    </form>
  </div>
));
const ChangePasswordForm = React.memo(({ passwordData, handlePasswordChange, togglePasswordVisibility, handlePasswordSubmit, isChangingPassword, changePasswordError, changePasswordSuccess }: any) => (
  <div className="border-t border-secondary-700 pt-8">
    <h3 className="text-xl font-semibold text-white mb-6">Change Password</h3>
    <form onSubmit={handlePasswordSubmit} className="space-y-6">
      <div><label className="block text-white font-medium mb-2">Current Password</label><div className="relative"><input type={passwordData.showCurrentPassword ? 'text' : 'password'} name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className="input-field w-full pr-12" disabled={isChangingPassword} required /><button type="button" onClick={() => togglePasswordVisibility('showCurrentPassword')} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-white">{passwordData.showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div><label className="block text-white font-medium mb-2">New Password</label><div className="relative"><input type={passwordData.showNewPassword ? 'text' : 'password'} name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="input-field w-full pr-12" disabled={isChangingPassword} required /><button type="button" onClick={() => togglePasswordVisibility('showNewPassword')} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-white">{passwordData.showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div></div>
        <div><label className="block text-white font-medium mb-2">Confirm New Password</label><div className="relative"><input type={passwordData.showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="input-field w-full pr-12" disabled={isChangingPassword} required /><button type="button" onClick={() => togglePasswordVisibility('showConfirmPassword')} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-white">{passwordData.showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div></div>
      </div>
      {changePasswordError && <p className="text-sm text-red-400">{changePasswordError}</p>}
      {changePasswordSuccess && <p className="text-sm text-green-400">{changePasswordSuccess}</p>}
      <button type="submit" className="btn-primary" disabled={isChangingPassword}>{isChangingPassword ? <div className="flex items-center space-x-2"><Loader2 className="w-5 h-5 animate-spin" /><span>Changing...</span></div> : 'Change Password'}</button>
    </form>
  </div>
));

export function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({ firstName: '', lastName: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '', showCurrentPassword: false, showNewPassword: false, showConfirmPassword: false });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [updateProfileError, setUpdateProfileError] = useState('');
  const [updateProfileSuccess, setUpdateProfileSuccess] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState('');
  const [changePasswordSuccess, setChangePasswordSuccess] = useState('');
  const [notifications, setNotifications] = useState({ gameweekDeadlines: true, leagueUpdates: true, matchResults: false, weeklyDigest: true });
  const [preferences, setPreferences] = useState({ theme: 'dark', language: 'en', timezone: 'UTC' });
  const tabs = [{ id: 'profile', name: 'Profile', icon: User }, { id: 'notifications', name: 'Notifications', icon: Bell }, { id: 'privacy', name: 'Privacy', icon: Shield }, { id: 'preferences', name: 'Preferences', icon: Palette }];

  useEffect(() => { 
    const fetchProfile = async () => { 
      setIsLoading(true); 
      setError(''); 
      try { 
        const response = await apiCall('/auth/profile/'); 
        console.log('Profile API Response:', response); 
        const userData: UserProfile = response.data || response; 
        setProfileData({ 
          firstName: userData.first_name || userData.firstName || '', 
          lastName: userData.last_name || userData.lastName || '' 
        }); 
      } catch (err) { 
        setError(err instanceof Error ? err.message : 'Failed to load profile data.'); 
      } finally { 
        setIsLoading(false); 
      } 
    }; 
    fetchProfile(); 
  }, []);

  const handleProfileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { setProfileData(prev => ({ ...prev, [e.target.name]: e.target.value })); setUpdateProfileError(''); setUpdateProfileSuccess(''); }, []);
  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value })); setChangePasswordError(''); setChangePasswordSuccess(''); }, []);
  const togglePasswordVisibility = useCallback((field: keyof typeof passwordData) => { setPasswordData(prev => ({ ...prev, [field]: !prev[field] })); }, []);
  
  const handleProfileSubmit = async (e: React.FormEvent) => { e.preventDefault(); setIsUpdatingProfile(true); setUpdateProfileError(''); setUpdateProfileSuccess(''); try { const payload = { first_name: profileData.firstName, last_name: profileData.lastName }; const response = await apiCall('/auth/profile/', { method: 'PUT', body: JSON.stringify(payload) }); setUpdateProfileSuccess(response.message || 'Profile updated successfully!'); } catch (err) { setUpdateProfileError(err instanceof Error ? err.message : 'Failed to update profile.'); } finally { setIsUpdatingProfile(false); } };
  
  // --- MODIFICATION: The handlePasswordSubmit function is updated here ---
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setChangePasswordError('New passwords do not match!'); return;
    }
    setIsChangingPassword(true); setChangePasswordError(''); setChangePasswordSuccess('');
    try {
        // Construct the payload with the correct keys from your Postman test
        const payload = {
            current_password: passwordData.currentPassword,
            new_password: passwordData.newPassword,
            new_password_confirm: passwordData.confirmPassword
        };
        const response = await apiCall('/auth/change-password/', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        setChangePasswordSuccess(response.message || 'Password changed successfully!');
        // Reset all fields on success
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '', showCurrentPassword: false, showNewPassword: false, showConfirmPassword: false });
    } catch (err) {
        setChangePasswordError(err instanceof Error ? err.message : 'Failed to change password.');
    } finally {
        setIsChangingPassword(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <div className="space-y-8"><PersonalInformationForm {...{profileData, handleProfileChange, handleProfileSubmit, isUpdatingProfile, updateProfileError, updateProfileSuccess}} /><ChangePasswordForm {...{passwordData, handlePasswordChange, togglePasswordVisibility, handlePasswordSubmit, isChangingPassword, changePasswordError, changePasswordSuccess}} /></div>;
      case 'notifications': 
        return ( <div><h3 className="text-xl font-semibold text-white mb-6">Notification Preferences</h3><div className="space-y-6">{Object.entries(notifications).map(([key, value]) => (<label key={key} className="flex items-center justify-between cursor-pointer"><div><div className="text-white font-medium">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div><div className="text-secondary-400 text-sm">{key === 'gameweekDeadlines' && 'Get notified about upcoming prediction deadlines'}{key === 'leagueUpdates' && 'Receive updates about your leagues and rankings'}{key === 'matchResults' && 'Get notified when match results are available'}{key === 'weeklyDigest' && 'Receive a weekly summary of your performance'}</div></div><input type="checkbox" checked={value} onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))} className="w-5 h-5 text-primary-600 bg-secondary-700 border-secondary-600 rounded focus:ring-primary-500" /></label>))}</div></div> );
      case 'privacy': 
        return ( <div><h3 className="text-xl font-semibold text-white mb-6">Privacy Settings</h3><div className="space-y-6"><div className="bg-secondary-800/50 rounded-lg p-6"><h4 className="text-white font-medium mb-2">Data Export</h4><p className="text-secondary-400 text-sm mb-4">Download a copy of your prediction data and account information.</p><button className="btn-secondary">Export Data</button></div><div className="bg-secondary-800/50 rounded-lg p-6"><h4 className="text-white font-medium mb-2">Account Deletion</h4><p className="text-secondary-400 text-sm mb-4">Permanently delete your account and all associated data.</p><button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">Delete Account</button></div></div></div> );
      case 'preferences': 
        return ( <div><h3 className="text-xl font-semibold text-white mb-6">App Preferences</h3><div className="space-y-6"><div><label className="block text-white font-medium mb-2">Theme</label><select value={preferences.theme} onChange={(e) => setPreferences(prev => ({ ...prev, theme: e.target.value }))} className="input-field w-full"><option value="dark">Dark</option><option value="light">Light</option><option value="auto">Auto</option></select></div><div><label className="block text-white font-medium mb-2">Language</label><select value={preferences.language} onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))} className="input-field w-full"><option value="en">English</option><option value="es">Spanish</option><option value="fr">French</option><option value="de">German</option></select></div><div><label className="block text-white font-medium mb-2">Timezone</label><select value={preferences.timezone} onChange={(e) => setPreferences(prev => ({ ...prev, timezone: e.target.value }))} className="input-field w-full"><option value="UTC">UTC</option><option value="EST">Eastern Time</option><option value="PST">Pacific Time</option><option value="GMT">Greenwich Mean Time</option></select></div></div></div> );
      default: return null;
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center"><h1 className="text-3xl font-bold text-white mb-2">Settings</h1><p className="text-secondary-400">Manage your account and preferences</p></div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <nav className="flex flex-row lg:flex-col lg:space-y-2 overflow-x-auto lg:overflow-x-visible -mx-4 px-4 pb-2 lg:p-0">
              {tabs.map((tab) => { const Icon = tab.icon; return (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex-shrink-0 lg:flex-shrink flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === tab.id ? 'bg-primary-600/10 text-primary-400 font-semibold lg:border-r-2 border-primary-500' : 'text-secondary-300 hover:text-white hover:bg-secondary-800'}`}><Icon className="w-5 h-5" /><span>{tab.name}</span></button>)})}
            </nav>
          </div>
          <div className="lg:w-3/4"><div className="glass-card p-4 sm:p-6 md:p-8">{isLoading ? <SettingsLoader /> : error ? <ErrorDisplay message={error} /> : renderTabContent()}</div></div>
        </div>
      </div>
    </Layout>
  );
}