"use client";

import React from "react";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import {
  faGauge,
  faBox,
  faTags,
  faReceipt,
  faUsers,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePathname, useRouter } from "next/navigation";

type MenuItem = Required<MenuProps>["items"][number];

interface BackOfficeSidebarProps {
  onClose?: () => void;
}

export default function BackOfficeSidebar({ onClose }: BackOfficeSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Highlight key based on route path
  let activeKey = "dashboard";
  if (pathname.includes("/backoffice/products")) {
    activeKey = "products";
  } else if (pathname.includes("/backoffice/categories")) {
    activeKey = "categories";
  } else if (pathname.includes("/backoffice/orders")) {
    activeKey = "orders";
  } else if (pathname.includes("/backoffice/users")) {
    activeKey = "users";
  }

  const handleNavigation = (path: string) => {
    router.push(path);
    if (onClose) {
      onClose();
    }
  };

  const items: MenuItem[] = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: <FontAwesomeIcon icon={faGauge} />,
      onClick: () => handleNavigation("/backoffice"),
    },
    {
      key: "products",
      label: "Products",
      icon: <FontAwesomeIcon icon={faBox} />,
      onClick: () => handleNavigation("/backoffice/products"),
    },
    {
      key: "categories",
      label: "Categories",
      icon: <FontAwesomeIcon icon={faTags} />,
      onClick: () => handleNavigation("/backoffice/categories"),
    },
    {
      key: "orders",
      label: "Orders",
      icon: <FontAwesomeIcon icon={faReceipt} />,
      onClick: () => handleNavigation("/backoffice/orders"),
    },
    {
      key: "users",
      label: "Users",
      icon: <FontAwesomeIcon icon={faUsers} />,
      onClick: () => handleNavigation("/backoffice/users"),
    },
    {
      type: "divider",
    },
    {
      key: "storefront",
      label: "Storefront",
      icon: <FontAwesomeIcon icon={faArrowLeft} />,
      onClick: () => handleNavigation("/"),
    },
  ];

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100">
      <div className="flex h-[74px] md:h-16 justify-center gap-3 px-6 py-6 border-b border-gray-50">
        <span className="font-bold text-lg text-gray-800 tracking-tight">
          Menu
        </span>
      </div>
      <div className="flex-1 py-4">
        <Menu
          selectedKeys={[activeKey]}
          mode="inline"
          items={items}
          className="border-none"
          style={{ borderRight: 0 }}
        />
      </div>
    </div>
  );
}
