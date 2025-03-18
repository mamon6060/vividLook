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
import useAreaActions from "../hooks/useAreaActions";
import { useState } from "react";
import { Option } from "antd/es/mentions";
import useDistrictActions from "../hooks/useDistrictActions";
import useThanaActions from "../hooks/useThanaActions";

const Area = () => {
  const { areas, loading, createArea, updateArea, deleteArea } =
    useAreaActions();
  const { districts } = useDistrictActions();
  const { thanas } = useThanaActions();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingArea, setEditingArea] = useState(null);
  // const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [filteredThanas, setFilteredThanas] = useState([]);

  console.log(filteredThanas, "filtered thanas ================");

  const handleCreateArea = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name || "");
      formData.append("thanaRef", values.thanaRef || "");
      formData.append("districtRef", values.districtRef || "");

      if (editingArea) {
        await updateArea(editingArea._id, formData);
        setEditingArea(null);
      } else {
        await createArea(formData);
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to save area", error);
    }
  };

  const handleEditArea = (area) => {
    setEditingArea(area);
    setIsModalVisible(true);
    console.log(area, "area after edit click ++++++++++++++++++++");

    // Ensure the filtered thanas list includes the edited area's thana
    const relatedThanas = thanas.filter(
      (thana) => thana.districtRef._id === area.districtRef._id
    );
    setFilteredThanas(relatedThanas);

    form.setFieldsValue({
      ...area,
      thanaRef: area?.thanaRef?._id,
      districtRef: area?.districtRef?._id,
      // isActive: area.isActive,
    });
  };

  const handleDeleteArea = async (id) => {
    try {
      await deleteArea(id);
    } catch (error) {
      message.error("Failed to delete area", error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingArea(null);
  };

  // useEffect(() => {
  //   getAllAreas().then((data) => {
  //     console.log(data);
  //   });
  // });

  console.log(areas, "from areas");

  const handleDistrictChange = (districtId) => {
    // setSelectedDistrict(districtId);

    // Filter thanas based on selected district
    const filtered = thanas.filter(
      (thana) => thana.districtRef._id === districtId
    );
    setFilteredThanas(filtered);

    // Reset the thana selection when district changes
    form.setFieldsValue({ thanaRef: null });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Thana",
      dataIndex: "thanaRef",
      key: "thanaRef",
      render: (_, record) => (
        <div>
          <p>{record?.thanaRef?.name}</p>
        </div>
      ),
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
            onClick={() => handleEditArea(record)}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Are you sure to delete this area?"
            onConfirm={() => handleDeleteArea(record._id)}
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
        <h1 className="text-2xl font-bold">Areas</h1>
        <Button
          className="custom-button"
          onClick={() => setIsModalVisible(true)}
          style={{ marginBottom: 16 }}
        >
          <PlusSquareOutlined /> Add New
        </Button>
      </div>

      <Table
        dataSource={areas}
        columns={columns}
        rowKey="_id"
        loading={loading}
        scroll={{ x: "max-content" }}
      />

      <Modal
        title={editingArea ? "Edit Area" : "Create Area"}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateArea} layout="vertical">
          <Form.Item name="name" label="Area Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="districtRef"
            label="District"
            rules={[{ required: true }]}
          >
            <Select onChange={handleDistrictChange}>
              {districts.map((district) => (
                <Option key={district._id} value={district._id}>
                  {district.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="thanaRef" label="Thana" rules={[{ required: true }]}>
            <Select>
              {filteredThanas.map((thana) => (
                <Option key={thana._id} value={thana._id}>
                  {thana.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Button className="custom-button" htmlType="submit" loading={loading}>
            {editingArea ? "Update Area" : "Create Area"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Area;
