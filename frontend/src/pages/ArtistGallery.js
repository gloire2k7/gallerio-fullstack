import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { artworkService } from '../services/api';

const ArtistGallery = () => {
  const [artworks, setArtworks] = useState([]);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const data = await artworkService.getAllArtworks();
        setArtworks(data);
      } catch (error) {
        console.error('Error fetching artworks:', error);
      }
    };
    fetchArtworks();
  }, []);

  // Define main categories and group the rest as 'Other'
  const mainCategories = ['Painting', 'Sculptures', 'Photography', 'Digital Art'];
  const allCategories = Array.from(new Set(artworks.map(a => a.category?.trim()))).filter(Boolean);
  const otherCategories = allCategories.filter(cat => !mainCategories.includes(cat));
  const filterButtons = ['all', ...mainCategories, ...(otherCategories.length ? ['Other'] : [])];

  const filteredArtworks = filter === 'all'
    ? artworks
    : filter === 'Other'
      ? artworks.filter(art => art.category && !mainCategories.includes(art.category.trim()))
      : artworks.filter(art => art.category && art.category.trim() === filter);

  const handleViewDetails = (artworkId) => {
    navigate(`/artwork/${artworkId}`);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <div className="bg-brown py-20">
        <div className="section-container">
          <h1 className="text-4xl md:text-5xl font-bold text-cream text-center mb-6">
            Discover Art from the Community
          </h1>
          <p className="text-cream/90 text-center max-w-2xl mx-auto">
            Browse and get inspired by artworks from fellow artists. Connect, learn, and grow your creative journey.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-md">
        <div className="section-container py-6">
          <div className="flex flex-wrap gap-4 justify-center">
            {filterButtons.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-6 py-2 rounded-full capitalize transition-all ${
                  filter === category
                    ? 'bg-coral text-cream shadow-lg'
                    : 'bg-cream hover:bg-coral/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArtworks.map((artwork) => (
            <div
              key={artwork.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative group">
                <img
                  src={artwork.imageUrl ? (artwork.imageUrl.startsWith('http') ? artwork.imageUrl : `http://localhost:8080${artwork.imageUrl}`) : ''}
                  alt={artwork.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-brown/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Link
                    to={`/artwork/${artwork.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleViewDetails(artwork.id);
                    }}
                    className="bg-coral text-cream px-6 py-3 rounded-lg transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-brown mb-2">
                  {artwork.title}
                  <span className={
                    artwork.status === 'AVAILABLE'
                      ? 'ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded'
                      : 'ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded'
                  }>
                    {artwork.status?.toLowerCase()}
                  </span>
                </h3>
                <p className="text-brown/70 mb-4">By {artwork.artistName}</p>
                <div className="flex justify-between items-center">
                  <span className="text-coral font-semibold">{artwork.price}</span>
                  <span className="text-brown/60 capitalize">{artwork.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtistGallery; 