import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFinancialAdvice } from '@/lib/api';
import { RootState } from './index';

interface FinancialAdviceState {
  advice: string | null;
  loading: boolean;
  error: string | null;
}

export const fetchFinancialAdvice = createAsyncThunk<
  string,
  { question: string; area: string },
  { state: RootState; rejectValue: string }
>(
  'financialAdvice/fetchAdvice',
  async ({ question, area }, { rejectWithValue }) => {
    try {
      const response = await getFinancialAdvice(question, area);
      return response.advice;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'An error occurred while fetching advice');
    }
  }
);

const initialState: FinancialAdviceState = {
  advice: null,
  loading: false,
  error: null,
};

const financialAdviceSlice = createSlice({
  name: 'financialAdvice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFinancialAdvice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFinancialAdvice.fulfilled, (state, action) => {
        state.loading = false;
        state.advice = action.payload;
      })
      .addCase(fetchFinancialAdvice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred';
      });
  },
});

export const selectAdvice = (state: RootState) => state.financialAdvice;

export default financialAdviceSlice.reducer;