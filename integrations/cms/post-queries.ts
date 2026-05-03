import { escapeGraphqlString } from "@/integrations/cms/client";

const POST_FIELDS = `
  slug
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

export const POST_LIST_QUERY = `
  {
    postList {
      items {
        ${POST_FIELDS}
      }
    }
  }
`;

export function buildPostBySlugQuery(slug: string) {
  const safeSlug = escapeGraphqlString(slug);

  return `
    {
      postList(filter: { slug: { _expressions: [{ value: "${safeSlug}" }] } }) {
        items {
          ${POST_DETAIL_FIELDS}
        }
      }
    }
  `;
}
