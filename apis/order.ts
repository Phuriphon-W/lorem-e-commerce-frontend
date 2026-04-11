import { serverAddr } from "@/shared/constants";
import axios from "axios";
import {
  CreateOrderRequest,
  CreateOrderResponse,
  GetUserOrdersRequest,
  GetOrdersResponse,
  GetOrderByIdResponse,
  UpdateOrderStatusRequest,
  UpdateOrderStatusResponse,
} from "@/shared/types/order";

export const createOrder = async (
  data: CreateOrderRequest,
  cookieString?: string,
): Promise<CreateOrderResponse> => {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (cookieString) {
    headers.Cookie = cookieString;
  }

  const options = {
    method: "POST",
    url: `${serverAddr}/api/order`,
    data: data,
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

export const getUserOrders = async (
  { userId, pageNumber = 1, pageSize = 20 }: GetUserOrdersRequest,
  cookieString?: string,
): Promise<GetOrdersResponse> => {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (cookieString) {
    headers.Cookie = cookieString;
  }

  const options = {
    method: "GET",
    url: `${serverAddr}/api/user/${userId}/orders`,
    params: {
      pageNumber,
      pageSize,
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

export const getOrderById = async (
  orderId: string,
  cookieString?: string,
): Promise<GetOrderByIdResponse> => {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (cookieString) {
    headers.Cookie = cookieString;
  }

  const options = {
    method: "GET",
    url: `${serverAddr}/api/order/${orderId}`,
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

export const updateOrderStatus = async (
  { orderId, status }: UpdateOrderStatusRequest,
  cookieString?: string,
): Promise<UpdateOrderStatusResponse> => {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (cookieString) {
    headers.Cookie = cookieString;
  }

  const options = {
    method: "PATCH",
    url: `${serverAddr}/api/order/${orderId}/status`,
    data: {
      status: status,
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