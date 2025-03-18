import {
  // Badge,
  Button,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  // Switch,
  Table,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import useHomeApplianceSubCategoryActions from "../hooks/useHomeApplianceSubCategoryActions";
import { useState } from "react";
import useHomeApplianceCategoryActions from "../hooks/useHomeApplianceCategoryActions";

const HomeApplianceSubCategory = () => {
  const {
    homeApplianceSubCategorys,
    loading,
    createHomeApplianceSubCategory,
    updateHomeApplianceSubCategory,
    deleteHomeApplianceSubCategory,
  } = useHomeApplianceSubCategoryActions();
  const { homeApplianceCategorys } = useHomeApplianceCategoryActions();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingHomeApplianceSubCategory, setEditingHomeApplianceSubCategory] =
    useState(null);

  const handleCreateHomeApplianceSubCategory = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name || "");
      formData.append("category", values.category || "");

      if (editingHomeApplianceSubCategory) {
        await updateHomeApplianceSubCategory(
          editingHomeApplianceSubCategory.slug,
          formData
        );
        setEditingHomeApplianceSubCategory(null);
      } else {
        await createHomeApplianceSubCategory(formData);
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to save homeApplianceSubCategory", error);
    }
  };

  const handleEditHomeApplianceSubCategory = (homeApplianceSubCategory) => {
    setEditingHomeApplianceSubCategory(homeApplianceSubCategory);
    setIsModalVisible(true);
    form.setFieldsValue({
      ...homeApplianceSubCategory,
      category: homeApplianceSubCategory.category?._id,
      // isActive: homeApplianceSubCategory.isActive,
    });
  };

  const handleDeleteHomeApplianceSubCategory = async (slug) => {
    try {
      await deleteHomeApplianceSubCategory(slug);
    } catch (error) {
      message.error("Failed to delete homeApplianceSubCategory", error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingHomeApplianceSubCategory(null);
  };

  // useEffect(() => {
  //   getAllHomeApplianceSubCategorys().then((data) => {
  //     console.log(data);
  //   });
  // });

  console.log(homeApplianceSubCategorys, "from homeApplianceSubCategorys");

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (_, record) => <div>{record?.category?.name}</div>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex flex-col gap-1">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditHomeApplianceSubCategory(record)}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Are you sure to delete this homeApplianceSubCategory?"
            onConfirm={() => handleDeleteHomeApplianceSubCategory(record.slug)}
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
        <h1 className="text-2xl font-bold">Brands</h1>
        <Button
          className="custom-button"
          onClick={() => setIsModalVisible(true)}
          style={{ marginBottom: 16 }}
        >
          <PlusSquareOutlined /> Add New
        </Button>
      </div>

      <Table
        dataSource={homeApplianceSubCategorys}
        columns={columns}
        rowKey="_id"
        loading={loading}
        scroll={{ x: "max-content" }}
      />

      <Modal
        title={editingHomeApplianceSubCategory ? "Edit Brand" : "Create Brand"}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleCreateHomeApplianceSubCategory}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Title"
            rules={[
              {
                required: true,
                message: "Please enter the homeApplianceSubCategory name",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select>
              {homeApplianceCategorys.map((category) => (
                <Select.Option key={category._id} value={category._id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Button className="custom-button" htmlType="submit" loading={loading}>
            {editingHomeApplianceSubCategory ? "Update" : "Create"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default HomeApplianceSubCategory;
