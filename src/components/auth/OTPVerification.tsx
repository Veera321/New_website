import React, { useState, useRef, useEffect } from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

interface OTPVerificationProps {
  mobile: string;
  onSuccess: () => void;
  onBack: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  mobile,
  onSuccess,
  onBack,
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const { verifyOTP } = useAuth();
  const { showNotification } = useNotification();

  useEffect(() => {
    const timer = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      showNotification('Please enter a valid 6-digit OTP', 'error');
      return;
    }

    setLoading(true);
    try {
      const success = await verifyOTP(otpString);
      if (success) {
        onSuccess();
      } else {
        showNotification('Invalid OTP. Please try again.', 'error');
      }
    } catch (error) {
      showNotification('Failed to verify OTP. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DialogTitle sx={{ pb: 1 }}>Enter OTP</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Enter the OTP sent to +91 {mobile}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', my: 3 }}>
          {otp.map((digit, index) => (
            <TextField
              key={index}
              inputRef={(el) => (refs.current[index] = el)}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              variant="outlined"
              size="small"
              inputProps={{
                maxLength: 1,
                style: { textAlign: 'center', width: '30px' },
              }}
              autoFocus={index === 0}
            />
          ))}
        </Box>
        <Typography variant="body2" color="text.secondary" align="center">
          {resendTimer > 0 ? (
            `Resend OTP in ${resendTimer}s`
          ) : (
            <Button color="primary" onClick={() => setResendTimer(30)}>
              Resend OTP
            </Button>
          )}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onBack}>Back</Button>
        <Button
          onClick={handleVerify}
          variant="contained"
          disabled={loading || otp.join('').length !== 6}
        >
          {loading ? <CircularProgress size={24} /> : 'Verify'}
        </Button>
      </DialogActions>
    </>
  );
};

export default OTPVerification;
