import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Badge,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Avatar,
  Autocomplete,
  TextField,
  Paper,
} from '@mui/material';
import {
  Search,
  ShoppingCart,
  Phone,
  WhatsApp,
  LocationOn,
  Person,
  AccountCircle,
  ExitToApp,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';
import CartDialog from './CartDialog';
import LoginDialog from './auth/LoginDialog';

interface SearchItem {
  id: string;
  name: string;
  type: 'test' | 'package';
  price: number;
}

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  justifyContent: 'space-between',
  minHeight: '64px !important',
  '& .MuiTypography-root': {
    color: '#fff',
  },
  '& .MuiButton-root': {
    color: '#fff',
  },
  '& .MuiIconButton-root': {
    color: '#fff',
  },
  '& .MuiSvgIcon-root': {
    color: '#fff',
  },
}));

const SearchBox = styled(Autocomplete<SearchItem>)({
  width: '250px',
  '& .MuiInputBase-root': {
    height: '36px',
    padding: '0 8px',
    backgroundColor: 'white',
    borderRadius: '4px',
  },
  '& .MuiInputBase-input': {
    padding: '4px 8px',
    fontSize: '0.875rem',
    color: '#666',
    '&::placeholder': {
      color: '#999',
      opacity: 1,
      fontSize: '0.875rem',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    }
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .MuiAutocomplete-endAdornment': {
    display: 'none',
  },
  '& .MuiSvgIcon-root': {
    color: '#3F1E43',
  },
});

const StyledPaper = styled(Paper)({
  marginTop: '4px',
  '& .MuiAutocomplete-listbox': {
    padding: '4px 0',
    '& .MuiAutocomplete-option': {
      padding: '8px 16px',
      '&[aria-selected="true"]': {
        backgroundColor: 'rgba(63, 30, 67, 0.08)',
      },
      '&.Mui-focused': {
        backgroundColor: 'rgba(63, 30, 67, 0.12)',
      },
    },
  },
});

const Navbar: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [scrolled, setScrolled] = React.useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const { items, totalItems } = useCart();
  const { isAuthenticated, userProfile, logout } = useAuth();
  const { searchItems } = useSearch();

  const pages = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
  ];

  React.useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  const handleSearchSelect = (item: SearchItem | null) => {
    if (item) {
      const path = item.type === 'test' 
        ? `/test/${item.id}`
        : `/package/${item.id}`;
      navigate(path);
    }
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        backgroundColor: '#3F1E43',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transform: scrolled ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 0.3s ease-in-out',
      }}
    >
      <StyledToolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Typography 
            variant="h6" 
            component={RouterLink} 
            to="/"
            sx={{ 
              textDecoration: 'none',
              fontWeight: 600,
              letterSpacing: '0.5px',
              fontSize: '1.5rem',
              whiteSpace: 'nowrap',
              '&:hover': {
                opacity: 0.9
              }
            }}
          >
            PS Healthcare
          </Typography>

          <SearchBox
            options={searchItems}
            getOptionLabel={(option: SearchItem) => option.name}
            renderOption={(props, option: SearchItem) => (
              <Box component="li" {...props}>
                <Box>
                  <Typography variant="body1">{option.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.type.charAt(0).toUpperCase() + option.type.slice(1)} • ₹{option.price}
                  </Typography>
                </Box>
              </Box>
            )}
            PaperComponent={StyledPaper}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search for tests, health checkups"
                variant="outlined"
                size="small"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <Search sx={{ fontSize: '1.2rem', ml: 0.5 }} />
                  ),
                }}
              />
            )}
            onChange={(_, value) => handleSearchSelect(value)}
            noOptionsText="No tests or packages found"
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            alignItems: 'center', 
            gap: 3,
            mr: 2
          }}>
            {pages.map((page) => (
              <Button 
                key={page.name} 
                component={RouterLink} 
                to={page.path} 
                sx={{ 
                  color: '#fff', 
                  fontSize: '0.9rem', 
                  textTransform: 'capitalize', 
                  '&:hover': {
                    opacity: 0.9
                  }
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WhatsApp sx={{ fontSize: '1.2rem' }} />
            <Box>
              <Typography variant="caption" sx={{ display: 'block', lineHeight: 1 }}>Customer Care</Typography>
              <Typography sx={{ fontSize: '0.9rem' }}>9890428257</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Phone sx={{ fontSize: '1.2rem' }} />
            <Box>
              <Typography variant="caption" sx={{ display: 'block', lineHeight: 1 }}>Home Visit Booking</Typography>
              <Typography sx={{ fontSize: '0.9rem' }}>9890428257</Typography>
            </Box>
          </Box>

          {!isAuthenticated ? (
            <Button 
              color="inherit" 
              startIcon={<Person sx={{ fontSize: '1.2rem' }} />}
              onClick={() => setLoginOpen(true)}
              sx={{ fontSize: '0.9rem' }}
            >
              Login
            </Button>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                size="small"
                onClick={handleMenu}
                color="inherit"
                sx={{ p: 0.5 }}
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: theme.palette.secondary.main,
                    fontSize: '0.9rem',
                  }}
                >
                  {userProfile?.name.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{
                  '& .MuiPaper-root': {
                    marginTop: '8px',
                  },
                }}
                disableScrollLock={true}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {userProfile?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    +91 {userProfile?.mobile}
                  </Typography>
                </Box>
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My Orders</MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ExitToApp sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          )}
          <IconButton onClick={() => setCartOpen(true)} color="inherit">
            <Badge badgeContent={totalItems} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>
        </Box>
      </StyledToolbar>

      <CartDialog open={cartOpen} onClose={() => setCartOpen(false)} />
      <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
    </AppBar>
  );
};

export default Navbar;
