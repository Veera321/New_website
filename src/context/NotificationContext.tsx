import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

interface NotificationContextType {
  showNotification: (message: string, severity?: AlertColor) => void;
  hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('success');
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const hideNotification = useCallback(() => {
    setOpen(false);
  }, []);

  const showNotification = useCallback((newMessage: string, newSeverity: AlertColor = 'success') => {
    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    setMessage(newMessage);
    setSeverity(newSeverity);
    setOpen(true);

    // Set new timeout to hide notification after 2 seconds
    const newTimeoutId = setTimeout(() => {
      hideNotification();
    }, 2000);

    setTimeoutId(newTimeoutId);
  }, [hideNotification, timeoutId]);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    hideNotification();
  };

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          position: 'fixed',
          top: '120px !important', // This positions it below both Navbar and SubHeader
          right: '16px !important',
          zIndex: 2000,
        }}
      >
        <Alert 
          onClose={handleClose} 
          severity={severity}
          variant="filled"
          sx={{ 
            width: '100%',
            minWidth: '300px',
            boxShadow: 3,
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};
