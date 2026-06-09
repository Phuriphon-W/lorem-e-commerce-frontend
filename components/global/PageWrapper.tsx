"use client";

import { usePathname } from "next/navigation";
import { publicRoutes, fullWidthRoutes } from "@/shared/routeList";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullWidth = fullWidthRoutes.includes(pathname)
  
  const isPublicRoute = publicRoutes.includes(pathname);
  const borderProperies = isPublicRoute ? "border-none shadow-none" : "shadow-sm border border-gray-100"

  const isBackoffice = pathname.startsWith("/backoffice");

  // HOME PAGE LAYOUT
  // Full width, no margin top, touches the navbar
  if (isFullWidth) {
    return (
      <div className="w-full bg-white flex flex-col shrink-0 min-h-[calc(100vh-74px)] md:min-h-[calc(100vh-64px)]">
        {children}
      </div>
    );
  }

  if (isBackoffice) {
    return (
      <div className="h-screen w-full shrink-0">
        {children}
      </div>
    )
  }

  // ALL OTHER PAGES LAYOUT
  // 80% width, margin-top of 8, rounded corners
  return (
    <div className={`w-full md:w-[80%] bg-white flex flex-col shrink-0 rounded-none md:rounded-2xl mt-8 min-h-[calc(100vh-106px)] md:min-h-[calc(100vh-96px)] ${borderProperies}`}>
      {children}
    </div>
  );
}