import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, act, waitFor } from "@testing-library/react";
import React from "react";
import { WebSocketProvider, useWebSocketContext } from "../useWebSocketContext";
import { message } from "antd";

vi.spyOn(message, "error");

// Mocking WebSocket
class MockWebSocket {
  onmessage: ((event: any) => void) | null = null;
  url: string;
  constructor(url: string) {
    this.url = url;
    MockWebSocket.instances.push(this);
  }
  close() {}
  static instances: MockWebSocket[] = [];
  static triggerMessage(data: any) {
    MockWebSocket.instances.forEach((ws) => {
      if (ws.onmessage) {
        ws.onmessage({ data: JSON.stringify(data) });
      }
    });
  }
}

global.WebSocket = MockWebSocket as any;

const TestComponent = () => {
  const { expiredOrderIds } = useWebSocketContext();
  return (
    <div data-testid="expired-orders">
      {expiredOrderIds.join(",")}
    </div>
  );
};

describe("useWebSocketContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    MockWebSocket.instances = [];
  });

  afterEach(() => {
    MockWebSocket.instances = [];
  });

  it("should connect to WebSocket and handle ORDER_EXPIRED message", async () => {
    const { getByTestId } = render(
      <WebSocketProvider userId="user123">
        <TestComponent />
      </WebSocketProvider>
    );

    // Initial state
    expect(getByTestId("expired-orders").textContent).toBe("");

    // Simulate receiving an ORDER_EXPIRED message
    act(() => {
      MockWebSocket.triggerMessage({
        type: "ORDER_EXPIRED",
        payload: { order_id: "order-1" },
      });
    });

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith(
        "Order with ID order-1 has expired. Please create a new order to proceed."
      );
      expect(getByTestId("expired-orders").textContent).toBe("order-1");
    });
    
    // Test a second order expiring
    act(() => {
      MockWebSocket.triggerMessage({
        type: "ORDER_EXPIRED",
        payload: { order_id: "order-2" },
      });
    });

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith(
        "Order with ID order-2 has expired. Please create a new order to proceed."
      );
      expect(getByTestId("expired-orders").textContent).toBe("order-1,order-2");
    });
  });

  it("should not crash on invalid JSON payload", () => {
    render(
      <WebSocketProvider userId="user123">
        <TestComponent />
      </WebSocketProvider>
    );

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    
    act(() => {
      MockWebSocket.instances.forEach((ws) => {
        if (ws.onmessage) {
          ws.onmessage({ data: "invalid-json" });
        }
      });
    });

    expect(consoleSpy).toHaveBeenCalled();
    expect(message.error).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
