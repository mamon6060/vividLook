import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Upload, message, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axiosInstance from "../Components/Axios";

const AllPartners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/partners");
      setPartners(data.data.doc);
      setLoading(false);
    } catch (error) {
      message.error("Failed to load partners");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleCreateOrEdit = async () => {
    setConfirmLoading(true); // handleOk
    const formData = new FormData();

    // Append photo only if there is a new photo
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append("photo", fileList[0].originFileObj);
    }

    try {
      if (editingPartner) {
        // Edit existing partner
        await axiosInstance.patch(`/partners/${editingPartner._id}`, formData);
        message.success("Partner updated successfully");
      } else {
        // Create new partner
        await axiosInstance.post("/partners", formData);
        message.success("Partner created successfully");
      }
      setIsModalOpen(false);
      setEditingPartner(null);
      setFileList([]);
      fetchPartners();
    } catch (error) {
      message.error("Failed to save partner");
    } finally {
      setConfirmLoading(false); // Set loading state to false
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/partners/${id}`);
      message.success("Partner deleted successfully");
      fetchPartners();
    } catch (error) {
      message.error("Failed to delete partner");
    }
  };

  const handleUploadChange = ({ fileList }) => setFileList(fileList);

  const columns = [
    {
      title: "Photo",
      dataIndex: "photo",
      key: "photo",
      render: (photo) => (
        <img
          src={photo}
          alt="Partner"
          style={{ width: 100, height: 100, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => new Date(createdAt).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingPartner(record);
              setIsModalOpen(true);

              // Set existing image in fileList with correct structure
              setFileList([
                {
                  uid: "-1",
                  name: "Existing Image",
                  status: "done",
                  url: record.photo,
                },
              ]);
            }}
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
        <h1 className="text-2xl font-bold">All Partners</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingPartner(null);
            setFileList([]);
            setIsModalOpen(true);
          }}
        >
          Add Partner
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={partners}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingPartner ? "Edit Partner" : "Create Partner"}
        visible={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingPartner(null);
          setFileList([]);
        }}
        confirmLoading={confirmLoading}
        onOk={() => {
          if (fileList.length === 0) {
            message.error("Please upload an image");
          } else {
            handleCreateOrEdit();
          }
        }}
      >
        <Form layout="vertical">
          <Form.Item label="Upload Image">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false} // Prevent automatic upload
            >
              {fileList.length < 1 && "+ Upload"}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AllPartners;
