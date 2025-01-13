import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  SelectChangeEvent,
} from '@mui/material';
import { useNotification } from '../context/NotificationContext';
import { useHomeCollection } from '../context/HomeCollectionContext';

interface HomeCollectionFormProps {
  onSubmitSuccess?: () => void;
  onClose?: () => void;
}

interface FormData {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  preferredDate: string;
  preferredTime: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  pincode?: string;
  preferredDate?: string;
  preferredTime?: string;
}

const initialFormData: FormData = {
  name: '',
  phone: '',
  address: '',
  city: '',
  pincode: '',
  preferredDate: '',
  preferredTime: '',
};

const timeSlots = [
  '07:00 AM - 09:00 AM',
  '09:00 AM - 11:00 AM',
  '11:00 AM - 01:00 PM',
  '01:00 PM - 03:00 PM',
  '03:00 PM - 05:00 PM',
  '05:00 PM - 07:00 PM',
];

const HomeCollectionForm: React.FC<HomeCollectionFormProps> = ({ onSubmitSuccess, onClose }) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();
  const { addRequest } = useHomeCollection();

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'PIN code is required';
    } else if (!/^[0-9]{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Invalid PIN code';
    }
    
    if (!formData.preferredDate) {
      newErrors.preferredDate = 'Preferred date is required';
    }
    
    if (!formData.preferredTime) {
      newErrors.preferredTime = 'Preferred time is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (validateForm()) {
        // Add the request to the context
        addRequest({
          fullName: formData.name,
          mobileNumber: formData.phone,
          address: formData.address,
          city: formData.city,
          pinCode: formData.pincode,
          preferredDate: formData.preferredDate,
          preferredTime: formData.preferredTime,
        });

        showNotification('Home collection request submitted successfully!', 'success');
        setFormData(initialFormData);
        if (onSubmitSuccess) onSubmitSuccess();
        if (onClose) onClose();
      }
    } catch (error) {
      console.error('Error submitting home collection request:', error);
      showNotification('Failed to submit request. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;

    // Handle phone number input
    if (field === 'phone') {
      // Only allow digits and limit to 10 characters
      const sanitizedValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData({ ...formData, [field]: sanitizedValue });
      if (errors[field]) {
        setErrors({ ...errors, [field]: undefined });
      }
    } else {
      setFormData({ ...formData, [field]: value });
      if (errors[field]) {
        setErrors({ ...errors, [field]: undefined });
      }
    }
  };

  const handleTimeChange = (e: SelectChangeEvent<string>) => {
    setFormData({ ...formData, preferredTime: e.target.value });
    if (errors.preferredTime) {
      setErrors({ ...errors, preferredTime: undefined });
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, preferredDate: e.target.value });
    if (errors.preferredDate) {
      setErrors({ ...errors, preferredDate: undefined });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Grid container spacing={1.5}>
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: '#666' }}>
            Please fill in your details for home collection
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            size="small"
            fullWidth
            label="Full Name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange('name')}
            error={!!errors.name}
            helperText={errors.name}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            size="small"
            fullWidth
            label="Mobile Number"
            placeholder="10-digit mobile number"
            value={formData.phone}
            onChange={handleChange('phone')}
            error={!!errors.phone}
            helperText={errors.phone}
            required
            inputProps={{
              maxLength: 10,
              pattern: '[0-9]*',
              inputMode: 'numeric',
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            size="small"
            fullWidth
            label="Complete Address"
            placeholder="House/Flat No., Building, Street, Area"
            multiline
            rows={2}
            value={formData.address}
            onChange={handleChange('address')}
            error={!!errors.address}
            helperText={errors.address}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            size="small"
            fullWidth
            label="City"
            placeholder="Enter your city"
            value={formData.city}
            onChange={handleChange('city')}
            error={!!errors.city}
            helperText={errors.city}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            size="small"
            fullWidth
            label="PIN Code"
            placeholder="6-digit PIN code"
            value={formData.pincode}
            onChange={handleChange('pincode')}
            error={!!errors.pincode}
            helperText={errors.pincode}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            size="small"
            fullWidth
            label="Preferred Date"
            type="date"
            value={formData.preferredDate}
            onChange={handleDateChange}
            error={!!errors.preferredDate}
            helperText={errors.preferredDate}
            required
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              min: new Date().toISOString().split('T')[0],
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.preferredTime} required size="small">
            <InputLabel>Preferred Time</InputLabel>
            <Select
              value={formData.preferredTime}
              label="Preferred Time"
              onChange={handleTimeChange}
            >
              {timeSlots.map((slot) => (
                <MenuItem key={slot} value={slot}>
                  {slot}
                </MenuItem>
              ))}
            </Select>
            {errors.preferredTime && (
              <FormHelperText>{errors.preferredTime}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              mt: { xs: 0.5, sm: 1 },
              py: 1,
              bgcolor: '#3F1E43',
              '&:hover': {
                bgcolor: '#2E1632',
              },
            }}
          >
            {loading ? 'Submitting...' : 'Schedule Home Collection'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomeCollectionForm;
