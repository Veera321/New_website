import React, { createContext, useContext, useState, useEffect } from 'react';
import { sendAdminNotification } from '../utils/emailService';

export interface CartRequest {
  id: string;
  patientName: string;
  address: string;
  mobile: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  status: 'pending' | 'called' | 'follow-up' | 'closed';
  createdAt: string;
  notes?: string;
  totalAmount: number;
}

interface CartRequestContextType {
  requests: CartRequest[];
  updateRequestStatus: (id: string, status: CartRequest['status'], notes?: string) => void;
  addRequest: (request: Omit<CartRequest, 'id' | 'createdAt'>) => void;
  getRequest: (id: string) => CartRequest | undefined;
  refreshRequests: () => void;
  deleteRequest: (id: string) => void;
  loading: boolean;
}

const CartRequestContext = createContext<CartRequestContextType | undefined>(undefined);

export const useCartRequests = () => {
  const context = useContext(CartRequestContext);
  if (!context) {
    throw new Error('useCartRequests must be used within a CartRequestProvider');
  }
  return context;
};

export const CartRequestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<CartRequest[]>(() => {
    const saved = localStorage.getItem('cartRequests');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('cartRequests', JSON.stringify(requests));
  }, [requests]);

  const refreshRequests = () => {
    setLoading(true);
    try {
      const saved = localStorage.getItem('cartRequests');
      if (saved) {
        setRequests(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error refreshing requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = (id: string, status: CartRequest['status'], notes?: string) => {
    setRequests(prev =>
      prev.map(request =>
        request.id === id
          ? { ...request, status, ...(notes && { notes }) }
          : request
      )
    );
  };

  const addRequest = (request: Omit<CartRequest, 'id' | 'createdAt'>) => {
    const newRequest: CartRequest = {
      ...request,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setRequests(prev => [...prev, newRequest]);

    // Send email notification
    sendAdminNotification({
      subject: 'New Cart Request',
      message: 'A new cart request has been received.',
      details: {
        'Patient Name': request.patientName,
        'Mobile': request.mobile,
        'Address': request.address,
        'Total Amount': `₹${request.totalAmount}`,
        'Items': request.items.map(item => `${item.name} (₹${item.price})`).join('\n'),
      },
    }).catch(error => {
      console.error('Failed to send email notification:', error);
    });
  };

  const getRequest = (id: string) => {
    return requests.find(request => request.id === id);
  };

  const deleteRequest = (id: string) => {
    setRequests(prev => prev.filter(request => request.id !== id));
  };

  return (
    <CartRequestContext.Provider
      value={{
        requests,
        updateRequestStatus,
        addRequest,
        getRequest,
        refreshRequests,
        deleteRequest,
        loading,
      }}
    >
      {children}
    </CartRequestContext.Provider>
  );
};
