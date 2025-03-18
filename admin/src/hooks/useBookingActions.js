import { useState, useEffect } from "react";
import { message } from "antd";
import axiosInstance from "../components/Axios";

const useBookingActions = () => {
  const [bookings, setBookings] = useState([]); // Stores all bookings
  const [booking, setBooking] = useState(null); // Stores a single booking
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch All Bookings
  const getAllBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/bookings");
      setBookings(response.data.data.bookings);
    } catch (error) {
      setError(error.response?.message || "Failed to get bookings");
      message.error("Failed to get bookings");
    } finally {
      setLoading(false);
    }
  };

  // Fetch a Single Booking by ID
  const getSingleBooking = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/bookings/${id}`);
      setBooking(response.data.data.doc);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to get booking");
      message.error("Failed to get booking");
    } finally {
      setLoading(false);
    }
  };

  // Create a New Booking
  const createBooking = async (bookingData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/bookings", bookingData);
      setBookings((prev) =>
        Array.isArray(prev) ? [...prev, response.data.doc] : [response.data.doc]
      );
      await getAllBookings();
      message.success("Booking created successfully!");
      return response.data.booking;
    } catch (error) {
      setError(error.response?.message || "Failed to create booking");
      message.error("Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  // Update an Existing Booking
  const updateBooking = async (id, bookingData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.patch(
        `/bookings/${id}`,
        bookingData
      );
      setBookings((prev) =>
        Array.isArray(prev) ? prev.filter((b) => b._id !== id) : []
      ); // Update state
      await getAllBookings();
      message.success("Booking updated successfully!");
      return response.data.doc;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update booking");
      message.error("Failed to update booking");
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id, bookingStatus) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.patch(
        `/bookings/status/${id}`,
        bookingStatus
      );
      setBookings((prev) =>
        Array.isArray(prev) ? prev.filter((b) => b._id !== id) : []
      ); // Update state
      await getAllBookings();
      message.success("Booking updated successfully!");
      return response.data.data.doc;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update booking");
      message.error("Failed to update booking");
    } finally {
      setLoading(false);
    }
  };

  // Delete a Booking
  const deleteBooking = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/bookings/${id}`);
      setBookings((prev) => prev.filter((b) => b._id !== id)); // Remove from state
      await getAllBookings();
      message.success("Booking deleted successfully!");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete booking");
      message.error("Failed to delete booking");
    } finally {
      setLoading(false);
    }
  };

  // Auto-get bookings when hook is used
  useEffect(() => {
    getAllBookings();
  }, []);

  return {
    bookings,
    booking,
    loading,
    error,
    getAllBookings,
    getSingleBooking,
    createBooking,
    updateBooking,
    updateBookingStatus,
    deleteBooking,
  };
};

export default useBookingActions;
