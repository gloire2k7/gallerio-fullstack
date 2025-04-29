import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Artists from './pages/Artists';
import About from './pages/About';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ArtistDashboard from './pages/Artist/Dashboard';
import CollectorHome from './pages/Collector/Home';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-cream">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/artist/dashboard" element={<ArtistDashboard />} />
          <Route path="/collector/home" element={<CollectorHome />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 