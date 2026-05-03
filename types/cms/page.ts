import type { RichTextContent } from "./richtext";
import { Image } from "./image";

export type HeroSection = {
  __typename: "HerosectionModel";
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
  title: string;
  body: RichTextContent;
}

export type Page = {
  title: string;
  path: string;
  slug: string;
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
