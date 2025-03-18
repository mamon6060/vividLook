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
import useProductActions from "../hooks/useProductActions";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useProductCategoryActions from "../hooks/useProductCategoryActions";
import Description from "../components/Description";

const Product = () => {
  const { products, loading, createProduct, updateProduct, deleteProduct } =
    useProductActions();
  const { productCategorys } = useProductCategoryActions();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingProduct, setEditingProduct] = useState(null);
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

  const handleCreateProduct = async (values) => {
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

      // Append new images
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("photos", file.originFileObj);
        }
      });

      // Append removed images (for update)
      if (editingProduct) {
        removedImages.forEach((imageUrl) => {
          formData.append("removedImages", imageUrl);
        });
      }

      if (editingProduct) {
        await updateProduct(editingProduct.slug, formData);
        setEditingProduct(null);
      } else {
        await createProduct(formData);
      }

      setIsModalVisible(false);
      form.resetFields();
      setFileList([]);
    } catch (error) {
      message.error("Failed to save product", error);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsModalVisible(true);
    form.setFieldsValue({
      ...product,
      category: product.category?._id,
      // isActive: product.isActive,
    });

    // Initialize fileList with existing images
    if (Array.isArray(product.photos) && product.photos.length > 0) {
      const initialFileList = product.photos.map((imgUrl, index) => ({
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

  const handleDeleteProduct = async (slug) => {
    try {
      await deleteProduct(slug);
    } catch (error) {
      message.error("Failed to delete product", error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingProduct(null);
  };

  // useEffect(() => {
  //   getAllProducts().then((data) => {
  //     console.log(data);
  //   });
  // });

  console.log(products, "from products");

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
            onClick={() => handleEditProduct(record)}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Are you sure to delete this product?"
            onConfirm={() => handleDeleteProduct(record.slug)}
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
        <h1 className="text-2xl font-bold">Spare Parts</h1>
        <Button
          className="custom-button"
          onClick={() => setIsModalVisible(true)}
          style={{ marginBottom: 16 }}
        >
          <PlusSquareOutlined /> Add New
        </Button>
      </div>

      <Table
        dataSource={products}
        columns={columns}
        rowKey="_id"
        loading={loading}
        scroll={{ x: "max-content" }}
      />

      <Modal
        title={editingProduct ? "Edit Spare Part" : "Create Spare Part"}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        {/* <Form form={form} onFinish={handleCreateProduct} layout="vertical">
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Button className="custom-button" htmlType="submit" loading={loading}>
            {editingProduct ? "Update Product" : "Create Product"}
          </Button>
        </Form> */}

        <Form form={form} onFinish={handleCreateProduct} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[
              { required: true, message: "Please enter the title" },
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
              { required: true, message: "Please enter the price" },
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

          <Form.Item
            name="details"
            label="Details"
            // rules={[
            //   { required: true, message: "Please enter the product details" },
            // ]}
          >
            <ReactQuill />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select>
              {productCategorys.map((category) => (
                <Select.Option key={category._id} value={category._id}>
                  {category.title}
                </Select.Option>
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
            {editingProduct ? "Update" : "Create"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Product;
