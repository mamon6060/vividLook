import React, { useRef } from "react";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import logo from "../../assets/logo/logo.png"; // Ensure the logo path is correct

const OrderModal = ({ isOpen, onClose, order }) => {
  // If the modal is not open, do not render anything
  if (!isOpen) return null;

  const printRef = useRef();

  const handleOverlayClick = (e) => {
    // Close the modal if the overlay is clicked
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");

    const printContent = `
      <html>
        <head>
          <title>Order Invoice</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              color: #333;
              margin: 0;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .header img {
              width: 100px; /* Adjust logo size */
            }
            .order-details {
              display: flex;
              background-color: red;
              padding: 35px 0;
            }
            .order-details h2 {
              margin: 0 0 10px;
              font-size: 24px;
            }
            .order-details p {
              margin: 5px 0;
              line-height: 1.5;
            }
            .total {
              font-weight: bold;
              border-top: 1px solid #676767;
              padding-top: 10px;
              margin-top: 15px;
            }
            .thank-you {
              text-align: center;
              margin-top: 30px;
              font-size: 16px;
              color: #777;
            }
              .quantity{
              padding:0 0 20px 0
              }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${logo}" alt="Logo" />
            <h2>Order Invoice</h2>
            <p>Thank you for your purchase!</p>
          </div>
          <div class="order-details">
          <div>
          <p><strong>Product Name:</strong> ${order.title}</p>
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Purchase Date:</strong> ${order.purchaseDate}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          <p class="quantity""><strong>Quantity:</strong> ${order.quantity}</p>
          <p class="total"><strong>Total Price:</strong> <FaBangladeshiTakaSign class="inline-block" /> ${order.price}</p>
          </div>
          <div>
          <p><strong>Product Name:</strong> ${order.title}</p>
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Purchase Date:</strong> ${order.purchaseDate}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          <p class="quantity""><strong>Quantity:</strong> ${order.quantity}</p>
          <p class="total"><strong>Total Price:</strong> <FaBangladeshiTakaSign class="inline-block" /> ${order.price}</p>
          </div>
          </div>
          <div class="thank-you">
            <p>We appreciate your business!</p>
            <p>If you have any questions, feel free to contact us.</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();

    // Wait for the window to load before printing
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };

    // Close the modal after triggering print
    onClose();
  };

  return (
    <div
      className="modal-overlay fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
      onClick={handleOverlayClick} // Attach click handler to overlay
    >
      <div
        className="bg-white p-8 w-[480px] rounded shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div ref={printRef} className="print-content">
          <div className="flex justify-center pt-3">
            <img
              className="w-[200px] h-[200px] object-cover mb-7"
              src={order?.image}
              alt="Product"
            />
          </div>
          <h2 className="text-[24px] font-medium">{order.title}</h2>
          <p className="mt-2">
            <strong>Order Number:</strong> {order.orderNumber}
          </p>
          <p className="mt-2">
            <strong>Purchase Date:</strong> {order.purchaseDate}
          </p>
          <p className="mt-2">
            <strong>Status:</strong> {order.status}
          </p>
          <p className="mt-2 mb-4">
            <strong>Quantity:</strong> {order.quantity}
          </p>
          <p className="mt-2 border-t pt-3 flex justify-between">
            <strong>Total Price:</strong>{" "}
            <p>
              <FaBangladeshiTakaSign className="inline-block" /> {order.price}
            </p>
          </p>
        </div>

        <div className="flex justify-between mt-5">
          {order.status === "Successful" && (
            <button
              className="mt-4 px-4 py-1 rounded-md bg-primary text-white"
              onClick={handlePrint}
            >
              Print Invoice
            </button>
          )}

          <button
            className="mt-4 px-4 py-1 rounded-md bg-red-500 text-white"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
