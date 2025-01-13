import React from 'react';
import { Container, Typography, Paper, Box, styled } from '@mui/material';
import { useAbout } from '../context/AboutContext';

const StyledContent = styled('div')(({ theme }) => ({
  '& h1': {
    ...theme.typography.h4,
    marginBottom: theme.spacing(2),
    fontWeight: 400,
    color: theme.palette.text.primary,
    textAlign: 'center',
  },
  '& h2': {
    ...theme.typography.h6,
    marginBottom: theme.spacing(1.5),
    marginTop: theme.spacing(2.5),
    fontWeight: 400,
    color: theme.palette.text.primary,
  },
  '& p': {
    ...theme.typography.body1,
    marginBottom: theme.spacing(1.5),
    lineHeight: 1.6,
    maxWidth: '800px',
    margin: '0 auto',
    color: theme.palette.text.secondary,
  },
  '& ul, & ol': {
    marginBottom: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    maxWidth: '800px',
    margin: '0 auto',
  },
  '& li': {
    ...theme.typography.body1,
    marginBottom: theme.spacing(0.5),
    lineHeight: 1.6,
    color: theme.palette.text.secondary,
  },
}));

const About: React.FC = () => {
  const { aboutContent } = useAbout();

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
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Paper 
        elevation={1} 
        sx={{ 
          p: { xs: 2, sm: 3 },
          backgroundColor: 'background.paper',
          borderRadius: 1,
        }}
      >
        <Box sx={{ mt: 1 }}>
          <StyledContent>{formatContent(aboutContent.content)}</StyledContent>
        </Box>
      </Paper>
    </Container>
  );
};

export default About;
