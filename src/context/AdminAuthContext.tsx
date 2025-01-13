import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminAuthContextType {
  isAdminAuthenticated: boolean;
  adminLogin: (username: string, password: string) => Promise<boolean>;
  adminLogout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_AUTH_KEY = 'adminAuthState';

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    // Initialize auth state from localStorage
    const savedAuthState = localStorage.getItem(ADMIN_AUTH_KEY);
    return savedAuthState === 'true';
  });
  
  const navigate = useNavigate();

  // Update localStorage when auth state changes
  useEffect(() => {
    localStorage.setItem(ADMIN_AUTH_KEY, isAdminAuthenticated.toString());
  }, [isAdminAuthenticated]);

  // In a real application, this would be handled by your backend
  const adminLogin = async (username: string, password: string) => {
    // TODO: Replace with actual API call
    if (username === 'admin' && password === 'admin123') {
      setIsAdminAuthenticated(true);
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem(ADMIN_AUTH_KEY);
    navigate('/admin/login');
  };

  return (
    <AdminAuthContext.Provider value={{ isAdminAuthenticated, adminLogin, adminLogout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
