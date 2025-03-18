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
} from "antd";
import {
  CarryOutOutlined,
  //   EditOutlined,
  DeleteOutlined,
  DollarOutlined,
  MoneyCollectOutlined,
  ShoppingCartOutlined,
  //   PlusSquareOutlined,
} from "@ant-design/icons";
import useOrderActions from "../hooks/useOrderActions";
import DashboardCountCard from "../components/dashboard/DashboardCountCard";
// import { useState } from "react";

const Dashboard = () => {
  const { dashboardCounts, loading } = useOrderActions();
  console.log(dashboardCounts, "dahboard count");

  return (
    <div className="bg-white my-6 p-8 rounded-md">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <h1 className="text-xl font-semibold mb-3">Product Summary</h1>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <DashboardCountCard
          value={dashboardCounts?.totalOrders}
          label="Total Orders"
          icon={<ShoppingCartOutlined />}
        />
        <DashboardCountCard
          value={dashboardCounts?.totalSales}
          label="Total Sales"
          icon={<DollarOutlined />}
        />
        <DashboardCountCard
          value={dashboardCounts?.totalStock}
          label="Total Stocks"
          icon={<DollarOutlined />}
        />
        <DashboardCountCard
          value={dashboardCounts?.totalStockValue}
          label="Total Stock Vaue"
          icon={<DollarOutlined />}
        />
      </div>

      <h1 className="text-xl font-semibold mb-3">Service Summary</h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <DashboardCountCard
          value={dashboardCounts?.totalBookings}
          label="Total Bookings"
          icon={<CarryOutOutlined />}
        />
        <DashboardCountCard
          value={dashboardCounts?.totalBookingSales}
          label="Total Booking Sales"
          icon={<MoneyCollectOutlined />}
        />
      </div>
    </div>
  );
};

export default Dashboard;
