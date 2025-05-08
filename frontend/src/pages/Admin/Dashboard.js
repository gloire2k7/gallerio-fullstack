import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService, artworkService, adminService } from '../../services/api';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalArtists: 0,
    totalCollectors: 0,
    totalArtworks: 0,
    totalOrders: 0,
    orderStatusCounts: { PAID: 0, PENDING: 0, CANCELLED: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [artists, collectors, artworks, orders] = await Promise.all([
          adminService.getArtists(),
          adminService.getCollectors(),
          artworkService.getAllArtworks(),
          adminService.getAllOrders()
        ]);

        // Count order statuses
        const orderStatusCounts = orders.reduce((acc, order) => {
          acc[order.status] = (acc[order.status] || 0) + 1;
          return acc;
        }, { PAID: 0, PENDING: 0, CANCELLED: 0 });

        setStats({
          totalArtists: artists.length,
          totalCollectors: collectors.length,
          totalArtworks: artworks.length,
          totalOrders: orders.length,
          orderStatusCounts
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Remove fallback/mock data and pie chart
  const isAllZero =
    stats.totalArtists === 0 &&
    stats.totalCollectors === 0 &&
    stats.totalArtworks === 0 &&
    stats.totalOrders === 0;

  const barData = {
    labels: ['Artists', 'Collectors', 'Artworks', 'Orders'],
    datasets: [
      {
        label: 'Count',
        data: [
          stats.totalArtists,
          stats.totalCollectors,
          stats.totalArtworks,
          stats.totalOrders
        ],
        backgroundColor: [
          '#8B5C2A', // brown
          '#E07A5F', // coral
          '#F2CC8F', // cream
          '#81B29A'  // greenish
        ],
        borderRadius: 8
      }
    ]
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96 text-xl text-brown">Loading dashboard data...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-brown">Admin Dashboard</h1>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-brown/10 cursor-pointer hover:shadow-lg transition" onClick={() => window.location.href='/admin/artists'}>
          <h3 className="text-lg font-semibold text-brown mb-2">Total Artists</h3>
          <p className="text-3xl font-bold text-coral">{stats.totalArtists}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-brown/10 cursor-pointer hover:shadow-lg transition" onClick={() => window.location.href='/admin/collectors'}>
          <h3 className="text-lg font-semibold text-brown mb-2">Total Collectors</h3>
          <p className="text-3xl font-bold text-coral">{stats.totalCollectors}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-brown/10 cursor-pointer hover:shadow-lg transition" onClick={() => window.location.href='/admin/artworks'}>
          <h3 className="text-lg font-semibold text-brown mb-2">Total Artworks</h3>
          <p className="text-3xl font-bold text-coral">{stats.totalArtworks}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-brown/10 cursor-pointer hover:shadow-lg transition" onClick={() => window.location.href='/admin/orders'}>
          <h3 className="text-lg font-semibold text-brown mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-coral">{stats.totalOrders}</p>
        </div>
      </div>
      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-brown/10 flex flex-col items-center col-span-2 max-w-md mx-auto h-72">
          <h2 className="text-lg font-bold text-brown mb-4">Platform Overview</h2>
          {isAllZero ? (
            <div className="text-brown/60 mt-8">No data to display.</div>
          ) : (
            <Bar data={barData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                title: { display: false }
              },
              scales: {
                y: { beginAtZero: true, precision: 0 }
              }
            }} style={{height: '100%', width: '100%'}} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 