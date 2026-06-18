import { describe, it, expect } from "vitest";
import { sanitizeErrorMessage } from "../errorSanitizer";

describe

describe("sanitizeErrorMessage", () => {
  it("should return the custom message for unrecognized errors", () => {
    const error = new Error("Some database constraint violation");
    expect(sanitizeErrorMessage(error)).toBe("Something went wrong. Please try again.");
  });

  it("should map 'user not found' errors correctly", () => {
    const error = new Error("user not found");
    expect(sanitizeErrorMessage(error)).toBe("User account not found.");
  });

  it("should map 'order not found' errors correctly", () => {
    const error = {
      response: {
        data: {
          detail: "Order not found",
        },
      },
    };
    expect(sanitizeErrorMessage(error)).toBe("Order not found.");
  });

  it("should map 'product not found' errors correctly", () => {
    const error = {
      response: {
        data: {
          message: "Product not found",
        },
      },
    };
    expect(sanitizeErrorMessage(error)).toBe("Product not found.");
  });

  it("should map 'cart not found' errors correctly", () => {
    const error = "Cart not found";
    expect(sanitizeErrorMessage(error)).toBe("Cart not found.");
  });

  it("should map 'category not found' errors correctly", () => {
    const error = "Category not found";
    expect(sanitizeErrorMessage(error)).toBe("Category not found.");
  });

  it("should map general 'not found' errors to generic resource not found", () => {
    const error = "Some other item not found";
    expect(sanitizeErrorMessage(error)).toBe("Requested resource not found.");
  });

  it("should handle empty or falsy errors gracefully with the generic message", () => {
    expect(sanitizeErrorMessage(null)).toBe("Something went wrong. Please try again.");
    expect(sanitizeErrorMessage(undefined)).toBe("Something went wrong. Please try again.");
    expect(sanitizeErrorMessage("")).toBe("Something went wrong. Please try again.");
  });
});
