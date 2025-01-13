import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { riskItems } from '../data/riskData';
import {
  MonitorHeart,
  BloodtypeOutlined,
  BiotechOutlined,
  WaterDrop,
  HealthAndSafety,
  Opacity
} from '@mui/icons-material';

const RiskTile = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'transform 0.2s, box-shadow 0.2s',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  color: theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(0.5),
}));

const HealthRiskSection: React.FC = () => {
  const navigate = useNavigate();

  const handleRiskClick = (riskTitle: string) => {
    navigate(`/risk-tests/${riskTitle}`);
  };

  return (
    <Box sx={{ pt: 4, pb: 2, px: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HealthAndSafety sx={{ color: 'primary.main' }} />
          <Typography 
            variant="h6" 
            sx={{ 
              fontSize: '1.1rem',
              fontWeight: 600,
            }}
          >
            Health Risk
          </Typography>
        </Box>
      </Box>
      <Grid container spacing={2}>
        {riskItems.map((item) => (
          <Grid item xs={6} sm={4} md={2} key={item.title}>
            <RiskTile 
              elevation={1} 
              onClick={() => handleRiskClick(item.title)}
            >
              <IconWrapper>
                {item.icon}
              </IconWrapper>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  color: 'text.primary',
                }}
              >
                {item.title}
              </Typography>
            </RiskTile>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HealthRiskSection;
