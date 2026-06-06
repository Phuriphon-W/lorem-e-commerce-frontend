"use client";

import React from "react";
import { Button, Dropdown, message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faArrowRightFromBracket,
  faCircleUser,
  faStore,
} from "@fortawesome/free-solid-svg-icons";
import { usePathname, useRouter } from "next/navigation";
import { signout } from "@/apis/auth";
import useMediaQuery from "@/shared/hooks/useMediaQuery";

interface BackOfficeTopbarProps {
  onToggleSidebar: () => void;
}

export default function BackOfficeTopbar({
  onToggleSidebar,
}: BackOfficeTopbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Determine section name
  let title = "Dashboard";
  if (pathname.includes("/backoffice/products")) {
    title = "Product Management";
  } else if (pathname.includes("/backoffice/categories")) {
    title = "Category Management";
  } else if (pathname.includes("/backoffice/orders")) {
    title = "Order Management";
  } else if (pathname.includes("/backoffice/users")) {
    title = "User Management";
  }

  const handleSignOut = async () => {
    try {
      await signout();
      message.success("Sign Out Successfully");
      router.push("/signin");
    } catch {
      message.error("Failed to sign out");
    }
  };

  const userMenuItems = [
    {
      key: "signout",
      label: "Sign Out",
      danger: true,
      icon: <FontAwesomeIcon icon={faArrowRightFromBracket} />,
      onClick: handleSignOut,
    },
  ];

  return (
    <header className="h-[74px] md:h-16 border-b border-gray-100 bg-white px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm shadow-gray-100/40">
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger menu */}
        {isMobile && (
          <Button
            type="text"
            icon={<FontAwesomeIcon icon={faBars} />}
            onClick={onToggleSidebar}
            className="md:hidden flex items-center justify-center w-10 h-10 hover:bg-amber-50 rounded-lg text-gray-600 hover:text-amber-600"
          />
        )}
        <h1 className="font-bold text-lg text-gray-800 tracking-tight">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <Dropdown
          menu={{ items: userMenuItems }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button
            type="text"
            className="flex items-center gap-2 px-3 py-1.5 h-10 hover:bg-amber-50 rounded-lg text-gray-600 hover:text-amber-600"
          >
            <FontAwesomeIcon icon={faCircleUser} size="lg" />
            <span className="hidden sm:inline font-medium text-sm">Admin</span>
          </Button>
        </Dropdown>
      </div>
    </header>
  );
}
