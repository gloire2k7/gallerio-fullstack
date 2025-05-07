import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/api';

const ArtistsList = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const data = await adminService.getArtists();
        setArtists(data);
      } catch (err) {
        setError('Failed to load artists');
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();
  }, []);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-brown mb-8">Artists</h1>
      <div className="bg-cream rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-brown text-cream">
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Location</th>
              <th className="px-6 py-3 text-left">Joined</th>
            </tr>
          </thead>
          <tbody>
            {artists.map((artist) => (
              <tr key={artist.id} className="border-b border-brown/10">
                <td className="px-6 py-4">{artist.firstname} {artist.lastname}</td>
                <td className="px-6 py-4">{artist.email}</td>
                <td className="px-6 py-4">{artist.location || 'N/A'}</td>
                <td className="px-6 py-4">{artist.createdAt ? new Date(artist.createdAt).toLocaleDateString() : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ArtistsList; 