import { useState, useEffect } from "react";
import { message } from "antd";
import axiosInstance from "../components/Axios";

const useMechanicActions = () => {
  const [mechanics, setMechanics] = useState([]); // Stores all mechanics
  const [mechanic, setMechanic] = useState(null); // Stores a single mechanic
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch All Mechanics
  const getAllMechanics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/mechanics");
      setMechanics(response.data.data.doc);
    } catch (error) {
      setError(error.response?.message || "Failed to get mechanics");
      message.error("Failed to get mechanics");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Mechanics by Area
  const getAllMechanicsByArea = async (areaId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/mechanics/${areaId}`);
      return response.data.data.mechanics;
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to get mechanics by area"
      );
      message.error("Failed to get mechanics by area");
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch a Single Mechanic by ID
  const getSingleMechanic = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/mechanics/${id}`);
      setMechanic(response.data.data.doc);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to get mechanic");
      message.error("Failed to get mechanic");
    } finally {
      setLoading(false);
    }
  };

  // Create a New Mechanic
  const createMechanic = async (mechanicData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/mechanics", mechanicData);
      setMechanics((prev) =>
        Array.isArray(prev) ? [...prev, response.data.doc] : [response.data.doc]
      );
      await getAllMechanics();
      message.success("Mechanic created successfully!");
      return response.data.mechanic;
    } catch (error) {
      setError(error.response?.message || "Failed to create mechanic");
      message.error("Failed to create mechanic");
    } finally {
      setLoading(false);
    }
  };

  // Update an Existing Mechanic
  const updateMechanic = async (id, mechanicData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.patch(
        `/mechanics/${id}`,
        mechanicData
      );
      setMechanics((prev) =>
        Array.isArray(prev) ? prev.filter((b) => b._id !== id) : []
      ); // Update state
      await getAllMechanics();
      message.success("Mechanic updated successfully!");
      return response.data.doc;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update mechanic");
      message.error("Failed to update mechanic");
    } finally {
      setLoading(false);
    }
  };

  // Delete a Mechanic
  const deleteMechanic = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/mechanics/${id}`);
      setMechanics((prev) => prev.filter((b) => b._id !== id)); // Remove from state
      await getAllMechanics();
      message.success("Mechanic deleted successfully!");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete mechanic");
      message.error("Failed to delete mechanic");
    } finally {
      setLoading(false);
    }
  };

  // Auto-get mechanics when hook is used
  useEffect(() => {
    getAllMechanics();
  }, []);

  return {
    mechanics,
    mechanic,
    loading,
    error,
    getAllMechanics,
    getAllMechanicsByArea,
    getSingleMechanic,
    createMechanic,
    updateMechanic,
    deleteMechanic,
  };
};

export default useMechanicActions;
