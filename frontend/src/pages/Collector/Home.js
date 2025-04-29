import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAllArtworks, likeArtwork, commentOnArtwork, followArtist, searchArtworks } from '../../services/api';
import { setArtworks, setLoading, setError } from '../../store/slices/artworkSlice';

const CollectorHome = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { artworks, loading, error } = useSelector((state) => state.artwork);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [comment, setComment] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [followedArtists, setFollowedArtists] = useState(new Set());
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchArtworks = async () => {
      dispatch(setLoading(true));
      try {
        const data = await getAllArtworks();
        dispatch(setArtworks(data));
      } catch (error) {
        dispatch(setError(error.message));
      }
    };

    fetchArtworks();
  }, [dispatch]);

  const handleLike = async (artworkId) => {
    try {
      await likeArtwork(artworkId);
      dispatch(setArtworks(artworks.map(artwork => 
        artwork.id === artworkId 
          ? { ...artwork, likes: artwork.likes + 1, isLiked: true }
          : artwork
      )));
    } catch (error) {
      console.error('Error liking artwork:', error);
    }
  };

  const handleComment = async (artworkId) => {
    if (!comment.trim()) return;
    
    try {
      await commentOnArtwork(artworkId, comment);
      dispatch(setArtworks(artworks.map(artwork => 
        artwork.id === artworkId 
          ? { 
              ...artwork, 
              comments: [...artwork.comments, { 
                id: Date.now(), 
                text: comment, 
                user: user.name,
                date: new Date().toISOString()
              }]
            }
          : artwork
      )));
      setComment('');
    } catch (error) {
      console.error('Error commenting on artwork:', error);
    }
  };

  const handleFollowArtist = async (artistId) => {
    try {
      await followArtist(artistId);
      setFollowedArtists(prev => new Set([...prev, artistId]));
    } catch (error) {
      console.error('Error following artist:', error);
    }
  };

  const handleSearch = async (query) => {
    if (query.trim()) {
      try {
        const results = await searchArtworks(query);
        dispatch(setArtworks(results));
      } catch (error) {
        console.error('Error searching artworks:', error);
      }
    } else {
      const data = await getAllArtworks();
      dispatch(setArtworks(data));
    }
  };

  const filteredArtworks = artworks.filter(artwork => {
    const matchesCategory = category === 'all' || artwork.category === category;
    const matchesSearch = artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         artwork.artistName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedArtworks = [...filteredArtworks].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'most-liked':
        return b.likes - a.likes;
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedArtworks.length / itemsPerPage);
  const paginatedArtworks = sortedArtworks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search artworks..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
                className="w-full px-4 py-2 border border-brown/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-2 border border-brown/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral"
              >
                <option value="all">All Categories</option>
                <option value="PAINTING">Paintings</option>
                <option value="FASHION">Fashion</option>
                <option value="CRAFT">Crafts</option>
                <option value="SCULPTURE">Sculptures</option>
                <option value="PHOTOGRAPHY">Photography</option>
                <option value="OTHER">Other</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-brown/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="most-liked">Most Liked</option>
              </select>
            </div>
          </div>
        </div>

        {/* Featured Artworks */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-brown mb-6">Featured Artworks</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {artworks.slice(0, 3).map((artwork) => (
              <div key={artwork.id} className="bg-white rounded-lg shadow overflow-hidden">
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className="w-full h-64 object-cover cursor-pointer"
                  onClick={() => setSelectedArtwork(artwork)}
                />
                <div className="p-4">
                  <h3 className="font-semibold text-brown">{artwork.title}</h3>
                  <p className="text-sm text-brown/70">{artwork.artistName}</p>
                  <div className="flex justify-between items-center mt-2">
                    <button
                      onClick={() => handleLike(artwork.id)}
                      className={`text-sm ${artwork.isLiked ? 'text-coral' : 'text-brown/50'} hover:text-coral`}
                    >
                      {artwork.likes} Likes
                    </button>
                    <span className="text-sm text-brown/50">{artwork.comments.length} Comments</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Artworks */}
        <div>
          <h2 className="text-2xl font-bold text-brown mb-6">All Artworks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {paginatedArtworks.map((artwork) => (
              <div key={artwork.id} className="bg-white rounded-lg shadow overflow-hidden">
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className="w-full h-48 object-cover cursor-pointer"
                  onClick={() => setSelectedArtwork(artwork)}
                />
                <div className="p-4">
                  <h3 className="font-semibold text-brown">{artwork.title}</h3>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-brown/70">{artwork.artistName}</p>
                    <button
                      onClick={() => handleFollowArtist(artwork.artistId)}
                      className={`text-sm ${followedArtists.has(artwork.artistId) ? 'text-coral' : 'text-brown/50'} hover:text-coral`}
                    >
                      {followedArtists.has(artwork.artistId) ? 'Following' : 'Follow'}
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-coral font-semibold">${artwork.price}</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleLike(artwork.id)}
                        className={`text-sm ${artwork.isLiked ? 'text-coral' : 'text-brown/50'} hover:text-coral`}
                      >
                        {artwork.likes} Likes
                      </button>
                      <span className="text-sm text-brown/50">{artwork.comments.length} Comments</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-brown/20 rounded-lg hover:bg-brown/5 disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === page
                        ? 'bg-coral text-white'
                        : 'border border-brown/20 hover:bg-brown/5'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-brown/20 rounded-lg hover:bg-brown/5 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>

        {/* Artwork Details Modal */}
        {selectedArtwork && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-brown">{selectedArtwork.title}</h2>
                    <p className="text-brown/70">by {selectedArtwork.artistName}</p>
                  </div>
                  <button
                    onClick={() => setSelectedArtwork(null)}
                    className="text-brown/50 hover:text-brown"
                  >
                    ✕
                  </button>
                </div>
                
                <img
                  src={selectedArtwork.imageUrl}
                  alt={selectedArtwork.title}
                  className="w-full h-96 object-contain mb-4"
                />
                
                <p className="text-brown mb-4">{selectedArtwork.description}</p>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(selectedArtwork.id)}
                      className={`flex items-center space-x-2 ${
                        selectedArtwork.isLiked ? 'text-coral' : 'text-brown/50'
                      } hover:text-coral`}
                    >
                      <span>❤</span>
                      <span>{selectedArtwork.likes} Likes</span>
                    </button>
                    <button
                      onClick={() => handleFollowArtist(selectedArtwork.artistId)}
                      className={`text-coral hover:text-salmon ${
                        followedArtists.has(selectedArtwork.artistId) ? 'font-semibold' : ''
                      }`}
                    >
                      {followedArtists.has(selectedArtwork.artistId) ? 'Following Artist' : 'Follow Artist'}
                    </button>
                    <Link
                      to={`/artist/${selectedArtwork.artistId}`}
                      className="text-coral hover:text-salmon"
                    >
                      Contact Artist
                    </Link>
                  </div>

                  <div className="border-t border-brown/20 pt-4">
                    <h3 className="font-semibold text-brown mb-2">Comments</h3>
                    <div className="space-y-4">
                      {selectedArtwork.comments.map((comment) => (
                        <div key={comment.id} className="bg-brown/5 p-3 rounded-lg">
                          <div className="flex justify-between items-start">
                            <span className="font-semibold text-brown">{comment.user}</span>
                            <span className="text-sm text-brown/50">
                              {new Date(comment.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-brown/80 mt-1">{comment.text}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4">
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full p-2 border border-brown/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral"
                        rows="2"
                      />
                      <button
                        onClick={() => handleComment(selectedArtwork.id)}
                        className="mt-2 px-4 py-2 bg-coral text-white rounded-lg hover:bg-salmon transition-colors"
                      >
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectorHome; 