'use client'

import { animationUnderline } from '@/shared/types/styles';
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

// Map of links to display in the side navigation.
const links = [
  { name: 'Home', href: '/', icon: faHouse },
  { name: 'Products', href: '/product', icon: faStore },
  { name: 'Apparels', href: '/apparel', icon: faShirt},
  { name: 'Accessories', href: '/accessory', icon: faGem},
  { name: 'Cart', href: '/cart', icon: faCartShopping },
];

export default function NavLinks() {
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className="group flex h-16 items-center justify-center gap-2 p-3 text-sm font-medium 
            hover:text-yellow-600 md:flex-none md:justify-start md:py-2 md:px-3"
          >
            <FontAwesomeIcon icon={LinkIcon} className="w-6" />
            <div className="relative hidden md:block">
              {link.name}
              <span 
                className={`${animationUnderline("bg-yellow-600")}`}
              />
            </div>
          </Link>
        );
      })}
    </>
  );
}