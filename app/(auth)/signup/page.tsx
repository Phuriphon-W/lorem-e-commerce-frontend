"use client";

import { signup } from "@/apis/auth";
import AuthForm from "@/components/auth/AuthForm";
import { Typography } from "antd";

export default function SignUpPage() {
  return (
    <div className="flex flex-col justify-center items-center w-full gap-y-2">
      <Typography.Title>Lorem</Typography.Title>
      <AuthForm formName="Sign Up" apiAction={signup} />
    </div>
  );
}
