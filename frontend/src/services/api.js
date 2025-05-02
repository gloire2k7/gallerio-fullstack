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
            throw error;
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

    logout: () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
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
    }
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
        try {
            const response = await api.get('/messages/collector');
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
    getOrders: () => {
        return api.get('/orders/collector').then(response => response.data);
    }
};

export default api;

export const getArtistArtworks = async (artistId) => {
    try {
        const response = await api.get(`/artworks/artist/${artistId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
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