import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Box, Button, IconButton } from '@mui/material';
import { artistService } from '../services/api';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const ArtistGallery = () => {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await artistService.getArtworks(); // Using the artist-specific endpoint
      setArtworks(response);
    } catch (error) {
      console.error('Error fetching artworks:', error);
      setError('Failed to fetch artworks. Please try again.');
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (artworkId) => {
    navigate(`/artist/artworks/edit/${artworkId}`);
  };

  const handleDelete = async (artworkId) => {
    if (window.confirm('Are you sure you want to delete this artwork?')) {
      try {
        await artistService.deleteArtwork(artworkId);
        fetchArtworks(); // Refresh the list
      } catch (error) {
        console.error('Error deleting artwork:', error);
        setError('Failed to delete artwork. Please try again.');
      }
    }
  };

  return (
    <Container maxWidth="lg" className="py-8">
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4" className="text-brown">
          My Gallery
        </Typography>
        <Button
          variant="contained"
          className="bg-coral hover:bg-salmon text-cream"
          onClick={() => navigate('/artist/artworks')}
        >
          Manage Artworks
        </Button>
      </Box>

      {error && (
        <Box className="mb-4">
          <Typography className="text-red-500">{error}</Typography>
        </Box>
      )}

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Grid container spacing={4}>
          {artworks.map((artwork) => (
            <Grid item xs={12} sm={6} md={4} key={artwork.id}>
              <Paper className="overflow-hidden bg-cream">
                <div className="relative">
                  <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <IconButton
                      size="small"
                      className="bg-coral hover:bg-salmon text-cream"
                      onClick={() => handleEdit(artwork.id)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      className="bg-brown/80 hover:bg-brown text-cream"
                      onClick={() => handleDelete(artwork.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </div>
                <div className="p-4">
                  <Typography variant="h6" className="text-brown">
                    {artwork.title}
                  </Typography>
                  <Typography variant="body2" className="text-brown/70 mb-2">
                    {artwork.description}
                  </Typography>
                  <Typography variant="h6" className="text-coral">
                    ${artwork.price}
                  </Typography>
                  <Box className="mt-2">
                    <Typography variant="body2" className="text-brown/70">
                      Status: {artwork.status || 'Available'}
                    </Typography>
                    <Typography variant="body2" className="text-brown/70">
                      Views: {artwork.views || 0}
                    </Typography>
                  </Box>
                </div>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ArtistGallery; 