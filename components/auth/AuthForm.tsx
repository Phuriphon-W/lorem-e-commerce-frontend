"use client";

import { AuthRequest, AuthResponse } from "@/shared/types/auth";
import { Button, Card, Form, Input, message } from "antd";
import { useRouter } from "next/navigation";
import "./authForm.scss"

type AuthFormProps = {
  formName: "Sign In" | "Register";
  apiAction: (values: AuthRequest) => Promise<AuthResponse>
};

export default function AuthForm({ formName, apiAction }: AuthFormProps) {
  const router = useRouter()

  const handleOnFinish = async (values: AuthRequest) => {
    try {
      await apiAction(values)
      message.success({content: "Logged In", duration: 2});
      router.push("/")
    } catch (err) {
      message.error({content: "Invalid E-mail or Password. Please try again", duration: 2})
    }
  }

  return (
    <Card
      title={formName}
      style={{ width: "100%", maxWidth: 500, margin: "0 10px" }}
    >
      <Form name={formName} layout="vertical" onFinish={handleOnFinish}>
        <Form.Item
          label="E-mail Address"
          name="email"
          rules={[{ required: true, message: "Please enter your email" }]}
        >
          <Input placeholder="Enter your e-mail" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input placeholder="Enter your password" />
        </Form.Item>
        <div className="flex justify-end">
          <Button htmlType="submit">{formName}</Button>
        </div>
      </Form>
    </Card>
  );
}
