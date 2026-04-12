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
import axios from "axios";
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
      const response = await addCartItem({
        userId,
        productId: product.id,
        quantity,
      });
      message.success(`Added ${quantity} items to your cart!`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverMessage = error.response?.data?.detail;

        if (serverMessage) {
          message.error({
            content: serverMessage,
            style: {
              maxWidth: "350px", 
              marginLeft: "auto",
              marginRight: "auto",
            },
          });
        } else {
          // Fallback if the server crashed and didn't send our formatted JSON
          message.error("Failed to add product to cart. Please try again.");
        }
      } else {
        message.error("An unexpected error occurred.");
      }
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
          className="object-cover hover:scale-105 duration-500 transition-transform"
          sizes="(max-width: 768px) 100vw, 500px"
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
