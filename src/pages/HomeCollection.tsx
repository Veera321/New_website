import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Autocomplete,
  AutocompleteProps,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { styled } from '@mui/material/styles';
import { useNotification } from '../context/NotificationContext';

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3),
  },
  marginTop: theme.spacing(2),
  borderRadius: theme.spacing(1),
  maxWidth: 600,
  margin: '0 auto',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  position: 'relative',
  overflow: 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: 'linear-gradient(90deg, #3F1E43 0%, #7B4397 100%)',
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
      },
    },
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: '2px',
      },
    },
  },
  '& .MuiInputLabel-root': {
    '&.Mui-focused': {
      color: theme.palette.primary.main,
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  padding: '10px 24px',
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: 'none',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  borderRadius: '6px',
  '& .MuiChip-deleteIcon': {
    color: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.primary.dark,
    },
  },
}));

interface Test {
  id: number;
  name: string;
  price: number;
}

type StyledAutocompleteProps = Omit<AutocompleteProps<Test, false, false, false>, 'renderInput'>;

const StyledAutocomplete = styled(
  Autocomplete<Test, false, false, false>,
  { shouldForwardProp: (prop) => prop !== 'theme' }
)<StyledAutocompleteProps>(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
      },
    },
  },
}));

const availableTests: Test[] = [
  { id: 1, name: 'Complete Blood Count', price: 500 },
  { id: 2, name: 'Diabetes Screening', price: 800 },
  { id: 3, name: 'Thyroid Profile', price: 1200 },
  { id: 4, name: 'Lipid Profile', price: 700 },
  { id: 5, name: 'Liver Function Test', price: 900 },
  { id: 6, name: 'Kidney Function Test', price: 1000 },
  { id: 7, name: 'Vitamin D Test', price: 1500 },
  { id: 8, name: 'Vitamin B12 Test', price: 1300 },
  { id: 9, name: 'Hemoglobin Test', price: 300 },
  { id: 10, name: 'Blood Sugar Test', price: 200 },
];

const HomeCollection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    address: '',
    date: '',
    time: '',
  });
  const [selectedTests, setSelectedTests] = useState<Test[]>([]);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const { showNotification } = useNotification();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTestSelect = (test: Test | null) => {
    if (test && !selectedTests.find(t => t.id === test.id)) {
      setSelectedTests(prev => [...prev, test]);
    }
  };

  const handleRemoveTest = (testId: number) => {
    setSelectedTests(prev => prev.filter(test => test.id !== testId));
  };

  const calculateTotal = () => {
    return selectedTests.reduce((total, test) => total + test.price, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contact || !formData.address || !formData.date || !formData.time || selectedTests.length === 0) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }
    setSuccessDialogOpen(true);
  };

  const fetchLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      
      // Using Nominatim API for reverse geocoding (free and doesn't require API key)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch address');
      }

      const data = await response.json();
      
      // Format the address from the response
      const addressComponents = [
        data.address.road,
        data.address.suburb,
        data.address.city || data.address.town,
        data.address.state,
        data.address.postcode
      ].filter(Boolean);

      const formattedAddress = addressComponents.join(', ');
      
      setFormData(prev => ({
        ...prev,
        address: formattedAddress
      }));
      
      showNotification('Location fetched successfully', 'success');
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'GeolocationPositionError') {
          showNotification('Please enable location access to use this feature', 'error');
        } else {
          showNotification('Failed to fetch location. Please enter address manually', 'error');
        }
      }
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <FormContainer elevation={3}>
            <Typography 
              variant="h6" 
              align="center" 
              color="primary" 
              sx={{ 
                mb: 2,
                fontWeight: 600,
                position: 'relative',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-4px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '30px',
                  height: '2px',
                  backgroundColor: 'primary.main',
                  borderRadius: '1px',
                }
              }}
            >
              Home Collection
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={1.5}>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    label="Patient Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    label="Contact Number"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    required
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <StyledTextField
                      fullWidth
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      size="small"
                    />
                    <StyledButton
                      variant="outlined"
                      onClick={fetchLocation}
                      disabled={isLoadingLocation}
                      sx={{ minWidth: 'auto', px: 1.5 }}
                      size="small"
                    >
                      {isLoadingLocation ? (
                        <CircularProgress size={20} />
                      ) : (
                        <LocationOnIcon fontSize="small" />
                      )}
                    </StyledButton>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    label="Preferred Date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: today }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    label="Preferred Time"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <StyledAutocomplete
                    options={availableTests}
                    getOptionLabel={(option) => option.name}
                    onChange={(_event, value) => handleTestSelect(value)}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderInput={(params) => (
                      <StyledTextField
                        {...params}
                        label="Select Tests"
                        size="small"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 0.5,
                    p: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    borderRadius: 1,
                    minHeight: '40px',
                    alignItems: 'center'
                  }}>
                    {selectedTests.length === 0 ? (
                      <Typography color="text.secondary" variant="body2">
                        No tests selected
                      </Typography>
                    ) : (
                      selectedTests.map((test) => (
                        <StyledChip
                          key={test.id}
                          label={`${test.name} (₹${test.price})`}
                          onDelete={() => handleRemoveTest(test.id)}
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      ))
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    backgroundColor: 'primary.main',
                    color: 'white',
                    p: 1.5,
                    borderRadius: 1,
                    mt: 1
                  }}>
                    <Typography variant="subtitle1">Total Amount</Typography>
                    <Typography variant="subtitle1">₹{calculateTotal()}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <StyledButton
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="medium"
                    sx={{ mt: 1 }}
                  >
                    Book Home Collection
                  </StyledButton>
                </Grid>
              </Grid>
            </Box>
          </FormContainer>
        </Grid>

        <Grid item xs={12} md={5}>
          {selectedTests.length > 0 && (
            <Paper 
              elevation={3} 
              sx={{ 
                p: theme.spacing(2),
                position: { md: 'sticky' },
                top: { md: theme.spacing(2) },
                maxHeight: { md: 'calc(100vh - 100px)' },
                overflowY: 'auto'
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
                Selected Tests
              </Typography>
              <List disablePadding>
                {selectedTests.map((test) => (
                  <ListItem
                    key={test.id}
                    secondaryAction={
                      <IconButton 
                        edge="end" 
                        aria-label="delete"
                        onClick={() => handleRemoveTest(test.id)}
                        size="small"
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    }
                    sx={{
                      py: 1,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <ListItemText
                      primary={test.name}
                      secondary={`₹${test.price}`}
                      primaryTypographyProps={{
                        variant: 'body2',
                        fontWeight: 500,
                      }}
                      secondaryTypographyProps={{
                        variant: 'body2',
                        color: 'primary',
                      }}
                    />
                  </ListItem>
                ))}
              </List>
              <Box
                sx={{
                  mt: 2,
                  pt: 2,
                  borderTop: '2px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  Total Amount
                </Typography>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  ₹{calculateTotal()}
                </Typography>
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>

      <Dialog
        open={successDialogOpen}
        onClose={() => setSuccessDialogOpen(false)}
      >
        <DialogTitle>Success</DialogTitle>
        <DialogContent>
          <Typography>
            Thank you for booking a home collection. Our executive will call you shortly to confirm your appointment.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSuccessDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HomeCollection;
