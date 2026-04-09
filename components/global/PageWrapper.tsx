"use client";

import { usePathname } from "next/navigation";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  // HOME PAGE LAYOUT
  // Full width, no margin top, touches the navbar
  if (isHome) {
    return (
      <div className="w-full bg-white grow flex flex-col">
        {children}
      </div>
    );
  }

  // ALL OTHER PAGES LAYOUT
  // 80% width, margin-top of 8, rounded corners
  return (
    <div className="w-[80%] bg-white grow flex flex-col rounded-2xl mt-8 shadow-sm border border-gray-100">
      {children}
    </div>
  );
}