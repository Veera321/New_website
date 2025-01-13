import { styled } from '@mui/material/styles';
import { Box, Button } from '@mui/material';

// Common styled components used across multiple files
export const ContentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3),
  },
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  padding: theme.spacing(1, 3),
}));

// Common styles that can be spread into sx prop
export const flexCenter = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const flexBetween = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

export const paperProps = {
  elevation: 3,
  sx: {
    borderRadius: 2,
    overflow: 'hidden',
  },
};
