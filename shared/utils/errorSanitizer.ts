import { AxiosError } from "axios";

interface ErrorMapping {
  keywords: string[];
  message: string;
}

const ERROR_MAPPINGS: ErrorMapping[] = [
  {
    keywords: ["invalid credentials", "unauthorized", "invalid username or password"],
    message: "Invalid username or password. Please try again.",
  },
  {
    keywords: ["email already exists", "email already in use"],
    message: "This email address is already registered.",
  },
  {
    keywords: ["username already exists", "username already taken"],
    message: "This username is already taken.",
  },
  {
    keywords: ["token has expired", "token is expired"],
    message: "Your session has expired. Please sign in again.",
  },
  {
    keywords: ["password is too short", "password must be"],
    message: "Password does not meet the complexity requirements.",
  },
  {
    keywords: ["user not found", "no user found"],
    message: "User account not found.",
  },
  {
    keywords: ["order not found"],
    message: "Order not found.",
  },
  {
    keywords: ["product not found"],
    message: "Product not found.",
  },
  {
    keywords: ["cart not found"],
    message: "Cart not found.",
  },
  {
    keywords: ["category not found"],
    message: "Category not found.",
  },
  {
    keywords: ["not found"],
    message: "Requested resource not found.",
  },
  {
    keywords: ["insufficient stock", "out of stock", "not enough stock"],
    message: "Insufficient stock available",
  },
];

const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";

function getRawErrorMessage(error: unknown): string {
  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object") {
    const axiosErr = error as AxiosError<{ detail?: string; message?: string }>;
    const apiMessage = axiosErr.response?.data?.detail || axiosErr.response?.data?.message;
    if (apiMessage) {
      return apiMessage;
    }

    if (error instanceof Error) {
      return error.message;
    }
  }

  return "";
}

export function sanitizeErrorMessage(error: unknown): string {
  if (process.env.NODE_ENV === "development") {
    console.error("Original error caught by sanitizer:", error);
  }

  const rawMessage = getRawErrorMessage(error);
  if (!rawMessage) {
    return DEFAULT_ERROR_MESSAGE;
  }

  const normalized = rawMessage.toLowerCase();

  const match = ERROR_MAPPINGS.find((mapping) =>
    mapping.keywords.some((keyword) => normalized.includes(keyword))
  );

  return match ? match.message : DEFAULT_ERROR_MESSAGE;
}
