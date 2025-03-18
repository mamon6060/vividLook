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
import useMechanicActions from "../hooks/useMechanicActions";
import { useState } from "react";
import { Option } from "antd/es/mentions";
import useDistrictActions from "../hooks/useDistrictActions";
import useThanaActions from "../hooks/useThanaActions";
import useAreaActions from "../hooks/useAreaActions";

const Mechanic = () => {
  const { mechanics, loading, createMechanic, updateMechanic, deleteMechanic } =
    useMechanicActions();
  const { districts } = useDistrictActions();
  const { thanas } = useThanaActions();
  const { areas } = useAreaActions();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingMechanic, setEditingMechanic] = useState(null);
  // const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [filteredThanas, setFilteredThanas] = useState([]);
  const [filteredAreas, setFilteredAreas] = useState([]);

  const handleCreateMechanic = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name || "");
      formData.append("email", values.email || "");
      formData.append("phone", values.phone || "");
      formData.append("areaRef", values.areaRef || "");
      formData.append("thanaRef", values.thanaRef || "");
      formData.append("districtRef", values.districtRef || "");

      if (editingMechanic) {
        await updateMechanic(editingMechanic._id, formData);
        setEditingMechanic(null);
      } else {
        await createMechanic(formData);
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to save mechanic", error);
    }
  };

  const handleEditMechanic = (mechanic) => {
    setEditingMechanic(mechanic);
    setIsModalVisible(true);

    console.log(mechanic, "mechanic from edit click >>>>>>>>>>>>>>>>>");

    const relatedThanas = thanas.filter(
      (thana) => thana._id === mechanic.areaRef.thanaRef._id
    );
    setFilteredThanas(relatedThanas);

    const relatedAreas = areas.filter(
      (area) => area._id === mechanic.areaRef._id
    );
    setFilteredAreas(relatedAreas);

    form.setFieldsValue({
      ...mechanic,
      districtRef: mechanic?.areaRef?.thanaRef?.districtRef?._id,
      thanaRef: mechanic?.areaRef?.thanaRef?._id,
      areaRef: mechanic?.areaRef?._id,
      // isActive: mechanic.isActive,
    });
  };

  const handleDeleteMechanic = async (id) => {
    try {
      await deleteMechanic(id);
    } catch (error) {
      message.error("Failed to delete mechanic", error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingMechanic(null);
  };

  // useEffect(() => {
  //   getAllMechanics().then((data) => {
  //     console.log(data);
  //   });
  // });

  console.log(mechanics, "from mechanics");

  // const handleDistrictChange = (districtId) => {
  //   // setSelectedDistrict(districtId);

  //   // Filter thanas based on selected district
  //   const filtered = thanas.filter(
  //     (thana) => thana.districtRef._id === districtId
  //   );
  //   setFilteredThanas(filtered);

  //   // Reset the thana selection when district changes
  //   form.setFieldsValue({ thanaRef: null });
  // };

  const handleDistrictChange = (districtId) => {
    const filtered = thanas
      .filter((thana) => thana.districtRef._id === districtId)
      .map((thana) => ({ _id: thana._id, name: thana.name })); // Keep both id & name

    setFilteredThanas(filtered);
    setFilteredAreas([]); // Reset areas when district changes
    form.setFieldsValue({ thanaRef: null, areaRef: null });
  };

  // const handleThanaChange = (thanaId) => {
  //   // setSelectedThana(thanaId);

  //   // Filter areas based on selected thana
  //   const filtered = areas.filter((thana) => thana.thanaRef._id === thanaId);
  //   setFilteredAreas(filtered);

  //   // Reset the thana selection when thana changes
  //   form.setFieldsValue({ areaRef: null });
  // };

  const handleThanaChange = (thanaId) => {
    const filtered = areas
      .filter((area) => area.thanaRef._id === thanaId)
      .map((area) => ({ _id: area._id, name: area.name })); // Keep both id & name

    setFilteredAreas(filtered);
    form.setFieldsValue({ areaRef: null });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Total Service",
      dataIndex: "totalService",
      key: "totalService",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Area",
      dataIndex: "areaRef",
      key: "areaRef",
      render: (_, record) => (
        <div>
          <p>{record?.areaRef?.name}</p>
        </div>
      ),
    },
    {
      title: "Thana",
      dataIndex: "thanaRef",
      key: "thanaRef",
      render: (_, record) => (
        <div>
          <p>{record?.areaRef?.thanaRef?.name}</p>
        </div>
      ),
    },
    {
      title: "District",
      dataIndex: "districtRef",
      key: "districtRef",
      render: (_, record) => (
        <div>
          <p>{record?.areaRef?.thanaRef?.districtRef?.name}</p>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex flex-col gap-1">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditMechanic(record)}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Are you sure to delete this mechanic?"
            onConfirm={() => handleDeleteMechanic(record._id)}
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
        <h1 className="text-2xl font-bold">Mechanics</h1>
        <Button
          className="custom-button"
          onClick={() => setIsModalVisible(true)}
          style={{ marginBottom: 16 }}
        >
          <PlusSquareOutlined /> Add New
        </Button>
      </div>

      <Table
        dataSource={mechanics}
        columns={columns}
        rowKey="_id"
        loading={loading}
        scroll={{ x: "max-content" }}
      />

      <Modal
        title={editingMechanic ? "Edit Mechanic" : "Create Mechanic"}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateMechanic} layout="vertical">
          <Form.Item
            name="name"
            label="Mechanic Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            // rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone No."
            rules={[{ required: true }]}
          >
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

          {/* <Form.Item name="thanaRef" label="Thana" rules={[{ required: true }]}>
            <Select onChange={handleThanaChange}>
              {filteredThanas.map((thana) => (
                <Option key={thana._id} value={thana._id}>
                  {thana.name}
                </Option>
              ))}
            </Select>
          </Form.Item> */}

          <Form.Item name="thanaRef" label="Thana" rules={[{ required: true }]}>
            <Select onChange={handleThanaChange}>
              {filteredThanas.map((thana) => (
                <Option key={thana._id} value={thana._id}>
                  {thana.name} {/* Ensure name is displayed */}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* <Form.Item name="areaRef" label="Area" rules={[{ required: true }]}>
            <Select>
              {filteredAreas.map((area) => (
                <Option key={area._id} value={area._id}>
                  {area.name}
                </Option>
              ))}
            </Select>
          </Form.Item> */}

          <Form.Item name="areaRef" label="Area" rules={[{ required: true }]}>
            <Select>
              {filteredAreas.map((area) => (
                <Option key={area._id} value={area._id}>
                  {area.name} {/* Ensure name is displayed */}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Button className="custom-button" htmlType="submit" loading={loading}>
            {editingMechanic ? "Update Mechanic" : "Create Mechanic"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Mechanic;
