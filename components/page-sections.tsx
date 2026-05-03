import RichTextContent from "@/components/rich-text-content";
import type { HeroSection, RichTextSection } from "@/types/cms/page";

function getImageUrl(image: HeroSection["backgroundImage"]): string | undefined {
  if (!image) {
    return undefined;
  }

  if (image._publishUrl || image._dynamicUrl || image._authorUrl) {
    return image._publishUrl ?? image._dynamicUrl ?? image._authorUrl;
  }

  return image._path && process.env.CMS_HOST ? `${process.env.CMS_HOST}${image._path}` : image._path;
}

function HeroSectionBlock({ section }: { section: HeroSection }) {
  const image = getImageUrl(section.backgroundImage);

  return (
    <section
      className="relative isolate overflow-hidden bg-stone-950"
      style={image ? { backgroundImage: `url(${image})` } : undefined}
    >
      <div className="absolute inset-0 bg-stone-950/70" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-gradient-to-br from-stone-950 via-stone-900/65 to-amber-950/55"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-[420px] w-full max-w-6xl flex-col justify-end px-6 py-16 sm:py-20">
        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
          {section.title}
        </h1>
        {section.subtitle?.html ? (
          <div className="mt-6 max-w-2xl text-base leading-7 text-white/78 sm:text-lg">
            <RichTextContent html={section.subtitle.html} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

function RichTextSectionBlock({ section }: { section: RichTextSection }) {
  return (
    <section className="bg-white px-6 py-14 sm:py-18">
      <article className="mx-auto w-full max-w-4xl">
        <h2 className="text-3xl font-semibold tracking-tight text-stone-950">{section.title}</h2>
        <RichTextContent html={section.body?.html ?? ""} />
      </article>
    </section>
  );
}

export default function PageSections({ sections }: { sections: (HeroSection | RichTextSection)[] }) {
  const heroSection = sections.find((section) => section.__typename === "HerosectionModel") as
    | HeroSection
    | undefined;
  const richTextSections = sections.filter(
    (section) => section.__typename === "RichtextsectionModel",
  ) as RichTextSection[];

  return (
    <>
      {heroSection ? <HeroSectionBlock section={heroSection} /> : null}
      {richTextSections.map((section, index) => (
        <RichTextSectionBlock key={`${section.title}-${index}`} section={section} />
      ))}
    </>
  );
}
