import { vi, describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import OrderContent from "../OrderContent";
import * as orderApi from "@/apis/order";
import * as paymentApi from "@/apis/payment";
import { message } from "antd";
import axios from "axios";

// Mock next/image to avoid issues
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    return React.createElement("img", {
      alt: props.alt as string,
      src: (props.src as string) || "",
    });
  },
}));

// Mock next/navigation
const mockPush = vi.fn();
let mockSearchParams = new URLSearchParams();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  useSearchParams: () => mockSearchParams,
  usePathname: () => "/order",
}));

// Mock Auth Context
vi.mock("@/shared/hooks/useAuthContext", () => ({
  useAuthContext: () => ({ userId: "user-123" }),
}));

// Mock WebSocket Context
let mockExpiredOrderIds: string[] = [];
vi.mock("@/shared/hooks/useWebSocketContext", () => ({
  useWebSocketContext: () => ({
    get expiredOrderIds() { return mockExpiredOrderIds; }
  }),
}));

// Mock APIs
vi.mock("@/apis/order", () => ({
  getUserOrders: vi.fn(),
  getOrderById: vi.fn(),
}));
vi.mock("@/apis/payment", () => ({
  checkoutOrder: vi.fn(),
}));

// Mock Antd Modal to avoid JSDOM transition/animation bugs
vi.mock("antd", async (importOriginal) => {
  const original = await importOriginal<typeof import("antd")>();
  return {
    ...original,
    Modal: ({ children, open, onCancel, title }: any) => {
      if (!open) return null;
      return (
        <div data-testid="mock-modal">
          <div>{title}</div>
          <button onClick={onCancel}>Close</button>
          <div>{children}</div>
        </div>
      );
    },
  };
});

const mockedGetUserOrders = vi.mocked(orderApi.getUserOrders);
const mockedCheckoutOrder = vi.mocked(paymentApi.checkoutOrder);

// Spy on antd message
vi.spyOn(message, "error");
vi.spyOn(message, "success");

