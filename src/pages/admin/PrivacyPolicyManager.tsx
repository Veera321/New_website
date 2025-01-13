import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Tab,
  Tabs,
  Snackbar,
  Alert,
  styled,
} from '@mui/material';
import { usePrivacyPolicy } from '../../context/PrivacyPolicyContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

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

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`privacy-tabpanel-${index}`}
      aria-labelledby={`privacy-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const PrivacyPolicyManager: React.FC = () => {
  const { privacyPolicy, updatePrivacyPolicy } = usePrivacyPolicy();
  const [content, setContent] = useState(privacyPolicy.content);
  const [tabValue, setTabValue] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setContent(privacyPolicy.content);
  }, [privacyPolicy]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSave = () => {
    updatePrivacyPolicy(content);
    setShowSuccess(true);
  };

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
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Privacy Policy Manager
      </Typography>
      <Paper sx={{ mt: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Edit" />
          <Tab label="Preview" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <TextField
            fullWidth
            multiline
            rows={20}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter privacy policy content using simple formatting:
# For main headings
## For subheadings
- For bullet points

Use blank lines between paragraphs"
            variant="outlined"
            sx={{ mb: 2, fontFamily: 'monospace' }}
          />
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Paper elevation={0} sx={{ p: 3, backgroundColor: 'grey.50' }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Last Updated: {new Date(privacyPolicy.lastUpdated).toLocaleDateString()}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <StyledContent>{formatContent(content)}</StyledContent>
            </Box>
          </Paper>
        </TabPanel>
      </Paper>

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success">
          Privacy Policy updated successfully
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PrivacyPolicyManager;
