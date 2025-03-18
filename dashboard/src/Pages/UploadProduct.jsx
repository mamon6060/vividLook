import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axiosInstance from "../Components/Axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import the Quill styling

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [photosToRemove, setPhotosToRemove] = useState([]); // Track photos to remove
  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false); // Loading state for the OK button

  // Fetch all products and categories
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/products");
      setProducts(data.data.doc);
    } catch (error) {
      message.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axiosInstance.get("/category");
      setCategories(data.data.doc);
    } catch (error) {
      message.error("Failed to fetch categories");
    }
  };

  // Handle create/edit
  const handleOk = async () => {
    setConfirmLoading(true); // Set loading state to true
    try {
      const values = await form.validateFields();
      const formData = new FormData();

      // Append fields from the form
      Object.keys(values).forEach((key) => {
        if (key !== "photos") {
          formData.append(key, values[key]);
        }
      });

      // Combine existing photos and new ones
      const existingPhotos = editingProduct ? editingProduct.photos : [];
      const newPhotos = fileList.map((file) => file.originFileObj); // New files to upload

      // Prepare the final photos array for submission
      const allPhotos = [
        ...existingPhotos.filter((photo) => !photosToRemove.includes(photo)),
        ...newPhotos,
      ];

      allPhotos.forEach((photo) => {
        if (photo) {
          formData.append("photos", photo);
        }
      });

      // Handle update or create
      if (editingProduct) {
        formData.append("photosToRemove", photosToRemove); // Add photos to remove
        await axiosInstance.patch(
          `/products/${editingProduct.slug}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        message.success("Product updated successfully!");
      } else {
        await axiosInstance.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message.success("Product created successfully!");
      }

      fetchProducts();
      setIsModalOpen(false);
      form.resetFields();
      setFileList([]);
      setPhotosToRemove([]); // Reset photos to remove
    } catch (error) {
      message.error("Failed to save product");
    } finally {
      setConfirmLoading(false); // Set loading state to false
    }
  };

  // Handle delete
  const handleDelete = async (slug) => {
    try {
      await axiosInstance.delete(`/products/${slug}`);
      message.success("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      message.error("Failed to delete product");
    }
  };

  // Open modal for create/edit
  const showModal = (product = null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
    setPhotosToRemove([]); // Reset photos to remove on new modal open
    if (product) {
      form.setFieldsValue(product);
      setFileList(
        (product.photos || []).map((url, index) => ({
          uid: index,
          name: `photo-${index}`,
          status: "done",
          url: url,
        }))
      );
    } else {
      setFileList([]);
    }
  };

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList); // This will keep track of selected files
  };

  const handleRemovePhoto = (url) => {
    Modal.confirm({
      title: "Are you sure you want to remove this photo?",
      onOk: () => {
        setPhotosToRemove((prev) => [...prev, url]); // Add to removal list
        setFileList((prev) => prev.filter((file) => file.url !== url)); // Remove from file list
      },
    });
  };

  const columns = [
    {
      title: "SL",
      key: "sl",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Photos",
      dataIndex: "photos",
      key: "photos",
      render: (photos) => (
        <>
          {photos.map((photo, index) => (
            <div
              key={index}
              style={{
                position: "relative",
                marginRight: "5px",
              }}
            >
              <img src={photo} alt="product" style={{ width: "50px" }} />
            </div>
          ))}
        </>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Category",
      dataIndex: ["category", "title"],
      key: "category",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <>
          <Button onClick={() => showModal(record)} type="primary">
            Edit
          </Button>{" "}
          <Button onClick={() => handleDelete(record.slug)} danger>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-5">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">All Products</h1>
        <Button type="primary" onClick={() => showModal()}>
          Create Product
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={products}
        rowKey="_id"
        loading={loading}
      />

      <Modal
        title={editingProduct ? "Edit Product" : "Create Product"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleOk}
        confirmLoading={confirmLoading} // Use confirmLoading to show loading in the OK button
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[
              { required: true, message: "Please enter the product title" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="sku"
            label="SKU (minimum 8 characters)"
            rules={[
              { required: true, message: "Please enter the product SKU" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[
              { required: true, message: "Please enter the product price" },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="stock"
            label="Stock"
            rules={[
              { required: true, message: "Please enter the stock quantity" },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="details"
            label="Details"
            rules={[
              { required: true, message: "Please enter the product details" },
            ]}
          >
            <ReactQuill />
          </Form.Item>

          {!editingProduct && (
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select>
                {categories.map((category) => (
                  <Select.Option key={category._id} value={category._id}>
                    {category.title}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item label="Photos">
            <Upload
              fileList={fileList}
              onChange={handleFileChange}
              multiple
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;
