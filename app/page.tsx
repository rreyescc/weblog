import HeroBanner from "@/components/hero-banner";
import SectionIntro from "@/components/section-intro";

const sectionIntroProps = {
  title: "Bienvenido a Weblog",
  description: "Explora artículos, ideas y recursos sobre tecnología, diseño y desarrollo."
}

export default function Page () {
  return (
    <>
      <HeroBanner title="Inicio" />
      <SectionIntro {...sectionIntroProps} className="p-10" />
    </>
  )
}