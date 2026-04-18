"use client";

import { Card, Typography, Divider } from "antd";
import { PaymentDto } from "@/shared/types/payment";
import { formatNumber } from "@/shared/utils/number";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileInvoice, faCreditCard, faHashtag } from "@fortawesome/free-solid-svg-icons";

const { Text, Title } = Typography;

interface PurchaseCardProps {
  purchase: PaymentDto;
  onClick: (purchase: PaymentDto) => void;
}

export default function PurchaseCard({ purchase, onClick }: PurchaseCardProps) {

  return (
    <Card
      hoverable
      onClick={() => onClick(purchase)}
      className="w-full border-t-4 border-t-blue-500 shadow-md hover:shadow-lg transition-all"
      styles={{ body: { padding: "20px" } }}
    >
      {/* Invoice Number */}
      <div className="flex mb-4"> 
        <div className="flex items-center gap-2">
          <div className="bg-blue-50 p-2 rounded-lg text-blue-500">
            <FontAwesomeIcon icon={faFileInvoice} />
          </div>
          <div>
            <Text className="text-gray-400 text-[10px] uppercase block leading-none">Invoice No.</Text>
            <Text className="font-bold text-sm">#{purchase.id.split("-")[0].toUpperCase()}</Text>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div>
          {/* Order ID */}
          <Text className="text-gray-400 text-[10px] uppercase block mb-1">Order ID</Text>
          <div className="flex items-center gap-2 text-gray-600">
            <FontAwesomeIcon icon={faHashtag} className="text-[10px]" />
            <Text className="text-sm font-mono">{purchase.orderId.split("-")[0].toUpperCase()}</Text>
          </div>
        </div>
        <div>
          {/* Payment Method */}
          <Text className="text-gray-400 text-[10px] uppercase block mb-1">Payment Method</Text>
          <div className="flex items-center gap-2 text-gray-600">
            <FontAwesomeIcon icon={faCreditCard} className="text-[10px]" />
            <Text className="text-sm capitalize">{purchase.method}</Text>
          </div>
        </div>
      </div>

      <Divider className="my-3" />

      <div className="flex justify-between items-center">
        {/* Date */}
        <div>
          <Text className="text-gray-400 text-[10px] uppercase block">Date</Text>
          <Text className="text-xs">
            {new Date(purchase.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </Text>
        </div>
        {/* Payment Amount */}
        <div className="text-right">
          <Text className="text-gray-400 text-[10px] uppercase block">Total Amount</Text>
          <Title level={4} className="m-0! text-blue-600">
            ${formatNumber(purchase.amount)}
          </Title>
        </div>
      </div>
    </Card>
  );
}
