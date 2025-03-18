import {
  message,
  // Badge,
  Button,
  // Form,
  // Input,
  // message,
  // Modal,
  Popconfirm,
  // Switch,
  Table,
} from "antd";
import {
  //   EditOutlined,
  DeleteOutlined,
  //   PlusSquareOutlined,
} from "@ant-design/icons";
import useContactActions from "../hooks/useContactActions";
// import { useState } from "react";

const Contacts = () => {
  const { contacts, loading, deleteContact } = useContactActions();

  const handleDeleteContact = async (id) => {
    try {
      await deleteContact(id);
    } catch (error) {
      message.error("Failed to delete contact", error);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex flex-col gap-1">
          <Popconfirm
            title="Are you sure to delete this contact?"
            onConfirm={() => handleDeleteContact(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </div>
      ),
    },
  ];
  return (
    <div className="bg-white my-6 p-8 rounded-md">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Contacts</h1>
      </div>

      <Table
        dataSource={contacts}
        columns={columns}
        rowKey="_id"
        loading={loading}
      />
    </div>
  );
};

export default Contacts;
