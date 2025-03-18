import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import OrderModal from "./OrderModal";
import api from "../axios/Axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import html2pdf from "html2pdf.js"; // Import html2pdf.js
import logo from "../../assets/logo/logo.png";
const OrderHistory = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await api.get("/users/getMe", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserId(response.data.data.doc?._id);
      } catch (err) {
        setError("Failed to fetch user details.");
      }
    };

    if (token) {
      fetchUserDetails();
    }
  }, [token]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) return;

      try {
        const response = await api.get(`/orders?user=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data.data.doc);
      } catch (error) {
        setError("Failed to fetch order history.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchOrders();
    }
  }, [userId, token]);

  const handleOrderClick = (order) => {
    if (order.orderStatus === "delivered") {
      setSelectedOrder(order);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // Replace the handlePrint function to use html2pdf.js
  const handlePrint = (order) => {
    // Create an HTML structure for the PDF content
    const invoiceContent = `
      <html>
  <head>
    <title>Invoice</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0px;
        color: #333;
        width: 1024px;
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
        margin-bottom: 20px;
        border-spacing: 0; /* Removes space between borders */
        border-collapse: collapse; /* Optional if you want all cells to collapse */
      }
      th {
        // border: 0.1px solid black; /* Ultra-thin border */
        border-left: 1px solid black;
        border-top: 1px solid black;
        border-bottom: 1px solid black;
        padding: 10px;
        text-align: left;
      }
      td {
        // border: 1px solid black; /* Ultra-thin border */
         border-left: 1px solid black;
        border-bottom: 1px solid black;
        padding: 10px;
        text-align: left;
      }
      /* Apply left and top borders to the last td element */
      .td-end {
        border-right: 1px solid black;
        // border-top: 1px solid black;
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
      .bg {
        padding: 40px;
      }
    </style>
  </head>
  <body class="bg">
    <div class="bg">
      <div class="header bg">
        <div class="logo">
          <img src="${
            logo || "default_logo.png"
          }" alt="Company Logo" style="height: 50px;" />
        </div>
        <div class="invoice-title">INVOICE</div>
      </div>

      <div class="invoice-details">
        <p>Customer Invoice</p>
      </div>

      <div class="billing-section">
        <div class="billing-info">
          <p><strong>COMPANY:</strong></p>
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
          <p>${order.streetAddress}, ${order.area}, ${order.upazilla}, ${
      order.district
    }, ${order.postCode}</p>
        </div>
        <div class="order-info">
          <p><strong>Invoice No.:</strong> ${order?._id.slice(0, 6)}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Payment Status:</strong> ${order?.paymentStatus}</p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity (kg)</th>
            <th>Unit Price</th>
            <th class="td-end">Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.products
            .map(
              (product, index) => `
                <tr>
                  <td>${product.product.title}</td>
                  <td>${product.quantity}</td>
                  <td>${product.product.salePrice} TK</td>
                  <td class="td-end">
                    ${product.quantity * product.product.salePrice} TK
                  </td>
                </tr>`
            )
            .join("")}
        </tbody>
      </table>

      <div class="summary">
        <p class="total"><strong>Grand Total:</strong> ${order.totalCost} TK</p>
      </div>

      <div class="thank-you">
        <p><i>Thank you!</i></p>
      </div>
    </div>
  </body>
</html>


    `;

    // Use html2pdf to download the PDF
    html2pdf().from(invoiceContent).save(`invoice_${order._id}.pdf`);
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="mt-5 bg-white p-5 overflow-x-auto w-full">
      <div className="pt-10 pb-4 flex items-center border-b">
        <h4 className="text-[18px] font-semibold relative before:absolute before:content-[''] before:left-0 before:-bottom-[17px] before:w-[150%] before:h-[2px] before:bg-primary">
          Order History
        </h4>
      </div>

      <div className="pb-10 pt-2 w-full sm:px-0 px-3">
        {loading ? (
          <ul>
            {[...Array(5)].map((_, index) => (
              <li key={index} className="flex flex-col gap-4 py-4 border-b">
                <Skeleton height={20} className="w-[15%]" />
                <div className="w-[60%] flex flex-col gap-2">
                  <Skeleton height={15} count={3} />
                </div>
                <Skeleton height={20} className="w-[15%]" />
              </li>
            ))}
          </ul>
        ) : (
          <div className="">
            {orders.length > 0 ? (
              <div className="overflow-x-auto max-w-full">
                <table className="table-auto w-full text-sm border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Order #
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Image
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Product Name
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-center">
                        Quantity
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-center">
                        Unit Price
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-center">
                        Total Price
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-center">
                        Order Status
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-center">
                        Total Cost
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <React.Fragment key={order._id}>
                        {order.products.map((product, index) => (
                          <tr
                            key={product?.product?._id}
                            className={index === 0 ? "" : "border-t"}
                          >
                            {/* Order ID (only for the first row of the order) */}
                            {index === 0 && (
                              <td
                                rowSpan={order.products.length}
                                className="border border-gray-300 px-4 py-2 text-center"
                              >
                                Order #{order?._id.slice(-6)}
                              </td>
                            )}
                            {/* Product Image */}
                            <td className="border border-gray-300 px-4 py-2 text-center">
                              <img
                                src={product?.product?.photos[0]}
                                alt={product?.product?.title}
                                className="w-16 h-16 object-cover rounded border"
                              />
                            </td>
                            {/* Product Name */}
                            <td className="border border-gray-300 px-4 py-2 text-left">
                              {product?.product?.title}
                            </td>
                            {/* Quantity */}
                            <td className="border border-gray-300 px-4 py-2 text-center">
                              <span>
                                {product?.quantity >= 1000
                                  ? `${(product?.quantity / 1000).toFixed(
                                      3
                                    )} Ton`
                                  : `${
                                      product?.quantity % 1 === 0
                                        ? product?.quantity
                                        : product?.quantity?.toFixed(3)
                                    } Kg`}
                              </span>
                            </td>
                            {/* Unit Price */}
                            <td className="border border-gray-300 px-4 py-2 text-center">
                              {product?.product?.salePrice} TK
                            </td>
                            {/* Total Price (Quantity × Unit Price) */}
                            <td className="border border-gray-300 px-4 py-2 text-center">
                              {product?.quantity * product?.product?.salePrice}{" "}
                              TK
                            </td>
                            {/* Order Status (only for the first row of the order) */}
                            {index === 0 && (
                              <td
                                rowSpan={order.products.length}
                                className="border border-gray-300 px-4 py-2 text-center"
                              >
                                <span
                                  className={`font-semibold ${
                                    order.orderStatus === "Successful"
                                      ? "text-green-500"
                                      : "text-red-500"
                                  }`}
                                >
                                  {order.orderStatus}
                                </span>
                              </td>
                            )}
                            {/* Total Cost (only for the first row of the order) */}
                            {index === 0 && (
                              <td
                                rowSpan={order.products.length}
                                className="border border-gray-300 px-4 py-2 text-center"
                              >
                                {order.totalCost} TK
                              </td>
                            )}
                            {/* Action (Print Button, only for delivered orders, first row of the order) */}
                            {index === 0 && (
                              <td
                                rowSpan={order.products.length}
                                className="border border-gray-300 px-4 py-2 text-center"
                              >
                                {order.orderStatus === "delivered" && (
                                  <button
                                    className="bg-primary text-white py-1 px-3 rounded"
                                    onClick={() => handlePrint(order)}
                                  >
                                    Print
                                  </button>
                                )}
                              </td>
                            )}
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div>No orders found</div>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <OrderModal order={selectedOrder} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default OrderHistory;
