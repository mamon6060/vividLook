import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify'; // Import toast from react-toastify

const loadUserFromLocalStorage = () => {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

const initialState = loadUserFromLocalStorage() || {
  token: null,
  user: null,
};

const authSlices = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;

      localStorage.setItem('user', JSON.stringify({ token, user }));

      // Show success toast notification
      toast.success('User logged in successfully!');
    },
    clearUser: (state) => {
      state.token = null;
      state.user = null;

      localStorage.removeItem('user');

      // Show success toast notification
      toast.info('User logged out successfully!');
    },
  },
});

export const { setUser, clearUser } = authSlices.actions;
export default authSlices.reducer;
