import type { NavigationItem } from "@/types/page";

export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "es";
export const LOCALE_PREFIXES: Record<Locale, string> = {
  es: "",
  en: "/en",
};

type ContentType = "posts" | "pages";

export const dictionaries = {
  es: {
    navigation: {
      home: "Inicio",
      blog: "Blog",
      principal: "Principal",
      footer: "Footer",
    },
    blog: {
      title: "Blog",
      latestPosts: "Ultimas publicaciones",
      description:
        "Explora articulos sobre desarrollo web, diseno de interfaces y buenas practicas para construir productos digitales con una base solida.",
      loadErrorTitle: "No fue posible cargar las publicaciones.",
      loadErrorDescription:
        "Verifica la configuracion del CMS y las credenciales de acceso para mostrar el contenido del blog.",
    },
    post: {
      backToBlog: "Volver al blog",
      summary: "Resumen",
      published: "Publicado",
    },
    errors: {
      notFoundTitle: "Pagina no encontrada",
      notFoundDescription: "La pagina que buscas no existe o ha sido movida a otra ubicacion.",
      backHome: "Volver al inicio",
      genericTitle: "Algo salio mal",
      genericDescription: "Ha ocurrido un error inesperado. Por favor, intenta nuevamente.",
      retry: "Intentar de nuevo",
    },
    language: {
      label: "Idioma",
      es: "ES",
      en: "EN",
    },
  },
  en: {
    navigation: {
      home: "Home",
      blog: "Blog",
      principal: "Main",
      footer: "Footer",
    },
    blog: {
      title: "Blog",
      latestPosts: "Latest posts",
      description:
        "Explore articles about web development, interface design, and good practices for building digital products on a solid foundation.",
      loadErrorTitle: "Posts could not be loaded.",
      loadErrorDescription:
        "Check the CMS configuration and access credentials to display blog content.",
    },
    post: {
      backToBlog: "Back to blog",
      summary: "Summary",
      published: "Published",
    },
    errors: {
      notFoundTitle: "Page not found",
      notFoundDescription: "The page you are looking for does not exist or has moved.",
      backHome: "Back to home",
      genericTitle: "Something went wrong",
      genericDescription: "An unexpected error occurred. Please try again.",
      retry: "Try again",
    },
    language: {
      label: "Language",
      es: "ES",
      en: "EN",
    },
  },
} as const;

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}

export function getLocalePrefix(locale: Locale) {
  return LOCALE_PREFIXES[locale];
}

export function getLocalizedPath(locale: Locale, path: string) {
  const normalizedPath = normalizePublicPath(path);
  const prefix = getLocalePrefix(locale);

  if (normalizedPath === "/") {
    return prefix || "/";
  }

  return `${prefix}${normalizedPath}`;
}

export function getHomeHref(locale: Locale) {
  return getLocalizedPath(locale, "/");
}

export function getBlogHref(locale: Locale) {
  return getLocalizedPath(locale, "/blog");
}

export function getPostHref(locale: Locale, slug: string) {
  return getLocalizedPath(locale, `/blog/${slug}`);
}

export function getDynamicPageHref(locale: Locale, path: string) {
  return getLocalizedPath(locale, path);
}

export function getLocalizedNavigationItem(locale: Locale, item: NavigationItem): NavigationItem {
  return {
    ...item,
    href: getDynamicPageHref(locale, item.href),
  };
}

export function getLocaleFromPathname(pathname: string): Locale {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  return firstSegment && isLocale(firstSegment) ? firstSegment : DEFAULT_LOCALE;
}

export function stripLocaleFromPath(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments[0] && isLocale(segments[0])) {
    const path = segments.slice(1).join("/");
    return path ? `/${path}` : "/";
  }

  return normalizePublicPath(pathname);
}

export function normalizePublicPath(path: string) {
  const trimmedPath = path.trim();

  if (!trimmedPath || trimmedPath === "/") {
    return "/";
  }

  return trimmedPath.startsWith("/") ? trimmedPath : `/${trimmedPath}`;
}

export function getCmsContentRoot(locale: Locale, type: ContentType) {
  return `/content/dam/weblog/${locale}/${type}`;
}

export function getLanguageAlternates(path: string) {
  return {
    es: getLocalizedPath("es", path),
    en: getLocalizedPath("en", path),
  };
}

export function getLanguageSwitcherHref(currentLocale: Locale, targetLocale: Locale, path: string) {
  const normalizedPath = normalizePublicPath(path);

  if (normalizedPath === "/" || normalizedPath === "/blog") {
    return getLocalizedPath(targetLocale, normalizedPath);
  }

  if (normalizedPath.startsWith("/blog/")) {
    return getBlogHref(targetLocale);
  }

  return getHomeHref(targetLocale);
}

export function getOtherLocale(locale: Locale): Locale {
  return locale === "es" ? "en" : "es";
}
