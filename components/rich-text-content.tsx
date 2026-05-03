type RichTextContentProps = {
  html: string;
};

export default function RichTextContent({ html }: RichTextContentProps) {
  if (!html.trim()) {
    return (
      <p className="text-base leading-7 text-stone-600">
        Este articulo aun no tiene contenido disponible.
      </p>
    );
  }

  return (
    <div
      className="
        text-lg leading-8 text-stone-700
        [&_a]:font-medium [&_a]:text-stone-950 [&_a]:underline [&_a]:decoration-amber-400 [&_a]:underline-offset-4
        [&_blockquote]:my-10 [&_blockquote]:border-l-4 [&_blockquote]:border-amber-400 [&_blockquote]:bg-amber-50/70 [&_blockquote]:px-6 [&_blockquote]:py-4 [&_blockquote]:italic [&_blockquote]:text-stone-700
        [&_h2]:mt-14 [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-stone-950
        [&_h3]:mt-10 [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:tracking-tight [&_h3]:text-stone-950
        [&_hr]:my-12 [&_hr]:border-stone-200
        [&_img]:my-10 [&_img]:w-full [&_img]:rounded-3xl
        [&_li]:mt-3
        [&_ol]:my-6 [&_ol]:list-decimal [&_ol]:pl-6
        [&_p]:mt-6
        [&_strong]:font-semibold [&_strong]:text-stone-950
        [&_ul]:my-6 [&_ul]:list-disc [&_ul]:pl-6
      "
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
