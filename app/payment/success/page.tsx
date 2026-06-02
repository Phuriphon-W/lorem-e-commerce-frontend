"use client";

import { Suspense, useEffect, useState } from "react";
import { verifySession } from "@/apis/payment";
import { Button, Result, Spin, message } from "antd";
import { useRouter, useSearchParams } from "next/navigation";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!sessionId) {
      message.error("Invalid session.");
      router.push("/order");
      return;
    }

    const verify = async () => {
      try {
        const res = await verifySession(sessionId);
        if (!res.valid) {
          message.error("Payment not verified.");
          router.push("/order");
        } else {
          setLoading(false);
          const interval = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(interval);
                router.push("/purchase");
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
      } catch (err: any) {
        message.error("Error verifying session.");
        router.push("/order");
      }
    };

    verify();
  }, [sessionId, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-[50vh]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full pt-10">
      <Result
        status="success"
        title="Payment Successful!"
        subTitle={`Thank you for your purchase. You will be redirected in ${countdown} seconds.`}
        extra={[
          <Button type="primary" key="purchase" onClick={() => router.push("/purchase")}>
            Go to Purchases
          </Button>,
        ]}
      />
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center w-full h-[50vh]">
        <Spin size="large" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
