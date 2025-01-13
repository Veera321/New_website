import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  Grid,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  KeyboardArrowUp as UpIcon,
  KeyboardArrowDown as DownIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { useImages, BannerSection } from '../../context/ImageContext';
import { useNotification } from '../../context/NotificationContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`image-tabpanel-${index}`}
    aria-labelledby={`image-tab-${index}`}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

interface ImageUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    file: File;
    title: string;
    description?: string;
    section?: BannerSection;
    packageId?: string;
    packageName?: string;
  }) => void;
  type: 'banner' | 'package';
  packages?: Array<{ id: string; name: string }>;
}

const ImageUploadDialog: React.FC<ImageUploadDialogProps> = ({
  open,
  onClose,
  onSave,
  type,
  packages,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageTitle, setImageTitle] = useState('');
  const [description, setDescription] = useState('');
  const [section, setSection] = useState<BannerSection>(BannerSection.TOP);
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (selectedFile) {
      if (type === 'banner') {
        onSave({
          file: selectedFile,
          title: imageTitle,
          description,
          section,
        });
      } else {
        const pkg = packages?.find(p => p.id === selectedPackage);
        if (pkg) {
          onSave({
            file: selectedFile,
            title: imageTitle,
            packageId: pkg.id,
            packageName: pkg.name,
          });
        }
      }
      setSelectedFile(null);
      setImageTitle('');
      setDescription('');
      setSection(BannerSection.TOP);
      setSelectedPackage('');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {type === 'banner' ? 'Upload Banner Image' : 'Upload Package Image'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
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
            startIcon={<ImageIcon />}
          >
            {selectedFile ? selectedFile.name : 'Select Image'}
          </Button>
          {type === 'banner' ? (
            <>
              <TextField
                fullWidth
                label="Title"
                value={imageTitle}
                onChange={(e) => setImageTitle(e.target.value)}
              />
              <TextField
                fullWidth
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={3}
              />
              <FormControl fullWidth>
                <InputLabel>Banner Section</InputLabel>
                <Select
                  value={section}
                  label="Banner Section"
                  onChange={(e) => setSection(e.target.value as BannerSection)}
                >
                  {Object.values(BannerSection).map((s) => (
                    <MenuItem key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)} Section
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          ) : (
            <>
              <TextField
                fullWidth
                label="Image Title"
                value={imageTitle}
                onChange={(e) => setImageTitle(e.target.value)}
              />
              <FormControl fullWidth>
                <InputLabel>Select Package</InputLabel>
                <Select
                  value={selectedPackage}
                  label="Select Package"
                  onChange={(e) => setSelectedPackage(e.target.value)}
                >
                  {packages?.map((pkg) => (
                    <MenuItem key={pkg.id} value={pkg.id}>
                      {pkg.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={
            !selectedFile ||
            !imageTitle ||
            (type === 'package' && !selectedPackage)
          }
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const BannerSectionImages: React.FC<{
  section: BannerSection;
  images: Array<any>;
  onMove: (index: number, direction: 'up' | 'down') => void;
  onDelete: (id: string) => void;
}> = ({ section, images, onMove, onDelete }) => (
  <Box sx={{ mb: 4 }}>
    <Typography variant="h6" sx={{ mb: 2 }}>
      {section.charAt(0).toUpperCase() + section.slice(1)} Section
    </Typography>
    <Grid container spacing={2}>
      {images.map((image, index) => (
        <Grid item xs={12} sm={6} md={4} key={image.id}>
          <Card>
            <CardMedia
              component="img"
              height="200"
              image={image.url}
              alt={image.title}
            />
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ mr: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => onMove(index, 'up')}
                    disabled={index === 0}
                  >
                    <UpIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onMove(index, 'down')}
                    disabled={index === images.length - 1}
                  >
                    <DownIcon />
                  </IconButton>
                </Box>
                <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                  {image.title}
                </Typography>
                <IconButton onClick={() => onDelete(image.id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
              {image.description && (
                <Typography variant="body2" color="text.secondary">
                  {image.description}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

const ImageManager: React.FC = () => {
  const {
    bannerImages,
    packageImages,
    addBannerImage,
    updateBannerImage,
    removeBannerImage,
    reorderBannerImages,
    getBannerImagesBySection,
    addPackageImage,
    removePackageImage,
    getPackageImages,
  } = useImages();
  const { showNotification } = useNotification();
  const [tabValue, setTabValue] = useState(0);
  const [uploadDialog, setUploadDialog] = useState<{
    open: boolean;
    type: 'banner' | 'package';
  }>({ open: false, type: 'banner' });

  // Mock packages data - replace with actual data from your packages context
  const packages = [
    { id: '1', name: 'Basic Health Package' },
    { id: '2', name: 'Advanced Health Package' },
    { id: '3', name: 'Comprehensive Health Package' },
  ];

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMoveBanner = (section: BannerSection, index: number, direction: 'up' | 'down') => {
    const sectionImages = getBannerImagesBySection(section);
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sectionImages.length) return;

    const newImages = [...sectionImages];
    const [movedItem] = newImages.splice(index, 1);
    newImages.splice(newIndex, 0, movedItem);

    // Update order numbers
    const updatedImages = newImages.map((img, idx) => ({
      ...img,
      order: idx,
    }));

    reorderBannerImages(section, updatedImages);
    showNotification('Banner image reordered successfully', 'success');
  };

  const handleImageUpload = async (data: {
    file: File;
    title: string;
    description?: string;
    section?: BannerSection;
    packageId?: string;
    packageName?: string;
  }) => {
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const url = reader.result as string;
        if (uploadDialog.type === 'banner' && data.section) {
          const sectionImages = getBannerImagesBySection(data.section);
          addBannerImage({
            url,
            title: data.title,
            description: data.description,
            section: data.section,
            order: sectionImages.length,
          });
        } else if (data.packageId && data.packageName) {
          addPackageImage({
            url,
            packageId: data.packageId,
            packageName: data.packageName,
            alt: data.title,
          });
        }
        setUploadDialog({ open: false, type: 'banner' });
        showNotification('Image uploaded successfully', 'success');
      };
      reader.readAsDataURL(data.file);
    } catch (error) {
      showNotification('Failed to upload image', 'error');
    }
  };

  const groupedPackageImages = Object.values(
    packageImages.reduce((acc: { [key: string]: any }, img) => {
      if (!acc[img.packageId]) {
        acc[img.packageId] = {
          packageId: img.packageId,
          packageName: img.packageName,
          images: [],
        };
      }
      acc[img.packageId].images.push(img);
      return acc;
    }, {})
  );

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Image Manager
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Banner Images" />
          <Tab label="Package Images" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setUploadDialog({ open: true, type: 'banner' })}
          >
            Add Banner Image
          </Button>
        </Box>

        {Object.values(BannerSection).map((section) => (
          <BannerSectionImages
            key={section}
            section={section}
            images={getBannerImagesBySection(section)}
            onMove={(index, direction) =>
              handleMoveBanner(section, index, direction)
            }
            onDelete={removeBannerImage}
          />
        ))}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setUploadDialog({ open: true, type: 'package' })}
          >
            Add Package Image
          </Button>
        </Box>

        {groupedPackageImages.map((group: any) => (
          <Box key={group.packageId} sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {group.packageName}
            </Typography>
            <Grid container spacing={2}>
              {group.images.map((image: any) => (
                <Grid item xs={12} sm={6} md={4} key={image.id}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="200"
                      image={image.url}
                      alt={image.alt}
                    />
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                          {image.alt}
                        </Typography>
                        <IconButton
                          onClick={() => removePackageImage(image.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </TabPanel>

      <ImageUploadDialog
        open={uploadDialog.open}
        onClose={() => setUploadDialog({ open: false, type: 'banner' })}
        onSave={handleImageUpload}
        type={uploadDialog.type}
        packages={packages}
      />
    </Box>
  );
};

export default ImageManager;
