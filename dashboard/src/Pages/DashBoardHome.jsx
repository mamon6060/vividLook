import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axiosInstance from "../Components/Axios";

const { Option } = Select;

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/users");
      setUsers(response.data.data.doc);
    } catch (error) {
      message.error("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  const showEditModal = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      verified: user.verified,
    });
    setIsModalVisible(true);
  };

  const handleEdit = async () => {
    try {
      const values = await form.validateFields();
      const response = await axiosInstance.patch(
        `/users/${editingUser._id}`,
        values
      );

      if (response.data.status === "success") {
        message.success("User updated successfully!");
        setIsModalVisible(false);
        fetchUsers();
      }
    } catch (error) {
      message.error("Failed to update user.");
    }
  };

  const handleDelete = async (userId) => {
    try {
      const response = await axiosInstance.delete(`/users/${userId}`);

      if (response.data.status === "success") {
        message.success("User deleted successfully!");
        fetchUsers();
      }
    } catch (error) {
      message.error("Failed to delete user.");
    }
  };

  const columns = [
    {
      title: "Photo",
      dataIndex: "photo",
      key: "photo",
      render: (photo) =>
        photo ? (
          <img src={photo} alt="User" className="w-10 h-10 rounded-full" />
        ) : (
          <img
            src={
              "https://simplydoorsandwindows.com.au/wp-content/uploads/2014/08/avatar-person-neutral-man-blank-face-buddy.png"
            }
            alt="User"
            className="w-10 h-10 rounded-full"
          />
        ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Date of Birth",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      render: (dateOfBirth) =>
        dateOfBirth ? new Date(dateOfBirth).toLocaleDateString() : "N/A",
    },

    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Street Address",
      dataIndex: "streetAddress",
      key: "streetAddress",
    },
    {
      title: "Shop Address",
      dataIndex: "shopAddress",
      key: "shopAddress",
    },
    {
      title: "Upazilla",
      dataIndex: "upazilla",
      key: "upazilla",
    },
    {
      title: "District",
      dataIndex: "district",
      key: "district",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Verified",
      dataIndex: "verified",
      key: "verified",
      render: (verified) => (verified ? "Yes" : "No"),
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
            title="Are you sure to delete this user?"
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
      <h1 className="text-2xl font-bold mb-4  mx-auto w-full text-center">
        All Users
      </h1>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="_id"
        loading={loading}
        scroll={{ x: 'max-content' }}
      />

      {/* Edit Modal */}
      <Modal
        title="Edit User"
        visible={isModalVisible}
        onOk={handleEdit}
        onCancel={() => setIsModalVisible(false)}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: "Please input the user's name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input the user's email!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              {
                required: true,
                message: "Please input the user's Phone Number!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[
              { required: true, message: "Please select the user's role!" },
            ]}
          >
            <Select>
              <Option value="admin">Admin</Option>
              <Option value="user">User</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="verified"
            label="Verified"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value={true}>Yes</Option>
              <Option value={false}>No</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AllUsers;
