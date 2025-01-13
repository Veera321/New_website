import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Instagram,
  Twitter,
  Facebook,
  LinkedIn,
  OpenInNew,
} from '@mui/icons-material';
import { useSocialMedia } from '../../context/SocialMediaContext';
import { useNotification } from '../../context/NotificationContext';

const SocialMediaManager: React.FC = () => {
  const { links, updateLinks } = useSocialMedia();
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState(links);

  const handleInputChange = (platform: keyof typeof links) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [platform]: event.target.value,
    }));
  };

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Validate all URLs
    const invalidUrls = Object.entries(formData).filter(
      ([_, url]) => !validateUrl(url)
    );

    if (invalidUrls.length > 0) {
      showNotification('Please enter valid URLs for all social media links', 'error');
      return;
    }

    updateLinks(formData);
    showNotification('Social media links updated successfully', 'success');
  };

  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const socialMediaConfig = [
    {
      platform: 'instagram',
      label: 'Instagram',
      icon: <Instagram />,
      color: '#E1306C',
    },
    {
      platform: 'twitter',
      label: 'Twitter',
      icon: <Twitter />,
      color: '#1DA1F2',
    },
    {
      platform: 'facebook',
      label: 'Facebook',
      icon: <Facebook />,
      color: '#4267B2',
    },
    {
      platform: 'linkedin',
      label: 'LinkedIn',
      icon: <LinkedIn />,
      color: '#0077B5',
    },
  ];

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Manage Social Media Links
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {socialMediaConfig.map(({ platform, label, icon, color }) => (
              <Grid item xs={12} key={platform}>
                <TextField
                  fullWidth
                  label={label}
                  value={formData[platform as keyof typeof links]}
                  onChange={handleInputChange(platform as keyof typeof links)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ color }}>
                        {icon}
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => openLink(formData[platform as keyof typeof links])}
                          edge="end"
                          size="small"
                        >
                          <OpenInNew />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
            >
              Update Links
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default SocialMediaManager;
