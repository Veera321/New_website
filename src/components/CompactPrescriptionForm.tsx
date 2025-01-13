import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
  styled,
} from '@mui/material';
import { CloudUpload, Close } from '@mui/icons-material';
import SuccessAnimation from './SuccessAnimation';

const UploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  textAlign: 'center',
  cursor: 'pointer',
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

interface CompactPrescriptionFormProps {
  onClose?: () => void;
}

const CompactPrescriptionForm: React.FC<CompactPrescriptionFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    file: null as File | null,
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        file: event.target.files![0],
      }));
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    
    if (name === 'phone') {
      const sanitizedValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({
        ...prev,
        [name]: sanitizedValue,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual file upload logic
    console.log('Uploading prescription:', formData);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setFormData({
        name: '',
        phone: '',
        file: null,
      });
      onClose?.();
    }, 2000);
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        position: 'relative',
      }}
    >
      {onClose && (
        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <Close fontSize="small" />
        </IconButton>
      )}

      <Typography variant="h6" gutterBottom sx={{ mb: 2, fontSize: '1.1rem' }}>
        Upload Prescription
      </Typography>

      {showSuccess ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="150px">
          <SuccessAnimation message="Prescription uploaded successfully! Our team will contact you shortly." />
        </Box>
      ) : (
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <TextField
              size="small"
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter your name"
              sx={{ flex: 1 }}
            />
            <TextField
              size="small"
              label="Mobile"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              placeholder="10-digit number"
              sx={{ flex: 1 }}
              inputProps={{
                maxLength: 10,
                pattern: '[0-9]*',
                inputMode: 'numeric',
              }}
              error={formData.phone.length > 0 && formData.phone.length !== 10}
              helperText={formData.phone.length > 0 && formData.phone.length !== 10 ? 'Must be 10 digits' : ''}
            />
          </Box>

          <input
            type="file"
            accept="image/*,.pdf"
            style={{ display: 'none' }}
            id="compact-prescription-file"
            onChange={handleFileSelect}
            required
          />
          <label htmlFor="compact-prescription-file">
            <UploadBox>
              <CloudUpload sx={{ fontSize: 24, color: 'primary.main', mb: 0.5 }} />
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                {formData.file ? formData.file.name : 'Click to upload prescription'}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                JPEG, PNG, PDF
              </Typography>
            </UploadBox>
          </label>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={!formData.name || !formData.phone || !formData.file || formData.phone.length !== 10}
            sx={{ mt: 1 }}
          >
            Submit
          </Button>
        </form>
      )}
    </Paper>
  );
};

export default CompactPrescriptionForm;
