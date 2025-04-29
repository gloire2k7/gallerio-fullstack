import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
});

export const registerUser = async (formData) => {
    try {
        const response = await api.post('/auth/register', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const loginUser = async (credentials) => {
    try {
        console.log("Attempting login with credentials:", credentials);
        const response = await api.post('/auth/login', {
            email: credentials.email,
            password: credentials.password
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        console.log("Login response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Login error:", error);
        console.error("Request config:", error.config);
        console.error("Response data:", error.response?.data);
        console.error("Response status:", error.response?.status);
        console.error("Response headers:", error.response?.headers);
        throw error.response?.data || error.message;
    }
};

export const getArtistArtworks = async (artistId) => {
    try {
        const response = await api.get(`/artworks/artist/${artistId}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getArtistMessages = async (artistId) => {
    try {
        const response = await api.get(`/messages/artist/${artistId}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getAllArtworks = async () => {
    try {
        const response = await api.get('/artworks', {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const likeArtwork = async (artworkId) => {
    try {
        const response = await api.post(`/artworks/${artworkId}/like`, {}, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const commentOnArtwork = async (artworkId, comment) => {
    try {
        const response = await api.post(`/artworks/${artworkId}/comment`, { text: comment }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const followArtist = async (artistId) => {
    try {
        const response = await api.post(`/artists/${artistId}/follow`, {}, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const searchArtworks = async (query) => {
    try {
        const response = await api.get('/artworks/search', {
            params: { q: query },
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};