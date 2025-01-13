import React from 'react';
import { Container, Typography, Paper, Box, styled } from '@mui/material';
import { usePrivacyPolicy } from '../context/PrivacyPolicyContext';

const StyledContent = styled('div')(({ theme }) => ({
  '& h1': {
    ...theme.typography.h4,
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(3),
  },
  '& h2': {
    ...theme.typography.h5,
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(3),
  },
  '& p': {
    ...theme.typography.body1,
    marginBottom: theme.spacing(2),
  },
  '& ul, & ol': {
    marginBottom: theme.spacing(2),
    paddingLeft: theme.spacing(3),
  },
  '& li': {
    ...theme.typography.body1,
    marginBottom: theme.spacing(1),
  },
}));

const PrivacyPolicy: React.FC = () => {
  const { privacyPolicy } = usePrivacyPolicy();

  // Convert line breaks to paragraphs and handle basic HTML
  const formatContent = (content: string) => {
    return content
      .split('\n\n')
      .map((paragraph, index) => {
        if (paragraph.startsWith('# ')) {
          return <h1 key={index}>{paragraph.substring(2)}</h1>;
        }
        if (paragraph.startsWith('## ')) {
          return <h2 key={index}>{paragraph.substring(3)}</h2>;
        }
        if (paragraph.startsWith('- ')) {
          return (
            <ul key={index}>
              {paragraph
                .split('\n')
                .filter(line => line.trim())
                .map((line, i) => (
                  <li key={i}>{line.substring(2)}</li>
                ))}
            </ul>
          );
        }
        return <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />;
      });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Privacy Policy
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Last Updated: {new Date(privacyPolicy.lastUpdated).toLocaleDateString()}
        </Typography>
        <Box sx={{ mt: 3 }}>
          <StyledContent>{formatContent(privacyPolicy.content)}</StyledContent>
        </Box>
      </Paper>
    </Container>
  );
};

export default PrivacyPolicy;
