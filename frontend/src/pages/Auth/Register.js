import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'COLLECTOR',
    location: '',
    bio: '',
    profilePhoto: null,
  });

  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);

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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Create a new object with only the required fields
      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        // Optional fields
        location: formData.location || null,
        bio: formData.bio || null,
        profilePhoto: formData.profilePhoto || null
      };

      const response = await authService.register(registrationData);
      
      if (response.message === "User registered successfully") {
        navigate('/login');
      } else {
        setError(response.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-brown">
            Create Your Account
          </h2>
          <p className="mt-2 text-center text-sm text-brown/70">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-coral hover:text-salmon">
              Sign in
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* Profile Photo Upload */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-brown/20">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-brown/10 flex items-center justify-center">
                    <svg className="w-12 h-12 text-brown/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              <label className="cursor-pointer">
                <span className="text-sm font-medium text-brown hover:text-coral transition-colors">
                  Upload Profile Photo
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="sr-only">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="appearance-none relative block w-full px-3 py-3 border border-brown/20 placeholder-brown/50 text-brown rounded-lg focus:outline-none focus:ring-coral focus:border-coral sm:text-sm"
                  placeholder="First Name"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="sr-only">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="appearance-none relative block w-full px-3 py-3 border border-brown/20 placeholder-brown/50 text-brown rounded-lg focus:outline-none focus:ring-coral focus:border-coral sm:text-sm"
                  placeholder="Last Name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="appearance-none relative block w-full px-3 py-3 border border-brown/20 placeholder-brown/50 text-brown rounded-lg focus:outline-none focus:ring-coral focus:border-coral sm:text-sm"
                placeholder="Email address"
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="sr-only">
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="appearance-none relative block w-full px-3 py-3 border border-brown/20 placeholder-brown/50 text-brown rounded-lg focus:outline-none focus:ring-coral focus:border-coral sm:text-sm"
                placeholder="Location (optional)"
              />
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="sr-only">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="appearance-none relative block w-full px-3 py-3 border border-brown/20 placeholder-brown/50 text-brown rounded-lg focus:outline-none focus:ring-coral focus:border-coral sm:text-sm"
                placeholder="Tell us about yourself (optional)"
                rows="3"
              />
            </div>

            {/* Password Fields */}
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="appearance-none relative block w-full px-3 py-3 border border-brown/20 placeholder-brown/50 text-brown rounded-lg focus:outline-none focus:ring-coral focus:border-coral sm:text-sm"
                placeholder="Password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="appearance-none relative block w-full px-3 py-3 border border-brown/20 placeholder-brown/50 text-brown rounded-lg focus:outline-none focus:ring-coral focus:border-coral sm:text-sm"
                placeholder="Confirm Password"
              />
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-brown">I want to:</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'COLLECTOR' })}
                  className={`py-3 px-4 text-sm font-medium rounded-lg transition-colors ${
                    formData.role === 'COLLECTOR'
                      ? 'bg-coral text-cream'
                      : 'bg-white border border-brown/20 text-brown hover:bg-brown/5'
                  }`}
                >
                  Collect Art
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'ARTIST' })}
                  className={`py-3 px-4 text-sm font-medium rounded-lg transition-colors ${
                    formData.role === 'ARTIST'
                      ? 'bg-coral text-cream'
                      : 'bg-white border border-brown/20 text-brown hover:bg-brown/5'
                  }`}
                >
                  Sell My Art
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-cream bg-coral hover:bg-salmon focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral transition-colors"
            >
              Create Account
            </button>
          </div>
        </form>

        <div className="mt-6">
          <p className="text-center text-xs text-brown/70">
            By signing up, you agree to our{' '}
            <Link to="/terms" className="text-coral hover:text-salmon">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-coral hover:text-salmon">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register; 