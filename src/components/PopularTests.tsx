import React from 'react';
import { Box, Typography, Button, Card, CardContent, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { Science, NavigateNext, NavigateBefore, AddShoppingCart } from '@mui/icons-material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { useBloodTest } from '../context/BloodTestContext';

const TestCard = styled(Card)(({ theme }) => ({
  width: '280px',
  height: '180px',
  margin: '8px',
  transition: 'transform 0.2s',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const TestName = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 500,
  marginBottom: theme.spacing(1),
  color: '#3F1E43',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  lineHeight: '1.2',
  height: '2.4em',
}));

const Description = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  lineHeight: '1.2',
  height: '2.4em',
  marginBottom: theme.spacing(1),
}));

const SliderContainer = styled(Box)({
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
});

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

const SectionHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 40px 8px',
});

const TitleGroup = styled(Box)({
  display: 'flex',
  alignItems: 'center',
});

const PopularTests: React.FC = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { showNotification } = useNotification();
  const { tests } = useBloodTest();
  
  // Get only published tests and sort by price (assuming lower price = more popular)
  const popularTests = tests
    .filter(test => test.published)
    .sort((a, b) => a.price - b.price)
    .slice(0, 8); // Show top 8 tests

  const sliderRef = React.useRef<Slider>(null);

  const settings = {
    dots: false,
    infinite: popularTests.length > 4,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    rows: 2,
    slidesPerRow: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          rows: 2,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          rows: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          rows: 2,
        },
      },
    ],
  };

  const handleAddToCart = (test: any, event: React.MouseEvent) => {
    event.stopPropagation();
    addItem({
      id: test.id,
      name: test.name,
      price: test.price,
      type: 'test',
    });
    showNotification('Test added to cart', 'success');
  };

  const handleTestClick = (testId: number) => {
    navigate(`/blood-test/${testId}`);
  };

  return (
    <Box sx={{ py: 4 }}>
      <SectionHeader>
        <TitleGroup>
          <Science sx={{ mr: 1, color: '#3F1E43' }} />
          <Typography variant="h6" sx={{ color: '#3F1E43', fontWeight: 500 }}>
            Top Popular Tests
          </Typography>
        </TitleGroup>
        <ButtonGroup>
          <NavigationButton onClick={() => sliderRef.current?.slickPrev()}>
            <NavigateBefore />
          </NavigationButton>
          <NavigationButton onClick={() => sliderRef.current?.slickNext()}>
            <NavigateNext />
          </NavigationButton>
        </ButtonGroup>
      </SectionHeader>

      <SliderContainer>
        <Slider ref={sliderRef} {...settings}>
          {popularTests.map((test) => (
            <TestCard key={test.id} onClick={() => handleTestClick(test.id)}>
              <CardContent>
                <TestName>{test.name}</TestName>
                <Description>{test.description}</Description>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#3F1E43', fontWeight: 600 }}>
                    ₹{test.price}
                  </Typography>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<AddShoppingCart />}
                    onClick={(e) => handleAddToCart(test, e)}
                    sx={{
                      backgroundColor: '#3F1E43',
                      '&:hover': {
                        backgroundColor: '#2f1632',
                      },
                    }}
                  >
                    Add
                  </Button>
                </Box>
              </CardContent>
            </TestCard>
          ))}
        </Slider>
      </SliderContainer>
    </Box>
  );
};

export default PopularTests;
