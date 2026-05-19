import { renderHomePage } from "@/features/rendering/pages";
import { getLocalizedMetadata } from "@/lib/metadata";

export function generateMetadata() {
  return getLocalizedMetadata("en", "/", true);
}

export default async function Page() {
  return renderHomePage("en");
}
