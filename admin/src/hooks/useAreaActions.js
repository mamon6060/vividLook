import { useState, useEffect } from "react";
import { message } from "antd";
import axiosInstance from "../components/Axios";

const useAreaActions = () => {
  const [areas, setAreas] = useState([]); // Stores all areas
  const [area, setArea] = useState(null); // Stores a single area
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch All Areas
  const getAllAreas = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/areas");
      setAreas(response.data.data.doc);
    } catch (error) {
      setError(error.response?.message || "Failed to get areas");
      message.error("Failed to get areas");
    } finally {
      setLoading(false);
    }
  };

  // Fetch a Single Area by ID
  const getSingleArea = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/areas/${id}`);
      setArea(response.data.data.doc);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to get area");
      message.error("Failed to get area");
    } finally {
      setLoading(false);
    }
  };

  // Create a New Area
  const createArea = async (areaData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/areas", areaData);
      setAreas((prev) =>
        Array.isArray(prev) ? [...prev, response.data.doc] : [response.data.doc]
      );
      await getAllAreas();
      message.success("Area created successfully!");
      return response.data.area;
    } catch (error) {
      setError(error.response?.message || "Failed to create area");
      message.error("Failed to create area");
    } finally {
      setLoading(false);
    }
  };

  // Update an Existing Area
  const updateArea = async (id, areaData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.patch(
        `/areas/${id}`,
        areaData
      );
      setAreas((prev) =>
        Array.isArray(prev) ? prev.filter((b) => b._id !== id) : []
      ); // Update state
      await getAllAreas();
      message.success("Area updated successfully!");
      return response.data.doc;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update area");
      message.error("Failed to update area");
    } finally {
      setLoading(false);
    }
  };

  // Delete a Area
  const deleteArea = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/areas/${id}`);
      setAreas((prev) => prev.filter((b) => b._id !== id)); // Remove from state
      await getAllAreas();
      message.success("Area deleted successfully!");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete area");
      message.error("Failed to delete area");
    } finally {
      setLoading(false);
    }
  };

  // Auto-get areas when hook is used
  useEffect(() => {
    getAllAreas();
  }, []);

  return {
    areas,
    area,
    loading,
    error,
    getAllAreas,
    getSingleArea,
    createArea,
    updateArea,
    deleteArea,
  };
};

export default useAreaActions;
