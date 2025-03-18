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
  Upload,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusSquareOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Description from "../components/Description";
import useHomeApplianceActions from "../hooks/useHomeApplianceActions";
import useHomeApplianceCategoryActions from "../hooks/useHomeApplianceCategoryActions";
import { Option } from "antd/es/mentions";

const HomeApplianceProduct = () => {
  const {
    homeAppliances,
    loading,
    createHomeAppliance,
    updateHomeAppliance,
    deleteHomeAppliance,
  } = useHomeApplianceActions();
  const { homeApplianceProductsByCategorys } =
    useHomeApplianceCategoryActions();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingHomeApplianceProduct, setEditingHomeApplianceProduct] =
    useState(null);
  const [fileList, setFileList] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [subchildcategories, setSubchildcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    const selectedCategoryData = homeApplianceProductsByCategorys.find(
      (cat) => cat._id === categoryId
    );
    setSubcategories(
      selectedCategoryData ? selectedCategoryData.subcategories : []
    );
    setSubchildcategories([]); // Reset subchildcategory on category change
  };

  const handleSubcategoryChange = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
    const selectedSubcategoryData = subcategories.find(
      (sub) => sub._id === subcategoryId
    );
    setSubchildcategories(
      selectedSubcategoryData ? selectedSubcategoryData.subchildcategories : []
    );
  };

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

  const handleCreateHomeApplianceProduct = async (values) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title || "");
      formData.append("sku", values.sku || "");
      formData.append("details", values.details || "");
      formData.append("discountType", values.discountType || "none");
      formData.append("discountValue", values.discountValue || "");
      formData.append("price", values.price || "");
      formData.append("stock", values.stock || "");
      formData.append("category", values.category || "");
      formData.append("subcategory", values.subcategory || "");
      formData.append("subchildcategory", values.subchildcategory || "");

      // Append new images
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("photos", file.originFileObj);
        }
      });

      // Append removed images (for update)
      if (editingHomeApplianceProduct) {
        removedImages.forEach((imageUrl) => {
          formData.append("removedImages", imageUrl);
        });
      }

      if (editingHomeApplianceProduct) {
        await updateHomeAppliance(editingHomeApplianceProduct.slug, formData);
        setEditingHomeApplianceProduct(null);
      } else {
        await createHomeAppliance(formData);
      }

      setIsModalVisible(false);
      form.resetFields();
      setFileList([]);
    } catch (error) {
      message.error("Failed to save homeApplianceProduct", error);
    }
  };

  const handleEditHomeApplianceProduct = (homeApplianceProduct) => {
    setEditingHomeApplianceProduct(homeApplianceProduct);
    setIsModalVisible(true);
    form.setFieldsValue({
      ...homeApplianceProduct,
      category: homeApplianceProduct.category?._id,
      subcategory: homeApplianceProduct.subcategory?._id,
      subchildcategory: homeApplianceProduct.subchildcategory?._id,
      // isActive: homeApplianceProduct.isActive,
    });

    // Initialize fileList with existing images
    if (
      Array.isArray(homeApplianceProduct.photos) &&
      homeApplianceProduct.photos.length > 0
    ) {
      const initialFileList = homeApplianceProduct.photos.map(
        (imgUrl, index) => ({
          uid: `-${index + 1}`,
          name: imgUrl.split("/").pop(),
          status: "done",
          url: `${imgUrl}`,
        })
      );
      setFileList(initialFileList);
    } else {
      setFileList([]);
    }

    setRemovedImages([]);
  };

  const handleDeleteHomeApplianceProduct = async (slug) => {
    try {
      await deleteHomeAppliance(slug);
    } catch (error) {
      message.error("Failed to delete homeApplianceProduct", error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingHomeApplianceProduct(null);
  };

  // useEffect(() => {
  //   getAllHomeApplianceProducts().then((data) => {
  //     console.log(data);
  //   });
  // });

  console.log(homeAppliances, "from homeApplianceProducts");

  const columns = [
    {
      title: "Media",
      key: "photos",
      dataIndex: "photos",
      render: (photos, record) => (
        <div className="flex flex-col gap-2">
          {(photos || []).map((imgUrl, index) => (
            <img
              key={index}
              src={`${imgUrl}`}
              alt={record.title}
              className="w-[200px] rounded"
            />
          ))}
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (_, record) => <div>{record?.category?.name}</div>,
    },
    {
      title: "Brand",
      dataIndex: "subcategory",
      key: "subcategory",
      render: (_, record) => <div>{record?.subcategory?.name}</div>,
    },
    {
      title: "Subcategory",
      dataIndex: "subchildcategory",
      key: "subchildcategory",
      render: (_, record) => <div>{record?.subchildcategory?.name}</div>,
    },
    {
      title: "Stock Qty",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "MRP Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Discount Type",
      dataIndex: "discountType",
      key: "discountType",
    },
    {
      title: "Discount Amount",
      dataIndex: "discountValue",
      key: "discountValue",
    },
    {
      title: "Discounted Price",
      dataIndex: "salePrice",
      key: "salePrice",
    },
    {
      title: "Visit Count",
      dataIndex: "visitCount",
      key: "visitCount",
    },
    {
      title: "Sale No.",
      dataIndex: "saleNumber",
      key: "saleNumber",
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
      render: (_, record) => <Description content={record?.details} />,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex flex-col gap-1">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditHomeApplianceProduct(record)}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Are you sure to delete this homeApplianceProduct?"
            onConfirm={() => handleDeleteHomeApplianceProduct(record.slug)}
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
        <h1 className="text-2xl font-bold">Products</h1>
        <Button
          className="custom-button"
          onClick={() => setIsModalVisible(true)}
          style={{ marginBottom: 16 }}
        >
          <PlusSquareOutlined /> Add New
        </Button>
      </div>

      <Table
        dataSource={homeAppliances}
        columns={columns}
        rowKey="_id"
        loading={loading}
        scroll={{ x: "max-content" }}
      />

      <Modal
        title={
          editingHomeApplianceProduct
            ? "Edit Product"
            : "Create Product"
        }
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        {/* <Form form={form} onFinish={handleCreateHomeApplianceProduct} layout="vertical">
          <Form.Item
            name="name"
            label="HomeApplianceProduct Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Button className="custom-button" htmlType="submit" loading={loading}>
            {editingHomeApplianceProduct ? "Update HomeApplianceProduct" : "Create HomeApplianceProduct"}
          </Button>
        </Form> */}

        <Form
          form={form}
          onFinish={handleCreateHomeApplianceProduct}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[
              {
                required: true,
                message: "Please enter the homeApplianceProduct title",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="sku" label="SKU (minimum 8 characters)">
            <Input />
          </Form.Item>

          <Form.Item name="discountType" label="Discount Type">
            <Select>
              <Select.Option value="none">No Discount</Select.Option>
              <Select.Option value="percent">Percent</Select.Option>
              <Select.Option value="amount">Amount</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="discountValue" label="Discount Value">
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[
              {
                required: true,
                message: "Please enter the homeApplianceProduct price",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="stock"
            label="Stock"
            rules={[
              { required: true, message: "Please enter the stock quantity" },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item name="details" label="Details">
            <ReactQuill />
          </Form.Item>
          <Form.Item name="category" label="Category">
            <Select
              placeholder="Select Category"
              onChange={handleCategoryChange}
            >
              {homeApplianceProductsByCategorys.map((cat) => (
                <Option key={cat._id} value={cat._id}>
                  {cat.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="subcategory" label="Brand">
            <Select
              placeholder="Select Brand"
              onChange={handleSubcategoryChange}
              disabled={!subcategories.length}
            >
              {subcategories.map((sub) => (
                <Option key={sub._id} value={sub._id}>
                  {sub.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="subchildcategory" label="Subcategory">
            <Select
              placeholder="Select Subcategory"
              disabled={!subchildcategories.length}
            >
              {subchildcategories.map((subchild) => (
                <Option key={subchild._id} value={subchild._id}>
                  {subchild.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

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
            {editingHomeApplianceProduct ? "Update" : "Create"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default HomeApplianceProduct;
