// File: src/store/chatSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sendChatMessage, getChatHistory as apiGetChatHistory } from '@/lib/api';
import { RootState } from './index';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatState {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

export const sendMessage = createAsyncThunk<string, string, { state: RootState }>(
  'chat/sendMessage',
  async (message, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    if (!token) {
      return rejectWithValue('No authentication token found');
    }
    try {
      const response = await sendChatMessage(message, token);
      return response.message;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getChatHistory = createAsyncThunk<Message[], void, { state: RootState }>(
  'chat/getChatHistory',
  async (_, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    if (!token) {
      return rejectWithValue('No authentication token found');
    }
    try {
      return await apiGetChatHistory(token);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const initialState: ChatState = {
  messages: [],
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({ role: 'user', content: action.meta.arg });
        state.messages.push({ role: 'assistant', content: action.payload });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred';
      })
      .addCase(getChatHistory.fulfilled, (state, action) => {
        state.messages = action.payload;
      });
  },
});

export default chatSlice.reducer;