import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Gallery = () => {
  const [filter, setFilter] = useState('all');
  
  // Dummy data for demonstration
  const artworks = [
    { id: 1, title: 'Traditional Dance', artist: 'Jean Paul', category: 'painting', price: '$450', image: 'https://picsum.photos/400/300' },
    { id: 2, title: 'Modern Rwanda', artist: 'Marie Claire', category: 'digital', price: '$350', image: 'https://picsum.photos/400/301' },
    { id: 3, title: 'Village Life', artist: 'Emmanuel', category: 'sculpture', price: '$550', image: 'https://picsum.photos/400/302' },
    { id: 4, title: 'Urban Dreams', artist: 'Alice', category: 'painting', price: '$400', image: 'https://picsum.photos/400/303' },
    { id: 5, title: 'Nature\'s Call', artist: 'Patrick', category: 'photography', price: '$300', image: 'https://picsum.photos/400/304' },
    { id: 6, title: 'Cultural Heritage', artist: 'Sarah', category: 'sculpture', price: '$600', image: 'https://picsum.photos/400/305' },
  ];

  const filteredArtworks = filter === 'all' ? artworks : artworks.filter(art => art.category === filter);

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <div className="bg-brown py-20">
        <div className="section-container">
          <h1 className="text-4xl md:text-5xl font-bold text-cream text-center mb-6">
            Explore Our Collection
          </h1>
          <p className="text-cream/90 text-center max-w-2xl mx-auto">
            Discover unique pieces from talented Rwandan artists, each telling a story of our rich cultural heritage.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-md">
        <div className="section-container py-6">
          <div className="flex flex-wrap gap-4 justify-center">
            {['all', 'painting', 'sculpture', 'digital', 'photography'].map((category) => (
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
                  src={artwork.image}
                  alt={artwork.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-brown/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Link
                    to={`/artwork/${artwork.id}`}
                    className="bg-coral text-cream px-6 py-3 rounded-lg transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-brown mb-2">{artwork.title}</h3>
                <p className="text-brown/70 mb-4">By {artwork.artist}</p>
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

export default Gallery; 