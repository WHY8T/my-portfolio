import type { Metadata, Viewport } from "next";
import { Manrope, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/content/config";

import { LenisProvider } from "@/lib/lenis";
import { ThemeProvider } from "@/lib/prefs";
import { TransitionProvider } from "@/components/layout/Transition";
import Preloader from "@/components/layout/Preloader";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Cursor from "@/components/fx/Cursor";
import ShaderBackground from "@/components/fx/ShaderBackground";
import Hud from "@/components/hud/Hud";
import CommandPalette from "@/components/hud/CommandPalette";

/* ------------------------------------------------------------------ fonts */

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["italic", "normal"],
  variable: "--font-instrument",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

/* --------------------------------------------------------------- metadata */

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name.full} — ${site.role}`,
    template: `%s — ${site.name.full}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name.full} — ${site.role}`,
    description: site.description,
    url: site.url,
    siteName: site.name.full,
    images: [{ url: "/assets/portrait.png", width: 1254, height: 1254, alt: site.name.full }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name.full} — ${site.role}`,
    description: site.description,
    images: ["/assets/portrait.png"],
  },
  icons: { icon: "/assets/portfolio-logo.png" },
};

export const viewport: Viewport = {
  themeColor: "#020d05",
  colorScheme: "dark light",
};

/* ----------------------------------------------------------------- layout */

const themeScript = `
try {
  var t = localStorage.getItem('theme');
  if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
} catch (e) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${manrope.variable} ${instrument.variable} ${jetbrains.variable} antialiased`}
      >
        <ThemeProvider>
          <LenisProvider>
            <TransitionProvider>
              <ShaderBackground />
              <div className="scanlines-overlay" aria-hidden="true" />
              <div className="grain-overlay" aria-hidden="true" />
              <div className="cursor-spotlight" aria-hidden="true" />

              <Preloader />
              <Header />
              <Hud />

              <main id="main" className="relative z-10">
                {children}
              </main>
              <Footer />

              <Cursor />
              <CommandPalette />
            </TransitionProvider>
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
