import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  Select,
  Switch,
  Popconfirm,
  message,
} from "antd";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import axiosInstance from "../Components/Axios";

const { Option } = Select;

const AllBanner = () => {
  const [banners, setBanners] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingBanner, setEditingBanner] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axiosInstance.get("/banners");
      setBanners(response.data.data.doc);
    } catch (error) {
      message.error("Failed to fetch banners");
    }
  };

  const handleCreateBanner = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("subTitle", values.subTitle);
      formData.append("mediaType", values.mediaType);
      formData.append("link", values.link);
      formData.append("bannerType", values.bannerType);
      formData.append("isActive", values.isActive);

      // Only append the photo if it's being changed
      if (values.photo && values.photo.file) {
        formData.append("photo", values.photo.file);
      }

      if (editingBanner) {
        await axiosInstance.patch(`/banners/${editingBanner._id}`, formData);
        message.success("Banner updated successfully");
      } else {
        await axiosInstance.post("/banners", formData);
        message.success("Banner created successfully");
      }

      setIsModalVisible(false);
      fetchBanners();
    } catch (error) {
      message.error("Failed to save banner");
    } finally {
      setLoading(false);
    }
  };

  const handleEditBanner = (banner) => {
    setEditingBanner(banner);
    setIsModalVisible(true);
    form.setFieldsValue({
      ...banner,
      isActive: banner.isActive,
      photo: undefined, // Reset photo field to avoid showing previous photo file
    });
  };

  const handleDeleteBanner = async (id) => {
    try {
      await axiosInstance.delete(`/banners/${id}`);
      message.success("Banner deleted successfully");
      fetchBanners();
    } catch (error) {
      message.error("Failed to delete banner");
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "SubTitle",
      dataIndex: "subTitle",
      key: "subTitle",
    },
    {
      title: "Media",
      dataIndex: "mediaType",
      key: "mediaType",
      render: (_, record) =>
        record.mediaType === "image" ? (
          <img
            src={record.photo}
            alt={record.title}
            style={{ width: "100px" }}
          />
        ) : (
          <video src={record.photo} controls style={{ width: "100px" }} />
        ),
    },
    {
      title: "Link",
      dataIndex: "link",
      key: "link",
    },
    {
      title: "Banner Type",
      dataIndex: "bannerType",
      key: "bannerType",
    },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (isActive ? "Yes" : "No"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditBanner(record)}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Are you sure to delete this banner?"
            onConfirm={() => handleDeleteBanner(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingBanner(null);
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">All Banners</h1>
        <Button
          type="primary"
          onClick={() => setIsModalVisible(true)}
          style={{ marginBottom: 16 }}
        >
          Add New Banner
        </Button>
      </div>

      <Table dataSource={banners} columns={columns} rowKey="_id" />

      <Modal
        title={editingBanner ? "Edit Banner" : "Create Banner"}
        visible={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateBanner} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="subTitle"
            label="Sub-Title"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="mediaType"
            label="Media Type"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="image">Image</Option>
              <Option value="video">Video</Option>
            </Select>
          </Form.Item>
          <Form.Item name="link" label="Link" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="bannerType"
            label="Banner Type"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="main">Main</Option>
              <Option value="deals">Deals</Option>
              <Option value="newRelease">New Release</Option>
            </Select>
          </Form.Item>
          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="photo" label="Upload Media" valuePropName="file">
            <Upload listType="picture" beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>
                Upload{" "}
                {form.getFieldValue("mediaType") === "video"
                  ? "Video"
                  : "Image"}
              </Button>
            </Upload>
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading}>
            {editingBanner ? "Update Banner" : "Create Banner"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default AllBanner;
