'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavigationItem } from "@/types/page";

type NavigationMenuProps = {
  ariaLabel: string;
  items: NavigationItem[];
  className?: string;
  linkClassName?: string;
  activeLinkClassName?: string;
};

export default function NavigationMenu({
  ariaLabel,
  items,
  className = "",
  linkClassName = "",
  activeLinkClassName = "",
}: NavigationMenuProps) {
  const pathname = usePathname();

  return (
    <nav aria-label={ariaLabel} className={className}>
      {items.map((item) => {
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
