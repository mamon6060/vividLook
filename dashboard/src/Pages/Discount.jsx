import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, message, InputNumber } from "antd";
import axiosInstance from "../Components/Axios";

const { Option } = Select;

const Discount = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedType, setSelectedType] = useState("product");
  const [maxValue, setMaxValue] = useState(100); // State for max value of discount

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        const [categoryResponse, productResponse] = await Promise.all([
          axiosInstance.get("/category"),
          axiosInstance.get("/products"),
        ]);

        setCategories(categoryResponse.data.data.doc);
        setProducts(productResponse.data.data.doc);
      } catch (error) {
        message.error("Failed to fetch categories or products!");
      }
    };

    fetchCategoriesAndProducts();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axiosInstance.put("/discount", values);
      message.success("Discount applied successfully!");
    } catch (error) {
      message.error("Failed to apply discount!");
    } finally {
      setLoading(false);
    }
  };

  const handleDiscountTypeChange = (value) => {
    // Adjust max value based on discount method
    if (value === "percent") {
      setMaxValue(100); // Max value for percent discount
    } else if (value === "amount") {
      setMaxValue(Infinity); // No upper limit for amount discount
    } else {
      setMaxValue(0); // Default to 0 for "none" or other cases
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold mb-5">Apply Discount</h2>
      <Form
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          type: "product",
          discountType: "none",
        }}
      >
        <Form.Item
          name="type"
          label="Discount Type"
          rules={[
            { required: true, message: "Please select the discount type" },
          ]}
        >
          <Select onChange={(value) => setSelectedType(value)}>
            <Option value="product">Product</Option>
            <Option value="category">Category</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="id"
          label={selectedType === "product" ? "Product" : "Category"}
          rules={[
            { required: true, message: `Please select a ${selectedType}` },
          ]}
        >
          <Select placeholder={`Select a ${selectedType}`}>
            {selectedType === "product"
              ? products.map((product) => (
                  <Option key={product._id} value={product._id}>
                    {product.title}
                  </Option>
                ))
              : categories.map((category) => (
                  <Option key={category._id} value={category._id}>
                    {category.title}
                  </Option>
                ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="discountType"
          label="Discount Method"
          rules={[
            { required: true, message: "Please select the discount method" },
          ]}
        >
          <Select onChange={handleDiscountTypeChange}>
            <Option value="none">None</Option>
            <Option value="amount">Amount</Option>
            <Option value="percent">Percent</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="discountValue"
          label="Discount Value"
          rules={[
            { required: true, message: "Please enter the discount value" },
          ]}
        >
          <InputNumber
            min={0}
            max={maxValue} // Dynamically set max value
            placeholder="Enter discount value"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Apply Discount
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Discount;
