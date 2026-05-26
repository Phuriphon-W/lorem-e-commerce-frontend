'use client'

import { Typography } from "antd";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="flex flex-col justify-center items-center w-full gap-y-2">
      <Typography.Title>Lorem</Typography.Title>
      <ResetPasswordForm />
    </div>
  );
}