import { useState, useEffect } from "react";
import { message } from "antd";
import axiosInstance from "../components/Axios";

const useServiceCategoryActions = () => {
  const [serviceCategorys, setServiceCategorys] = useState([]); // Stores all serviceCategorys
  const [serviceCategory, setServiceCategory] = useState(null); // Stores a single serviceCategory
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch All ServiceCategorys
  const getAllServiceCategorys = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/services-category");
      setServiceCategorys(response.data.data.doc);
    } catch (error) {
      setError(error.response?.message || "Failed to get serviceCategorys");
      message.error("Failed to get serviceCategorys");
    } finally {
      setLoading(false);
    }
  };

  // Fetch a Single ServiceCategory by ID
  const getSingleServiceCategory = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/services-category/${id}`);
      setServiceCategory(response.data.data.doc);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to get serviceCategory");
      message.error("Failed to get serviceCategory");
    } finally {
      setLoading(false);
    }
  };

  // Create a New ServiceCategory
  const createServiceCategory = async (serviceCategoryData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/services-category", serviceCategoryData);
      setServiceCategorys((prev) =>
        Array.isArray(prev) ? [...prev, response.data.doc] : [response.data.doc]
      );
      await getAllServiceCategorys();
      message.success("ServiceCategory created successfully!");
      return response.data.serviceCategory;
    } catch (error) {
      setError(error.response?.message || "Failed to create serviceCategory");
      message.error("Failed to create serviceCategory");
    } finally {
      setLoading(false);
    }
  };

  // Update an Existing ServiceCategory
  const updateServiceCategory = async (id, serviceCategoryData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.patch(
        `/services-category/${id}`,
        serviceCategoryData
      );
      setServiceCategorys((prev) =>
        Array.isArray(prev) ? prev.filter((b) => b._id !== id) : []
      ); // Update state
      await getAllServiceCategorys();
      message.success("ServiceCategory updated successfully!");
      return response.data.doc;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update serviceCategory");
      message.error("Failed to update serviceCategory");
    } finally {
      setLoading(false);
    }
  };

  // Delete a ServiceCategory
  const deleteServiceCategory = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/services-category/${id}`);
      setServiceCategorys((prev) => prev.filter((b) => b._id !== id)); // Remove from state
      await getAllServiceCategorys();
      message.success("ServiceCategory deleted successfully!");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete serviceCategory");
      message.error("Failed to delete serviceCategory");
    } finally {
      setLoading(false);
    }
  };

  // Auto-get serviceCategorys when hook is used
  useEffect(() => {
    getAllServiceCategorys();
  }, []);

  return {
    serviceCategorys,
    serviceCategory,
    loading,
    error,
    getAllServiceCategorys,
    getSingleServiceCategory,
    createServiceCategory,
    updateServiceCategory,
    deleteServiceCategory,
  };
};

export default useServiceCategoryActions;
