"use client";

import { getCartByUserId } from "@/apis/cart";
import CartTable from "@/components/cart/CartTable";
import { useAuthContext } from "@/shared/hooks/useAuthContext";
import { CartItem } from "@/shared/interfaces/cart";
import { deleteCartItems } from "@/apis/cart";
import { useEffect, useState, useCallback } from "react";
import { message, Button } from "antd";
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

  const emptyCart = async () => {
    if (!userId) return;
    if (cartItems.length === 0) {
      message.error("The cart is already empty")
      return;
    }

    const itemIds = cartItems.map((item) => item.productId)

    try {
      await deleteCartItems({ userId, productIds: itemIds });
      await fetchCart();
      message.success("All items removed from cart")
    } catch (err) {
      message.error("Failed to remove items from cart")
    }
  }

  // Initial Load
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <div className="flex flex-col items-center py-10 w-full gap-4">
      {/* Title */}
      <h1 className="font-medium text-[40px]">Your Cart</h1>

      {/* Cart Items Table */}
      <CartTable
        cartItems={cartItems}
        userId={userId ?? ""}
        onRefresh={fetchCart}
      />

      {/* Buttons */}
      <div className="flex flex-row justify-between md:justify-end md:gap-4 w-[90%] px-4">
        <div className="md:w-[20%] w-full">
          <Button danger style={{ width: "100%" }} onClick={() => emptyCart()}>
            Empty Cart
          </Button>
        </div>
        <div className="md:w-[20%] w-full">
          <Button style={{ width: "100%" }}>Checkout</Button>
        </div>
      </div>
    </div>
  );
}
