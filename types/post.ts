import type { RichTextContent } from "./cms/richtext";

// export type { RichTextNode, RichTextContent };

export type PostSummary = {
  slug: string;
  title: string;
  intro: string;
  image: string;
  publishedAt: string;
};

export type PostDetail = PostSummary & {
  content: RichTextContent;
};
