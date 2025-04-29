import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: '#8B4513', // brown
        color: '#FFF5E6', // cream
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="inherit" gutterBottom>
              Rwandan Art Gallery
            </Typography>
            <Typography variant="body2" color="inherit" sx={{ opacity: 0.8 }}>
              Showcasing the vibrant art scene of Rwanda, connecting artists with
              art lovers and experts worldwide.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="inherit" gutterBottom>
              Quick Links
            </Typography>
            <Box>
              <Link 
                href="/gallery" 
                color="inherit" 
                display="block" 
                sx={{ 
                  '&:hover': { 
                    color: '#FF7F50', // coral
                  } 
                }}
              >
                Gallery
              </Link>
              <Link 
                href="/artists" 
                color="inherit" 
                display="block" 
                sx={{ 
                  '&:hover': { 
                    color: '#FF7F50', // coral
                  } 
                }}
              >
                Artists
              </Link>
              <Link 
                href="/about" 
                color="inherit" 
                display="block" 
                sx={{ 
                  '&:hover': { 
                    color: '#FF7F50', // coral
                  } 
                }}
              >
                About Us
              </Link>
              <Link 
                href="/contact" 
                color="inherit" 
                display="block" 
                sx={{ 
                  '&:hover': { 
                    color: '#FF7F50', // coral
                  } 
                }}
              >
                Contact
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="inherit" gutterBottom>
              Connect With Us
            </Typography>
            <Box>
              <IconButton 
                color="inherit" 
                aria-label="Facebook"
                sx={{ 
                  '&:hover': { 
                    color: '#FF7F50', // coral
                  } 
                }}
              >
                <Facebook />
              </IconButton>
              <IconButton 
                color="inherit" 
                aria-label="Twitter"
                sx={{ 
                  '&:hover': { 
                    color: '#FF7F50', // coral
                  } 
                }}
              >
                <Twitter />
              </IconButton>
              <IconButton 
                color="inherit" 
                aria-label="Instagram"
                sx={{ 
                  '&:hover': { 
                    color: '#FF7F50', // coral
                  } 
                }}
              >
                <Instagram />
              </IconButton>
              <IconButton 
                color="inherit" 
                aria-label="LinkedIn"
                sx={{ 
                  '&:hover': { 
                    color: '#FF7F50', // coral
                  } 
                }}
              >
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        <Box mt={5}>
          <Typography variant="body2" color="inherit" align="center" sx={{ opacity: 0.8 }}>
            {'© '}
            {new Date().getFullYear()}
            {' Rwandan Art Gallery. All rights reserved.'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 