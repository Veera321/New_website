import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AddShoppingCart, Check, AccessTime, Science } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { useBloodTest } from '../context/BloodTestContext';

const Section = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(1),
}));

const BloodTestDetails: React.FC = () => {
  const { testId } = useParams();
  const { addItem } = useCart();
  const { showNotification } = useNotification();
  const { tests } = useBloodTest();

  // Find the test data based on the testId (only published tests)
  const testData = tests.find(test => test.id === Number(testId) && test.published);

  // If test not found, show error state
  if (!testData) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" color="error" align="center">
          Test not found
        </Typography>
      </Container>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: testData.id,
      name: testData.name,
      price: testData.price,
    });
    showNotification('Test added to cart successfully');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Test Name and Price */}
      <Section elevation={1}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              {testData.name}
            </Typography>
            <Typography variant="h5" color="primary">
              ₹{testData.price}
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddShoppingCart />}
            onClick={handleAddToCart}
            sx={{ px: 4, py: 1.5 }}
          >
            Add to Cart
          </Button>
        </Box>
      </Section>

      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={6}>
          {/* Test Overview */}
          <Section elevation={1}>
            <Typography variant="h5" gutterBottom>
              Test Overview
            </Typography>
            <Typography variant="body1">
              {testData.description}
            </Typography>
          </Section>

          {/* Parameters Tested */}
          <Section elevation={1}>
            <Typography variant="h5" gutterBottom>
              Parameters Tested
            </Typography>
            <List>
              {testData.parameters.map((param, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Science color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={param} />
                </ListItem>
              ))}
            </List>
          </Section>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={6}>
          {/* Test Preparation */}
          <Section elevation={1}>
            <Typography variant="h5" gutterBottom>
              Test Preparation
            </Typography>
            <List>
              {testData.preparation.map((prep, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Check color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={prep} />
                </ListItem>
              ))}
            </List>
          </Section>

          {/* Turnaround Time */}
          <Section elevation={1}>
            <Typography variant="h5" gutterBottom>
              Turnaround Time
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
              <AccessTime color="primary" />
              <Typography variant="body1">
                {testData.turnaroundTime}
              </Typography>
            </Box>
          </Section>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BloodTestDetails;
