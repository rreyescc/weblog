import { getDynamicPageMetadata, renderDynamicPage } from "@/features/rendering/pages";

type PageProps = {
  params: Promise<{ path: string[] }>;
};

export default async function Page({ params }: PageProps) {
  const { path } = await params;
  return renderDynamicPage("en", path.join("/"));
}

export async function generateMetadata({ params }: PageProps) {
  const { path } = await params;
  return getDynamicPageMetadata("en", `/${path.join("/")}`);
}
