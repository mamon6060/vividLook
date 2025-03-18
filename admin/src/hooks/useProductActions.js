import { useState, useEffect } from "react";
import { message } from "antd";
import axiosInstance from "../components/Axios";

const useProductActions = () => {
  const [products, setProducts] = useState([]); // Stores all products
  const [product, setProduct] = useState(null); // Stores a single product
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch All Products
  const getAllProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/products");
      setProducts(response.data.data.doc);
    } catch (error) {
      setError(error.response?.message || "Failed to get products");
      message.error("Failed to get products");
    } finally {
      setLoading(false);
    }
  };

  // Fetch a Single Product by ID
  const getSingleProduct = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/products/${id}`);
      setProduct(response.data.data.doc);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to get product");
      message.error("Failed to get product");
    } finally {
      setLoading(false);
    }
  };

  // Create a New Product
  const createProduct = async (productData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/products", productData);
      setProducts((prev) =>
        Array.isArray(prev) ? [...prev, response.data.doc] : [response.data.doc]
      );
      await getAllProducts();
      message.success("Product created successfully!");
      return response.data.product;
    } catch (error) {
      setError(error.response?.message || "Failed to create product");
      message.error("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  // Update an Existing Product
  const updateProduct = async (id, productData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.patch(
        `/products/${id}`,
        productData
      );
      setProducts((prev) =>
        Array.isArray(prev) ? prev.filter((b) => b._id !== id) : []
      ); // Update state
      await getAllProducts();
      message.success("Product updated successfully!");
      return response.data.doc;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update product");
      message.error("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  // Delete a Product
  const deleteProduct = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((b) => b._id !== id)); // Remove from state
      await getAllProducts();
      message.success("Product deleted successfully!");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete product");
      message.error("Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  // Auto-get products when hook is used
  useEffect(() => {
    getAllProducts();
  }, []);

  return {
    products,
    product,
    loading,
    error,
    getAllProducts,
    getSingleProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};

export default useProductActions;
