"use client";

import { getCartByUserId } from "@/apis/cart";
import CartTable from "@/components/cart/CartTable";
import { useAuthContext } from "@/shared/hooks/useAuthContext";
import { CartItem } from "@/shared/interfaces/cart";
import { useEffect, useState, useCallback } from "react";
import { message } from "antd";
import axios from "axios";

export default function CartPage() {
  const { userId } = useAuthContext();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const fetchCart = useCallback(async () => {
    if (!userId) return;

    try {
      const cart = await getCartByUserId(userId);
      setCartItems(cart.cartItems);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        message.error({
          content: err.response?.data.detail || "Failed to load cart",
          duration: 2,
        });
      }
    }
  }, [userId]);

  // Initial Load
  useEffect(() => {
    fetchCart()
  }, [fetchCart]);

  return (
    <div className="w-full flex flex-col items-center">
      <CartTable cartItems={cartItems} userId={userId ?? ""} onRefresh={fetchCart} />
    </div>
  );
}
