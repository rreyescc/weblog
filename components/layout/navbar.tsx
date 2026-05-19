import { getLanguageSwitcherHrefs } from "@/features/i18n/language-switcher.service";
import { getNavigationPages } from "@/features/pages/page.service";
import {
  getBlogHref,
  getDictionary,
  getHomeHref,
  type Locale,
} from "@/lib/i18n";
import type { NavigationItem } from "@/types/page";
import NavbarClient from "./navbar-client";

function getBaseNavigationItems(locale: Locale, dictionary: ReturnType<typeof getDictionary>): NavigationItem[] {
  return [
    { href: getHomeHref(locale), label: dictionary.navigation.home },
    { href: getBlogHref(locale), label: dictionary.navigation.blog },
  ];
}

export default async function Navbar({
  pathname = "/",
}: {
  locale?: Locale;
  pathname?: string;
}) {
  const [esNavigationItems, enNavigationItems, languageSwitcherHrefs] = await Promise.all([
    getNavigationItems("es"),
    getNavigationItems("en"),
    getLanguageSwitcherHrefs(pathname),
  ]);

  return (
    <NavbarClient
      itemsByLocale={{ es: esNavigationItems, en: enNavigationItems }}
      languageSwitcherHrefs={languageSwitcherHrefs}
      languageSwitcherPathname={pathname}
    />
  );
}

async function getNavigationItems(locale: Locale): Promise<NavigationItem[]> {
  const dictionary = getDictionary(locale);
  const cmsNavigationItems = await getNavigationPages(locale);
  const baseNavigationItems = getBaseNavigationItems(locale, dictionary);

  return [...baseNavigationItems, ...cmsNavigationItems];
}
