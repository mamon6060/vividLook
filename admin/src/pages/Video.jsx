import {
  Badge,
  Button,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Switch,
  Table,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import useVideoActions from "../hooks/useVideoActions";
import { useState } from "react";
import { extractYouTubeId } from "../helpers/extractYouTubeId";
import { API_BASE_URL } from "../shared/config";

const Video = () => {
  const { videos, loading, createVideo, updateVideo, deleteVideo } =
    useVideoActions();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingVideo, setEditingVideo] = useState(null);
  // console.log(videos, "from videos");

  const handleCreateVideo = async (values) => {
    try {
      const formData = new FormData();
      formData.append("url", values.url);
      formData.append("type", values.type);
      formData.append("isActive", values.isActive);

      // Only append the photo if it's being changed
      if (values.image && values.image.file) {
        formData.append("image", values.image.file);
      }

      if (editingVideo) {
        await updateVideo(editingVideo._id, formData);
        setEditingVideo(null);
      } else {
        await createVideo(formData);
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to save video", error);
    }
  };

  const handleEditVideo = (video) => {
    setEditingVideo(video);
    setIsModalVisible(true);
    form.setFieldsValue({
      ...video,
      isActive: video.isActive,
      photo: undefined, // Reset photo field to avoid showing previous photo file
    });
  };

  const handleDeleteVideo = async (id) => {
    try {
      await deleteVideo(id);
    } catch (error) {
      message.error("Failed to delete video", error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingVideo(null);
  };
  // console.log(videos, "from videos");

  const columns = [
    {
      title: "Video",
      dataIndex: "url",
      key: "url",
      render: (_, record) => {
        const videoId = extractYouTubeId(record.url);
        return (
          <div>
            {videoId ? (
              <iframe
                className="h-full w-full object-cover rounded duration-300"
                title={`Video player for ${record._id}`}
                src={`https://www.youtube.com/embed/${videoId}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <video
                className="h-full w-full object-cover rounded duration-300"
                src={API_BASE_URL + record.url}
                controls
                aria-label="Video player"
              ></video>
            )}
          </div>
        );
      },
      // record.url ? (
      //   <video width="150" height="100" controls>
      //     <source src={record.url} type="video/mp4" />
      //     Your browser does not support the video tag.
      //   </video>
      // ) : (
      //   "No Video"
      // ),
    },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Badge
          count={isActive ? "Yes" : "No"}
          style={{
            backgroundColor: isActive ? "#52c41a" : "#ff4d4f",
            color: "white",
          }}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex flex-col gap-1">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditVideo(record)}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Are you sure to delete this video?"
            onConfirm={() => handleDeleteVideo(record._id)}
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
        <h1 className="text-2xl font-bold">Videos</h1>
        <Button
          className="custom-button"
          onClick={() => setIsModalVisible(true)}
          style={{ marginBottom: 16 }}
        >
          <PlusSquareOutlined /> Add New
        </Button>
      </div>

      <Table
        dataSource={videos}
        columns={columns}
        rowKey="_id"
        loading={loading}
      />

      <Modal
        title={editingVideo ? "Edit Video" : "Create Video"}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateVideo} layout="vertical">
          <Form.Item
            name="url"
            label="YouTube Video URL"
            rules={[{ required: true, type: "url" }]}
          >
            <Input placeholder="Enter video URL" />
          </Form.Item>
          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Button className="custom-button" htmlType="submit" loading={loading}>
            {editingVideo ? "Update Video" : "Create Video"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Video;
