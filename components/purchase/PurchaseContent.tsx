"use client";

import { useEffect, useState, lazy, Suspense } from "react";
import {
  Spin,
  Pagination,
  message,
  Typography,
  Tag,
} from "antd";
import { getUserPayments } from "@/apis/payment";
import { getOrderById } from "@/apis/order";
import { PaymentDto } from "@/shared/types/payment";
import { OrderResponse } from "@/shared/types/order";
import { PAGE_SIZE } from "@/shared/constants";
import PurchaseCard from "./PurchaseCard";
import { useAuthContext } from "@/shared/hooks/useAuthContext";
import NoData from "../global/NoData";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { hoverUpAnimation } from "@/shared/types/styles";

const InvoiceModal = lazy(() => import("./InvoiceModal"));

const { Title, Text } = Typography;

export default function PurchaseContent() {
  const { userId } = useAuthContext();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();

  const page = Number(searchParams.get("page")) || 1;
  const orderBy = searchParams.get("orderBy") || "date_dsc";

  const updateURL = (key: string, value: string | number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, String(value));
    } else {
      params.delete(key);
    }

    router.push(`${pathName}?${params.toString()}`);
  };

  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState<PaymentDto[]>([]);
  const [totalPurchases, setTotalPurchases] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<PaymentDto | null>(
    null,
  );
  const [orderDetails, setOrderDetails] = useState<OrderResponse | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchPurchases = async () => {
      setLoading(true);
      try {
        const response = await getUserPayments(
          userId,
          page,
          PAGE_SIZE,
          orderBy,
        );
        setPurchases(response.payments || []);
        setTotalPurchases(response.total || 0);
      } catch {
        message.error("Failed to load purchase history.");
        setPurchases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [userId, page, orderBy]);

  const handleOpenModal = async (purchase: PaymentDto) => {
    setSelectedPurchase(purchase);
    setIsModalOpen(true);
    setLoadingOrder(true);
    try {
      const order = await getOrderById(purchase.orderId);
      setOrderDetails(order);
    } catch {
      message.error("Failed to load invoice details.");
    } finally {
      setLoadingOrder(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setOrderDetails(null);
  };

  const orderOptions = [
    { message: "Newest First", order: "date_dsc" },
    { message: "Oldest First", order: "date_asc" },
  ];

  if (loading && purchases.length === 0) {
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
          Purchase History
        </Title>
        <Text className="text-gray-500">
          Track and view your past purchases and invoices
        </Text>
      </div>

      {/* Ordering */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Text strong>Order:</Text>
        {orderOptions.map((i) => (
          <Tag
            style={{ fontSize: "16px", padding: "2px 10px" }}
            className={`${hoverUpAnimation} cursor-pointer`}
            onClick={() => updateURL("orderBy", i.order)}
            key={i.message}
          >
            {i.message}
          </Tag>
        ))}
      </div>

      {!loading && purchases.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <NoData text="Purchase" />
        </div>
      ) : (
        <>
        {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {purchases.map((purchase) => (
              <PurchaseCard
                key={purchase.id}
                purchase={purchase}
                onClick={handleOpenModal}
              />
            ))}
          </div>

          <div className="flex justify-end mt-auto pt-4">
            <Pagination
              current={page}
              pageSize={PAGE_SIZE}
              total={totalPurchases}
              onChange={(val) => updateURL("page", val)}
              showSizeChanger={false}
            />
          </div>
        </>
      )}

      {/* Invoice Modal (Dynamically Imported) */}
      <Suspense fallback={null}>
        <InvoiceModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          selectedPurchase={selectedPurchase}
          orderDetails={orderDetails}
          loadingOrder={loadingOrder}
        />
      </Suspense>
    </div>
  );
}
