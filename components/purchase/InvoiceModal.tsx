"use client";

import { Modal, Typography, Spin, Divider } from "antd";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileInvoice,
  faCalendarAlt,
  faHashtag,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";
import { PaymentDto } from "@/shared/types/payment";
import { OrderResponse } from "@/shared/types/order";
import { formatNumber } from "@/shared/utils/number";

const { Title, Text } = Typography;

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPurchase: PaymentDto | null;
  orderDetails: OrderResponse | null;
  loadingOrder: boolean;
}

export default function InvoiceModal({
  isOpen,
  onClose,
  selectedPurchase,
  orderDetails,
  loadingOrder,
}: InvoiceModalProps) {
  return (
    <Modal
      title={
        <div className="flex items-center gap-2 py-2">
          <FontAwesomeIcon icon={faFileInvoice} className="text-blue-600" />
          <span>Tax Invoice / Receipt</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
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
                    {new Date(selectedPurchase.createdAt).toLocaleDateString()}
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
                <Spin size="medium" />
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
                          {item.product?.image_url ? (
                            <Image
                              src={item.product.image_url}
                              alt={item.product.name || "Product"}
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
                            {item.product?.name || "Unavailable Product"}
                          </Text>
                          <Text className="text-gray-400 text-xs truncate">
                            {item.product?.description || "This product is no longer available."}
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
  );
}
