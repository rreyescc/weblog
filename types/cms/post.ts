import { RichTextContent } from "./richtext";
import { Image } from "./image";

export type Post = {
  title?: string;
  slug?: string;
  intro?: string;
  coverImage?: Image;
  publishedAt?: string;
  content?: RichTextContent;
};

export type PostsResponse = {
  data?: {
    postList?: {
      items?: Post[];
    };
  };
};
