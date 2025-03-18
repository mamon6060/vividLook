import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  Popconfirm,
  message,
  Image,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import axiosInstance from "../Components/Axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false); // Loading state for the OK button

  // Fetch services
  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/services");
      setServices(data.data.doc);
    } catch (error) {
      message.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Handle create/edit service
  const handleCreateOrEdit = async (values) => {
    setConfirmLoading(true); // handleOk

    const formData = new FormData();
    formData.append("heading", values.heading);
    formData.append("details", values.details);
    formData.append("icon", values.icon);

    // Handle file upload
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append("photo", fileList[0].originFileObj);
    } else if (editingService && editingService.photo) {
      // If no new photo is uploaded, retain the existing photo
      formData.append("photo", editingService.photo);
    }

    try {
      if (editingService) {
        await axiosInstance.patch(`/services/${editingService._id}`, formData);
        message.success("Service updated successfully");
      } else {
        await axiosInstance.post("/services", formData);
        message.success("Service created successfully");
      }
      setIsModalOpen(false);
      setEditingService(null);
      setFileList([]);
      fetchServices();
    } catch (error) {
      message.error("Failed to save service");
    } finally {
      setConfirmLoading(false); // Set loading state to false
    }
  };

  // Handle delete service
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/services/${id}`);
      message.success("Service deleted successfully");
      fetchServices();
    } catch (error) {
      message.error("Failed to delete service");
    }
  };

  // Handle file upload change
  const handleUploadChange = ({ fileList }) => setFileList(fileList);

  // Open edit modal
  const openEditModal = (service) => {
    setEditingService(service);
    form.setFieldsValue({
      heading: service.heading,
      details: service.details,
      icon: service.icon,
    });
    if (service.photo) {
      setFileList([{ url: service.photo, name: "Existing Image" }]);
    }
    setIsModalOpen(true);
  };


  // Columns for the table
  const columns = [
    {
      title: "Photo",
      dataIndex: "photo",
      key: "photo",
      render: (photo) => <Image width={100} src={photo} alt="Service" />,
    },
    {
      title: "Heading",
      dataIndex: "heading",
      key: "heading",
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
      render: (text, record) => (
        <div
          dangerouslySetInnerHTML={{
            __html: text,
          }}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
            style={{ marginRight: 10 }}
          />
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDelete(record._id)}
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
        <h1 className="text-2xl font-bold">All Services</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingService(null);
            form.resetFields();
            setFileList([]);
            setIsModalOpen(true);
          }}
        >
          Add Service
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={services}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingService ? "Edit Service" : "Create Service"}
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={confirmLoading}
        onOk={() => form.submit()}
      >
        <Form layout="vertical" form={form} onFinish={handleCreateOrEdit}>
          <Form.Item
            label="Heading"
            name="heading"
            rules={[{ required: true, message: "Please input the heading!" }]}
          >
            <Input placeholder="Enter service heading" />
          </Form.Item>

          <Form.Item
            label="Details"
            name="details"
            rules={[{ required: true, message: "Please input the details!" }]}
          >
            <ReactQuill />
          </Form.Item>

          <Form.Item label="Upload Photo">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false}
            >
              {fileList.length < 1 && "+ Upload"}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Services;
