import { escapeGraphqlString } from "./client";

const RICHTEXT_FIELDS = `
  html
  markdown
  plaintext
  json
`;

const IMAGE_REF = `
  ... on ImageRef {
    _path
    _dynamicUrl
    _publishUrl
    _authorUrl
  }
`;

const HERO_SECTION = `
  ... on HerosectionModel {
    _id
    title
    subtitle {
      ${RICHTEXT_FIELDS}
    }
    backgroundImage {
      ${IMAGE_REF}
    }
  }
`;

const RICHTEXT_SECTION = `
  ... on RichtextsectionModel {
    _id
    title
    body {
      ${RICHTEXT_FIELDS}
    }
  }
`;

const SECTIONS = `
  sections {
    __typename
    ${HERO_SECTION}
    ${RICHTEXT_SECTION}
  }
`;

export function buildPageByPathQuery(path: string) {
  const safePath = escapeGraphqlString(path);

  return `
    {
      pageList ( filter: { path: { _expressions: [{value: "${safePath}" }] } } )
      {
        items {
          title
          path
          seo
          ${SECTIONS}
        }
      }
    }
  `;
}

export const PAGES_LIST_QUERY = `
  {
    pageList {
      items {
        title
        path
      }
    }
  }
`;
