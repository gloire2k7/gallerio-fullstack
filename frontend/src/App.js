import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Layout Components
import NavbarSelector from './components/layout/NavbarSelector';
import Footer from './components/layout/Footer';

// Public Pages
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Artists from './pages/Artists';
import About from './pages/About';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ArtworkDetails from './pages/ArtworkDetails';

// Protected Pages
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import ArtworkManagement from './pages/ArtworkManagement';
import Orders from './pages/Orders';
import ArtistGallery from './pages/ArtistGallery';
import CollectorHome from './pages/Collector/Home';
import CollectorMessages from './pages/Collector/Messages';
import CollectorGallery from './pages/Collector/Gallery';
import CollectorArtists from './pages/Collector/Artists';

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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <NavbarSelector />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/about" element={<About />} />
          <Route path="/artwork/:id" element={<ArtworkDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Artist Routes */}
          <Route path="/artist/dashboard" element={<Dashboard />} />
          <Route path="/artist/gallery" element={<ArtistGallery />} />
          <Route path="/artist/artworks" element={<ArtworkManagement />} />
          <Route path="/artist/inbox" element={<Messages />} />
          <Route path="/artist/messages" element={<Messages />} />
          <Route path="/artist/orders" element={<Orders />} />
          <Route path="/artist/profile" element={<Profile />} />

          {/* Collector Routes */}
          <Route path="/collector/home" element={<CollectorHome />} />
          <Route path="/collector/gallery" element={<CollectorGallery />} />
          <Route path="/collector/artists" element={<CollectorArtists />} />
          <Route path="/collector/inbox" element={<CollectorMessages />} />
          <Route path="/collector/profile" element={<Profile />} />
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App; 