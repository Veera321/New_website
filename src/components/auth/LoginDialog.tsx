import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Link,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import OTPVerification from './OTPVerification';
import ProfileForm from './ProfileForm';
import { Link as RouterLink } from 'react-router-dom';

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ open, onClose }) => {
  const [step, setStep] = useState<'mobile' | 'otp' | 'profile'>('mobile');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showNotification } = useNotification();

  const handleMobileSubmit = async () => {
    if (!mobile || mobile.length !== 10) {
      showNotification('Please enter a valid 10-digit mobile number', 'error');
      return;
    }

    setLoading(true);
    try {
      await login(mobile);
      setStep('otp');
      showNotification('OTP sent successfully!', 'success');
    } catch (error: any) {
      showNotification(error.message || 'Failed to send OTP. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    if (!loading) {
      setStep('mobile');
      setMobile('');
      onClose();
    }
  };

  const handleOTPSuccess = () => {
    setStep('profile');
  };

  const handleProfileSuccess = () => {
    handleDialogClose();
    showNotification('Login successful! Welcome to PS Healthcare', 'success');
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleDialogClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 2,
        },
      }}
    >
      {step === 'mobile' && (
        <>
          <DialogTitle sx={{ pb: 1 }}>Login / Sign Up</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Please enter your mobile number to receive an OTP
            </Typography>
            <TextField
              autoFocus
              fullWidth
              label="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
              type="tel"
              placeholder="Enter 10-digit mobile number"
              InputProps={{
                startAdornment: (
                  <Typography color="text.secondary" sx={{ mr: 1 }}>
                    +91
                  </Typography>
                ),
              }}
              disabled={loading}
            />
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ 
                mt: 2, 
                display: 'block',
                textAlign: 'center',
              }}
            >
              By proceeding, you agree to PS Healthcare's{' '}
              <Link 
                component={RouterLink} 
                to="/terms" 
                onClick={() => window.open('/terms', '_blank')}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                T&C
              </Link>
              {' '}and{' '}
              <Link
                component={RouterLink}
                to="/privacy"
                onClick={() => window.open('/privacy', '_blank')}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                Privacy Policy
              </Link>
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleDialogClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={handleMobileSubmit}
              variant="contained"
              disabled={loading || mobile.length !== 10}
              sx={{ minWidth: 100 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Get OTP'}
            </Button>
          </DialogActions>
        </>
      )}

      {step === 'otp' && (
        <OTPVerification
          mobile={mobile}
          onSuccess={handleOTPSuccess}
          onBack={() => setStep('mobile')}
        />
      )}

      {step === 'profile' && (
        <ProfileForm
          mobile={mobile}
          onSuccess={handleProfileSuccess}
        />
      )}
    </Dialog>
  );
};

export default LoginDialog;
