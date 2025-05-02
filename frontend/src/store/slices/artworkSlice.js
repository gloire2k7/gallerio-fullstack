import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const fetchArtworks = createAsyncThunk(
  'artwork/fetchArtworks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/artworks`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchArtworkById = createAsyncThunk(
  'artwork/fetchArtworkById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/artworks/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createArtwork = createAsyncThunk(
  'artwork/createArtwork',
  async (artworkData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/artworks`, artworkData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateArtwork = createAsyncThunk(
  'artwork/updateArtwork',
  async ({ id, artworkData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/artworks/${id}`, artworkData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteArtwork = createAsyncThunk(
  'artwork/deleteArtwork',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/artworks/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  artworks: [],
  currentArtwork: null,
  loading: false,
  error: null,
};

const artworkSlice = createSlice({
  name: 'artwork',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setArtworks: (state, action) => {
      state.artworks = action.payload;
    },
    clearCurrentArtwork: (state) => {
      state.currentArtwork = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArtworks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArtworks.fulfilled, (state, action) => {
        state.loading = false;
        state.artworks = action.payload;
      })
      .addCase(fetchArtworks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch artworks';
      })
      .addCase(fetchArtworkById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArtworkById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentArtwork = action.payload;
      })
      .addCase(fetchArtworkById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch artwork';
      })
      .addCase(createArtwork.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createArtwork.fulfilled, (state, action) => {
        state.loading = false;
        state.artworks.push(action.payload);
      })
      .addCase(createArtwork.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create artwork';
      })
      .addCase(updateArtwork.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateArtwork.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.artworks.findIndex(
          (artwork) => artwork.id === action.payload.id
        );
        if (index !== -1) {
          state.artworks[index] = action.payload;
        }
        state.currentArtwork = action.payload;
      })
      .addCase(updateArtwork.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update artwork';
      })
      .addCase(deleteArtwork.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteArtwork.fulfilled, (state, action) => {
        state.loading = false;
        state.artworks = state.artworks.filter(
          (artwork) => artwork.id !== action.payload
        );
      })
      .addCase(deleteArtwork.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete artwork';
      });
  },
});

export const {
  setLoading,
  setError,
  setArtworks,
  clearCurrentArtwork,
  clearError
} = artworkSlice.actions;

export default artworkSlice.reducer; 