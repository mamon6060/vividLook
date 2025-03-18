import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const loadCartFromLocalStorage = () => {
  const cart = localStorage.getItem("serviceCart");
  return cart ? JSON.parse(cart) : [];
};

const saveCartToLocalStorage = (cart) => {
  localStorage.setItem("serviceCart", JSON.stringify(cart));
};

const serviceCartSlice = createSlice({
  name: "serviceCart",
  initialState: loadCartFromLocalStorage(),
  reducers: {
    addToServiceCart: (state, action) => {
      const userData = JSON.parse(localStorage.getItem("user"));

      const existingItem = state.find(
        (item) =>
          item._id === action.payload._id &&
          (item.userId == userData?.user?._id || null)
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
        toast.info(
          `${existingItem.title} quantity increased to ${existingItem.quantity}`,
          { autoClose: 500 }
        );
      } else {
        state.push({
          ...action.payload,
          quantity: action.payload.quantity,
          userId: userData?.user?._id || null,
        });
        toast.success(`Added to cart`, {
          autoClose: 500,
        });
      }
      saveCartToLocalStorage(state);
    },
    deleteFromServiceCart: (state, action) => {
      const userData = JSON.parse(localStorage.getItem("user"));

      const newState2 = state.filter((item) => item._id !== action.payload);

      let newState;
      if (userData?.user?._id) {
        newState = state.filter(
          (item) =>
            item._id !== action.payload ||
            item.userId !== userData?.user?._id ||
            null
        );
      } else {
        newState = state.filter(
          (item) => item._id !== action.payload || item.userId !== null
        );
      }

      const deletedItem = state.find((item) => item._id === action.payload);
      if (deletedItem) {
        toast.error(`${deletedItem.title} removed from cart`, {
          autoClose: 500,
        });
      }
      saveCartToLocalStorage(newState);
      return newState;
    },
    resetServiceCart: (state) => {
      const userData = JSON.parse(localStorage.getItem("user"));
      const newState = state.filter(
        (item) => item.userId !== (userData?.user?._id || null)
      );
      toast.warn("Cart reset", { autoClose: 500 });
      saveCartToLocalStorage(newState);
      return newState;
    },
    updateQuantity: (state, action) => {
      const userData = JSON.parse(localStorage.getItem("user"));
      const existingItem = state.find(
        (item) =>
          item._id === action.payload._id &&
          item.userId === (userData?.user?._id || null)
      );
      if (existingItem) {
        existingItem.quantity = existingItem.quantity + action.payload.quantity ;
        toast.info(
          `Quantity updated to ${existingItem.quantity}`,
          { autoClose: 500 }
        );
        saveCartToLocalStorage(state);
      } else {
        console.warn("Item not found in cart to update quantity.");
      }
    },
    decreaseQuantity: (state, action) => {
      const userData = JSON.parse(localStorage.getItem("user"));
      const existingItem = state.find((item) => item._id === action.payload);
      if (existingItem && existingItem.quantity > 1) {
        existingItem.quantity -= 1;
        toast.info(
          `Quantity decreased to ${existingItem.quantity}`,
          { autoClose: 500 }
        );
        saveCartToLocalStorage(state);
      }
    },
  },
});

export const {
  addToServiceCart,
  deleteFromServiceCart,
  resetServiceCart,
  updateQuantity,
  decreaseQuantity,
} = serviceCartSlice.actions;
export default serviceCartSlice.reducer;
