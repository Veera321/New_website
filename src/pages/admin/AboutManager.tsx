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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  RestorePage as RestoreIcon,
} from '@mui/icons-material';
import { useAbout } from '../../context/AboutContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

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
    color: theme.palette.text.secondary,
  },
  '& ul, & ol': {
    marginBottom: theme.spacing(2),
    paddingLeft: theme.spacing(2),
  },
  '& li': {
    ...theme.typography.body1,
    marginBottom: theme.spacing(0.5),
    lineHeight: 1.6,
    color: theme.palette.text.secondary,
  },
}));

const defaultSections = {
  vision: "## Our Vision\nTo be the leading healthcare diagnostics provider, delivering accurate, timely, and affordable medical testing services to our community.",
  mission: "## Our Mission\nAt PS Healthcare, we are committed to:\n- Providing high-quality diagnostic services\n- Ensuring accurate and reliable test results\n- Making healthcare accessible to all\n- Maintaining the highest standards of patient care",
  values: "## Our Values\n- Excellence in Service\n- Patient-Centric Care\n- Integrity and Trust\n- Innovation in Healthcare\n- Professional Ethics",
  services: "## Our Services\nWe offer a comprehensive range of diagnostic services:\n- Routine Blood Tests\n- Advanced Diagnostic Tests\n- Health Packages\n- Home Collection Services\n- Online Reports\n- Expert Consultation",
  team: "## Our Team\nOur team consists of highly qualified healthcare professionals:\n- Experienced Pathologists\n- Skilled Technicians\n- Dedicated Support Staff\n- Professional Phlebotomists",
  quality: "## Quality Assurance\nWe maintain the highest standards of quality through:\n- State-of-the-art Equipment\n- Regular Quality Checks\n- Standardized Procedures\n- Continuous Training",
};

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`about-tabpanel-${index}`}
      aria-labelledby={`about-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AboutManager: React.FC = () => {
  const { aboutContent, updateAboutContent } = useAbout();
  const [content, setContent] = useState(aboutContent.content);
  const [tabValue, setTabValue] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('');
  const [sectionContent, setSectionContent] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState('');

  useEffect(() => {
    setContent(aboutContent.content);
  }, [aboutContent]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSave = () => {
    updateAboutContent(content);
    setShowSuccess(true);
  };

  const handleEditSection = (section: string) => {
    const sectionMatch = content.match(new RegExp(`## ${section}[\\s\\S]*?(?=## |$)`));
    setSectionContent(sectionMatch ? sectionMatch[0].trim() : '');
    setCurrentSection(section);
    setEditDialogOpen(true);
  };

  const handleSaveSection = () => {
    const contentParts = content.split(/(?=## )/);
    const sectionIndex = contentParts.findIndex(part => 
      part.startsWith(`## ${currentSection}`)
    );

    if (sectionIndex !== -1) {
      contentParts[sectionIndex] = sectionContent;
    } else {
      contentParts.push(sectionContent);
    }

    setContent(contentParts.join('\n\n'));
    setEditDialogOpen(false);
    setShowSuccess(true);
  };

  const handleDeleteSection = (section: string) => {
    setSectionToDelete(section);
    setConfirmDialogOpen(true);
  };

  const confirmDelete = () => {
    const contentParts = content.split(/(?=## )/);
    const newContent = contentParts
      .filter(part => !part.startsWith(`## ${sectionToDelete}`))
      .join('\n\n');
    setContent(newContent);
    setConfirmDialogOpen(false);
    setShowSuccess(true);
  };

  const handleAddDefaultSection = (section: keyof typeof defaultSections) => {
    const newContent = content + '\n\n' + defaultSections[section];
    setContent(newContent);
    setShowSuccess(true);
  };

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

  const sections = content
    .split(/(?=## )/)
    .filter(section => section.startsWith('## '))
    .map(section => section.split('\n')[0].replace('## ', ''));

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          About Page Manager
        </Typography>
        <Box>
          <Button
            startIcon={<RestoreIcon />}
            onClick={() => setContent(aboutContent.content)}
            sx={{ mr: 1 }}
          >
            Reset Changes
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSave}
          >
            Save All Changes
          </Button>
        </Box>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <List>
          {sections.map((section) => (
            <React.Fragment key={section}>
              <ListItem>
                <ListItemText primary={section} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => handleEditSection(section)} sx={{ mr: 1 }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleDeleteSection(section)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Add Section:
          </Typography>
          {Object.keys(defaultSections).map((section) => (
            <Button
              key={section}
              startIcon={<AddIcon />}
              onClick={() => handleAddDefaultSection(section as keyof typeof defaultSections)}
              sx={{ mr: 1, mb: 1 }}
              size="small"
            >
              {section}
            </Button>
          ))}
        </Box>
      </Paper>

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
            placeholder="Enter about page content using simple formatting:
# For main headings
## For subheadings
- For bullet points

Use blank lines between paragraphs"
            variant="outlined"
            sx={{ mb: 2, fontFamily: 'monospace' }}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Paper elevation={0} sx={{ p: 3, backgroundColor: 'grey.50' }}>
            <Box sx={{ mt: 2 }}>
              <StyledContent>{formatContent(content)}</StyledContent>
            </Box>
          </Paper>
        </TabPanel>
      </Paper>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Section: {currentSection}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={10}
            value={sectionContent}
            onChange={(e) => setSectionContent(e.target.value)}
            variant="outlined"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveSection} variant="contained" color="primary">
            Save Section
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the "{sectionToDelete}" section?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success">
          Changes saved successfully
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AboutManager;
