import { useState, useEffect } from "react";
import { message } from "antd";
import axiosInstance from "../components/Axios";

const useOrderActions = () => {
  const [orders, setOrders] = useState([]); // Stores all orders
  const [order, setOrder] = useState(null); // Stores a single order
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dashboardCounts, setDashboardCounts] = useState({
    totalOrders: 0,
    totalSales: 0,
    totalRevenue: 0,
  });

  // Fetch All Orders
  const getAllOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/orders");
      setOrders(response.data.data.doc);
    } catch (error) {
      setError(error.response?.message || "Failed to get orders");
      message.error("Failed to get orders");
    } finally {
      setLoading(false);
    }
  };

  // Fetch a Single Order by ID
  const getSingleOrder = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/orders/${id}`);
      setOrder(response.data.data.doc);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to get order");
      message.error("Failed to get order");
    } finally {
      setLoading(false);
    }
  };

  // Create a New Order
  const createOrder = async (orderData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/orders", orderData);
      setOrders((prev) =>
        Array.isArray(prev) ? [...prev, response.data.doc] : [response.data.doc]
      );
      await getAllOrders();
      message.success("Order created successfully!");
      return response.data.order;
    } catch (error) {
      setError(error.response?.message || "Failed to create order");
      message.error("Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  // Update an Existing Order
  const updateOrder = async (id, orderData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.patch(`/orders/${id}`, orderData);
      setOrders((prev) =>
        Array.isArray(prev) ? prev.filter((b) => b._id !== id) : []
      ); // Update state
      await getAllOrders();
      message.success("Order updated successfully!");
      return response.data.doc;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update order");
      message.error("Failed to update order");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id, orderStatus) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.patch(
        `/orders/status/${id}`,
        orderStatus
      );
      setOrders((prev) =>
        Array.isArray(prev) ? prev.filter((b) => b._id !== id) : []
      ); // Update state
      await getAllOrders();
      message.success("Order updated successfully!");
      return response.data.data.doc;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update order");
      // message.error("Failed to update order");
    } finally {
      setLoading(false);
    }
  };

  // Delete a Order
  const deleteOrder = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/orders/${id}`);
      setOrders((prev) => prev.filter((b) => b._id !== id)); // Remove from state
      await getAllOrders();
      message.success("Order deleted successfully!");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete order");
      message.error("Failed to delete order");
    } finally {
      setLoading(false);
    }
  };

  const getDashboardCounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/dashboard-count");
      setDashboardCounts(response.data.data);
    } catch (error) {
      setError(error.response?.message || "Failed to get orders");
      message.error("Failed to get orders");
    } finally {
      setLoading(false);
    }
  };

  // Auto-get orders when hook is used
  useEffect(() => {
    getAllOrders();

    getDashboardCounts();
  }, []);

  return {
    orders,
    order,
    loading,
    error,
    dashboardCounts,
    getAllOrders,
    getSingleOrder,
    createOrder,
    updateOrder,
    updateOrderStatus,
    deleteOrder,
    getDashboardCounts,
  };
};

export default useOrderActions;
