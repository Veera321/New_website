import React from 'react';
import {
  Favorite,
  BloodtypeOutlined,
  BiotechOutlined,
  WaterDrop,
  HealthAndSafety,
  Opacity
} from '@mui/icons-material';

export interface RiskInfo {
  title: string;
  icon: JSX.Element;
  description: string;
}

export const riskItems: RiskInfo[] = [
  { 
    title: 'Heart Risk',
    icon: <Favorite sx={{ fontSize: 48, transform: 'scale(1.1)' }} />,
    description: 'Comprehensive cardiac assessment to evaluate heart health and identify potential cardiovascular risks. Regular monitoring helps in early detection and prevention of heart-related conditions.'
  },
  { 
    title: 'Diabetes Risk',
    icon: <BloodtypeOutlined sx={{ fontSize: 48 }} />,
    description: 'Thorough evaluation of blood glucose levels and other diabetes indicators. Early detection and management of diabetes can prevent complications and promote better health outcomes.'
  },
  { 
    title: 'Cancer Risk',
    icon: <BiotechOutlined sx={{ fontSize: 48 }} />,
    description: 'Advanced screening tests for various types of cancer. Early detection through regular screening is crucial for successful treatment and better prognosis.'
  },
  { 
    title: 'Kidney Risk',
    icon: <WaterDrop sx={{ fontSize: 48 }} />,
    description: 'Comprehensive kidney function assessment to detect early signs of kidney disease. Regular monitoring helps maintain kidney health and prevent complications.'
  },
  { 
    title: 'Thyroid Risk',
    icon: <HealthAndSafety sx={{ fontSize: 48 }} />,
    description: 'Complete thyroid function evaluation to assess hormonal balance. Regular thyroid monitoring is essential for maintaining overall metabolic health.'
  },
  { 
    title: 'Vitamins Risk',
    icon: <Opacity sx={{ fontSize: 48 }} />,
    description: 'Detailed analysis of essential vitamin levels in your body. Maintaining optimal vitamin levels is crucial for overall health and well-being.'
  },
];
