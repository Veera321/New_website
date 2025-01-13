import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { HomeCollectionRequest, HomeCollectionStatus } from '../types/homeCollection';
import { sendAdminNotification } from '../utils/emailService';

// Generate a random ID with timestamp and random number
const generateId = () => {
  return `hc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

interface HomeCollectionContextType {
  requests: HomeCollectionRequest[];
  addRequest: (request: Omit<HomeCollectionRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => void;
  updateRequestStatus: (id: string, status: HomeCollectionStatus) => void;
  deleteRequest: (id: string) => void;
  getUnreadRequestsCount: () => number;
  markRequestAsRead: (id: string) => void;
}

const HomeCollectionContext = createContext<HomeCollectionContextType | undefined>(undefined);

// Local storage keys
const REQUESTS_STORAGE_KEY = 'homeCollectionRequests';
const READ_REQUESTS_STORAGE_KEY = 'homeCollectionReadRequests';

export const HomeCollectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage
  const [requests, setRequests] = useState<HomeCollectionRequest[]>(() => {
    const savedRequests = localStorage.getItem(REQUESTS_STORAGE_KEY);
    return savedRequests ? JSON.parse(savedRequests) : [];
  });

  const [readRequests, setReadRequests] = useState<Set<string>>(() => {
    const savedReadRequests = localStorage.getItem(READ_REQUESTS_STORAGE_KEY);
    return new Set(savedReadRequests ? JSON.parse(savedReadRequests) : []);
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem(READ_REQUESTS_STORAGE_KEY, JSON.stringify(Array.from(readRequests)));
  }, [readRequests]);

  const addRequest = useCallback((
    request: Omit<HomeCollectionRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>
  ) => {
    const now = new Date().toISOString();
    const newRequest: HomeCollectionRequest = {
      ...request,
      id: generateId(),
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };
    setRequests(prev => [newRequest, ...prev]);

    // Send email notification
    sendAdminNotification({
      subject: 'New Home Collection Request',
      message: 'A new home collection request has been received.',
      details: {
        'Full Name': request.fullName,
        'Mobile Number': request.mobileNumber,
        'Address': request.address,
        'City': request.city,
        'Pin Code': request.pinCode,
        'Preferred Date': request.preferredDate,
        'Preferred Time': request.preferredTime,
      },
    }).catch(error => {
      console.error('Failed to send email notification:', error);
    });
  }, []);

  const updateRequestStatus = useCallback((id: string, status: HomeCollectionStatus) => {
    setRequests(prev =>
      prev.map(request =>
        request.id === id
          ? { ...request, status, updatedAt: new Date().toISOString() }
          : request
      )
    );
  }, []);

  const deleteRequest = useCallback((id: string) => {
    setRequests(prev => prev.filter(request => request.id !== id));
    setReadRequests(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);

  const getUnreadRequestsCount = useCallback(() => {
    return requests.filter(request => !readRequests.has(request.id)).length;
  }, [requests, readRequests]);

  const markRequestAsRead = useCallback((id: string) => {
    setReadRequests(prev => new Set(Array.from(prev).concat([id])));
  }, []);

  return (
    <HomeCollectionContext.Provider
      value={{
        requests,
        addRequest,
        updateRequestStatus,
        deleteRequest,
        getUnreadRequestsCount,
        markRequestAsRead,
      }}
    >
      {children}
    </HomeCollectionContext.Provider>
  );
};

export const useHomeCollection = () => {
  const context = useContext(HomeCollectionContext);
  if (context === undefined) {
    throw new Error('useHomeCollection must be used within a HomeCollectionProvider');
  }
  return context;
};
