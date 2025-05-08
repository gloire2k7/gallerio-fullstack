import React, { useEffect, useState } from 'react';
import { artworkService } from '../../services/api';

const ArtworksList = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });
  const recordsPerPage = 5;

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const data = await artworkService.getAllArtworks();
        setArtworks(data);
      } catch (err) {
        setError('Failed to load artworks');
      } finally {
        setLoading(false);
      }
    };
    fetchArtworks();
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedArtworks = [...artworks].sort((a, b) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];
    if (sortConfig.key === 'artist') {
      aValue = a.user?.firstName + ' ' + a.user?.lastName;
      bValue = b.user?.firstName + ' ' + b.user?.lastName;
    }
    if (typeof aValue === 'string') aValue = aValue.toLowerCase();
    if (typeof bValue === 'string') bValue = bValue.toLowerCase();
    return sortConfig.direction === 'asc'
      ? (aValue > bValue ? 1 : aValue < bValue ? -1 : 0)
      : (aValue < bValue ? 1 : aValue > bValue ? -1 : 0);
  });

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedArtworks.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(artworks.length / recordsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-brown mb-8">All Artworks</h1>
      <div className="bg-cream rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-brown text-cream">
              <th className="px-6 py-3 text-left cursor-pointer hover:bg-brown/80" onClick={() => handleSort('title')}>
                Title {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-left cursor-pointer hover:bg-brown/80" onClick={() => handleSort('artist')}>
                Artist {sortConfig.key === 'artist' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-left cursor-pointer hover:bg-brown/80" onClick={() => handleSort('price')}>
                Price {sortConfig.key === 'price' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-left cursor-pointer hover:bg-brown/80" onClick={() => handleSort('category')}>
                Category {sortConfig.key === 'category' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((artwork, index) => (
              <tr key={artwork.id || index} className="border-b border-brown/10">
                <td className="px-6 py-4">{artwork.title}</td>
                <td className="px-6 py-4">{artwork.artistName || 'N/A'}</td>
                <td className="px-6 py-4">${artwork.price}</td>
                <td className="px-6 py-4">{artwork.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-brown text-cream rounded disabled:opacity-50"
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 rounded ${
              currentPage === index + 1
                ? 'bg-brown text-cream'
                : 'bg-cream text-brown hover:bg-brown/10'
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-brown text-cream rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ArtworksList; 