import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import FailurePage from "../page";
import * as paymentApi from "@/apis/payment";

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

const mockedVerifySession = vi.mocked(paymentApi.verifySession);

describe("Failure Payment Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("redirects to /order if no session_id", async () => {
    mockSearchParams = new URLSearchParams();
    render(<FailurePage />);
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/order");
    });
  });

  it("redirects to success page if session is actually valid", async () => {
    mockSearchParams = new URLSearchParams("session_id=valid_sess");
    mockedVerifySession.mockResolvedValue({ valid: true });
    
    render(<FailurePage />);
    
    await waitFor(() => {
      expect(mockedVerifySession).toHaveBeenCalledWith("valid_sess");
      expect(mockPush).toHaveBeenCalledWith("/payment/success?session_id=valid_sess");
    });
  });

  it("shows countdown and redirects to /order when countdown reaches 0 for invalid session", async () => {
    vi.useFakeTimers();
    mockSearchParams = new URLSearchParams("session_id=invalid_sess");
    mockedVerifySession.mockResolvedValue({ valid: false });
    
    render(<FailurePage />);
    
    // Flush promises
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(screen.getByText("Payment Failed or Cancelled")).toBeInTheDocument();
    expect(screen.getByText(/You will be redirected back to your orders in 5 seconds/)).toBeInTheDocument();

    // Advance timers by 5 seconds
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(mockPush).toHaveBeenCalledWith("/order");
  });

  it("redirects immediately without waiting for countdown when button is clicked", async () => {
    mockSearchParams = new URLSearchParams("session_id=invalid_sess");
    mockedVerifySession.mockResolvedValue({ valid: false });
    
    const user = userEvent.setup();
    render(<FailurePage />);
    
    await waitFor(() => {
      expect(screen.getByText("Payment Failed or Cancelled")).toBeInTheDocument();
    });

    const button = screen.getByRole("button", { name: "Return to Orders" });
    await user.click(button);

    expect(mockPush).toHaveBeenCalledWith("/order");
  });
});
