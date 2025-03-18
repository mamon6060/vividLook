import {
  message,
  // Badge,
  Button,
  // Form,
  // Input,
  // message,
  // Modal,
  Popconfirm,
  // Switch,
  Table,
  Dropdown,
  Menu,
} from "antd";
import {
  CheckCircleOutlined,
  //   EditOutlined,
  DeleteOutlined,
  EditOutlined,
  WhatsAppOutlined,
  //   PlusSquareOutlined,
} from "@ant-design/icons";
import useBookingActions from "../hooks/useBookingActions";
import useTranslateActions from "../hooks/usetranslationActions";
import useMechanicActions from "../hooks/useMechanicActions";
// import { format } from "date-fns";
// import { useState } from "react";

const Bookings = () => {
  const {
    bookings,
    loading,
    updateBooking,
    updateBookingStatus,
    deleteBooking,
  } = useBookingActions();
  const { createTranslate } = useTranslateActions();
  const { updateMechanic } = useMechanicActions();

  const handleDeleteBooking = async (id) => {
    try {
      await deleteBooking(id);
    } catch (error) {
      message.error("Failed to delete contact", error);
    }
  };

  const handleSendWhatsApp = async (booking, mechanic) => {
    const messageInEnglish = `
*Madina Refrigeration* | *Booking Details*
----------------------------------------------
 *Name:* ${booking.name}
 *Phone:* ${booking.phone}
 *Area:* ${booking.areaRef.name}, ${booking.thanaRef.name}, ${
      booking.districtRef.name
    }
 *Address:* ${booking.streetAddress}
 *Date:* *${new Date(booking.bookingDate).toLocaleDateString()}*
 *Time:* ${new Date(
   booking.bookingStartTime
 ).toLocaleTimeString()} - ${new Date(
      booking.bookingEndTime
    ).toLocaleTimeString()}
 *Services:* *${booking.services.map((s) => s.serviceRef.heading).join(", ")}*
 *Total Cost:* ${booking.totalCost} BDT
 *Booking ID:* ${booking.bookingId}

 Please confirm your availability.
    `;

    // const messageBangla = await translateText(messageInEnglish, "bn");
    const messageBangla = await createTranslate(messageInEnglish);

    const message = `
    ${messageBangla}
*****************************************************
    ${messageInEnglish}
     `;

    console.log(message, "translated message from booking action...........");

    const whatsappUrl = `https://wa.me/+88${
      mechanic.phone
    }?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleAssignMechanic = async (booking, mechanic) => {
    // console.log(booking, "booking after handle assign click");
    // console.log(mechanic, "mechanic after handle assign click");

    try {
      await updateBooking(booking._id, {
        mechanicRef: mechanic._id,
        updatedAt: new Date(),
      });

      await updateMechanic(mechanic._id, { totalService: 1 });
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleUpdateBookingStatus = async (id, status) => {
    try {
      await updateBookingStatus(id, { bookingStatus: status });
      // message.success(`Booking status updated to ${status}`);
    } catch (error) {
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Service",
      key: "serviceRef",
      render: (_, record) => {
        return (
          <div className="grid grid-cols-1 gap-2">
            {record.services?.map((service, index) => (
              <div key={index} className="text-cyan-600 border rounded p-2">
                <span>{index + 1}. </span>
                <span className="font-semibold">
                  {service?.serviceRef?.heading}
                </span>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      title: "Booking Date",
      dataIndex: "bookingDate",
      key: "bookingDate",
      render: (_, record) => (
        <>{new Date(record.bookingDate).toLocaleDateString()}</>
      ),
    },
    {
      title: "Booking Time",
      render: (_, record) => (
        <>
          {record.bookingStartTime} - {record.bookingEndTime}
        </>
        // <>
        //   {new Date(record.bookingStartTime).toLocaleTimeString()} -{" "}
        //   {new Date(record.bookingEndTime).toLocaleTimeString()}
        // </>
      ),
    },
    {
      title: "District",
      dataIndex: "districtRef",
      key: "districtRef",
      render: (_, record) => (
        <div>
          <p>{record.districtRef.name}</p>
        </div>
      ),
    },
    {
      title: "Thana",
      dataIndex: "thanaRef",
      key: "thanaRef",
      render: (_, record) => (
        <div>
          <p>{record.thanaRef.name}</p>
        </div>
      ),
    },
    {
      title: "Area",
      dataIndex: "areaRef",
      key: "areaRef",
      render: (_, record) => (
        <div className="text-cyan-600 ">
          <p>{record.areaRef.name}</p>
        </div>
      ),
    },
    {
      title: "Street Address",
      dataIndex: "streetAddress",
      key: "streetAddress",
    },
    {
      title: "Total",
      dataIndex: "totalCost",
      key: "totalCost",
      render: (_, record) => <>{record.totalCost} TK</>,
    },
    {
      title: "Booking Status",
      dataIndex: "bookingStatus",
      key: "bookingStatus",
      render: (_, record) => (
        <div
          className={`px-2 py-1 rounded-full flex justify-center items-center ${
            record.bookingStatus === "received" && "bg-yellow-500 text-white"
          } ${
            record.bookingStatus === "cancelled" && "bg-rose-500 text-white"
          } ${
            record.bookingStatus === "complete" && "bg-green-500 text-white"
          }`}
        >
          {record.bookingStatus === "received" && "Received"}
          {record.bookingStatus === "cancelled" && "Cancelled"}
          {record.bookingStatus === "complete" && "Complete"}
        </div>
      ),
    },
    {
      title: "Booking ID",
      dataIndex: "bookingId",
      key: "bookingId",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
    },
    {
      title: "Assigned Mechanic",
      dataIndex: "mechanicRef",
      key: "mechanicRef",
      render: (_, record) => {
        return record.mechanicRef ? (
          <div className="text-cyan-600 ">
            <p className="font-semibold">{record.mechanicRef.name}</p>
            <p className="font-bold">{record.mechanicRef.phone}</p>
          </div>
        ) : (
          <span>No mechanic assigned</span>
        );
      },
    },
    {
      title: "Available Mechanics",
      render: (_, record) => {
        return record.mechanics.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {record.mechanics.map((mechanic, index) => (
              <div key={mechanic._id} className="border rounded p-2">
                <div className="flex items-center justify-start gap-2">
                  <span>{index + 1}. </span>
                  <span className="font-semibold">{mechanic.name}</span>
                </div>

                <p className="font-bold">{mechanic.phone}</p>

                <div className="flex items-center justify-between gap-2">
                  <Button
                    type="primary"
                    className="bg-[#25D366] hover:!bg-[#128C7E]"
                    onClick={() => handleSendWhatsApp(record, mechanic)}
                  >
                    <WhatsAppOutlined className="text-lg" />
                  </Button>
                  {/* <Button
                    type="default"
                    onClick={() => handleAssignMechanic(record, mechanic)}
                  >
                    <CheckCircleOutlined className="text-lg" />
                  </Button> */}
                  <Popconfirm
                    title="Are you sure to assign this mechanic?"
                    onConfirm={() => handleAssignMechanic(record, mechanic)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="default">
                      <CheckCircleOutlined className="text-lg" />
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <span>No mechanics available in this area.</span>
        );
      },
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
                    handleUpdateBookingStatus(record._id, "cancelled")
                  }
                  className="!text-red-500 hover:!bg-red-500 hover:!text-white"
                >
                  Mark as Cancel
                </Menu.Item>
                <Menu.Item
                  onClick={() =>
                    handleUpdateBookingStatus(record._id, "complete")
                  }
                  className="!text-green-500 hover:!bg-green-500 hover:!text-white"
                >
                  Mark as Complete
                </Menu.Item>
              </Menu>
            }
            trigger={["click"]}
          >
            <Button icon={<EditOutlined />}>{/* <EditOutlined /> */}</Button>
          </Dropdown>
          <Popconfirm
            title="Are you sure to delete this contact?"
            onConfirm={() => handleDeleteBooking(record._id)}
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
    <div className="bg-white my-6 p-8 rounded-md">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Service Bookings</h1>
      </div>

      <Table
        dataSource={bookings}
        columns={columns}
        rowKey="_id"
        loading={loading}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default Bookings;
