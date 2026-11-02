"use client";

import React, { useId } from "react";

interface TechnixGraffitiLogoProps {
  progress?: number; // 0 to 100
  mode?: "fill-progress" | "hero" | "nav";
  className?: string;
  glow?: boolean;
}

// Precision Chiseled Graffiti Paths matching "Falak 26" Display Street-Art Aesthetic
// Row 1: TECHNIX (y: 20 to 154)
// Row 2: 8 . 0    (y: 158 to 268)
const GRAFFITI_PATHS = {
  // T: Wide flared top bar with chiseled angled tips and chiseled vertical stem
  T: "M 34,42 L 76,26 L 126,34 L 118,58 L 94,56 L 90,140 L 52,144 L 56,58 L 34,64 Z",

  // E: Heavy faceted block with sharp triangular notches and chiseled arms
  E: "M 124,34 L 198,30 L 186,58 L 156,58 L 154,78 L 184,82 L 176,106 L 154,102 L 152,122 L 202,118 L 190,144 L 120,144 L 126,88 L 118,84 Z",

  // C: Aggressive chiseled C with sharp upper & lower jaws and angular interior spine
  C: "M 280,38 L 238,24 L 198,42 L 190,88 L 198,92 L 188,136 L 212,146 L 260,148 L 288,130 L 268,110 L 238,122 L 224,88 L 240,56 L 264,58 Z",

  // H: Double upright pillars linked by a sharp diagonal slash crossbar
  H: "M 282,30 L 312,28 L 310,76 L 344,84 L 346,32 L 378,30 L 372,144 L 342,142 L 344,106 L 310,98 L 308,144 L 278,140 L 282,88 L 276,82 Z",

  // N: Razor-sharp solid N with powerful diagonal slash
  N: "M 378,142 L 380,30 L 410,28 L 444,92 L 446,30 L 476,28 L 472,144 L 444,146 L 410,84 L 408,142 Z",

  // I: Chiseled monolithic pillar with jagged angled notches
  I: "M 488,30 L 528,32 L 522,76 L 510,84 L 522,94 L 516,144 L 482,140 L 486,94 L 498,86 L 488,76 Z",

  // X: THE SIGNATURE PIECE - Giant razor-sharp dagger blades flaring outward (matching the K in Falak)
  X: "M 534,34 L 570,36 L 602,82 L 648,18 L 696,28 L 628,96 L 702,156 L 656,158 L 600,108 L 562,154 L 522,144 L 576,94 Z",

  // 8: Chiseled dual stacked polygon rings with triangular inner negative cutouts
  EIGHT:
    "M 244,160 L 280,160 L 304,176 L 292,204 L 318,226 L 304,262 L 270,266 L 234,266 L 202,256 L 190,224 L 218,202 L 206,174 Z M 256,174 L 276,194 L 236,194 Z M 256,250 L 232,218 L 280,218 Z",

  // . (Dot): Chiseled diamond polygon dot
  DOT: "M 364,232 L 388,250 L 364,268 L 340,250 Z",

  // 0: Hexagonal chiseled block with sharp diamond cutout (matching the 6 in Falak 26)
  ZERO:
    "M 454,160 L 490,160 L 524,180 L 532,212 L 522,218 L 530,244 L 508,266 L 484,268 L 450,268 L 418,260 L 408,236 L 418,212 L 410,182 Z M 470,182 L 496,212 L 494,242 L 470,250 L 446,240 L 444,212 Z",
};

// Render the handcrafted vector typography elements
const TypographyGroup = ({
  fillStyle,
  uniqueId,
}: {
  fillStyle?: string;
  uniqueId?: string;
}) => (
  <g
    id={uniqueId ? `typo-${uniqueId}` : undefined}
    fill={fillStyle || "currentColor"}
    stroke="#060913"
    strokeWidth="7"
    strokeLinejoin="round"
    strokeLinecap="round"
    fillRule="evenodd"
    paintOrder="stroke fill"
  >
    {/* ROW 1: "TECHNIX" */}
    <path d={GRAFFITI_PATHS.T} />
    <path d={GRAFFITI_PATHS.E} />
    <path d={GRAFFITI_PATHS.C} />
    <path d={GRAFFITI_PATHS.H} />
    <path d={GRAFFITI_PATHS.N} />
    <path d={GRAFFITI_PATHS.I} />
    <path d={GRAFFITI_PATHS.X} />

    {/* ROW 2: "8.0" (Centered below TECHNIX) */}
    <path d={GRAFFITI_PATHS.EIGHT} />
    <path d={GRAFFITI_PATHS.DOT} />
    <path d={GRAFFITI_PATHS.ZERO} />
  </g>
);

