'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  getDictionary,
  getHomeHref,
  getLocaleFromPathname,
  type Locale,
} from "@/lib/i18n";
import type { NavigationItem } from "@/types/page";
import NavigationMenu from "./navigation-menu";

type FooterClientProps = {
  itemsByLocale: Record<Locale, NavigationItem[]>;
};

export default function FooterClient({ itemsByLocale }: FooterClientProps) {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const dictionary = getDictionary(locale);

  return (
    <footer className="border-t border-black/10 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-8 px-6 py-5">
        <Link href={getHomeHref(locale)} className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/15 bg-black text-sm font-semibold text-white">
            W
          </div>
          <span className="text-lg font-semibold tracking-tight text-black">
            Weblog
          </span>
        </Link>

        <NavigationMenu
          ariaLabel={dictionary.navigation.footer}
          items={itemsByLocale[locale]}
          className="flex items-center gap-5 text-sm text-black/70"
          linkClassName="transition hover:text-black"
          activeLinkClassName="text-black"
        />

        <p className="ml-auto text-sm text-black/55">
          Copyright © 2026 Weblog
        </p>
      </div>
    </footer>
  );
}
