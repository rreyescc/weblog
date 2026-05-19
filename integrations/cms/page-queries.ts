import { escapeGraphqlString } from "./client";
import { getCmsContentRoot, type Locale } from "@/lib/i18n";

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

function buildPageLocaleFilter(locale: Locale) {
  const root = escapeGraphqlString(getCmsContentRoot(locale, "pages"));

  return `_path: { _expressions: [{ value: "${root}", _operator: STARTS_WITH }] }`;
}

export function buildPageByPathQuery(locale: Locale, path: string) {
  const safePath = escapeGraphqlString(path);

  return `
    {
      pageList ( filter: {
        ${buildPageLocaleFilter(locale)}
        path: { _expressions: [{value: "${safePath}" }] }
      } )
      {
        items {
          title
          path
          translationKey
          seo
          ${SECTIONS}
        }
      }
    }
  `;
}

export function buildPagesListQuery(locale: Locale) {
  return `
    {
      pageList(filter: { ${buildPageLocaleFilter(locale)} }) {
        items {
          title
          path
          translationKey
        }
      }
    }
  `;
}

export function buildPageByTranslationKeyQuery(locale: Locale, translationKey: string) {
  const safeTranslationKey = escapeGraphqlString(translationKey);

  return `
    {
      pageList(filter: {
        ${buildPageLocaleFilter(locale)}
        translationKey: { _expressions: [{value: "${safeTranslationKey}" }] }
      })
      {
        items {
          title
          path
          translationKey
          seo
        }
      }
    }
  `;
}
