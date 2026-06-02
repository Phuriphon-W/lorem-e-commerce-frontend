import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import SuccessPage from "../page";
import * as paymentApi from "@/apis/payment";
import { message } from "antd";

const mockPush = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => mockSearchParams,
}));

vi.mock("@/apis/payment", () => ({
  verifySession: vi.fn(),
}));

vi.spyOn(message, "error");

const mockedVerifySession = vi.mocked(paymentApi.verifySession);

describe("Success Payment Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("redirects to /order with error if no session_id", async () => {
    mockSearchParams = new URLSearchParams();
    render(<SuccessPage />);
    
    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith("Invalid session.");
      expect(mockPush).toHaveBeenCalledWith("/order");
    });
  });

  it("redirects to /order with error if session is invalid", async () => {
    mockSearchParams = new URLSearchParams("session_id=invalid_sess");
    mockedVerifySession.mockResolvedValue({ valid: false });
    
    render(<SuccessPage />);
    
    await waitFor(() => {
      expect(mockedVerifySession).toHaveBeenCalledWith("invalid_sess");
      expect(message.error).toHaveBeenCalledWith("Payment not verified.");
      expect(mockPush).toHaveBeenCalledWith("/order");
    });
  });

  it("shows countdown and redirects to /purchase when countdown reaches 0", async () => {
    vi.useFakeTimers();
    mockSearchParams = new URLSearchParams("session_id=valid_sess");
    mockedVerifySession.mockResolvedValue({ valid: true });
    
    render(<SuccessPage />);
    
    // Flush promises
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(screen.getByText("Payment Successful!")).toBeInTheDocument();
    expect(screen.getByText(/You will be redirected in 5 seconds/)).toBeInTheDocument();

    // Advance timers by 5 seconds
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(mockPush).toHaveBeenCalledWith("/purchase");
  });

  it("redirects immediately without waiting for countdown when button is clicked", async () => {
    mockSearchParams = new URLSearchParams("session_id=valid_sess");
    mockedVerifySession.mockResolvedValue({ valid: true });
    
    const user = userEvent.setup();
    render(<SuccessPage />);
    
    await waitFor(() => {
      expect(screen.getByText("Payment Successful!")).toBeInTheDocument();
    });

    const button = screen.getByRole("button", { name: "Go to Purchases" });
    await user.click(button);

    expect(mockPush).toHaveBeenCalledWith("/purchase");
  });
});
