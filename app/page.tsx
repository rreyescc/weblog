import PageSections from "@/components/page-sections";
import { getHomePage } from "@/features/pages/page.service";
import { notFound } from "next/navigation";

export default async function Page() {
  const page = await getHomePage();

  if (!page) {
    notFound();
  }

  return <PageSections sections={page.sections} />;
}
