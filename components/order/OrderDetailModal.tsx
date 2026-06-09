"use client";

import { Modal, Typography, Button } from "antd";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { OrderResponse } from "@/shared/types/order";
import { OrderStatus } from "@/shared/enums/order";
import { formatNumber } from "@/shared/utils/number";

const { Title, Text } = Typography;

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOrder: OrderResponse | null;
  userId: string | null;
  onCheckout: (orderId: string, userId: string) => Promise<void>;
}

export default function OrderDetailModal({
  isOpen,
  onClose,
  selectedOrder,
  userId,
  onCheckout,
}: OrderDetailModalProps) {
  return (
    <Modal
      title={<span className="text-lg">Order Details</span>}
      open={isOpen}
      onCancel={onClose}
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
                    {item.product?.image_url ? (
                      <Image
                        src={item.product.image_url}
                        alt={item.product.name || "Product"}
                        fill
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
                      {item.product?.name || "Unavailable Product"}
                    </Text>
                    <Text className="text-gray-400 text-xs md:text-sm truncate">
                      {item.product?.description || "This product is no longer available."}
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
            onClick={() => onCheckout(selectedOrder.id, userId ?? "")}
          >
            <FontAwesomeIcon icon={faDollarSign} />
            Checkout
          </Button>
        </div>
      )}
    </Modal>
  );
}
