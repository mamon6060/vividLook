import { useState, useEffect } from "react";
import { message } from "antd";
import axiosInstance from "../components/Axios";

const useThanaActions = () => {
  const [thanas, setThanas] = useState([]); // Stores all thanas
  const [thana, setThana] = useState(null); // Stores a single thana
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch All Thanas
  const getAllThanas = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/thanas");
      setThanas(response.data.data.doc);
    } catch (error) {
      setError(error.response?.message || "Failed to get thanas");
      message.error("Failed to get thanas");
    } finally {
      setLoading(false);
    }
  };

  // Fetch a Single Thana by ID
  const getSingleThana = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/thanas/${id}`);
      setThana(response.data.data.doc);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to get thana");
      message.error("Failed to get thana");
    } finally {
      setLoading(false);
    }
  };

  // Create a New Thana
  const createThana = async (thanaData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/thanas", thanaData);
      setThanas((prev) =>
        Array.isArray(prev) ? [...prev, response.data.doc] : [response.data.doc]
      );
      await getAllThanas();
      message.success("Thana created successfully!");
      return response.data.thana;
    } catch (error) {
      setError(error.response?.message || "Failed to create thana");
      message.error("Failed to create thana");
    } finally {
      setLoading(false);
    }
  };

  // Update an Existing Thana
  const updateThana = async (id, thanaData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.patch(
        `/thanas/${id}`,
        thanaData
      );
      setThanas((prev) =>
        Array.isArray(prev) ? prev.filter((b) => b._id !== id) : []
      ); // Update state
      await getAllThanas();
      message.success("Thana updated successfully!");
      return response.data.doc;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update thana");
      message.error("Failed to update thana");
    } finally {
      setLoading(false);
    }
  };

  // Delete a Thana
  const deleteThana = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/thanas/${id}`);
      setThanas((prev) => prev.filter((b) => b._id !== id)); // Remove from state
      await getAllThanas();
      message.success("Thana deleted successfully!");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete thana");
      message.error("Failed to delete thana");
    } finally {
      setLoading(false);
    }
  };

  // Auto-get thanas when hook is used
  useEffect(() => {
    getAllThanas();
  }, []);

  return {
    thanas,
    thana,
    loading,
    error,
    getAllThanas,
    getSingleThana,
    createThana,
    updateThana,
    deleteThana,
  };
};

export default useThanaActions;
