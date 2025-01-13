import axios from 'axios';
import { httpClient } from '../utils/httpClient';

// For testing without backend
const MOCK_MODE = true;
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const API_BASE_URL = 'https://api.pshealthcare.com/api'; // Replace with your actual API base URL

interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  profile?: {
    name: string;
    mobile: string;
    address: string;
    email?: string;
    gender?: 'male' | 'female' | 'other';
    age?: number;
    bloodGroup?: string;
    alternateContact?: string;
  };
}

export const authService = {
  // Request OTP for login
  requestOTP: async (mobile: string): Promise<AuthResponse> => {
    if (MOCK_MODE) {
      // For testing: generate and log OTP
      const otp = generateOTP();
      console.log(`Mock OTP for ${mobile}: ${otp}`);
      return { success: true, message: 'OTP sent successfully' };
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/request-otp`, {
        mobile,
        countryCode: '+91'
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to request OTP');
    }
  },

  // Verify OTP and get token
  verifyOTP: async (mobile: string, otp: string): Promise<AuthResponse> => {
    if (MOCK_MODE) {
      // For testing: accept any 6-digit OTP
      return { 
        success: otp.length === 6, 
        token: 'mock-jwt-token'
      };
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
        mobile,
        otp,
        countryCode: '+91'
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to verify OTP');
    }
  },

  // Update user profile
  updateProfile: async (data: any): Promise<AuthResponse> => {
    if (MOCK_MODE) {
      return { 
        success: true, 
        profile: data 
      };
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/auth/profile`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },

  // Send OTP for login
  sendOTP: async (mobile: string): Promise<{ success: boolean; message: string }> => {
    if (MOCK_MODE) {
      // For testing: generate and log OTP
      const otp = generateOTP();
      console.log(`Mock OTP for ${mobile}: ${otp}`);
      return { success: true, message: 'OTP sent successfully' };
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/send-otp`, {
        mobile,
        countryCode: '+91'
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send OTP');
    }
  },
};
