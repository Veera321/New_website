import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Typography,
  Tooltip,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  FileDownload as FileDownloadIcon,
} from '@mui/icons-material';
import { useCartRequests } from '../../context/CartRequestContext';
import { useNotification } from '../../context/NotificationContext';

const CartRequests: React.FC = () => {
  const { requests, updateRequestStatus, deleteRequest } = useCartRequests();
  const { showNotification } = useNotification();
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const handleStatusUpdate = (id: string, status: 'called' | 'follow-up' | 'closed') => {
    setSelectedRequest(id);
    if (status === 'follow-up') {
      setOpenDialog(true);
    } else {
      updateRequestStatus(id, status);
      showNotification(`Status updated to ${status}`, 'success');
    }
  };

  const handleNotesSubmit = () => {
    if (selectedRequest) {
      updateRequestStatus(selectedRequest, 'follow-up', notes);
      setOpenDialog(false);
      setNotes('');
      setSelectedRequest(null);
      showNotification('Follow-up notes added', 'success');
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      deleteRequest(id);
      showNotification('Request deleted successfully', 'success');
    }
  };

  const exportToCSV = () => {
    // Create CSV headers
    const headers = [
      'Patient Name',
      'Mobile',
      'Address',
      'Items',
      'Total Amount',
      'Status',
      'Created At',
      'Notes'
    ].join(',');

    // Create CSV rows
    const rows = requests.map(request => [
      request.patientName.replace(/,/g, ';'),
      request.mobile,
      request.address.replace(/,/g, ';'),
      request.items.map(item => item.name).join('; '),
      request.totalAmount,
      request.status,
      new Date(request.createdAt).toLocaleString(),
      (request.notes || '').replace(/,/g, ';')
    ].join(','));

    // Combine headers and rows
    const csvContent = [headers, ...rows].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `cart_requests_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);

    showNotification('Data exported successfully', 'success');
  };

  return (
    <div>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Cart Requests</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FileDownloadIcon />}
          onClick={exportToCSV}
        >
          Export to CSV
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient Name</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.patientName}</TableCell>
                <TableCell>{request.mobile}</TableCell>
                <TableCell>{request.address}</TableCell>
                <TableCell>
                  {request.items.map((item) => item.name).join(', ')}
                </TableCell>
                <TableCell>₹{request.totalAmount}</TableCell>
                <TableCell>{request.status}</TableCell>
                <TableCell>
                  {new Date(request.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      onClick={() => handleStatusUpdate(request.id, 'called')}
                      disabled={request.status === 'closed'}
                    >
                      Call Done
                    </Button>
                    <Button
                      size="small"
                      onClick={() => handleStatusUpdate(request.id, 'follow-up')}
                      disabled={request.status === 'closed'}
                    >
                      Follow-up
                    </Button>
                    <Button
                      size="small"
                      onClick={() => handleStatusUpdate(request.id, 'closed')}
                      disabled={request.status === 'closed'}
                    >
                      Close
                    </Button>
                    <Tooltip title="Delete Request">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(request.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add Follow-up Notes</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Notes"
            fullWidth
            multiline
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleNotesSubmit} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CartRequests;
