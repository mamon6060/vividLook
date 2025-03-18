import { useState, useEffect } from "react";
import { message } from "antd";
import axiosInstance from "../components/Axios";

const useHomeApplianceCategoryActions = () => {
  const [homeApplianceCategorys, setHomeApplianceCategorys] = useState([]); // Stores all homeApplianceCategorys
  const [
    homeApplianceProductsByCategorys,
    setHomeApplianceProductsByCategorys,
  ] = useState([]); // Stores all homeApplianceCategorys
  const [homeApplianceCategory, setHomeApplianceCategory] = useState(null); // Stores a single homeApplianceCategory
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch All HomeApplianceCategorys
  const getAllHomeApplianceCategorys = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/home-appliance-category");
      setHomeApplianceCategorys(response.data.data.doc);
    } catch (error) {
      setError(
        error.response?.message || "Failed to get homeApplianceCategorys"
      );
      message.error("Failed to get homeApplianceCategorys");
    } finally {
      setLoading(false);
    }
  };

  const getAllHomeApplianceProductsByCategorys = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/home-appliance-hierarchy");
      setHomeApplianceProductsByCategorys(response.data.data);
    } catch (error) {
      setError(
        error.response?.message || "Failed to get homeApplianceCategorys"
      );
      message.error("Failed to get homeApplianceCategorys");
    } finally {
      setLoading(false);
    }
  };

  // Fetch a Single HomeApplianceCategory by ID
  const getSingleHomeApplianceCategory = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(
        `/home-appliance-category/${id}`
      );
      setHomeApplianceCategory(response.data.data.doc);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to get homeApplianceCategory"
      );
      message.error("Failed to get homeApplianceCategory");
    } finally {
      setLoading(false);
    }
  };

  // Create a New HomeApplianceCategory
  const createHomeApplianceCategory = async (homeApplianceCategoryData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post(
        "/home-appliance-category",
        homeApplianceCategoryData
      );
      setHomeApplianceCategorys((prev) =>
        Array.isArray(prev) ? [...prev, response.data.doc] : [response.data.doc]
      );
      await getAllHomeApplianceCategorys();
      message.success("HomeApplianceCategory created successfully!");
      return response.data.homeApplianceCategory;
    } catch (error) {
      setError(
        error.response?.message || "Failed to create homeApplianceCategory"
      );
      message.error("Failed to create homeApplianceCategory");
    } finally {
      setLoading(false);
    }
  };

  // Update an Existing HomeApplianceCategory
  const updateHomeApplianceCategory = async (id, homeApplianceCategoryData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.patch(
        `/home-appliance-category/${id}`,
        homeApplianceCategoryData
      );
      setHomeApplianceCategorys((prev) =>
        Array.isArray(prev) ? prev.filter((b) => b._id !== id) : []
      ); // Update state
      await getAllHomeApplianceCategorys();
      message.success("HomeApplianceCategory updated successfully!");
      return response.data.doc;
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update homeApplianceCategory"
      );
      message.error("Failed to update homeApplianceCategory");
    } finally {
      setLoading(false);
    }
  };

  // Delete a HomeApplianceCategory
  const deleteHomeApplianceCategory = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/home-appliance-category/${id}`);
      setHomeApplianceCategorys((prev) => prev.filter((b) => b._id !== id)); // Remove from state
      await getAllHomeApplianceCategorys();
      message.success("HomeApplianceCategory deleted successfully!");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete homeApplianceCategory"
      );
      message.error("Failed to delete homeApplianceCategory");
    } finally {
      setLoading(false);
    }
  };

  // Auto-get homeApplianceCategorys when hook is used
  useEffect(() => {
    getAllHomeApplianceCategorys();
    getAllHomeApplianceProductsByCategorys();
  }, []);

  return {
    homeApplianceCategorys,
    homeApplianceProductsByCategorys,
    homeApplianceCategory,
    loading,
    error,
    getAllHomeApplianceCategorys,
    getSingleHomeApplianceCategory,
    createHomeApplianceCategory,
    updateHomeApplianceCategory,
    deleteHomeApplianceCategory,
  };
};

export default useHomeApplianceCategoryActions;
