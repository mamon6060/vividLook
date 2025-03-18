import {
  Badge,
  Button,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Space,
  Switch,
  Table,
  Upload,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusSquareOutlined,
  UploadOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import useGalleryActions from "../hooks/useGalleryActions";
import { useState } from "react";
import { API_BASE_URL } from "../shared/config";
import { truncateText } from "../helpers/truncateText";

const Gallery = () => {
  const { galleries, loading, createGallery, updateGallery, deleteGallery } =
    useGalleryActions();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingGallery, setEditingGallery] = useState(null);
  // const [fileList, setFileList] = useState([]);
  console.log(galleries, "galleries from--------------------");

  // const handleUploadChange = (index, { fileList }) => {
  //   const newEvents = [...form.getFieldValue("event")];
  //   newEvents[index] = { ...newEvents[index], image: fileList };
  //   form.setFieldsValue({ event: newEvents });
  // };
  const handleUploadChange = (index, record) => {
    const eventList = form.getFieldValue("event") || [];
    const currentEvent = eventList[index] || { image: [] };

    currentEvent.image = currentEvent.image || [];

    const removedImages = currentEvent.image
      .filter((file) => !record.fileList.some((f) => f.uid === file.uid))
      .map((file) => file.url);

    currentEvent.removedImages = removedImages;
    currentEvent.image = record.fileList;

    eventList[index] = currentEvent;
    form.setFieldsValue({ event: eventList });
    console.log(record, "record from handle upload change");
    console.log(eventList, "eventList from handle upload change");
  };

  const handleCreateGallery = async (values) => {
    try {
      const formData = new FormData();

      formData.append("title", values.title || "");
      formData.append("detail", values.detail || "");
      formData.append("description", values.description || "");
      formData.append("isActive", values.isActive);

      values.event.forEach((event, index) => {
        formData.append(`event[${index}][eventTitle]`, event.eventTitle || "");
        formData.append(
          `event[${index}][eventDetails]`,
          event.eventDetails || ""
        );

        if (event.image) {
          event.image.forEach((file) => {
            if (file.originFileObj) {
              formData.append(`event[${index}][image]`, file.originFileObj);
            } else {
              formData.append(
                `event[${index}][existingImages][]`,
                file.url.replace(API_BASE_URL, "")
              );
            }
          });
        }

        // Track removed images
        if (event.removedImages) {
          event.removedImages.forEach((imageUrl) => {
            formData.append(`event[${index}][removedImages]`, imageUrl);
          });
        }
        console.log(event.removedImages, "removed images from handle create");
      });

      if (editingGallery) {
        await updateGallery(editingGallery._id, formData);
        setEditingGallery(null);
      } else {
        await createGallery(formData);
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to save gallery", error);
    }
  };

  const handleEditGallery = (gallery) => {
    setEditingGallery(gallery);
    setIsModalVisible(true);
    console.log(gallery, "gallary from handle edit gallary......");

    form.setFieldsValue({
      ...gallery,
      isActive: gallery.isActive,
      event:
        gallery.event?.map((event) => ({
          eventTitle: event.eventTitle,
          eventDetails: event.eventDetails,
          image:
            event.image?.map((imgUrl) => ({
              uid: imgUrl,
              name: imgUrl.split("/").pop(),
              status: "done",
              url: API_BASE_URL + imgUrl,
            })) || [],
        })) || [],
    });
  };

  const handleDeleteGallery = async (id) => {
    try {
      await deleteGallery(id);
    } catch (error) {
      message.error("Failed to delete gallery", error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingGallery(null);
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => <span>{truncateText(text, 50)}</span>,
    },
    {
      title: "Details",
      dataIndex: "detail",
      key: "detail",
      render: (text) => <span>{truncateText(text, 50)}</span>,
    },
    {
      title: "Events",
      dataIndex: "event",
      key: "event",
      render: (_, record) => (
        <div className="flex flex-col gap-4">
          {record?.event?.map((item, index) => (
            <div className="border-b" key={index}>
              <div className="">
                <p className="text-lg">
                  Title:{" "}
                  <span className="font-semibold text-lg"> {item.eventTitle}</span>
                </p>

                <p className="">
                  Details:{" "}
                  <span className="font-semibold">{item.eventDetails}</span>
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {item?.image?.map((img, index) => (
                  <img
                    src={API_BASE_URL + img}
                    alt={img}
                    key={index}
                    className="rounded"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Badge
          count={isActive ? "Yes" : "No"}
          style={{ backgroundColor: isActive ? "#52c41a" : "#ff4d4f" }}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex flex-col gap-1">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditGallery(record)}
          />
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDeleteGallery(record._id)}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white my-6 p-8 rounded-md">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Gallery</h1>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          <PlusSquareOutlined /> Add New
        </Button>
      </div>

      <Table
        dataSource={galleries}
        columns={columns}
        rowKey="_id"
        loading={loading}
      />

      <Modal
        title={editingGallery ? "Edit Gallery" : "Create Gallery"}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        className=""
      >
        <Form form={form} onFinish={handleCreateGallery} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="detail" label="Details">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input />
          </Form.Item>
          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.List name="event">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <Space
                    className="w-full overflow-x-auto"
                    key={key}
                    align="baseline"
                  >
                    <div className="w-full flex flex-col overflow-x-auto">
                      <Form.Item
                        {...restField}
                        name={[name, "eventTitle"]}
                        label="Event Title"
                        rules={[{ required: true, message: "Missing title" }]}
                        className=" overflow-x-auto"
                      >
                        <Input
                          placeholder="Event Title"
                          className=" overflow-x-auto"
                        />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "eventDetails"]}
                        label="Event Details"
                        // rules={[{ required: true, message: "Missing Details" }]}
                        className=" overflow-x-auto"
                      >
                        <Input placeholder="Event Details" />
                      </Form.Item>
                      {/* Upload Component - Allows multiple images per event */}
                      <Form.Item label="Upload Images" className="max-w-full">
                        <Upload
                          listType="picture-card"
                          multiple
                          fileList={
                            form.getFieldValue("event")?.[index]?.image || []
                          }
                          className=" overflow-x-auto"
                          onChange={(record) =>
                            handleUploadChange(index, record)
                          }
                          beforeUpload={() => false} // Prevent default upload
                        >
                          <div>
                            <UploadOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                          </div>
                        </Upload>
                      </Form.Item>
                    </div>
                    <MinusCircleOutlined
                      onClick={() => remove(name)}
                      className="text-rose-400 hover:text-rose-500"
                    />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Event
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Button type="primary" htmlType="submit" loading={loading}>
            {editingGallery ? "Update Gallery" : "Create Gallery"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Gallery;
