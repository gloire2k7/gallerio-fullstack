import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllArtists } from '../services/api';
import defaultUserIcon from '../assets/default-user-icon.svg';

const Artists = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const data = await getAllArtists();
        setArtists(data);
      } catch (err) {
        setError('Failed to load artists');
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();
  }, []);

  const filteredArtists = artists.filter(artist =>
    (`${artist.firstName} ${artist.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (artist.bio || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (artist.location || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center text-brown">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;

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
                placeholder="Search artists by name, bio, or location..."
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
                {artist.profilePhoto ? (
                  <img
                    src={artist.profilePhoto}
                    alt={`${artist.firstName} ${artist.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-brown/5 flex items-center justify-center">
                    <img
                      src={defaultUserIcon}
                      alt="Default user"
                      className="w-24 h-24 opacity-50"
                    />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brown/90 to-transparent p-6">
                  <h3 className="text-xl font-semibold text-cream">{artist.firstName} {artist.lastName}</h3>
                  <p className="text-cream/80">{artist.location || 'Rwanda'}</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-brown/70 mb-4">{artist.bio}</p>
                <div className="flex justify-between items-center text-sm">
                  <div className="text-brown">
                    {/* You can add artwork count if available */}
                  </div>
                  <div className="text-brown">
                    {/* You can add followers if available */}
                  </div>
                </div>
                <Link
                  to={`/artist/${artist.id}`}
                  className="mt-4 block text-center bg-coral text-cream py-2 rounded-lg hover:bg-salmon transition-colors"
                >
                  View Profile
                </Link>
                <Link
                  to={`/messages?to=${artist.id}`}
                  className="mt-2 block text-center bg-brown text-cream py-2 rounded-lg hover:bg-brown/80 transition-colors"
                >
                  Reach Out
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