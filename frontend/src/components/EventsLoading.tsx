"use client";

import React, { useEffect, useRef, useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface EventsLoadingProps {
  onRetry?: () => void;
  error?: string | null;
  className?: string;
  isFadingOut?: boolean;
}

export default function EventsLoading({
  onRetry,
  error = null,
  className = "",
  isFadingOut = false,
}: EventsLoadingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setIsReducedMotion(mediaQuery.matches);
    }
  }, []);

  // Golden Spark Vortex Canvas 2D Particle Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isReducedMotion) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let centerX = 0;
    let centerY = 0;
    let radius = 130;
    let dpr = 1;

    const handleResize = () => {
      dpr = window.devicePixelRatio || 1;
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      ctx.scale(dpr, dpr);

      centerX = width / 2;
      centerY = height / 2;

      // Responsive ring radius: 95px on mobile, up to 160px on desktop
      const dynamicRadius = Math.min(width, height) * 0.22;
      radius = Math.max(95, Math.min(160, dynamicRadius));
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Particle Data Structure (Zero GC allocation in main loop)
    class Spark {
      isCore: boolean;
      angle: number;
      dist: number;
      x: number;
      y: number;
      prevX: number;
      prevY: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      age: number;
      size: number;
      angularSpeed: number;

      constructor(isCore = false) {
        this.isCore = isCore;
        this.angle = 0;
        this.dist = 0;
        this.x = 0;
        this.y = 0;
        this.prevX = 0;
        this.prevY = 0;
        this.vx = 0;
        this.vy = 0;
        this.life = 0;
        this.maxLife = 1;
        this.age = 0;
        this.size = 1;
        this.angularSpeed = 0;
        this.reset(isCore);
      }

      reset(isCore = false) {
        this.isCore = isCore;
        this.angle = Math.random() * Math.PI * 2;
        // Ring radius with organic radial jitter
        this.dist = radius + (Math.random() - 0.5) * (isCore ? 12 : 8);

        this.x = centerX + Math.cos(this.angle) * this.dist;
        this.y = centerY + Math.sin(this.angle) * this.dist;
        this.prevX = this.x;
        this.prevY = this.y;

        // Tangential velocity around circular vortex (counter-clockwise)
        const tangentAngle = this.angle + Math.PI / 2;
        this.angularSpeed = 7.5 + Math.random() * 4.5;

        if (this.isCore) {
          // Core sparks hug the perimeter
          const speed = 6 + Math.random() * 4;
          this.vx = Math.cos(tangentAngle) * speed;
          this.vy = Math.sin(tangentAngle) * speed;
          this.life = 0.18 + Math.random() * 0.25;
          this.size = 1.2 + Math.random() * 1.6;
        } else {
          // Tangential ejection sparks fling outwards like real grinding sparks
          const burstSpeed = 8 + Math.random() * 14;
          // Flare angle slightly outward from tangent
          const flareAngle = tangentAngle + (Math.random() - 0.25) * 0.6;
          this.vx = Math.cos(flareAngle) * burstSpeed;
          this.vy = Math.sin(flareAngle) * burstSpeed;
          this.life = 0.35 + Math.random() * 0.55;
          this.size = 1.0 + Math.random() * 1.8;
        }

        this.maxLife = this.life;
        this.age = 0;
      }

      update(dt: number) {
        this.age += dt;
        if (this.age >= this.maxLife) {
          this.reset(this.isCore);
          return;
        }

        this.prevX = this.x;
        this.prevY = this.y;

        if (this.isCore) {
          this.angle += this.angularSpeed * dt;
          this.dist = radius + Math.sin(this.angle * 6) * 5;
          this.x = centerX + Math.cos(this.angle) * this.dist;
          this.y = centerY + Math.sin(this.angle) * this.dist;
        } else {
          // Air resistance drag & slight gravity
          this.vx *= 0.965;
          this.vy *= 0.965;
          this.vy += 0.08; // subtle downward drift
          this.x += this.vx;
          this.y += this.vy;

          // Ground level splatter near the bottom of portal
          const groundY = centerY + radius + 15;
          if (this.y > groundY && Math.random() < 0.2) {
            this.vy = -this.vy * 0.3;
            this.vx *= 1.3;
          }
        }
      }

      draw(context: CanvasRenderingContext2D) {
        const progress = this.age / this.maxLife;
        const alpha = Math.max(0, 1 - progress);

        // Doctor Strange incandescent color ramp: White-Hot -> Pure Gold -> Molten Amber -> Deep Orange -> Fading Spark
        let strokeColor: string;
        if (progress < 0.2) {
          strokeColor = `rgba(255, 255, 255, ${alpha})`;
        } else if (progress < 0.5) {
          strokeColor = `rgba(255, 225, 110, ${alpha * 0.95})`;
        } else if (progress < 0.8) {
          strokeColor = `rgba(255, 150, 20, ${alpha * 0.85})`;
        } else {
          strokeColor = `rgba(230, 70, 10, ${alpha * 0.6})`;
        }

        context.strokeStyle = strokeColor;
        context.lineWidth = this.size * (1 - progress * 0.45);
        context.lineCap = "round";

        context.beginPath();
        context.moveTo(this.prevX, this.prevY);
        context.lineTo(this.x, this.y);
        context.stroke();
      }
    }

    // Initialize Particle Pool: Optimized ~100 core ring sparks + ~120 tangential ejected sparks
    const sparksCount = width < 640 ? 160 : 220;
    const coreCount = Math.floor(sparksCount * 0.45);
    const sprayCount = sparksCount - coreCount;

    const sparks: Spark[] = [];
    for (let i = 0; i < coreCount; i++) sparks.push(new Spark(true));
    for (let i = 0; i < sprayCount; i++) sparks.push(new Spark(false));

    // Pre-create ambient gradient once (avoids GC churn in render loop)
    const auraGradient = ctx.createRadialGradient(
      centerX,
      centerY,
      radius * 0.7,
      centerX,
      centerY,
      radius * 1.5
    );
    auraGradient.addColorStop(0, "rgba(255, 140, 20, 0.12)");
    auraGradient.addColorStop(0.5, "rgba(200, 60, 0, 0.05)");
    auraGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    let lastTime = performance.now();

    const renderLoop = (now: number) => {
      // Cease rendering immediately when fading out to yield CPU/GPU to page reveal
      if (isFadingOut) return;

      const dt = Math.min(0.045, (now - lastTime) / 1000);
      lastTime = now;

      // 1. Motion Blur Backdrop Clear (Preserves glowing spark streaks)
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(4, 6, 12, 0.32)";
      ctx.fillRect(0, 0, width, height);

      // 2. Additive Blending for Incandescent Molten Gold & Blinding White Core
      ctx.globalCompositeOperation = "lighter";

      // 3. Ambient Volumetric Portal Aura behind the ring
      ctx.fillStyle = auraGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // 4. Update and Draw all Sparks
      for (let i = 0; i < sparks.length; i++) {
        const s = sparks[i];
        s.update(dt);
        s.draw(ctx);
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isReducedMotion, isFadingOut]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#04060C] transition-opacity duration-500 ease-out select-none overflow-hidden ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      } ${className}`}
      aria-label="Events Arena Summoning Portal"
      role="status"
    >
      {/* Reduced-Motion Static Glowing Ring Fallback */}
      {isReducedMotion ? (
        <div className="relative flex items-center justify-center w-72 h-72 rounded-full border-2 border-amber-400 shadow-[0_0_50px_rgba(255,180,50,0.6)]">
          <div className="absolute inset-0 rounded-full bg-radial from-amber-500/10 via-orange-600/5 to-transparent animate-pulse" />
        </div>
      ) : (
        /* Real-time High-Energy Golden Spark Vortex Canvas */
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
      )}

      {/* Atmospheric Warm Backlight Halo */}
      <div className="absolute w-[450px] h-[450px] rounded-full bg-amber-600/10 blur-[130px] pointer-events-none" />

      {/* Center Portal Content: TECHNIX & SUMMONING EVENTS... */}
      {!error ? (
        <div className="relative z-10 flex flex-col items-center justify-center text-center select-none pointer-events-none px-4">
          {/* Brand Wordmark */}
          <span className="font-heading font-black text-2xl sm:text-3xl md:text-4xl tracking-[0.28em] uppercase text-white drop-shadow-[0_0_24px_rgba(255,190,60,0.85)]">
            TECHNIX
          </span>

          {/* Subtitle with Animated Pulsing Ellipsis */}
          <div className="flex items-center gap-1.5 mt-2.5">
            <span className="font-mono-code text-xs sm:text-sm tracking-[0.32em] uppercase text-amber-300 font-semibold drop-shadow-[0_0_12px_rgba(255,160,0,0.9)]">
              SUMMONING EVENTS
            </span>
            <span className="inline-flex gap-0.5 text-amber-400 font-bold text-base leading-none">
              <span className="animate-pulse" style={{ animationDelay: "0ms" }}>
                .
              </span>
              <span
                className="animate-pulse"
                style={{ animationDelay: "200ms" }}
              >
                .
              </span>
              <span
                className="animate-pulse"
                style={{ animationDelay: "400ms" }}
              >
                .
              </span>
            </span>
          </div>

          {/* Golden Portal Dimension Line */}
          <div className="mt-3.5 w-32 sm:w-40 h-[2px] bg-gradient-to-r from-transparent via-amber-400/90 to-transparent shadow-[0_0_10px_#F59E0B]" />
        </div>
      ) : (
        /* Tactical Error & Retry State */
        <div className="relative z-20 flex flex-col items-center justify-center text-center px-6 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-red-950/60 border border-red-500/50 flex items-center justify-center mb-3 text-red-400 shadow-[0_0_25px_rgba(239,68,68,0.4)]">
            <AlertCircle className="w-6 h-6" />
          </div>

          <h3 className="font-heading text-lg sm:text-xl font-bold uppercase tracking-wider text-red-400 mb-1">
            PORTAL CONVERGENCE FAILED
          </h3>

          <p className="text-slate-400 text-xs sm:text-sm font-sans mb-5 leading-relaxed">
            {error ||
              "Unable to materialize the event dossiers. The dimensional link timed out."}
          </p>

          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading text-xs font-bold tracking-widest uppercase text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              RETRY SUMMONING
            </button>
          )}
        </div>
      )}
    </div>
  );
}
