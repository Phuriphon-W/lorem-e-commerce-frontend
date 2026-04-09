import { serverAddr } from "@/shared/constants";
import axios from "axios";
import {
  GetCartResponse,
  AddCartItemRequest,
  EditCartItemRequest,
  DeleteCartItemsRequest,
  CartSuccessResponse,
} from "@/shared/types/cart";

export const getCartByUserId = async (
  userId: string,
  cookieString?: string,
): Promise<GetCartResponse> => {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (cookieString) {
    headers.Cookie = cookieString;
  }

  const options = {
    method: "GET",
    url: `${serverAddr}/api/user/${userId}/cart`,
    headers: headers,
    withCredentials: true,
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const addCartItem = async (
  { userId, productId, quantity = 1 }: AddCartItemRequest,
  cookieString?: string,
): Promise<{ cartItemId: string }> => {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (cookieString) {
    headers.Cookie = cookieString;
  }

  const options = {
    method: "POST",
    url: `${serverAddr}/api/user/${userId}/cart`,
    data: {
      productId: productId,
      quantity: quantity,
    },
    headers: headers,
    withCredentials: true,
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const editCartItem = async (
  { userId, productId, quantity }: EditCartItemRequest,
  cookieString?: string,
): Promise<CartSuccessResponse> => {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (cookieString) {
    headers.Cookie = cookieString;
  }

  const options = {
    method: "PUT",
    url: `${serverAddr}/api/user/${userId}/cart`,
    data: {
      productId: productId,
      quantity: quantity,
    },
    headers: headers,
    withCredentials: true,
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const deleteCartItems = async (
  { userId, productIds }: DeleteCartItemsRequest,
  cookieString?: string,
): Promise<CartSuccessResponse> => {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (cookieString) {
    headers.Cookie = cookieString;
  }

  const options = {
    method: "POST",
    url: `${serverAddr}/api/user/${userId}/cart`,
    data: {
      productIds: productIds,
    },
    headers: headers,
    withCredentials: true,
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (err) {
    throw err;
  }
};