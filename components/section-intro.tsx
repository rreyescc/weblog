type SectionIntroProps = {
  title: string;
  description: string;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

export default function SectionIntro({
  title,
  description,
  className = "",
  titleClassName = "",
  descriptionClassName = "",
}: SectionIntroProps) {
  return (
    <div className={className}>
      <h2
        className={`text-3xl font-semibold tracking-tight text-black ${titleClassName}`.trim()}
      >
        {title}
      </h2>
      <p
        className={`mt-4 max-w-3xl text-base leading-7 text-black/70 ${descriptionClassName}`.trim()}
      >
        {description}
      </p>
    </div>
  );
}
