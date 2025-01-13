import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useSocialMedia } from '../context/SocialMediaContext';

const Footer: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { links } = useSocialMedia();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Book Home Collection', path: '/home-collection' },
    { name: 'Health Packages', path: '/packages' },
    { name: 'Upload Prescription', path: '/upload-prescription' },
  ];

  const healthPackages = [
    { name: 'Full Body Checkup', path: '/package/1' },
    { name: 'Diabetes Screening', path: '/package/2' },
    { name: 'Heart Health', path: '/package/3' },
    { name: 'Women Health', path: '/package/4' },
    { name: 'Men Health', path: '/package/5' },
  ];

  const contactInfo = [
    {
      icon: <PhoneIcon fontSize="small" />,
      text: '+91 1234567890',
      link: 'tel:+911234567890',
    },
    {
      icon: <EmailIcon fontSize="small" />,
      text: 'contact@pathseekers.com',
      link: 'mailto:contact@pathseekers.com',
    },
    {
      icon: <LocationIcon fontSize="small" />,
      text: '123, Healthcare Street, Medical District, City - 123456',
      link: 'https://maps.google.com',
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#4f2953',
        color: 'white',
        pt: 6,
        pb: 3,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Quick Links
            </Typography>
            {quickLinks.map((link) => (
              <Link
                key={link.name}
                component={RouterLink}
                to={link.path}
                sx={{
                  display: 'block',
                  color: 'white',
                  textDecoration: 'none',
                  mb: 1,
                  '&:hover': {
                    color: theme.palette.secondary.light,
                  },
                }}
              >
                {link.name}
              </Link>
            ))}
          </Grid>

          {/* Health Packages */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Health Packages
            </Typography>
            {healthPackages.map((package_) => (
              <Link
                key={package_.name}
                component={RouterLink}
                to={package_.path}
                sx={{
                  display: 'block',
                  color: 'white',
                  textDecoration: 'none',
                  mb: 1,
                  '&:hover': {
                    color: theme.palette.secondary.light,
                  },
                }}
              >
                {package_.name}
              </Link>
            ))}
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Contact Us
            </Typography>
            {contactInfo.map((info) => (
              <Box
                key={info.text}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                  gap: 1,
                }}
              >
                {info.icon}
                <Link
                  href={info.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'white',
                    textDecoration: 'none',
                    '&:hover': {
                      color: theme.palette.secondary.light,
                    },
                  }}
                >
                  {info.text}
                </Link>
              </Box>
            ))}
          </Grid>

          {/* Social Media and Newsletter */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Follow Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <IconButton
                component="a"
                href={links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'white' }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                component="a"
                href={links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'white' }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                component="a"
                href={links.facebook}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'white' }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                component="a"
                href={links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'white' }}
              >
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Copyright */}
        <Typography
          variant="body2"
          align="center"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            mt: 2,
          }}
        >
          {new Date().getFullYear()} PS Healthcare. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
