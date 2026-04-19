"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button, Result, Spin, Typography } from "antd";
// Ensure this path matches your actual API service file
import { verifyPaymentSession } from "@/apis/payment";

const { Text } = Typography;

function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // States: 'loading' | 'success' | 'error' | 'canceled'
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "canceled"
  >("loading");
  const [countdown, setCountdown] = useState(5);

  const hasVerified = useRef(false);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const canceled = searchParams.get("canceled");

    // ACCESS CONTROL: If no valid Stripe params exist, kick them out immediately
    if (!sessionId && !canceled) {
      router.replace("/");
      return;
    }

    // Handle Stripe "Cancel" button click
    if (canceled) {
      setStatus("canceled");
      startRedirectTimer("/order");
      return;
    }

    // Handle Stripe "Success" redirect (Verify the session)
    if (sessionId && !hasVerified.current) {
      hasVerified.current = true;

      verifyPaymentSession(sessionId)
        .then((res) => {
          if (res.valid) {
            setStatus("success");
            startRedirectTimer("/purchase");
          } else {
            setStatus("error");
            startRedirectTimer("/order"); // Send back to order to try paying again
          }
        })
        .catch(() => {
          setStatus("error");
          startRedirectTimer("/order");
        });
    }
  }, [searchParams, router]);

  // Helper function to handle the 5-second countdown and redirect
  const startRedirectTimer = (destination: string) => {
    let timeLeft = 5;
    const timer = setInterval(() => {
      timeLeft -= 1;
      setCountdown(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(timer);
        router.replace(destination);
      }
    }, 1000);
  };

  // --- UI RENDERERS ---

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Spin size="large" />
        <Text className="mt-4 text-gray-500">
          Verifying your payment securely...
        </Text>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Result
          status="success"
          title="Payment Successful!"
          subTitle={`Your order has been processed. Redirecting to your purchases in ${countdown} seconds...`}
        />
        <Button onClick={() => router.replace("/purchase")}>
          Go to purchases
        </Button>
      </div>
    );
  }

  if (status === "canceled") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Result
          status="warning"
          title="Payment Canceled"
          subTitle={`You canceled the checkout process. Redirecting back to your order in ${countdown} seconds...`}
        />
        <Button onClick={() => router.replace("/order")}>Back to order</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <Result
        status="error"
        title="Payment Failed"
        subTitle={`We could not verify your payment. Redirecting back to your order in ${countdown} seconds...`}
      />
      <Button onClick={() => router.replace("/order")}>Back to order</Button>
    </div>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center mt-20">
          <Spin size="large" />
        </div>
      }
    >
      <PaymentStatusContent />
    </Suspense>
  );
}
