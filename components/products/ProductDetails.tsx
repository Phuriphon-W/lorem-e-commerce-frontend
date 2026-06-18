"use client";

import { useState } from "react";
import { Product } from "@/shared/interfaces/product";
import ItemDetail from "../global/ItemDetail";
import { Typography, Button, message } from "antd";
import Image from "next/image";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { InputNumber } from "antd";
import { addCartItem } from "@/apis/cart";
import { useAuthContext } from "@/shared/hooks/useAuthContext";
import { sanitizeErrorMessage } from "@/shared/utils/errorSanitizer";
import { formatNumber } from "@/shared/utils/number";

const { Title, Text } = Typography;

type ProductDetailsProps = {
  product: Product;
};

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { userId } = useAuthContext();

  const handleAddToCart = async () => {
    if (!userId) return;
    setIsAdding(true);

    try {
      await addCartItem({
        userId,
        productId: product.id,
        quantity,
      });
      message.success(`Added ${quantity} items to your cart!`);
    } catch (error) {
      const serverMessage = sanitizeErrorMessage(error);
      message.error({
        content: serverMessage,
        style: {
          maxWidth: "350px", 
          marginLeft: "auto",
          marginRight: "auto",
        },
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      {/* Image Section */}
      <div className="relative w-full md:w-1/2 shrink-0 aspect-square bg-gray-50 rounded-xl overflow-hidden shadow-inner">
        <Image
          alt={`${product.name}-image`}
          src={product.image_url}
          fill
          priority
          className="object-cover hover:scale-105 duration-500 transition-transform"
          sizes="(max-width: 768px) 100vw, 500px"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIHZpZXdCb3g9IjAgMCAxIDEiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlNWU3ZWIiLz48L3N2Zz4="
        />
      </div>

      {/* Text Section */}
      <div className="flex flex-col w-full flex-1 h-full justify-between">
        {/* Top Info */}
        <div className="flex flex-col gap-4">
          <Title level={2} className="mb-0!">
            {product.name}
          </Title>

          <Text className="text-xl! md:text-2xl! font-bold">
            ${formatNumber(product.price)}
          </Text>

          {/* Specs List */}
          <div className="flex flex-col mt-4">
            <ItemDetail label="Category" details={product.category.name} />
            <ItemDetail
              label="Available"
              details={`${product.available} in stock`}
            />
            {/* 
              SECURITY NOTE: Render product description as plain text using React's default 
              escaping to prevent XSS. Do NOT change to use dangerouslySetInnerHTML or any 
              untrusted markdown renderer without proper sanitization.
            */}
            <div className="mt-4 text-gray-600 leading-relaxed">
              {product.description}
            </div>
          </div>
        </div>

        {/* Bottom Actions (Quantity & Cart) */}
        <div className="mt-8 flex flex-col gap-6 pt-6 border-t border-gray-100 w-full">
          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="font-semibold text-gray-700">Quantity:</span>
            <InputNumber
              mode="spinner"
              min={1}
              max={product.available}
              defaultValue={1}
              style={{ width: 150 }}
              onChange={(value) => setQuantity(value ?? 1)}
            />
          </div>

          {/* Add to Cart Button */}
          <Button
            type="primary"
            size="large"
            icon={<ShoppingCartOutlined />}
            loading={isAdding}
            onClick={handleAddToCart}
            className="w-full h-12 text-lg font-semibold border-none shadow-md"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </>
  );
}
