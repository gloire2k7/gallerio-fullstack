import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { orderService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await orderService.getArtistOrders();
      setOrders(response);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders. Please try again.');
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (event, order) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOrder(null);
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedOrder) return;

    try {
      await orderService.updateOrderStatus(selectedOrder.id, newStatus);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update order status. Please try again.');
    }
    handleMenuClose();
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'success';
      case 'pending_payment':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" className="py-8">
      <Typography variant="h4" className="text-brown mb-6">
        Orders
      </Typography>

      {error && (
        <Box className="mb-4">
          <Typography className="text-red-500">{error}</Typography>
        </Box>
      )}

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <TableContainer component={Paper} className="bg-cream">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="text-brown font-bold">Order ID</TableCell>
                <TableCell className="text-brown font-bold">Date</TableCell>
                <TableCell className="text-brown font-bold">Customer</TableCell>
                <TableCell className="text-brown font-bold">Artwork</TableCell>
                <TableCell className="text-brown font-bold">Price</TableCell>
                <TableCell className="text-brown font-bold">Payment Status</TableCell>
                <TableCell className="text-brown font-bold">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="text-brown">#{order.id}</TableCell>
                  <TableCell className="text-brown">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-brown">{order.customer.firstName} {order.customer.lastName}</TableCell>
                  <TableCell className="text-brown">{order.artwork.title}</TableCell>
                  <TableCell className="text-brown">${order.artwork.price}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.paymentStatus === 'PAID' ? 'Paid' : 'Not Yet Paid'}
                      color={getStatusColor(order.paymentStatus)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, order)}
                      className="text-brown"
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleStatusChange('processing')}>
          Mark as Processing
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('shipped')}>
          Mark as Shipped
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('delivered')}>
          Mark as Delivered
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('cancelled')}>
          Cancel Order
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default Orders; 