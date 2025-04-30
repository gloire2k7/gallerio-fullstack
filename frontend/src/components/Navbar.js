import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-brown/95 backdrop-blur-sm shadow-lg py-3' : 'bg-transparent py-6'
      }`}
    >
      <div className="section-container flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-cream hover:text-coral transition-colors flex items-center space-x-2"
        >
          <span className="text-coral">R</span>
          <span>wandan Art Gallery</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/gallery" className="nav-link">Gallery</Link>
          <Link to="/artists" className="nav-link">Artists</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link
            to="/login"
            className="bg-coral/90 hover:bg-salmon px-6 py-2 rounded-lg text-cream transition-all duration-300 hover:shadow-lg"
          >
            Login
          </Link>
        </div>

        <button className="md:hidden text-cream hover:text-coral transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 