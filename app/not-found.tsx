import Link from "next/link";
import { DEFAULT_LOCALE, getDictionary, getHomeHref, isLocale, type Locale } from "@/lib/i18n";
import { headers } from "next/headers";

async function getRequestLocale(): Promise<Locale> {
  const locale = (await headers()).get("x-weblog-locale");
  return locale && isLocale(locale) ? locale : DEFAULT_LOCALE;
}

export default async function NotFound() {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);

  return (
    <section className="flex min-h-[60vh] items-center justify-center px-6 py-20">
      <div className="text-center">
        <p className="text-[8rem] font-bold leading-none tracking-tight text-stone-200 sm:text-[10rem]">
          404
        </p>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
          {dictionary.errors.notFoundTitle}
        </h1>
        <p className="mt-4 max-w-md text-base leading-7 text-stone-600">
          {dictionary.errors.notFoundDescription}
        </p>
        <Link
          href={getHomeHref(locale)}
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-amber-600"
        >
          {dictionary.errors.backHome}
        </Link>
      </div>
    </section>
  );
}
