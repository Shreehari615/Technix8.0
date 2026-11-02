"use client";

import React, { useEffect, useState } from "react";
import { festConfig } from "@/data/festConfig";
import { Sparkles, ArrowRight } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

interface CountdownTimerProps {
  variant?: "default" | "hero" | "compact";
  onActionClick?: () => void;
}

export default function CountdownTimer({
  variant = "default",
  onActionClick,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const target = new Date(festConfig.eventDate).getTime();

    const calculate = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeUnits = [
    { label: "DAYS", value: String(timeLeft.days).padStart(2, "0"), color: "text-white" },
    { label: "HOURS", value: String(timeLeft.hours).padStart(2, "0"), color: "text-red-400" },
    { label: "MINS", value: String(timeLeft.minutes).padStart(2, "0"), color: "text-amber-400" },
    { label: "SECS", value: String(timeLeft.seconds).padStart(2, "0"), color: "text-cyan-400" },
  ];

  // Expired State
  if (mounted && timeLeft.isExpired) {
    return (
      <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-red-950/60 border border-red-500/50 glow-red">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
        <span className="font-heading font-bold text-red-100 tracking-wider text-sm sm:text-base">
          THE ASSEMBLY HAS BEGUN // PROTOCOL ACTIVE
        </span>
      </div>
    );
  }

  // =========================================================================
  // HERO VARIANT (State-of-the-art Marvel Multiverse HUD)
  // =========================================================================
  if (variant === "hero") {
    return (
      <div className="flex flex-col items-center w-full animate-in fade-in zoom-in-95 duration-300">
        {/* Futuristic HUD Chassis */}
        <div className="relative rounded-2xl sm:rounded-3xl bg-black/75 backdrop-blur-xl border border-red-500/40 p-4 sm:p-5 shadow-[0_0_35px_rgba(239,68,68,0.22)] flex flex-col items-center w-full max-w-lg">
          {/* Top Status Header */}
          <div className="flex items-center justify-between w-full pb-3 mb-3 border-b border-white/10 px-1">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="font-mono-code text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-red-300 uppercase">
                LAUNCH COUNTDOWN
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-amber-300/90 font-mono-code text-[10px] sm:text-[11px] tracking-wider uppercase font-semibold">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>NOV 17, 2026</span>
            </div>
          </div>

          {/* Clock Segment Units */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 w-full">
            {timeUnits.map((unit, index) => (
              <React.Fragment key={unit.label}>
                <div className="flex-1 flex flex-col items-center justify-center py-2 sm:py-3 px-2 rounded-xl bg-slate-950/90 border border-slate-800/90 shadow-inner">
                  <span
                    className={`font-heading text-2xl sm:text-3xl md:text-4xl font-black ${mounted ? unit.color : "text-slate-400"
                      } tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]`}
                  >
                    {mounted ? unit.value : "--"}
                  </span>
                  <span className="font-mono-code text-[9px] sm:text-[10px] text-slate-400 tracking-widest mt-0.5 font-bold uppercase">
                    {unit.label}
                  </span>
                </div>

                {index < timeUnits.length - 1 && (
                  <span className="font-heading text-xl sm:text-2xl text-red-500 font-extrabold animate-pulse -mx-0.5 sm:-mx-1">
                    :
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Action Button: Explore Arenas */}
          {onActionClick && (
            <button
              onClick={onActionClick}
              className="mt-4 w-full group relative inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-amber-500/50 bg-gradient-to-r from-red-600/90 via-red-700/90 to-amber-600/90 hover:from-red-500 hover:to-amber-500 text-white font-mono-code text-xs sm:text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:scale-[1.02] active:scale-98 cursor-pointer"
            >
              <span>EXPLORE 11 FEST ARENAS</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // DEFAULT VARIANT (Used in Schedule & other sections)
  // =========================================================================
  if (!mounted) {
    return (
      <div className="flex items-center justify-center gap-3 sm:gap-4 py-2">
        {["DAYS", "HOURS", "MINS", "SECS"].map((label) => (
          <div
            key={label}
            className="flex flex-col items-center justify-center w-16 sm:w-20 md:w-24 h-18 sm:h-22 rounded-xl bg-slate-900/80 border border-red-900/40 p-2"
          >
            <span className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-slate-300">--</span>
            <span className="font-mono-code text-[10px] sm:text-xs text-slate-500 tracking-wider mt-1">{label}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2 sm:gap-4">
        {timeUnits.map((unit, index) => (
          <React.Fragment key={unit.label}>
            <div className="group relative flex flex-col items-center justify-center w-16 sm:w-20 md:w-24 h-18 sm:h-22 md:h-24 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 hover:border-red-500/60 transition-all duration-300 shadow-lg shadow-black/80">
              <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-red-500/60 rounded-full group-hover:scale-125 transition-transform" />
              <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-cyan-500/60 rounded-full group-hover:scale-125 transition-transform" />

              <span className={`font-heading text-xl sm:text-2xl md:text-3xl font-extrabold ${unit.color} tracking-tight drop-shadow-md`}>
                {unit.value}
              </span>
              <span className="font-mono-code text-[9px] sm:text-[11px] text-slate-400 tracking-widest mt-1 font-semibold uppercase">
                {unit.label}
              </span>
            </div>

            {index < timeUnits.length - 1 && (
              <span className="font-heading text-lg sm:text-2xl text-red-600/70 font-bold animate-pulse -mx-1 sm:-mx-2">
                :
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
      <p className="font-mono-code text-xs text-slate-400 tracking-widest mt-2 flex items-center gap-1.5">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        TARGET: {festConfig.eventDateDisplay}
      </p>
    </div>
  );
}
