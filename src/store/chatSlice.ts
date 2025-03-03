import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './index';

// API endpoint for chat
const API_URL = '/api/chat';

// Define the Message interface
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Define the ChatState interface
interface ChatState {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

// Async thunk for sending a message to the API
export const sendMessage = createAsyncThunk<
  string, 
  { message: string; area: string },
  { state: RootState } >('chat/sendMessage', async ({ message, area }, { getState }) => {
  const { token } = getState().auth;
  const response = await axios.post(
    API_URL,
    { message, area },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data.message;
});

// Async thunk for fetching chat history from the API
export const getChatHistory = createAsyncThunk<Message[], void, { state: RootState }>(
  'chat/getChatHistory',
  async (_, { getState }) => {
    const { token } = getState().auth;
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.chatHistory;
  }
);

// Define the initial state for the chat slice
const initialState: ChatState = {
  messages: [],
  loading: false,
  error: null,
};

// Create the chat slice
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Reset the chat state
    resetChat: (state) => {
      state.messages = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle pending state for sendMessage
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle fulfilled state for sendMessage
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({ role: 'user', content: action.meta.arg.message });
        state.messages.push({ role: 'assistant', content: action.payload });
      })
      // Handle rejected state for sendMessage
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred';
      })
      // Handle fulfilled state for getChatHistory
      .addCase(getChatHistory.fulfilled, (state, action) => {
        state.messages = action.payload;
      });
  },
});

// Export actions and reducer
export const { resetChat } = chatSlice.actions;
export default chatSlice.reducer;