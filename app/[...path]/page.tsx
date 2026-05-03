import PageSections from '@/components/page-sections';
import { getPageByPath } from '@/features/pages/page.service';
import { notFound } from 'next/navigation';

type PageProps = {
  params: Promise<{ path: string[] }>;
};

export default async function Page({ params }: PageProps) {
  const { path } = await params;
  const page = await getPageByPath(path.join("/"));

  if (!page) {
    notFound();
  }

  return <PageSections sections={page.sections} />;
}
