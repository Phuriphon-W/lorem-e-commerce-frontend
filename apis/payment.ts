import { PAGE_SIZE, serverAddr } from "@/shared/constants";
import {
  OrderCheckoutRequest,
  OrderCheckoutResponse,
  GetPaymentsByUserIdResponse,
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
