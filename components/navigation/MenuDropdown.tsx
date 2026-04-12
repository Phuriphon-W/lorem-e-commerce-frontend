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
} from "@fortawesome/free-solid-svg-icons";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
import { animationUnderline } from "@/shared/types/styles";

// TODO: Add href for redirected
const menuItems = [
  { label: "My Profile", icon: faCircleUser, key: 0 },
  { label: "My Order", icon: faBoxOpen, key: 1 },
  { label: "My Purchase", icon: faFileInvoiceDollar, key: 2 },
];

export default function MenuDropdown() {
  const router = useRouter();

  const items: MenuProps["items"] = [
    ...menuItems.map((item) => ({
      label: (
        <div className="group flex h-8 cursor-pointer items-center gap-2 px-2 transition-colors hover:text-yellow-600">
          <FontAwesomeIcon icon={item.icon} />
          <div className="relative">
            {item.label}

            {/* Underline Animation */}
            <span className={`${animationUnderline("bg-yellow-600")}`} />
          </div>
        </div>
      ),
      key: item.key,
    })),

    {
      label: (
        <form
          action={async () => {
            await signout();
            message.success("Sign Out Successfully");
            router.push("/signin");
          }}
        >
          <button className="group flex h-8 cursor-pointer items-center gap-2 px-2 transition-colors hover:text-red-500">
            {/* Icon */}
            <FontAwesomeIcon icon={faArrowRightFromBracket} />

            <div className="relative">
              Sign Out
              {/* The Underline */}
              <span className={`${animationUnderline()}`} />
            </div>
          </button>
        </form>
      ),
      key: 3,
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <div className="h-full w-14 flex items-center justify-center hover:cursor-pointer hover:bg-gray-100">
        <FontAwesomeIcon icon={faBars} />
      </div>
    </Dropdown>
  );
}
