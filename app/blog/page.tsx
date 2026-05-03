import HeroBanner from '@/components/hero-banner';
import PostCard from '@/components/post-card';
import SectionIntro from '@/components/section-intro';
import { getPosts } from '@/features/posts/post.service';
import type { PostSummary } from '@/types/post';

export default async function Page() {
  let posts: PostSummary[] = [];

  try {
    posts = await getPosts();
  } catch (error) {
    console.warn("Failed to load posts for /blog. Rendering fallback state.", error);
  }

  return (
    <>
      <HeroBanner
        title="Blog"
        image="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
      />

      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <SectionIntro
          title="Ultimas publicaciones"
          description="Explora articulos sobre desarrollo web, diseno de interfaces y buenas practicas para construir productos digitales con una base solida."
        />

        {posts.length > 0 ? (
          <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <PostCard
                key={post.slug}
                image={post.image}
                title={post.title}
                intro={post.intro}
                publishedAt={post.publishedAt}
                href={`/blog/${post.slug}`}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-dashed border-black/15 bg-stone-50 px-6 py-12 text-center">
            <p className="text-lg font-medium text-black">
              No fue posible cargar las publicaciones.
            </p>
            <p className="mt-3 text-sm leading-6 text-black/65">
              Verifica la configuracion del CMS y las credenciales de acceso para mostrar el contenido del blog.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
