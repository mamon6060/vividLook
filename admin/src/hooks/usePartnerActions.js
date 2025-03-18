import { useState, useEffect } from "react";
import { message } from "antd";
import axiosInstance from "../components/Axios";

const usePartnerActions = () => {
  const [partners, setPartners] = useState([]); // Stores all partners
  const [partner, setPartner] = useState(null); // Stores a single partner
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch All Partners
  const getAllPartners = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/partners");
      setPartners(response.data.data.doc);
    } catch (error) {
      setError(error.response?.message || "Failed to get partners");
      message.error("Failed to get partners");
    } finally {
      setLoading(false);
    }
  };

  // Fetch a Single Partner by ID
  const getSinglePartner = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/partners/${id}`);
      setPartner(response.data.data.doc);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to get partner");
      message.error("Failed to get partner");
    } finally {
      setLoading(false);
    }
  };

  // Create a New Partner
  const createPartner = async (partnerData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/partners", partnerData);
      setPartners((prev) =>
        Array.isArray(prev) ? [...prev, response.data.doc] : [response.data.doc]
      );
      await getAllPartners();
      message.success("Partner created successfully!");
      return response.data.partner;
    } catch (error) {
      setError(error.response?.message || "Failed to create partner");
      message.error("Failed to create partner");
    } finally {
      setLoading(false);
    }
  };

  // Update an Existing Partner
  const updatePartner = async (id, partnerData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.patch(
        `/partners/${id}`,
        partnerData
      );
      setPartners((prev) =>
        Array.isArray(prev) ? prev.filter((b) => b._id !== id) : []
      ); // Update state
      await getAllPartners();
      message.success("Partner updated successfully!");
      return response.data.doc;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update partner");
      message.error("Failed to update partner");
    } finally {
      setLoading(false);
    }
  };

  // Delete a Partner
  const deletePartner = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/partners/${id}`);
      setPartners((prev) => prev.filter((b) => b._id !== id)); // Remove from state
      await getAllPartners();
      message.success("Partner deleted successfully!");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete partner");
      message.error("Failed to delete partner");
    } finally {
      setLoading(false);
    }
  };

  // Auto-get partners when hook is used
  useEffect(() => {
    getAllPartners();
  }, []);

  return {
    partners,
    partner,
    loading,
    error,
    getAllPartners,
    getSinglePartner,
    createPartner,
    updatePartner,
    deletePartner,
  };
};

export default usePartnerActions;
