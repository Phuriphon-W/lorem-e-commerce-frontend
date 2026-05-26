"use client";

import { Button, Form, Input, message, Typography, Skeleton } from "antd";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { downloadStaticFile } from "@/apis/file";
import { resetPassword } from "@/apis/auth";
import axios from "axios";

let cachedImageUrl: string | undefined = undefined;

function ResetPasswordFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [imageUrl, setImageUrl] = useState<string | undefined>(cachedImageUrl);
  const [imageLoading, setImageLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!token) {
      message.error("Invalid or missing reset token.");
      router.push("/signin");
    }
  }, [token, router]);

  useEffect(() => {
    if (cachedImageUrl) {
      setImageLoading(false);
      return;
    }

    const fetchBannerImage = async () => {
      try {
        setImageLoading(true);
        const response = await downloadStaticFile({
          key: "static/auth-banner.jpg",
        });
        cachedImageUrl = response.downloadUrl;
        setImageUrl(response.downloadUrl);
      } catch (err) {
        console.error("Failed to fetch auth image:", err);
      } finally {
        setImageLoading(false);
      }
    };

    fetchBannerImage();
  }, []);

  const handleOnFinish = async (values: any) => {
    if (!token) return;
    try {
      const res = await resetPassword(token, values.password);
      message.success({ content: "Password has been changed successfully", duration: 3 });
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
  };

  if (!token) return null;

  return (
    <div className="flex flex-col md:flex-row bg-white rounded-md w-full md:w-[65%] h-144.5">
      {/* Image */}
      <div className="relative flex items-center justify-center w-full md:w-[45%] h-64 md:h-auto">
        {!imageLoading && (
          <Image
            fill
            alt="Auth-Form-Image"
            src={imageUrl ?? ""}
            style={{
              borderTopLeftRadius: "6px",
              borderBottomLeftRadius: "6px",
              objectFit: "cover"
            }}
            priority
          />
        )}
        {imageLoading && <Skeleton.Image active={imageLoading} />}
      </div>

      {/* Form */}
      <div className="rounded-r-md p-4 w-full md:w-[55%] flex flex-col justify-center grow">
        <Typography.Title level={3} className="text-center mb-6">
          Reset Password
        </Typography.Title>
        <Form
          name="Reset Password"
          layout="vertical"
          onFinish={handleOnFinish}
          validateMessages={validateMessages}
        >
          <Form.Item
            label="New Password"
            name="password"
            rules={[
              { required: true },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
            className="ant-form-item-signup"
          >
            <Input.Password placeholder="Enter new password" />
          </Form.Item>

          <Form.Item
            label="Confirm New Password"
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
            <Input.Password placeholder="Confirm new password" />
          </Form.Item>

          {/* Button */}
          <div className="flex justify-end mt-4">
            <Button htmlType="submit" style={{ width: "100%" }}>
              Reset Password
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default function ResetPasswordForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordFormContent />
    </Suspense>
  );
}