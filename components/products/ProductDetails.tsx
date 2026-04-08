'use client'

import { useState } from "react";
import { Product } from "@/shared/interfaces/product";
import ItemDetail from "../global/ItemDetail";
import { Typography, Button, message } from "antd";
import Image from "next/image";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { InputNumber } from "antd";

const { Title, Text } = Typography;

type ProductDetailsProps = {
  product: Product;
};

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity: quantity }),
      });

      if (!response.ok) throw new Error('Failed to add item');
      message.success(`Added ${quantity} ${product.name} to your cart!`);
    } catch (error) {
      message.error("Failed to add product to cart. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-100px)] flex flex-col md:flex-row p-6 md:p-10 gap-8 lg:gap-16 bg-white rounded-2xl shadow-sm border border-gray-100">
      
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
          <Title level={2} className="mb-0!">{product.name}</Title>
          
          <Text className="text-xl! md:text-2xl! font-bold">
            ${product.price.toFixed(2)}
          </Text>

          {/* Specs List */}
          <div className="flex flex-col mt-4">
            <ItemDetail label="Category" details={product.category.name} />
            <ItemDetail label="Available" details={`${product.available} in stock`} />
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
    </div>
  );
}