export default function TechnixGraffitiLogo({
  progress = 100,
  mode = "hero",
  className = "w-full max-w-2xl h-auto",
  glow = true,
}: TechnixGraffitiLogoProps) {
  const uniqueId = useId().replace(/:/g, "_");
  const clipId = `tech-clip-${uniqueId}`;
  const glowId = `tech-glow-${uniqueId}`;

  const clampedProgress = Math.min(100, Math.max(0, progress));
  // Total viewBox height is 280. Fills from bottom (y=280) to top (y=0)
  const fillY = 280 - (clampedProgress / 100) * 280;

  // HERO MODE: Solid Brilliant White with clean outline & crisp black depth shadow (no colored side haze)
  if (mode === "hero") {
    return (
      <svg
        viewBox="0 0 740 280"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="6"
              stdDeviation="8"
              floodColor="#000000"
              floodOpacity="0.9"
            />
          </filter>
        </defs>
        <g filter={glow ? `url(#${glowId})` : undefined}>
          <TypographyGroup fillStyle="#FFFFFF" uniqueId={uniqueId} />
        </g>
      </svg>
    );
  }

  // NAV MODE: Crisp compact
  if (mode === "nav") {
    return (
      <svg
        viewBox="0 0 740 280"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <TypographyGroup fillStyle="#FFFFFF" uniqueId={uniqueId} />
      </svg>
    );
  }

  // DYNAMIC FILL PROGRESS MODE:
  // Base concrete grey underneath, filled with neon hot pink from bottom to top!
  return (
    <div className="relative inline-block w-full">
      <svg
        viewBox="0 0 740 280"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Dynamic rising clip rect */}
          <clipPath id={clipId}>
            <rect
              x="0"
              y={fillY}
              width="740"
              height={280 - fillY + 10}
              className="transition-[y,height] duration-100 ease-out"
            />
          </clipPath>

          {/* Liquid gradient fill in neon hot pink */}
          <linearGradient
            id={`pinkGrad-${uniqueId}`}
            x1="0%"
            y1="100%"
            x2="0%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#E60067" />
            <stop offset="60%" stopColor="#FF1E82" />
            <stop offset="100%" stopColor="#FF4F9E" />
          </linearGradient>

          {/* Grey base unfilled */}
          <linearGradient
            id={`greyGrad-${uniqueId}`}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>

          {/* Glow for waterline and text */}
          <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="6"
              floodColor="#FF1E82"
              floodOpacity="0.9"
            />
            <feDropShadow
              dx="0"
              dy="6"
              stdDeviation="12"
              floodColor="#000000"
              floodOpacity="0.95"
            />
          </filter>
        </defs>

        {/* 1. Base Unfilled Concrete Grey Layer */}
        <TypographyGroup
          fillStyle={`url(#greyGrad-${uniqueId})`}
          uniqueId={uniqueId}
        />

        {/* 2. Vibrant Hot Pink Filled Layer (Clipped to current progress) */}
        <g clipPath={`url(#${clipId})`}>
          <TypographyGroup
            fillStyle={`url(#pinkGrad-${uniqueId})`}
            uniqueId={uniqueId}
          />
        </g>

        {/* 3. Horizontal Liquid Waterline Edge */}
        {clampedProgress > 2 && clampedProgress < 98 && (
          <line
            x1="30"
            y1={fillY}
            x2="710"
            y2={fillY}
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeOpacity="0.9"
            filter={glow ? `url(#${glowId})` : undefined}
            className="transition-[y1,y2] duration-100 ease-out"
          />
        )}
      </svg>
    </div>
  );
}
