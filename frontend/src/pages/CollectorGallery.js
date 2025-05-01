import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Box, Button } from '@mui/material';
import { collectorService } from '../services/api';

const CollectorGallery = () => {
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
      const response = await collectorService.getAllArtworks();
      setArtworks(response);
    } catch (error) {
      console.error('Error fetching artworks:', error);
      setError('Failed to fetch artworks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (artworkId) => {
    try {
      await collectorService.likeArtwork(artworkId);
      fetchArtworks(); // Refresh the list to update likes
    } catch (error) {
      console.error('Error liking artwork:', error);
    }
  };

  const handleDislike = async (artworkId) => {
    try {
      await collectorService.dislikeArtwork(artworkId);
      fetchArtworks(); // Refresh the list to update dislikes
    } catch (error) {
      console.error('Error disliking artwork:', error);
    }
  };

  const handleOrder = async (artworkId) => {
    try {
      await collectorService.orderArtwork(artworkId);
      // Show success message or redirect to orders page
      window.location.href = '/collector/orders';
    } catch (error) {
      console.error('Error ordering artwork:', error);
    }
  };

  return (
    <Container maxWidth="lg" className="py-8">
      <Typography variant="h4" className="text-brown mb-6">
        Gallery
      </Typography>

      {error && (
        <Box className="mb-4">
          <Typography className="text-red-500">{error}</Typography>
        </Box>
      )}

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
                  <Button
                    variant="contained"
                    size="small"
                    className="bg-coral hover:bg-salmon text-cream"
                    onClick={() => handleLike(artwork.id)}
                  >
                    Like ({artwork.likes})
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    className="bg-brown/80 hover:bg-brown text-cream"
                    onClick={() => handleDislike(artwork.id)}
                  >
                    Dislike ({artwork.dislikes})
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <Typography variant="h6" className="text-brown">
                  {artwork.title}
                </Typography>
                <Typography variant="body2" className="text-brown/70 mb-2">
                  By {artwork.artistName}
                </Typography>
                <Typography variant="body2" className="text-brown/70 mb-2">
                  {artwork.description}
                </Typography>
                <Typography variant="h6" className="text-coral">
                  ${artwork.price}
                </Typography>
                <div className="flex space-x-2 mt-4">
                  <Button
                    variant="contained"
                    fullWidth
                    className="bg-coral hover:bg-salmon text-cream"
                    onClick={() => window.location.href = `/artwork/${artwork.id}`}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    className="bg-brown hover:bg-brown/90 text-cream"
                    onClick={() => handleOrder(artwork.id)}
                  >
                    Order Now
                  </Button>
                </div>
              </div>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CollectorGallery; 