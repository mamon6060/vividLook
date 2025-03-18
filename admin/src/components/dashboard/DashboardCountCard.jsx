import { Card } from "antd";
import { ReactNode } from "react";

// interface DashboardCountCardProps {
//   value: number | string;
//   label: string;
//   bgColor?: string;
//   icon?: ReactNode;
// }

const DashboardCountCard = ({ value, label, bgColor = "#f0f2f5", icon }) => {
  return (
    <Card
      style={{
        background: bgColor,
        textAlign: "center",
        borderRadius: 10,
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ fontSize: 24 }}>{icon}</div>
      <h2 style={{ margin: "10px 0", fontSize: 20 }}>{value}</h2>
      <p style={{ fontSize: 14, color: "#555" }}>{label}</p>
    </Card>
  );
};

export default DashboardCountCard;
