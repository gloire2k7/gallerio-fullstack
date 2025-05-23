import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(
    (config) => {
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: async (email, password) => {
        try {
            const response = await api.post('/auth/login', {
                email,
                password
            });
            // Store the token
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            return response.data;
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            throw error.response?.data || error.message;
        }
    },

    register: async (userData) => {
        try {
            // If userData is FormData (for file upload)
            if (userData instanceof FormData) {
                const response = await api.post('/auth/register', userData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                return response.data;
            }
            
            // If userData is a regular object
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            console.error('Registration error:', error.response?.data || error.message);
            throw error.response?.data || error.message;
        }
    },

    verifyToken: async (token) => {
        try {
            const response = await api.get('/auth/verify', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.message === 'Token is valid') {
                return response.data;
            }
            throw new Error(response.data.message || 'Token verification failed');
        } catch (error) {
            console.error('Token verification error:', error.response?.data || error.message);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};

// Artist related endpoints
export const artistService = {
    getDashboardStats: async () => {
        try {
            const response = await api.get('/artist/dashboard/stats');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getArtworks: async () => {
        try {
            const response = await api.get('/artworks/my-artworks');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    
    uploadArtwork: async (artworkData) => {
        try {
            const response = await api.post('/artworks', artworkData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    deleteArtwork: async (artworkId) => {
        try {
            const response = await api.delete(`/artworks/${artworkId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Messages endpoints
    getMessages: async () => {
        try {
            const response = await api.get('/messages');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    replyToMessage: async (messageId, content) => {
        try {
            const response = await api.post(`/messages/${messageId}/reply`, { content });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    deleteMessage: async (messageId) => {
        try {
            const response = await api.delete(`/messages/${messageId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Orders endpoints
    getOrders: async () => {
        try {
            const response = await api.get('/orders/artist');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    updateOrderStatus: async (orderId, status) => {
        try {
            const response = await api.patch(`/orders/${orderId}/status`, { status });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    sendMessage: async (recipientId, content) => {
        try {
            const response = await api.post('/messages/send', { recipientId, content });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getConversation: async (userId) => {
        const response = await api.get(`/messages/conversation/${userId}`);
        return response.data;
    },
};

export const collectorService = {
    getAllArtworks: () => {
        return api.get('/artworks').then(response => response.data);
    },
    likeArtwork: (artworkId) => {
        return api.post(`/artworks/${artworkId}/like`).then(response => response.data);
    },
    dislikeArtwork: (artworkId) => {
        return api.post(`/artworks/${artworkId}/dislike`).then(response => response.data);
    },
    orderArtwork: (artworkId) => {
        return api.post(`/orders`, { artworkId }).then(response => response.data);
    },
    getMessages: async () => {
        const response = await api.get('/messages');
        return response.data;
    },
    replyToMessage: async (messageId, content) => {
        try {
            const response = await api.post(`/messages/${messageId}/reply`, { content });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    deleteMessage: async (messageId) => {
        try {
            const response = await api.delete(`/messages/${messageId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getOrders: () => {
        return api.get('/orders/collector').then(response => response.data);
    },
    sendMessage: async (recipientId, content) => {
        try {
            const response = await api.post('/messages/send', { recipientId, content });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getConversation: async (userId) => {
        const response = await api.get(`/messages/conversation/${userId}`);
        return response.data;
    },
};

export const userService = {
    getProfile: async () => {
        try {
            const response = await api.get('/users/profile');
            return response.data;
        } catch (error) {
            console.error('Get profile error:', error.response?.data || error.message);
            throw error;
        }
    },

    updateProfile: async (profileData) => {
        try {
            // If profileData contains a file, use FormData
            if (profileData.profilePhoto instanceof File) {
                const formData = new FormData();
                formData.append('profilePhoto', profileData.profilePhoto);
                formData.append('firstName', profileData.firstName);
                formData.append('lastName', profileData.lastName);
                formData.append('location', profileData.location);
                formData.append('bio', profileData.bio);

                const response = await api.put('/users/profile', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                return response.data;
            }

            const response = await api.put('/users/profile', profileData);
            return response.data;
        } catch (error) {
            console.error('Update profile error:', error.response?.data || error.message);
            throw error;
        }
    },

    changePassword: async (currentPassword, newPassword) => {
        try {
            const response = await api.post('/users/change-password', {
                currentPassword,
                newPassword
            });
            return response.data;
        } catch (error) {
            console.error('Change password error:', error.response?.data || error.message);
            throw error;
        }
    },

    searchUsers: async (query) => {
        try {
            const response = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getCurrentUser: () => {
        return api.get('/users/me');
    },

    getUsersByRole: (role) => {
        const normalizedRole = role.toUpperCase();
        return api.get(`/users/role/${normalizedRole}`);
    }
};

export default api;

export const getArtistArtworks = async (artistId) => {
    try {
        const response = await fetch(`${API_URL}/artworks/user/${artistId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch artist artworks');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching artist artworks:', error);
        throw error;
    }
};

export const getAllArtworks = async () => {
    const response = await axios.get('/api/artworks');
    return response.data;
};

export const likeArtwork = async (artworkId) => {
    const response = await axios.post(`/api/artworks/${artworkId}/like`);
    return response.data;
};

export const commentOnArtwork = async (artworkId, comment) => {
    const response = await axios.post(`/api/artworks/${artworkId}/comments`, { comment });
    return response.data;
};

export const followArtist = async (artistId) => {
    const response = await axios.post(`/api/artists/${artistId}/follow`);
    return response.data;
};

export const searchArtworks = async (query) => {
    const response = await axios.get(`/api/artworks/search?q=${encodeURIComponent(query)}`);
    return response.data;
};

export const artworkService = {
  // Create new artwork
  createArtwork: async (formData) => {
    const response = await api.post('/artworks', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get all artworks
  getAllArtworks: async () => {
    const response = await api.get('/artworks');
    return response.data;
  },

  // Get artworks by user
  getArtworksByUser: async (userId) => {
    const response = await api.get(`/artworks/user/${userId}`);
    return response.data;
  },

  // Delete artwork
  deleteArtwork: async (id) => {
    await api.delete(`/artworks/${id}`);
  },

  // Get a single artwork by id
  getArtwork: async (id) => {
    const response = await api.get(`/artworks/${id}`);
    return response.data;
  },

  createOrder: async (orderData) => {
    const response = await api.post('/api/orders', orderData);
    return response.data;
  },
};

export const getAllArtists = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching artists:', error);
    throw error;
  }
};

export const orderService = {
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  getArtistOrders: async () => {
    const response = await api.get('/orders/artist');
    return response.data;
  },

  getCustomerOrders: async () => {
    const response = await api.get('/orders/customer');
    return response.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response.data;
  }
};

export const adminService = {
  getArtists: async () => {
    const response = await api.get('/admin/users/artists');
    return response.data;
  },

  getCollectors: async () => {
    const response = await api.get('/admin/users/collectors');
    return response.data;
  },

  getAllOrders: async () => {
    const response = await api.get('/admin/orders');
    return response.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await api.put(`/admin/orders/${orderId}/status?status=${status}`);
    return response.data;
  }
};