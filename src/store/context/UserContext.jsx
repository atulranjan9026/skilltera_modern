import React, { createContext, useContext, useState } from 'react';

/**
 * User Context - Global user state
 * Stores user information and preferences
 */
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [preferences, setPreferences] = useState({
    theme: 'light',
    notifications: true,
    language: 'en',
  });

  const updateProfile = (profileData) => {
    setProfile(profileData);
  };

  const updatePreferences = (newPreferences) => {
    setPreferences((prev) => ({
      ...prev,
      ...newPreferences,
    }));
  };

  const value = {
    profile,
    preferences,
    updateProfile,
    updatePreferences,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

/**
 * Hook to use User Context
 */
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within UserProvider');
  }
  return context;
};
