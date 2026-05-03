import { fetchCms } from "@/integrations/cms/client";
import { buildPageByPathQuery } from "@/integrations/cms/page-queries";
import { PagesResponse } from "@/types/cms/page";
import { Page } from "@/types/page";

export async function getPageByPath(path: string): Promise<Page | undefined> {
  const query = buildPageByPathQuery(path);
  const { data } = await fetchCms<PagesResponse>(query);

  const item = data.pageList.items?.[0];

  if(!item) {
    return undefined;
  }

  return {
    title: item.title ?? "",
    path: item.path ?? "",
    sections: item.sections ?? [],
    seo: item.seo ?? {}
  };
}
