"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { message } from "antd";

import { serverAddr } from "@/shared/constants";

interface WebSocketContextType {
  expiredOrderIds: string[];
}

const WebSocketContext = createContext<WebSocketContextType>({
  expiredOrderIds: [],
});

export const useWebSocketContext = () => useContext(WebSocketContext);

export const WebSocketProvider = ({
  userId,
  children,
}: {
  userId: string;
  children: React.ReactNode;
}) => {
  const [expiredOrderIds, setExpiredOrderIds] = useState<string[]>([]);

  useEffect(() => {
    if (!userId) return;

    // Helper to get cookie value by name on the client side
    const getCookie = (name: string): string | null => {
      if (typeof document === "undefined") return null;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
      return null;
    };

    // Use ws:// for localhost, wss:// for https
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = serverAddr?.replace(/^https?:\/\//, "") || "localhost:5000";
    
    // Read the auth cookie value from the browser.
    // SECURITY NOTE: If the authToken cookie is httpOnly, JavaScript cannot access it here.
    // In that case, we rely on the browser automatically transmitting the cookie in the HTTP Upgrade 
    // request headers (handshake), which is standard and secure.
    const token = getCookie("authToken");
    const wsUrl = token
      ? `${protocol}//${host}/ws?token=${encodeURIComponent(token)}`
      : `${protocol}//${host}/ws`;

    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "ORDER_EXPIRED" && data.payload?.order_id) {
          const orderId = data.payload.order_id;
          message.error(`Order with ID ${orderId} has expired. Please create a new order to proceed.`);
          setExpiredOrderIds((prev) => [...prev, orderId]);
        }
      } catch (err) {
        console.error("Failed to parse websocket message", err);
      }
    };

    ws.onclose = (event) => {
      // 1008 is Policy Violation (frequently used for Authentication errors).
      // Custom application codes like 4001 or standard 3000+ codes can also represent auth failures.
      if (
        event.code === 1008 ||
        event.reason.toLowerCase().includes("auth") ||
        event.reason.toLowerCase().includes("unauthorized") ||
        event.code === 4001
      ) {
        console.warn("WebSocket closed due to authentication error. Reconnection will not be attempted.");
      }
    };

    return () => {
      ws.close();
    };
  }, [userId]);

  return (
    <WebSocketContext.Provider value={{ expiredOrderIds }}>
      {children}
    </WebSocketContext.Provider>
  );
};
