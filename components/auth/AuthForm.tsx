"use client";

import { AuthRequest, AuthResponse } from "@/shared/types/auth";
import {
  Button,
  Form,
  Input,
  message,
  Typography,
} from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";

type AuthFormProps = {
  formName: "Sign In" | "Sign Up";
  apiAction: (values: AuthRequest) => Promise<AuthResponse>;
};

export default function AuthForm({ formName, apiAction }: AuthFormProps) {
  const router = useRouter();

  const handleOnFinish = async (values: AuthRequest & { confirmPassword?: string }) => {
    try {
      const { confirmPassword, ...submitValues } = values;
      await apiAction(submitValues);
      message.success({ content: `${formName} Successfully`, duration: 2 });
      router.push("/", { scroll: true });
      router.refresh();
    } catch (err) {
      let errorMessage = "Something Went Wrong";

      if (axios.isAxiosError(err) && err.response) {
        errorMessage = err.response.data.detail;
      }

      message.error({
        content: errorMessage,
        duration: 2,
      });
    }
  };

  const validateMessages = {
    required: "${label} is required",
    types: {
      email: "Invalid Email",
    },
  };

  return (
    <div className="flex flex-col md:flex-row bg-white rounded-md w-full md:w-[65%] h-144.5">
      {/* Image */}
      <div className="relative flex items-center justify-center w-full md:w-[45%]">
          <Image
            fill
            alt="Auth-Form-Image"
            src={"/static/auth-banner.jpg"}
            style={{
              borderTopLeftRadius: "6px",
              borderBottomLeftRadius: "6px",
            }}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
      </div>

      {/* Form */}
      <div className="rounded-r-md p-4 w-full md:w-[55%] flex flex-col justify-center grow">
        <Typography.Title level={3} className="text-center">
          {formName}
        </Typography.Title>
        <Form
          name={formName}
          layout="vertical"
          onFinish={handleOnFinish}
          validateMessages={validateMessages}
        >
          {formName === "Sign Up" && (
            <>
              <div className="flex gap-x-2">
                <Form.Item
                  className="w-1/2 ant-form-item-signup"
                  label="First Name"
                  name="firstName"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="First name" />
                </Form.Item>
                <Form.Item
                  className="w-1/2 ant-form-item-signup"
                  label="Last Name"
                  name="lastName"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Last name" />
                </Form.Item>
              </div>
              <Form.Item
                label="Username"
                name="username"
                rules={[
                  { required: true },
                  {
                    max: 20,
                    message: "Username cannot exceed 20 characters",
                  },
                ]}
                className="ant-form-item-signup"
              >
                <Input placeholder="Enter your username" />
              </Form.Item>
            </>
          )}

          <Form.Item
            label="E-mail Address"
            name="email"
            rules={[{ required: true, type: "email" }]}
            className="ant-form-item-signup"
          >
            <Input placeholder="Enter your e-mail" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
            className={`${formName === "Sign Up" ? "ant-form-item-signup" : ""}`}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          {formName === "Sign Up" && (
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("The passwords that you entered do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm your password" />
            </Form.Item>
          )}

          {/* Button */}
          <div className="flex justify-end">
            <Button htmlType="submit" style={{ width: "100%" }}>
              {formName}
            </Button>
          </div>

          <div className="text-center mt-3">
            {formName === "Sign Up" ? (
              <Typography.Link onClick={() => router.push("/signin")}>
                I already have account
              </Typography.Link>
            ) : (
              <div className="flex justify-between">
                <Typography.Link onClick={() => router.push("/forgot-password")}>
                  Forgot password?
                </Typography.Link>
                <Typography.Link onClick={() => router.push("/signup")}>
                  Create new account
                </Typography.Link>
              </div>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
}
