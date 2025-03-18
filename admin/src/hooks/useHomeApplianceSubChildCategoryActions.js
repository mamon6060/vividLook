import { useState, useEffect } from "react";
import { message } from "antd";
import axiosInstance from "../components/Axios";

const useHomeApplianceSubChildCategoryActions = () => {
  const [homeApplianceSubChildCategorys, setHomeApplianceSubChildCategorys] = useState([]); // Stores all homeApplianceSubChildCategorys
  const [homeApplianceSubChildCategory, setHomeApplianceSubChildCategory] = useState(null); // Stores a single homeApplianceSubChildCategory
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch All HomeApplianceSubChildCategorys
  const getAllHomeApplianceSubChildCategorys = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/home-appliance-subchildcategory");
      setHomeApplianceSubChildCategorys(response.data.data.doc);
    } catch (error) {
      setError(error.response?.message || "Failed to get homeApplianceSubChildCategorys");
      message.error("Failed to get homeApplianceSubChildCategorys");
    } finally {
      setLoading(false);
    }
  };

  // Fetch a Single HomeApplianceSubChildCategory by ID
  const getSingleHomeApplianceSubChildCategory = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/home-appliance-subchildcategory/${id}`);
      setHomeApplianceSubChildCategory(response.data.data.doc);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to get homeApplianceSubChildCategory");
      message.error("Failed to get homeApplianceSubChildCategory");
    } finally {
      setLoading(false);
    }
  };

  // Create a New HomeApplianceSubChildCategory
  const createHomeApplianceSubChildCategory = async (homeApplianceSubChildCategoryData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/home-appliance-subchildcategory", homeApplianceSubChildCategoryData);
      setHomeApplianceSubChildCategorys((prev) =>
        Array.isArray(prev) ? [...prev, response.data.doc] : [response.data.doc]
      );
      await getAllHomeApplianceSubChildCategorys();
      message.success("HomeApplianceSubChildCategory created successfully!");
      return response.data.homeApplianceSubChildCategory;
    } catch (error) {
      setError(error.response?.message || "Failed to create homeApplianceSubChildCategory");
      message.error("Failed to create homeApplianceSubChildCategory");
    } finally {
      setLoading(false);
    }
  };

  // Update an Existing HomeApplianceSubChildCategory
  const updateHomeApplianceSubChildCategory = async (id, homeApplianceSubChildCategoryData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.patch(
        `/home-appliance-subchildcategory/${id}`,
        homeApplianceSubChildCategoryData
      );
      setHomeApplianceSubChildCategorys((prev) =>
        Array.isArray(prev) ? prev.filter((b) => b._id !== id) : []
      ); // Update state
      await getAllHomeApplianceSubChildCategorys();
      message.success("HomeApplianceSubChildCategory updated successfully!");
      return response.data.doc;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update homeApplianceSubChildCategory");
      message.error("Failed to update homeApplianceSubChildCategory");
    } finally {
      setLoading(false);
    }
  };

  // Delete a HomeApplianceSubChildCategory
  const deleteHomeApplianceSubChildCategory = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/home-appliance-subchildcategory/${id}`);
      setHomeApplianceSubChildCategorys((prev) => prev.filter((b) => b._id !== id)); // Remove from state
      await getAllHomeApplianceSubChildCategorys();
      message.success("HomeApplianceSubChildCategory deleted successfully!");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete homeApplianceSubChildCategory");
      message.error("Failed to delete homeApplianceSubChildCategory");
    } finally {
      setLoading(false);
    }
  };

  // Auto-get homeApplianceSubChildCategorys when hook is used
  useEffect(() => {
    getAllHomeApplianceSubChildCategorys();
  }, []);

  return {
    homeApplianceSubChildCategorys,
    homeApplianceSubChildCategory,
    loading,
    error,
    getAllHomeApplianceSubChildCategorys,
    getSingleHomeApplianceSubChildCategory,
    createHomeApplianceSubChildCategory,
    updateHomeApplianceSubChildCategory,
    deleteHomeApplianceSubChildCategory,
  };
};

export default useHomeApplianceSubChildCategoryActions;
