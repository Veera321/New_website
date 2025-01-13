import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  TextField,
  IconButton,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Add as AddIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useBanner } from '../../context/BannerContext';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const BannerManager: React.FC = () => {
  const { banners, addBanner, updateBanner, deleteBanner, reorderBanners, saveBanners, loading } = useBanner();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBanner, setEditingBanner] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBanner = () => {
    if ((selectedFile && previewUrl) || editingBanner) {
      const newBanner = {
        imageUrl: previewUrl,
        title,
        description,
        link,
        order: banners.length,
      };

      if (editingBanner) {
        updateBanner(editingBanner, newBanner);
      } else {
        addBanner(newBanner);
      }
      handleCloseDialog();
      setSnackbar({ 
        open: true, 
        message: editingBanner ? 'Banner updated successfully' : 'Banner added successfully', 
        severity: 'success' 
      });
    }
  };

  const handleOpenDialog = (banner?: typeof banners[0]) => {
    if (banner) {
      setEditingBanner(banner.id);
      setTitle(banner.title);
      setDescription(banner.description || '');
      setLink(banner.link || '');
      setPreviewUrl(banner.imageUrl);
    } else {
      setEditingBanner(null);
      setTitle('');
      setDescription('');
      setLink('');
      setPreviewUrl('');
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedFile(null);
    setPreviewUrl('');
    setTitle('');
    setDescription('');
    setLink('');
    setEditingBanner(null);
  };

  const handleSaveChanges = async () => {
    try {
      await saveBanners();
      setSnackbar({ open: true, message: 'Changes saved successfully', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error saving changes', severity: 'error' });
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    reorderBanners(result.draggableId, result.destination.index);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Banner Manager</Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveChanges}
            sx={{ mr: 2 }}
          >
            Save Changes
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            disabled={banners.length >= 3}
          >
            Add Banner
          </Button>
        </Box>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        You can add up to 3 banners. Drag and drop to reorder them.
      </Typography>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="banners">
          {(provided) => (
            <Box {...provided.droppableProps} ref={provided.innerRef}>
              <Grid container spacing={3}>
                {banners
                  .sort((a, b) => a.order - b.order)
                  .map((banner, index) => (
                    <Draggable key={banner.id} draggableId={banner.id} index={index}>
                      {(provided) => (
                        <Grid
                          item
                          xs={12}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Paper elevation={2}>
                            <Card>
                              <CardMedia
                                component="img"
                                height="200"
                                image={banner.imageUrl}
                                alt={banner.title}
                              />
                              <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Typography variant="h6">{banner.title}</Typography>
                                  <Box>
                                    <IconButton onClick={() => handleOpenDialog(banner)}>
                                      <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => deleteBanner(banner.id)}>
                                      <DeleteIcon />
                                    </IconButton>
                                  </Box>
                                </Box>
                                {banner.description && (
                                  <Typography variant="body2" color="text.secondary">
                                    {banner.description}
                                  </Typography>
                                )}
                                {banner.link && (
                                  <Typography variant="body2" color="primary">
                                    {banner.link}
                                  </Typography>
                                )}
                              </CardContent>
                            </Card>
                          </Paper>
                        </Grid>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </Grid>
            </Box>
          )}
        </Droppable>
      </DragDropContext>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingBanner ? 'Edit Banner' : 'Add New Banner'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
            <Button
              variant="outlined"
              onClick={() => fileInputRef.current?.click()}
              sx={{ mb: 2 }}
            >
              Choose Image
            </Button>
            {previewUrl && (
              <Box sx={{ mb: 2 }}>
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                />
              </Box>
            )}
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description (Optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Link (Optional)"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleAddBanner}
            variant="contained"
            disabled={!title || (!editingBanner && !selectedFile)}
          >
            {editingBanner ? 'Update' : 'Add'}
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

export default BannerManager;
