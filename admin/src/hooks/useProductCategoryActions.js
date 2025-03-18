import { useState, useEffect } from "react";
import { message } from "antd";
import axiosInstance from "../components/Axios";

const useProductCategoryActions = () => {
  const [productCategorys, setProductCategorys] = useState([]); // Stores all productCategorys
  const [productCategory, setProductCategory] = useState(null); // Stores a single productCategory
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch All ProductCategorys
  const getAllProductCategorys = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/category");
      setProductCategorys(response.data.data.doc);
    } catch (error) {
      setError(error.response?.message || "Failed to get productCategorys");
      message.error("Failed to get productCategorys");
    } finally {
      setLoading(false);
    }
  };

  // Fetch a Single ProductCategory by ID
  const getSingleProductCategory = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/category/${id}`);
      setProductCategory(response.data.data.doc);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to get productCategory"
      );
      message.error("Failed to get productCategory");
    } finally {
      setLoading(false);
    }
  };

  // Create a New ProductCategory
  const createProductCategory = async (productCategoryData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post(
        "/category",
        productCategoryData
      );
      setProductCategorys((prev) =>
        Array.isArray(prev) ? [...prev, response.data.doc] : [response.data.doc]
      );
      await getAllProductCategorys();
      message.success("ProductCategory created successfully!");
      return response.data.productCategory;
    } catch (error) {
      setError(error.response?.message || "Failed to create productCategory");
      message.error("Failed to create productCategory");
    } finally {
      setLoading(false);
    }
  };

  // Update an Existing ProductCategory
  const updateProductCategory = async (slug, productCategoryData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.patch(
        `/category/${slug}`,
        productCategoryData
      );
      setProductCategorys((prev) =>
        Array.isArray(prev) ? prev.filter((b) => b._slug !== slug) : []
      ); // Update state
      await getAllProductCategorys();
      message.success("ProductCategory updated successfully!");
      return response.data.doc;
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to update productCategory"
      );
      message.error("Failed to update productCategory");
    } finally {
      setLoading(false);
    }
  };

  // Delete a ProductCategory
  const deleteProductCategory = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/category/${id}`);
      setProductCategorys((prev) => prev.filter((b) => b._id !== id)); // Remove from state
      await getAllProductCategorys();
      message.success("ProductCategory deleted successfully!");
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to delete productCategory"
      );
      message.error("Failed to delete productCategory");
    } finally {
      setLoading(false);
    }
  };

  // Auto-get productCategorys when hook is used
  useEffect(() => {
    getAllProductCategorys();
  }, []);

  return {
    productCategorys,
    productCategory,
    loading,
    error,
    getAllProductCategorys,
    getSingleProductCategory,
    createProductCategory,
    updateProductCategory,
    deleteProductCategory,
  };
};

export default useProductCategoryActions;
