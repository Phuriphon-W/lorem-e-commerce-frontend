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
import { publicRoutes } from "@/shared/publicRouteList";

export default function Footer() {
  const socialMediaIcons = [faFacebook, faInstagram, faXTwitter, faYoutube];
  const pathName = usePathname();
  const inPublicRoutes = publicRoutes.includes(pathName);

  return (
    <>
      {!inPublicRoutes && (
        <div className={`${neuton.className} flex w-full bg-white px-20 py-14`}>
          {/* Lorem */}
          <div className="flex flex-col w-1/3 items-center">
            <h1 className="font-medium text-[80px]">Lorem</h1>
            <div className="text-[18px]">© ALL RIGHTS RESERVED. 2026 Lorem</div>
          </div>

          {/* Social Media */}
          <div className="flex w-1/3 items-center justify-center gap-10 text-3xl">
            {socialMediaIcons.map((icon) => (
              // Rick Roll :)
              <a
                key={icon.iconName}
                className="border-gray-200 border-2 rounded-full p-2 hover:cursor-pointer duration-500 hover:border-gray-500"
                href={"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
                target="_blank"
              >
                <FontAwesomeIcon icon={icon} />
              </a>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col w-1/3 gap-y-4 items-center">
            {/* Header */}
            <div className="text-[40px] font-bold">Contact Info</div>

            {/* Mail */}
            <div className="flex flex-col gap-y-4">
              <div className="flex items-center gap-2 text-[20px]">
                <FontAwesomeIcon icon={faEnvelope} />
                <div>Contact@Lorem.co.th</div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-2 text-[20px]">
                <FontAwesomeIcon icon={faPhone} />
                <div>+66(0)12-345-6789</div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-[20px]">
                <FontAwesomeIcon icon={faMapLocationDot} />
                <div>Contact@Lorem.co.th</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
