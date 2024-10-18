import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import financialAdviceReducer from './financialAdviceSlice';
import goalReducer from './goalSlice';
import chatReducer from './chatSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    financialAdvice: financialAdviceReducer,
    goals: goalReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;