import { useState } from "react";
import axiosInstance from "../components/Axios";
import { useEffect } from "react";
import { message } from "antd";

const useGalleryActions = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all galleries
  const getAllGalleries = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/gallery");
      setGalleries(response.data.data);
    } catch (err) {
      setError("Failed to fetch galleries", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single gallery by ID
  const getGalleryById = async (id) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/gallery/${id}`);
      return response.data.data;
    } catch (err) {
      setError("Failed to fetch gallery", err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new gallery
  const createGallery = async (galleryData) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/gallery", galleryData);
      setGalleries((prev) => [...prev, response.data]);
      await getAllGalleries();
      message.success("Gallery created successfully!");
    } catch (err) {
      setError("Failed to create gallery", err);
      message.error("Failed to create Gallery");
    } finally {
      setLoading(false);
    }
  };

  // Update an existing gallery
  const updateGallery = async (id, galleryData) => {
    setLoading(true);
    try {
      const response = await axiosInstance.put(`/gallery/${id}`, galleryData);
      setGalleries((prev) =>
        prev.map((gallery) => (gallery._id === id ? response.data : gallery))
      );
      await getAllGalleries();
      message.success("Gallery updated successfully!");
    } catch (err) {
      setError("Failed to update gallery", err);
      message.error("Failed to update Gallery");
    } finally {
      setLoading(false);
    }
  };

  // Delete a gallery
  const deleteGallery = async (id) => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/gallery/${id}`);
      setGalleries((prev) => prev.filter((gallery) => gallery._id !== id));
      await getAllGalleries();
      message.success("Gallery deleted successfully!");
    } catch (err) {
      setError("Failed to delete gallery", err);
      message.error("Failed to delete Gallery");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllGalleries();
  }, []);

  return {
    galleries,
    loading,
    error,
    getAllGalleries,
    getGalleryById,
    createGallery,
    updateGallery,
    deleteGallery,
  };
};

export default useGalleryActions;
