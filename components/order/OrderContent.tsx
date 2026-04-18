"use client";

import { useEffect, useState } from "react";
import {
  Spin,
  Pagination,
  message,
  Typography,
  Modal,
  Tag,
  Button,
} from "antd";
import { getUserOrders } from "@/apis/order";
import { OrderResponse } from "@/shared/types/order";
import { PAGE_SIZE } from "@/shared/constants";
import OrderCard from "./OrderCard";
import Image from "next/image";
import { useAuthContext } from "@/shared/hooks/useAuthContext";
import NoData from "../global/NoData";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { OrderStatus } from "@/shared/enums/order";
import { formatNumber } from "@/shared/utils/number";
import { OrderBy } from "@/shared/enums/orderBy";
import { hoverUpAnimation } from "@/shared/types/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { checkoutOrder } from "@/apis/payment";
import axios from "axios";

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
      } catch (error) {
        message.error("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId, page, status, orderBy, refreshTrigger]);

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

      {/* Order Details Modal */}
      <Modal
        title={<span className="text-lg">Order Details</span>}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={700}
        centered
        destroyOnHidden
      >
        {selectedOrder && (
          <div className="flex flex-col">
            {/* Modal Header: Order Summary */}
            <div className="bg-gray-50 p-4 rounded-md mb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <Text className="block text-gray-500 text-xs uppercase mb-1">
                  Order ID
                </Text>
                <Text className="font-medium text-sm">{selectedOrder.id}</Text>
              </div>
              <div className="flex sm:flex-col justify-between sm:items-end w-full sm:w-auto">
                <Text className="text-xl font-bold">
                  ${formatNumber(selectedOrder.totalPrice)}
                </Text>
                <Text className="text-gray-500 text-xs">
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </Text>
              </div>
            </div>

            <Title level={5} className="mb-2">
              Items
            </Title>

            {/* Modal Content: Scrollable Items List */}
            <div className="max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar flex flex-col">
              {selectedOrder.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="border-b border-gray-100 last:border-0 py-4"
                >
                  <div className="flex items-center w-full gap-4">
                    {/* Image Placeholder */}
                    <div className="relative w-16 h-16 bg-gray-100 rounded-md shrink-0 flex items-center justify-center overflow-hidden">
                      {item.product.image_url ? (
                        <Image
                          src={item.product.image_url}
                          alt={item.product.name}
                          fill
                          priority
                          className="object-cover"
                          sizes="(max-width: 768px) 50px, 100px"
                        />
                      ) : (
                        <Text type="secondary" className="text-xs">
                          No Img
                        </Text>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col grow min-w-0">
                      <Text className="font-medium truncate text-sm md:text-base">
                        {item.product.name}
                      </Text>
                      <Text className="text-gray-400 text-xs md:text-sm truncate">
                        {item.product.description}
                      </Text>
                    </div>

                    {/* Pricing & Quantity */}
                    <div className="flex flex-col items-end shrink-0 ml-2">
                      <Text className="font-semibold text-sm">
                        ${formatNumber(item.priceAtPurchase)}
                      </Text>
                      <Text className="text-gray-500 text-xs">
                        Qty: {item.quantity}
                      </Text>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Checkout Button (Only visible for pending) */}
        {selectedOrder?.orderStatus == OrderStatus.PENDING && (
          <div className="text-end border-t border-gray-100 pt-4">
            <Button
              className="gap-x-0!"
              onClick={() => handleCheckout(selectedOrder.id, userId ?? "")}
            >
              <FontAwesomeIcon icon={faDollarSign} />
              Checkout
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
