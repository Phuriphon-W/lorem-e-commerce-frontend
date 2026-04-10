"use client";

import { AuthRequest, AuthResponse } from "@/shared/types/auth";
import {
  Button,
  Image,
  Form,
  Input,
  message,
  Typography,
  Skeleton,
} from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { downloadStaticFile } from "@/apis/file";

type AuthFormProps = {
  formName: "Sign In" | "Sign Up";
  apiAction: (values: AuthRequest) => Promise<AuthResponse>;
};

let cachedImageUrl: string | undefined = undefined;

export default function AuthForm({ formName, apiAction }: AuthFormProps) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | undefined>(cachedImageUrl);
  const [imageLoading, setImageLoading] = useState<boolean>(true);

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

  const handleOnFinish = async (values: AuthRequest) => {
    try {
      await apiAction(values);
      message.success({ content: `${formName} Successfully`, duration: 2 });
      router.push("/", { scroll: true });
    } catch (err) {
      message.error({
        content: (err as any)?.detail
          ? (err as any)?.detail
          : "Something Went Wrong",
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
    <div className="flex bg-white rounded-md md:w-[65%] w-full h-144.5">
      {/* Image */}
      <div className="flex items-center justify-center w-1/2 h-full">
        {!imageLoading && (
          <Image
            height="100%"
            width="100%"
            alt="Auth-Form-Image"
            src={imageUrl}
            style={{
              borderTopLeftRadius: "6px",
              borderBottomLeftRadius: "6px",
            }}
            preview={false}
          />
        )}
        {imageLoading && <Skeleton.Image active={imageLoading} />}
      </div>

      {/* Form */}
      <div className="rounded-r-md p-4 w-1/2 flex flex-col justify-center">
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
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[{ required: true }]}
              >
                <Input placeholder="Enter your first name" />
              </Form.Item>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[{ required: true }]}
              >
                <Input placeholder="Enter your last name" />
              </Form.Item>
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
              >
                <Input placeholder="Enter your username" />
              </Form.Item>
            </>
          )}

          <Form.Item
            label="E-mail Address"
            name="email"
            rules={[{ required: true, type: "email" }]}
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
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

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
                <Typography.Link>Forgot password?</Typography.Link>
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
