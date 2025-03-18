import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./utils/Slices/userSlices";
export const store = configureStore({
  reducer: {
    users: userReducer,
  },
});
