import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Chip,
  InputAdornment,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Publish as PublishIcon,
  Unpublished as UnpublishedIcon,
} from '@mui/icons-material';
import { useBloodTest } from '../../context/BloodTestContext';
import type { Test } from '../../../tests/data/testData';

interface TestFormData {
  id: number;
  name: string;
  description: string;
  price: number;
  parameters: string[];
  preparation: string[];
  turnaroundTime: string;
  published: boolean;
}

const BloodTestManager: React.FC = () => {
  const { tests, addTest, updateTest, deleteTest, togglePublish, loading } = useBloodTest();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTest, setEditingTest] = useState<number | null>(null);
  const [formData, setFormData] = useState<TestFormData>({
    id: 0,
    name: '',
    description: '',
    price: 0,
    parameters: [],
    preparation: [],
    turnaroundTime: '',
    published: false,
  });
  const [newParameter, setNewParameter] = useState('');
  const [newPreparation, setNewPreparation] = useState('');

  const handleOpenDialog = (test?: any) => {
    if (test) {
      setEditingTest(test.id);
      setFormData(test);
    } else {
      setEditingTest(null);
      setFormData({
        id: Math.max(0, ...tests.map(t => t.id)) + 1,
        name: '',
        description: '',
        price: 0,
        parameters: [],
        preparation: [],
        turnaroundTime: '',
        published: false,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTest(null);
    setFormData({
      id: 0,
      name: '',
      description: '',
      price: 0,
      parameters: [],
      preparation: [],
      turnaroundTime: '',
      published: false,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTest) {
      updateTest(formData);
    } else {
      addTest(formData);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      deleteTest(id);
    }
  };

  const handleAddParameter = () => {
    if (newParameter.trim()) {
      setFormData({
        ...formData,
        parameters: [...formData.parameters, newParameter.trim()],
      });
      setNewParameter('');
    }
  };

  const handleAddPreparation = () => {
    if (newPreparation.trim()) {
      setFormData({
        ...formData,
        preparation: [...formData.preparation, newPreparation.trim()],
      });
      setNewPreparation('');
    }
  };

  const handleRemoveParameter = (index: number) => {
    setFormData({
      ...formData,
      parameters: formData.parameters.filter((_, i) => i !== index),
    });
  };

  const handleRemovePreparation = (index: number) => {
    setFormData({
      ...formData,
      preparation: formData.preparation.filter((_, i) => i !== index),
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Blood Tests Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add New Test
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tests.map((test) => (
              <TableRow key={test.id}>
                <TableCell>{test.name}</TableCell>
                <TableCell>{test.description}</TableCell>
                <TableCell>₹{test.price}</TableCell>
                <TableCell>
                  <Chip 
                    label={test.published ? "Published" : "Draft"} 
                    color={test.published ? "success" : "default"}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => togglePublish(test.id)}
                    color={test.published ? "success" : "default"}
                    title={test.published ? "Unpublish" : "Publish"}
                  >
                    {test.published ? <UnpublishedIcon /> : <PublishIcon />}
                  </IconButton>
                  <IconButton
                    onClick={() => handleOpenDialog(test)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(test.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingTest ? 'Edit Blood Test' : 'Add New Blood Test'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Test Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <TextField
              label="Price"
              type="number"
              fullWidth
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />
            <TextField
              label="Turnaround Time"
              fullWidth
              value={formData.turnaroundTime}
              onChange={(e) => setFormData({ ...formData, turnaroundTime: e.target.value })}
            />

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Parameters
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  label="Add Parameter"
                  size="small"
                  value={newParameter}
                  onChange={(e) => setNewParameter(e.target.value)}
                  fullWidth
                />
                <Button variant="outlined" onClick={handleAddParameter}>
                  Add
                </Button>
              </Box>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {formData.parameters.map((param, index) => (
                  <Chip
                    key={index}
                    label={param}
                    onDelete={() => handleRemoveParameter(index)}
                    sx={{ mb: 1 }}
                  />
                ))}
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Preparation Instructions
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  label="Add Preparation Instruction"
                  size="small"
                  value={newPreparation}
                  onChange={(e) => setNewPreparation(e.target.value)}
                  fullWidth
                />
                <Button variant="outlined" onClick={handleAddPreparation}>
                  Add
                </Button>
              </Box>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {formData.preparation.map((prep, index) => (
                  <Chip
                    key={index}
                    label={prep}
                    onDelete={() => handleRemovePreparation(index)}
                    sx={{ mb: 1 }}
                  />
                ))}
              </Stack>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingTest ? 'Update' : 'Add'} Test
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BloodTestManager;
