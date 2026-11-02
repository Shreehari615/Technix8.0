"use client";

import React, { useState, useEffect, useRef } from "react";
import MarvelTechnixBranding from "./MarvelTechnixBranding";
import SpiderManEntrance from "./SpiderManEntrance";
import ParticleCanvas from "./ParticleCanvas";

interface SplashScreenProps {
  onComplete?: () => void;
  speedMs?: number; // Legacy or fast transition timing
  holdDurationMs?: number; // Phase B recognition & dynamic color fill duration (default: 3000ms)
  transitionDurationMs?: number; // Phase C scale-down duration (default: 1100ms)
  showLoadingBar?: boolean;
  subtitle?: string;
  targetElementId?: string; // FLIP target anchor (default: 'hero-branding-target')
}

type IntroPhase = "init" | "loading" | "transition" | "settled" | "done";

export default function SplashScreen({
  onComplete,
  speedMs,
  holdDurationMs = 3000,
  transitionDurationMs = 1100,
  showLoadingBar = false,
  subtitle,
  targetElementId = "hero-branding-target",
}: SplashScreenProps) {
  const [phase, setPhase] = useState<IntroPhase>("init");
  const [progress, setProgress] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Transform coordinates for FLIP animation
  const [transformStyle, setTransformStyle] = useState<React.CSSProperties>({
    transform: "translate3d(0, 0, 0) scale(1)",
    opacity: 0,
  });

  const splashContainerRef = useRef<HTMLDivElement>(null);
  const brandingRef = useRef<HTMLDivElement>(null);

  // Fast route transition mode (when used from PageTransitionContext)
  const isFastTransition = Boolean(subtitle || (speedMs && speedMs < 1000));

  useEffect(() => {
    // Check prefers-reduced-motion
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setIsReducedMotion(mediaQuery.matches);
    }
  }, []);

  useEffect(() => {
    // Lock scroll during splash screen intro
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // 1. Dynamic Color Filling Progress Animation (0% to 100%)
  useEffect(() => {
    if (typeof window === "undefined" || isFastTransition) return;

    let animFrame: number;
    const startTime = Date.now();
    const fillDuration = Math.max(1000, holdDurationMs - 200);

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(1.0, elapsed / fillDuration);

      // Smooth, natural progress fill curve from bottom to top
      const eased = Math.min(100, Math.floor(Math.pow(rawProgress, 1.15) * 100));
      setProgress(eased);

      if (rawProgress < 1.0) {
        animFrame = requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
      }
    };

    animFrame = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(animFrame);
    };
  }, [holdDurationMs, isFastTransition]);

  // 2. Main Intro Sequence Coordinator & FLIP Calculation
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Fast Page Transition Fallback
    if (isFastTransition) {
      setTransformStyle({
        transform: "translate3d(0, 0, 0) scale(1)",
        opacity: 1,
        transition: "opacity 300ms ease-out",
      });
      const timer = setTimeout(() => {
        setTransformStyle((prev) => ({
          ...prev,
          opacity: 0,
          transition: "opacity 250ms ease-in",
        }));
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 250);
      }, speedMs || 500);

      return () => clearTimeout(timer);
    }

    // Function to calculate exact FLIP initial scale & destination delta
    const calculateLayout = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const targetEl = document.getElementById(targetElementId);

      if (!targetEl || !brandingRef.current) {
        return null;
      }

      const targetRect = targetEl.getBoundingClientRect();
      const brandingRect = brandingRef.current.getBoundingClientRect();

      if (targetRect.width === 0 || targetRect.height === 0) {
        return null;
      }

      // Desired initial oversized branding size: ~85-92% of viewport width
      const maxAllowedWidth = Math.min(vw * 0.90, 1180);
      const maxAllowedHeight = vh * 0.65;

      const scaleByWidth = maxAllowedWidth / (brandingRect.width || targetRect.width);
      const scaleByHeight = maxAllowedHeight / (brandingRect.height || targetRect.height);

      const initialScale = Math.max(1.0, Math.min(scaleByWidth, scaleByHeight));

      // Viewport center
      const viewportCenterX = vw / 2;
      const viewportCenterY = vh / 2;

      // Hero target center
      const targetCenterX = targetRect.left + targetRect.width / 2;
      const targetCenterY = targetRect.top + targetRect.height / 2;

      const dx = targetCenterX - viewportCenterX;
      const dy = targetCenterY - viewportCenterY;

      return {
        initialScale,
        dx,
        dy,
        targetWidth: targetRect.width,
      };
    };

    let tTransition: NodeJS.Timeout;
    let tSettle: NodeJS.Timeout;
    let tDone: NodeJS.Timeout;

    // Step 0: Initial measurement
    const layout = calculateLayout();
    const initialScale = layout ? layout.initialScale : 1.35;

    // Phase A: Initial appearance & Loading fill starts
    setPhase("loading");
    setTransformStyle({
      transform: `translate3d(0, 0, 0) scale(${initialScale})`,
      opacity: 1,
      transition: isReducedMotion
        ? "opacity 400ms ease-out"
        : "transform 450ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 400ms ease-out",
    });

    // Phase C: Dynamic scale-down transition starts after hold/loading completes
    tTransition = setTimeout(() => {
      setPhase("transition");

      if (isReducedMotion) {
        setTransformStyle((prev) => ({
          ...prev,
          opacity: 0,
          transition: "opacity 400ms ease-in",
        }));
        setTimeout(() => {
          setPhase("done");
          if (onComplete) onComplete();
        }, 400);
        return;
      }

      // Re-measure exact destination in case of layout settling
      const currentLayout = calculateLayout();
      const dx = currentLayout ? currentLayout.dx : 0;
      const dy = currentLayout ? currentLayout.dy : -120;

      // Animate from oversized scale to EXACT hero dimensions & position
      setTransformStyle({
        transform: `translate3d(${dx}px, ${dy}px, 0) scale(1)`,
        opacity: 1,
        transition: `transform ${transitionDurationMs}ms cubic-bezier(0.16, 1, 0.3, 1)`,
      });

      // Phase D: Settle and Hand-off
      tSettle = setTimeout(() => {
        setPhase("settled");

        tDone = setTimeout(() => {
          setPhase("done");
          if (onComplete) onComplete();
        }, 60);
      }, transitionDurationMs);
    }, holdDurationMs);

    return () => {
      clearTimeout(tTransition);
      clearTimeout(tSettle);
      clearTimeout(tDone);
    };
  }, [
    isFastTransition,
    holdDurationMs,
    transitionDurationMs,
    speedMs,
    targetElementId,
    onComplete,
    isReducedMotion,
  ]);

  if (phase === "done") return null;

  // Background and Spider-Man fade-out during Phase C scale-down
  const isBackdropFading = phase === "transition" || phase === "settled";

  return (
    <div
      ref={splashContainerRef}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center select-none overflow-hidden"
      aria-label="Marvel X Technix 8.0 Cinematic Intro"
      role="status"
    >
      {/* 
        CINEMATIC BACKDROP LAYER:
        - Deep black & navy tone (#04060C)
        - Ambient cosmic stardust particles
        - Marvel Red & Cyan ambient halo
        - Fades smoothly to opacity 0 during Phase C to reveal HeroSection underneath
      */}
      <div
        className={`absolute inset-0 z-0 bg-[#04060C] transition-opacity duration-900 ease-out pointer-events-none ${isBackdropFading ? "opacity-0" : "opacity-100"
          }`}
      >
        {/* Ambient Red & Violet Convergence Nebula Halo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] rounded-full bg-red-600/20 blur-[160px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-pink-600/15 blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-purple-600/15 blur-[150px] pointer-events-none" />

        {/* Ambient Cosmic Stardust Embers */}
        <ParticleCanvas />

        {/* Cinematic Multiverse Tagline (Visible during loading, fades out in Phase C) */}
        <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
          <span className="font-mono-code text-[11px] sm:text-xs tracking-[0.38em] text-slate-400 uppercase font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            THE MULTIVERSE CONVERGENCE • TECHNIX 8.0
          </span>
        </div>
      </div>

      {/* 
        SPIDER-MAN RIG LAYER (z-25):
        - Positioned with high visibility in the top-right ceiling
        - Descends from above (-110vh), bounces, and sways naturally during loading
        - Fades out smoothly when the scale-down transition begins
      */}
      {!isFastTransition && (
        <div
          className={`transition-opacity duration-900 ease-out pointer-events-none z-25 ${isBackdropFading ? "opacity-0" : "opacity-100"
            }`}
        >
          <SpiderManEntrance className="pointer-events-none absolute top-0 right-4 sm:right-8 md:right-14 lg:right-20 z-25 select-none" />
        </div>
      )}

      {/* 
        FLIP BRANDING LAYER:
        - Contains the unified MARVEL × TECHNIX 8.0 Branding
        - While loading, fills with dynamic neon hot pink color from bottom to top (progress: 0 -> 100%)
        - Holds with a theatrical light sheen sweep
        - Scales and translates down with cubic-bezier(0.16, 1, 0.3, 1) into #hero-branding-target
      */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full px-4 pointer-events-none">
        <div
          ref={brandingRef}
          style={{
            ...transformStyle,
            transformOrigin: "center center",
            willChange: "transform, opacity",
          }}
          className="w-full max-w-[480px] sm:max-w-[620px] md:max-w-[720px] lg:max-w-[780px] flex justify-center"
        >
          <MarvelTechnixBranding
            glow={true}
            mode="fill-progress"
            progress={progress}
            priority={true}
          />
        </div>

        {/* Optional Subtitle (used during route navigation transitions) */}
        {subtitle && (
          <p className="font-mono-code text-xs sm:text-sm tracking-[0.25em] text-pink-400 uppercase mt-4 animate-pulse">
            {subtitle}
          </p>
        )}

        {/* Loading Bar (only if explicitly requested) */}
        {showLoadingBar && (
          <div className="mt-6 flex flex-col items-center gap-2">
            <div className="w-56 h-[3px] bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-600 via-pink-500 to-rose-400 transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="font-mono-code text-xs text-pink-400">
              {progress}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
