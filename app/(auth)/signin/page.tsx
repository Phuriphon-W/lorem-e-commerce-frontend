"use client";

import { signin } from "@/apis/auth";
import AuthForm from "@/components/auth/AuthForm";
import { Typography } from "antd";

export default function SigninPage() {
  return (
    <div className="flex flex-col justify-center items-center w-full gap-y-2">
      <Typography.Title>Lorem</Typography.Title>
      <AuthForm formName="Sign In" apiAction={signin} />
    </div>
  );
}
