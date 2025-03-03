import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the User interface
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

// Define the AuthState interface
interface AuthState {
  user: User | null;
  token: string | null;
}

// Load user data from localStorage
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

// Set initial state with user data from localStorage or null
const initialState: AuthState = loadUserFromStorage();

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set user credentials (login/register)
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
      }
    },
    // Update user's onboarding status
    updateOnboardingStatus: (state, action: PayloadAction<boolean>) => {
      if (state.user) {
        state.user.onboardingCompleted = action.payload;
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(state.user));
        }
      }
    },
    // Log out the user
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

// Export actions and reducer
export const { setCredentials, updateOnboardingStatus, logout } = authSlice.actions;

export default authSlice.reducer;