import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './index';

const API_URL = '/api/chat';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatState {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

export const sendMessage = createAsyncThunk<
  string,
  { message: string; area: string },
  { state: RootState }
>('chat/sendMessage', async ({ message, area }, { getState }) => {
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

const initialState: ChatState = {
  messages: [],
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    resetChat: (state) => {
      state.messages = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({ role: 'user', content: action.meta.arg.message });
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

export const { resetChat } = chatSlice.actions;
export default chatSlice.reducer;