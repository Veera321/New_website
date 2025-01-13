import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  Chip,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { HomeCollectionRequest, HomeCollectionStatus } from '../../types/homeCollection';
import { useHomeCollection } from '../../context/HomeCollectionContext';

// Mock data for testing
const mockData: HomeCollectionRequest[] = [
  {
    id: '1',
    fullName: 'John Doe',
    mobileNumber: '9876543210',
    address: '123 Main St',
    city: 'Mumbai',
    pinCode: '400001',
    preferredDate: '2025-01-15',
    preferredTime: '10:00 AM',
    status: 'pending',
    createdAt: '2025-01-13T14:00:00Z',
    updatedAt: '2025-01-13T14:00:00Z',
  },
  // Add more mock data as needed
];

const statusColors = {
  pending: 'warning',
  call_done: 'info',
  follow_up: 'secondary',
  deal_closed: 'success',
  not_interested: 'error',
};

const statusLabels = {
  pending: 'Pending',
  call_done: 'Call Done',
  follow_up: 'Follow Up',
  deal_closed: 'Deal Closed',
  not_interested: 'Not Interested',
};

const HomeCollectionRequests: React.FC = () => {
  const theme = useTheme();
  const { 
    requests, 
    updateRequestStatus, 
    deleteRequest, 
    markRequestAsRead 
  } = useHomeCollection();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRequest, setSelectedRequest] = useState<HomeCollectionRequest | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Mark all displayed requests as read
  useEffect(() => {
    requests.forEach(request => {
      markRequestAsRead(request.id);
    });
  }, [requests, markRequestAsRead]);

  const handleActionClick = (event: React.MouseEvent<HTMLElement>, request: HomeCollectionRequest) => {
    setAnchorEl(event.currentTarget);
    setSelectedRequest(request);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRequest(null);
  };

  const handleStatusUpdate = (status: HomeCollectionStatus) => {
    if (selectedRequest) {
      updateRequestStatus(selectedRequest.id, status);
    }
    handleClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    setAnchorEl(null);
  };

  const handleDeleteConfirm = () => {
    if (selectedRequest) {
      deleteRequest(selectedRequest.id);
    }
    setDeleteDialogOpen(false);
    setSelectedRequest(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Home Collection Requests
      </Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
              <TableCell sx={{ color: 'white' }}>Full Name</TableCell>
              <TableCell sx={{ color: 'white' }}>Mobile Number</TableCell>
              <TableCell sx={{ color: 'white' }}>Address</TableCell>
              <TableCell sx={{ color: 'white' }}>City</TableCell>
              <TableCell sx={{ color: 'white' }}>Pin Code</TableCell>
              <TableCell sx={{ color: 'white' }}>Preferred Date</TableCell>
              <TableCell sx={{ color: 'white' }}>Preferred Time</TableCell>
              <TableCell sx={{ color: 'white' }}>Status</TableCell>
              <TableCell sx={{ color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id} hover>
                <TableCell>{request.fullName}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon color="primary" sx={{ fontSize: 18 }} />
                    {request.mobileNumber}
                  </Box>
                </TableCell>
                <TableCell>{request.address}</TableCell>
                <TableCell>{request.city}</TableCell>
                <TableCell>{request.pinCode}</TableCell>
                <TableCell>{new Date(request.preferredDate).toLocaleDateString()}</TableCell>
                <TableCell>{request.preferredTime}</TableCell>
                <TableCell>
                  <Chip
                    label={statusLabels[request.status]}
                    color={statusColors[request.status] as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={(e) => handleActionClick(e, request)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleStatusUpdate('call_done')}>
          <PhoneIcon sx={{ mr: 1 }} /> Call Done
        </MenuItem>
        <MenuItem onClick={() => handleStatusUpdate('follow_up')}>
          <ScheduleIcon sx={{ mr: 1 }} /> Follow Up
        </MenuItem>
        <MenuItem onClick={() => handleStatusUpdate('deal_closed')}>
          <CheckCircleIcon sx={{ mr: 1 }} /> Deal Closed
        </MenuItem>
        <MenuItem onClick={() => handleStatusUpdate('not_interested')}>
          <CancelIcon sx={{ mr: 1 }} /> Not Interested
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this request?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HomeCollectionRequests;
