import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Paper, Button, TextField, Select, MenuItem, FormControl, InputLabel, Alert, IconButton } from '@mui/material';
import { artworkService } from '../services/api';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const categories = [
  'Paintings',
  'Sculptures',
  'Photography',
  'Digital Art',
  'Mixed Media',
  'Textiles',
  'Ceramics',
  'Other'
];

const ArtworkManagement = () => {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    status: '',
    image: null
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get the current user's ID from localStorage or your auth context
  const user = JSON.parse(localStorage.getItem('user'));
  const currentUserId = user?.id;

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      setError('');
      const response = await artworkService.getArtworksByUser(currentUserId);
      setArtworks(response);
    } catch (error) {
      console.error('Error fetching artworks:', error);
      setError('Failed to fetch artworks. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('userId', currentUserId);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      await artworkService.createArtwork(formDataToSend);
      await fetchArtworks();
      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        status: '',
        image: null
      });
      setPreviewUrl(null);
    } catch (error) {
      console.error('Error creating artwork:', error);
      setError(error.response?.data?.message || 'Failed to create artwork. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this artwork?')) {
      try {
        await artworkService.deleteArtwork(id);
        await fetchArtworks();
      } catch (error) {
        console.error('Error deleting artwork:', error);
        setError('Failed to delete artwork. Please try again.');
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom className="text-brown">
          Artwork Management
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }} className="bg-cream">
              <Typography variant="h6" gutterBottom className="text-brown">
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
                  className="text-brown"
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
                  className="text-brown"
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
                  className="text-brown"
                />
                <FormControl fullWidth margin="normal" required>
                  <InputLabel className="text-brown">Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    label="Category"
                    className="text-brown"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category} className="text-brown">
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal" required>
                  <InputLabel className="text-brown">Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    label="Status"
                    className="text-brown"
                  >
                    <MenuItem value="AVAILABLE" className="text-brown">AVAILABLE</MenuItem>
                    <MenuItem value="UNAVAILABLE" className="text-brown">UNAVAILABLE</MenuItem>
                  </Select>
                </FormControl>

                <div className="mt-4 mb-4">
                  <label className="block text-brown mb-2">Artwork Image</label>
                  <div className="relative w-full h-48 border-2 border-brown/20 rounded-lg overflow-hidden">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-brown/10 flex items-center justify-center">
                        <svg className="w-12 h-12 text-brown/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="mt-2 inline-block px-2 py-2 rounded-lg border-2 border-coral text-coral cursor-pointer hover:bg-coral hover:text-cream transition-colors"
                  >
                    Choose Image
                  </label>
                </div>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  className="w-full bg-coral hover:bg-salmon text-cream"
                  sx={{ mt: 2 }}
                >
                  {loading ? 'Adding...' : 'Add Artwork'}
                </Button>
              </form>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }} className="bg-cream">
              <Typography variant="h6" gutterBottom className="text-brown">
                My Artworks
              </Typography>
              <Grid container spacing={2}>
                {artworks.map((artwork) => (
                  <Grid item xs={12} sm={6} key={artwork.id}>
                    <Paper sx={{ p: 2 }} className="bg-white relative">
                      <IconButton
                        className="absolute top-2 right-2 text-coral hover:text-salmon"
                        onClick={() => handleDelete(artwork.id)}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <img
                        src={artwork.imageUrl ? (artwork.imageUrl.startsWith('http') ? artwork.imageUrl : `http://localhost:8080${artwork.imageUrl}`) : ''}
                        alt={artwork.title}
                        style={{ width: '100%', height: '200px', objectFit: 'cover', marginTop: '16px' }}
                        className="rounded-lg"
                      />
                      <Typography variant="h6" sx={{ mt: 1 }} className="text-brown">
                        {artwork.title}
                      </Typography>
                      <Typography variant="body2" className="text-brown/70">
                        ${artwork.price}
                      </Typography>
                      <Typography variant="body2" className="text-brown/70">
                        {artwork.category}
                      </Typography>
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
