"use client";

import React from "react";
import { festConfig } from "@/data/festConfig";
import { Zap, Shield, Users, Trophy, Sparkles } from "lucide-react";

export default function HighlightsSection() {
  const getIcon = (name: string) => {
    switch (name) {
      case "Zap":
        return <Zap className="w-7 h-7 text-amber-400" />;
      case "Shield":
        return <Shield className="w-7 h-7 text-blue-400" />;
      case "Users":
        return <Users className="w-7 h-7 text-emerald-400" />;
      case "Trophy":
        return <Trophy className="w-7 h-7 text-yellow-400" />;
      default:
        return <Sparkles className="w-7 h-7 text-red-400" />;
    }
  };

  return (
    <section id="highlights" className="relative py-20 px-4 bg-[#05070B] overflow-hidden">
      {/* Background Stark Tech Glow Lines */}
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 font-mono-code text-xs tracking-widest uppercase mb-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            TELEMETRY &amp; SCALE
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black uppercase text-metallic-silver tracking-tight">
            FEST <span className="text-metallic-gold">HIGHLIGHTS</span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base mt-2">
            The quantitative footprint of TECHNIX 8.0 across the collegiate multiverse.
          </p>
        </div>

        {/* Highlights Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {festConfig.highlights.map((stat) => (
            <div
              key={stat.label}
              className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 hover:border-slate-700 transition-all duration-300 group shadow-xl hover:-translate-y-1"
            >
              {/* Corner Tech Ornament */}
              <div className="absolute top-2 right-2 flex items-center gap-1">
                {stat.status === "confirmed" ? (
                  <span className="font-mono-code text-[10px] uppercase px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 font-bold">
                    CONFIRMED
                  </span>
                ) : (
                  <span className="font-mono-code text-[10px] uppercase px-2 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-500/40 font-bold">
                    PENDING TARGET
                  </span>
                )}
              </div>

              <div className="w-14 h-14 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                {getIcon(stat.iconName)}
              </div>

              <div className="flex items-baseline gap-1">
                <span className={`font-heading text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </span>
              </div>

              <h3 className="font-tech text-xl font-bold text-white tracking-wide mt-2">
                {stat.label}
              </h3>

              <p className="text-slate-400 text-xs font-mono-code mt-1">
                {stat.subtext}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
