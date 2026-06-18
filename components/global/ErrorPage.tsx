"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "antd";

interface ErrorPageProps {
  error: Error;
  reset: () => void;
  homePath?: string;
  homeLabel?: string;
}

export default function ErrorPage({
  error,
  reset,
  homePath = "/",
  homeLabel = "Go Home",
}: ErrorPageProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("Error boundary caught an error:", error);
    }
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 text-center">
      <div className="mb-6 flex items-center justify-center w-20 h-20 rounded-full bg-amber-50">
        <svg
          className="w-10 h-10 text-[#d08700]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        An unexpected error occurred while processing your request. Please try again or return to the main page.
      </p>
      <div className="flex flex-row gap-4 justify-center items-center">
        <Button
          onClick={reset}
          type="primary"
          style={{ backgroundColor: "#d08700", borderColor: "#d08700" }}
          className="hover:!bg-[#b57500] hover:!border-[#b57500]"
        >
          Try Again
        </Button>
        <Link href={homePath} passHref>
          <Button type="default" className="hover:!text-[#d08700] hover:!border-[#d08700]">
            {homeLabel}
          </Button>
        </Link>
      </div>
    </div>
  );
}
