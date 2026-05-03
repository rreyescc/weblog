import Link from "next/link";
import { getNavigationPages } from "@/features/pages/page.service";
import type { NavigationItem } from "@/types/page";
import NavigationMenu from "./navigation-menu";

const baseNavigationItems: NavigationItem[] = [
  { href: "/", label: "Inicio" },
  { href: "/blog", label: "Blog" },
];

export default async function Navbar() {
  const cmsNavigationItems = await getNavigationPages();
  const navigationItems = [...baseNavigationItems, ...cmsNavigationItems];

  return (
    <header className="border-b border-black/10 bg-white">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-6 py-4">
        <Link href="/" className="flex items-center gap-3 justify-self-start">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/15 bg-black text-sm font-semibold text-white">
            W
          </div>
          <span className="text-lg font-semibold tracking-tight text-black">
            Weblog
          </span>
        </Link>

        <NavigationMenu
          ariaLabel="Principal"
          items={navigationItems}
          className="flex items-center justify-center gap-8 text-sm font-medium text-black/70"
          linkClassName="transition hover:text-black"
          activeLinkClassName="text-black"
        />

        <div />
      </div>
    </header>
  );
}
