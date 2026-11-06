import type { Metadata, Viewport } from "next";
import { Inter, Rajdhani, Orbitron, Space_Mono, Bangers } from "next/font/google";
import "./globals.css";
import { festConfig } from "@/data/festConfig";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  weight: ["600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const bangers = Bangers({
  variable: "--font-bangers",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#05070B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://technix8.vercel.app"),
  title: `${festConfig.name} — ${festConfig.tagline}`,
  description: `${festConfig.name} is the premier intercollegiate technical & cultural fest inspired by the Marvel Cinematic Universe. 9 Galactic events, tech hackathons, esports, and stage showdowns. Assemble. Innovate. Conquer.`,
  keywords: [
    "Technix 8.0",
    "Technix Fest",
    "College Fest",
    "Technical Fest",
    "Marvel Fest",
    "Coding Contest",
    "Hackathon",
    "Gaming Arena",
    "Cultural Fest",
  ],
  authors: [{ name: "Technix 8.0 Organizing Committee" }],
  openGraph: {
    title: `${festConfig.name} | ${festConfig.tagline}`,
    description: festConfig.heroCopy,
    type: "website",
    locale: "en_US",
    siteName: festConfig.name,
    images: [
      {
        url: "/images/hero/hero-bg.svg",
        width: 1920,
        height: 1080,
        alt: `${festConfig.name} Cinematic Superhero Ensemble`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${festConfig.name} | ${festConfig.supportingTagline}`,
    description: festConfig.heroCopy,
    images: ["/images/hero/hero-bg.svg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/images/bmsit-logo-clean.png", type: "image/png" },
    ],
    apple: "/images/bmsit-logo-clean.png",
    shortcut: "/images/bmsit-logo-clean.png",
  },
};

import { PageTransitionProvider } from "@/components/PageTransitionContext";
import SubpageBackground from "@/components/SubpageBackground";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${rajdhani.variable} ${orbitron.variable} ${spaceMono.variable} ${bangers.variable} dark`}
    >
      <body className="min-h-screen bg-transparent text-slate-100 font-sans antialiased selection:bg-pink-600 selection:text-white overflow-x-hidden relative">
        <PageTransitionProvider>
          <SubpageBackground />
          {children}
        </PageTransitionProvider>
      </body>
    </html>
  );
}
