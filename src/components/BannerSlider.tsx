import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  IconButton,
  Container,
  Typography,
  Button,
} from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Define interfaces for props and slide data
interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
}

// Define styled components with proper TypeScript types
const SliderWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: '#f8f9fa',
  padding: theme.spacing(3, 0),
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2, 0),
  },
}));

const SliderContainer = styled(Container)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '500px',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  [theme.breakpoints.down('md')]: {
    height: '400px',
    borderRadius: '12px',
  },
  [theme.breakpoints.down('sm')]: {
    height: '300px',
    borderRadius: '8px',
  },
}));

const SlidesTrack = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '100%',
  position: 'relative',
  transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  willChange: 'transform',
}));

const Slide = styled(Box)(({ theme }) => ({
  position: 'relative',
  minWidth: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper,
}));

const SlideContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  padding: theme.spacing(6),
  maxWidth: '600px',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(4),
    maxWidth: '500px',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
    maxWidth: '100%',
  },
}));

const SlideImage = styled('img')({
  position: 'absolute',
  top: 0,
  right: 0,
  width: '60%',
  height: '100%',
  objectFit: 'cover',
  '@media (max-width: 900px)': {
    width: '100%',
    opacity: 0.2,
  },
});

const SlideOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 40%, rgba(255,255,255,0) 100%)',
  [theme.breakpoints.down('md')]: {
    background: 'rgba(255,255,255,0.9)',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5, 4),
  borderRadius: '50px',
  fontSize: '1rem',
  textTransform: 'none',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  '&:hover': {
    boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1, 3),
    fontSize: '0.9rem',
  },
}));

const NavigationButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  color: theme.palette.primary.main,
  zIndex: 2,
  width: '40px',
  height: '40px',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  '&.Mui-disabled': {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    color: 'rgba(0, 0, 0, 0.26)',
  },
  [theme.breakpoints.down('sm')]: {
    width: '32px',
    height: '32px',
  },
}));

const slides: SlideData[] = [
  {
    id: 1,
    title: 'Comprehensive Health Checkup Packages',
    subtitle: 'Early Detection for Better Protection',
    description: 'Get a complete health assessment with our comprehensive checkup packages. Includes advanced diagnostics and expert consultation.',
    image: '/images/health-checkup.jpg',
    buttonText: 'Book Now',
    buttonLink: '/book-checkup',
  },
  {
    id: 2,
    title: 'Advanced Lab Testing Services',
    subtitle: 'Accurate Results, Fast Turnaround',
    description: 'State-of-the-art laboratory testing with NABL accreditation. Get your results within 24 hours.',
    image: '/images/lab-testing.jpg',
    buttonText: 'View Tests',
    buttonLink: '/lab-tests',
  },
  {
    id: 3,
    title: 'Home Collection Service',
    subtitle: 'Healthcare at Your Doorstep',
    description: 'Skip the queue with our convenient home collection service. Available 7 days a week.',
    image: '/images/home-collection.jpg',
    buttonText: 'Schedule Collection',
    buttonLink: '/home-collection',
  },
];

const BannerSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const moveToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const handlePrevSlide = useCallback(() => {
    const newIndex = (currentSlide - 1 + slides.length) % slides.length;
    moveToSlide(newIndex);
  }, [currentSlide, moveToSlide]);

  const handleNextSlide = useCallback(() => {
    const newIndex = (currentSlide + 1) % slides.length;
    moveToSlide(newIndex);
  }, [currentSlide, moveToSlide]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isTransitioning) {
        handleNextSlide();
      }
    }, 6000);

    return () => clearInterval(timer);
  }, [handleNextSlide, isTransitioning]);

  return (
    <SliderWrapper>
      <SliderContainer maxWidth="xl">
        <SlidesTrack
          sx={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {slides.map((slide) => (
            <Slide key={slide.id}>
              <SlideOverlay />
              <SlideImage 
                src={slide.image} 
                alt={slide.title}
                loading="eager"
              />
              <SlideContent>
                <Typography 
                  variant="h6" 
                  color="primary"
                  gutterBottom
                  sx={{ 
                    fontWeight: 600,
                    letterSpacing: 0.5,
                  }}
                >
                  {slide.subtitle}
                </Typography>
                <Typography 
                  variant="h3"
                  gutterBottom
                  sx={{ 
                    fontWeight: 700,
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                    lineHeight: 1.2,
                  }}
                >
                  {slide.title}
                </Typography>
                <Typography 
                  variant="body1"
                  color="text.secondary"
                  sx={{ 
                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                    maxWidth: '90%',
                  }}
                >
                  {slide.description}
                </Typography>
                <ActionButton 
                  variant="contained" 
                  color="primary"
                  href={slide.buttonLink}
                >
                  {slide.buttonText}
                </ActionButton>
              </SlideContent>
            </Slide>
          ))}
        </SlidesTrack>

        <NavigationButton
          onClick={handlePrevSlide}
          disabled={isTransitioning}
          sx={{ left: { xs: 8, md: 16 } }}
        >
          <KeyboardArrowLeft />
        </NavigationButton>
        <NavigationButton
          onClick={handleNextSlide}
          disabled={isTransitioning}
          sx={{ right: { xs: 8, md: 16 } }}
        >
          <KeyboardArrowRight />
        </NavigationButton>
      </SliderContainer>
    </SliderWrapper>
  );
};

export default BannerSlider;
