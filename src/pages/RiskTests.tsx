import React from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Paper,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { AddShoppingCart } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { riskItems } from '../data/riskData';

interface Test {
  id: number;
  name: string;
  price: number;
  riskCategory: string;
}

// Sample test data for each risk category
const riskTests: Test[] = [
  // Heart Risk Tests
  { id: 1, name: "Complete Cardiac Profile", price: 2999, riskCategory: "Heart Risk" },
  { id: 2, name: "Lipid Profile", price: 599, riskCategory: "Heart Risk" },
  { id: 3, name: "ECG Test", price: 399, riskCategory: "Heart Risk" },
  
  // Diabetes Risk Tests
  { id: 4, name: "HbA1c Test", price: 499, riskCategory: "Diabetes Risk" },
  { id: 5, name: "Glucose Tolerance Test", price: 799, riskCategory: "Diabetes Risk" },
  { id: 6, name: "Diabetes Screening", price: 999, riskCategory: "Diabetes Risk" },
  
  // Cancer Risk Tests
  { id: 7, name: "Tumor Marker Panel", price: 3999, riskCategory: "Cancer Risk" },
  { id: 8, name: "Cancer Screening Package", price: 5999, riskCategory: "Cancer Risk" },
  
  // Kidney Risk Tests
  { id: 9, name: "Kidney Function Test", price: 899, riskCategory: "Kidney Risk" },
  { id: 10, name: "Creatinine Test", price: 299, riskCategory: "Kidney Risk" },
  
  // Thyroid Risk Tests
  { id: 11, name: "Thyroid Profile", price: 699, riskCategory: "Thyroid Risk" },
  { id: 12, name: "T3 T4 TSH Test", price: 899, riskCategory: "Thyroid Risk" },
  
  // Vitamins Risk Tests
  { id: 13, name: "Vitamin D Test", price: 999, riskCategory: "Vitamins Risk" },
  { id: 14, name: "Vitamin B12 Test", price: 799, riskCategory: "Vitamins Risk" },
  { id: 15, name: "Complete Vitamin Profile", price: 2499, riskCategory: "Vitamins Risk" },
];

const RiskTests: React.FC = () => {
  const { riskCategory } = useParams<{ riskCategory: string }>();
  const { addItem } = useCart();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const riskInfo = riskItems.find(item => item.title === riskCategory);
  const filteredTests = riskTests.filter(
    test => test.riskCategory === riskCategory
  );

  const handleAddToCart = (test: Test) => {
    addItem({
      id: test.id,
      name: test.name,
      price: test.price
    });
  };

  if (!riskInfo) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4">Risk category not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Paper 
        elevation={1} 
        sx={{ 
          p: { xs: 2, sm: 3 },
          mb: 4,
          backgroundColor: theme.palette.background.paper,
          borderRadius: theme.shape.borderRadius,
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 2,
          mb: 2
        }}>
          <Box sx={{ 
            color: theme.palette.primary.main,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {riskInfo.icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 1,
                textAlign: isMobile ? 'center' : 'left'
              }}
            >
              {riskInfo.title}
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ 
                textAlign: isMobile ? 'center' : 'left'
              }}
            >
              {riskInfo.description}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" sx={{ mb: 2 }}>
          Available Tests
        </Typography>
      </Paper>
      
      <Grid container spacing={3}>
        {filteredTests.map((test) => (
          <Grid item xs={12} sm={6} md={4} key={test.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) => theme.shadows[4],
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {test.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  ₹{test.price}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddShoppingCart />}
                  onClick={() => handleAddToCart(test)}
                  sx={{ mt: 2 }}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RiskTests;
