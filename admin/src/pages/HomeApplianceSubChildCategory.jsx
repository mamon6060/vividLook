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
import useHomeApplianceSubChildCategoryActions from "../hooks/useHomeApplianceSubChildCategoryActions";
import { useState } from "react";
import useHomeApplianceSubCategoryActions from "../hooks/useHomeApplianceSubCategoryActions";

const HomeApplianceSubChildCategory = () => {
  const {
    homeApplianceSubChildCategorys,
    loading,
    createHomeApplianceSubChildCategory,
    updateHomeApplianceSubChildCategory,
    deleteHomeApplianceSubChildCategory,
  } = useHomeApplianceSubChildCategoryActions();
  const { homeApplianceSubCategorys } = useHomeApplianceSubCategoryActions();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [
    editingHomeApplianceSubChildCategory,
    setEditingHomeApplianceSubChildCategory,
  ] = useState(null);

  const handleCreateHomeApplianceSubChildCategory = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name || "");
      formData.append("subcategory", values.subcategory || "");

      if (editingHomeApplianceSubChildCategory) {
        await updateHomeApplianceSubChildCategory(
          editingHomeApplianceSubChildCategory.slug,
          formData
        );
        setEditingHomeApplianceSubChildCategory(null);
      } else {
        await createHomeApplianceSubChildCategory(formData);
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to save homeApplianceSubChildCategory", error);
    }
  };

  const handleEditHomeApplianceSubChildCategory = (
    homeApplianceSubChildCategory
  ) => {
    setEditingHomeApplianceSubChildCategory(homeApplianceSubChildCategory);
    setIsModalVisible(true);
    form.setFieldsValue({
      ...homeApplianceSubChildCategory,
      category: homeApplianceSubChildCategory.category?._id,
      // isActive: homeApplianceSubChildCategory.isActive,
    });
  };

  const handleDeleteHomeApplianceSubChildCategory = async (slug) => {
    try {
      await deleteHomeApplianceSubChildCategory(slug);
    } catch (error) {
      message.error("Failed to delete homeApplianceSubChildCategory", error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingHomeApplianceSubChildCategory(null);
  };

  // useEffect(() => {
  //   getAllHomeApplianceSubChildCategorys().then((data) => {
  //     console.log(data);
  //   });
  // });

  console.log(
    homeApplianceSubChildCategorys,
    "from homeApplianceSubChildCategorys"
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Subcategory",
      dataIndex: "subcategory",
      key: "subcategory",
      render: (_, record) => <div>{record?.subcategory?.name}</div>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex flex-col gap-1">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditHomeApplianceSubChildCategory(record)}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Are you sure to delete this homeApplianceSubChildCategory?"
            onConfirm={() =>
              handleDeleteHomeApplianceSubChildCategory(record.slug)
            }
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
        <h1 className="text-2xl font-bold">
          Subcategory
        </h1>
        <Button
          className="custom-button"
          onClick={() => setIsModalVisible(true)}
          style={{ marginBottom: 16 }}
        >
          <PlusSquareOutlined /> Add New
        </Button>
      </div>

      <Table
        dataSource={homeApplianceSubChildCategorys}
        columns={columns}
        rowKey="_id"
        loading={loading}
        scroll={{ x: "max-content" }}
      />

      <Modal
        title={
          editingHomeApplianceSubChildCategory
            ? "Edit Subcategory"
            : "Create Subcategory"
        }
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleCreateHomeApplianceSubChildCategory}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Title"
            rules={[
              {
                required: true,
                message: "Please enter the homeApplianceSubChildCategory name",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="subcategory"
            label="Brand"
            rules={[{ required: true, message: "Please select a subcategory" }]}
          >
            <Select>
              {homeApplianceSubCategorys.map((subcategory) => (
                <Select.Option key={subcategory._id} value={subcategory._id}>
                  {subcategory.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Button className="custom-button" htmlType="submit" loading={loading}>
            {editingHomeApplianceSubChildCategory ? "Update" : "Create"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default HomeApplianceSubChildCategory;
