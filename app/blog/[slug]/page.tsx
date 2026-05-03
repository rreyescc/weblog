import { getPostBySlug, getPostSlugs } from "@/features/posts/post.service";
import RichTextContent from "@/components/rich-text-content";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export async function generateStaticParams() {
  return await getPostSlugs();
}

export default async function Page(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <section
        className="relative isolate overflow-hidden bg-stone-950"
        style={{ backgroundImage: `url(${post.image})` }}
      >
        <div className="absolute inset-0 bg-stone-950/75" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-gradient-to-br from-stone-950 via-stone-900/70 to-amber-950/60"
          aria-hidden="true"
        />

        <div className="relative mx-auto flex min-h-[460px] w-full max-w-6xl flex-col justify-end px-6 py-16 sm:py-20">
          <Link
            href="/blog"
            className="mb-10 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/15"
          >
            Volver al blog
          </Link>

          <div className="max-w-4xl">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-amber-300">
              {post.publishedAt}
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
              {post.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/78 sm:text-lg">
              {post.intro}
            </p>
          </div>
        </div>
      </section>

      <section className="relative bg-[linear-gradient(180deg,#f8f7f4_0%,#ffffff_18rem)]">
        <div className="mx-auto -mt-16 grid w-full max-w-6xl gap-8 px-6 pb-20 md:grid-cols-[minmax(0,1fr)_18rem]">
          <article className="relative rounded-[2rem] border border-stone-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-12">
            <div className="mb-10 h-px w-full bg-gradient-to-r from-amber-400 via-stone-200 to-transparent" />
            <RichTextContent html={post.content.html ?? ""} />
          </article>

          <aside className="md:pt-24">
            <div className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                Resumen
              </p>
              <p className="mt-4 text-sm leading-7 text-stone-700">
                {post.intro}
              </p>

              <div className="mt-8 h-px w-full bg-stone-200" />

              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                Publicado
              </p>
              <p className="mt-3 text-sm font-medium text-stone-900">
                {post.publishedAt}
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
