import { useState, useEffect } from "react";
import { message } from "antd";
import axiosInstance from "../components/Axios";

const useServiceActions = () => {
  const [services, setServices] = useState([]); // Stores all services
  const [service, setService] = useState(null); // Stores a single service
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch All Services
  const getAllServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/services");
      setServices(response.data.data.doc);
    } catch (error) {
      setError(error.response?.message || "Failed to get services");
      message.error("Failed to get services");
    } finally {
      setLoading(false);
    }
  };

  // Fetch a Single Service by ID
  const getSingleService = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/services/${id}`);
      setService(response.data.data.doc);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to get service");
      message.error("Failed to get service");
    } finally {
      setLoading(false);
    }
  };

  // Create a New Service
  const createService = async (serviceData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/services", serviceData);
      setServices((prev) =>
        Array.isArray(prev) ? [...prev, response.data.doc] : [response.data.doc]
      );
      await getAllServices();
      message.success("Service created successfully!");
      return response.data.service;
    } catch (error) {
      setError(error.response?.message || "Failed to create service");
      message.error("Failed to create service");
    } finally {
      setLoading(false);
    }
  };

  // Update an Existing Service
  const updateService = async (id, serviceData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.patch(
        `/services/${id}`,
        serviceData
      );
      setServices((prev) =>
        Array.isArray(prev) ? prev.filter((b) => b._id !== id) : []
      ); // Update state
      await getAllServices();
      message.success("Service updated successfully!");
      return response.data.doc;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update service");
      message.error("Failed to update service");
    } finally {
      setLoading(false);
    }
  };

  // Delete a Service
  const deleteService = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/services/${id}`);
      setServices((prev) => prev.filter((b) => b._id !== id)); // Remove from state
      await getAllServices();
      message.success("Service deleted successfully!");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete service");
      message.error("Failed to delete service");
    } finally {
      setLoading(false);
    }
  };

  // Auto-get services when hook is used
  useEffect(() => {
    getAllServices();
  }, []);

  return {
    services,
    service,
    loading,
    error,
    getAllServices,
    getSingleService,
    createService,
    updateService,
    deleteService,
  };
};

export default useServiceActions;
