import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Select,
  message,
  Popconfirm,
  Tooltip,
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import axiosInstance from "../Components/Axios";
import logoImage from "../../src/assets/logo.png";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bankDetailsModal, setBankDetailsModal] = useState({
    visible: false,
    details: null,
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/orders");
      setOrders(data.data.doc);
    } catch (error) {
      message.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleOk = async () => {
    setLoading(true);
    try {
      await axiosInstance.patch(`/orders/${editingOrder?._id}`, {
        orderStatus: editingOrder.orderStatus,
      });

      if (editingOrder.orderStatus === "delivered") {
        for (const productItem of editingOrder.products) {
          const { product, quantity } = productItem;
          const updatedStock = product.stock - quantity;

          // Update the product stock
          await axiosInstance.patch(`/products/${product?.slug}`, {
            stock: updatedStock,
          });
        }
      }

      message.success("Order status updated successfully!");
      fetchOrders();
      setIsModalOpen(false);
    } catch (error) {
      message.error("Failed to update order status");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (orderId) => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/orders/${orderId}`);
      message.success("Order deleted successfully!");
      fetchOrders();
    } catch (error) {
      message.error("Failed to delete order");
    } finally {
      setLoading(false);
    }
  };

  const handlePrintInvoice = (order) => {
    const iframe = document.createElement("iframe");
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow.document;

    const invoiceContent = `
          <html>
            <head>
              <title>Invoice</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  margin: 40px;
                  color: #333;
                }
                .header {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-bottom: 30px;
                }
                .header .logo {
                  font-size: 2rem;
                  font-weight: bold;
                }
                .header .invoice-title {
                  font-size: 1.5rem;
                  font-weight: bold;
                }
                .billing-section {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 20px;
                }
                .billing-info p, .order-info p {
                  margin: 5px 0;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 20px;
                }
                th, td {
                  border: 1px solid #ccc;
                  padding: 10px;
                  text-align: left;
                }
                th {
                  background-color: #f9f9f9;
                }
                .summary {
                  text-align: right;
                }
                .summary p {
                  margin: 5px 0;
                  font-size: 1rem;
                }
                .total {
                  font-size: 1.2rem;
                  font-weight: bold;
                }
                .thank-you {
                  margin-top: 50px;
                  font-size: 1rem;
                }
                .company-info {
                   margin-bottom: 20px;
                   font-size: 1rem;
                }
                .invoice-details {
                  margin-top: 50px;
                  font-size: 1rem;
                  text-align: center;
                  font-weight: bold;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <div class="logo">
                  <img src="${logoImage}" alt="Company Logo" style="height: 50px;" />
                </div>
                <div class="invoice-title">INVOICE</div>
              </div>
    
              <div class="invoice-details">
                <p>Company Invoice</p>
              </div>
    
              <div class="billing-section">
                <div class="billing-info">
                  <p<strong><b>COMPANY:</b></strong></p>
                <p>Madina Refrigeration</p>
                <p>+88 01890011810</p>
                <p>info@agroinfusion.com</p>
                </div>
              </div>
    
              <div class="billing-section">
                <div class="billing-info">
                  <p><strong>BILLED TO:</strong></p>
                  <p>${order.name}</p>
                  <p>${order.phone}</p>
                  <p>${order.email}</p>
                  <p>${order.streetAddress}, ${order.area}, ${
      order.upazilla
    }, ${order.district}, ${order.postCode}</p>
                </div>
                <div class="order-info">
                  <p><strong>Invoice No.:</strong> ${order._id.slice(0, 6)}</p>
                  <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                  <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
                </div>
              </div>
              
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity (kg)</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.products
                    .map(
                      (product) => `
                      <tr>
                        <td>${product.product.title}</td>
                        <td>${product.quantity}</td>
                        <td>${product.product.salePrice} TK</td>
                        <td>${
                          product.quantity * product.product.salePrice
                        } TK</td>
                      </tr>
                    `
                    )
                    .join("")}
                </tbody>
              </table>
    
              <div class="summary">
                <p class="total"><strong>Grand Total:</strong> ${
                  order.totalCost
                } TK</p>
              </div>
    
              <div class="thank-you">
                <p><i>Thank you!</i></p>
              </div>
            </body>
          </html>
        `;

    doc.open();
    doc.write(invoiceContent);
    doc.close();

    iframe.contentWindow.onafterprint = () => {
      document.body.removeChild(iframe);
    };

    iframe.onload = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    };
  };

  const showModal = (record) => {
    setEditingOrder(record);
    setIsModalOpen(true);
  };

  const showBankDetails = (details) => {
    setBankDetailsModal({ visible: true, details });
  };

  const columns = [
    {
      title: "SL",
      key: "sl",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Id",
      dataIndex: "_id",
      key: "_id",
      render: (text) => {
        let paddedText = String(text);
        return paddedText.slice(-6).padStart(6, "0");
      },
    },
    {
      width: "15%",
      title: "Products",
      dataIndex: "products",
      key: "products",
      render: (products) =>
        products?.map((productItem) => (
          <div key={productItem._id}>
            <p>Title: {productItem.product?.title}</p>
            <p>Size: {productItem.product?.size}</p>
            <p>Quantity: {productItem?.quantity}</p>
            <p>Price: {productItem.product?.salePrice}</p>
            {productItem.product?.photos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt="product"
                style={{
                  width: "50px",
                  marginRight: "5px",
                  display: "inline-block",
                }}
              />
            ))}
          </div>
        )),
    },
    {
      width: "20%",
      title: "Info",
      key: "address",
      render: (text, record) => (
        <>
          <p>Name: {record.name}</p>
          <p>Phone: {record.phone}</p>
          <p>Email: {record.email}</p>
          <p>
            Address: {record.streetAddress}, {record.area}, {record.upazilla},
            {record.district}, {record.postCode}
          </p>
        </>
      ),
    },
    {
      width: "10%",
      title: "Product Price",
      dataIndex: "totalCost",
      key: "totalCost",
    },
    {
      width: "10%",
      title: "Shipping Cost",
      dataIndex: "shippingCost",
      key: "totalCost",
    },
    {
      width: "10%",
      title: "Total Cost",
      // dataIndex: "shippingCost",
      key: "totalCost",
      render: (text, record) => (
        <>
          <p>{record.totalCost + record.shippingCost}</p>
        </>
      ),
    },
    {
      width: "10%",
      title: "Payment method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (paymentMethod, record) =>
        paymentMethod === "Bank" ? (
          <span>
            {paymentMethod}
            <Tooltip title="View Bank Details">
              <Button
                type="link"
                icon={<InfoCircleOutlined />}
                onClick={() => showBankDetails(record.bankDetails)}
              />
            </Tooltip>
          </span>
        ) : (
          paymentMethod
        ),
    },
    {
      width: "10%",
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
    },

    { title: "Order Status", dataIndex: "orderStatus", key: "orderStatus" },
    {
      width: "10%",
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Button
            type="primary"
            onClick={() => showModal(record)}
            disabled={record.orderStatus === "delivered"}
          >
            Edit
          </Button>
          <Button type="default" onClick={() => handlePrintInvoice(record)}>
            Print Invoice
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this order?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger type="primary">
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  console.log("-_-", orders);

  return (
    <>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="_id"
        loading={loading}
      />

      <Modal
        title="Edit Order Status"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Select
          style={{ width: "100%" }}
          value={editingOrder?.orderStatus}
          onChange={(value) =>
            setEditingOrder((prev) => ({
              ...prev,
              orderStatus: value,
            }))
          }
        >
          <Select.Option value="pending">Pending</Select.Option>
          <Select.Option value="approved">Approved</Select.Option>
          <Select.Option value="shipped">Shipped</Select.Option>
          <Select.Option value="delivered">Delivered</Select.Option>
          <Select.Option value="canceled">Canceled</Select.Option>
        </Select>
      </Modal>

      <Modal
        title="Bank Details"
        open={bankDetailsModal.visible}
        onCancel={() => setBankDetailsModal({ visible: false, details: null })}
        footer={null}
      >
        <div>
          <p>
            <strong>Bank Name:</strong> {bankDetailsModal.details?.bank}
          </p>
          <p>
            <strong>Method:</strong> {bankDetailsModal.details?.method}
          </p>
          <p>
            <strong>Account Name:</strong>
            {bankDetailsModal.details?.accountName}
          </p>
          <p>
            <strong>Account Number:</strong>
            {bankDetailsModal.details?.accountNumber}
          </p>
          <p>
            <strong>Date of payment:</strong>{" "}
            {new Date(bankDetailsModal.details?.dateOfPayment).toLocaleString()}
          </p>
          <p>
            <strong>Cheque Submission Date:</strong>{" "}
            {new Date(
              bankDetailsModal.details?.chequeSubmissionDate
            ).toLocaleString()}
          </p>
          <p>
            <strong>Bank Reference:</strong>
            {bankDetailsModal.details?.bankReference}
          </p>
          <p>
            <strong>Promo:</strong> {bankDetailsModal.details?.promo}
          </p>

          <img
            src={orders.find((order) => order.paymentMethod === "Bank")?.photo}
            alt="Bank transaction"
            style={{ maxWidth: "100%", marginTop: "10px" }}
          />
        </div>
      </Modal>
    </>
  );
};

export default Orders;
