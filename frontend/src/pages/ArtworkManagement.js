import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Paper, Button, TextField } from '@mui/material';
import axios from 'axios';

const ArtworkManagement = () => {
  const [artworks, setArtworks] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    imageUrl: '',
  });

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/artworks/my-artworks');
      setArtworks(response.data);
    } catch (error) {
      console.error('Error fetching artworks:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/artworks', formData);
      fetchArtworks();
      setFormData({
        title: '',
        description: '',
        price: '',
        imageUrl: '',
      });
    } catch (error) {
      console.error('Error creating artwork:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Artwork Management
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Add New Artwork
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  margin="normal"
                  multiline
                  rows={4}
                  required
                />
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Image URL"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                  Add Artwork
                </Button>
              </form>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                My Artworks
              </Typography>
              <Grid container spacing={2}>
                {artworks.map((artwork) => (
                  <Grid item xs={12} sm={6} key={artwork.id}>
                    <Paper sx={{ p: 2 }}>
                      <img
                        src={artwork.imageUrl}
                        alt={artwork.title}
                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                      />
                      <Typography variant="h6" sx={{ mt: 1 }}>
                        {artwork.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ${artwork.price}
                      </Typography>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        sx={{ mt: 1 }}
                      >
                        Edit
                      </Button>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ArtworkManagement; 