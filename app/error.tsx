"use client";

import ErrorPage from "@/components/global/ErrorPage";
import { usePathname } from "next/navigation";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();

  let homePath = "/";
  let homeLabel = "Go Home";

  if (pathname?.startsWith("/backoffice")) {
    homePath = "/backoffice";
    homeLabel = "Go to Dashboard";
  } else if (
    pathname?.startsWith("/signin") ||
    pathname?.startsWith("/signup") ||
    pathname?.startsWith("/forgot-password") ||
    pathname?.startsWith("/reset-password")
  ) {
    homePath = "/signin";
    homeLabel = "Go to Sign In";
  }

  return (
    <ErrorPage
      error={error}
      reset={reset}
      homePath={homePath}
      homeLabel={homeLabel}
    />
  );
}
