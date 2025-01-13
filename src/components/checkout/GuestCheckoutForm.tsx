import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Grid,
  Typography,
} from '@mui/material';
import { useNotification } from '../../context/NotificationContext';
import { useCart } from '../../context/CartContext';
import { useCartRequests } from '../../context/CartRequestContext';

interface GuestCheckoutFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface GuestFormData {
  name: string;
  mobile: string;
  address: string;
}

const GuestCheckoutForm: React.FC<GuestCheckoutFormProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();
  const { items, totalAmount } = useCart();
  const { addRequest } = useCartRequests();
  const [formData, setFormData] = useState<GuestFormData>({
    name: '',
    mobile: '',
    address: '',
  });

  const handleChange = (field: keyof GuestFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const validateMobile = (mobile: string) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.address.trim() || !formData.mobile.trim()) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    if (!validateMobile(formData.mobile)) {
      showNotification('Please enter a valid mobile number', 'error');
      return;
    }

    try {
      setLoading(true);

      // Add request to CartRequestContext
      addRequest({
        patientName: formData.name,
        address: formData.address,
        mobile: formData.mobile,
        items: items.map(item => ({
          id: item.id.toString(),
          name: item.name,
          price: item.price,
        })),
        status: 'pending',
        totalAmount: totalAmount,
      });

      showNotification('Successfully submitted, and our executive will call you.', 'success');
      onSuccess();
    } catch (error) {
      showNotification('An error occurred. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 2,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>Checkout Details</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Please provide your details for order confirmation
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange('name')}
              required
              disabled={loading}
              placeholder="Enter your full name"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Mobile Number"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange('mobile')}
              required
              disabled={loading}
              placeholder="Enter 10-digit mobile number"
              InputProps={{
                startAdornment: '+91 ',
              }}
              inputProps={{
                maxLength: 10,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange('address')}
              multiline
              rows={3}
              required
              disabled={loading}
              placeholder="Enter your complete address"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !formData.name || !formData.mobile || !formData.address}
        >
          {loading ? <CircularProgress size={24} /> : 'Place Order'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GuestCheckoutForm;
