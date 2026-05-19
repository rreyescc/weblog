import PageSections from "@/components/page-sections";
import { getHomePage, getPageByPath, getPageByTranslationKey } from "@/features/pages/page.service";
import { getBaseUrl } from "@/lib/metadata";
import { getDynamicPageHref, getLocalizedPath, getOtherLocale, type Locale } from "@/lib/i18n";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function getDynamicPageMetadata(locale: Locale, path: string): Promise<Metadata> {
  const page = await getPageByPath(path, locale);
  const canonical = getDynamicPageHref(locale, path);

  if (!page?.translationKey) {
    return {
      metadataBase: new URL(getBaseUrl()),
      alternates: { canonical },
    };
  }

  const targetLocale = getOtherLocale(locale);
  const translatedPage = await getPageByTranslationKey(page.translationKey, targetLocale);

  return {
    metadataBase: new URL(getBaseUrl()),
    alternates: {
      canonical,
      languages: translatedPage
        ? {
            [locale]: getLocalizedPath(locale, path),
            [targetLocale]: getDynamicPageHref(targetLocale, translatedPage.path),
          }
        : undefined,
    },
  };
}

export async function renderHomePage(locale: Locale) {
  const page = await getHomePage(locale);

  if (!page) {
    notFound();
  }

  return <PageSections sections={page.sections} />;
}

export async function renderDynamicPage(locale: Locale, path: string) {
  const page = await getPageByPath(path, locale);

  if (!page) {
    notFound();
  }

  return <PageSections sections={page.sections} />;
}
