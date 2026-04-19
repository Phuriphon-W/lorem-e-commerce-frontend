export interface OrderCheckoutRequest {
  orderId: string;
  userId: string;
}

export interface OrderCheckoutResponse {
  checkoutUrl: string;
}

export interface PaymentDto {
  id: string;
  orderId: string;
  method: string;
  amount: number;
  status: string;
  createdAt: string;
}

export interface GetPaymentsByUserIdResponse {
  payments: PaymentDto[];
  total: number;
}


export type VerifySessionResponse = {
  valid: boolean;
}