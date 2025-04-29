import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getArtistArtworks, getArtistMessages } from '../../services/api';

const ArtistDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [artworks, setArtworks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artworksData, messagesData] = await Promise.all([
          getArtistArtworks(user.id),
          getArtistMessages(user.id)
        ]);
        setArtworks(artworksData);
        setMessages(messagesData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.id]);

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stats Overview */}
          <div className="col-span-1 md:col-span-3 bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-brown mb-4">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-coral/10 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-brown">Total Artworks</h3>
                <p className="text-3xl font-bold text-coral">{artworks.length}</p>
              </div>
              <div className="bg-salmon/10 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-brown">Unread Messages</h3>
                <p className="text-3xl font-bold text-salmon">
                  {messages.filter(m => !m.read).length}
                </p>
              </div>
              <div className="bg-brown/10 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-brown">Total Likes</h3>
                <p className="text-3xl font-bold text-brown">
                  {artworks.reduce((sum, artwork) => sum + artwork.likes, 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Messages */}
          <div className="col-span-1 md:col-span-2 bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-brown">Recent Messages</h2>
              <Link to="/artist/messages" className="text-coral hover:text-salmon">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {messages.slice(0, 3).map((message) => (
                <div key={message.id} className={`p-4 rounded-lg ${!message.read ? 'bg-coral/5' : 'bg-brown/5'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-brown">{message.senderName}</h3>
                      <p className="text-sm text-brown/70">{message.subject}</p>
                    </div>
                    <span className="text-xs text-brown/50">{new Date(message.date).toLocaleDateString()}</span>
                  </div>
                  <p className="mt-2 text-brown/80">{message.preview}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="col-span-1 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-brown mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/artist/artworks/new"
                className="block w-full text-center py-2 px-4 bg-coral text-white rounded-lg hover:bg-salmon transition-colors"
              >
                Upload New Artwork
              </Link>
              <Link
                to="/artist/profile"
                className="block w-full text-center py-2 px-4 border border-brown/20 text-brown rounded-lg hover:bg-brown/5 transition-colors"
              >
                Edit Profile
              </Link>
              <Link
                to="/artist/orders"
                className="block w-full text-center py-2 px-4 border border-brown/20 text-brown rounded-lg hover:bg-brown/5 transition-colors"
              >
                View Orders
              </Link>
            </div>
          </div>

          {/* Recent Artworks */}
          <div className="col-span-1 md:col-span-3 bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-brown">Recent Artworks</h2>
              <Link to="/artist/artworks" className="text-coral hover:text-salmon">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {artworks.slice(0, 3).map((artwork) => (
                <div key={artwork.id} className="bg-brown/5 rounded-lg overflow-hidden">
                  <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-brown">{artwork.title}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-brown/70">{artwork.likes} likes</span>
                      <span className="text-sm text-brown/70">{artwork.comments} comments</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistDashboard; 