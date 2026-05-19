import { fetchCms } from "@/integrations/cms/client";
import { buildPageByPathQuery, buildPageByTranslationKeyQuery, buildPagesListQuery } from "@/integrations/cms/page-queries";
import { DEFAULT_LOCALE, getLocalizedNavigationItem, type Locale } from "@/lib/i18n";
import type { PagesResponse } from "@/types/cms/page";
import type { NavigationItem, Page } from "@/types/page";

export function getPagesListCacheTag(locale: Locale = DEFAULT_LOCALE): string {
  return `pages:list:${locale}`;
}

export function normalizePagePath(path: string): string {
  const trimmedPath = path.trim();

  if (!trimmedPath) {
    return "/";
  }

  return trimmedPath.startsWith("/") ? trimmedPath : `/${trimmedPath}`;
}

export function getPageCacheTag(locale: Locale, path: string): string {
  const normalized = normalizePagePath(path);
  return `page:${locale}:${normalized}`;
}

export async function getPageByPath(path: string, locale: Locale = DEFAULT_LOCALE): Promise<Page | undefined> {
  const normalizedPath = normalizePagePath(path);
  const query = buildPageByPathQuery(locale, normalizedPath);
  const { data } = await fetchCms<PagesResponse>(query, {
    tags: [getPageCacheTag(locale, normalizedPath)],
  });

  const item = data.pageList.items?.[0];

  if (!item) {
    return undefined;
  }

  return {
    title: item.title ?? "",
    path: item.path ?? "",
    translationKey: item.translationKey,
    sections: item.sections ?? [],
    seo: item.seo ?? {},
  };
}

export async function getPageByTranslationKey(
  translationKey: string,
  locale: Locale = DEFAULT_LOCALE,
): Promise<Page | undefined> {
  const query = buildPageByTranslationKeyQuery(locale, translationKey);
  const { data } = await fetchCms<PagesResponse>(query, {
    tags: [getPagesListCacheTag(locale)],
  });

  const item = data.pageList.items?.[0];

  if (!item) {
    return undefined;
  }

  return {
    title: item.title ?? "",
    path: item.path ?? "",
    translationKey: item.translationKey,
    sections: item.sections ?? [],
    seo: item.seo ?? {},
  };
}

export function getHomePage(locale: Locale = DEFAULT_LOCALE) {
  return getPageByPath("/", locale);
}

export async function getNavigationPages(locale: Locale = DEFAULT_LOCALE): Promise<NavigationItem[]> {
  const { data } = await fetchCms<PagesResponse>(buildPagesListQuery(locale), {
    tags: [getPagesListCacheTag(locale)],
  });
  const items = data.pageList.items ?? [];

  return items.flatMap((item) => {
    const href = normalizePagePath(item.path ?? "");
    const label = item.title?.trim() ?? "";

    if (!href || !label || href === "/" || href === "/blog") {
      return [];
    }

    return [getLocalizedNavigationItem(locale, { href, label })];
  });
}
