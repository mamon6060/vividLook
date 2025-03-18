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
  Menu,
  Dropdown,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import useOrderActions from "../hooks/useOrderActions";
import { useState } from "react";
import useCreateOrder from "../hooks/useCreateOrder";

const Order = () => {
  const { orders, loading, updateOrder, updateOrderStatus, deleteOrder } =
    useOrderActions();
  const { createOrder } = useCreateOrder();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingOrder, setEditingOrder] = useState(null);

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setIsModalVisible(true);
    form.setFieldsValue({
      ...order,
      // isActive: order.isActive,
    });
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await updateOrder(id, { orderStatus: status });
      // await updateOrderStatus(id, { orderStatus: status });
      // message.success(`Order status updated to ${status}`);
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
      await deleteOrder(id);
    } catch (error) {
      message.error("Failed to delete order", error);
    }
  };

  const handleCourierChange = async (order, courier) => {
    if (courier === "Steadfast") {
      try {
        const { name, phone, streetAddress, totalCost } = order;
        const invoice = `${order._id.slice(-6)}`;

        const payload = {
          invoice,
          recipient_name: name,
          recipient_phone: phone,
          recipient_address: `${streetAddress}`,
          cod_amount: totalCost,
        };

        const response = await createOrder(payload);

        if (response.status === 200) {
          return message.success("Order placed with Steadfast successfully");
        }
        if (response.status === 400) {
          return message.error(response?.errors.invoice[0]);
        }
      } catch (error) {
        message.error("Error placing order with Steadfast");
        console.error("Error placing Steadfast order:", error);
      }
    }
  };

  console.log(orders, "from orders");

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Products",
      render: (_, record) => (
        <div className="grid grid-cols-1 gap-2">
          {record.products?.map((product, index) => (
            <div key={index} className="text-cyan-600 border rounded p-2">
              <span>{index + 1}. </span>
              <span className="font-semibold">{product?.product?.title}</span>
              <p>Qty: {product?.quantity}</p>
              <span>SKU: {product?.product?.sku}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "District",
      dataIndex: "district",
      key: "district",
    },
    {
      title: "Upazilla",
      dataIndex: "upazilla",
      key: "upazilla",
    },
    {
      title: "Area",
      dataIndex: "area",
      key: "area",
    },
    {
      title: "Street Address",
      dataIndex: "streetAddress",
      key: "streetAddress",
    },
    {
      title: "Post Code",
      dataIndex: "postCode",
      key: "postCode",
    },
    {
      title: "Total Cost",
      dataIndex: "totalCost",
      key: "totalCost",
    },
    {
      title: "Shipping Cost",
      dataIndex: "shippingCost",
      key: "shippingCost",
    },
    {
      title: "Order Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (_, record) => (
        <div
          className={`px-2 py-1 rounded-full flex justify-center items-center ${
            record.orderStatus === "pending" && "bg-yellow-500 text-white"
          } ${record.orderStatus === "canceled" && "bg-rose-500 text-white"} ${
            record.orderStatus === "delivered" && "bg-green-500 text-white"
          } ${record.orderStatus === "approved" && "bg-cyan-500 text-white"} ${
            record.orderStatus === "shipped" && "bg-violet-500 text-white"
          }`}
        >
          {record.orderStatus === "pending" && "Pending"}
          {record.orderStatus === "approved" && "Approved"}
          {record.orderStatus === "shipped" && "Shipped"}
          {record.orderStatus === "delivered" && "Delivered"}
          {record.orderStatus === "canceled" && "Cancelled"}
        </div>
      ),
    },
    // {
    //   title: "Payment Status",
    //   dataIndex: "paymentStatus",
    //   key: "paymentStatus",
    //   render: (_, record) => (
    //     <div
    //       className={`px-2 py-1 rounded-full flex justify-center items-center ${
    //         record.orderStatus === "pending" && "bg-yellow-500 text-white"
    //       } ${record.orderStatus === "canceled" && "bg-rose-500 text-white"} ${
    //         record.orderStatus === "delivered" && "bg-green-500 text-white"
    //       }`}
    //     >
    //       {record.orderStatus === "pending" && "Pending"}
    //       {record.orderStatus === "canceled" && "Cancelled"}
    //       {record.orderStatus === "delivered" && "Delivered"}
    //     </div>
    //   ),
    // },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_, record) => (
        <>{new Date(record.createdAt).toLocaleDateString()}</>
      ),
    },
    {
      // width: "15%",
      title: "Courier Service",
      dataIndex: "courier",
      key: "courier",
      render: (text, record) => (
        <Select
          // className="w-[100%]"
          value={record.courier || "Select Courier"} // Show selected courier
          onChange={(value) => handleCourierChange(record, value)}
          options={[
            { label: "Steadfast", value: "Steadfast" },
            // { label: "pathao", value: "pathao" },
          ]}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex flex-col gap-1">
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  onClick={() =>
                    handleUpdateOrderStatus(record._id, "canceled")
                  }
                  className="!text-red-500 hover:!bg-red-500 hover:!text-white"
                >
                  Mark as Cancel
                </Menu.Item>
                <Menu.Item
                  onClick={() => handleUpdateOrderStatus(record._id, "pending")}
                  className="!text-yellow-500 hover:!bg-yellow-500 hover:!text-white"
                >
                  Mark as Pending
                </Menu.Item>
                <Menu.Item
                  onClick={() =>
                    handleUpdateOrderStatus(record._id, "approved")
                  }
                  className="!text-cyan-500 hover:!bg-cyan-500 hover:!text-white"
                >
                  Mark as Approved
                </Menu.Item>
                <Menu.Item
                  onClick={() => handleUpdateOrderStatus(record._id, "shipped")}
                  className="!text-violet-500 hover:!bg-violet-500 hover:!text-white"
                >
                  Mark as Shipped
                </Menu.Item>
                <Menu.Item
                  onClick={() =>
                    handleUpdateOrderStatus(record._id, "delivered")
                  }
                  className="!text-green-500 hover:!bg-green-500 hover:!text-white"
                >
                  Mark as Delivered
                </Menu.Item>
              </Menu>
            }
            trigger={["click"]}
          >
            <Button icon={<EditOutlined />}>{/* <EditOutlined /> */}</Button>
          </Dropdown>
          <Popconfirm
            title="Are you sure to delete this order?"
            onConfirm={() => handleDeleteOrder(record._id)}
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
        <h1 className="text-2xl font-bold">Product & Spare Parts Orders</h1>
      </div>

      <Table
        dataSource={orders}
        columns={columns}
        rowKey="_id"
        loading={loading}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default Order;
