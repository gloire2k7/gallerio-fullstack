import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Artists = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy data for demonstration
  const artists = [
    {
      id: 1,
      name: 'Jean Paul Mugisha',
      specialty: 'Traditional Painting',
      bio: 'Specializing in traditional Rwandan art forms, bringing cultural heritage to life through vibrant colors.',
      image: 'https://picsum.photos/200/200',
      artworks: 24,
      followers: 1200,
    },
    {
      id: 2,
      name: 'Marie Claire Uwase',
      specialty: 'Digital Art',
      bio: 'Contemporary digital artist blending modern techniques with traditional Rwandan motifs.',
      image: 'https://picsum.photos/200/201',
      artworks: 18,
      followers: 890,
    },
    {
      id: 3,
      name: 'Emmanuel Kwizera',
      specialty: 'Sculpture',
      bio: 'Creating powerful sculptures that tell stories of Rwanda\'s past and present.',
      image: 'https://picsum.photos/200/202',
      artworks: 15,
      followers: 750,
    },
    {
      id: 4,
      name: 'Alice Mukamana',
      specialty: 'Mixed Media',
      bio: 'Exploring the intersection of traditional and contemporary art through mixed media.',
      image: 'https://picsum.photos/200/203',
      artworks: 30,
      followers: 1500,
    },
  ];

  const filteredArtists = artists.filter(artist =>
    artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artist.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <div className="bg-brown py-20">
        <div className="section-container">
          <h1 className="text-4xl md:text-5xl font-bold text-cream text-center mb-6">
            Meet Our Artists
          </h1>
          <p className="text-cream/90 text-center max-w-2xl mx-auto">
            Discover talented Rwandan artists who bring our cultural heritage to life through their unique artistic expressions.
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white shadow-md">
        <div className="section-container py-6">
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search artists by name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-3 rounded-full bg-cream focus:outline-none focus:ring-2 focus:ring-coral/50 pl-12"
              />
              <svg
                className="w-6 h-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-brown/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Artists Grid */}
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredArtists.map((artist) => (
            <div
              key={artist.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative h-64">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brown/90 to-transparent p-6">
                  <h3 className="text-xl font-semibold text-cream">{artist.name}</h3>
                  <p className="text-cream/80">{artist.specialty}</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-brown/70 mb-4">{artist.bio}</p>
                <div className="flex justify-between items-center text-sm">
                  <div className="text-brown">
                    <span className="font-semibold">{artist.artworks}</span> artworks
                  </div>
                  <div className="text-brown">
                    <span className="font-semibold">{artist.followers}</span> followers
                  </div>
                </div>
                <Link
                  to={`/artist/${artist.id}`}
                  className="mt-4 block text-center bg-coral text-cream py-2 rounded-lg hover:bg-salmon transition-colors"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Artists; 