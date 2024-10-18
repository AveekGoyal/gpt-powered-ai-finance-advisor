import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  username: string;
  email: string;
  onboardingCompleted: boolean;
  annualIncome?: number;
  currentSavings?: number;
  monthlyExpenses?: Record<string, number>;
  financialGoals?: string[];
  riskTolerance?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

const loadUserFromStorage = (): AuthState => {
  if (typeof window !== 'undefined') {
    try {
      const serializedUser = localStorage.getItem('user');
      const serializedToken = localStorage.getItem('token');
      if (serializedUser && serializedToken) {
        return {
          user: JSON.parse(serializedUser),
          token: serializedToken
        };
      }
    } catch (err) {
      console.error('Error loading user from storage:', err);
    }
  }
  return { user: null, token: null };
};

const initialState: AuthState = loadUserFromStorage();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
      }
    },
    updateOnboardingStatus: (state, action: PayloadAction<boolean>) => {
      if (state.user) {
        state.user.onboardingCompleted = action.payload;
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(state.user));
        }
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    },
  },
});

export const { setCredentials, updateOnboardingStatus, logout } = authSlice.actions;

export default authSlice.reducer;