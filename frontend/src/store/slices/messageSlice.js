import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  currentMessage: null,
  loading: false,
  error: null
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCurrentMessage: (state, action) => {
      state.currentMessage = action.payload;
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

export const { setMessages, setCurrentMessage, setLoading, setError } = messageSlice.actions;
export default messageSlice.reducer; 