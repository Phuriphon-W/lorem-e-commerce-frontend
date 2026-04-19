import { PAGE_SIZE, serverAddr } from "@/shared/constants";
import {
  OrderCheckoutRequest,
  OrderCheckoutResponse,
  GetPaymentsByUserIdResponse,
  VerifySessionResponse,
} from "@/shared/types/payment";
import axios from "axios";

export const checkoutOrder = async ({
  orderId,
  userId,
}: OrderCheckoutRequest): Promise<OrderCheckoutResponse> => {
  const options = {
    method: "POST",
    url: `${serverAddr}/api/payment/checkout`,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, application/problem+json",
    },
    data: {
      orderId,
      userId,
    },
    withCredentials: true,
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const getUserPayments = async (
  userId: string,
  pageNumber: number = 1,
  pageSize: number = PAGE_SIZE,
  status: string = "paid",
  orderBy: string = "date_dsc",
): Promise<GetPaymentsByUserIdResponse> => {
  const options = {
    method: "GET",
    url: `${serverAddr}/api/payment/${userId}`,
    params: {
      pageNumber,
      pageSize,
      status,
      orderBy,
    },
    withCredentials: true,
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const verifyPaymentSession = async (session_id: string): Promise<VerifySessionResponse> => {
  const options = {
    method: "GET",
    url: `${serverAddr}/api/payment`,
    params: {
      sessionId: session_id
    },
    headers: {
      Accept: 'application/json',
    },
    withCredentials: true,
  }

  try {
    const response = await axios.request(options);
    return { valid: response.data.valid };
  } catch (err) {
    throw err;
  }
}