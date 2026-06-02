"use client";

import { useEffect, useState } from "react";
import { Card, Tag, Typography } from "antd";
import { OrderResponse } from "@/shared/types/order";
import { formatNumber } from "@/shared/utils/number";

const { Text, Title } = Typography;

interface OrderCardProps {
  order: OrderResponse;
  onClick: (order: OrderResponse) => void;
}

export default function OrderCard({ order, onClick }: OrderCardProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (order.orderStatus === "pending" && order.stripeSessionExpiresAt) {
      const calculateTimeLeft = () => {
        const diff = Math.floor(
          order.stripeSessionExpiresAt! - Date.now() / 1000,
        );
        return diff > 0 ? diff : 0;
      };

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTimeLeft(calculateTimeLeft());

      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [order]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

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
        <Tag
          color={getStatusColor(order.orderStatus)}
          className="m-0 capitalize"
        >
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

      <div className="mt-2 min-h-[28px]">
        {order.orderStatus === "pending" &&
          order.stripeSessionExpiresAt &&
          timeLeft > 0 && (
            <div className="text-red-500 font-semibold text-xs flex justify-between items-center px-2 py-1 rounded">
              <span>Expires in:</span>
              <span>{formatTime(timeLeft)}</span>
            </div>
          )}
      </div>
    </Card>
  );
}
