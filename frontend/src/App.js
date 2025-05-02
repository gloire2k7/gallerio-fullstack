import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useSelector } from 'react-redux';

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
import ArtworkDetail from './pages/ArtworkDetail';

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

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

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
          <Route path="/artwork/:id" element={<ArtworkDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Artist Routes */}
          <Route
            path="/artist/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/artist/gallery"
            element={
              <PrivateRoute>
                <ArtistGallery />
              </PrivateRoute>
            }
          />
          <Route
            path="/artist/artworks"
            element={
              <PrivateRoute>
                <ArtworkManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/artist/inbox"
            element={
              <PrivateRoute>
                <Messages />
              </PrivateRoute>
            }
          />
          <Route
            path="/artist/messages"
            element={
              <PrivateRoute>
                <Messages />
              </PrivateRoute>
            }
          />
          <Route
            path="/artist/orders"
            element={
              <PrivateRoute>
                <Orders />
              </PrivateRoute>
            }
          />
          <Route
            path="/artist/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* Collector Routes */}
          <Route
            path="/collector/home"
            element={
              <PrivateRoute>
                <CollectorHome />
              </PrivateRoute>
            }
          />
          <Route
            path="/collector/gallery"
            element={
              <PrivateRoute>
                <CollectorGallery />
              </PrivateRoute>
            }
          />
          <Route
            path="/collector/artists"
            element={
              <PrivateRoute>
                <CollectorArtists />
              </PrivateRoute>
            }
          />
          <Route
            path="/collector/inbox"
            element={
              <PrivateRoute>
                <CollectorMessages />
              </PrivateRoute>
            }
          />
          <Route
            path="/collector/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App; 