import type { Metadata } from "next";
import Footer from "../components/layout/footer";
import Navbar from "../components/layout/navbar";
import ThemeProvider from "../providers/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Weblog",
  description: "Blog con CMS Headless",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
