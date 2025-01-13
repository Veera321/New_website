import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Paper,
  useTheme,
  useMediaQuery,
  Alert,
  TextField,
  DialogContentText,
  Snackbar,
} from '@mui/material';
import { useDoctor } from '../context/DoctorContext';
import { useAppointment } from '../context/AppointmentContext';
import { Doctor } from '../context/DoctorContext';

const commonSpecialties = [
  'All',
  'Others',
  'General Physician',
  'Cardiologist',
  'Neurologist',
  'Orthopedic',
  'Pediatrician',
  'Gynecologist',
  'Dermatologist',
  'ENT Specialist',
  'Psychiatrist',
  'Dentist'
];

const DoctorConsultation: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { doctors } = useDoctor();
  const { addAppointment } = useAppointment();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    patientName: '',
    contactNumber: '',
    reason: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const specialtyParam = searchParams.get('specialty');
    if (specialtyParam) {
      setSelectedSpecialty(decodeURIComponent(specialtyParam));
    }
  }, [searchParams]);

  const handleSpecialtyClick = (specialty: string) => {
    setSelectedSpecialty(specialty);
    
    if (specialty !== 'All') {
      setSearchParams({ specialty });
    } else {
      setSearchParams({});
    }
  };

  const filteredDoctors = doctors.filter(doctor => {
    if (selectedSpecialty === 'All') return true;
    if (selectedSpecialty === 'Others') {
      return !commonSpecialties.slice(2).includes(doctor.specialty); 
    }
    return doctor.specialty === selectedSpecialty;
  });

  const handleBookingSubmit = () => {
    if (selectedDoctor) {
      addAppointment({
        doctorId: selectedDoctor.id,
        patientName: appointmentForm.patientName,
        contactNumber: appointmentForm.contactNumber,
        reason: appointmentForm.reason,
      });
      setBookingDialogOpen(false);
      setDialogOpen(false);
      setSnackbarOpen(true);
      setAppointmentForm({
        patientName: '',
        contactNumber: '',
        reason: '',
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAppointmentForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Specialties Filter */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 4, 
          backgroundColor: theme.palette.background.default 
        }}
      >
        <Typography variant="h6" gutterBottom>
          Filter by Specialty
        </Typography>
        <Box 
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 1,
            '& > *': {
              margin: 0.5,
            },
          }}
        >
          {commonSpecialties.map((specialty) => (
            <Chip
              key={specialty}
              label={specialty}
              onClick={() => handleSpecialtyClick(specialty)}
              color={selectedSpecialty === specialty ? "primary" : "default"}
              variant={selectedSpecialty === specialty ? "filled" : "outlined"}
              sx={{ 
                borderRadius: '16px',
                '&:hover': {
                  backgroundColor: theme.palette.primary.light,
                  color: theme.palette.primary.contrastText,
                },
              }}
            />
          ))}
        </Box>
      </Paper>

      {/* Doctors Grid */}
      {filteredDoctors.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No doctors found for the selected specialty. Please try a different filter.
        </Alert>
      ) : (
        <Grid container spacing={1.5}>
          {filteredDoctors.map((doctor) => (
            <Grid item xs={12} sm={6} md={3} key={doctor.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <Box sx={{ position: 'relative', height: 140 }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={doctor.image || '/default-doctor.jpg'}
                    alt={doctor.name}
                    sx={{ objectFit: 'cover' }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1, p: 1.5, pb: 0 }}>
                  <Typography variant="subtitle1" component="h2" sx={{ fontSize: '1rem', mb: 0.25, fontWeight: 500 }}>
                    {doctor.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', mb: 0.25 }}>
                    {doctor.specialty}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', mb: 0.25 }}>
                    {doctor.qualification}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', mb: 0.25 }}>
                    {doctor.experience} exp
                  </Typography>
                  <Typography variant="body2" color="primary" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                    ₹{doctor.consultationFee}
                  </Typography>
                </CardContent>
                <Box sx={{ px: 1.5, pb: 1.5, pt: 0.5 }}>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    size="small"
                    sx={{ 
                      py: 0.5,
                      fontSize: '0.8125rem',
                    }}
                    onClick={() => {
                      setSelectedDoctor(doctor);
                      setDialogOpen(true);
                    }}
                  >
                    View Details
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Doctor Details Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedDoctor && (
          <>
            <DialogTitle>{selectedDoctor.name}</DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  Specialty: {selectedDoctor.specialty}
                </Typography>
                <Typography variant="body1" paragraph>
                  {selectedDoctor.about}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  Qualifications
                </Typography>
                <Typography variant="body2" paragraph>
                  {selectedDoctor.qualification}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  Experience
                </Typography>
                <Typography variant="body2" paragraph>
                  {selectedDoctor.experience}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  Availability
                </Typography>
                <Typography variant="body2" paragraph>
                  Days: {selectedDoctor.availability.days.join(', ')}
                  <br />
                  Time: {selectedDoctor.availability.time}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                  Consultation Fee: ₹{selectedDoctor.consultationFee}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => setBookingDialogOpen(true)}
              >
                Book Appointment
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Appointment Booking Dialog */}
      <Dialog
        open={bookingDialogOpen}
        onClose={() => setBookingDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Book Appointment</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Please fill in your details to book an appointment with {selectedDoctor?.name}.
          </DialogContentText>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              autoFocus
              required
              name="patientName"
              label="Patient Name"
              fullWidth
              value={appointmentForm.patientName}
              onChange={handleInputChange}
              size="small"
            />
            <TextField
              required
              name="contactNumber"
              label="Contact Number"
              fullWidth
              value={appointmentForm.contactNumber}
              onChange={handleInputChange}
              size="small"
            />
            <TextField
              required
              name="reason"
              label="Reason for Visit"
              multiline
              rows={3}
              fullWidth
              value={appointmentForm.reason}
              onChange={handleInputChange}
              size="small"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleBookingSubmit}
            variant="contained"
            disabled={!appointmentForm.patientName || !appointmentForm.contactNumber || !appointmentForm.reason}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message="Appointment booked successfully!"
      />
    </Container>
  );
};

export default DoctorConsultation;
