"use client";

import { Card, Tag, Typography } from "antd";
import { OrderResponse } from "@/shared/types/order";
import { formatNumber } from "@/shared/utils/number";

const { Text, Title } = Typography;

interface OrderCardProps {
  order: OrderResponse;
  onClick: (order: OrderResponse) => void;
}

export default function OrderCard({ order, onClick }: OrderCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "green";
      case "shipping":
        return "blue";
      case "completed":
        return "purple";
      case "pending":
        return "gold";
      case "failed":
        return "red";
      default:
        return "gold";
    }
  };

  return (
    <Card
      hoverable
      onClick={() => onClick(order)}
      className="w-full shadow-sm hover:shadow-sm transition-shadow"
      styles={{ body: { padding: "16px" } }}
    >
      <div className="flex justify-between items-start mb-2">
        <Text className="text-gray-500 text-xs">
          Order ID: {order.id.split("-")[0].toUpperCase()}
        </Text>
        <Tag color={getStatusColor(order.orderStatus)} className="m-0 capitalize">
          {order.orderStatus}
        </Tag>
      </div>
      
      <Title level={5} className="mt-2 mb-1">
        ${formatNumber(order.totalPrice)}
      </Title>
      
      <div className="flex justify-between items-end mt-4">
        <Text className="text-gray-500 text-sm">
          {order.orderItems.length} Item{order.orderItems.length > 1 ? "s" : ""}
        </Text>
        <Text className="text-gray-400 text-xs">
          {new Date(order.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </Text>
      </div>
    </Card>
  );
}