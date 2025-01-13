import React, { useState, useRef } from 'react';
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
  Badge,
  Slider,
  FormHelperText,
  Input,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  Publish as PublishIcon,
  Unpublished as UnpublishedIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import { useBlog, Blog } from '../../context/BlogContext';
import { useNotification } from '../../context/NotificationContext';
import { useImages } from '../../context/ImageContext';

interface BlogFormData {
  title: string;
  content: string;
  category: string;
  imageUrl: string;
  images: Array<{
    url: string;
    width: number;
    height: number;
  }>;
  imageWidth: number;
  imageHeight: number;
  author: string;
  summary: string;
  tags: string[];
}

const initialFormData: BlogFormData = {
  title: '',
  content: '',
  category: '',
  imageUrl: '',
  images: [],
  imageWidth: 800,
  imageHeight: 400,
  author: '',
  summary: '',
  tags: [],
};

const categories = ['Health Tips', 'Medical News', 'Wellness Articles', 'Diet & Nutrition'];

const BlogManager: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage } = useImages();
  const { blogs, addBlog, updateBlog, deleteBlog, publishBlog, unpublishBlog } = useBlog();
  const { showNotification } = useNotification();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<BlogFormData>(initialFormData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTag, setNewTag] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      const uploadPromises = Array.from(files).map(async (file) => {
        const uploadedUrl = await uploadImage(file);
        return {
          url: uploadedUrl,
          width: 800, // Default width
          height: 400, // Default height
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      
      // Set the first image as the main image
      if (uploadedImages.length > 0 && !formData.imageUrl) {
        setFormData(prev => ({
          ...prev,
          imageUrl: uploadedImages[0].url,
          images: [...prev.images, ...uploadedImages],
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...uploadedImages],
        }));
      }

      showNotification('Images uploaded successfully', 'success');
    } catch (error) {
      showNotification('Failed to upload images', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imageUrl: index === 0 && prev.images.length > 1 ? prev.images[1].url : prev.imageUrl,
    }));
  };

  const handleImageSizeChange = (type: 'width' | 'height') => (event: Event, newValue: number | number[]) => {
    setFormData(prev => ({
      ...prev,
      [type === 'width' ? 'imageWidth' : 'imageHeight']: newValue as number
    }));
  };

  const handleOpen = (blog?: Blog) => {
    if (blog) {
      setFormData({
        title: blog.title,
        content: blog.content,
        category: blog.category,
        imageUrl: blog.imageUrl,
        images: blog.images || [], // Ensure images array exists
        imageWidth: blog.imageWidth,
        imageHeight: blog.imageHeight,
        author: blog.author,
        summary: blog.summary,
        tags: blog.tags,
      });
      setEditingId(blog.id);
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
      updateBlog(editingId, {
        ...formData,
        images: formData.images || [],
      });
      showNotification('Blog updated successfully', 'success');
    } else {
      addBlog({
        ...formData,
        images: formData.images || [],
        publishDate: new Date().toISOString(),
        status: 'draft',
      });
      showNotification('Blog added successfully', 'success');
    }
    handleClose();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      deleteBlog(id);
      showNotification('Blog deleted successfully', 'success');
    }
  };

  const handlePublish = (id: string, currentStatus: 'draft' | 'published') => {
    if (currentStatus === 'draft') {
      publishBlog(id);
      showNotification('Blog published successfully', 'success');
    } else {
      unpublishBlog(id);
      showNotification('Blog unpublished successfully', 'info');
    }
  };

  const handleAddTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag],
      });
      setNewTag('');
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToDelete),
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ color: 'primary.main' }}>
          Blog Manager
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
          Add New Blog
        </Button>
      </Box>

      <Grid container spacing={3}>
        {blogs.map((blog) => (
          <Grid item xs={12} md={6} lg={4} key={blog.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                }
              }}
            >
              <Badge
                badgeContent={blog.status === 'draft' ? 'Draft' : 'Published'}
                color={blog.status === 'draft' ? 'warning' : 'success'}
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.8rem',
                    height: '24px',
                    minWidth: '60px',
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={blog.imageUrl || '/placeholder-image.jpg'}
                  alt={blog.title}
                />
              </Badge>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2">
                  {blog.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {blog.summary}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                  {blog.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      variant="outlined"
                      sx={{ borderColor: 'primary.main' }}
                    />
                  ))}
                </Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  By {blog.author}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  {new Date(blog.publishDate).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                <IconButton 
                  onClick={() => handlePublish(blog.id, blog.status)}
                  color={blog.status === 'published' ? 'success' : 'warning'}
                  title={blog.status === 'published' ? 'Unpublish' : 'Publish'}
                >
                  {blog.status === 'published' ? <UnpublishedIcon /> : <PublishIcon />}
                </IconButton>
                <IconButton onClick={() => handleOpen(blog)} color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(blog.id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingId ? 'Edit Blog' : 'Add New Blog'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ my: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Title"
              fullWidth
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <TextField
              label="Summary"
              fullWidth
              multiline
              rows={2}
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            />
            <TextField
              label="Content"
              fullWidth
              multiline
              rows={6}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                label="Category"
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Image Upload Section */}
            <Box sx={{ border: '1px dashed grey', p: 2, borderRadius: 1 }}>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                ref={fileInputRef}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                {(imagePreview || formData.imageUrl) && (
                  <Box sx={{ width: '100%', maxWidth: 400, mb: 2 }}>
                    <img
                      src={imagePreview || formData.imageUrl}
                      alt="Preview"
                      style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: 4,
                      }}
                    />
                  </Box>
                )}
                <Button
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload Images'}
                </Button>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, my: 2 }}>
                  {(formData.images || []).map((image, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: 'relative',
                        width: 200,
                        height: 150,
                      }}
                    >
                      <img
                        src={image.url}
                        alt={`Blog image ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '4px',
                        }}
                      />
                      <IconButton
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          },
                        }}
                        size="small"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                      {index === 0 && (
                        <Chip
                          label="Main Image"
                          size="small"
                          sx={{
                            position: 'absolute',
                            bottom: 4,
                            left: 4,
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          }}
                        />
                      )}
                    </Box>
                  ))}
                </Box>

                <Box sx={{ width: '100%', mt: 2 }}>
                  <Typography gutterBottom>Image Width (px)</Typography>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs>
                      <Slider
                        value={formData.imageWidth}
                        onChange={handleImageSizeChange('width')}
                        min={200}
                        max={1200}
                        step={50}
                      />
                    </Grid>
                    <Grid item>
                      <Input
                        value={formData.imageWidth}
                        size="small"
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (value >= 200 && value <= 1200) {
                            setFormData(prev => ({ ...prev, imageWidth: value }));
                          }
                        }}
                        inputProps={{
                          min: 200,
                          max: 1200,
                          type: 'number',
                        }}
                        endAdornment={<InputAdornment position="end">px</InputAdornment>}
                      />
                    </Grid>
                  </Grid>

                  <Typography gutterBottom sx={{ mt: 2 }}>Image Height (px)</Typography>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs>
                      <Slider
                        value={formData.imageHeight}
                        onChange={handleImageSizeChange('height')}
                        min={200}
                        max={800}
                        step={50}
                      />
                    </Grid>
                    <Grid item>
                      <Input
                        value={formData.imageHeight}
                        size="small"
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (value >= 200 && value <= 800) {
                            setFormData(prev => ({ ...prev, imageHeight: value }));
                          }
                        }}
                        inputProps={{
                          min: 200,
                          max: 800,
                          type: 'number',
                        }}
                        endAdornment={<InputAdornment position="end">px</InputAdornment>}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Box>

            <TextField
              label="Author"
              fullWidth
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            />
            
            {/* Tags Section */}
            <Box>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  label="Add Tag"
                  size="small"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                />
                <Button variant="outlined" onClick={handleAddTag}>
                  Add
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {formData.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleDeleteTag(tag)}
                    size="small"
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingId ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BlogManager;
