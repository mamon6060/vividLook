import { useState, useEffect } from "react";
import { message } from "antd";
import axiosInstance from "../components/Axios";

const useBannerActions = () => {
  const [banners, setBanners] = useState([]); // Stores all banners
  const [banner, setBanner] = useState(null); // Stores a single banner
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch All Banners
  const getAllBanners = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/banners");
      setBanners(response.data.data.doc);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to get banners");
      message.error("Failed to get banners");
    } finally {
      setLoading(false);
    }
  };

  // Fetch a Single Banner by ID
  const getSingleBanner = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/banners/${id}`);
      setBanner(response.data.data.doc);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to get banner");
      message.error("Failed to get banner");
    } finally {
      setLoading(false);
    }
  };

  // Create a New Banner
  const createBanner = async (bannerData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/banners", bannerData);
      setBanners((prev) => [...prev, response.data]);
      await getAllBanners();
      message.success("Banner created successfully!");
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create banner");
      message.error("Failed to create banner");
    } finally {
      setLoading(false);
    }
  };

  // Update an Existing Banner
  const updateBanner = async (id, bannerData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.put(`/banners/${id}`, bannerData);
      setBanners((prev) => prev.map((b) => (b._id === id ? response.data : b))); // Update state
      await getAllBanners();
      message.success("Banner updated successfully!");
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update banner");
      message.error("Failed to update banner");
    } finally {
      setLoading(false);
    }
  };

  // Delete a Banner
  const deleteBanner = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/banners/${id}`);
      setBanners((prev) => prev.filter((b) => b._id !== id)); // Remove from state
      await getAllBanners();
      message.success("Banner deleted successfully!");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete banner");
      message.error("Failed to delete banner");
    } finally {
      setLoading(false);
    }
  };

  // Auto-get banners when hook is used
  useEffect(() => {
    getAllBanners();
  }, []);

  return {
    banners,
    banner,
    loading,
    error,
    getAllBanners,
    getSingleBanner,
    createBanner,
    updateBanner,
    deleteBanner,
  };
};

export default useBannerActions;
