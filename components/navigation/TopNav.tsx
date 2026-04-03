"use client";

import Link from "next/link";
import NavLinks from "./NavLinks";
import { signout } from "@/apis/auth";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons/faArrowRightFromBracket";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePathname, useRouter } from "next/navigation";
import { publicRoutes } from "@/shared/publicRouteList";
import { message } from "antd";

export default function TopNav() {
  const pathName = usePathname();
  const showNav = !publicRoutes.includes(pathName);
  const router = useRouter();

  return (
    <>
      {showNav && (
        <div className="shadow-md w-full z-0">
          <div className="flex justify-between items-center h-16 px-5">
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
            <form
              action={async () => {
                await signout();
                message.success("Sign Out Successfully")
                router.push('/signin')
              }}
            >
              <button className="group flex h-16 cursor-pointer items-center gap-2 px-2 transition-colors hover:text-red-500">
                {/* Icon */}
                <FontAwesomeIcon icon={faArrowRightFromBracket} />

                <div className="hidden md:block relative">
                  Sign Out
                  {/* The Underline */}
                  <span className="absolute left-[50%] -bottom-1 h-0.5 w-0 bg-red-500 translate-x-[-50%] duration-300 group-hover:w-full" />
                </div>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
