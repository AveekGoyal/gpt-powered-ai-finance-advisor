import axios from 'axios';

// Set the base API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Function to handle user login
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error('Login error in api.ts:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

// Function to handle user registration
export const register = async (username: string, email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { username, email, password });
    if (response.data && response.data.user && response.data.token) {
      return response.data;
    } else {
      console.error('Unexpected response structure:', response.data);
      throw new Error('Invalid response structure from server');
    }
  } catch (error) {
    console.error('Registration error in api.ts:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Error response:', error.response.data);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    }
    throw error;
  }
};

// Function to complete user onboarding
export const completeOnboarding = async (onboardingData: any, token: string) => {
  try {
    const url = `${API_URL}/onboarding/complete`;
    const response = await axios.put(
      url,
      onboardingData,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'An error occurred during onboarding');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

// Helper function to handle API errors
const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      throw new Error(error.response.data.message || 'An error occurred');
    } else if (error.request) {
      throw new Error('No response received from server. Please check if the server is running.');
    } else {
      throw new Error('Error setting up the request: ' + error.message);
    }
  } else {
    throw new Error('An unexpected error occurred');
  }
};  

// Function to update user's financial information
export const updateFinancialInfo = async (financialData: any, token: string) => {
  try {
    const response = await axios.put(
      `${API_URL}/users/financial-info`,
      financialData,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Function to get financial advice from the API
export const getFinancialAdvice = async (question: string, area: string) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await axios.post(
      `${API_URL}/financial-advice`,
      { question, area },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error in getFinancialAdvice:', error);
    throw error;
  }
};

// Function to fetch user's goals
export const fetchGoals = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/goals`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching goals:', error);
    throw error;
  }
};

// Function to add a new goal
export const addGoal = async (goal: any, token: string) => {
  try {
    const response = await axios.post(`${API_URL}/goals`, goal, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error adding goal:', error);
    throw error;
  }
};

// Function to update an existing goal
export const updateGoal = async (id: string, updatedData: any, token: string) => {
  try {
    const response = await axios.put(`${API_URL}/goals/${id}`, updatedData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating goal:', error);
    throw error;
  }
};

// Function to delete a goal
export const deleteGoal = async (id: string, token: string) => {
  try {
    await axios.delete(`${API_URL}/goals/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return id;
  } catch (error) {
    console.error('Error deleting goal:', error);
    throw error;
  }
};

// Function to send a chat message
export const sendChatMessage = async (message: string, token: string) => {
  try {
    const response = await axios.post(`${API_URL}/chat`, { message }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error sending chat message:', error);
    handleApiError(error);
  }
};

// Function to get chat history
export const getChatHistory = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/chat`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.chatHistory;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    handleApiError(error);
  }
};