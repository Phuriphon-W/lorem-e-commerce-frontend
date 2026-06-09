"use client";

import { useEffect, useState, lazy, Suspense } from "react";
import {
  Spin,
  Pagination,
  message,
  Typography,
  Tag,
} from "antd";
import { getUserOrders } from "@/apis/order";
import { OrderResponse } from "@/shared/types/order";
import { PAGE_SIZE } from "@/shared/constants";
import OrderCard from "./OrderCard";
import { useAuthContext } from "@/shared/hooks/useAuthContext";
import { useWebSocketContext } from "@/shared/hooks/useWebSocketContext";
import NoData from "../global/NoData";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { OrderStatus } from "@/shared/enums/order";
import { OrderBy } from "@/shared/enums/orderBy";
import { hoverUpAnimation } from "@/shared/types/styles";
import { checkoutOrder } from "@/apis/payment";
import axios from "axios";

const OrderDetailModal = lazy(() => import("./OrderDetailModal"));

const { Title, Text } = Typography;

export default function OrderContent() {
  const { userId } = useAuthContext();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();

  const page = Number(searchParams.get("page")) || 1;
  const status =
    (searchParams.get("status") as OrderStatus) || OrderStatus.EMPTY;
  const orderBy = (searchParams.get("orderBy") as OrderBy) || OrderBy.DateDsc;

  const updateURL = (key: string, value: string | number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, String(value));
      if (key === "status") params.set("page", "1");
    } else {
      params.delete(key);
    }

    router.push(`${pathName}?${params.toString()}`);
  };

  const [loading, setLoading] = useState(true);

  // Orders State
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(
    null,
  );

  useEffect(() => {
    if (!userId) return;

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await getUserOrders({
          userId,
          pageNumber: page,
          pageSize: PAGE_SIZE,
          status: status,
          orderBy: orderBy,
        });
        setOrders(response.orders);
        setTotalOrders(response.total);
      } catch {
        message.error("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId, page, status, orderBy, refreshTrigger]);

  const { expiredOrderIds } = useWebSocketContext();

  useEffect(() => {
    if (expiredOrderIds.length > 0) {
      setOrders((prev) =>
        prev.map((o) =>
          expiredOrderIds.includes(o.id) && o.orderStatus === OrderStatus.PENDING
            ? { ...o, orderStatus: OrderStatus.FAILED }
            : o
        )
      );
      if (selectedOrder && expiredOrderIds.includes(selectedOrder.id)) {
        setSelectedOrder((prev) => prev ? { ...prev, orderStatus: OrderStatus.FAILED } : prev);
      }
    }
  }, [expiredOrderIds, selectedOrder]);

  // Modal Handlers
  const handleOpenModal = (order: OrderResponse) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCheckout = async (orderId: string, userId: string) => {
    try {
      const { checkoutUrl } = await checkoutOrder({ orderId, userId });
      router.push(checkoutUrl);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        message.error({
          content: err.response?.data.detail || "Failed to checkout order",
          duration: 2,
        });

        setRefreshTrigger(prev => prev + 1)
      }
    }
  };

  const tags = [
    { color: "gold", message: "Pending" },
    { color: "green", message: "Paid" },
    { color: "blue", message: "Shipping" },
    { color: "purple", message: "Completed" },
    { color: "red", message: "Failed" },
  ];

  const order = [
    { message: "Newest First", order: OrderBy.DateDsc },
    { message: "Oldest First", order: OrderBy.DateAsc },
  ];

  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center w-full h-[50vh]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 md:p-8 w-full max-w-6xl mx-auto h-full">
      {/* Header */}
      <div className="flex flex-col mb-6 md:mb-8 border-b border-gray-200 pb-4">
        <Title level={3} className="mb-0 text-xl md:text-2xl">
          Order History
        </Title>
        <Text className="text-gray-500">Track and view your past orders</Text>
      </div>

      {/* Order and Filter */}
      <div className="flex flex-col md:flex-row flex-wrap mb-3 gap-3 md:gap-6">
        {/* Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <Text strong>Filter:</Text>
          {tags.map((tag) => (
            <Tag
              color={tag.color}
              style={{ fontSize: "16px", padding: "2px 10px" }}
              className={`${hoverUpAnimation}`}
              onClick={() => updateURL("status", tag.message.toLowerCase())}
              key={tag.message}
            >
              {tag.message}
            </Tag>
          ))}
        </div>

        {/* Order */}
        <div className="flex flex-wrap items-center gap-2">
          <Text strong>Order:</Text>
          {order.map((i) => (
            <Tag
              style={{ fontSize: "16px", padding: "2px 10px" }}
              className={`${hoverUpAnimation}`}
              onClick={() => updateURL("orderBy", i.order)}
              key={i.message}
            >
              {i.message}
            </Tag>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {!loading && orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <NoData text="Order" />
        </div>
      ) : (
        <>
          {/* Order Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onClick={handleOpenModal}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-end mt-auto pt-4">
            <Pagination
              current={page}
              pageSize={PAGE_SIZE}
              total={totalOrders}
              onChange={(val) => updateURL("page", val)}
              showSizeChanger={false}
            />
          </div>
        </>
      )}

      {/* Order Details Modal (Dynamically Imported) */}
      <Suspense fallback={null}>
        <OrderDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          selectedOrder={selectedOrder}
          userId={userId}
          onCheckout={handleCheckout}
        />
      </Suspense>
    </div>
  );
}
