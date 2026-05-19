import { getPostSlugs } from "@/features/posts/post.service";
import { getPostMetadata, renderPostPage } from "@/features/rendering/post";

export const dynamicParams = false;

export async function generateStaticParams() {
  return await getPostSlugs("es");
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  return getPostMetadata("es", slug);
}

export default async function Page(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  return renderPostPage("es", slug);
}
