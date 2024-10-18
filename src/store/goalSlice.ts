// File: src/store/goalSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchGoals as apiFetchGoals, addGoal as apiAddGoal, updateGoal as apiUpdateGoal, deleteGoal as apiDeleteGoal } from '@/lib/api';
import { RootState } from './index';

interface Goal {
  _id: string;
  type: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  progress: number;
  strategy: string;
}

interface GoalState {
  goals: Goal[];
  loading: boolean;
  error: string | null;
}

export const fetchGoals = createAsyncThunk<Goal[], void, { state: RootState }>(
  'goals/fetchGoals',
  async (_, { getState }) => {
    const { token } = getState().auth;
    return await apiFetchGoals(token as string);
  }
);

export const addGoal = createAsyncThunk<Goal, Omit<Goal, '_id'>, { state: RootState }>(
  'goals/addGoal',
  async (goal, { getState }) => {
    const { token } = getState().auth;
    return await apiAddGoal(goal, token as string);
  }
);

export const updateGoal = createAsyncThunk<Goal, { id: string; updatedData: Partial<Goal> }, { state: RootState }>(
  'goals/updateGoal',
  async ({ id, updatedData }, { getState }) => {
    const { token } = getState().auth;
    return await apiUpdateGoal(id, updatedData, token as string);
  }
);

export const deleteGoal = createAsyncThunk<string, string, { state: RootState }>(
  'goals/deleteGoal',
  async (id, { getState }) => {
    const { token } = getState().auth;
    return await apiDeleteGoal(id, token as string);
  }
);

const initialState: GoalState = {
  goals: [],
  loading: false,
  error: null,
};

const goalSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.loading = false;
        state.goals = action.payload;
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred';
      })
      .addCase(addGoal.fulfilled, (state, action) => {
        state.goals.push(action.payload);
      })
      .addCase(updateGoal.fulfilled, (state, action) => {
        const index = state.goals.findIndex(goal => goal._id === action.payload._id);
        if (index !== -1) {
          state.goals[index] = action.payload;
        }
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.goals = state.goals.filter(goal => goal._id !== action.payload);
      });
  },
});

export default goalSlice.reducer;