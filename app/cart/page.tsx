"use client";

import { getCartByUserId, deleteCartItems } from "@/apis/cart";
import { createOrder } from "@/apis/order";
import CartTable from "@/components/cart/table/CartTable";
import { useAuthContext } from "@/shared/hooks/useAuthContext";
import { OrderItemRequest } from "@/shared/types/order";
import { CartItem } from "@/shared/interfaces/cart";
import { useEffect, useState, useCallback } from "react";
import { message, Button } from "antd";
import axios from "axios";
import useMediaQuery from "@/shared/hooks/useMediaQuery";
import CartMobile from "@/components/cart/CartMobile";
import NoData from "@/components/global/NoData";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { userId } = useAuthContext();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const isMobile = useMediaQuery("(max-width: 768px)");

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
      message.error("The cart is already empty");
      return;
    }

    const itemIds = cartItems.map((item) => item.productId);

    try {
      await deleteCartItems({ userId, productIds: itemIds });
      await fetchCart();
      message.success("All items removed from cart");
    } catch (err) {
      message.error("Failed to remove items from cart");
    }
  };

  const checkOut = async () => {
    if (!userId) return;
    if (cartItems.length === 0) {
      message.error("Your cart is empty");
      return;
    }

    const orderItemDetails = cartItems.map(
      (item): OrderItemRequest => ({
        productId: item.productId,
        quantity: item.quantity,
      }),
    );

    try {
      // Create Order
      const response = await createOrder({ userId, items: orderItemDetails });

      // Clear cart
      const itemIds = cartItems.map((item) => item.productId);
      await deleteCartItems({ userId, productIds: itemIds });

      // Re fetch cart
      await fetchCart();

      message.success(`Order created successfully. Your order ID is ${response.id}`);
      router.push('/order')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        message.error({
          content: err.response?.data.detail || "Failed to load cart",
          duration: 2,
        });
      }
    }
  };

  // Initial Load
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <div className="flex flex-col items-center py-10 w-full gap-4">
      {/* Title */}
      <h1 className="font-medium text-[30px] md:text-[40px]">Your Cart</h1>

      {/* Empty Cart */}
      {
        cartItems.length <= 0 && (
          <NoData text="Cart"/>
        )
      }

      {/* Cart Items Table */}
      {!isMobile && cartItems.length > 0 && (
        <CartTable
          cartItems={cartItems}
          userId={userId ?? ""}
          onRefresh={fetchCart}
        />
      )}

      {/* Cart Items Mobile */}
      {isMobile && cartItems.length > 0 && (
        <CartMobile
          cartItems={cartItems}
          userId={userId ?? ""}
          onRefresh={fetchCart}
        />
      )}

      {/* Buttons */}
      {cartItems.length > 0 && (
        <div className="flex flex-row justify-between md:justify-end gap-4 w-[90%] px-4 ">
          <div className="md:w-[20%] w-full">
            <Button
              danger
              style={{ width: "100%" }}
              onClick={() => emptyCart()}
            >
              Empty Cart
            </Button>
          </div>
          <div className="md:w-[20%] w-full">
            <Button style={{ width: "100%" }} onClick={() => checkOut()}>
              Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
