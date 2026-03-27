import React, { useState } from 'react';
import {
  User, Bell, Lock, Moon, Sun, LogOut, Trash2, Eye, EyeOff,
  Save, Check, Shield, Palette, ChevronRight, Camera, Mail,
  Phone, MapPin, FileText, Key, Globe, MessageSquare, Briefcase,
  AlertTriangle
} from 'lucide-react';
import {useAuthContext} from '../../store/context/AuthContext';
import { toast } from '../../utils/toast';

const Toggle = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none ${
      checked ? 'bg-primary-600' : 'bg-slate-200'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

const InputField = ({ label, icon: Icon, type = 'text', value, onChange, placeholder }) => (
  <div className="group">
    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">{label}</label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">
          <Icon size={16} />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400
          focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 focus:bg-white transition-all duration-200`}
      />
    </div>
  </div>
);

const SectionCard = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

const SectionHeader = ({ title, subtitle }) => (
  <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
    <h3 className="font-semibold text-slate-800 text-base">{title}</h3>
    {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
  </div>
);

const SettingRow = ({ icon: Icon, label, desc, children, last }) => (
  <div className={`flex items-center justify-between px-6 py-4 hover:bg-slate-50/70 transition-colors ${!last ? 'border-b border-slate-100' : ''}`}>
    <div className="flex items-center gap-3.5">
      {Icon && (
        <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
          <Icon size={15} className="text-primary-500" />
        </div>
      )}
      <div>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        {desc && <p className="text-xs text-slate-400 mt-0.5">{desc}</p>}
      </div>
    </div>
    <div className="ml-4 flex-shrink-0">{children}</div>
  </div>
);

// Helper to get user initials
const getUserInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export default function SettingsPage() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState('account');
  const [saved, setSaved] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  // Parse user name into first and last name
  const getNameParts = () => {
    if (!user?.name) return { firstName: '', lastName: '' };
    const parts = user.name.trim().split(/\s+/);
    return {
      firstName: parts[0] || '',
      lastName: parts.slice(1).join(' ') || ''
    };
  };

  const nameParts = getNameParts();

  const [accountForm, setAccountForm] = useState({
    firstName: nameParts.firstName,
    lastName: nameParts.lastName,
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.currentCity && user?.country ? `${user.currentCity}, ${user.country}` : '',
    bio: user?.bio || ''
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true, jobAlerts: true,
    applicationUpdates: true, newsletters: false, pushNotifications: true
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public', showEmail: false,
    showPhone: false, allowMessages: true, allowJobOffers: true
  });

  const [appearance, setAppearance] = useState({ theme: 'light', compactMode: false });

  const handleAccountChange = (field, value) => setAccountForm(p => ({ ...p, [field]: value }));
  const handleNotifChange = (field) => setNotifications(p => ({ ...p, [field]: !p[field] }));
  const handlePrivacyChange = (field, value) => setPrivacy(p => ({ ...p, [field]: value }));
  const handleAppearanceChange = (field, value) => setAppearance(p => ({ ...p, [field]: value }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Settings</h1>
            <p className="text-xs text-slate-400 mt-0.5">Manage your account and preferences</p>
          </div>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 shadow-sm ${
              saved
                ? 'bg-emerald-500 text-white'
                : 'bg-primary-600 hover:bg-primary-700 text-white hover:shadow-md'
            }`}
          >
            {saved ? <Check size={15} /> : <Save size={15} />}
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-7">

          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            {/* Avatar Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-4">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-3">
                  {user?.avatar?.url ? (
                    <img
                      src={user.avatar.url}
                      alt="Profile Avatar"
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-2xl object-cover shadow-lg border-2 border-white"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                      {getUserInitials(user?.name)}
                    </div>
                  )}
                  <button className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-white border-2 border-white rounded-lg shadow-sm flex items-center justify-center hover:bg-primary-50 transition-colors">
                    <Camera size={11} className="text-primary-600" />
                  </button>
                </div>
                <p className="font-semibold text-slate-800 text-sm">{user?.name || 'User'}</p>
                <p className="text-xs text-slate-400 mt-0.5 truncate w-full">{user?.email}</p>
                <span className={`mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg ${
                  user?.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${user?.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  {user?.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Nav */}
            <nav className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {tabs.map((tab, i) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-all duration-150 relative
                      ${i < tabs.length - 1 ? 'border-b border-slate-50' : ''}
                      ${isActive ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'}`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary-600 rounded-r-full" />
                    )}
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      isActive ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <Icon size={14} />
                    </div>
                    <span>{tab.label}</span>
                    <ChevronRight size={14} className={`ml-auto transition-opacity ${isActive ? 'opacity-100 text-primary-400' : 'opacity-0'}`} />
                  </button>
                );
              })}
            </nav>

            {/* Danger Zone */}
            <div className="mt-4 bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-red-50">
                <p className="text-xs font-semibold text-red-500 uppercase tracking-widest flex items-center gap-1.5">
                  <AlertTriangle size={11} /> Danger Zone
                </p>
              </div>
              <button
                onClick={() => window.confirm('Log out?') && logout()}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-amber-600 hover:bg-amber-50 transition-colors border-b border-red-50"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                  <LogOut size={14} className="text-amber-500" />
                </div>
                Logout
              </button>
              <button
                onClick={() => window.confirm('Delete account? This cannot be undone.') && deleteAccount()}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
                  <Trash2 size={14} className="text-red-500" />
                </div>
                Delete Account
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 space-y-5">

            {/* ACCOUNT TAB */}
            {activeTab === 'account' && (
              <>
                <SectionCard>
                  <SectionHeader title="Personal Information" subtitle="Update your name, contact, and bio" />
                  <div className="p-6 grid grid-cols-2 gap-4">
                    <InputField label="First Name" icon={User} value={accountForm.firstName}
                      onChange={e => handleAccountChange('firstName', e.target.value)} />
                    <InputField label="Last Name" icon={User} value={accountForm.lastName}
                      onChange={e => handleAccountChange('lastName', e.target.value)} />
                    <InputField label="Email Address" icon={Mail} type="email" value={accountForm.email}
                      onChange={e => handleAccountChange('email', e.target.value)} />
                    <InputField label="Phone Number" icon={Phone} type="tel" value={accountForm.phone}
                      onChange={e => handleAccountChange('phone', e.target.value)} />
                    <div className="col-span-2">
                      <InputField label="Location" icon={MapPin} value={accountForm.location}
                        onChange={e => handleAccountChange('location', e.target.value)} />
                    </div>
                    <div className="col-span-2 group">
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Bio</label>
                      <div className="relative">
                        <FileText size={16} className="absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                        <textarea
                          value={accountForm.bio}
                          onChange={e => handleAccountChange('bio', e.target.value)}
                          rows={3}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800
                            focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 focus:bg-white transition-all duration-200 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard>
                  <SectionHeader title="Change Password" subtitle="Use a strong password to keep your account secure" />
                  <div className="p-6 space-y-4">
                    <div className="group">
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Current Password</label>
                      <div className="relative">
                        <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                        <input
                          type={showCurrentPw ? 'text' : 'password'}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm
                            focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 focus:bg-white transition-all"
                        />
                        <button onClick={() => setShowCurrentPw(!showCurrentPw)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                          {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="group">
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">New Password</label>
                        <div className="relative">
                          <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                          <input
                            type={showNewPw ? 'text' : 'password'}
                            placeholder="••••••••"
                            className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm
                              focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 focus:bg-white transition-all"
                          />
                          <button onClick={() => setShowNewPw(!showNewPw)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                            {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                      <div className="group">
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Confirm Password</label>
                        <div className="relative">
                          <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                          <input type="password" placeholder="••••••••"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm
                              focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="bg-primary-50 rounded-xl px-4 py-3 flex items-start gap-3">
                      <Shield size={15} className="text-primary-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-primary-600">Use at least 8 characters with a mix of letters, numbers, and symbols.</p>
                    </div>
                  </div>
                </SectionCard>
              </>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <SectionCard>
                <SectionHeader title="Notification Preferences" subtitle="Choose what updates you want to receive" />
                {[
                  { key: 'emailNotifications', icon: Mail, label: 'Email Notifications', desc: 'Receive email updates about your account' },
                  { key: 'jobAlerts', icon: Briefcase, label: 'Job Alerts', desc: 'Get notified about new job opportunities' },
                  { key: 'applicationUpdates', icon: FileText, label: 'Application Updates', desc: 'Receive updates on your applications' },
                  { key: 'pushNotifications', icon: Bell, label: 'Push Notifications', desc: 'Receive push notifications on your device' },
                  { key: 'newsletters', icon: Globe, label: 'Newsletters', desc: 'Subscribe to our weekly newsletter' }
                ].map((item, i, arr) => (
                  <SettingRow key={item.key} icon={item.icon} label={item.label} desc={item.desc} last={i === arr.length - 1}>
                    <Toggle checked={notifications[item.key]} onChange={() => handleNotifChange(item.key)} />
                  </SettingRow>
                ))}
              </SectionCard>
            )}

            {/* PRIVACY TAB */}
            {activeTab === 'privacy' && (
              <>
                <SectionCard>
                  <SectionHeader title="Profile Visibility" subtitle="Control who can see your profile" />
                  <div className="p-6 space-y-3">
                    {[
                      { value: 'public', label: 'Public', desc: 'Anyone can view your profile', icon: Globe },
                      { value: 'recruiters-only', label: 'Recruiters Only', desc: 'Only verified recruiters can view', icon: Briefcase },
                      { value: 'private', label: 'Private', desc: 'Only you can view your profile', icon: Lock },
                    ].map(option => {
                      const Icon = option.icon;
                      const isSelected = privacy.profileVisibility === option.value;
                      return (
                        <label key={option.value}
                          className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            isSelected ? 'border-primary-400 bg-primary-50' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                          }`}>
                          <input type="radio" name="visibility" value={option.value}
                            checked={isSelected}
                            onChange={() => handlePrivacyChange('profileVisibility', option.value)}
                            className="hidden" />
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-500'
                          }`}>
                            <Icon size={16} />
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-semibold ${isSelected ? 'text-primary-700' : 'text-slate-700'}`}>{option.label}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{option.desc}</p>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'border-primary-600' : 'border-slate-300'
                          }`}>
                            {isSelected && <span className="w-2 h-2 rounded-full bg-primary-600 block" />}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </SectionCard>

                <SectionCard>
                  <SectionHeader title="Information Sharing" subtitle="Manage what others can see about you" />
                  {[
                    { key: 'showEmail', icon: Mail, label: 'Show Email', desc: 'Display your email on your profile' },
                    { key: 'showPhone', icon: Phone, label: 'Show Phone', desc: 'Display your phone number publicly' },
                    { key: 'allowMessages', icon: MessageSquare, label: 'Allow Messages', desc: 'Let recruiters send you messages' },
                    { key: 'allowJobOffers', icon: Briefcase, label: 'Allow Job Offers', desc: 'Receive direct job offer notifications' },
                  ].map((item, i, arr) => (
                    <SettingRow key={item.key} icon={item.icon} label={item.label} desc={item.desc} last={i === arr.length - 1}>
                      <Toggle checked={privacy[item.key]} onChange={v => handlePrivacyChange(item.key, v)} />
                    </SettingRow>
                  ))}
                </SectionCard>
              </>
            )}

            {/* APPEARANCE TAB */}
            {activeTab === 'appearance' && (
              <>
                <SectionCard>
                  <SectionHeader title="Theme" subtitle="Choose your preferred color scheme" />
                  <div className="p-6 grid grid-cols-2 gap-4">
                    {[
                      { value: 'light', label: 'Light', icon: Sun },
                      { value: 'dark', label: 'Dark', icon: Moon },
                    ].map(option => {
                      const Icon = option.icon;
                      const isSelected = appearance.theme === option.value;
                      const isDark = option.value === 'dark';
                      return (
                        <button key={option.value} onClick={() => handleAppearanceChange('theme', option.value)}
                          className={`relative p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                            isSelected ? 'border-primary-500 ring-4 ring-primary-100' : 'border-slate-200 hover:border-slate-300'
                          }`}>
                          <div className={`h-20 rounded-xl mb-3 overflow-hidden shadow-sm relative ${isDark ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 to-white'}`}>
                            <div className={`absolute top-2 left-2 right-2 h-4 rounded-lg opacity-80 ${isDark ? 'bg-slate-700' : 'bg-white border border-slate-200'}`} />
                            <div className={`absolute top-8 left-2 w-10 h-2 rounded opacity-60 ${isDark ? 'bg-slate-600' : 'bg-slate-200'}`} />
                            <div className={`absolute top-12 left-2 w-16 h-2 rounded opacity-40 ${isDark ? 'bg-slate-600' : 'bg-slate-200'}`} />
                            <div className={`absolute bottom-2 right-2 w-4 h-4 rounded-full ${isDark ? 'bg-primary-400' : 'bg-primary-500'}`} />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Icon size={16} className={isSelected ? 'text-primary-600' : 'text-slate-500'} />
                              <span className={`text-sm font-semibold ${isSelected ? 'text-primary-700' : 'text-slate-700'}`}>{option.label}</span>
                            </div>
                            {isSelected && (
                              <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center">
                                <Check size={11} className="text-white" />
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </SectionCard>

                <SectionCard>
                  <SectionHeader title="Layout" subtitle="Adjust how information is displayed" />
                  <SettingRow icon={Palette} label="Compact Mode" desc="Reduce spacing and font sizes for a denser layout" last>
                    <Toggle checked={appearance.compactMode} onChange={v => handleAppearanceChange('compactMode', v)} />
                  </SettingRow>
                </SectionCard>
              </>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}