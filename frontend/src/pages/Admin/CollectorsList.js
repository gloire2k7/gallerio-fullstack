import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';

const CollectorsList = () => {
  const [collectors, setCollectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCollectors = async () => {
      try {
        const data = await adminService.getCollectors();
        setCollectors(data);
      } catch (error) {
        setError('Failed to fetch collectors');
        console.error('Error fetching collectors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollectors();
  }, []);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-brown mb-8">Collectors</h1>
      
      <div className="bg-cream rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-brown text-cream">
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Location</th>
              <th className="px-6 py-3 text-left">Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {collectors.map((collector) => (
              <tr key={collector.id} className="border-b border-brown/10">
                <td className="px-6 py-4">
                  {collector.firstname} {collector.lastname}
                </td>
                <td className="px-6 py-4">{collector.email}</td>
                <td className="px-6 py-4">{collector.location || 'N/A'}</td>
                <td className="px-6 py-4">
                  {new Date(collector.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CollectorsList; 