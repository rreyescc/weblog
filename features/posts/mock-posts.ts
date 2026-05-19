import type { PostDetail, PostSummary } from "@/types/post";
import type { Locale } from "@/lib/i18n";

const MOCK_POSTS: PostDetail[] = [
  {
    slug: "arquitectura-frontend-moderna",
    translationKey: "modern-frontend-architecture",
    title: "Arquitectura frontend moderna con Next.js",
    intro:
      "Una guia practica para organizar rutas, componentes y fuentes de datos en una aplicacion de blog con App Router.",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop",
    publishedAt: "2026-04-20",
    content: {
      html: `
        <p>Este articulo mock permite trabajar en la experiencia del blog sin depender de AEM Headless local.</p>
        <h2>Separar la fuente de datos de la UI</h2>
        <p>La pagina puede renderizar tarjetas, heroes y contenido enriquecido mientras el CMS real no esta disponible.</p>
        <p>Cuando desactives <strong>USE_MOCK_CMS</strong>, la aplicacion volvera a consultar el endpoint GraphQL configurado.</p>
      `,
      plaintext:
        "Este articulo mock permite trabajar en la experiencia del blog sin depender de AEM Headless local.",
    },
  },
  {
    slug: "isr-revalidacion-contenido",
    translationKey: "isr-content-revalidation",
    title: "ISR y revalidacion de contenido",
    intro:
      "Como combinar generacion estatica, cache tags y webhooks para mantener un blog rapido y actualizado.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop",
    publishedAt: "2026-04-24",
    content: {
      html: `
        <p>ISR ayuda a servir paginas rapidas sin perder la capacidad de actualizar contenido bajo demanda.</p>
        <h2>Cache tags por lista y detalle</h2>
        <p>Una lista puede invalidarse con <strong>posts:list</strong>, mientras que cada detalle usa un tag como <strong>post:slug</strong>.</p>
        <blockquote>El mock local es solo una herramienta de desarrollo; el build productivo debe validar que el CMS responda.</blockquote>
      `,
      plaintext:
        "ISR ayuda a servir paginas rapidas sin perder la capacidad de actualizar contenido bajo demanda.",
    },
  },
  {
    slug: "headless-cms-local",
    title: "Trabajar con un CMS Headless local",
    intro:
      "Patrones utiles para desarrollar una interfaz desacoplada aun cuando el servicio de contenido no esta levantado.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop",
    publishedAt: "2026-04-28",
    content: {
      html: `
        <p>Cuando el CMS local no esta disponible, los fixtures permiten seguir iterando sobre la interfaz.</p>
        <h2>Produccion debe ser estricta</h2>
        <p>En entornos productivos conviene fallar temprano si la fuente de contenido no responde durante el build.</p>
      `,
      plaintext:
        "Cuando el CMS local no esta disponible, los fixtures permiten seguir iterando sobre la interfaz.",
    },
  },
];

const MOCK_POSTS_BY_LOCALE: Record<Locale, PostDetail[]> = {
  es: MOCK_POSTS,
  en: [
    {
      slug: "modern-frontend-architecture",
      translationKey: "modern-frontend-architecture",
      title: "Modern frontend architecture with Next.js",
      intro:
        "A practical guide to organizing routes, components, and data sources in an App Router blog.",
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop",
      publishedAt: "2026-04-20",
      content: {
        html: `
          <p>This mock article lets you work on the blog experience without depending on a local AEM Headless instance.</p>
          <h2>Separate data sources from UI</h2>
          <p>The page can render cards, heroes, and rich content while the real CMS is unavailable.</p>
        `,
        plaintext:
          "This mock article lets you work on the blog experience without depending on a local AEM Headless instance.",
      },
    },
    {
      slug: "isr-content-revalidation",
      translationKey: "isr-content-revalidation",
      title: "ISR and content revalidation",
      intro:
        "How to combine static generation, cache tags, and webhooks to keep a blog fast and up to date.",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop",
      publishedAt: "2026-04-24",
      content: {
        html: `
          <p>ISR helps serve fast pages without losing the ability to update content on demand.</p>
          <h2>Cache tags for lists and details</h2>
          <p>A list can be invalidated with locale-specific tags, while each detail uses a tag with locale and slug.</p>
        `,
        plaintext:
          "ISR helps serve fast pages without losing the ability to update content on demand.",
      },
    },
  ],
};

export function isMockCmsEnabled() {
  return process.env.NODE_ENV !== "production" && process.env.USE_MOCK_CMS === "true";
}

export function getMockPosts(locale: Locale): PostSummary[] {
  return MOCK_POSTS_BY_LOCALE[locale].map((post) => ({
    slug: post.slug,
    translationKey: post.translationKey,
    title: post.title,
    intro: post.intro,
    image: post.image,
    publishedAt: post.publishedAt,
  }));
}

export function getMockPostBySlug(slug: string, locale: Locale): PostDetail | undefined {
  return MOCK_POSTS_BY_LOCALE[locale].find((post) => post.slug === slug);
}
