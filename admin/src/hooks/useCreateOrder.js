import { useState } from "react";
import axios from "axios";
import {
  STEDFAST_API_BASE_URL,
  STEDFAST_API_KEY,
  STEDFAST_API_SECRET_KEY,
} from "../shared/config";

const useCreateOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderResponse, setOrderResponse] = useState(null);

  const createOrder = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${STEDFAST_API_BASE_URL}/create_order`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "Api-Key": STEDFAST_API_KEY,
            "Secret-Key": STEDFAST_API_SECRET_KEY,
          },
        }
      );
      setOrderResponse(response);
      // message.success("Order created successfully!");
      return response;
    } catch (error) {
      setError(error.response?.message || "Failed to create order");
      // message.error("Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  return { orderResponse, loading, error, createOrder };
};

export default useCreateOrder;
