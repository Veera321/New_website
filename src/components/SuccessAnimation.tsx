import React from 'react';
import { Box, Typography } from '@mui/material';
import { keyframes } from '@mui/system';
import { Check } from '@mui/icons-material';

const blastAnimation = keyframes`
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.9;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const checkmarkAnimation = keyframes`
  0% {
    transform: scale(0) rotate(-45deg);
    opacity: 0;
  }
  70% {
    transform: scale(1.2) rotate(-45deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(-45deg);
    opacity: 1;
  }
`;

const circleAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.3;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
`;

interface SuccessAnimationProps {
  message: string;
}

const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ message }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: 80,
          height: 80,
          mb: 2,
        }}
      >
        {/* Success checkmark circle */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            backgroundColor: 'primary.main',
            animation: `${blastAnimation} 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Checkmark */}
          <Box
            component="span"
            sx={{
              position: 'relative',
              width: '32px',
              height: '20px',
              borderBottom: '3px solid white',
              borderLeft: '3px solid white',
              transform: 'rotate(-45deg)',
              transformOrigin: 'center',
              animation: `${checkmarkAnimation} 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.2s forwards`,
              opacity: 0,
            }}
          />
        </Box>
        {/* Expanding circles */}
        {[...Array(3)].map((_, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '2px solid',
              borderColor: 'primary.main',
              animation: `${circleAnimation} 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite`,
              animationDelay: `${index * 0.3}s`,
            }}
          />
        ))}
      </Box>
      <Typography
        variant="h6"
        sx={{
          textAlign: 'center',
          animation: `${blastAnimation} 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.3s forwards`,
          opacity: 0,
          fontSize: '1rem',
          fontWeight: 500,
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default SuccessAnimation;
