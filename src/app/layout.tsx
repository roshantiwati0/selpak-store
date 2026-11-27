import type { Metadata, Viewport } from "next";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/Toaster";
import { SITE } from "@/lib/config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — Tissue & hygiene for your home`, template: `%s — ${SITE.name}` },
  description: SITE.description,
  openGraph: { siteName: SITE.name, type: "website", locale: "en_IN" },
};

export const viewport: Viewport = { themeColor: "#0B2154" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN">
      <body>
        <a href="#main" className="sr-only">
          Skip to content
        </a>
        <Header />
        <div id="main">{children}</div>
        <Footer />
        <BottomNav />
        <Toaster />
      </body>
    </html>
  );
}
