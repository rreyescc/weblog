import { renderBlogPage } from "@/features/rendering/blog";
import { getLocalizedMetadata } from "@/lib/metadata";

export function generateMetadata() {
  return getLocalizedMetadata("es", "/blog", true);
}

export default async function Page() {
  return renderBlogPage("es");
}
