import { CartItem } from "../interfaces/cart";

export type GetCartResponse = {
  cartId: string;
  cartItems: CartItem[];
};

export type AddCartItemRequest = {
  userId: string;
  productId: string;
  quantity?: number;
};

export type EditCartItemRequest = {
  userId: string;
  productId: string;
  quantity: number;
};

export type DeleteCartItemsRequest = {
  userId: string;
  productIds: string[];
};

export type CartSuccessResponse = {
  message: string;
};
