import { fetchCms } from "@/integrations/cms/client";
import { buildPageByPathQuery, PAGES_LIST_QUERY } from "@/integrations/cms/page-queries";
import type { PagesResponse } from "@/types/cms/page";
import type { NavigationItem, Page } from "@/types/page";

function normalizePagePath(path: string) {
  const trimmedPath = path.trim();

  if (!trimmedPath) {
    return "";
  }

  return trimmedPath.startsWith("/") ? trimmedPath : `/${trimmedPath}`;
}

export async function getPageByPath(path: string): Promise<Page | undefined> {
  const query = buildPageByPathQuery(path);
  const { data } = await fetchCms<PagesResponse>(query);

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
  const { data } = await fetchCms<PagesResponse>(PAGES_LIST_QUERY);
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
