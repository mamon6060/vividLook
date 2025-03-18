import { useState } from "react";
import axiosInstance from "../components/Axios";
import { useEffect } from "react";
import { message } from "antd";

const useProfileActions = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all profiles
  const getAllProfiles = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/profile");
      setProfiles(response.data.data);
    } catch (err) {
      setError("Failed to fetch profiles", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single profile by ID
  const getProfileById = async (id) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/profile/${id}`);
      return response.data.data;
    } catch (err) {
      setError("Failed to fetch profile", err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new profile
  const createProfile = async (profileData) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/profile", profileData);
      setProfiles((prev) => [...prev, response.data]);
      await getAllProfiles();
      message.success("Profile created successfully!");
    } catch (err) {
      setError("Failed to create profile", err);
      message.error("Failed to create Profile");
    } finally {
      setLoading(false);
    }
  };

  // Update an existing profile
  const updateProfile = async (id, profileData) => {
    setLoading(true);
    try {
      const response = await axiosInstance.put(`/profile/${id}`, profileData);
      setProfiles((prev) =>
        prev.map((profile) => (profile._id === id ? response.data : profile))
      );
      await getAllProfiles();
      message.success("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update profile", err);
      message.error("Failed to update Profile");
    } finally {
      setLoading(false);
    }
  };

  // Delete a profile
  const deleteProfile = async (id) => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/profile/${id}`);
      setProfiles((prev) => prev.filter((profile) => profile._id !== id));
      await getAllProfiles();
      message.success("Profile deleted successfully!");
    } catch (err) {
      setError("Failed to delete profile", err);
      message.error("Failed to delete Profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProfiles();
  }, []);

  return {
    profiles,
    loading,
    error,
    getAllProfiles,
    getProfileById,
    createProfile,
    updateProfile,
    deleteProfile,
  };
};

export default useProfileActions;
