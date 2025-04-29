import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Palette,
  Home,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
    navigate('/');
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: '#8B4513', // brown
        color: '#FFF5E6', // cream
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
            '&:hover': {
              color: '#FF7F50', // coral
            },
            fontFamily: '"Dancing Script", cursive',
            fontWeight: 700,
            fontSize: '2rem',
            letterSpacing: '1px',
          }}
        >
          <Palette 
            sx={{ 
              mr: 1, 
              fontSize: 36,
              color: '#FFFFFF', // white
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            }} 
          />
          <Box
            sx={{
              color: '#FFFFFF', // white
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              '&:hover': {
                color: '#FF7F50', // coral
              },
            }}
          >
            Gallerio
          </Box>
        </Typography>

        {isMobile ? (
          <>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem component={RouterLink} to="/" onClick={handleClose}>
                <Home sx={{ mr: 1 }} /> Home
              </MenuItem>
              <MenuItem component={RouterLink} to="/gallery" onClick={handleClose}>
                Gallery
              </MenuItem>
              <MenuItem component={RouterLink} to="/artists" onClick={handleClose}>
                Artists
              </MenuItem>
              <MenuItem component={RouterLink} to="/about" onClick={handleClose}>
                About
              </MenuItem>
              {isAuthenticated ? (
                <>
                  <MenuItem
                    component={RouterLink}
                    to="/dashboard"
                    onClick={handleClose}
                  >
                    Dashboard
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </>
              ) : (
                <MenuItem
                  component={RouterLink}
                  to="/login"
                  onClick={handleClose}
                >
                  Login
                </MenuItem>
              )}
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              color="inherit"
              component={RouterLink}
              to="/"
              startIcon={<Home />}
              sx={{
                '&:hover': {
                  color: '#FF7F50', // coral
                },
              }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/gallery"
              sx={{
                '&:hover': {
                  color: '#FF7F50', // coral
                },
              }}
            >
              Gallery
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/artists"
              sx={{
                '&:hover': {
                  color: '#FF7F50', // coral
                },
              }}
            >
              Artists
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/about"
              sx={{
                '&:hover': {
                  color: '#FF7F50', // coral
                },
              }}
            >
              About
            </Button>

            {isAuthenticated ? (
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/dashboard"
                  sx={{
                    '&:hover': {
                      color: '#FF7F50', // coral
                    },
                  }}
                >
                  Dashboard
                </Button>
                <IconButton
                  onClick={handleMenu}
                  color="inherit"
                  sx={{
                    '&:hover': {
                      color: '#FF7F50', // coral
                    },
                  }}
                >
                  <Avatar
                    alt={user?.username}
                    src={user?.profilePicture}
                    sx={{ width: 32, height: 32 }}
                  />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem
                    component={RouterLink}
                    to="/profile"
                    onClick={handleClose}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                color="inherit"
                component={RouterLink}
                to="/login"
                sx={{
                  backgroundColor: '#FF7F50', // coral
                  '&:hover': {
                    backgroundColor: '#FA8072', // salmon
                  },
                }}
              >
                Login
              </Button>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 