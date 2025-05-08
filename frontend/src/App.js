import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Artists from './pages/Artists';
import About from './pages/About';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ArtworkDetails from './pages/ArtworkDetails';
import ArtistProfile from './pages/ArtistProfile';

// Protected Pages
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import ArtworkManagement from './pages/ArtworkManagement';
import Orders from './pages/Orders';
import ArtistGallery from './pages/ArtistGallery';

// Collector Pages
import CollectorHome from './pages/Collector/Home';
import CollectorMessages from './pages/Collector/Messages';
import CollectorGallery from './pages/Collector/Gallery';
import CollectorArtists from './pages/Collector/Artists';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import CollectorsList from './pages/Admin/CollectorsList';
import OrdersList from './pages/Admin/OrdersList';
import ArtistsList from './pages/Admin/ArtistsList';
import ArtworksList from './pages/Admin/ArtworksList';

// Define your theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// Protected Route component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && user.role !== 'ADMIN') {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/*" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="artists" element={<ArtistsList />} />
              <Route path="collectors" element={<CollectorsList />} />
              <Route path="orders" element={<OrdersList />} />
              <Route path="artworks" element={<ArtworksList />} />
            </Route>

            {/* Main Routes */}
            <Route path="/*" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="artists" element={<Artists />} />
              <Route path="artist/:id" element={<ArtistProfile />} />
              <Route path="about" element={<About />} />
              <Route path="artwork/:id" element={<ArtworkDetails />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />

              {/* Artist Routes */}
              <Route path="artist/dashboard" element={<Dashboard />} />
              <Route path="artist/gallery" element={<ArtistGallery />} />
              <Route path="artist/artworks" element={<ArtworkManagement />} />
              <Route path="artist/inbox" element={<Messages />} />
              <Route path="artist/orders" element={<Orders />} />
              <Route path="artist/profile" element={<Profile />} />

              {/* Collector Routes */}
              <Route path="collector/home" element={<CollectorHome />} />
              <Route path="collector/gallery" element={<CollectorGallery />} />
              <Route path="collector/artists" element={<CollectorArtists />} />
              <Route path="collector/inbox" element={<CollectorMessages />} />
              <Route path="collector/profile" element={<Profile />} />
            </Route>
          </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;