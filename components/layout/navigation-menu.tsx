'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  { href: "/", label: "Inicio" },
  { href: "/blog", label: "Blog" },
];

type NavigationMenuProps = {
  ariaLabel: string;
  className?: string;
  linkClassName?: string;
  activeLinkClassName?: string;
};

export default function NavigationMenu({
  ariaLabel,
  className = "",
  linkClassName = "",
  activeLinkClassName = "",
}: NavigationMenuProps) {
  const pathname = usePathname();

  return (
    <nav aria-label={ariaLabel} className={className}>
      {navigationItems.map((item) => {
        const isActive =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${linkClassName} ${isActive ? activeLinkClassName : ""}`.trim()}
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
