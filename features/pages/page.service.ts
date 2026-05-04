import { fetchCms } from "@/integrations/cms/client";
import { buildPageByPathQuery, PAGES_LIST_QUERY } from "@/integrations/cms/page-queries";
import type { PagesResponse } from "@/types/cms/page";
import type { NavigationItem, Page } from "@/types/page";

export const PAGES_LIST_CACHE_TAG = "pages:list";

export function normalizePagePath(path: string): string {
  const trimmedPath = path.trim();

  if (!trimmedPath) {
    return "/";
  }

  return trimmedPath.startsWith("/") ? trimmedPath : `/${trimmedPath}`;
}

export function getPageCacheTag(path: string): string {
  const normalized = normalizePagePath(path);
  return `page:${normalized}`;
}

export async function getPageByPath(path: string): Promise<Page | undefined> {
  const normalizedPath = normalizePagePath(path);
  const query = buildPageByPathQuery(normalizedPath);
  const { data } = await fetchCms<PagesResponse>(query, {
    tags: [getPageCacheTag(normalizedPath)],
  });

  const item = data.pageList.items?.[0];

  if (!item) {
    return undefined;
  }

  return {
    title: item.title ?? "",
    path: item.path ?? "",
    sections: item.sections ?? [],
    seo: item.seo ?? {},
  };
}

export function getHomePage() {
  return getPageByPath("/");
}

export async function getNavigationPages(): Promise<NavigationItem[]> {
  const { data } = await fetchCms<PagesResponse>(PAGES_LIST_QUERY, {
    tags: [PAGES_LIST_CACHE_TAG],
  });
  const items = data.pageList.items ?? [];

  return items.flatMap((item) => {
    const href = normalizePagePath(item.path ?? "");
    const label = item.title?.trim() ?? "";

    if (!href || !label || href === "/" || href === "/blog") {
      return [];
    }

    return [{ href, label }];
  });
}