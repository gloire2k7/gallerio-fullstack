import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Container, Paper, Typography, TextField, Button, Grid, Avatar, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { userService } from '../services/api';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    location: '',
    bio: '',
    profilePhoto: '',
  });
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await userService.getProfile();
      setProfileData(data);
      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        location: data.location || '',
        bio: data.bio || '',
        profilePhoto: data.profilePhoto || '',
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to load profile');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePhoto: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await userService.updateProfile(formData);
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    try {
      await userService.changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordDialog(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" gutterBottom>
              Profile
            </Typography>
            <IconButton 
              onClick={() => setIsEditing(!isEditing)}
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </Box>

          {error && (
            <Typography color="error" gutterBottom>
              {error}
            </Typography>
          )}

          {!isEditing ? (
            <Grid container spacing={3}>
              <Grid item xs={12} display="flex" justifyContent="center">
                <Avatar
                  src={profileData?.profilePhoto}
                  sx={{ width: 120, height: 120 }}
                >
                  {profileData?.firstName?.[0]}
                </Avatar>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" color="textSecondary">
                  First Name
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {profileData?.firstName}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" color="textSecondary">
                  Last Name
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {profileData?.lastName}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" color="textSecondary">
                  Email
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {profileData?.email}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" color="textSecondary">
                  Location
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {profileData?.location || 'Not specified'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" color="textSecondary">
                  Bio
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {profileData?.bio || 'No bio provided'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setPasswordDialog(true)}
                  className="mt-4"
                >
                  Change Password
                </Button>
              </Grid>
            </Grid>
          ) : (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} display="flex" justifyContent="center" flexDirection="column" alignItems="center">
                  <Avatar
                    src={previewUrl || profileData?.profilePhoto}
                    sx={{ width: 120, height: 120, mb: 2 }}
                  >
                    {profileData?.firstName?.[0]}
                  </Avatar>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="profile-photo-input"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="profile-photo-input">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<PhotoCamera />}
                    >
                      Upload Photo
                    </Button>
                  </label>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Bio"
                    name="bio"
                    multiline
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    className="bg-coral hover:bg-salmon"
                  >
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      setPreviewUrl(null);
                    }}
                    variant="outlined"
                    color="secondary"
                    sx={{ ml: 2 }}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Paper>
      </Box>

      {/* Password Change Dialog */}
      <Dialog open={passwordDialog} onClose={() => setPasswordDialog(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <form onSubmit={handlePasswordSubmit}>
            {passwordError && (
              <Typography color="error" gutterBottom>
                {passwordError}
              </Typography>
            )}
            <TextField
              fullWidth
              margin="normal"
              label="Current Password"
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="New Password"
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handlePasswordSubmit} color="primary" variant="contained">
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile; 