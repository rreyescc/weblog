import { getNavigationPages } from "@/features/pages/page.service";
import { DEFAULT_LOCALE, getBlogHref, getDictionary, getHomeHref, type Locale } from "@/lib/i18n";
import type { NavigationItem } from "@/types/page";
import FooterClient from "./footer-client";

function getBaseNavigationItems(locale: Locale, dictionary: ReturnType<typeof getDictionary>): NavigationItem[] {
  return [
    { href: getHomeHref(locale), label: dictionary.navigation.home },
    { href: getBlogHref(locale), label: dictionary.navigation.blog },
  ];
}

export default async function Footer({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  void locale;

  const [esNavigationItems, enNavigationItems] = await Promise.all([
    getNavigationItems("es"),
    getNavigationItems("en"),
  ]);

  return <FooterClient itemsByLocale={{ es: esNavigationItems, en: enNavigationItems }} />;
}

async function getNavigationItems(locale: Locale): Promise<NavigationItem[]> {
  const dictionary = getDictionary(locale);
  const cmsNavigationItems = await getNavigationPages(locale);
  const baseNavigationItems = getBaseNavigationItems(locale, dictionary);

  return [...baseNavigationItems, ...cmsNavigationItems];
}
