import { useState } from "react";
import { message } from "antd";
import axiosInstance from "../components/Axios";

const useTranslateActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createTranslate = async (text) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/translate", { text });

      if (response.data && response.data.translatedText) {
        message.success("Translation successful!");
        return response.data.translatedText;
      } else {
        throw new Error("Translation failed: No response data");
      }
    } catch (error) {
      setError(error.response?.data?.error || "Translation failed");
      message.error(error.response?.data?.error || "Translation failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createTranslate,
  };
};

export default useTranslateActions;
