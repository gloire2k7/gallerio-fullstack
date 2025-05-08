import React from 'react';
import { Outlet } from 'react-router-dom';
import NavbarSelector from '../components/layout/NavbarSelector';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-cream">
      <NavbarSelector />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout; 