import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { Close as CloseIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import CheckoutForm from './checkout/CheckoutForm';
import GuestCheckoutForm from './checkout/GuestCheckoutForm';

interface CartDialogProps {
  open: boolean;
  onClose: () => void;
}

const CartDialog: React.FC<CartDialogProps> = ({ open, onClose }) => {
  const { items, removeItem, clearCart, totalAmount } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [guestCheckoutOpen, setGuestCheckoutOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleCheckout = () => {
    if (isAuthenticated) {
      setCheckoutOpen(true);
    } else {
      setGuestCheckoutOpen(true);
    }
  };

  const handleCheckoutSuccess = () => {
    setCheckoutOpen(false);
    setGuestCheckoutOpen(false);
    clearCart();
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Your Cart
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          {items.length === 0 ? (
            <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
              Your cart is empty
            </Typography>
          ) : (
            <>
              <List>
                {items.map(item => (
                  <React.Fragment key={item.id}>
                    <ListItem>
                      <ListItemText
                        primary={item.name}
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            ₹{item.price}
                          </Typography>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => removeItem(item.id)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>

              <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Order Summary
                </Typography>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography>Subtotal</Typography>
                  <Typography>₹{totalAmount}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="subtitle1">Total</Typography>
                  <Typography variant="subtitle1" color="primary.main">
                    ₹{totalAmount}
                  </Typography>
                </Box>
              </Box>
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">
            Continue Shopping
          </Button>
          <Button
            onClick={handleCheckout}
            variant="contained"
            disabled={items.length === 0}
          >
            Proceed to Checkout
          </Button>
        </DialogActions>
      </Dialog>

      {/* Authenticated user checkout form */}
      <CheckoutForm
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={handleCheckoutSuccess}
        title="Checkout Details"
        submitButtonText="Place Order"
        successMessage="Successfully submitted, and our executive will call you."
      />

      {/* Guest checkout form */}
      <GuestCheckoutForm
        open={guestCheckoutOpen}
        onClose={() => setGuestCheckoutOpen(false)}
        onSuccess={handleCheckoutSuccess}
      />
    </>
  );
};

export default CartDialog;
