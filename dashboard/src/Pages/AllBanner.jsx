import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Switch,
  Select,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axiosInstance from "../Components/Axios";

const AllBanner = () => {
  const [banners, setBanners] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axiosInstance.get(`/banners`);
      setBanners(response.data.data.doc);
    } catch (error) {
      message.error("Failed to fetch banners!");
    }
  };

  const handleCreateEditBanner = async (values) => {
    const { title, subTitle, link, bannerType, isActive, mediaType, mediaUrl } =
      values;

    const bannerData = {
      title,
      subTitle,
      link,
      bannerType,
      isActive,
      mediaType,
      photo: mediaUrl, // Send the media URL as the photo field
    };

    try {
      if (isEditMode) {
        await axiosInstance.patch(`/banners/${currentBanner._id}`, bannerData);
        message.success("Banner updated successfully!");
      } else {
        await axiosInstance.post(`/banners`, bannerData);
        message.success("Banner created successfully!");
      }
      setIsModalVisible(false);
      fetchBanners();
    } catch (error) {
      console.error("Error creating/updating banner:", error);
      message.error(
        "Failed to save banner! " + (error.response?.data?.message || "")
      );
    }
  };

  const handleDeleteBanner = async (id) => {
    try {
      await axiosInstance.delete(`/banners/${id}`);
      message.success("Banner deleted successfully!");
      fetchBanners();
    } catch (error) {
      message.error("Failed to delete banner!");
    }
  };

  const handleEditBanner = (banner) => {
    setCurrentBanner(banner);
    form.setFieldsValue({
      title: banner.title,
      subTitle: banner.subTitle,
      link: banner.link,
      bannerType: banner.bannerType,
      isActive: banner.isActive,
      mediaType: banner.mediaType,
      mediaUrl: banner.photo, // Set the existing media URL
    });
    setIsEditMode(true);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: "Media",
      dataIndex: "photo",
      key: "photo",
      render: (photo, record) =>
        record.mediaType === "video" ? (
          <video width="120" controls>
            <source src={photo} type="video/mp4" />
          </video>
        ) : (
          <img src={photo} alt="banner" width="120" />
        ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Subtitle",
      dataIndex: "subTitle",
      key: "subTitle",
    },
    {
      title: "Media Type",
      dataIndex: "mediaType",
      key: "mediaType",
      render: (text) => (text === "video" ? "Video" : "Image"),
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
      render: (text) => <Switch checked={text} disabled />,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, banner) => (
        <span>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditBanner(banner)}
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteBanner(banner._id)}
            style={{ marginLeft: 8 }}
          />
        </span>
      ),
    },
  ];

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setCurrentBanner(null);
          setIsEditMode(false);
          form.resetFields();
          setIsModalVisible(true);
        }}
        style={{ marginBottom: 16 }}
      >
        Create Banner
      </Button>
      <Table columns={columns} dataSource={banners} rowKey="_id" />

      <Modal
        title={isEditMode ? "Edit Banner" : "Create Banner"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateEditBanner} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter the title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="subTitle"
            label="Sub-title"
            rules={[{ required: true, message: "Please enter the sub-title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="link"
            label="Link"
            rules={[{ required: true, message: "Please enter the link" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="bannerType"
            label="Banner Type"
            rules={[
              { required: true, message: "Please select the banner type" },
            ]}
          >
            <Select>
              <Select.Option value="main">Main</Select.Option>
              <Select.Option value="deals">Deals</Select.Option>
              <Select.Option value="newRelease">New Release</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item
            name="mediaType"
            label="Media Type"
            rules={[{ required: true, message: "Please select media type" }]}
          >
            <Select>
              <Select.Option value="image">Image</Select.Option>
              <Select.Option value="video">Video</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="mediaUrl"
            label="Media URL"
            rules={[{ required: true, message: "Please enter the media URL" }]}
          >
            <Input placeholder="Enter image or video URL" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isEditMode ? "Update Banner" : "Create Banner"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AllBanner;
