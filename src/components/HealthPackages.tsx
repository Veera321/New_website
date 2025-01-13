import React from 'react';
import { Box, Typography, Button, Card, CardContent, CardMedia, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { NavigateNext, NavigateBefore, AddShoppingCart, LocalHospital } from '@mui/icons-material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { useHealthPackage } from '../context/HealthPackageContext';

const PackageCard = styled(Card)(({ theme }) => ({
  width: '280px',
  height: '360px',
  margin: '8px',
  transition: 'transform 0.2s',
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid #f0f0f0',
  boxShadow: 'none',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[2],
  },
}));

const CardContentStyled = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#ffffff',
  borderTop: '1px solid #f0f0f0',
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

const DescriptionText = styled(Typography)(({ theme }) => ({
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  height: '40px',
  marginBottom: theme.spacing(1),
}));

const SliderContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: '0 40px',
  marginTop: '8px',
  '.slick-track': {
    display: 'flex',
    marginLeft: '0',
  },
  '.slick-list': {
    overflow: 'hidden',
  },
  '.slick-slide': {
    '& > div': {
      display: 'flex',
      justifyContent: 'center',
    },
  },
}));

const NavigationButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  margin: '0 4px',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  '&.Mui-disabled': {
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.grey[100],
  },
}));

const ButtonGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

const HealthPackages: React.FC = () => {
  const { packages } = useHealthPackage();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const sliderRef = React.useRef<Slider>(null);

  const handleNext = () => {
    sliderRef.current?.slickNext();
  };

  const handlePrevious = () => {
    sliderRef.current?.slickPrev();
  };

  const handleAddToCart = (pkg: any) => {
    addItem({
      id: pkg.id,
      name: pkg.name,
      price: pkg.price,
      type: 'package',
    });
    showNotification('Package added to cart', 'success');
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 2500,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  if (!packages || packages.length === 0) {
    return null;
  }

  return (
    <Box sx={{ pt: 4, pb: 2, px: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LocalHospital sx={{ mr: 1, color: '#3F1E43' }} />
          <Typography variant="h6" sx={{ color: '#3F1E43', fontWeight: 500 }}>
            Health Packages
          </Typography>
        </Box>
        <Box>
          <NavigationButton onClick={handlePrevious}>
            <NavigateBefore />
          </NavigationButton>
          <NavigationButton onClick={handleNext}>
            <NavigateNext />
          </NavigationButton>
        </Box>
      </Box>

      <SliderContainer>
        <Slider ref={sliderRef} {...settings}>
          {packages.map((pkg) => (
            <PackageCard key={pkg.id}>
              <CardMedia
                component="img"
                height="160"
                image={pkg.image}
                alt={pkg.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContentStyled>
                <ContentWrapper>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      marginBottom: '4px',
                      height: '28px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      '&:hover': {
                        color: 'primary.main',
                      },
                    }}
                    onClick={() => navigate(`/package/${pkg.id}`)}
                  >
                    {pkg.name}
                  </Typography>
                  <DescriptionText 
                    variant="body2" 
                    color="text.secondary"
                  >
                    {pkg.description}
                  </DescriptionText>
                  <Typography 
                    variant="h6" 
                    color="primary" 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: '1.2rem',
                      marginTop: 'auto',
                      marginBottom: 1
                    }}
                  >
                    ₹{pkg.price}
                  </Typography>
                </ContentWrapper>
                <Button
                  variant="contained"
                  startIcon={<AddShoppingCart />}
                  onClick={() => handleAddToCart(pkg)}
                  fullWidth
                  sx={{ 
                    textTransform: 'none',
                    fontWeight: 500,
                    marginTop: 'auto'
                  }}
                >
                  Add to Cart
                </Button>
              </CardContentStyled>
            </PackageCard>
          ))}
        </Slider>
      </SliderContainer>
    </Box>
  );
};

export default HealthPackages;
