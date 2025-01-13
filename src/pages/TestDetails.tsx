import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Paper,
  Box,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';

interface FAQ {
  question: string;
  answer: string;
}

interface TestInfo {
  id: string;
  name: string;
  price: number;
  overview: string;
  details: string;
  faqs: FAQ[];
}

const testDatabase: { [key: string]: TestInfo } = {
  'complete-blood-count': {
    id: 'complete-blood-count',
    name: 'Complete Blood Count (CBC)',
    price: 500,
    overview: 'A complete blood count (CBC) is a blood test used to evaluate your overall health and detect a wide range of disorders, including anemia, infection and leukemia.',
    details: `A complete blood count test measures several components and features of your blood, including:
    • Red blood cells, which carry oxygen
    • White blood cells, which fight infection
    • Hemoglobin, the oxygen-carrying protein in red blood cells
    • Hematocrit, the proportion of red blood cells to the fluid component, or plasma, in your blood
    • Platelets, which help with blood clotting`,
    faqs: [
      {
        question: 'Do I need to fast before the CBC test?',
        answer: 'No, fasting is typically not required for a CBC test. However, your healthcare provider may give you specific instructions based on your individual circumstances.'
      },
      {
        question: 'How long does it take to get CBC results?',
        answer: 'Results are typically available within 24 hours.'
      }
    ]
  },
  'lipid-profile': {
    id: 'lipid-profile',
    name: 'Lipid Profile',
    price: 700,
    overview: 'A lipid profile or lipid panel is a blood test that measures the levels of different types of fats (lipids) in your blood, including cholesterol and triglycerides.',
    details: `The lipid profile test measures:
    • Total cholesterol
    • HDL (good) cholesterol
    • LDL (bad) cholesterol
    • Triglycerides
    • VLDL cholesterol
    
    This test helps assess your risk of developing cardiovascular disease and guides treatment decisions.`,
    faqs: [
      {
        question: 'Do I need to fast before the lipid profile?',
        answer: 'Yes, you typically need to fast for 9-12 hours before the test. This means no eating or drinking anything except water.'
      },
      {
        question: 'How often should I get a lipid profile?',
        answer: 'Adults should get a lipid profile every 4-6 years. However, more frequent testing may be recommended if you have risk factors for heart disease.'
      },
      {
        question: 'What can affect my test results?',
        answer: 'Recent meals, certain medications, pregnancy, and stress can affect your lipid profile results. Discuss any concerns with your healthcare provider.'
      }
    ]
  },
  'thyroid-profile': {
    id: 'thyroid-profile',
    name: 'Thyroid Profile',
    price: 1200,
    overview: 'A thyroid profile is a group of tests that measure the function of your thyroid, a gland that produces hormones that regulate metabolism.',
    details: `The thyroid profile includes measurements of:
    • TSH (Thyroid Stimulating Hormone)
    • T3 (Triiodothyronine)
    • T4 (Thyroxine)
    • Free T3 and Free T4
    
    These tests help diagnose various thyroid disorders including hypothyroidism and hyperthyroidism.`,
    faqs: [
      {
        question: 'When should I get the test done?',
        answer: 'The test is usually done in the morning, as hormone levels can vary throughout the day. Your doctor will provide specific timing instructions.'
      },
      {
        question: 'Can I take my thyroid medication before the test?',
        answer: 'Usually, you should not take thyroid medication before the test. Consult your healthcare provider for specific instructions.'
      },
      {
        question: 'How long do I need to wait for results?',
        answer: 'Results are typically available within 24-48 hours, depending on the laboratory.'
      }
    ]
  },
  'liver-function': {
    id: 'liver-function',
    name: 'Liver Function Test (LFT)',
    price: 999,
    overview: 'A liver function test (LFT) is a blood test that measures various chemicals in your blood to check how well your liver is working.',
    details: `The liver function test measures several markers including:
    • Alanine transaminase (ALT)
    • Aspartate aminotransferase (AST)
    • Alkaline phosphatase (ALP)
    • Albumin
    • Total protein
    • Bilirubin
    These markers help assess liver damage, inflammation, and overall liver function.`,
    faqs: [
      {
        question: 'Do I need to fast before the liver function test?',
        answer: 'Yes, you typically need to fast for 8-12 hours before the test. Your healthcare provider will give you specific instructions.'
      },
      {
        question: 'How long does it take to get LFT results?',
        answer: 'Results are usually available within 24-48 hours.'
      }
    ]
  },
  'vitamin-d': {
    id: 'vitamin-d',
    name: 'Vitamin D Test',
    price: 1299,
    overview: 'A Vitamin D test measures the level of Vitamin D in your blood, which is crucial for bone health and other bodily functions.',
    details: `The Vitamin D test measures:
    • 25-hydroxyvitamin D levels
    • Both D2 and D3 forms of vitamin D
    This test helps identify vitamin D deficiency or excess, which can affect:
    • Bone health
    • Immune system function
    • Muscle strength
    • Overall health and well-being`,
    faqs: [
      {
        question: 'Do I need to fast before the Vitamin D test?',
        answer: 'Fasting is not typically required for a Vitamin D test, but your healthcare provider may give specific instructions.'
      },
      {
        question: 'What can affect Vitamin D levels?',
        answer: 'Vitamin D levels can be affected by sun exposure, diet, supplements, certain medications, and some medical conditions.'
      }
    ]
  }
};

const TestDetails: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { addItem } = useCart();
  const { showNotification } = useNotification();

  const test = testId ? testDatabase[testId] : null;

  if (!test) {
    return (
      <Container>
        <Typography variant="h5" align="center" sx={{ mt: 4 }}>
          Test not found
        </Typography>
      </Container>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: parseInt(test.id.replace(/\D/g, '')) || Date.now(),
      name: test.name,
      price: test.price,
    });
    showNotification('Test added to cart successfully', 'success');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Left Content */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom color="primary">
              {test.name}
            </Typography>
            <Typography variant="h6" color="primary" gutterBottom>
              Overview
            </Typography>
            <Typography paragraph>
              {test.overview}
            </Typography>
            <Typography variant="h6" color="primary" gutterBottom>
              Test Details
            </Typography>
            <Typography
              paragraph
              sx={{
                whiteSpace: 'pre-line',
                mb: 3
              }}
            >
              {test.details}
            </Typography>
          </Paper>

          <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
            Frequently Asked Questions
          </Typography>
          {test.faqs.map((faq, index) => (
            <Accordion key={index} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight="medium">
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Grid>

        {/* Right Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              position: { md: 'sticky' },
              top: { md: '100px' },
            }}
          >
            <Typography variant="h5" gutterBottom>
              ₹{test.price}
            </Typography>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleAddToCart}
              startIcon={<ShoppingCartIcon />}
              sx={{ mt: 2 }}
            >
              Add to Cart
            </Button>
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Sample collection from your home
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Digital report within 24-48 hours
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Free consultation with healthcare experts
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TestDetails;
