type HeroBannerProps = {
  image?: string;
  title: string;
};

export default function HeroBanner({ image, title }: HeroBannerProps) {
  return (
    <section
      className="relative isolate overflow-hidden"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/60" aria-hidden="true" />

      <div className="relative mx-auto flex min-h-[420px] w-full max-w-6xl items-end px-6 py-16">
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
          {title}
        </h1>
      </div>
    </section>
  );
}
