export type RichTextNode = {
  nodeType?: string;
  value?: string;
  content?: RichTextNode[];
};

export type RichTextContent = {
  html?: string;
  markdown?: string;
  plaintext?: string;
  json?: RichTextNode[];
};