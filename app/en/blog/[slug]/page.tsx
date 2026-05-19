import { getPostSlugs } from "@/features/posts/post.service";
import { getPostMetadata, renderPostPage } from "@/features/rendering/post";

export const dynamicParams = false;

export async function generateStaticParams() {
  return await getPostSlugs("en");
}

export async function generateMetadata(props: PageProps<"/en/blog/[slug]">) {
  const { slug } = await props.params;
  return getPostMetadata("en", slug);
}

export default async function Page(props: PageProps<"/en/blog/[slug]">) {
  const { slug } = await props.params;
  return renderPostPage("en", slug);
}
