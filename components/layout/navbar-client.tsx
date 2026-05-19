'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import LanguageSwitcher from "@/components/language-switcher";
import {
  getDictionary,
  getHomeHref,
  getLocaleFromPathname,
  type Locale,
} from "@/lib/i18n";
import type { NavigationItem } from "@/types/page";
import NavigationMenu from "./navigation-menu";

type NavbarClientProps = {
  itemsByLocale: Record<Locale, NavigationItem[]>;
  languageSwitcherHrefs?: Record<Locale, string>;
  languageSwitcherPathname?: string;
};

type ResolvedLanguageSwitcherHrefs = {
  pathname: string;
  hrefs?: Record<Locale, string>;
};

export default function NavbarClient({
  itemsByLocale,
  languageSwitcherHrefs,
  languageSwitcherPathname,
}: NavbarClientProps) {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const dictionary = getDictionary(locale);
  const [resolvedLanguageSwitcherHrefs, setResolvedLanguageSwitcherHrefs] = useState<ResolvedLanguageSwitcherHrefs>({
    pathname: languageSwitcherPathname ?? pathname,
    hrefs: languageSwitcherHrefs,
  });
  const initialLanguageSwitcherHrefs = pathname === languageSwitcherPathname ? languageSwitcherHrefs : undefined;
  const activeLanguageSwitcherHrefs = initialLanguageSwitcherHrefs
    ?? (resolvedLanguageSwitcherHrefs.pathname === pathname ? resolvedLanguageSwitcherHrefs.hrefs : undefined);

  useEffect(() => {
    const controller = new AbortController();

    async function resolveLanguageSwitcherHrefs() {
      try {
        const response = await fetch(`/api/language-switcher?pathname=${encodeURIComponent(pathname)}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to resolve language switcher hrefs");
        }

        const payload = await response.json() as { hrefs?: Record<Locale, string> };
        startTransition(() => setResolvedLanguageSwitcherHrefs({ pathname, hrefs: payload.hrefs }));
      } catch {
        if (!controller.signal.aborted) {
          startTransition(() => setResolvedLanguageSwitcherHrefs({ pathname, hrefs: undefined }));
        }
      }
    }

    if (pathname === languageSwitcherPathname) {
      startTransition(() => setResolvedLanguageSwitcherHrefs({ pathname, hrefs: languageSwitcherHrefs }));
      return () => controller.abort();
    }

    resolveLanguageSwitcherHrefs();

    return () => controller.abort();
  }, [languageSwitcherHrefs, languageSwitcherPathname, pathname]);

  return (
    <header className="border-b border-black/10 bg-white">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-6 py-4">
        <Link href={getHomeHref(locale)} className="flex items-center gap-3 justify-self-start">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/15 bg-black text-sm font-semibold text-white">
            W
          </div>
          <span className="text-lg font-semibold tracking-tight text-black">
            Weblog
          </span>
        </Link>

        <NavigationMenu
          ariaLabel={dictionary.navigation.principal}
          items={itemsByLocale[locale]}
          className="flex items-center justify-center gap-8 text-sm font-medium text-black/70"
          linkClassName="transition hover:text-black"
          activeLinkClassName="text-black"
        />

        <div className="justify-self-end">
          <LanguageSwitcher
            label={dictionary.language.label}
            labels={{ es: dictionary.language.es, en: dictionary.language.en }}
            hrefs={activeLanguageSwitcherHrefs}
          />
        </div>
      </div>
    </header>
  );
}
