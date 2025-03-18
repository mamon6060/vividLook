import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import OrderModal from "./OrderModal";
import api from "../axios/Axios";
import logo from "../../assets/logo/logo.png";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import logoImage from "../../assets/logo/logo.png";

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

  const handlePrint = (order) => {
    // Create an iframe element
    const printWindow = window.open("", "_blank");

    const iframe = document.createElement("iframe");
    document.body.appendChild(iframe);
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.position = "absolute";
    iframe.style.top = "0";
    iframe.style.left = "0";

    // Access the iframe document
    // const doc = iframe.contentWindow.document;

    // Invoice HTML content
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
                  <p>Customer Invoice</p>
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
                    <p><strong>Invoice No.:</strong> ${order._id.slice(
                      0,
                      6
                    )}</p>
                    <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                    <p><strong>Payment Status:</strong> ${
                      order.paymentStatus
                    }</p>
                  </div>
                </div>
                
                <table>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Quantity</th>
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

    // Write the invoice content to the new window
    printWindow.document.open();
    printWindow.document.write(invoiceContent);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.focus(); // Focus the print window before printing
      printWindow.print(); // Trigger the print dialog
      printWindow.close(); // Close the print window after printing
    }, 50000);
    // Trigger print and close the window after printing
    // printWindow.onload = () => {
    //   printWindow.focus();
    //   printWindow.print();
    //   printWindow.close();
    // };
    // // Write the invoice content to the iframe
    // doc.open();
    // doc.write(invoiceContent);
    // doc.close();

    // // Print the invoice once the iframe loads
    // iframe.onload = () => {
    //   iframe.contentWindow.focus();
    //   iframe.contentWindow.print();
    // };

    // // Remove the iframe after printing
    // iframe.contentWindow.onafterprint = () => {
    //   document.body.removeChild(iframe);
    // };
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
                            key={product.product._id}
                            className={index === 0 ? "" : "border-t"}
                          >
                            {/* Order ID (only for the first row of the order) */}
                            {index === 0 && (
                              <td
                                rowSpan={order.products.length}
                                className="border border-gray-300 px-4 py-2 text-center"
                              >
                                Order #{order._id.slice(-6)}
                              </td>
                            )}
                            {/* Product Image */}
                            <td className="border border-gray-300 px-4 py-2 text-center">
                              <img
                                src={product.product.photos[0]}
                                alt={product.product.title}
                                className="w-16 h-16 object-cover rounded border"
                              />
                            </td>
                            {/* Product Name */}
                            <td className="border border-gray-300 px-4 py-2 text-left">
                              {product.product.title}
                            </td>
                            {/* Quantity */}
                            <td className="border border-gray-300 px-4 py-2 text-center">
                              <span>
                                {product.quantity >= 1000
                                  ? `${(product.quantity / 1000).toFixed(
                                      3
                                    )} Ton` // Display quantity in tons for values >= 1000
                                  : `${
                                      product.quantity % 1 === 0
                                        ? product.quantity
                                        : product.quantity.toFixed(3)
                                    } Kg`}{" "}
                                {/* Display quantity in kilograms */}
                              </span>
                            </td>
                            {/* Unit Price */}
                            <td className="border border-gray-300 px-4 py-2 text-center">
                              ৳{product.product.salePrice}
                            </td>
                            {/* Total Price (Quantity × Unit Price) */}
                            <td className="border border-gray-300 px-4 py-2 text-center">
                              ৳{product.quantity * product.product.salePrice}
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
                                ৳{order.totalCost}
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
              <div className="text-center py-2">You Have No Orders</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
