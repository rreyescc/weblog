"use client";

import { useEffect } from "react";
import { getDictionary, getLocaleFromPathname } from "@/lib/i18n";
import { usePathname } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const dictionary = getDictionary(getLocaleFromPathname(pathname));

  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <section className="flex min-h-[60vh] items-center justify-center px-6 py-20">
      <div className="text-center">
        <p className="text-[8rem] font-bold leading-none tracking-tight text-red-100 sm:text-[10rem]">
          !
        </p>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
          {dictionary.errors.genericTitle}
        </h1>
        <p className="mt-4 max-w-md text-base leading-7 text-stone-600">
          {dictionary.errors.genericDescription}
        </p>
        <button
          onClick={reset}
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-amber-600"
        >
          {dictionary.errors.retry}
        </button>
      </div>
    </section>
  );
}
