"use client";

import { Suspense, useEffect, useState } from "react";
import { verifySession } from "@/apis/payment";
import { Button, Result, Spin, message } from "antd";
import { useRouter, useSearchParams } from "next/navigation";

function FailureContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!sessionId) {
      router.push("/order");
      return;
    }

    const verify = async () => {
      try {
        const res = await verifySession(sessionId);
        // If valid is true, they actually paid, so they shouldn't be here.
        if (res.valid) {
          router.push("/payment/success?session_id=" + sessionId);
        } else {
          setLoading(false);
          const interval = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(interval);
                router.push("/order");
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
      } catch (err) {
        // If error verifying, assume failure and proceed
        setLoading(false);
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
        status="error"
        title="Payment Failed or Cancelled"
        subTitle={`Your payment was not completed. You will be redirected back to your orders in ${countdown} seconds.`}
        extra={[
          <Button type="primary" key="order" onClick={() => router.push("/order")}>
            Return to Orders
          </Button>,
        ]}
      />
    </div>
  );
}

export default function FailurePage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center w-full h-[50vh]">
        <Spin size="large" />
      </div>
    }>
      <FailureContent />
    </Suspense>
  );
}
