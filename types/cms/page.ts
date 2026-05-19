import type { RichTextContent } from "./richtext";
import { Image } from "./image";

export type HeroSection = {
  __typename: "HerosectionModel";
  _id: string;
  title: string;
  subtitle: RichTextContent;
  backgroundImage: Image;
}

export type PageSeo = {
  title: string;
  description: string;
}

export type RichTextSection = {
  __typename: "RichtextsectionModel";
  _id: string;
  title: string;
  body: RichTextContent;
}

export type Page = {
  title: string;
  path: string;
  slug: string;
  translationKey?: string;
  sections: (HeroSection | RichTextSection) []
  seo: PageSeo;
}

export type PagesResponse = {
  data: {
    pageList: {
      items: Page[]
    };
  };
}
