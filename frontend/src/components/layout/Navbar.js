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
  ArtTrack,
  ShoppingCart,
  Chat,
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
    <AppBar position="static">
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
          }}
        >
          <ArtTrack sx={{ mr: 1 }} />
          Rwandan Art Gallery
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
              <MenuItem component={RouterLink} to="/gallery" onClick={handleClose}>
                Gallery
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
                  <MenuItem
                    component={RouterLink}
                    to="/messages"
                    onClick={handleClose}
                  >
                    Messages
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </>
              ) : (
                <>
                  <MenuItem
                    component={RouterLink}
                    to="/login"
                    onClick={handleClose}
                  >
                    Login
                  </MenuItem>
                  <MenuItem
                    component={RouterLink}
                    to="/register"
                    onClick={handleClose}
                  >
                    Register
                  </MenuItem>
                </>
              )}
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              color="inherit"
              component={RouterLink}
              to="/gallery"
              startIcon={<ArtTrack />}
            >
              Gallery
            </Button>

            {isAuthenticated ? (
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/dashboard"
                  startIcon={<AccountCircle />}
                >
                  Dashboard
                </Button>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/messages"
                  startIcon={<Chat />}
                >
                  Messages
                </Button>
                <IconButton
                  onClick={handleMenu}
                  color="inherit"
                  sx={{ ml: 2 }}
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
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/login"
                >
                  Login
                </Button>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/register"
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 