import React from 'react';
import { Container, Typography, Box, Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const TermsAndConditions: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/" color="inherit">
          Home
        </Link>
        <Typography color="text.primary">Terms & Conditions</Typography>
      </Breadcrumbs>

      <Typography variant="h4" component="h1" gutterBottom>
        Terms and Conditions
      </Typography>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          1. Acceptance of Terms
        </Typography>
        <Typography paragraph>
          By accessing and using PS Healthcare's services, you agree to be bound by these Terms and Conditions.
          These terms govern your use of our website, mobile applications, and diagnostic services.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          2. Service Description
        </Typography>
        <Typography paragraph>
          PS Healthcare provides diagnostic testing services, health packages, and related healthcare services.
          We strive to maintain high standards of quality and accuracy in our diagnostic services.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          3. User Responsibilities
        </Typography>
        <Typography paragraph>
          Users are responsible for providing accurate information during registration and test bookings.
          Any misrepresentation of information may affect test results and healthcare decisions.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          4. Privacy and Data Protection
        </Typography>
        <Typography paragraph>
          We are committed to protecting your personal and medical information. Our privacy practices are
          detailed in our Privacy Policy, which is an integral part of these terms.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          5. Payment and Refunds
        </Typography>
        <Typography paragraph>
          All payments must be made at the time of booking. Refund policies apply as per our cancellation
          and refund guidelines.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          6. Limitation of Liability
        </Typography>
        <Typography paragraph>
          While we strive for accuracy, PS Healthcare shall not be liable for any indirect, incidental,
          or consequential damages arising from the use of our services.
        </Typography>

        <Typography sx={{ mt: 4 }} color="text.secondary">
          Last updated: December 26, 2024
        </Typography>
      </Box>
    </Container>
  );
};

export default TermsAndConditions;
