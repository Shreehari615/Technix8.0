"use client";

import React from "react";
import Image from "next/image";
import MarvelTechnixBranding from "./MarvelTechnixBranding";
import ParticleCanvas from "./ParticleCanvas";
import CountdownTimer from "./CountdownTimer";
import { usePageTransition } from "./PageTransitionContext";
import { festConfig } from "@/data/festConfig";

interface HeroSectionProps {
  onReplaySplash?: () => void;
  isSplashActive?: boolean;
}

export default function HeroSection({
  isSplashActive = false,
}: HeroSectionProps) {
  const { navigateTo } = usePageTransition();

  const handleOpenEvents = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    navigateTo("/events", "OPENING EVENTS ARENA...");
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-12 px-4 overflow-hidden bg-[#04060C]"
    >
      {/* Marvel Convergence Dimensional Arena Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/marvel-convergence-hero.jpg"
          alt="Marvel Multiverse Convergence Technix 8.0"
          fill
          priority
          unoptimized
          className="object-cover object-center select-none scale-100"
        />

        {/* Cinematic Vignettes: Transparent Center to Highlight Cosmic Rift */}
        {/* 1. Top Header Shade for Crystal-Clear Navbar Navigation */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#04060C] via-[#04060C]/65 to-transparent pointer-events-none" />

        {/* 2. Soft Radial Center Vignette for Typography Separation */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#04060C]/15 to-[#04060C]/60 pointer-events-none" />

        {/* 3. Bottom Horizon Shade for Smooth Action Controls Blend */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#04060C] via-[#04060C]/75 to-transparent pointer-events-none" />
      </div>

      {/* Floating Stardust & Cosmic Embers */}
      <ParticleCanvas />

      {/* Hero Content Container (Framed in the Center Space Rift) */}
      <div className="relative z-20 max-w-5xl mx-auto flex flex-col items-center text-center my-auto pt-4 sm:pt-8 w-full">
        {/* FLIP Destination Anchor: MARVEL × TECHNIX 8.0 Branding */}
        <div
          id="hero-branding-target"
          className={`w-full flex justify-center transition-opacity duration-300 ${isSplashActive
              ? "opacity-0 pointer-events-none select-none"
              : "opacity-100"
            }`}
        >
          <MarvelTechnixBranding priority />
        </div>

        {/* Primary Subtitle: tagline */}
        <h2 className="font-sans text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-wide text-white mb-2 drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]">
          {festConfig.tagline}
        </h2>

        {/* Fest Dates & Location */}
        <p className="font-mono-code text-xs sm:text-sm tracking-[0.3em] uppercase text-amber-200/90 font-medium mb-1.5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
          NOVEMBER 23 – 24, 2026
        </p>
        <a
          href={festConfig.institution.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono-code text-[11px] sm:text-xs tracking-[0.22em] uppercase text-slate-300 font-semibold mb-5 sm:mb-6 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] hover:text-amber-300 transition-colors inline-flex items-center gap-1.5"
        >
          <span>📍</span>
          BMSITM, YELAHANKA, BENGALURU
        </a>

        {/* Live Launch Countdown (Replacing 'TECHNIX NOT LIVE NOW') */}
        <div className="w-full max-w-xl mx-auto flex flex-col items-center">
          <CountdownTimer
            variant="hero"
            onActionClick={() => handleOpenEvents()}
          />
        </div>
      </div>
    </section>
  );
}
