import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService, artworkService, orderService } from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalArtists: 0,
    totalCollectors: 0,
    totalArtworks: 0,
    totalOrders: 0,
    recentOrders: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [artists, collectors, artworks, orders] = await Promise.all([
          userService.getUsersByRole('ARTIST'),
          userService.getUsersByRole('COLLECTOR'),
          artworkService.getAllArtworks(),
          orderService.getAllOrders()
        ]);

        setStats({
          totalArtists: artists.length,
          totalCollectors: collectors.length,
          totalArtworks: artworks.length,
          totalOrders: orders.length,
          recentOrders: orders.slice(0, 5) // Get 5 most recent orders
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-brown">Admin Dashboard</h1>
        <div className="flex space-x-4">
          <Link
            to="/admin/artists"
            className="bg-brown text-cream px-4 py-2 rounded-lg hover:bg-brown/90 transition"
          >
            Manage Artists
          </Link>
          <Link
            to="/admin/collectors"
            className="bg-brown text-cream px-4 py-2 rounded-lg hover:bg-brown/90 transition"
          >
            Manage Collectors
          </Link>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-brown/10">
          <h3 className="text-lg font-semibold text-brown mb-2">Total Artists</h3>
          <p className="text-3xl font-bold text-coral">{stats.totalArtists}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-brown/10">
          <h3 className="text-lg font-semibold text-brown mb-2">Total Collectors</h3>
          <p className="text-3xl font-bold text-coral">{stats.totalCollectors}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-brown/10">
          <h3 className="text-lg font-semibold text-brown mb-2">Total Artworks</h3>
          <p className="text-3xl font-bold text-coral">{stats.totalArtworks}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-brown/10">
          <h3 className="text-lg font-semibold text-brown mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-coral">{stats.totalOrders}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-brown/10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-brown">Recent Orders</h2>
          <Link
            to="/admin/orders"
            className="text-coral hover:text-coral/80 transition"
          >
            View All Orders
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-brown/20">
                <th className="text-left py-3 px-4 text-brown">Artwork</th>
                <th className="text-left py-3 px-4 text-brown">Artist</th>
                <th className="text-left py-3 px-4 text-brown">Customer</th>
                <th className="text-left py-3 px-4 text-brown">Price</th>
                <th className="text-left py-3 px-4 text-brown">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-brown/10 hover:bg-brown/5">
                  <td className="py-3 px-4">{order.artwork.title}</td>
                  <td className="py-3 px-4">{order.artist.firstname} {order.artist.lastname}</td>
                  <td className="py-3 px-4">{order.customer.firstname} {order.customer.lastname}</td>
                  <td className="py-3 px-4">${order.artwork.price}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      order.status === 'PAID' ? 'bg-green-100 text-green-800' :
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 