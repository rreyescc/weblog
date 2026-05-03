import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center px-6 py-20">
      <div className="text-center">
        <p className="text-[8rem] font-bold leading-none tracking-tight text-stone-200 sm:text-[10rem]">
          404
        </p>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
          Página no encontrada
        </h1>
        <p className="mt-4 max-w-md text-base leading-7 text-stone-600">
          La página que buscas no existe o ha sido movida a otra ubicación.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-amber-600"
        >
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}