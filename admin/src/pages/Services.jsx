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
import useServiceActions from "../hooks/useServiceActions";
import { truncateText } from "../helpers/truncateText";
import { useState } from "react";
import useServiceCategoryActions from "../hooks/useServiceCategoryActions";
import { Option } from "antd/es/mentions";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Description from "../components/Description";

const Services = () => {
  const { services, loading, createService, updateService, deleteService } =
    useServiceActions();
  const { serviceCategorys } = useServiceCategoryActions();
  const [expandedText, setExpandedText] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingService, setEditingService] = useState(null);
  const [fileList, setFileList] = useState([]);

  const handleCreateService = async (values) => {
    try {
      const formData = new FormData();
      formData.append("heading", values.heading || "");
      formData.append("price", values.price || "");
      formData.append("serviceCategoryRef", values.serviceCategoryRef || "");
      formData.append("details", values.details || "");
      formData.append("isActive", values.isActive);

      // Only append the photo if it's being changed
      if (values.photo && values.photo.file) {
        formData.append("photo", values.photo.file);
      }

      if (editingService) {
        await updateService(editingService._id, formData);
        setEditingService(null);
      } else {
        await createService(formData);
      }

      setIsModalVisible(false);
      form.resetFields();
      setFileList([]);
    } catch (error) {
      message.error("Failed to save service", error);
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setIsModalVisible(true);
    form.setFieldsValue({
      ...service,
      serviceCategoryRef: service?.serviceCategoryRef?._id,
      isActive: service.isActive,
    });

    const photoUrl = `${service.photo}`;
    setFileList([
      {
        uid: "-1",
        name: service.photo.split("/").pop(),
        status: "done",
        url: photoUrl,
      },
    ]);
  };

  const handleDeleteService = async (id) => {
    try {
      await deleteService(id);
    } catch (error) {
      message.error("Failed to delete service", error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingService(null);
    setFileList([]);
  };

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // Function to handle the toggle of expanded text
  const handleSeeMore = (id) => {
    setExpandedText((prevState) => (prevState === id ? null : id));
  };
  // console.log(services, "from services");

  const columns = [
    {
      title: "Title",
      dataIndex: "heading",
      key: "heading",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Service Category",
      dataIndex: "serviceCategoryRef",
      key: "serviceCategoryRef",
      render: (_, record) => (
        <div>
          <p>{record?.serviceCategoryRef?.title}</p>
        </div>
      ),
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
      render: (text, record) => {
        // const isExpanded = expandedText === record?._id;
        // const safeText = text || "";
        return (
          <div>
            {/* <span>
              {isExpanded ? text : truncateText(text)}{" "}
              {safeText.length > 100 && (
                <a
                  onClick={() => handleSeeMore(record._id)}
                  className="text-blue-500 hover:text-blue-600 cursor-pointer hover:border-b hover:border-b-blue-500"
                >
                  {isExpanded ? "See Less" : "See More"}
                </a>
              )}
            </span> */}
            <Description content={text} />
          </div>
        );
      },
    },
    {
      title: "Media",
      dataIndex: "photo",
      key: "photo",
      render: (_, record) => (
        // console.log(record)
        <img
          src={`${record?.photo}`}
          alt={record?.title}
          className="w-[200px] rounded"
        />
      ),
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
            onClick={() => handleEditService(record)}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Are you sure to delete this service?"
            onConfirm={() => handleDeleteService(record._id)}
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
        <h1 className="text-2xl font-bold">Services</h1>
        <Button
          className="custom-button"
          onClick={() => setIsModalVisible(true)}
          style={{ marginBottom: 16 }}
        >
          <PlusSquareOutlined /> Add New
        </Button>
      </div>

      <Table
        dataSource={services}
        columns={columns}
        rowKey="_id"
        loading={loading}
      />

      <Modal
        title={editingService ? "Edit Service" : "Create Service"}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateService} layout="vertical">
          <Form.Item name="heading" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="serviceCategoryRef"
            label="Service Category"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              placeholder="Select a service category"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {serviceCategorys.map((category) => (
                <Option key={category._id} value={category._id}>
                  {category.title}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="details"
            label="Details"
            // rules={[{ required: true }]}
          >
            <ReactQuill />
          </Form.Item>

          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item
            name="photo"
            label="Upload Service Image (Choose maximum 1 photo)"
            valuePropName="file"
            rules={[{ required: true }]}
          >
            <Upload
              listType="picture-card"
              beforeUpload={() => false}
              rules={[{ required: true }]}
              fileList={fileList}
              onChange={handleFileChange}
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>

          <Button className="custom-button" htmlType="submit" loading={loading}>
            {editingService ? "Update Service" : "Create Service"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Services;
