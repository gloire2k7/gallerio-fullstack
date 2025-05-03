import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAllArtists, getArtistArtworks } from '../services/api';
import defaultUserIcon from '../assets/default-user-icon.svg';

const ArtistProfile = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch artist details
        const artistsData = await getAllArtists();
        const foundArtist = artistsData.find(a => a.id === parseInt(id));
        
        if (!foundArtist) {
          throw new Error('Artist not found');
        }
        
        setArtist(foundArtist);
        
        // Fetch artist's artworks
        try {
          const artworksData = await getArtistArtworks(id);
          setArtworks(artworksData || []);
        } catch (artworkError) {
          console.error('Error fetching artworks:', artworkError);
          setArtworks([]); // Set empty array if artworks fetch fails
        }
      } catch (err) {
        console.error('Error fetching artist data:', err);
        setError(err.message || 'Failed to load artist profile');
      } finally {
        setLoading(false);
      }
    };

    fetchArtistData();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-brown">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  if (!artist) return <div className="min-h-screen flex items-center justify-center text-red-600">Artist not found</div>;

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <div className="flex flex-col items-center mb-6">
                {artist.profilePhoto ? (
                  <img
                    src={artist.profilePhoto}
                    alt={`${artist.firstName} ${artist.lastName}`}
                    className="w-48 h-48 rounded-full object-cover mb-4"
                  />
                ) : (
                  <div className="w-48 h-48 rounded-full bg-brown/5 flex items-center justify-center mb-4">
                    <img
                      src={defaultUserIcon}
                      alt="Default user"
                      className="w-32 h-32 opacity-50"
                    />
                  </div>
                )}
                <h1 className="text-2xl font-bold text-brown mb-2">
                  {artist.firstName} {artist.lastName}
                </h1>
                <p className="text-brown/70 mb-4">{artist.location || 'Location not specified'}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-brown mb-2">About</h2>
                  <p className="text-brown/70">
                    {artist.bio || 'No bio available'}
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-brown mb-2">Contact</h2>
                  <p className="text-brown/70">{artist.email}</p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-brown mb-2">Statistics</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-brown/5 p-4 rounded-lg">
                      <p className="text-brown/70">Artworks</p>
                      <p className="text-2xl font-bold text-brown">{artworks.length}</p>
                    </div>
                    {/* Add more statistics as needed */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Artworks */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-brown mb-6">Artworks</h2>
            {artworks.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <p className="text-brown/70">No artworks available yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {artworks.map((artwork) => (
                  <div
                    key={artwork.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative h-64">
                      <img
                        src={
                          artwork.imageUrl && (artwork.imageUrl.startsWith('http')
                            ? artwork.imageUrl
                            : `http://localhost:8080${artwork.imageUrl}`)
                        }
                        alt={artwork.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-brown mb-2">{artwork.title}</h3>
                      <p className="text-brown/70 mb-4 line-clamp-2">{artwork.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-brown">${artwork.price}</span>
                        <Link
                          to={`/artwork/${artwork.id}`}
                          className="bg-coral text-cream px-4 py-2 rounded-lg hover:bg-salmon transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistProfile; 