"use client";

import { useState, useEffect, useRef } from "react";
import { MessageType } from "../types/message";

// Define the shape of the messages coming from backend
export interface AppWebSocketMessage {
  type: MessageType;
  status?: string;
  orderId?: string;
  [key: string]: any; 
}

export default function useAppWebSocket(url: string) {
  const [lastMessage, setLastMessage] = useState<AppWebSocketMessage | null>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Initialize the WebSocket connection
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log("Connected to WebSocket");
    };

    ws.current.onmessage = (event) => {
      try {
        const data: AppWebSocketMessage = JSON.parse(event.data);
        setLastMessage(data);
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    ws.current.onclose = () => {
      console.log("Disconnected from WebSocket");
    };

    // Cleanup function: Close the socket when the component unmounts
    return () => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    };
  }, [url]);

  return { lastMessage };
}