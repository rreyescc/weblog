import { fetchCms } from "@/integrations/cms/client";
import { buildPostBySlugQuery, POST_LIST_QUERY } from "@/integrations/cms/post-queries";
import { mapCmsPostToDetail, mapCmsPostToSummary } from "@/features/posts/post.mapper";
import { getMockPostBySlug, getMockPosts, isMockCmsEnabled } from "@/features/posts/mock-posts";
import type { PostsResponse } from "@/types/cms/post";
import type { PostDetail, PostSummary } from "@/types/post";

export const POSTS_LIST_CACHE_TAG = "posts:list";

export function getPostCacheTag(slug: string) {
  return `post:${slug}`;
}

export async function getPosts(): Promise<PostSummary[]> {
  if (isMockCmsEnabled()) {
    return getMockPosts();
  }

  const response = await fetchCms<PostsResponse>(POST_LIST_QUERY, {
    tags: [POSTS_LIST_CACHE_TAG],
  });
  const items = response.data?.postList?.items ?? [];

  return items
    .map(mapCmsPostToSummary)
    .filter((post): post is PostSummary => post !== null);
}

export async function getPostSlugs(): Promise<Array<{ slug: string }>> {
  const posts = await getPosts();
  return posts.map(({ slug }) => ({ slug }));
}

export async function getPostBySlug(slug: string): Promise<PostDetail | undefined> {
  if (isMockCmsEnabled()) {
    return getMockPostBySlug(slug);
  }

  const response = await fetchCms<PostsResponse>(buildPostBySlugQuery(slug), {
    tags: [getPostCacheTag(slug)],
  });
  const item = response.data?.postList?.items?.[0];

  if (!item) {
    return undefined;
  }

  return mapCmsPostToDetail(item) ?? undefined;
}
