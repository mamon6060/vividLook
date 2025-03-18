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
import useThanaActions from "../hooks/useThanaActions";
import { useState } from "react";
import { Option } from "antd/es/mentions";
import useDistrictActions from "../hooks/useDistrictActions";

const Thana = () => {
  const { thanas, loading, createThana, updateThana, deleteThana } =
    useThanaActions();
  const { districts } = useDistrictActions();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingThana, setEditingThana] = useState(null);

  const handleCreateThana = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name || "");
      formData.append("districtRef", values.districtRef || "");

      if (editingThana) {
        await updateThana(editingThana._id, formData);
        setEditingThana(null);
      } else {
        await createThana(formData);
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to save thana", error);
    }
  };

  const handleEditThana = (thana) => {
    setEditingThana(thana);
    setIsModalVisible(true);
    form.setFieldsValue({
      ...thana,
      districtRef: thana?.districtRef?._id,
      // isActive: thana.isActive,
    });
  };

  const handleDeleteThana = async (id) => {
    try {
      await deleteThana(id);
    } catch (error) {
      message.error("Failed to delete thana", error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingThana(null);
  };

  // useEffect(() => {
  //   getAllThanas().then((data) => {
  //     console.log(data);
  //   });
  // });

  console.log(thanas, "from thanas");

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "District",
      dataIndex: "districtRef",
      key: "districtRef",
      render: (_, record) => (
        <div>
          <p>{record?.districtRef?.name}</p>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex flex-col gap-1">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditThana(record)}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Are you sure to delete this thana?"
            onConfirm={() => handleDeleteThana(record._id)}
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
        <h1 className="text-2xl font-bold">Thanas</h1>
        <Button
          className="custom-button"
          onClick={() => setIsModalVisible(true)}
          style={{ marginBottom: 16 }}
        >
          <PlusSquareOutlined /> Add New
        </Button>
      </div>

      <Table
        dataSource={thanas}
        columns={columns}
        rowKey="_id"
        loading={loading}
        scroll={{ x: "max-content" }}
      />

      <Modal
        title={editingThana ? "Edit Thana" : "Create Thana"}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateThana} layout="vertical">
          <Form.Item
            name="name"
            label="Thana Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="districtRef"
            label="District"
            rules={[{ required: true }]}
          >
            <Select>
              {districts.map((district) => (
                <Option key={district._id} value={district._id}>
                  {district.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Button className="custom-button" htmlType="submit" loading={loading}>
            {editingThana ? "Update Thana" : "Create Thana"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Thana;
