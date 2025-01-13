import React from 'react';
import { Box, Paper, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import PopularTests from '../components/PopularTests';
import HealthRiskSection from '../components/HealthRiskSection';
import HealthPackages from '../components/HealthPackages';
import { useBanner } from '../context/BannerContext';

interface BannerData {
  id: string;
  imageUrl: string;
  title: string;
  description?: string;
  link?: string;
  order: number;
}

const BannerContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '95%',
  maxWidth: '1400px',
  margin: '0 auto',
  marginBottom: theme.spacing(4),
  '& .slick-dots': {
    bottom: '20px',
    '& li button:before': {
      color: 'white',
    },
    '& li.slick-active button:before': {
      color: 'white',
    },
  },
}));

const BannerSlide = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '400px',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    height: '300px',
  },
  [theme.breakpoints.down('sm')]: {
    height: '250px',
  },
}));

const BannerContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  color: 'white',
  textAlign: 'center',
  padding: theme.spacing(4),
}));

// Default static banners
const defaultBanners: BannerData[] = [
  {
    id: 'default1',
    imageUrl: '/images/banner1.jpg',
    title: 'Advanced Healthcare Solutions',
    order: 0,
  },
  {
    id: 'default2',
    imageUrl: '/images/banner2.jpg',
    title: 'Expert Medical Professionals',
    order: 1,
  },
  {
    id: 'default3',
    imageUrl: '/images/banner3.jpg',
    title: 'State-of-the-art Facilities',
    order: 2,
  },
];

const Home: React.FC = () => {
  const { banners } = useBanner();
  const sortedBanners = [...banners].sort((a, b) => a.order - b.order);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    fade: false,
    rtl: false,
    cssEase: 'linear',
    slidesPerRow: 1,
  };

  // Combine managed banners with default banners
  const allBanners: BannerData[] = [...defaultBanners];
  if (sortedBanners.length > 0) {
    sortedBanners.forEach((banner, index) => {
      if (index < 3) {
        allBanners[index] = banner as BannerData;
      }
    });
  }

  return (
    <Box>
      <BannerContainer>
        <Slider {...settings}>
          {allBanners.map((slide) => (
            <div key={slide.id}>
              {slide.link ? (
                <Link
                  href={slide.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="none"
                >
                  <BannerSlide
                    sx={{
                      backgroundImage: `url(${slide.imageUrl})`,
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                      },
                    }}
                  >
                    <BannerContent>
                      <h1>{slide.title}</h1>
                      {slide.description && <p>{slide.description}</p>}
                    </BannerContent>
                  </BannerSlide>
                </Link>
              ) : (
                <BannerSlide
                  sx={{
                    backgroundImage: `url(${slide.imageUrl})`,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    },
                  }}
                >
                  <BannerContent>
                    <h1>{slide.title}</h1>
                    {slide.description && <p>{slide.description}</p>}
                  </BannerContent>
                </BannerSlide>
              )}
            </div>
          ))}
        </Slider>
      </BannerContainer>
      <HealthPackages />
      <PopularTests />
      <HealthRiskSection />
    </Box>
  );
};

export default Home;