"use client";

import React from "react";
import Image from "next/image";
import TechnixGraffitiLogo from "./TechnixGraffitiLogo";

interface MarvelTechnixBrandingProps {
  className?: string;
  glow?: boolean;
  showSheen?: boolean;
  priority?: boolean;
  progress?: number;
  mode?: "fill-progress" | "hero" | "nav";
}

export default function MarvelTechnixBranding({
  className = "",
  glow = true,
  priority = false,
  progress = 100,
  mode = "hero",
}: MarvelTechnixBrandingProps) {
  return (
    <div
      className={`relative flex flex-col items-center w-full select-none ${className}`}
    >
      {/* Department Banner */}
      <div className="mb-2 sm:mb-3">
        <p className="font-mono-code text-[11px] sm:text-xs md:text-sm tracking-[0.25em] sm:tracking-[0.35em] uppercase text-amber-300/90 font-bold drop-shadow-[0_2px_12px_rgba(245,158,11,0.5)]">
          DEPARTMENT OF MCA PRESENTS
        </p>
      </div>

      {/* 1. Authentic Official Marvel Red Box Logo (Appears FIRST at the top) */}
      <div className="relative w-36 sm:w-44 md:w-52 aspect-[2.22/1] rounded-sm overflow-hidden shadow-[0_0_35px_rgba(226,54,54,0.7)] ring-1 ring-red-500/50 mb-1.5 sm:mb-2 hover:scale-105 transition-transform duration-300">
        <Image
          src="/images/marvel-official-logo.png"
          alt="MARVEL"
          fill
          priority={priority}
          unoptimized
          className="object-cover"
        />
      </div>

      {/* 2. Crossover Glyph X (Centered in the middle) */}
      <div className="flex items-center justify-center my-0.5 sm:my-1">
        <span
          className="font-heading text-lg sm:text-2xl md:text-3xl font-black text-red-500 drop-shadow-[0_0_14px_#EF4444] select-none tracking-widest leading-none"
          aria-hidden="true"
        >
          ✕
        </span>
      </div>

      {/* 3. Primary TECHNIX 8.0 Graffiti Display Wordmark (Displayed underneath) */}
      <div className="w-full flex justify-center mt-1 sm:mt-2 mb-3 sm:mb-5">
        <TechnixGraffitiLogo
          mode={mode}
          progress={progress}
          glow={glow}
          className="w-full max-w-[480px] sm:max-w-[620px] md:max-w-[720px] lg:max-w-[780px] h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.95)]"
        />
      </div>
    </div>
  );
}
