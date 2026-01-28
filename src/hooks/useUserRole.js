import { useState, useEffect } from 'react';

/**
 * Hook to determine user role (candidate, company, admin)
 * Returns the user's role and methods to check role
 */
export const useUserRole = () => {
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch user role from auth service or localStorage
    setIsLoading(false);
  }, []);

  const isCandidate = role === 'candidate';
  const isCompany = role === 'company';
  const isAdmin = role === 'admin';

  return {
    role,
    isLoading,
    isCandidate,
    isCompany,
    isAdmin,
  };
};
