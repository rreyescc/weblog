import { getCmsHost } from "@/integrations/cms/client";
import type { Post } from "@/types/cms/post";
import type { RichTextNode, RichTextContent } from "@/types/cms/richtext";
import type {
  PostDetail,
  PostSummary,
} from "@/types/post";

function mapCmsRichTextNode(node: RichTextNode): RichTextNode {
  return {
    nodeType: node.nodeType,
    value: node.value,
    content: node.content?.map(mapCmsRichTextNode),
  };
}

function mapCmsRichText(content: Post["content"]): RichTextContent {
  return {
    html: content?.html,
    markdown: content?.markdown,
    plaintext: content?.plaintext,
    json: content?.json?.map(mapCmsRichTextNode),
  };
}

export function mapCmsPostToSummary(post: Post): PostSummary | null {
  if (!post.slug || !post.title || !post.intro) {
    return null;
  }

  const cmsHost = getCmsHost();

  return {
    slug: post.slug,
    title: post.title,
    intro: post.intro,
    image: post.coverImage?._path ? `${cmsHost}${post.coverImage._path}` : "",
    publishedAt: post.publishedAt ?? "No definido",
  };
}

export function mapCmsPostToDetail(post: Post): PostDetail | null {
  const summary = mapCmsPostToSummary(post);

  if (!summary) {
    return null;
  }

  return {
    ...summary,
    content: mapCmsRichText(post.content),
  };
}
