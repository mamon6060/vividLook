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
  Upload,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusSquareOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import usePartnerActions from "../hooks/usePartnerActions";
import { useState } from "react";

const Partner = () => {
  const { partners, loading, createPartner, updatePartner, deletePartner } =
    usePartnerActions();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingPartner, setEditingPartner] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList); // This will keep track of selected files
  };

  const handleRemoveImage = (file) => {
    if (file.url) {
      setRemovedImages((prev) => [...prev, file.url.replace("")]);
    }

    setFileList((prev) => prev.filter((item) => item.uid !== file.uid));

    return false;
  };

  const handleCreatePartner = async (values) => {
    try {
      const formData = new FormData();
      // Append new images
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("photo", file.originFileObj);
        }
      });

      // Append removed images (for update)
      if (editingPartner) {
        removedImages.forEach((imageUrl) => {
          formData.append("removedImages", imageUrl);
        });
      }

      if (editingPartner) {
        await updatePartner(editingPartner._id, formData);
        setEditingPartner(null);
      } else {
        await createPartner(formData);
      }

      setIsModalVisible(false);
      form.resetFields();
      setFileList([]);
    } catch (error) {
      message.error("Failed to save partner", error);
    }
  };

  const handleEditPartner = (partner) => {
    setEditingPartner(partner);
    setIsModalVisible(true);
    form.setFieldsValue({
      ...partner,
      // isActive: partner.isActive,
    });

    // Initialize fileList with existing images
    if (Array.isArray(partner.photos) && partner.photos.length > 0) {
      const initialFileList = partner.photos.map((imgUrl, index) => ({
        uid: `-${index + 1}`,
        name: imgUrl.split("/").pop(),
        status: "done",
        url: `${imgUrl}`,
      }));
      setFileList(initialFileList);
    } else {
      setFileList([]);
    }

    setRemovedImages([]);
  };

  const handleDeletePartner = async (id) => {
    try {
      await deletePartner(id);
    } catch (error) {
      message.error("Failed to delete partner", error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingPartner(null);
  };

  // useEffect(() => {
  //   getAllPartners().then((data) => {
  //     console.log(data);
  //   });
  // });

  console.log(partners, "from partners");

  const columns = [
    {
      title: "Media",
      dataIndex: "photo",
      key: "photo",
      render: (_, record) => {
        if (!record || !record.photo) {
          return <div>No Image</div>; // Fallback when record is undefined or photo is missing
        }

        return (
          <div>
            <img
              src={record.photo}
              alt="Partner Media"
              className="w-[200px] rounded"
            />
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex flex-col gap-1">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditPartner(record)}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Are you sure to delete this partner?"
            onConfirm={() => handleDeletePartner(record._id)}
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
        <h1 className="text-2xl font-bold">Partners</h1>
        <Button
          className="custom-button"
          onClick={() => setIsModalVisible(true)}
          style={{ marginBottom: 16 }}
        >
          <PlusSquareOutlined /> Add New
        </Button>
      </div>

      <Table
        dataSource={partners}
        columns={columns}
        rowKey="_id"
        loading={loading}
        scroll={{ x: "max-content" }}
      />

      <Modal
        title={editingPartner ? "Edit Partner" : "Create Partner"}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleCreatePartner} layout="vertical">
          <Form.Item label="Photos">
            <Upload
              listType="picture-card"
              beforeUpload={() => false} // Prevent automatic upload
              fileList={fileList} // Use the fileList state
              onChange={handleFileChange} // Update the fileList state
              onRemove={handleRemoveImage} // Track removed images
              multiple // Allow multiple file uploads
              rules={[{ required: true, message: "Please select a Images" }]}
            >
              {fileList.length >= 8 ? null : ( // Limit to 8 files (optional)
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Button className="custom-button" htmlType="submit" loading={loading}>
            {editingPartner ? "Update Partner" : "Create Partner"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Partner;
