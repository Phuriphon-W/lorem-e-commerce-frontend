'use client'

import { 
    faHouse, 
    faGem 
} from '@fortawesome/free-regular-svg-icons';
import { 
    faStore, 
    faCartShopping,
    faShirt
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
const links = [
  { name: 'Home', href: '/lorem', icon: faHouse },
  { name: 'Products', href: '/lorem/products', icon: faStore },
  { name: 'Apparels', href: '/lorem/category/apparel', icon: faShirt},
  { name: 'Accessories', href: '/lorem/category/accessory', icon: faGem},
  { name: 'Cart', href: '/lorem/cart', icon: faCartShopping },
];

export default function NavLinks() {
  const pathname = usePathname()

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={
              clsx(
                "flex h-16 items-center justify-center gap-2 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:py-2 md:px-3",
                {
                  "bg-sky-100 text-blue-600": pathname === link.href,
                }
              )
            }
          >
            <FontAwesomeIcon icon={LinkIcon} className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}