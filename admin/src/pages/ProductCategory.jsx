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
import useProductCategoryActions from "../hooks/useProductCategoryActions";
import { useState } from "react";

const ProductCategory = () => {
  const { productCategorys, loading, createProductCategory, updateProductCategory, deleteProductCategory } =
    useProductCategoryActions();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingProductCategory, setEditingProductCategory] = useState(null);

  const handleCreateProductCategory = async (values) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title || "");

      if (editingProductCategory) {
        await updateProductCategory(editingProductCategory.slug, formData);
        setEditingProductCategory(null);
      } else {
        await createProductCategory(formData);
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to save productCategory", error);
    }
  };

  const handleEditProductCategory = (productCategory) => {
    setEditingProductCategory(productCategory);
    setIsModalVisible(true);
    form.setFieldsValue({
      ...productCategory,
      // isActive: productCategory.isActive,
    });
  };

  const handleDeleteProductCategory = async (slug) => {
    try {
      await deleteProductCategory(slug);
    } catch (error) {
      message.error("Failed to delete productCategory", error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingProductCategory(null);
  };

  // useEffect(() => {
  //   getAllProductCategorys().then((data) => {
  //     console.log(data);
  //   });
  // });

  console.log(productCategorys, "from productCategorys");

  const columns = [
    {
      title: "Name",
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
            onClick={() => handleEditProductCategory(record)}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Are you sure to delete this productCategory?"
            onConfirm={() => handleDeleteProductCategory(record.slug)}
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
        <h1 className="text-2xl font-bold">Spare Parts Category</h1>
        <Button
          className="custom-button"
          onClick={() => setIsModalVisible(true)}
          style={{ marginBottom: 16 }}
        >
          <PlusSquareOutlined /> Add New
        </Button>
      </div>

      <Table
        dataSource={productCategorys}
        columns={columns}
        rowKey="_id"
        loading={loading}
        scroll={{ x: "max-content" }}
      />

      <Modal
        title={editingProductCategory ? "Edit Category" : "Create Category"}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateProductCategory} layout="vertical">
          <Form.Item
            name="title"
            label="Category Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Button className="custom-button" htmlType="submit" loading={loading}>
            {editingProductCategory ? "Update" : "Create"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductCategory;
