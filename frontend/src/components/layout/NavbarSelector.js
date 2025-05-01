import React from 'react';
import { useLocation } from 'react-router-dom';
import GuestNavbar from './GuestNavbar';
import ArtistNavbar from './ArtistNavbar';
import CollectorNavbar from './CollectorNavbar';

const NavbarSelector = () => {
  const location = useLocation();
  const path = location.pathname;

  // Artist routes
  if (path.startsWith('/artist/')) {
    return <ArtistNavbar />;
  }

  // Collector routes
  if (path.startsWith('/collector/')) {
    return <CollectorNavbar />;
  }

  // Guest routes (home, gallery, artists, etc.)
  return <GuestNavbar />;
};

export default NavbarSelector; 