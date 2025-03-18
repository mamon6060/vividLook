import { useState, useEffect } from "react";
import { message } from "antd";
import axiosInstance from "../components/Axios";

const useHomeApplianceActions = () => {
  const [homeAppliances, setHomeAppliances] = useState([]); // Stores all homeAppliances
  const [homeAppliance, setHomeAppliance] = useState(null); // Stores a single homeAppliance
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch All HomeAppliances
  const getAllHomeAppliances = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/home-appliance-product");
      setHomeAppliances(response.data.data.doc);
    } catch (error) {
      setError(error.response?.message || "Failed to get homeAppliances");
      message.error("Failed to get homeAppliances");
    } finally {
      setLoading(false);
    }
  };

  // Fetch a Single HomeAppliance by ID
  const getSingleHomeAppliance = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/home-appliance-product/${id}`);
      setHomeAppliance(response.data.data.doc);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to get homeAppliance");
      message.error("Failed to get homeAppliance");
    } finally {
      setLoading(false);
    }
  };

  // Create a New HomeAppliance
  const createHomeAppliance = async (homeApplianceData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/home-appliance-product", homeApplianceData);
      setHomeAppliances((prev) =>
        Array.isArray(prev) ? [...prev, response.data.doc] : [response.data.doc]
      );
      await getAllHomeAppliances();
      message.success("HomeAppliance created successfully!");
      return response.data.homeAppliance;
    } catch (error) {
      setError(error.response?.message || "Failed to create homeAppliance");
      message.error("Failed to create homeAppliance");
    } finally {
      setLoading(false);
    }
  };

  // Update an Existing HomeAppliance
  const updateHomeAppliance = async (id, homeApplianceData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.patch(
        `/home-appliance-product/${id}`,
        homeApplianceData
      );
      setHomeAppliances((prev) =>
        Array.isArray(prev) ? prev.filter((b) => b._id !== id) : []
      ); // Update state
      await getAllHomeAppliances();
      message.success("HomeAppliance updated successfully!");
      return response.data.doc;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update homeAppliance");
      message.error("Failed to update homeAppliance");
    } finally {
      setLoading(false);
    }
  };

  // Delete a HomeAppliance
  const deleteHomeAppliance = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/home-appliance-product/${id}`);
      setHomeAppliances((prev) => prev.filter((b) => b._id !== id)); // Remove from state
      await getAllHomeAppliances();
      message.success("HomeAppliance deleted successfully!");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete homeAppliance");
      message.error("Failed to delete homeAppliance");
    } finally {
      setLoading(false);
    }
  };

  // Auto-get homeAppliances when hook is used
  useEffect(() => {
    getAllHomeAppliances();
  }, []);

  return {
    homeAppliances,
    homeAppliance,
    loading,
    error,
    getAllHomeAppliances,
    getSingleHomeAppliance,
    createHomeAppliance,
    updateHomeAppliance,
    deleteHomeAppliance,
  };
};

export default useHomeApplianceActions;
