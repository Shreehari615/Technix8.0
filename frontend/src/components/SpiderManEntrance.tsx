"use client";

import React from "react";
import Image from "next/image";

interface SpiderManEntranceProps {
  className?: string;
}

export default function SpiderManEntrance({
  className = "pointer-events-none absolute top-0 right-4 sm:right-8 md:right-14 lg:right-20 z-20 select-none",
}: SpiderManEntranceProps) {
  return (
    <div
      className={className}
      aria-hidden="true"
    >
      {/* 
        Spider-Man Rig:
        - Anchored at top ceiling (transform-origin: 50% 0px)
        - Descends smoothly from above (-110vh) with authentic bungee bounce & settle
        - Once settled, gently sways in a subtle, natural pendulum motion
        - Both hands firmly hold the web line (hand shake/wave overlay removed)
      */}
      <div className="relative spiderman-rig">
        {/* Continuous Web Line extending upwards from Spider-Man's hands into the ceiling */}
        <div
          className="absolute bottom-[calc(100%-35px)] left-1/2 -translate-x-1/2 w-[2px] h-[160vh] bg-gradient-to-t from-white via-slate-200/90 to-white/70 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          style={{ transformOrigin: "bottom center" }}
        />

        {/* Spider-Man Hanging Character (Large & High-Visibility) */}
        <div className="relative w-44 sm:w-56 md:w-64 lg:w-72 h-auto pt-2">
          {/* Main Hanging Spider-Man (Holding web with both hands, zero distortion) */}
          <Image
            src="/images/technix/spiderman-hanging.webp"
            alt="Spider-Man Hanging Upside Down"
            width={372}
            height={671}
            priority
            unoptimized
            className="w-full h-auto drop-shadow-[0_15px_35px_rgba(0,0,0,0.85)] filter"
          />
        </div>
      </div>

      <style jsx>{`
        /* Top anchor origin for pendulum swing physics */
        .spiderman-rig {
          transform-origin: 50% 0px;
          animation:
            spidermanDescend 1.35s cubic-bezier(0.22, 1, 0.36, 1) forwards,
            spidermanSwing 3.6s ease-in-out 1.35s infinite alternate;
        }

        /* 1. Descent with natural bungee bounce & settle */
        @keyframes spidermanDescend {
          0% {
            transform: translateY(-110vh);
          }
          64% {
            transform: translateY(22px);
          }
          78% {
            transform: translateY(-10px);
          }
          89% {
            transform: translateY(4px);
          }
          100% {
            transform: translateY(0);
          }
        }

        /* 2. Gentle, subtle pendulum swing */
        @keyframes spidermanSwing {
          0% {
            transform: rotate(-2.5deg);
          }
          100% {
            transform: rotate(2.5deg);
          }
        }

        /* Respect prefers-reduced-motion */
        @media (prefers-reduced-motion: reduce) {
          .spiderman-rig {
            animation: none !important;
            transform: translateY(0) !important;
          }
        }
      `}</style>
    </div>
  );
}
