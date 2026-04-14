import { OrderBy } from "../enums/orderBy";
import { Product } from "../interfaces/product";
import { OrderStatus } from "../enums/order";

// Base Types

export interface OrderItemResponse {
  id: string;
  productId: string;
  product: Product;
  priceAtPurchase: number;
  quantity: number;
}

export interface OrderResponse {
  id: string;
  userId: string;
  totalPrice: number;
  orderStatus: OrderStatus;
  orderItems: OrderItemResponse[];
  createdAt: string;
}

// Request & Response Types

// Create Order
export interface OrderItemRequest {
  productId: string;
  quantity: number;
}

export interface CreateOrderRequest {
  userId: string;
  items: OrderItemRequest[];
}

export interface CreateOrderResponse {
  id: string;
}

// Get User Orders
export interface GetUserOrdersRequest {
  userId: string;
  pageNumber?: number;
  pageSize?: number;
  status?: OrderStatus | "";
  orderBy?: OrderBy;
}

export interface GetOrdersResponse {
  orders: OrderResponse[];
  total: number;
}

// Get Order By ID
export type GetOrderByIdResponse = OrderResponse;

// Update Order Status
export interface UpdateOrderStatusRequest {
  orderId: string;
  status: OrderStatus;
}

export interface UpdateOrderStatusResponse {
  success: boolean;
}