import { renderHomePage } from "@/features/rendering/pages";
import { getLocalizedMetadata } from "@/lib/metadata";

export function generateMetadata() {
  return getLocalizedMetadata("es", "/", true);
}

export default async function Page() {
  return renderHomePage("es");
}
