// src/redux/slices/sortSlice.js
import { createSlice } from '@reduxjs/toolkit';

const sortSlice = createSlice({
  name: 'sort',
  initialState: {
    sortOption: 'default', // Default sort option
  },
  reducers: {
    setSortOption(state, action) {
      state.sortOption = action.payload; // Update the sort option
    },
    resetSortOption(state) {
      state.sortOption = 'default'; // Reset to default
    },
  },
});

// Export actions
export const { setSortOption, resetSortOption } = sortSlice.actions;

// Export the reducer
export default sortSlice.reducer;
