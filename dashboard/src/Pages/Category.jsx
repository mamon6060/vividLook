import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Switch,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import axiosInstance from "../Components/Axios";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/category");
      setCategories(response.data.data.doc);
    } catch (error) {
      message.error("Failed to fetch categories.");
    }
  };

  const showCreateModal = () => {
    setIsEditMode(false);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (category) => {
    setIsEditMode(true);
    setEditingCategory(category);
    form.setFieldsValue({
      title: category.title,
      isActive: category.isActive,
    });
    setIsModalVisible(true);
  };

  const handleCreateOrEdit = async () => {
    try {
      const values = await form.validateFields();

      if (isEditMode) {
        // Edit Category
        const response = await axiosInstance.patch(
          `/category/${editingCategory.slug}`,
          values
        );
        if (response.data.status === "success") {
          message.success("Category updated successfully!");
          fetchCategories();
        }
      } else {
        // Create Category
        const response = await axiosInstance.post("/category", values);
        if (response.data.status === "success") {
          message.success("Category created successfully!");
          fetchCategories();
        }
      }

      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to save category.");
    }
  };

  const handleDelete = async (slug) => {
    try {
      const response = await axiosInstance.delete(`/category/${slug}`);
      if (response.data.status === "success") {
        message.success("Category deleted successfully!");
        fetchCategories();
      }
    } catch (error) {
      message.error("Failed to delete category.");
    }
  };

  const columns = [
    {
      title: "SL",
      key: "sl",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Total Products",
      dataIndex: "products",
      key: "products",
      render: (products) => products.length,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (isActive ? "Active" : "Inactive"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
            className="mr-2"
          />
          <Popconfirm
            title="Are you sure to delete this category?"
            onConfirm={() => handleDelete(record.slug)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-5">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">All Categories</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showCreateModal}
        >
          Add Category
        </Button>
      </div>

      <Table columns={columns} dataSource={categories} rowKey="_id" />

      {/* Create/Edit Modal */}
      <Modal
        title={isEditMode ? "Edit Category" : "Create Category"}
        visible={isModalVisible}
        onOk={handleCreateOrEdit}
        onCancel={() => setIsModalVisible(false)}
        okText={isEditMode ? "Save" : "Create"}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[
              { required: true, message: "Please input the category title!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Categories;
