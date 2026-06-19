import { vi, describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import ProfileContent from "../ProfileContent";
import * as userApi from "@/apis/user";
import { message } from "antd";

// Mock APIs
vi.mock("@/apis/user", () => ({
  getProfile: vi.fn(),
  updateProfile: vi.fn(),
}));

const mockedGetProfile = vi.mocked(userApi.getProfile);
const mockedUpdateProfile = vi.mocked(userApi.updateProfile);

// Spy on antd message
vi.spyOn(message, "error");
vi.spyOn(message, "success");

describe("ProfileContent", () => {
  const mockUserProfile: any = {
    username: "testuser",
    email: "test@example.com",
    firstName: "John",
    lastName: "Doe",
    telephone: "0812345678",
    address: {
      houseNumber: "123", // Must be only numbers to pass 'type: tel' validation
      road: "Main Rd",
      district: "DistrictA",
      subDistrict: "SubDistrictB",
      province: "ProvinceC",
      zip: "12345",
    },
  };

  const mockNullUserProfile: any = {
    username: "nulluser",
    email: "null@example.com",
    firstName: "Jane",
    lastName: "Smith",
    telephone: null,
    address: {
      houseNumber: null,
      road: null,
      district: null,
      subDistrict: null,
      province: null,
      zip: null,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", async () => {
    mockedGetProfile.mockReturnValue(new Promise(() => {}));
    const { container } = render(<ProfileContent />);
    expect(container.querySelector(".ant-spin")).toBeInTheDocument();
  });

  it("initializes form fields with profile data", async () => {
    mockedGetProfile.mockResolvedValue(mockUserProfile);
    render(<ProfileContent />);

    await waitFor(() => {
      expect(mockedGetProfile).toHaveBeenCalled();
    });

    expect(screen.getByLabelText("Username")).toBeDisabled();
    expect(screen.getByLabelText("Username")).toHaveValue("testuser");
    expect(screen.getByLabelText("Email")).toBeDisabled();
    expect(screen.getByLabelText("Email")).toHaveValue("test@example.com");

    expect(screen.getByLabelText("First Name")).toHaveValue("John");
    expect(screen.getByLabelText("Last Name")).toHaveValue("Doe");
    expect(screen.getByLabelText("Telephone")).toHaveValue("0812345678");
    expect(screen.getByLabelText("House Number")).toHaveValue("123");
    expect(screen.getByLabelText("Road")).toHaveValue("Main Rd");
    expect(screen.getByLabelText("District")).toHaveValue("DistrictA");
    expect(screen.getByLabelText("Sub-District")).toHaveValue("SubDistrictB");
    expect(screen.getByLabelText("Province")).toHaveValue("ProvinceC");
    expect(screen.getByLabelText("Zip Code")).toHaveValue("12345");
  });

  it("handles null address and telephone fields by converting them to empty strings", async () => {
    mockedGetProfile.mockResolvedValue(mockNullUserProfile);
    render(<ProfileContent />);

    await waitFor(() => {
      expect(mockedGetProfile).toHaveBeenCalled();
    });

    expect(screen.getByLabelText("Telephone")).toHaveValue("");
    expect(screen.getByLabelText("House Number")).toHaveValue("");
    expect(screen.getByLabelText("Road")).toHaveValue("");
    expect(screen.getByLabelText("District")).toHaveValue("");
    expect(screen.getByLabelText("Sub-District")).toHaveValue("");
    expect(screen.getByLabelText("Province")).toHaveValue("");
    expect(screen.getByLabelText("Zip Code")).toHaveValue("");
  });

  it("submits updated profile payload successfully and shows success message", async () => {
    const user = userEvent.setup();
    mockedGetProfile.mockResolvedValue(mockUserProfile);
    mockedUpdateProfile.mockResolvedValue({ message: "Success" } as any);

    render(<ProfileContent />);

    await waitFor(() => {
      expect(screen.getByLabelText("First Name")).toHaveValue("John");
    });

    // Clear and change First Name
    const firstNameInput = screen.getByLabelText("First Name");
    await user.clear(firstNameInput);
    await user.type(firstNameInput, "Johnny");

    // Submit form
    const saveBtn = screen.getByRole("button", { name: /save changes/i });
    await user.click(saveBtn);

    await waitFor(() => {
      expect(mockedUpdateProfile).toHaveBeenCalledWith({
        firstName: "Johnny",
        lastName: "Doe",
        telephone: "0812345678",
        address: {
          houseNumber: "123",
          road: "Main Rd",
          district: "DistrictA",
          subDistrict: "SubDistrictB",
          province: "ProvinceC",
          zip: "12345",
        },
      });
      expect(message.success).toHaveBeenCalledWith("Profile updated successfully!");
    });
  });

  it("handles submission errors and displays error message", async () => {
    const user = userEvent.setup();
    mockedGetProfile.mockResolvedValue(mockUserProfile);
    mockedUpdateProfile.mockRejectedValue(new Error("Update failed"));

    render(<ProfileContent />);

    await waitFor(() => {
      expect(screen.getByLabelText("First Name")).toHaveValue("John");
    });

    // Submit form
    const saveBtn = screen.getByRole("button", { name: /save changes/i });
    await user.click(saveBtn);

    await waitFor(() => {
      expect(mockedUpdateProfile).toHaveBeenCalled();
      expect(message.error).toHaveBeenCalledWith("Something went wrong. Please try again.");
    });
  });
});
