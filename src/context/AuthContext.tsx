import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { cookieUtils } from '../utils/cookies';

interface UserProfile {
  name: string;
  mobile: string;
  address: string;
  email?: string;
  gender?: 'male' | 'female' | 'other';
  age?: number;
  bloodGroup?: string;
  alternateContact?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  login: (mobile: string) => Promise<void>;
  verifyOTP: (otp: string) => Promise<boolean>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  logout: () => void;
  getPatientDetails: () => UserProfile | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [verificationMobile, setVerificationMobile] = useState<string>('');

  // Load saved authentication state from cookies on mount
  useEffect(() => {
    const token = cookieUtils.getAccessToken();
    const savedProfile = cookieUtils.getUserData();
    
    if (token && savedProfile) {
      setUserProfile(savedProfile);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (mobile: string) => {
    try {
      const response = await authService.sendOTP(mobile);
      if (response.success) {
        setVerificationMobile(mobile);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const verifyOTP = async (otp: string): Promise<boolean> => {
    try {
      const response = await authService.verifyOTP(verificationMobile, otp);
      if (response.success && response.token && response.profile) {
        cookieUtils.setAccessToken(response.token);
        cookieUtils.setUserData(response.profile);
        setUserProfile(response.profile);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('OTP verification error:', error);
      return false;
    }
  };

  const updateProfile = async (profile: Partial<UserProfile>) => {
    try {
      const response = await authService.updateProfile({
        ...userProfile,
        ...profile,
      });
      
      if (response.success && response.profile) {
        setUserProfile(response.profile);
        cookieUtils.setUserData(response.profile);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserProfile(null);
    cookieUtils.clearAuthCookies();
  };

  const getPatientDetails = () => userProfile;

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      userProfile,
      login,
      verifyOTP,
      updateProfile,
      logout,
      getPatientDetails,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
