import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import HomeCollectionForm from './HomeCollectionForm';

interface HomeCollectionDialogProps {
  open: boolean;
  onClose: () => void;
}

const HomeCollectionDialog: React.FC<HomeCollectionDialogProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
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
          p: 1.5, 
          minHeight: '48px',
          bgcolor: '#3F1E43', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
          Home Collection Request
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          size="small"
          sx={{
            color: 'white',
            p: 0.5,
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: { xs: 1.5, sm: 2 } }}>
        <HomeCollectionForm onSubmitSuccess={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default HomeCollectionDialog;
