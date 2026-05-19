'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  getLanguageSwitcherHref,
  getLocaleFromPathname,
  stripLocaleFromPath,
  type Locale,
} from "@/lib/i18n";

type LanguageSwitcherProps = {
  label: string;
  labels: Record<Locale, string>;
  hrefs?: Record<Locale, string>;
};

export default function LanguageSwitcher({ label, labels, hrefs }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const currentLocale = getLocaleFromPathname(pathname);
  const internalPath = stripLocaleFromPath(pathname);

  return (
    <nav aria-label={label} className="flex items-center gap-1 rounded-full border border-black/10 bg-stone-50 p-1 text-xs font-semibold text-black/65">
      {(["es", "en"] as const).map((locale) => {
        const isActive = locale === currentLocale;
        return (
          <Link
            key={locale}
            href={hrefs?.[locale] ?? getLanguageSwitcherHref(currentLocale, locale, internalPath)}
            aria-current={isActive ? "true" : undefined}
            className={`rounded-full px-3 py-1 transition ${isActive ? "bg-black text-white" : "hover:bg-black/5 hover:text-black"}`}
          >
            {labels[locale]}
          </Link>
        );
      })}
    </nav>
  );
}
