import "server-only";

import { getPageByPath, getPageByTranslationKey } from "@/features/pages/page.service";
import { getPostBySlug, getPostByTranslationKey } from "@/features/posts/post.service";
import {
  getDynamicPageHref,
  getLanguageSwitcherHref,
  getLocaleFromPathname,
  getLocalizedPath,
  getOtherLocale,
  getPostHref,
  stripLocaleFromPath,
  type Locale,
} from "@/lib/i18n";

export async function getLanguageSwitcherHrefs(pathname: string): Promise<Record<Locale, string> | undefined> {
  const locale = getLocaleFromPathname(pathname);
  const internalPath = stripLocaleFromPath(pathname);

  if (internalPath === "/" || internalPath === "/blog") {
    return undefined;
  }

  const match = internalPath.match(/^\/blog\/([^/]+)$/);

  if (!match) {
    const targetLocale = getOtherLocale(locale);
    const page = await getPageByPath(internalPath, locale);
    const translatedPage = page?.translationKey
      ? await getPageByTranslationKey(page.translationKey, targetLocale)
      : undefined;
    const targetHref = translatedPage
      ? getDynamicPageHref(targetLocale, translatedPage.path)
      : getLanguageSwitcherHref(locale, targetLocale, internalPath);

    return {
      es: locale === "es" ? getLocalizedPath("es", internalPath) : targetHref,
      en: locale === "en" ? getLocalizedPath("en", internalPath) : targetHref,
    };
  }

  const [, slug] = match;
  const targetLocale = getOtherLocale(locale);
  const post = await getPostBySlug(slug, locale);
  const translatedPost = post?.translationKey
    ? await getPostByTranslationKey(post.translationKey, targetLocale)
    : undefined;
  const fallbackHref = getLanguageSwitcherHref(locale, targetLocale, internalPath);
  const targetHref = translatedPost ? getPostHref(targetLocale, translatedPost.slug) : fallbackHref;

  return {
    es: locale === "es" ? getLocalizedPath("es", internalPath) : targetHref,
    en: locale === "en" ? getLocalizedPath("en", internalPath) : targetHref,
  };
}
