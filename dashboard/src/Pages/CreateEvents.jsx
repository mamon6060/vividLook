import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  DatePicker,
  Popconfirm,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import axiosInstance from "../Components/Axios";
import moment from "moment";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const { RangePicker } = DatePicker;

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false); // Loading state for the OK button

  // Fetch events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/events");
      setEvents(data.data.doc);
      setLoading(false);
    } catch (error) {
      message.error("Failed to load events");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle Create or Edit
  const handleCreateOrEdit = async (values) => {
    setConfirmLoading(true);
    const formData = new FormData();
    formData.append("heading", values.heading);
    formData.append("details", values.details);
    formData.append("location", values.location);
    formData.append("startingDate", values.dates[0].toISOString());
    formData.append("endingDate", values.dates[1].toISOString());

    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append("photo", fileList[0].originFileObj);
    } else if (editingEvent && editingEvent.photo) {
      formData.append("photo", editingEvent.photo);
    }

    try {
      if (editingEvent) {
        await axiosInstance.patch(`/events/${editingEvent._id}`, formData);
        message.success("Event updated successfully");
      } else {
        await axiosInstance.post("/events", formData);
        message.success("Event created successfully");
      }
      setIsModalOpen(false);
      setEditingEvent(null);
      setFileList([]);
      fetchEvents();
    } catch (error) {
      message.error("Failed to save event");
    } finally {
      setConfirmLoading(false); // Set loading state to false
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/events/${id}`);
      message.success("Event deleted successfully");
      fetchEvents();
    } catch (error) {
      message.error("Failed to delete event");
    }
  };

  // Handle upload change
  const handleUploadChange = ({ fileList }) => setFileList(fileList);

  // Open modal for editing
  const openEditModal = (event) => {
    setEditingEvent(event);
    form.setFieldsValue({
      heading: event.heading,
      details: event.details,
      location: event.location,
      dates: [moment(event.startingDate), moment(event.endingDate)],
    });
    setFileList([{ url: event.photo, name: "Existing Image" }]);
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: "Photo",
      dataIndex: "photo",
      key: "photo",
      render: (photo) => (
        <img
          src={photo}
          alt="Event"
          style={{ width: 100, height: 100, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Heading",
      dataIndex: "heading",
      key: "heading",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Starting Date",
      dataIndex: "startingDate",
      key: "startingDate",
      render: (startingDate) => moment(startingDate).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Ending Date",
      dataIndex: "endingDate",
      key: "endingDate",
      render: (endingDate) => moment(endingDate).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => moment(createdAt).format("YYYY-MM-DD HH:mm"),
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
        <h1 className="text-2xl font-bold">All Events</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingEvent(null);
            form.resetFields();
            setFileList([]);
            setIsModalOpen(true);
          }}
        >
          Add Event
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={events}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingEvent ? "Edit Event" : "Create Event"}
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={confirmLoading}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleCreateOrEdit}
          initialValues={{
            dates: [],
          }}
        >
          <Form.Item
            label="Event Heading"
            name="heading"
            rules={[{ required: true, message: "Please input the heading!" }]}
          >
            <Input placeholder="Enter event heading" />
          </Form.Item>

          <Form.Item
            label="Event Details"
            name="details"
            rules={[{ required: true, message: "Please input the details!" }]}
          >
            <ReactQuill />
          </Form.Item>

          <Form.Item
            label="Event Location"
            name="location"
            rules={[{ required: true, message: "Please input the Location!" }]}
          >
            <Input placeholder="Enter event Location" />
          </Form.Item>

          <Form.Item
            label="Event Dates"
            name="dates"
            rules={[{ required: true, message: "Please select event dates!" }]}
          >
            <RangePicker
              style={{ width: "100%" }}
              showTime={{ format: "HH:mm" }}
              format="YYYY-MM-DD HH:mm"
            />
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

export default Events;
