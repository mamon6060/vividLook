import {
  Badge,
  Button,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Switch,
  Table,
  Upload,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusSquareOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import useBannerActions from "../hooks/useBannerActions";
import { Option } from "antd/es/mentions";
import { useState } from "react";
import { truncateText } from "../helpers/truncateText";

const Banners = () => {
  const { banners, createBanner, updateBanner, deleteBanner, loading } =
    useBannerActions();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingBanner, setEditingBanner] = useState(null);
  const [expandedDetailsText, setExpandedDetailsText] = useState(null);
  const [fileList, setFileList] = useState([]);

  const handleDetailsSeeMore = (id) => {
    setExpandedDetailsText((prevState) => (prevState === id ? null : id));
  };

  const handleCreateBanner = async (values) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title || "");
      formData.append("subTitle", values.subTitle || "");
      formData.append("bannerType", values.bannerType || "");
      // formData.append("link", values.link || "");
      formData.append("isActive", values.isActive || true);

      // Only append the photo if it's being changed
      if (values.photo && values.photo.file) {
        formData.append("photo", values.photo.file);
      }

      if (editingBanner) {
        await updateBanner(editingBanner._id, formData);
        setEditingBanner(null);
      } else {
        await createBanner(formData);
      }

      form.resetFields();
      setFileList([]);
      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to save banner", error);
    }
  };

  const handleEditBanner = (banner) => {
    setEditingBanner(banner);
    setIsModalVisible(true);
    form.setFieldsValue({
      ...banner,
      isActive: banner.isActive,
    });

    const photoUrl = `${banner.photo}`;
    setFileList([
      {
        uid: "-1",
        name: banner.photo.split("/").pop(),
        status: "done",
        url: photoUrl,
      },
    ]);
  };

  const handleDeleteBanner = async (id) => {
    try {
      await deleteBanner(id);
    } catch (error) {
      message.error("Failed to delete banner", error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingBanner(null);
    setFileList([]);
  };

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Sub Title",
      dataIndex: "subTitle",
      key: "subTitle",
      render: (text, record) => {
        const isExpanded = expandedDetailsText === record._id;
        const safeText = text || "";
        return (
          <div>
            <span>
              {isExpanded ? text : truncateText(text)}{" "}
              {safeText.length > 100 && (
                <a
                  onClick={() => handleDetailsSeeMore(record._id)}
                  className="text-blue-500 hover:text-blue-600 cursor-pointer hover:border-b hover:border-b-blue-500"
                >
                  {isExpanded ? "See Less" : "See More"}
                </a>
              )}
            </span>
          </div>
        );
      },
    },
    // {
    //   title: "Link",
    //   dataIndex: "link",
    //   key: "link",
    // },
    {
      title: "Media",
      dataIndex: "photo",
      key: "photo",
      render: (_, record) => (
        <img
          src={`${record.photo}`}
          alt={record.title}
          className="w-[200px] rounded"
        />
      ),
    },
    {
      title: "Banner Type",
      dataIndex: "bannerType",
      key: "bannerType",
      render(bannerType) {
        return (
          <div>
            {bannerType === "main" && (
              <div className="px-2 py-1 bg-green-500 rounded-full text-white flex items-center justify-center">
                Main
              </div>
            )}
            {bannerType === "deals" && (
              <div className="px-2 py-1 bg-violet-500 rounded-full text-white flex items-center justify-center">
                Deals
              </div>
            )}
            {bannerType === "newRelease" && (
              <div className="px-2 py-1 bg-rose-500 rounded-full text-white flex items-center justify-center">
                New release
              </div>
            )}
          </div>
        );
      },
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
  return (
    <div className="bg-white my-6 p-8 rounded-md">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Banners</h1>
        <Button
          className="custom-button"
          onClick={() => setIsModalVisible(true)}
          style={{ marginBottom: 16 }}
        >
          <PlusSquareOutlined /> Add New
        </Button>
      </div>

      <Table
        dataSource={banners}
        columns={columns}
        rowKey="_id"
        loading={loading}
      />

      <Modal
        title={editingBanner ? "Edit Banner" : "Create Banner"}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateBanner} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="subTitle"
            label="Sub Title"
            // rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="bannerType"
            label="Banner Type"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="main">Main</Option>
              {/* <Option value="deals">Deals</Option>
              <Option value="newRelease">New Release</Option> */}
            </Select>
          </Form.Item>
          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item
            name="photo"
            label="Upload Banner Image (Choose maximum 1 photo)"
            valuePropName="file"
            rules={[{ required: true }]}
          >
            <Upload
              listType="picture-card"
              beforeUpload={() => false}
              fileList={fileList}
              onChange={handleFileChange}
              rules={[{ required: true }]}
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>

          <Button className="custom-button" htmlType="submit" loading={loading}>
            {editingBanner ? "Update Banner" : "Create Banner"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Banners;
