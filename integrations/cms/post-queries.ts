import { escapeGraphqlString } from "@/integrations/cms/client";
import { getCmsContentRoot, type Locale } from "@/lib/i18n";

const POST_FIELDS = `
  slug
  translationKey
  title
  intro
  coverImage {
    ... on ImageRef {
      _path
    }
  }
  publishedAt
`;

const POST_DETAIL_FIELDS = `
  ${POST_FIELDS}
  content {
    html
    markdown
    plaintext
    json
  }
`;

function buildPostLocaleFilter(locale: Locale) {
  const root = escapeGraphqlString(getCmsContentRoot(locale, "posts"));

  return `_path: { _expressions: [{ value: "${root}", _operator: STARTS_WITH }] }`;
}

export function buildPostListQuery(locale: Locale) {
  return `
    {
      postList(filter: { ${buildPostLocaleFilter(locale)} }) {
        items {
          ${POST_FIELDS}
        }
      }
    }
  `;
}

export function buildPostBySlugQuery(locale: Locale, slug: string) {
  const safeSlug = escapeGraphqlString(slug);

  return `
    {
      postList(filter: {
        ${buildPostLocaleFilter(locale)}
        slug: { _expressions: [{ value: "${safeSlug}" }] }
      }) {
        items {
          ${POST_DETAIL_FIELDS}
        }
      }
    }
  `;
}

export function buildPostByTranslationKeyQuery(locale: Locale, translationKey: string) {
  const safeTranslationKey = escapeGraphqlString(translationKey);

  return `
    {
      postList(filter: {
        ${buildPostLocaleFilter(locale)}
        translationKey: { _expressions: [{ value: "${safeTranslationKey}" }] }
      }) {
        items {
          ${POST_FIELDS}
        }
      }
    }
  `;
}
