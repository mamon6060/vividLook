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
import useDistrictActions from "../hooks/useDistrictActions";
import { useState } from "react";

const District = () => {
  const { districts, loading, createDistrict, updateDistrict, deleteDistrict } =
    useDistrictActions();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingDistrict, setEditingDistrict] = useState(null);

  const handleCreateDistrict = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name || "");

      if (editingDistrict) {
        await updateDistrict(editingDistrict._id, formData);
        setEditingDistrict(null);
      } else {
        await createDistrict(formData);
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to save district", error);
    }
  };

  const handleEditDistrict = (district) => {
    setEditingDistrict(district);
    setIsModalVisible(true);
    form.setFieldsValue({
      ...district,
      // isActive: district.isActive,
    });
  };

  const handleDeleteDistrict = async (id) => {
    try {
      await deleteDistrict(id);
    } catch (error) {
      message.error("Failed to delete district", error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingDistrict(null);
  };

  // useEffect(() => {
  //   getAllDistricts().then((data) => {
  //     console.log(data);
  //   });
  // });

  console.log(districts, "from districts");

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
            onClick={() => handleEditDistrict(record)}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Are you sure to delete this district?"
            onConfirm={() => handleDeleteDistrict(record._id)}
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
        <h1 className="text-2xl font-bold">Districts</h1>
        <Button
          className="custom-button"
          onClick={() => setIsModalVisible(true)}
          style={{ marginBottom: 16 }}
        >
          <PlusSquareOutlined /> Add New
        </Button>
      </div>

      <Table
        dataSource={districts}
        columns={columns}
        rowKey="_id"
        loading={loading}
        scroll={{ x: "max-content" }}
      />

      <Modal
        title={editingDistrict ? "Edit District" : "Create District"}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateDistrict} layout="vertical">
          <Form.Item
            name="name"
            label="District Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Button className="custom-button" htmlType="submit" loading={loading}>
            {editingDistrict ? "Update District" : "Create District"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default District;
