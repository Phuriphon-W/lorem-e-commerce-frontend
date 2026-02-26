'use client'

import Link from 'next/link';
import NavLinks from './NavLinks';
// import { signOut } from '@/auth';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons/faArrowRightFromBracket';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function TopNav() {
  return (
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
        <form action={async () => {
          // 'use server';
          // await signOut();
        }}>
          <button className="flex h-16 cursor-pointer items-center gap-2 px-2 hover:text-red-500 hover:bg-red-100">
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>

      </div>
    </div>
  );
}