"use client";

import { useEffect, useState } from "react";
import {
  Spin,
  Pagination,
  message,
  Typography,
  Modal,
  Tag,
  Divider,
} from "antd";
import { getUserPayments } from "@/apis/payment";
import { getOrderById } from "@/apis/order";
import { PaymentDto } from "@/shared/types/payment";
import { OrderResponse } from "@/shared/types/order";
import { PAGE_SIZE } from "@/shared/constants";
import PurchaseCard from "./PurchaseCard";
import Image from "next/image";
import { useAuthContext } from "@/shared/hooks/useAuthContext";
import NoData from "../global/NoData";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formatNumber } from "@/shared/utils/number";
import { hoverUpAnimation } from "@/shared/types/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileInvoice,
  faCreditCard,
  faCalendarAlt,
  faHashtag,
} from "@fortawesome/free-solid-svg-icons";

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
      } catch (error) {
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
    } catch (error) {
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

      {/* Invoice Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 py-2">
            <FontAwesomeIcon icon={faFileInvoice} className="text-blue-600" />
            <span>Tax Invoice / Receipt</span>
          </div>
        }
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={800}
        centered
        destroyOnHidden
        style={{ padding: 0, overflow: "hidden", borderRadius: "16px" }}
      >
        {selectedPurchase && (
          <div className="flex flex-col">
            {/* Invoice Header Section */}
            <div className="bg-gray-50 p-8 border-b border-gray-100">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <Title
                    level={4}
                    className="m-0! text-gray-400 uppercase tracking-widest text-xs mb-1"
                  >
                    Official Receipt
                  </Title>
                  <Title level={2} className="m-0! text-blue-600">
                    Invoice
                  </Title>
                </div>
                <div className="text-right">
                  <div className="mt-2">
                    <Text className="text-gray-400 block text-[10px] uppercase">
                      Invoice Number
                    </Text>
                    <Text className="font-mono text-sm font-bold">
                      INV-{selectedPurchase.id.split("-")[0].toUpperCase()}
                    </Text>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <Text className="text-gray-400 block text-[10px] uppercase mb-1">
                    Date of Issue
                  </Text>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      className="text-xs opacity-50"
                    />
                    <Text className="text-sm">
                      {new Date(
                        selectedPurchase.createdAt,
                      ).toLocaleDateString()}
                    </Text>
                  </div>
                </div>
                <div>
                  <Text className="text-gray-400 block text-[10px] uppercase mb-1">
                    Order ID
                  </Text>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FontAwesomeIcon
                      icon={faHashtag}
                      className="text-xs opacity-50"
                    />
                    <Text className="text-sm font-mono">
                      {selectedPurchase.orderId.split("-")[0].toUpperCase()}
                    </Text>
                  </div>
                </div>
                <div>
                  <Text className="text-gray-400 block text-[10px] uppercase mb-1">
                    Payment Method
                  </Text>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FontAwesomeIcon
                      icon={faCreditCard}
                      className="text-xs opacity-50"
                    />
                    <Text className="text-sm capitalize">
                      {selectedPurchase.method}
                    </Text>
                  </div>
                </div>
                <div>
                  <Text className="text-gray-400 block text-[10px] uppercase mb-1">
                    Total Paid
                  </Text>
                  <Text className="text-blue-600 text-xl font-bold">
                    ${formatNumber(selectedPurchase.amount)}
                  </Text>
                </div>
              </div>
            </div>

            {/* Items Section */}
            <div className="p-8">
              <Title
                level={5}
                className="mb-4 text-gray-400 uppercase text-[10px] tracking-widest border-b pb-2"
              >
                Order Description
              </Title>

              {loadingOrder ? (
                <div className="py-12 flex justify-center w-full">
                  <Spin size="medium" description="Retrieving item details..." />
                </div>
              ) : orderDetails ? (
                <div className="flex flex-col gap-0">
                  <div className="hidden md:grid grid-cols-12 gap-4 px-2 py-2 text-[10px] font-bold text-gray-400 uppercase">
                    <div className="col-span-7">Description</div>
                    <div className="col-span-2 text-center">Qty</div>
                    <div className="col-span-3 text-right">Amount</div>
                  </div>

                  <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                    {orderDetails.orderItems.map((item) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-12 gap-4 items-center py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 px-2 transition-colors"
                      >
                        <div className="col-span-12 md:col-span-7 flex items-center gap-4">
                          <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                            {item.product.image_url ? (
                              <Image
                                src={item.product.image_url}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                                sizes="80px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-300">
                                NO IMG
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <Text className="font-semibold text-sm truncate">
                              {item.product.name}
                            </Text>
                            <Text className="text-gray-400 text-xs truncate">
                              {item.product.description}
                            </Text>
                          </div>
                        </div>
                        <div className="col-span-6 md:col-span-2 text-center">
                          <Text className="md:hidden text-[10px] text-gray-400 block">
                            QTY:{" "}
                          </Text>
                          <Text className="text-sm font-medium">
                            {item.quantity}
                          </Text>
                        </div>
                        <div className="col-span-6 md:col-span-3 text-right">
                          <Text className="md:hidden text-[10px] text-gray-400 block">
                            PRICE:{" "}
                          </Text>
                          <Text className="text-sm font-bold text-blue-600">
                            ${formatNumber(item.priceAtPurchase)}
                          </Text>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 bg-gray-50 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-2">
                      <Text className="text-gray-400 text-xs">Subtotal</Text>
                      <Text className="font-medium">
                        ${formatNumber(selectedPurchase.amount)}
                      </Text>
                    </div>
                    {/* Add tax just in case for future */}
                    <div className="flex justify-between items-center mb-4">
                      <Text className="text-gray-400 text-xs">Tax (0%)</Text>
                      <Text className="font-medium">$0.00</Text>
                    </div>
                    <Divider className="my-2" />
                    <div className="flex justify-between items-center pt-2">
                      <Title level={4} className="m-0! text-blue-600">
                        Grand Total
                      </Title>
                      <Title level={3} className="m-0! text-blue-700">
                        ${formatNumber(selectedPurchase.amount)}
                      </Title>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-gray-400 italic">
                  Details could not be loaded. Please try again.
                </div>
              )}
            </div>

            <div className="px-8 pb-8 text-center">
              <Text className="text-[10px] text-gray-300 uppercase tracking-widest">
                Thank you for your business!
              </Text>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