describe("OrderContent", () => {
  const mockOrdersResponse: any = {
    orders: [
      {
        id: "first-order-uuid",
        totalPrice: 99.99,
        orderStatus: "pending" as any,
        createdAt: "2026-05-30T10:00:00Z",
        orderItems: [
          {
            id: "item-1",
            priceAtPurchase: 99.99,
            quantity: 1,
            product: {
              id: "prod-1",
              name: "Test Product 1",
              description: "Test Description 1",
              image_url: "http://example.com/1.jpg",
            },
          },
        ],
      },
      {
        id: "second-order-uuid",
        totalPrice: 150.0,
        orderStatus: "completed" as any,
        createdAt: "2026-05-29T10:00:00Z",
        orderItems: [
          {
            id: "item-2",
            priceAtPurchase: 75.0,
            quantity: 2,
            product: {
              id: "prod-2",
              name: "Test Product 2",
              description: "Test Description 2",
              image_url: "",
            },
          },
        ],
      },
    ],
    total: 15,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
    mockExpiredOrderIds = [];
    mockedGetUserOrders.mockResolvedValue(mockOrdersResponse);
  });

  it("renders loading state initially", async () => {
    mockedGetUserOrders.mockReturnValue(new Promise(() => {}));
    const { container } = render(<OrderContent />);
    expect(container.querySelector(".ant-spin")).toBeInTheDocument();
  });

  it("renders empty state when there are no orders", async () => {
    mockedGetUserOrders.mockResolvedValue({ orders: [], total: 0 });
    render(<OrderContent />);

    await waitFor(() => {
      expect(screen.getByText("Order is empty")).toBeInTheDocument();
    });
  });

  it("renders list of orders correctly", async () => {
    render(<OrderContent />);

    await waitFor(() => {
      expect(mockedGetUserOrders).toHaveBeenCalled();
    });

    expect(screen.getByText("$99.99")).toBeInTheDocument();
    expect(screen.getByText("$150.00")).toBeInTheDocument();

    expect(screen.getByText("Order ID: FIRST")).toBeInTheDocument();
    expect(screen.getByText("Order ID: SECOND")).toBeInTheDocument();

    expect(screen.getByText("pending")).toBeInTheDocument();
    expect(screen.getByText("completed")).toBeInTheDocument();
  });

  it("updates URL and resets page to 1 when clicking status filter tags", async () => {
    mockSearchParams = new URLSearchParams("page=2");
    const user = userEvent.setup();
    render(<OrderContent />);

    await waitFor(() => {
      expect(screen.getByText("$99.99")).toBeInTheDocument();
    });

    const paidFilterTag = screen.getAllByText("Paid").find((el) =>
      el.classList.contains("ant-tag")
    );
    expect(paidFilterTag).toBeDefined();
    await user.click(paidFilterTag!);

    expect(mockPush).toHaveBeenCalledWith("/order?page=1&status=paid");
  });

  it("updates URL when clicking orderBy sorting tags", async () => {
    const user = userEvent.setup();
    render(<OrderContent />);

    await waitFor(() => {
      expect(screen.getByText("$99.99")).toBeInTheDocument();
    });

    const oldestFirstTag = screen.getByText("Oldest First");
    await user.click(oldestFirstTag);

    expect(mockPush).toHaveBeenCalledWith("/order?orderBy=date_asc");
  });

  it("navigates page on pagination change", async () => {
    mockSearchParams = new URLSearchParams("page=1");
    const user = userEvent.setup();
    render(<OrderContent />);

    await waitFor(() => {
      expect(screen.getByText("$99.99")).toBeInTheDocument();
    });

    const page2Button = screen.getByTitle("2");
    await user.click(page2Button);

    expect(mockPush).toHaveBeenCalledWith("/order?page=2");
  });

  it("opens modal on order card click, renders modal items, and can be closed", async () => {
    const user = userEvent.setup();
    render(<OrderContent />);

    await waitFor(() => {
      expect(screen.getByText("$99.99")).toBeInTheDocument();
    });

    const card = screen.getByText("Order ID: FIRST");
    await user.click(card);

    expect(screen.getByText("Order Details")).toBeInTheDocument();
    expect(screen.getByText("Test Product 1")).toBeInTheDocument();
    expect(screen.getByText("Test Description 1")).toBeInTheDocument();
    expect(screen.getByText("Qty: 1")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /checkout/i })).toBeInTheDocument();

    const closeBtn = screen.getByRole("button", { name: "Close" });
    await user.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByText("Test Product 1")).not.toBeInTheDocument();
    });
  });

  it("navigates to checkout URL when checkout is successful", async () => {
    const user = userEvent.setup();
    mockedCheckoutOrder.mockResolvedValue({
      checkoutUrl: "http://checkout.stripe.com/test",
    });

    render(<OrderContent />);

    await waitFor(() => {
      expect(screen.getByText("$99.99")).toBeInTheDocument();
    });

    const card = screen.getByText("Order ID: FIRST");
    await user.click(card);

    const checkoutBtn = screen.getByRole("button", { name: /checkout/i });
    await user.click(checkoutBtn);

    await waitFor(() => {
      expect(mockedCheckoutOrder).toHaveBeenCalledWith({
        orderId: "first-order-uuid",
        userId: "user-123",
      });
      expect(mockPush).toHaveBeenCalledWith("http://checkout.stripe.com/test");
    });
  });

  it("displays message error on checkout failure", async () => {
    const user = userEvent.setup();
    const axiosError = {
      response: { data: { detail: "Insufficient funds" } },
      isAxiosError: true,
    };
    axios.isAxiosError = vi.fn().mockReturnValue(true) as any;
    mockedCheckoutOrder.mockRejectedValue(axiosError);

    render(<OrderContent />);

    await waitFor(() => {
      expect(screen.getByText("$99.99")).toBeInTheDocument();
    });

    const card = screen.getByText("Order ID: FIRST");
    await user.click(card);

    const checkoutBtn = screen.getByRole("button", { name: /checkout/i });
    await user.click(checkoutBtn);

    await waitFor(() => {
      expect(mockedCheckoutOrder).toHaveBeenCalled();
      expect(message.error).toHaveBeenCalledWith(
        expect.objectContaining({ content: "Insufficient funds" })
      );
    });
  });

  it("updates order status to failed when order expires via WebSocket", async () => {
    const { rerender } = render(<OrderContent />);

    await waitFor(() => {
      expect(screen.getByText("pending")).toBeInTheDocument();
    });

    // Simulate websocket context change
    mockExpiredOrderIds = ["first-order-uuid"];
    rerender(<OrderContent />);

    await waitFor(() => {
      // The pending order should change to failed
      expect(screen.getByText("failed")).toBeInTheDocument();
      // The original completed order remains completed
      expect(screen.getByText("completed")).toBeInTheDocument();
      expect(screen.queryByText("pending")).not.toBeInTheDocument();
    });
  });
});
