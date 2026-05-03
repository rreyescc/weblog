import Link from "next/link";

type PostCardProps = {
  image: string;
  title: string;
  intro: string;
  publishedAt: string;
  href?: string;
};

export default function PostCard({
  image,
  title,
  intro,
  publishedAt,
  href,
}: PostCardProps) {
  const cardContent = (
    <>
      <div
        className="h-56 w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
        aria-hidden="true"
      />

      <div className="flex flex-1 flex-col px-5 py-5">
        <p className="text-sm text-black/55">{publishedAt}</p>
        <h3 className="mt-2 text-xl font-semibold tracking-tight text-black">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-black/70">{intro}</p>
      </div>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white transition hover:-translate-y-1 hover:shadow-lg"
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white">
      {cardContent}
    </article>
  );
}
