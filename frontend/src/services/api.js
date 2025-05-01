import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Add a response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', {
                email: credentials.email,
                password: credentials.password
            });
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

    logout: () => {
        // Clear any session data if needed
    }
};

// Artist related endpoints
export const artistService = {
    getArtworks: async (artistId) => {
        try {
            const response = await api.get(`/artworks/artist/${artistId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    
    uploadArtwork: async (artworkData) => {
        try {
            const response = await api.post('/artworks', artworkData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
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