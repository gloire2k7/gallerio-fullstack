import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  artworks: [],
  currentArtwork: null,
  loading: false,
  error: null
};

const artworkSlice = createSlice({
  name: 'artwork',
  initialState,
  reducers: {
    setArtworks: (state, action) => {
      state.artworks = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCurrentArtwork: (state, action) => {
      state.currentArtwork = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

export const { setArtworks, setCurrentArtwork, setLoading, setError } = artworkSlice.actions;
export default artworkSlice.reducer; 