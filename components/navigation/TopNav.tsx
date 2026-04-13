"use client";

import Link from "next/link";
import NavLinks from "./NavLinks";
import { signout } from "@/apis/auth";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons/faArrowRightFromBracket";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePathname, useRouter } from "next/navigation";
import { publicRoutes } from "@/shared/routeList";
import { message } from "antd";
import MenuDropdown from "./MenuDropdown";

export default function TopNav() {
  const pathName = usePathname();
  const showNav = !publicRoutes.includes(pathName);
  const router = useRouter();

  return (
    <>
      {showNav && (
        <div className="shadow-md w-full z-0">
          <div className="flex justify-between items-center h-[74px] md:h-16 px-5">
            {/*  Logo  */}
            <div>
              <Link
                href="/"
                className="text-2xl font-semibold text-gray-800"
                prefetch={true}
              >
                Lorem
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex">
              <NavLinks />
            </div>

            {/* Sign Out button */}
            <MenuDropdown />
          </div>
        </div>
      )}
    </>
  );
}
