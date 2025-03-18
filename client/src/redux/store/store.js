import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/auth/authSlices';
import agroCartReducer from '../slices/cart/agroCartSlice';
import priceRangeReducer from '../slices/price/PriceRangeSlice';
import sortReducer from '../slices/optionsort/SortSlice';
import serviceCartReducer from '../slices/cart/serviceCartSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    agroCart: agroCartReducer,
    priceRange: priceRangeReducer,
    sort: sortReducer,
    serviceCart: serviceCartReducer,
  },
});

export default store; // Use default export
