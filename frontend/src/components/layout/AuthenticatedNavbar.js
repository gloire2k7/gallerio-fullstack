import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { FaUser, FaSignOutAlt, FaInbox, FaPalette, FaUsers, FaInfoCircle } from 'react-icons/fa';

const AuthenticatedNavbar = ({ userType }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const navItems = userType === 'artist' ? [
    { to: '/gallery', label: 'Gallery', icon: <FaPalette /> },
    { to: '/artist/artworks', label: 'Artworks', icon: <FaPalette /> },
    { to: '/artists', label: 'Artists', icon: <FaUsers /> },
    { to: '/inbox', label: 'Inbox', icon: <FaInbox /> },
  ] : [
    { to: '/gallery', label: 'Gallery', icon: <FaPalette /> },
    { to: '/artists', label: 'Artists', icon: <FaUsers /> },
    { to: '/about', label: 'About', icon: <FaInfoCircle /> },
    { to: '/inbox', label: 'Inbox', icon: <FaInbox /> },
  ];

  return (
    <nav className="fixed w-full z-50 bg-brown/95 backdrop-blur-sm shadow-lg py-3">
      <div className="section-container flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-cream hover:text-coral transition-colors flex items-center space-x-2"
        >
          <span className="text-coral">R</span>
          <span>wandan Art Gallery</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-cream hover:text-coral transition-colors flex items-center space-x-2"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
          
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-2 text-cream hover:text-coral transition-colors"
            >
              <FaUser />
              <span>{user?.username}</span>
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-brown hover:bg-coral/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-brown hover:bg-coral/10 flex items-center space-x-2"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          className="md:hidden text-cream hover:text-coral transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-brown/95 backdrop-blur-sm">
          <div className="section-container py-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block text-cream hover:text-coral transition-colors flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
            <Link
              to="/profile"
              className="block text-cream hover:text-coral transition-colors flex items-center space-x-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaUser />
              <span>Profile</span>
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left text-cream hover:text-coral transition-colors flex items-center space-x-2"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AuthenticatedNavbar; 