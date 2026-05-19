import { PageSeo } from "./cms/page";
import type { HeroSection, RichTextSection } from "./cms/page";

export type Page = {
  title: string;
  path: string;
  translationKey?: string;
  sections: (HeroSection | RichTextSection)[];
  seo: PageSeo;
};

export type NavigationItem = {
  href: string;
  label: string;
};
