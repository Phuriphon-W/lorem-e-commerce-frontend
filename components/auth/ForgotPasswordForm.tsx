"use client";

import { Button, Form, Input, message, Typography } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/apis/auth";
import axios from "axios";

export default function ForgotPasswordForm() {
  const router = useRouter();

  const handleOnFinish = async (values: { email: string }) => {
    try {
      const res = await forgotPassword(values.email);
      message.success({ content: res.message || "Password reset link sent", duration: 5 });
      router.push("/signin");
    } catch (err) {
      let errorMessage = "Something Went Wrong";

      if (axios.isAxiosError(err) && err.response) {
        errorMessage = err.response.data.detail || err.response.data.message;
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
            src="/static/auth-banner.jpg"
            style={{
              borderTopLeftRadius: "6px",
              borderBottomLeftRadius: "6px",
            }}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )
      </div>

      {/* Form */}
      <div className="rounded-r-md p-4 w-full md:w-[55%] flex flex-col justify-center grow">
        <Typography.Title level={3} className="text-center mb-2">
          Reset Your Password
        </Typography.Title>
        <Typography.Paragraph className="text-center mb-6">
          Enter your email address to receive a password reset link.
        </Typography.Paragraph>
        <Form
          name="Forgot Password"
          layout="vertical"
          onFinish={handleOnFinish}
          validateMessages={validateMessages}
        >
          <Form.Item
            label="E-mail Address"
            name="email"
            rules={[{ required: true, type: "email" }]}
            className="ant-form-item-signup"
          >
            <Input placeholder="Enter your e-mail" />
          </Form.Item>

          {/* Button */}
          <div className="flex justify-end mt-4">
            <Button htmlType="submit" style={{ width: "100%" }}>
              Send Reset Link
            </Button>
          </div>

          <div className="text-center mt-4">
            <Typography.Link onClick={() => router.push("/signin")}>
              Back to Sign In
            </Typography.Link>
          </div>
        </Form>
      </div>
    </div>
  );
}