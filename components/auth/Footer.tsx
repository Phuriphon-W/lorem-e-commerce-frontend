"use client";

import { neuton } from "@/shared/fonts/font";
import {
  faFacebook,
  faInstagram,
  faXTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faPhone,
  faMapLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePathname } from "next/navigation";
import { publicRoutes } from "@/shared/routeList";

export default function Footer() {
  const socialMediaIcons = [faFacebook, faInstagram, faXTwitter, faYoutube];
  const pathName = usePathname();
  const inPublicRoutes = publicRoutes.includes(pathName);

  return (
    <>
      {!inPublicRoutes && (
        <div
          className={`${neuton.className} flex flex-col md:flex-row w-full bg-white gap-6 px-6 py-6 md:px-20 md:py-10`}
        >
          {/* Part 1: Lorem & Copyright */}
          <div className="order-1 md:order-1 flex flex-row justify-between md:justify-center w-full md:flex-col md:w-1/3 items-center md:items-start">
            <h1 className="font-medium text-[28px] md:text-[56px] leading-none">
              Lorem
            </h1>
            <div className="flex flex-row gap-1 text-[10px] md:text-[14px] text-gray-500 mt-0 md:mt-2">
              <span>© ALL RIGHTS RESERVED.</span>
              <span>2026 Lorem</span>
            </div>
          </div>

          {/* Part 2: Social Media */}
          <div className="order-3 md:order-2 flex w-full md:w-1/3 items-center justify-center gap-6 md:gap-8 text-lg md:text-2xl pt-2 md:pt-0">
            {socialMediaIcons.map((icon) => (
              <a
                key={icon.iconName}
                className="border-gray-200 md:border-2 rounded-full p-2 hover:cursor-pointer duration-500 hover:border-gray-500 flex items-center justify-center"
                href={"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon icon={icon} />
              </a>
            ))}
          </div>

          {/* Part 3: Contact Info */}
          <div className="order-2 md:order-3 flex flex-row justify-between md:flex-col w-full md:w-1/3 items-center md:items-end gap-2 md:gap-4">
            <div className="text-[18px] md:text-[28px] font-bold">
              Contact Info
            </div>

            <div className="flex flex-col gap-y-1.5 md:gap-y-3">
              <div className="flex items-center justify-start md:justify-end gap-2 text-[11px] md:text-[16px]">
                <FontAwesomeIcon icon={faEnvelope} />
                <div>Contact@Lorem.co.th</div>
              </div>

              <div className="flex items-center justify-start md:justify-end gap-2 text-[11px] md:text-[16px]">
                <FontAwesomeIcon icon={faPhone} />
                <div>+66(0)12-345-6789</div>
              </div>

              <div className="flex items-center justify-start md:justify-end gap-2 text-[11px] md:text-[16px]">
                <FontAwesomeIcon icon={faMapLocationDot} />
                <div>Bangkok, Thailand</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}