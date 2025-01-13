import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import { AddShoppingCart, CheckCircle } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { useHealthPackage } from '../context/HealthPackageContext';

const PackageDetails: React.FC = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const { packages } = useHealthPackage();
  const { addItem } = useCart();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const packageDetails = packages.find(pkg => pkg.id === Number(packageId));

  if (!packageDetails) {
    return (
      <Container>
        <Box sx={{ py: 4 }}>
          <Typography variant="h5">Package not found</Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Back to Home
          </Button>
        </Box>
      </Container>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: packageDetails.id,
      name: packageDetails.name,
      price: packageDetails.price,
      type: 'package',
    });
    showNotification('Package added to cart', 'success');
  };

  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="400"
                image={packageDetails.image}
                alt={packageDetails.name}
                sx={{ objectFit: 'cover' }}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <CardContent sx={{ p: 0 }}>
              <Typography variant="h4" gutterBottom>
                {packageDetails.name}
              </Typography>
              <Typography variant="h5" color="primary" gutterBottom>
                ₹{packageDetails.price}
              </Typography>
              <Typography variant="body1" paragraph>
                {packageDetails.description}
              </Typography>
              
              <Box sx={{ my: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Included Tests
                </Typography>
                <List>
                  {packageDetails.tests.map((test, index) => (
                    <ListItem key={index} sx={{ py: 1 }}>
                      <ListItemIcon>
                        <CheckCircle color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={test} />
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Button
                variant="contained"
                size="large"
                startIcon={<AddShoppingCart />}
                onClick={handleAddToCart}
                fullWidth
                sx={{ mt: 2 }}
              >
                Add to Cart
              </Button>
            </CardContent>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default PackageDetails;
