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

    // Use ws:// for localhost, wss:// for https
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = serverAddr?.replace(/^https?:\/\//, "") || "localhost:5000";
    const ws = new WebSocket(`${protocol}//${host}/ws?userId=${userId}`);

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
