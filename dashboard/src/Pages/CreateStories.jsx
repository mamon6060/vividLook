import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  Radio,
  message,
  Popconfirm,
} from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import axiosInstance from "../Components/Axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
const { TextArea } = Input;

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentStory, setCurrentStory] = useState(null);
  const [form] = Form.useForm();
  const [mediaType, setMediaType] = useState("photo"); // photo or youtube
  const [fileList, setFileList] = useState([]);
  const [expandedText, setExpandedText] = useState({});
  const [confirmLoading, setConfirmLoading] = useState(false); // Loading state for the OK button

  // Fetch stories
  const fetchStories = async () => {
    try {
      const res = await axiosInstance.get("/stories");
      setStories(res.data.data.doc);
    } catch (error) {
      message.error("Failed to load stories.");
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const showModal = (story = null) => {
    setIsModalVisible(true);
    if (story) {
      setIsEditMode(true);
      setCurrentStory(story);
      form.setFieldsValue(story);

      if (isYouTubeLink(story.photo)) {
        setMediaType("youtube");
        form.setFieldsValue({ photo: story.photo });
        setFileList([]);
      } else {
        setMediaType("photo");
        setFileList([{ uid: -1, url: story.photo }]);
      }
    } else {
      setIsEditMode(false);
      form.resetFields();
      setMediaType("photo");
      setFileList([]);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/stories/${id}`);
      message.success("Story deleted successfully.");
      fetchStories();
    } catch (error) {
      message.error("Failed to delete story.");
    }
  };

  const handleSubmit = async (values) => {
    setConfirmLoading(true); // handleOk

    const formData = new FormData();
    formData.append("text", values.text);
    formData.append("name", values.name);
    formData.append("address", values.address);

    if (mediaType === "photo") {
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("photo", fileList[0].originFileObj);
      } else if (
        isEditMode &&
        currentStory &&
        currentStory.photo &&
        !isYouTubeLink(currentStory.photo)
      ) {
        formData.append("photo", currentStory.photo);
      } else {
        return message.error("Please upload a photo.");
      }
    } else if (mediaType === "youtube") {
      if (values.photo && isYouTubeLink(values.photo)) {
        formData.append("photo", values.photo);
      } else {
        return message.error("Please provide a valid YouTube link.");
      }
    }

    try {
      if (isEditMode && currentStory) {
        await axiosInstance.patch(`/stories/${currentStory._id}`, formData);
        message.success("Story updated successfully.");
      } else {
        await axiosInstance.post("/stories", formData);
        message.success("Story created successfully.");
      }
      fetchStories();
      setIsModalVisible(false);
      setFileList([]);
      form.resetFields();
    } catch (error) {
      message.error("Failed to save story.");
    } finally {
      setConfirmLoading(false); // Set loading state to false
    }
  };
  const truncateText = (text) => {
    const words = text.split(" ");
    if (words.length > 100) {
      return words.slice(0, 100).join(" ") + "...";
    }
    return text;
  };

  const handleReadMore = (id) => {
    setExpandedText((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const columns = [
    {
      title: "Photo/Video",
      dataIndex: "photo",
      key: "photo",
      render: (text) =>
        isYouTubeLink(text) ? (
          <iframe
            title="YouTube Video"
            src={text}
            width="100px"
            height="100px"
          />
        ) : (
          <img
            src={text}
            alt="Story Media"
            style={{ width: "100px", height: "100px" }}
          />
        ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },

    {
      width: "30%",
      title: "Text",
      dataIndex: "text",
      key: "text",
      render: (text, record) => (
        <div>
          <div
            dangerouslySetInnerHTML={{
              __html: expandedText[record._id] ? text : truncateText(text),
            }}
          />
          {text.split(" ").length > 200 && (
            <Button type="link" onClick={() => handleReadMore(record._id)}>
              {expandedText[record._id] ? "Read less" : "Read more"}
            </Button>
          )}
        </div>
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },

    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <>
          <Button
            onClick={() => showModal(record)}
            type="primary"
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this story?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger">Delete</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  const isYouTubeLink = (url) => {
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return youtubeRegex.test(url);
  };

  return (
    <>
      <div className="flex justify-between mb-4 mt-5">
        <h1 className="text-2xl font-bold">All Storys</h1>
        <Button
          type="primary"
          onClick={() => showModal(null)}
          style={{ marginBottom: 16 }}
        >
          <PlusOutlined /> Add Story
        </Button>
      </div>

      <Table columns={columns} dataSource={stories} rowKey="_id" />

      <Modal
        title={isEditMode ? "Edit Story" : "Create Story"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        confirmLoading={confirmLoading}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please input the address!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Text"
            name="text"
            rules={[
              { required: true, message: "Please input the story text!" },
            ]}
          >
            <ReactQuill />
          </Form.Item>
          <Form.Item label="Media Type">
            <Radio.Group
              onChange={(e) => setMediaType(e.target.value)}
              value={mediaType}
            >
              <Radio value="photo">Upload Photo</Radio>
              <Radio value="youtube">YouTube Link</Radio>
            </Radio.Group>
          </Form.Item>
          {mediaType === "photo" ? (
            <Form.Item label="Upload Photo">
              <Upload
                listType="picture"
                maxCount={1}
                beforeUpload={() => false}
                fileList={fileList}
                onChange={(info) => setFileList(info.fileList)}
              >
                <Button icon={<UploadOutlined />}>Upload (Max: 1)</Button>
              </Upload>
            </Form.Item>
          ) : (
            <Form.Item
              label="YouTube Link"
              name="photo"
              rules={[
                {
                  required: mediaType === "youtube",
                  message: "Please input a YouTube link!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default Stories;
