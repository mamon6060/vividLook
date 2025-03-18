import {
  // Badge,
  Button,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  // Switch,
  Table,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import useServiceCategoryActions from "../hooks/useServiceCategoryActions";
import { useState } from "react";

const ServiceCategory = () => {
  const { serviceCategorys, loading, createServiceCategory, updateServiceCategory, deleteServiceCategory } =
    useServiceCategoryActions();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingServiceCategory, setEditingServiceCategory] = useState(null);

  const handleCreateServiceCategory = async (values) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title || "");

      if (editingServiceCategory) {
        await updateServiceCategory(editingServiceCategory._id, formData);
        setEditingServiceCategory(null);
      } else {
        await createServiceCategory(formData);
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to save serviceCategory", error);
    }
  };

  const handleEditServiceCategory = (serviceCategory) => {
    setEditingServiceCategory(serviceCategory);
    setIsModalVisible(true);
    form.setFieldsValue({
      ...serviceCategory,
      // isActive: serviceCategory.isActive,
    });
  };

  const handleDeleteServiceCategory = async (id) => {
    try {
      await deleteServiceCategory(id);
    } catch (error) {
      message.error("Failed to delete serviceCategory", error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingServiceCategory(null);
  };

  // useEffect(() => {
  //   getAllServiceCategorys().then((data) => {
  //     console.log(data);
  //   });
  // });

  console.log(serviceCategorys, "from serviceCategorys");

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex flex-col gap-1">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditServiceCategory(record)}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Are you sure to delete this serviceCategory?"
            onConfirm={() => handleDeleteServiceCategory(record._id)}
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
    <div className="w-full bg-white my-6 p-8 rounded-md">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Service Category</h1>
        <Button
          className="custom-button"
          onClick={() => setIsModalVisible(true)}
          style={{ marginBottom: 16 }}
        >
          <PlusSquareOutlined /> Add New
        </Button>
      </div>

      <Table
        dataSource={serviceCategorys}
        columns={columns}
        rowKey="_id"
        loading={loading}
        scroll={{ x: "max-content" }}
      />

      <Modal
        title={editingServiceCategory ? "Edit Service Category" : "Create Service Category"}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateServiceCategory} layout="vertical">
          <Form.Item
            name="title"
            label="Service Category Title"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Button className="custom-button" htmlType="submit" loading={loading}>
            {editingServiceCategory ? "Update Service Category" : "Create Service Category"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default ServiceCategory;
