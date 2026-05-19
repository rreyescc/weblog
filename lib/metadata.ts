import { getLanguageAlternates, getLocalizedPath, type Locale } from "@/lib/i18n";
import type { Metadata } from "next";

export function getBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export function getLocalizedMetadata(locale: Locale, path: string, includeAlternates = false): Metadata {
  const canonical = getLocalizedPath(locale, path);

  return {
    metadataBase: new URL(getBaseUrl()),
    alternates: {
      canonical,
      languages: includeAlternates ? getLanguageAlternates(path) : undefined,
    },
  };
}
