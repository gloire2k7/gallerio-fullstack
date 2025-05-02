import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { artistService } from '../services/api';

const DashboardCard = ({ title, value, onClick, isClickable = true }) => (
  <Paper 
    sx={{ 
      p: 2,
      cursor: isClickable ? 'pointer' : 'default',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': isClickable ? {
        transform: 'translateY(-4px)',
        boxShadow: 3,
      } : {},
    }}
    onClick={isClickable ? onClick : undefined}
    className="bg-cream"
  >
    <Typography variant="h6" gutterBottom className="text-brown">
      {title}
    </Typography>
    <Typography variant="h4" className="text-coral">
      {value}
    </Typography>
  </Paper>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalArtworks: 0,
    totalSales: 0,
    totalViews: 0,
    unreadMessages: 0,
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const dashboardData = await artistService.getDashboardStats();
        setStats(dashboardData);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <Container maxWidth="lg" className="py-8">
      <Typography variant="h4" gutterBottom className="text-brown">
        Welcome, {user?.name || 'Artist'}!
      </Typography>
      <Grid container spacing={3} className="mt-4">
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Total Artworks"
            value={stats.totalArtworks}
            onClick={() => navigate('/artist/artworks')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Total Sales"
            value={`$${stats.totalSales}`}
            onClick={() => navigate('/artist/orders')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Total Views"
            value={stats.totalViews}
            isClickable={false}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Unread Messages"
            value={stats.unreadMessages}
            onClick={() => navigate('/artist/inbox')}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 