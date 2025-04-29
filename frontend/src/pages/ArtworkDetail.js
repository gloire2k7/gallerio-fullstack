import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, Typography, Grid, Paper, Button } from '@mui/material';
import axios from 'axios';

const ArtworkDetail = () => {
  const { id } = useParams();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/artworks/${id}`);
        setArtwork(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load artwork');
        setLoading(false);
      }
    };

    fetchArtwork();
  }, [id]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!artwork) return <Typography>Artwork not found</Typography>;

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                style={{ width: '100%', height: 'auto' }}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              {artwork.title}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              By {artwork.artist.name}
            </Typography>
            <Typography variant="body1" paragraph>
              {artwork.description}
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom>
              ${artwork.price}
            </Typography>
            <Button variant="contained" color="primary" size="large">
              Add to Cart
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ArtworkDetail; 