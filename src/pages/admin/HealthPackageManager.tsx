import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  Stack,
  InputAdornment,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useHealthPackage } from '../../context/HealthPackageContext';
import { HealthPackage } from '../../data/initialPackages';

const HealthPackageManager: React.FC = () => {
  const { packages, addPackage, updatePackage, deletePackage, saveChanges } = useHealthPackage();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPackage, setEditingPackage] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [formData, setFormData] = useState<HealthPackage>({
    id: 0,
    name: '',
    description: '',
    price: 0,
    image: '',
    tests: [],
    category: 'basic',
    ageGroup: '18+ years',
    gender: 'all',
    duration: '2-3 hours'
  });
  const [newTest, setNewTest] = useState('');

  const handleOpenDialog = (pkg?: HealthPackage) => {
    if (pkg) {
      setEditingPackage(pkg.id);
      setFormData(pkg);
    } else {
      setEditingPackage(null);
      setFormData({
        id: Math.max(0, ...packages.map(p => p.id)) + 1,
        name: '',
        description: '',
        price: 0,
        image: '',
        tests: [],
        category: 'basic',
        ageGroup: '18+ years',
        gender: 'all',
        duration: '2-3 hours'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPackage(null);
    setFormData({
      id: 0,
      name: '',
      description: '',
      price: 0,
      image: '',
      tests: [],
      category: 'basic',
      ageGroup: '18+ years',
      gender: 'all',
      duration: '2-3 hours'
    });
    setNewTest('');
  };

  const handleSave = () => {
    if (!formData.name || !formData.description || formData.price <= 0 || !formData.image) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error',
      });
      return;
    }

    try {
      if (editingPackage) {
        updatePackage(editingPackage, formData);
        setSnackbar({
          open: true,
          message: 'Package updated successfully',
          severity: 'success',
        });
      } else {
        addPackage(formData);
        setSnackbar({
          open: true,
          message: 'Package added successfully',
          severity: 'success',
        });
      }
      handleCloseDialog();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error saving package',
        severity: 'error',
      });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        deletePackage(id);
        setSnackbar({
          open: true,
          message: 'Package deleted successfully',
          severity: 'success',
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Error deleting package',
          severity: 'error',
        });
      }
    }
  };

  const handleSaveChanges = async () => {
    try {
      await saveChanges();
      setSnackbar({
        open: true,
        message: 'All changes saved successfully',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error saving changes',
        severity: 'error',
      });
    }
  };

  const handleAddTest = () => {
    if (newTest.trim()) {
      setFormData({
        ...formData,
        tests: [...formData.tests, newTest.trim()],
      });
      setNewTest('');
    }
  };

  const handleRemoveTest = (index: number) => {
    setFormData({
      ...formData,
      tests: formData.tests.filter((_: string, i: number) => i !== index),
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real application, you would upload this file to a server
      // For now, we'll just create a local URL
      const imageUrl = URL.createObjectURL(file);
      setFormData({
        ...formData,
        image: imageUrl,
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Health Packages Management</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveChanges}
            color="secondary"
          >
            Save Changes
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Package
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {packages.map((pkg: HealthPackage) => (
          <Grid item xs={12} sm={6} md={4} key={pkg.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={pkg.image}
                alt={pkg.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {pkg.name}
                  </Typography>
                  <Box>
                    <IconButton 
                      size="small" 
                      onClick={() => handleOpenDialog(pkg)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleDelete(pkg.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {pkg.description}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                  ₹{pkg.price}
                </Typography>
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Included Tests:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {pkg.tests.map((test: string, index: number) => (
                      <Chip
                        key={index}
                        label={test}
                        size="small"
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingPackage ? 'Edit Health Package' : 'Add New Health Package'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Package Name"
              fullWidth
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              required
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <TextField
              label="Price"
              type="number"
              fullWidth
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />
            <Box>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="package-image"
                type="file"
                onChange={handleImageUpload}
              />
              <label htmlFor="package-image">
                <Button variant="outlined" component="span">
                  Upload Package Image
                </Button>
              </label>
              {formData.image && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={formData.image}
                    alt="Preview"
                    style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                  />
                </Box>
              )}
            </Box>
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Included Tests
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  label="Add Test"
                  size="small"
                  value={newTest}
                  onChange={(e) => setNewTest(e.target.value)}
                  fullWidth
                />
                <Button variant="outlined" onClick={handleAddTest}>
                  Add
                </Button>
              </Box>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {formData.tests.map((test: string, index: number) => (
                  <Chip
                    key={index}
                    label={test}
                    onDelete={() => handleRemoveTest(index)}
                    sx={{ mb: 1 }}
                  />
                ))}
              </Stack>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {editingPackage ? 'Update' : 'Add'} Package
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HealthPackageManager;
