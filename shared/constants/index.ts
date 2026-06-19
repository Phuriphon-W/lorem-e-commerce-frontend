const isServer = typeof window === "undefined";
export const baseServerAddr = isServer
  ? (process.env.BACKEND_INTERNAL_ADDRESS || process.env.NEXT_PUBLIC_BACKEND_SERVER_ADDRESS || "http://localhost:5000")
  : (process.env.NEXT_PUBLIC_BACKEND_SERVER_ADDRESS || "http://localhost:5000");

export const serverAddr = `${baseServerAddr}/api/v1`;

export const PAGE_SIZE = 9;