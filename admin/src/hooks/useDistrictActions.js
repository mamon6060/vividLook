import { useState, useEffect } from "react";
import { message } from "antd";
import axiosInstance from "../components/Axios";

const useDistrictActions = () => {
  const [districts, setDistricts] = useState([]); // Stores all districts
  const [district, setDistrict] = useState(null); // Stores a single district
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch All Districts
  const getAllDistricts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/districts");
      setDistricts(response.data.data.doc);
    } catch (error) {
      setError(error.response?.message || "Failed to get districts");
      message.error("Failed to get districts");
    } finally {
      setLoading(false);
    }
  };

  // Fetch a Single District by ID
  const getSingleDistrict = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/districts/${id}`);
      setDistrict(response.data.data.doc);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to get district");
      message.error("Failed to get district");
    } finally {
      setLoading(false);
    }
  };

  // Create a New District
  const createDistrict = async (districtData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/districts", districtData);
      setDistricts((prev) =>
        Array.isArray(prev) ? [...prev, response.data.doc] : [response.data.doc]
      );
      await getAllDistricts();
      message.success("District created successfully!");
      return response.data.district;
    } catch (error) {
      setError(error.response?.message || "Failed to create district");
      message.error("Failed to create district");
    } finally {
      setLoading(false);
    }
  };

  // Update an Existing District
  const updateDistrict = async (id, districtData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.patch(
        `/districts/${id}`,
        districtData
      );
      setDistricts((prev) =>
        Array.isArray(prev) ? prev.filter((b) => b._id !== id) : []
      ); // Update state
      await getAllDistricts();
      message.success("District updated successfully!");
      return response.data.doc;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update district");
      message.error("Failed to update district");
    } finally {
      setLoading(false);
    }
  };

  // Delete a District
  const deleteDistrict = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/districts/${id}`);
      setDistricts((prev) => prev.filter((b) => b._id !== id)); // Remove from state
      await getAllDistricts();
      message.success("District deleted successfully!");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete district");
      message.error("Failed to delete district");
    } finally {
      setLoading(false);
    }
  };

  // Auto-get districts when hook is used
  useEffect(() => {
    getAllDistricts();
  }, []);

  return {
    districts,
    district,
    loading,
    error,
    getAllDistricts,
    getSingleDistrict,
    createDistrict,
    updateDistrict,
    deleteDistrict,
  };
};

export default useDistrictActions;
