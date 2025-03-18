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
import useHomeApplianceCategoryActions from "../hooks/useHomeApplianceCategoryActions";
import { useState } from "react";

const HomeApplianceCategory = () => {
  const {
    homeApplianceCategorys,
    loading,
    createHomeApplianceCategory,
    updateHomeApplianceCategory,
    deleteHomeApplianceCategory,
  } = useHomeApplianceCategoryActions();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingHomeApplianceCategory, setEditingHomeApplianceCategory] =
    useState(null);

  const handleCreateHomeApplianceCategory = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name || "");

      if (editingHomeApplianceCategory) {
        await updateHomeApplianceCategory(
          editingHomeApplianceCategory.slug,
          formData
        );
        setEditingHomeApplianceCategory(null);
      } else {
        await createHomeApplianceCategory(formData);
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to save homeApplianceCategory", error);
    }
  };

  const handleEditHomeApplianceCategory = (homeApplianceCategory) => {
    setEditingHomeApplianceCategory(homeApplianceCategory);
    setIsModalVisible(true);
    form.setFieldsValue({
      ...homeApplianceCategory,
      // isActive: homeApplianceCategory.isActive,
    });
  };

  const handleDeleteHomeApplianceCategory = async (slug) => {
    try {
      await deleteHomeApplianceCategory(slug);
    } catch (error) {
      message.error("Failed to delete homeApplianceCategory", error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingHomeApplianceCategory(null);
  };

  // useEffect(() => {
  //   getAllHomeApplianceCategorys().then((data) => {
  //     console.log(data);
  //   });
  // });

  console.log(homeApplianceCategorys, "from homeApplianceCategorys");

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex flex-col gap-1">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditHomeApplianceCategory(record)}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Are you sure to delete this homeApplianceCategory?"
            onConfirm={() => handleDeleteHomeApplianceCategory(record.slug)}
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
        <h1 className="text-2xl font-bold">Category</h1>
        <Button
          className="custom-button"
          onClick={() => setIsModalVisible(true)}
          style={{ marginBottom: 16 }}
        >
          <PlusSquareOutlined /> Add New
        </Button>
      </div>

      <Table
        dataSource={homeApplianceCategorys}
        columns={columns}
        rowKey="_id"
        loading={loading}
        scroll={{ x: "max-content" }}
      />

      <Modal
        title={
          editingHomeApplianceCategory ? "Edit Category" : "Create Category"
        }
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleCreateHomeApplianceCategory}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Button className="custom-button" htmlType="submit" loading={loading}>
            {editingHomeApplianceCategory ? "Update" : "Create"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default HomeApplianceCategory;
