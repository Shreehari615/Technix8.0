"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import CountdownTimer from "@/components/CountdownTimer";
import Footer from "@/components/Footer";
import { Calendar, Clock, MapPin, AlertCircle, Sparkles } from "lucide-react";

export default function SchedulePage() {
  const [selectedDayTab, setSelectedDayTab] = useState<"All" | "Day 1" | "Day 2">("All");

  const scheduleDays = [
    {
      day: "Day 1 — Convergence Awakening",
      dayKey: "Day 1" as const,
      date: "November 17, 2026",
      events: [
        { time: "Updating Soon", title: "Grand Inauguration & Quantum Opening", venue: "BMSIT Grand Auditorium", category: "Ceremony" },
        { time: "Updating Soon", title: "Stark Protocol — Coding & Debugging", venue: "BMSIT Computing Lab", category: "Technical" },
        { time: "Updating Soon", title: "Shield: Command The Chaos — IT Manager", venue: "BMSIT Seminar Hall", category: "Technical" },
        { time: "Updating Soon", title: "The Infinity IQ Challenge — IT Quiz", venue: "BMSIT Main Hall", category: "Technical" },
        { time: "Updating Soon", title: "Avengers: Battleworld — Gaming & Esports", venue: "BMSIT Esports Arena", category: "Gaming" },
        { time: "Updating Soon", title: "Stark Labs: Interface Infinity — Web Designing", venue: "BMSIT Design Center", category: "Technical" },
      ],
    },
    {
      day: "Day 2 — The Cosmic Climax",
      dayKey: "Day 2" as const,
      date: "November 18, 2026",
      events: [
        { time: "Updating Soon", title: "Marvel In Motion — Photography & Videography", venue: "BMSIT Campus-Wide", category: "Non-Technical" },
        { time: "Updating Soon", title: "The Tesseract Heist — Treasure Hunt", venue: "BMSIT Central Quadrangle", category: "Non-Technical" },
        { time: "Updating Soon", title: "Project: What If...? — Surprise Protocol", venue: "BMSIT Classified Arena", category: "Classified" },
        { time: "Updating Soon", title: "Cosmic Showcase — Cultural Showdown", venue: "BMSIT Open Air Amphitheatre", category: "Cultural" },
        { time: "Updating Soon", title: "Valedictory Ceremony & Prize Distribution", venue: "BMSIT Grand Auditorium", category: "Ceremony" },
        { time: "Updating Soon", title: "Technix 8.0 DJ Night & Starlight Celebration", venue: "BMSIT Festival Grounds", category: "Cultural" },
      ],
    },
  ];

  const displayedGroups = useMemo(() => {
    if (selectedDayTab === "All") return scheduleDays;
    return scheduleDays.filter((group) => group.dayKey === selectedDayTab);
  }, [selectedDayTab]);

  return (
    <div className="min-h-screen bg-transparent text-slate-900 flex flex-col selection:bg-red-600 selection:text-white relative">
      <Navbar />

      <main className="flex-1 pt-16">
        {/* ================================================================= */}
        {/* 1. TOP MARVEL ANNOUNCEMENT TICKER                                  */}
        {/* ================================================================= */}
        <div className="w-full bg-black/60 border-b border-white/10 text-[#CCCCCC] py-2 px-4 flex items-center justify-center text-[11px] sm:text-xs font-mono-code tracking-widest uppercase select-none z-20 relative">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            STREAM TECHNIX 8.0 EXCLUSIVELY AT FEST ARENAS • NOVEMBER 17 – 18, 2026 • BMSIT YELAHANKA BENGALURU
          </span>
        </div>

        {/* ================================================================= */}
        {/* 2. CINEMATIC HERO HEADER BANNER (MARVEL MOVIES STYLE)              */}
        {/* ================================================================= */}
        <div className="relative w-full min-h-[300px] sm:min-h-[340px] md:min-h-[380px] bg-gradient-to-b from-black/60 via-black/30 to-transparent flex items-center justify-center overflow-hidden">
          {/* Subtle Architectural Perspective / Glass Grid Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-15">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id="sched-hero-grid"
                  width="80"
                  height="80"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 80 0 L 0 0 0 80"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="0.8"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#sched-hero-grid)" />
            </svg>
          </div>

          {/* Soft Vignette Shadows */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/25 pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

          {/* Dynamic Spider-Man on Right Side */}
          <div className="absolute right-0 top-0 bottom-0 w-[46%] max-w-[500px] pointer-events-none overflow-hidden hidden sm:block z-10">
            <div
              className="relative w-full h-full"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 15%, black 40%)",
                maskImage:
                  "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 15%, black 40%)",
              }}
            >
              <Image
                src="/images/technix/marvel_spidey_banner_figure.webp"
                alt="Spider-Man in Action"
                fill
                priority
                sizes="(max-width: 1024px) 45vw, 500px"
                className="object-cover object-right"
              />
            </div>
          </div>

          {/* Centered Typography: SCHEDULE Title */}
          <div className="relative z-10 max-w-4xl mx-auto text-center px-4 py-16 sm:py-20 md:py-24 flex flex-col items-center justify-center">
            <h1 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase text-white tracking-widest drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
              SCHEDULE
            </h1>

            <p className="text-slate-200 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mt-4 font-sans font-normal tracking-wide leading-relaxed drop-shadow-md">
              Official Itinerary & Timeline for the 9 Heroic Arenas of TECHNIX 8.0
            </p>

            <div className="mt-5 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white/90 text-xs font-mono-code uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>NOVEMBER 17 – 18, 2026 • BMSIT YELAHANKA BENGALURU</span>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 3. WHITE GALLERY SHOWROOM CONTAINER                                */}
        {/* ================================================================= */}
        <div className="w-full bg-[#0a0c10]/85 backdrop-blur-sm text-slate-100 pt-8 pb-24 px-4 sm:px-6 lg:px-8 border-t border-slate-800/50 shadow-2xl relative z-20">
          <div className="max-w-5xl mx-auto">
            {/* Marvel Style Day Filter Tabs & Status */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-700">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {(["All", "Day 1", "Day 2"] as const).map((tab) => {
                  const isActive = selectedDayTab === tab;
                  const label =
                    tab === "All"
                      ? "ALL SESSIONS"
                      : tab === "Day 1"
                      ? "DAY 1 — NOV 17"
                      : "DAY 2 — NOV 18";
                  return (
                    <button
                      key={tab}
                      onClick={() => setSelectedDayTab(tab)}
                      className={`relative px-4 py-2 text-xs sm:text-sm font-tech font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                        isActive
                          ? "text-red-500 after:absolute after:bottom-0 after:left-2 after:right-2 after:h-[3px] after:bg-red-500 after:rounded-full"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Alert notice box */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-900/30 border border-amber-500/50 text-amber-300 text-xs font-mono-code font-bold">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                <span>TIMINGS: UPDATING SOON</span>
              </div>
            </div>

            {/* Countdown Timer Box */}
            <div className="mb-12 p-6 rounded-2xl bg-slate-950 text-white shadow-xl border border-slate-800 text-center max-w-xl mx-auto">
              <span className="font-mono-code text-xs text-amber-400 uppercase tracking-widest block mb-2 font-bold">
                CONVERGENCE COUNTDOWN // NOVEMBER 17, 2026
              </span>
              <CountdownTimer />
            </div>

            {/* Schedule Groups */}
            <div className="space-y-10">
              {displayedGroups.map((dayGroup, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-700/60 bg-slate-900/50 backdrop-blur-sm p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-700 gap-2">
                    <div>
                      <h2 className="font-heading text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                        {dayGroup.day}
                      </h2>
                      <p className="font-mono-code text-xs font-semibold text-red-600 mt-1 uppercase tracking-wider">
                        {dayGroup.date} • BMSIT Yelahanka Bengaluru
                      </p>
                    </div>

                    <span className="font-mono-code text-xs font-bold text-slate-300 bg-slate-800 border border-slate-600 px-3 py-1 rounded-full shadow-sm w-fit">
                      {dayGroup.events.length} SESSIONS
                    </span>
                  </div>

                  <div className="grid gap-3 sm:gap-4">
                    {dayGroup.events.map((evt, eIdx) => (
                      <div
                        key={eIdx}
                        className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-900/70 border border-slate-700 hover:border-red-500 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 gap-3"
                      >
                        {/* Red Left Accent Indicator on Hover */}
                        <div className="absolute left-0 inset-y-0 w-1 bg-red-600 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="flex items-center gap-3 pl-2 sm:pl-0">
                          {/* Time Badge */}
                          <div className="flex items-center gap-1.5 font-mono-code text-xs font-bold text-amber-700 bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xs">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>{evt.time}</span>
                          </div>

                          {/* Event Title */}
                          <div>
                            <span className="font-heading font-black text-sm sm:text-base text-white group-hover:text-red-400 transition-colors uppercase tracking-tight block">
                              {evt.title}
                            </span>
                            <span className="text-[10px] font-mono-code text-slate-400 uppercase tracking-wider">
                              {evt.category}
                            </span>
                          </div>
                        </div>

                        {/* Venue */}
                        <div className="flex items-center gap-1.5 font-mono-code text-xs text-slate-400 sm:self-center pl-2 sm:pl-0">
                          <MapPin className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                          <span className="font-medium">{evt.venue}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Venue Footer Banner */}
            <div className="mt-12 p-6 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white flex-shrink-0 shadow-md">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading text-sm sm:text-base font-bold uppercase text-white">
                    CENTRAL VENUE // BMSIT YELAHANKA BENGALURU
                  </h4>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">
                    Doddaballapur Main Road, Avalahalli, Yelahanka, Bengaluru, Karnataka 560064
                  </p>
                </div>
              </div>

              <div className="px-3.5 py-1.5 rounded-lg bg-white/10 text-xs font-mono-code text-amber-300 border border-white/15 whitespace-nowrap">
                COORDINATES: 13.1332° N, 77.5678° E
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
