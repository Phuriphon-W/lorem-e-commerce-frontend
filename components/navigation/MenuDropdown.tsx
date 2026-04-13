"use client";

import { Dropdown, message } from "antd";
import type { MenuProps } from "antd";
import { useRouter } from "next/navigation";
import { signout } from "@/apis/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faBars,
  faFileInvoiceDollar,
  faBoxOpen,
  faStore,
  faShirt,
  faCartShopping,
} from "@fortawesome/free-solid-svg-icons";
import {
  faCircleUser,
  faGem,
  faHouse,
} from "@fortawesome/free-regular-svg-icons";
import { animationUnderline } from "@/shared/types/styles";
import useMediaQuery from "@/shared/hooks/useMediaQuery";
import { useMemo } from "react";
import Link from "next/link";

export default function MenuDropdown() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // useMemo caches the resulting array so it isn't recalculated on every render
  const items: MenuProps["items"] = useMemo(() => {
    const menuItems = [
      { label: "Home", icon: faHouse, key: 0, visible: isMobile, href: "/" },
      {
        label: "Products",
        icon: faStore,
        key: 1,
        visible: isMobile,
        href: "/product",
      },
      {
        label: "Apparels",
        icon: faShirt,
        key: 2,
        visible: isMobile,
        href: "apparel",
      },
      {
        label: "Accessories",
        icon: faGem,
        key: 3,
        visible: isMobile,
        href: "/accessory",
      },
      {
        label: "Cart",
        icon: faCartShopping,
        key: 4,
        visible: isMobile,
        href: "/cart",
      },
      {
        label: "My Profile",
        icon: faCircleUser,
        key: 5,
        visible: true,
        href: "/profile",
      },
      {
        label: "My Order",
        icon: faBoxOpen,
        key: 6,
        visible: true,
        href: "/order",
      },
      {
        label: "My Purchase",
        icon: faFileInvoiceDollar,
        key: 7,
        visible: true,
        href: "/purchase",
      },
    ];

    // Filter and Map to Dropdown items
    const generatedItems = menuItems
      .filter((item) => item.visible)
      .map((item) => ({
        key: item.key,
        label: (
          <Link
            key={item.key}
            href={item.href}
            className="group flex h-8 cursor-pointer items-center gap-2 px-2 transition-colors hover:text-yellow-600!"
          >
            <FontAwesomeIcon icon={item.icon} />
            <div className="relative">
              {item.label}
              <span className={`${animationUnderline("bg-yellow-600")}`} />
            </div>
          </Link>
        ),
      }));

    // Add Signout
    generatedItems.push({
      key: 8,
      label: (
        <form
          action={async () => {
            await signout();
            message.success("Sign Out Successfully");
            router.push("/signin");
          }}
        >
          <button className="group flex h-8 cursor-pointer items-center gap-2 px-2 transition-colors hover:text-red-500 w-full text-left">
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
            <div className="relative">
              Sign Out
              <span className={`${animationUnderline()}`} />
            </div>
          </button>
        </form>
      ),
    });

    return generatedItems;
  }, [isMobile]); // <-- Only rebuild this array if isMobile changes

  return (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <div className="h-full w-14 flex items-center justify-center hover:cursor-pointer hover:bg-gray-100">
        <FontAwesomeIcon icon={faBars} />
      </div>
    </Dropdown>
  );
}
