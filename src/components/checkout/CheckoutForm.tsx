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
  MenuItem,
  Typography,
  Box,
} from '@mui/material';
import { usePatientForm } from '../../hooks/usePatientForm';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useCartRequests } from '../../context/CartRequestContext';

interface CheckoutFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  submitButtonText?: string;
  successMessage?: string;
}

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS = ['male', 'female', 'other'] as const;

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  open,
  onClose,
  onSuccess,
  title = 'Patient Details',
  submitButtonText = 'Submit',
  successMessage = 'Successfully submitted, and our executive will call you.',
}) => {
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();
  const { userProfile } = useAuth();
  const { items, totalAmount } = useCart();
  const { addRequest } = useCartRequests();
  const { formData, handleChange, saveProfile } = usePatientForm({
    requiredFields: ['name', 'mobile', 'address'],
  });

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.address.trim()) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    try {
      setLoading(true);
      
      // Save profile data if user is logged in
      if (userProfile) {
        await saveProfile();
      }

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

      showNotification(successMessage, 'success');
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
      <DialogTitle sx={{ pb: 1 }}>{title}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange('name')}
              required
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Mobile Number"
              value={formData.mobile}
              disabled
              InputProps={{
                startAdornment: '+91 ',
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange('gender')}
              disabled={loading}
            >
              <MenuItem value="">Select Gender</MenuItem>
              {GENDERS.map((gender) => (
                <MenuItem key={gender} value={gender}>
                  {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange('age')}
              disabled={loading}
              inputProps={{ min: 0, max: 150 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Blood Group"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange('bloodGroup')}
              disabled={loading}
            >
              <MenuItem value="">Select Blood Group</MenuItem>
              {BLOOD_GROUPS.map((group) => (
                <MenuItem key={group} value={group}>
                  {group}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Alternate Contact"
              name="alternateContact"
              value={formData.alternateContact}
              onChange={handleChange('alternateContact')}
              disabled={loading}
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
          disabled={loading || !formData.name || !formData.address}
        >
          {loading ? <CircularProgress size={24} /> : submitButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CheckoutForm;
