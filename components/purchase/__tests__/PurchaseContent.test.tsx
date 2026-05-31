import { vi, describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import PurchaseContent from "../PurchaseContent";
import * as paymentApi from "@/apis/payment";
import * as orderApi from "@/apis/order";
import { message } from "antd";

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
  usePathname: () => "/purchase",
}));

// Mock Auth Context
vi.mock("@/shared/hooks/useAuthContext", () => ({
  useAuthContext: () => ({ userId: "user-123" }),
}));

// Mock APIs
vi.mock("@/apis/payment", () => ({
  getUserPayments: vi.fn(),
}));
vi.mock("@/apis/order", () => ({
  getOrderById: vi.fn(),
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

const mockedGetUserPayments = vi.mocked(paymentApi.getUserPayments);
const mockedGetOrderById = vi.mocked(orderApi.getOrderById);

// Spy on antd message
vi.spyOn(message, "error");

describe("PurchaseContent", () => {
  const mockPaymentsResponse = {
    payments: [
      {
        id: "first-payment-uuid",
        userId: "user-123",
        orderId: "first-order-uuid",
        amount: 120.5,
        method: "stripe",
        status: "paid",
        createdAt: "2026-05-30T10:00:00Z",
      },
      {
        id: "second-payment-uuid",
        userId: "user-123",
        orderId: "second-order-uuid",
        amount: 80.0,
        method: "promptpay",
        status: "paid",
        createdAt: "2026-05-29T10:00:00Z",
      },
    ],
    total: 12,
  };

  const mockOrderResponse = {
    id: "first-order-uuid",
    totalPrice: 120.5,
    orderStatus: "paid" as any,
    createdAt: "2026-05-30T10:00:00Z",
    orderItems: [
      {
        id: "item-1",
        priceAtPurchase: 120.5,
        quantity: 1,
        product: {
          id: "prod-1",
          name: "Invoice Product 1",
          description: "Invoice Description 1",
          image_url: "http://example.com/inv.jpg",
        },
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
    mockedGetUserPayments.mockResolvedValue(mockPaymentsResponse);
    mockedGetOrderById.mockResolvedValue(mockOrderResponse);
  });

  it("renders loading state initially", async () => {
    mockedGetUserPayments.mockReturnValue(new Promise(() => {}));
    const { container } = render(<PurchaseContent />);
    expect(container.querySelector(".ant-spin")).toBeInTheDocument();
  });

  it("renders empty state when there are no purchases", async () => {
    mockedGetUserPayments.mockResolvedValue({ payments: [], total: 0 });
    render(<PurchaseContent />);

    await waitFor(() => {
      expect(screen.getByText("Purchase is empty")).toBeInTheDocument();
    });
  });

  it("renders list of purchases correctly", async () => {
    render(<PurchaseContent />);

    await waitFor(() => {
      expect(mockedGetUserPayments).toHaveBeenCalled();
    });

    expect(screen.getByText("#FIRST")).toBeInTheDocument();
    expect(screen.getByText("#SECOND")).toBeInTheDocument();

    expect(screen.getByText("FIRST")).toBeInTheDocument();
    expect(screen.getByText("SECOND")).toBeInTheDocument();

    expect(screen.getByText("$120.50")).toBeInTheDocument();
    expect(screen.getByText("$80.00")).toBeInTheDocument();
  });

  it("updates URL when clicking ordering tags", async () => {
    const user = userEvent.setup();
    render(<PurchaseContent />);

    await waitFor(() => {
      expect(screen.getByText("#FIRST")).toBeInTheDocument();
    });

    const oldestFirstTag = screen.getByText("Oldest First");
    await user.click(oldestFirstTag);

    expect(mockPush).toHaveBeenCalledWith("/purchase?orderBy=date_asc");
  });

  it("navigates page on pagination change", async () => {
    mockSearchParams = new URLSearchParams("page=1");
    const user = userEvent.setup();
    render(<PurchaseContent />);

    await waitFor(() => {
      expect(screen.getByText("#FIRST")).toBeInTheDocument();
    });

    const page2Button = screen.getByTitle("2");
    await user.click(page2Button);

    expect(mockPush).toHaveBeenCalledWith("/purchase?page=2");
  });

  it("opens invoice modal on click, fetches order details, renders them, and can be closed", async () => {
    const user = userEvent.setup();
    render(<PurchaseContent />);

    await waitFor(() => {
      expect(screen.getByText("#FIRST")).toBeInTheDocument();
    });

    const firstCard = screen.getByText("#FIRST");
    await user.click(firstCard);

    await waitFor(() => {
      expect(screen.getByText("Tax Invoice / Receipt")).toBeInTheDocument();
      expect(mockedGetOrderById).toHaveBeenCalledWith("first-order-uuid");
    });

    expect(screen.getByText("INV-FIRST")).toBeInTheDocument();
    expect(screen.getAllByText("stripe")[0]).toBeInTheDocument();

    expect(screen.getByText("Invoice Product 1")).toBeInTheDocument();
    expect(screen.getByText("Invoice Description 1")).toBeInTheDocument();

    const closeBtn = screen.getByRole("button", { name: "Close" });
    await user.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByText("Invoice Product 1")).not.toBeInTheDocument();
    });
  });
});
