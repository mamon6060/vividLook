// src/components/SortOption.js
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSortOption } from "../../redux/slices/optionsort/SortSlice";

const SortOption = () => {
  const dispatch = useDispatch();
  const sortOption = useSelector((state) => state.sort.sortOption); // Get current sort option from state

  const handleChange = (event) => {
    dispatch(setSortOption(event.target.value)); // Dispatch action to set sort option
  };

  return (
    <div>
      <select
        className="px-1 md:px-4 py-1.5 md:py-2.5 text-gray-700 bg-white border rounded-3xl w-40 md:w-60 lg:w-80"
        value={sortOption} // Set the value based on the Redux state
        onChange={handleChange} // Handle change
      >
        <option value="default">Default</option>
        <option value="lowToHigh">Price: Low to High</option>
        <option value="highToLow">Price: High to Low</option>
        <option value="mostViewed">Most Viewed Products</option>
        <option value="bestSelling">Best Selling Products</option>
      </select>
    </div>
  );
};

export default SortOption;
