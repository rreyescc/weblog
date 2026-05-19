import { renderBlogPage } from "@/features/rendering/blog";
import { getLocalizedMetadata } from "@/lib/metadata";

export function generateMetadata() {
  return getLocalizedMetadata("en", "/blog", true);
}

export default async function Page() {
  return renderBlogPage("en");
}
