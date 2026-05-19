import { fetchCms } from "@/integrations/cms/client";
import { buildPostBySlugQuery, buildPostByTranslationKeyQuery, buildPostListQuery } from "@/integrations/cms/post-queries";
import { mapCmsPostToDetail, mapCmsPostToSummary } from "@/features/posts/post.mapper";
import { getMockPostBySlug, getMockPosts, isMockCmsEnabled } from "@/features/posts/mock-posts";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import type { PostsResponse } from "@/types/cms/post";
import type { PostDetail, PostSummary } from "@/types/post";

export function getPostsListCacheTag(locale: Locale = DEFAULT_LOCALE) {
  return `posts:list:${locale}`;
}

export function getPostCacheTag(locale: Locale, slug: string) {
  return `post:${locale}:${slug}`;
}

export async function getPosts(locale: Locale = DEFAULT_LOCALE): Promise<PostSummary[]> {
  if (isMockCmsEnabled()) {
    return getMockPosts(locale);
  }

  const response = await fetchCms<PostsResponse>(buildPostListQuery(locale), {
    tags: [getPostsListCacheTag(locale)],
  });
  const items = response.data?.postList?.items ?? [];

  return items
    .map(mapCmsPostToSummary)
    .filter((post): post is PostSummary => post !== null);
}

export async function getPostSlugs(locale: Locale = DEFAULT_LOCALE): Promise<Array<{ slug: string }>> {
  const posts = await getPosts(locale);
  return posts.map(({ slug }) => ({ slug }));
}

export async function getPostBySlug(slug: string, locale: Locale = DEFAULT_LOCALE): Promise<PostDetail | undefined> {
  if (isMockCmsEnabled()) {
    return getMockPostBySlug(slug, locale);
  }

  const response = await fetchCms<PostsResponse>(buildPostBySlugQuery(locale, slug), {
    tags: [getPostCacheTag(locale, slug)],
  });
  const item = response.data?.postList?.items?.[0];

  if (!item) {
    return undefined;
  }

  return mapCmsPostToDetail(item) ?? undefined;
}

export async function getPostByTranslationKey(
  translationKey: string,
  locale: Locale = DEFAULT_LOCALE,
): Promise<PostSummary | undefined> {
  if (isMockCmsEnabled()) {
    return getMockPosts(locale).find((post) => post.translationKey === translationKey);
  }

  const response = await fetchCms<PostsResponse>(buildPostByTranslationKeyQuery(locale, translationKey), {
    tags: [getPostsListCacheTag(locale)],
  });
  const item = response.data?.postList?.items?.[0];

  if (!item) {
    return undefined;
  }

  return mapCmsPostToSummary(item) ?? undefined;
}
