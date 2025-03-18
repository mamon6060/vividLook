import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  notification,
  Popconfirm,
  Space,
} from "antd";
import axiosInstance from "../Components/Axios";

const BlogCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();
  const [currentCategoryId, setCurrentCategoryId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/blogCategories");
      setCategories(response.data.data.doc);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to fetch categories",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    form.resetFields();
    setIsEdit(false);
    setIsModalVisible(true);
  };

  const handleEdit = (category) => {
    form.setFieldsValue({ title: category.title });
    setIsEdit(true);
    setCurrentCategoryId(category.slug);
    setIsModalVisible(true);
  };

  const handleDelete = async (slug) => {
    try {
      await axiosInstance.delete(`/blogCategories/${slug}`);
      notification.success({
        message: "Success",
        description: "Blog category deleted successfully",
      });
      fetchCategories();
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to delete category",
      });
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (isEdit) {
        await axiosInstance.patch(
          `/blogCategories/${currentCategoryId}`,
          values
        );
        notification.success({
          message: "Success",
          description: "Blog category updated successfully",
        });
      } else {
        await axiosInstance.post("/blogCategories", values);
        notification.success({
          message: "Success",
          description: "Blog category created successfully",
        });
      }
      setIsModalVisible(false);
      fetchCategories();
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to save category",
      });
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Blogs Count",
      dataIndex: "blogs",
      key: "blogs",
      render: (blogs) => blogs.length,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this category?"
            onConfirm={() => handleDelete(record.slug)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger">Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-5">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">All Category</h1>
        <Button
          type="primary"
          onClick={handleCreate}
          style={{ marginBottom: "20px" }}
        >
          Create Blog Category
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={categories}
        rowKey={(record) => record._id}
        loading={loading}
        pagination={false}
      />

      {/* Create/Edit Modal */}
      <Modal
        title={isEdit ? "Edit Blog Category" : "Create Blog Category"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleModalOk}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Category Title"
            name="title"
            rules={[
              { required: true, message: "Please input the category title!" },
            ]}
          >
            <Input placeholder="Enter category title" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BlogCategories;
