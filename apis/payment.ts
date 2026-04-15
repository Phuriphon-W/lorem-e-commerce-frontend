import { serverAddr } from "@/shared/constants";
import {
  OrderCheckoutRequest,
  OrderCheckoutResponse,
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
