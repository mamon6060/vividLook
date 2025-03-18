import { useState, useEffect } from "react";
import { message } from "antd";
import axiosInstance from "../components/Axios";

const useHomeApplianceSubCategoryActions = () => {
  const [homeApplianceSubCategorys, setHomeApplianceSubCategorys] = useState([]); // Stores all homeApplianceSubCategorys
  const [homeApplianceSubCategory, setHomeApplianceSubCategory] = useState(null); // Stores a single homeApplianceSubCategory
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch All HomeApplianceSubCategorys
  const getAllHomeApplianceSubCategorys = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/home-appliance-subcategory");
      setHomeApplianceSubCategorys(response.data.data.doc);
    } catch (error) {
      setError(error.response?.message || "Failed to get homeApplianceSubCategorys");
      message.error("Failed to get homeApplianceSubCategorys");
    } finally {
      setLoading(false);
    }
  };

  // Fetch a Single HomeApplianceSubCategory by ID
  const getSingleHomeApplianceSubCategory = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/home-appliance-subcategory/${id}`);
      setHomeApplianceSubCategory(response.data.data.doc);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to get homeApplianceSubCategory");
      message.error("Failed to get homeApplianceSubCategory");
    } finally {
      setLoading(false);
    }
  };

  // Create a New HomeApplianceSubCategory
  const createHomeApplianceSubCategory = async (homeApplianceSubCategoryData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/home-appliance-subcategory", homeApplianceSubCategoryData);
      setHomeApplianceSubCategorys((prev) =>
        Array.isArray(prev) ? [...prev, response.data.doc] : [response.data.doc]
      );
      await getAllHomeApplianceSubCategorys();
      message.success("HomeApplianceSubCategory created successfully!");
      return response.data.homeApplianceSubCategory;
    } catch (error) {
      setError(error.response?.message || "Failed to create homeApplianceSubCategory");
      message.error("Failed to create homeApplianceSubCategory");
    } finally {
      setLoading(false);
    }
  };

  // Update an Existing HomeApplianceSubCategory
  const updateHomeApplianceSubCategory = async (id, homeApplianceSubCategoryData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.patch(
        `/home-appliance-subcategory/${id}`,
        homeApplianceSubCategoryData
      );
      setHomeApplianceSubCategorys((prev) =>
        Array.isArray(prev) ? prev.filter((b) => b._id !== id) : []
      ); // Update state
      await getAllHomeApplianceSubCategorys();
      message.success("HomeApplianceSubCategory updated successfully!");
      return response.data.doc;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update homeApplianceSubCategory");
      message.error("Failed to update homeApplianceSubCategory");
    } finally {
      setLoading(false);
    }
  };

  // Delete a HomeApplianceSubCategory
  const deleteHomeApplianceSubCategory = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/home-appliance-subcategory/${id}`);
      setHomeApplianceSubCategorys((prev) => prev.filter((b) => b._id !== id)); // Remove from state
      await getAllHomeApplianceSubCategorys();
      message.success("HomeApplianceSubCategory deleted successfully!");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete homeApplianceSubCategory");
      message.error("Failed to delete homeApplianceSubCategory");
    } finally {
      setLoading(false);
    }
  };

  // Auto-get homeApplianceSubCategorys when hook is used
  useEffect(() => {
    getAllHomeApplianceSubCategorys();
  }, []);

  return {
    homeApplianceSubCategorys,
    homeApplianceSubCategory,
    loading,
    error,
    getAllHomeApplianceSubCategorys,
    getSingleHomeApplianceSubCategory,
    createHomeApplianceSubCategory,
    updateHomeApplianceSubCategory,
    deleteHomeApplianceSubCategory,
  };
};

export default useHomeApplianceSubCategoryActions;
