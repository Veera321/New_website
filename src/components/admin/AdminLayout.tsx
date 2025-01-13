import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  useTheme,
  Badge,
  Button,
  CssBaseline,
  CircularProgress,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ShoppingCart as ShoppingCartIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  ViewList,
  LocalHospital,
  Description,
  People,
  Refresh as RefreshIcon,
  Image as ImageIcon,
  Collections as CollectionsIcon,
  ExpandLess,
  ExpandMore,
  LocalShipping,
  ViewCarousel,
  Healing,
  HealthAndSafety,
  Science,
  Article as ArticleIcon,
  EventNote as AppointmentIcon,
  Add as AddIcon,
  List as ListIcon,
  Policy as PolicyIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useCartRequests } from '../../context/CartRequestContext';
import { useAppointment } from '../../context/AppointmentContext';
import { useHomeCollection } from '../../context/HomeCollectionContext';

const drawerWidth = 240;

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { adminLogout } = useAdminAuth();
  const { requests, refreshRequests, loading } = useCartRequests();
  const { getUnreadAppointmentsCount } = useAppointment();
  const { getUnreadRequestsCount } = useHomeCollection();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [doctorMenuOpen, setDoctorMenuOpen] = useState(false);
  const [subheaderOpen, setSubheaderOpen] = useState(false);
  const [enquiryMenuOpen, setEnquiryMenuOpen] = useState(false);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshRequests();
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshRequests]);

  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const unreadAppointments = getUnreadAppointmentsCount();
  const unreadHomeCollections = getUnreadRequestsCount();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDoctorMenuClick = () => {
    setDoctorMenuOpen(!doctorMenuOpen);
  };

  const handleSubheaderClick = () => {
    setSubheaderOpen(!subheaderOpen);
  };

  const handleEnquiryMenuClick = () => {
    setEnquiryMenuOpen(!enquiryMenuOpen);
  };

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Banners', icon: <ViewCarousel />, path: '/admin/banners' },
    { text: 'Blogs', icon: <ArticleIcon />, path: '/admin/blog' },
    { text: 'Blood Tests', icon: <Science />, path: '/admin/blood-test' },
    { text: 'Health Packages', icon: <Healing />, path: '/admin/health-packages' },
    { text: 'Privacy Policy', icon: <PolicyIcon />, path: '/admin/privacy-policy' },
  ];

  const enquiryItems = [
    { 
      text: 'Cart Requests', 
      icon: <ShoppingCartIcon />, 
      path: '/admin/cart-requests',
      badge: pendingRequests 
    },
    { 
      text: 'Appointments', 
      icon: <AppointmentIcon />, 
      path: '/admin/appointments',
      badge: unreadAppointments 
    },
    {
      text: 'Home Collection',
      icon: <LocalShipping />,
      path: '/admin/home-collection',
      badge: unreadHomeCollections
    },
  ];

  const subheaderItems = [
    { text: 'Health Risk', icon: <HealthAndSafety />, path: '/admin/health-risk' },
    { text: 'Speciality Tests', icon: <Science />, path: '/admin/speciality-tests' },
  ];

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Admin Panel
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}

        {/* Enquiry Dropdown */}
        <ListItem disablePadding>
          <ListItemButton onClick={handleEnquiryMenuClick}>
            <ListItemIcon>
              <Badge badgeContent={pendingRequests + unreadAppointments + unreadHomeCollections} color="error">
                <ViewList />
              </Badge>
            </ListItemIcon>
            <ListItemText primary="Enquiry" />
            {enquiryMenuOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={enquiryMenuOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {enquiryItems.map((item) => (
              <ListItemButton
                key={item.text}
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                sx={{ pl: 4 }}
              >
                <ListItemIcon>
                  <Badge badgeContent={item.badge} color="error">
                    {item.icon}
                  </Badge>
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>

        {/* Doctor Management Dropdown */}
        <ListItem disablePadding>
          <ListItemButton onClick={handleDoctorMenuClick}>
            <ListItemIcon>
              <Badge badgeContent={unreadAppointments} color="error">
                <LocalHospital />
              </Badge>
            </ListItemIcon>
            <ListItemText primary="Doctors" />
            {doctorMenuOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={doctorMenuOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              component={Link}
              to="/admin/doctors"
              selected={location.pathname === '/admin/doctors'}
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <ListIcon />
              </ListItemIcon>
              <ListItemText primary="Manage Doctors" />
            </ListItemButton>
          </List>
        </Collapse>

        <ListItem disablePadding>
          <ListItemButton onClick={handleSubheaderClick}>
            <ListItemIcon>
              <CollectionsIcon />
            </ListItemIcon>
            <ListItemText primary="Subheader" />
            {subheaderOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={subheaderOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {subheaderItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname === item.path}
                  component={Link}
                  to={item.path}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            PS Healthcare Admin
          </Typography>
          <IconButton
            color="inherit"
            component={Link}
            to="/admin/about"
            sx={{ mr: 2 }}
            title="About"
          >
            <InfoIcon />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={refreshRequests}
            sx={{ mr: 2 }}
            title="Refresh"
          >
            <RefreshIcon />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={handleLogout}
            title="Logout"
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
