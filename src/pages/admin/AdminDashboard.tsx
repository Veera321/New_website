import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import {
  People,
  LocalHospital as LocalHospitalIcon,
  Article as ArticleIcon,
  LocalOffer as LocalOfferIcon,
  Science as ScienceIcon,
  ShoppingCart as ShoppingCartIcon,
  Image as ImageIcon,
  ViewHeadline as ViewHeadlineIcon,
  Share,
} from '@mui/icons-material';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      icon: <People sx={{ fontSize: 40 }} />,
      color: '#1976d2',
    },
    {
      title: 'Active Orders',
      value: '56',
      icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
    },
    {
      title: 'Total Revenue',
      value: '₹1.2M',
      icon: <LocalOfferIcon sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
    },
    {
      title: 'New Users',
      value: '+123',
      icon: <People sx={{ fontSize: 40 }} />,
      color: '#9c27b0',
    },
  ];

  const adminModules = [
    { 
      name: 'Doctors', 
      icon: <LocalHospitalIcon />, 
      path: '/admin/doctors',
      description: 'Manage doctor profiles and availability'
    },
    { 
      name: 'Blogs', 
      icon: <ArticleIcon />, 
      path: '/admin/blogs',
      description: 'Manage blog posts and content'
    },
    { 
      name: 'Health Packages', 
      icon: <LocalOfferIcon />, 
      path: '/admin/packages',
      description: 'Manage health packages and pricing'
    },
    { 
      name: 'Blood Tests', 
      icon: <ScienceIcon />, 
      path: '/admin/blood-tests',
      description: 'Manage blood test services'
    },
    { 
      name: 'Cart Requests', 
      icon: <ShoppingCartIcon />, 
      path: '/admin/cart-requests',
      description: 'View and manage cart requests'
    },
    { 
      name: 'Banner', 
      icon: <ImageIcon />, 
      path: '/admin/banner',
      description: 'Manage website banners'
    },
    { 
      name: 'Sub Headers', 
      icon: <ViewHeadlineIcon />, 
      path: '/admin/sub-headers',
      description: 'Manage website sub headers'
    },
    {
      name: 'Social Media Links',
      icon: <Share />,
      path: '/admin/social-media',
      description: 'Manage social media links'
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 140,
                background: `linear-gradient(45deg, ${stat.color} 30%, ${stat.color}99 90%)`,
                color: 'white',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {stat.icon}
                <Typography variant="h4">{stat.value}</Typography>
              </Box>
              <Typography variant="h6" sx={{ mt: 'auto' }}>
                {stat.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        {adminModules.map((module) => (
          <Grid item xs={12} sm={6} md={4} key={module.name}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                }
              }}
              onClick={() => navigate(module.path)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  {module.icon}
                  <Typography variant="h6">{module.name}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {module.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
