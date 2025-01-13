import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  FormHelperText,
  Input,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import { useDoctor, Doctor } from '../../context/DoctorContext';
import { useNotification } from '../../context/NotificationContext';
import { useImages } from '../../context/ImageContext';

interface DoctorFormData {
  name: string;
  specialty: string;
  qualification: string;
  experience: string;
  image: string;
  availability: {
    days: string[];
    time: string;
  };
  consultationFee: number;
  about: string;
}

const initialFormData: DoctorFormData = {
  name: '',
  specialty: '',
  qualification: '',
  experience: '',
  image: '',
  availability: {
    days: [],
    time: '',
  },
  consultationFee: 0,
  about: '',
};

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const specialties = [
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'Neurology',
  'Oncology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Urology',
];

const DoctorManager: React.FC = () => {
  const { doctors, addDoctor, updateDoctor, deleteDoctor } = useDoctor();
  const { showNotification } = useNotification();
  const { uploadImage } = useImages();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<DoctorFormData>(initialFormData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const uploadedUrl = await uploadImage(file);
      setFormData(prev => ({ ...prev, image: uploadedUrl }));
      showNotification('Image uploaded successfully', 'success');
    } catch (error) {
      showNotification('Failed to upload image', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleOpen = (doctor?: Doctor) => {
    if (doctor) {
      setFormData({
        name: doctor.name,
        specialty: doctor.specialty,
        qualification: doctor.qualification,
        experience: doctor.experience,
        image: doctor.image,
        availability: doctor.availability,
        consultationFee: doctor.consultationFee,
        about: doctor.about,
      });
      setEditingId(doctor.id);
    } else {
      setFormData(initialFormData);
      setEditingId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData(initialFormData);
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (editingId) {
      updateDoctor(editingId, formData);
      showNotification('Doctor updated successfully', 'success');
    } else {
      addDoctor(formData);
      showNotification('Doctor added successfully', 'success');
    }
    handleClose();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      deleteDoctor(id);
      showNotification('Doctor deleted successfully', 'success');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ color: 'primary.main' }}>
          Doctor Manager
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{
            background: `linear-gradient(45deg, primary.main 30%, primary.light 90%)`,
            color: 'white',
            boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
          }}
        >
          Add New Doctor
        </Button>
      </Box>

      <Grid container spacing={3}>
        {doctors.map((doctor) => (
          <Grid item xs={12} sm={6} md={4} key={doctor.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={doctor.image || '/placeholder-doctor.jpg'}
                alt={doctor.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2">
                  {doctor.name}
                </Typography>
                <Chip
                  label={doctor.specialty}
                  color="primary"
                  size="small"
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {doctor.qualification}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Experience: {doctor.experience}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Available: {doctor.availability.days.join(', ')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Time: {doctor.availability.time}
                </Typography>
                <Typography variant="body2" color="primary">
                  Consultation Fee: ₹{doctor.consultationFee}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <IconButton onClick={() => handleOpen(doctor)} color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(doctor.id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingId ? 'Edit Doctor' : 'Add New Doctor'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ my: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Specialty</InputLabel>
              <Select
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                label="Specialty"
              >
                {specialties.map((specialty) => (
                  <MenuItem key={specialty} value={specialty}>
                    {specialty}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Qualification"
              fullWidth
              value={formData.qualification}
              onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
            />
            <TextField
              label="Experience"
              fullWidth
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Available Days</InputLabel>
              <Select
                multiple
                value={formData.availability.days}
                onChange={(e) => setFormData({
                  ...formData,
                  availability: {
                    ...formData.availability,
                    days: typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value,
                  },
                })}
                input={<Input />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {weekDays.map((day) => (
                  <MenuItem key={day} value={day}>
                    {day}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Available Time"
              fullWidth
              value={formData.availability.time}
              onChange={(e) => setFormData({
                ...formData,
                availability: { ...formData.availability, time: e.target.value },
              })}
              placeholder="e.g., 9:00 AM - 5:00 PM"
            />
            <TextField
              label="Consultation Fee"
              type="number"
              fullWidth
              value={formData.consultationFee}
              onChange={(e) => setFormData({ ...formData, consultationFee: Number(e.target.value) })}
              InputProps={{
                startAdornment: <Typography>₹</Typography>,
              }}
            />
            <TextField
              label="About"
              fullWidth
              multiline
              rows={4}
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload Image'}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>
              {formData.image && (
                <Box
                  component="img"
                  src={formData.image}
                  alt="Preview"
                  sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 1 }}
                />
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingId ? 'Update' : 'Add'} Doctor
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DoctorManager;
