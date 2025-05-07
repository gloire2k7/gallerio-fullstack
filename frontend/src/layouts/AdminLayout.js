import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import Footer from '../components/layout/Footer';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <AdminNavbar />
      <main className="flex-grow pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLayout; 