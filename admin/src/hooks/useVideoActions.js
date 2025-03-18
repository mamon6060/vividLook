import { useState } from "react";
import axiosInstance from "../components/Axios";
import { useEffect } from "react";
import { message } from "antd";

const useVideoActions = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all videos
  const getAllVideos = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/video");
      setVideos(response.data.data);
    } catch (err) {
      setError("Failed to fetch videos", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single video by ID
  const getVideoById = async (id) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/video/${id}`);
      return response.data.data;
    } catch (err) {
      setError("Failed to fetch video", err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new video
  const createVideo = async (videoData) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/video", videoData);
      setVideos((prev) => [...prev, response.data]);
      await getAllVideos();
      message.success("Video created successfully!");
    } catch (err) {
      setError("Failed to create video", err);
      message.error("Failed to create Video");
    } finally {
      setLoading(false);
    }
  };

  // Update an existing video
  const updateVideo = async (id, videoData) => {
    setLoading(true);
    try {
      const response = await axiosInstance.put(`/video/${id}`, videoData);
      setVideos((prev) =>
        prev.map((video) => (video._id === id ? response.data : video))
      );
      await getAllVideos();
      message.success("Video updated successfully!");
    } catch (err) {
      setError("Failed to update video", err);
      message.error("Failed to update Video");
    } finally {
      setLoading(false);
    }
  };

  // Delete a video
  const deleteVideo = async (id) => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/video/${id}`);
      setVideos((prev) => prev.filter((video) => video._id !== id));
      await getAllVideos();
      message.success("Video deleted successfully!");
    } catch (err) {
      setError("Failed to delete video", err);
      message.error("Failed to delete Video");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllVideos();
  }, []);

  return {
    videos,
    loading,
    error,
    getAllVideos,
    getVideoById,
    createVideo,
    updateVideo,
    deleteVideo,
  };
};

export default useVideoActions;
