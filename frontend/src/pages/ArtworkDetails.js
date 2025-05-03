import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { artworkService } from '../services/api';

const ArtworkDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const data = await artworkService.getArtwork(id);
        setArtwork(data);
      } catch (error) {
        setError('Failed to load artwork details');
        console.error('Error fetching artwork:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArtwork();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-brown">Loading...</div>
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-red-600">{error || 'Artwork not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left side - Image */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <img
              src={artwork.imageUrl ? (artwork.imageUrl.startsWith('http') ? artwork.imageUrl : `http://localhost:8080${artwork.imageUrl}`) : ''}
              alt={artwork.title}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Right side - Details */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-brown">{artwork.title}</h1>
              <span className={
                artwork.status === 'AVAILABLE'
                  ? 'text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full'
                  : 'text-xs bg-red-100 text-red-800 px-3 py-1 rounded-full'
              }>
                {artwork.status.toLowerCase()}
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-brown mb-2">Artist</h2>
                <p className="text-brown/80">{artwork.artistName}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-brown mb-2">Description</h2>
                <p className="text-brown/80">{artwork.description}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-brown mb-2">Category</h2>
                <p className="text-brown/80 capitalize">{artwork.category}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-brown mb-2">Price</h2>
                <p className="text-2xl font-bold text-coral">${artwork.price}</p>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => {
                    // Optionally handle purchase or other actions
                  }}
                  className="w-full bg-coral text-cream py-3 px-6 rounded-lg hover:bg-coral/90 transition-colors"
                >
                  {artwork.status === 'AVAILABLE' ? 'Purchase Artwork' : 'Not Available'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetails; 