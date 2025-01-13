import React, { useState } from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Grid,
  MenuItem,
} from '@mui/material';
import { usePatientForm } from '../../hooks/usePatientForm';
import { useNotification } from '../../context/NotificationContext';

interface ProfileFormProps {
  mobile: string;
  onSuccess: () => void;
}

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS = ['male', 'female', 'other'] as const;

type Gender = typeof GENDERS[number];

const ProfileForm: React.FC<ProfileFormProps> = ({ mobile, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();
  const { formData, handleChange, saveProfile, errors } = usePatientForm({
    requiredFields: ['name', 'mobile', 'address'],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = await saveProfile();
      if (success) {
        showNotification('Profile updated successfully', 'success');
        onSuccess?.();
      }
    } catch (error) {
      showNotification('Failed to update profile', 'error');
    }
    setLoading(false);
  };

  return (
    <>
      <DialogTitle sx={{ pb: 1 }}>Complete Your Profile</DialogTitle>
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
              name="mobile"
              value={formData.mobile}
              onChange={handleChange('mobile')}
              required
              error={!!errors.mobile}
              helperText={errors.mobile}
              inputProps={{
                maxLength: 10,
                pattern: '[0-9]*',
                inputMode: 'numeric',
              }}
              placeholder="Enter 10-digit mobile number"
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
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !formData.name || !formData.address}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : 'Complete Registration'}
        </Button>
      </DialogActions>
    </>
  );
};

export default ProfileForm;
