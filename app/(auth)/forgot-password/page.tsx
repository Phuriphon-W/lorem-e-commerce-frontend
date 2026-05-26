'use client'

import { Typography } from "antd";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col justify-center items-center w-full gap-y-2">
      <Typography.Title>Lorem</Typography.Title>
      <ForgotPasswordForm />
    </div>
  );
}