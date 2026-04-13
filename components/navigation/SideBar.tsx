"use client";

import { Menu } from "antd";
import type { MenuProps } from "antd";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
import {
  faBoxOpen,
  faFileInvoiceDollar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePathname, useRouter } from "next/navigation";

type MenuItem = Required<MenuProps>["items"][number];

export default function SideBar() {
  const router = useRouter();
  const pathname = usePathname();
  const activeKey = pathname.split("/")[1];

  const items: MenuItem[] = [
    {
      key: "grp",
      type: "group",
      children: [
        {
          key: "profile",
          label: "Profile",
          icon: <FontAwesomeIcon icon={faCircleUser} />,
          onClick: () => router.push("/profile"),
        },
        {
          key: "order",
          label: "Order",
          icon: <FontAwesomeIcon icon={faBoxOpen} />,
          onClick: () => router.push("/order"),
        },
        {
          key: "purchase",
          label: "Purchase",
          icon: <FontAwesomeIcon icon={faFileInvoiceDollar} />,
          onClick: () => router.push("/purchase"),
        },
      ],
    },
  ];

  return (
    <Menu
      style={{ width: 256, height: "100%" }}
      defaultSelectedKeys={[`${activeKey}`]}
      mode="inline"
      items={items}
    />
  );
}
