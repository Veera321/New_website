import React, { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Paper,
  useTheme,
  styled,
  MobileStepper,
} from '@mui/material';
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from '@mui/icons-material';
import { useBanner } from '../context/BannerContext';

const Banner: React.FC = () => {
  const theme = useTheme();
  const { banners } = useBanner();
  const [activeStep, setActiveStep] = useState(0);
  const sortedBanners = [...banners].sort((a, b) => a.order - b.order);
  const maxSteps = sortedBanners.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prevStep) => (prevStep + 1) % maxSteps);
    }, 5000);

    return () => clearInterval(timer);
  }, [maxSteps]);

  const handleNext = () => {
    setActiveStep((prevStep) => (prevStep + 1) % maxSteps);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => (prevStep - 1 + maxSteps) % maxSteps);
  };

  if (banners.length === 0) {
    return null;
  }

  const currentBanner = sortedBanners[activeStep];

  return (
    <Paper 
      elevation={0} 
      square 
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: '200px', sm: '300px', md: '400px' },
        overflow: 'hidden',
      }}
    >
      <Box
        component={currentBanner.link ? 'a' : 'div'}
        href={currentBanner.link}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          display: 'block',
          width: '100%',
          height: '100%',
          position: 'relative',
          textDecoration: 'none',
        }}
      >
        <Box
          component="img"
          src={currentBanner.imageUrl}
          alt={currentBanner.title}
          sx={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      </Box>

      {/* Navigation Arrows */}
      <IconButton
        size="large"
        onClick={handleBack}
        disabled={maxSteps <= 1}
        sx={{
          position: 'absolute',
          left: theme.spacing(2),
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'white',
          bgcolor: 'rgba(0, 0, 0, 0.3)',
          '&:hover': {
            bgcolor: 'rgba(0, 0, 0, 0.5)',
          },
          zIndex: 2,
        }}
      >
        <KeyboardArrowLeft />
      </IconButton>

      <IconButton
        size="large"
        onClick={handleNext}
        disabled={maxSteps <= 1}
        sx={{
          position: 'absolute',
          right: theme.spacing(2),
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'white',
          bgcolor: 'rgba(0, 0, 0, 0.3)',
          '&:hover': {
            bgcolor: 'rgba(0, 0, 0, 0.5)',
          },
          zIndex: 2,
        }}
      >
        <KeyboardArrowRight />
      </IconButton>

      {/* Dots Navigation */}
      <MobileStepper
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        sx={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          background: 'transparent',
          '& .MuiMobileStepper-dots': {
            width: '100%',
            justifyContent: 'center',
          },
          '& .MuiMobileStepper-dot': {
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          },
          '& .MuiMobileStepper-dotActive': {
            backgroundColor: 'white',
          },
        }}
        backButton={null}
        nextButton={null}
      />
    </Paper>
  );
};

export default Banner;
