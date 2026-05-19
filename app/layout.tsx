import type { Metadata } from "next";
import Footer from "../components/layout/footer";
import Navbar from "../components/layout/navbar";
import ThemeProvider from "../providers/theme-provider";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n";
import { headers } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Weblog",
  description: "Blog con CMS Headless",
};

async function getRequestLocale(): Promise<Locale> {
  const locale = (await headers()).get("x-weblog-locale");
  return locale && isLocale(locale) ? locale : DEFAULT_LOCALE;
}

async function getRequestPathname(): Promise<string> {
  return (await headers()).get("x-weblog-pathname") ?? "/";
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();
  const pathname = await getRequestPathname();

  return (
    <html lang={locale} className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <Navbar locale={locale} pathname={pathname} />
          <main className="flex-1">{children}</main>
          <Footer locale={locale} />
        </ThemeProvider>
      </body>
    </html>
  );
}
