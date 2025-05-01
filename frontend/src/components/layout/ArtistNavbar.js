import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { authService } from '../../services/api';

const ArtistNavbar = ({ user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logout());
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-brown shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/artist/dashboard" className="text-2xl font-bold text-cream hover:text-coral transition-colors">
              <span className="text-coral">R</span>wandan Art Gallery
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/gallery" className="text-cream hover:text-coral transition-colors">Gallery</Link>
            <Link to="/artists" className="text-cream hover:text-coral transition-colors">Artists</Link>
            <Link to="/artist/artworks" className="text-cream hover:text-coral transition-colors">My Artworks</Link>
            <Link to="/artist/inbox" className="text-cream hover:text-coral transition-colors">Inbox</Link>
            <Link to="/artist/orders" className="text-cream hover:text-coral transition-colors">Orders</Link>
            
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2 text-cream hover:text-coral transition-colors"
              >
                {user?.profilePhoto ? (
                  <img
                    src={user.profilePhoto}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-coral flex items-center justify-center text-cream">
                    {user?.firstName?.[0] || 'A'}
                  </div>
                )}
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  <Link
                    to="/artist/profile"
                    className="block px-4 py-2 text-sm text-brown hover:bg-brown/10"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-brown hover:bg-brown/10"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-cream hover:text-coral transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/gallery"
              className="block px-3 py-2 text-cream hover:text-coral transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Gallery
            </Link>
            <Link
              to="/artists"
              className="block px-3 py-2 text-cream hover:text-coral transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Artists
            </Link>
            <Link
              to="/artist/artworks"
              className="block px-3 py-2 text-cream hover:text-coral transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              My Artworks
            </Link>
            <Link
              to="/artist/inbox"
              className="block px-3 py-2 text-cream hover:text-coral transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Inbox
            </Link>
            <Link
              to="/artist/orders"
              className="block px-3 py-2 text-cream hover:text-coral transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Orders
            </Link>
            <Link
              to="/artist/profile"
              className="block px-3 py-2 text-cream hover:text-coral transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 text-cream hover:text-coral transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default ArtistNavbar; 