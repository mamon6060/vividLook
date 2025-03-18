
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../components/axios/Axios";



export const fetchPrices = createAsyncThunk(
  "priceRange/fetchPrices",
  async (location) => {
    try {

      console.log("location fetchPrices", location )
      

      let lowestPrice =0;
      let highestPrice = 5000;
      if(location == 'products'){
        lowestPrice = 10
        const productResponse = await api.get(
          "/home-appliance-product/price-range"
        );
        console.log("resp ===========",productResponse )
         lowestPrice =productResponse?.data?.data?.minPrice;
         highestPrice = productResponse?.data?.data?.maxPrice;
      }
      if(location == 'shop'){
        lowestPrice = 10
        const shopResponse = await api.get(
          "/products/price-range"
        );
        console.log("resp ===========",shopResponse )
         lowestPrice =shopResponse?.data?.data?.minPrice;
         highestPrice = shopResponse?.data?.data?.maxPrice;
      }



      return { minPrice: lowestPrice, maxPrice: highestPrice, location:location };
    } catch (error) {
      throw new Error("Failed to fetch price data");
    }
  }
);

const priceRangeSlice = createSlice({
  name: "priceRange",
  initialState: {
    minPrice: 0,
    maxPrice: 0,
    selectedRange: [0, 0],
    status: "idle", 
    error: null,
  },
  reducers: {
    setSelectedRange: (state, action) => {
      state.selectedRange = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrices.pending, (state) => {      
        state.status = "loading";
      })
      .addCase(fetchPrices.fulfilled, (state, action) => {
        state.status = action.payload.location;
        state.minPrice = action.payload.minPrice;
        state.maxPrice = action.payload.maxPrice;
        state.selectedRange = [
          action.payload.minPrice,
          action.payload.maxPrice,
        ];
      })
      .addCase(fetchPrices.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setSelectedRange } = priceRangeSlice.actions;

export default priceRangeSlice.reducer;
