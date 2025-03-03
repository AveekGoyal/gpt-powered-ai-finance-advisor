import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchGoals as apiFetchGoals, addGoal as apiAddGoal, updateGoal as apiUpdateGoal, deleteGoal as apiDeleteGoal } from '@/lib/api';
import { RootState } from './index';

// Define the Goal interface
interface Goal {
  _id: string;
  type: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  progress: number;
  strategy: string;
}

// Define the GoalState interface
interface GoalState {
  goals: Goal[];
  loading: boolean;
  error: string | null;
}

// Async thunk for fetching goals
export const fetchGoals = createAsyncThunk<Goal[], void, { state: RootState }>(
  'goals/fetchGoals',
  async (_, { getState }) => {
    const { token } = getState().auth;
    return await apiFetchGoals(token as string);
  }
);

// Async thunk for adding a new goal
export const addGoal = createAsyncThunk<Goal, Omit<Goal, '_id'>, { state: RootState }>(
  'goals/addGoal',
  async (goal, { getState }) => {
    const { token } = getState().auth;
    return await apiAddGoal(goal, token as string);
  }
);

// Async thunk for updating an existing goal
export const updateGoal = createAsyncThunk<Goal, { id: string; updatedData: Partial<Goal> }, { state: RootState }>(
  'goals/updateGoal',
  async ({ id, updatedData }, { getState }) => {
    const { token } = getState().auth;
    return await apiUpdateGoal(id, updatedData, token as string);
  }
);

// Async thunk for deleting a goal
export const deleteGoal = createAsyncThunk<string, string, { state: RootState }>(
  'goals/deleteGoal',
  async (id, { getState }) => {
    const { token } = getState().auth;
    return await apiDeleteGoal(id, token as string);
  }
);

// Define the initial state for the goal slice
const initialState: GoalState = {
  goals: [],
  loading: false,
  error: null,
};

// Create the goal slice
const goalSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle pending state for fetchGoals
      .addCase(fetchGoals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle fulfilled state for fetchGoals
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.loading = false;
        state.goals = action.payload;
      })
      // Handle rejected state for fetchGoals
      .addCase(fetchGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred';
      })
      // Handle fulfilled state for addGoal
      .addCase(addGoal.fulfilled, (state, action) => {
        state.goals.push(action.payload);
      })
      // Handle fulfilled state for updateGoal
      .addCase(updateGoal.fulfilled, (state, action) => {
        const index = state.goals.findIndex(goal => goal._id === action.payload._id);
        if (index !== -1) {
          state.goals[index] = action.payload;
        }
      })
      // Handle fulfilled state for deleteGoal
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.goals = state.goals.filter(goal => goal._id !== action.payload);
      });
  },
});

// Export the reducer
export default goalSlice.reducer;