import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Close, CloudUpload } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import SuccessAnimation from './SuccessAnimation';

const UploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  textAlign: 'center',
  cursor: 'pointer',
  marginBottom: theme.spacing(2),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

interface PrescriptionUploadDialogProps {
  open: boolean;
  onClose: () => void;
}

const PrescriptionUploadDialog: React.FC<PrescriptionUploadDialogProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
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
    
    // Handle phone number input
    if (name === 'phone') {
      // Only allow digits and limit to 10 characters
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

  const handleSubmit = () => {
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
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    setFormData({
      name: '',
      phone: '',
      file: null,
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={fullScreen}
      disableScrollLock
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 2,
          maxHeight: '90vh',
          margin: fullScreen ? 0 : 2,
        }
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          bgcolor: '#3F1E43',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
          Upload Prescription
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          size="small"
          sx={{
            color: 'white',
            p: 0.5,
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 1.5, sm: 2 }, mt: 1 }}>
        {showSuccess ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <SuccessAnimation message="Prescription uploaded successfully! Our team will contact you shortly." />
          </Box>
        ) : (
          <>
            <TextField
              fullWidth
              size="small"
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              margin="normal"
              required
              placeholder="Enter your full name"
            />
            <TextField
              fullWidth
              size="small"
              label="Mobile Number"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              margin="normal"
              required
              placeholder="Enter 10-digit mobile number"
              inputProps={{
                maxLength: 10,
                pattern: '[0-9]*',
                inputMode: 'numeric',
              }}
              error={formData.phone.length > 0 && formData.phone.length !== 10}
              helperText={formData.phone.length > 0 && formData.phone.length !== 10 ? 'Mobile number must be 10 digits' : ''}
            />
            <input
              type="file"
              accept="image/*,.pdf"
              style={{ display: 'none' }}
              id="prescription-file"
              onChange={handleFileSelect}
            />
            <label htmlFor="prescription-file">
              <UploadBox mt={2}>
                <CloudUpload sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="subtitle1" gutterBottom>
                  {formData.file ? formData.file.name : 'Click to upload prescription'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Supported formats: JPEG, PNG, PDF
                </Typography>
              </UploadBox>
            </label>
          </>
        )}
      </DialogContent>

      {!showSuccess && (
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            disabled={!formData.name || !formData.phone || !formData.file}
            sx={{
              bgcolor: '#3F1E43',
              '&:hover': {
                bgcolor: '#2f1632',
              },
              py: 1,
            }}
          >
            Upload Prescription
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default PrescriptionUploadDialog;
