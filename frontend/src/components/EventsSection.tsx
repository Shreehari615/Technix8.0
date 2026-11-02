"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { eventsData } from "@/data/eventsData";
import { FestEvent } from "@/types";
import {
  Sparkles,
  Eye,
  Maximize2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
} from "lucide-react";

interface EventsSectionProps {
  onOpenEventDetails: (event: FestEvent) => void;
  onSelectForRegistration: (eventId: string) => void;
  initialCategory?: string;
}

export default function EventsSection({
  onOpenEventDetails,
  onSelectForRegistration,
  initialCategory = "All",
}: EventsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"spatial" | "grid">("spatial");

  const categories = ["All", "Technical", "Non-Technical", "Gaming", "Cultural"];

  const filteredEvents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return eventsData.filter((event) => {
      const matchesCategory =
        selectedCategory === "All" || event.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        event.title.toLowerCase().includes(q) ||
        event.marvelCharacter.toLowerCase().includes(q) ||
        event.shortDescription.toLowerCase().includes(q)
      );
    });
  }, [selectedCategory, searchQuery]);

  // Clamp activeIndex when list changes
  useEffect(() => {
    if (activeIndex >= filteredEvents.length) {
      setActiveIndex(Math.max(0, filteredEvents.length - 1));
    }
  }, [filteredEvents.length, activeIndex]);

  const activeEvent = filteredEvents[activeIndex] || filteredEvents[0] || eventsData[0];

  // Navigation Handlers
  const handlePrev = useCallback(() => {
    if (filteredEvents.length === 0) return;
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : filteredEvents.length - 1));
  }, [filteredEvents.length]);

  const handleNext = useCallback(() => {
    if (filteredEvents.length === 0) return;
    setActiveIndex((prev) => (prev < filteredEvents.length - 1 ? prev + 1 : 0));
  }, [filteredEvents.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  // Touch swipe support
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      if (Math.abs(diff) > 40) {
        if (diff > 0) handleNext();
        else handlePrev();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      id="events"
      className="relative w-full min-h-screen bg-transparent text-slate-100 overflow-hidden flex flex-col justify-between selection:bg-red-600 selection:text-white py-6 sm:py-10 px-3 sm:px-6 lg:px-8"
    >
      {/* ================================================================= */}
      {/* 1. CINEMATIC SPATIAL ROOM LIGHTING & WARM AMBIENT BOKEH           */}
      {/* ================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Warm Left Lamp Glow (Matching Reference Living Room Lighting) */}
        <div className="absolute -top-24 -left-20 w-[480px] h-[480px] rounded-full bg-amber-600/12 blur-[130px]" />
        
        {/* Soft Warm Right Lamp Glow */}
        <div className="absolute top-1/4 -right-24 w-[520px] h-[520px] rounded-full bg-amber-500/10 blur-[140px]" />
        
        {/* Center Subdued Blue/Violet Atmospheric Light */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[650px] h-[450px] rounded-full bg-indigo-900/15 blur-[150px]" />

        {/* Floor Depth Shadow & Table Surface Reflection Gradient */}
        <div className="absolute bottom-0 inset-x-0 h-72 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90" />
        
        {/* Subtle Room Perspective Lines */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* ================================================================= */}
      {/* 2. CATEGORY PROTOCOL FILTER PILLS                                 */}
      {/* ================================================================= */}
      <div className="relative z-30 w-full max-w-4xl mx-auto mb-6 sm:mb-8">
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setActiveIndex(0);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-mono-code uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? "bg-white/20 text-white font-bold border border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.25)] scale-105"
                    : "bg-white/[0.06] text-slate-300 hover:text-white hover:bg-white/15 border border-white/10"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>


      {/* ================================================================= */}
      {/* 3. MAIN SPATIAL COVER FLOW ARENA (VISION PRO 3D PERSPECTIVE)       */}
      {/* ================================================================= */}
      {viewMode === "spatial" ? (
        <div
          className="relative z-20 w-full max-w-7xl mx-auto flex-1 flex flex-col items-center justify-center py-4 select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Prominent Left Navigation Button */}
          <button
            type="button"
            onClick={handlePrev}
            title="Previous Protocol (Left Navigation)"
            aria-label="Previous Protocol"
            className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white/[0.08] hover:bg-white/[0.22] active:scale-95 transition-all backdrop-blur-2xl border border-white/[0.22] shadow-[0_12px_36px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.3)] flex items-center justify-center text-white cursor-pointer group"
          >
            <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7 text-white/90 group-hover:text-white group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Prominent Right Navigation Button */}
          <button
            type="button"
            onClick={handleNext}
            title="Next Protocol (Right Navigation)"
            aria-label="Next Protocol"
            className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white/[0.08] hover:bg-white/[0.22] active:scale-95 transition-all backdrop-blur-2xl border border-white/[0.22] shadow-[0_12px_36px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.3)] flex items-center justify-center text-white cursor-pointer group"
          >
            <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7 text-white/90 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* 3D Perspective Stage Container */}
          <div
            className="relative w-full h-[520px] sm:h-[580px] md:h-[620px] flex items-center justify-center"
            style={{
              perspective: "1200px",
              perspectiveOrigin: "center 48%",
            }}
          >
            {filteredEvents.map((event, index) => {
              const offset = index - activeIndex;
              const isCenter = offset === 0;
              const absOffset = Math.abs(offset);

              // 3D Cover Flow Transform Calculations
              let translateX = "0%";
              let translateZ = "0px";
              let rotateY = "0deg";
              let scale = 1;
              let opacity = 1;
              let zIndex = 30;
              let filter = "none";
              let pointerEvents: "auto" | "none" = "auto";

              if (isCenter) {
                translateX = "0%";
                translateZ = "60px";
                rotateY = "0deg";
                scale = 1.05;
                opacity = 1;
                zIndex = 40;
                filter = "blur(0px)";
              } else if (offset === -1) {
                translateX = "-78%";
                translateZ = "-100px";
                rotateY = "30deg";
                scale = 0.88;
                opacity = 0.88;
                zIndex = 30;
                filter = "blur(0.5px)";
              } else if (offset === 1) {
                translateX = "78%";
                translateZ = "-100px";
                rotateY = "-30deg";
                scale = 0.88;
                opacity = 0.88;
                zIndex = 30;
                filter = "blur(0.5px)";
              } else if (offset === -2) {
                translateX = "-142%";
                translateZ = "-240px";
                rotateY = "44deg";
                scale = 0.74;
                opacity = 0.55;
                zIndex = 20;
                filter = "blur(1.5px)";
              } else if (offset === 2) {
                translateX = "142%";
                translateZ = "-240px";
                rotateY = "-44deg";
                scale = 0.74;
                opacity = 0.55;
                zIndex = 20;
                filter = "blur(1.5px)";
              } else {
                translateX = `${offset > 0 ? 175 : -175}%`;
                translateZ = "-360px";
                rotateY = `${offset > 0 ? -55 : 55}deg`;
                scale = 0.6;
                opacity = 0;
                zIndex = 10;
                pointerEvents = "none";
              }

              const titleParts = event.title.split("—");
              const mainTitle = titleParts[0].trim();
              const subTitle = titleParts[1] ? titleParts[1].trim() : event.shortDescription;

              return (
                <div
                  key={event.id}
                  onClick={() => {
                    if (!isCenter) setActiveIndex(index);
                  }}
                  className={`absolute top-1/2 -translate-y-1/2 w-[90vw] max-w-[360px] sm:max-w-[400px] md:max-w-[440px] rounded-[32px] overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] select-none ${
                    isCenter ? "cursor-default" : "cursor-pointer"
                  }`}
                  style={{
                    transform: `translateX(${translateX}) translateZ(${translateZ}) rotateY(${rotateY}) scale(${scale})`,
                    opacity,
                    zIndex,
                    filter,
                    pointerEvents,
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Solid Opaque Dark Glass Chassis (Prevents any background content bleed-through) */}
                  <div
                    className={`relative w-full h-full rounded-[32px] p-3 sm:p-4 flex flex-col justify-between text-left overflow-hidden border transition-all ${
                      isCenter
                        ? "bg-[#0A0C12] border-white/[0.26] shadow-[0_35px_90px_rgba(0,0,0,0.95),inset_0_1px_1px_rgba(255,255,255,0.25)]"
                        : "bg-[#0E1017] border-white/[0.12] shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
                    }`}
                    style={{
                      boxShadow: isCenter
                        ? `0 35px 90px rgba(0,0,0,0.95), 0 0 35px ${event.heroTheme.glowColor}, inset 0 1px 1px rgba(255,255,255,0.25)`
                        : undefined,
                    }}
                  >
                    {/* Top Inside-Card Glass Pill Controls (Only on Center Active Card) */}
                    {isCenter && (
                      <div className="absolute top-5 inset-x-5 z-20 flex items-center justify-between pointer-events-auto">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenEventDetails(event);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-xl border border-white/20 text-white text-[11px] font-mono-code uppercase tracking-wider transition-all cursor-pointer shadow-md"
                        >
                          <Maximize2 className="w-3 h-3 text-slate-300" />
                          <span>Expand</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenEventDetails(event);
                          }}
                          className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
                          title="Protocol Options"
                        >
                          <MoreHorizontal className="w-4 h-4 text-slate-300" />
                        </button>
                      </div>
                    )}

                    {/* Top Card Visual Area */}
                    <div className="relative w-full h-[240px] sm:h-[280px] md:h-[300px] rounded-2xl overflow-hidden bg-slate-950 flex-shrink-0 shadow-inner">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        priority={isCenter}
                        sizes="(max-width: 640px) 90vw, 440px"
                        className="object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
                      />

                      {/* Smooth Dark Vignette into Bottom Glass Text */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C12] via-transparent to-transparent pointer-events-none" />

                      {/* Hero Character Badge on Bottom-Left */}
                      <div className="absolute bottom-3 left-3 z-10">
                        <span className="px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md text-[10px] font-mono-code font-bold text-white uppercase tracking-wider border border-white/15 flex items-center gap-1.5 shadow-md">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: event.heroTheme.accentColor }}
                          />
                          {event.marvelCharacter.split("—")[0].trim()}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Card Content Area */}
                    <div className="pt-3 sm:pt-4 pb-1 px-1 flex flex-col flex-1 justify-between">
                      {isCenter ? (
                        /* Center Card: Complete Interactive Details */
                        <>
                          <div>
                            {/* Title Row: Bold Headline + 1/9 Counter */}
                            <div className="flex items-start justify-between gap-3">
                              <h3 className="font-heading font-black text-lg sm:text-xl md:text-2xl text-white uppercase tracking-tight line-clamp-1 drop-shadow-sm">
                                {mainTitle}
                              </h3>
                              <span className="font-mono-code text-xs text-slate-400 font-semibold flex-shrink-0 pt-0.5">
                                {index + 1} / {filteredEvents.length}
                              </span>
                            </div>

                            {/* Subtitle / Category Label */}
                            <p className="text-[11px] font-tech font-bold uppercase tracking-wider text-amber-400/90 mt-0.5">
                              {subTitle}
                            </p>

                            {/* Description Paragraph */}
                            <p className="text-xs sm:text-[13px] font-sans text-slate-300 leading-relaxed mt-2 line-clamp-2 sm:line-clamp-3">
                              {event.shortDescription}
                            </p>
                          </div>

                          {/* Location & Coordinates */}
                          <div className="pt-3 border-t border-white/10 mt-3">
                            <div className="flex items-center gap-1.5 text-[11px] font-mono-code text-slate-400 truncate">
                              <MapPin className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                              <span className="truncate">
                                BMSIT Yelahanka, Bengaluru • 13.1327° N, 77.5684° E
                              </span>
                            </div>

                            {/* Action Buttons: DOSSIER & REGISTER */}
                            <div className="mt-3 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenEventDetails(event);
                                }}
                                className="flex-1 py-2 px-3 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer backdrop-blur-md border border-white/15"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                DOSSIER
                              </button>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectForRegistration(event.id);
                                }}
                                className="flex-1 py-2 px-3 rounded-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-heading font-extrabold uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                                REGISTER
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        /* Side Card: Clean visionOS Teaser (Image, Title & Category) */
                        <div className="flex flex-col justify-end h-full pt-2">
                          <h4 className="font-heading font-bold text-sm sm:text-base text-white/90 uppercase tracking-tight line-clamp-1">
                            {mainTitle}
                          </h4>
                          <p className="text-[10px] sm:text-[11px] font-mono-code text-slate-400 uppercase tracking-wider mt-0.5 truncate">
                            {event.category} Protocol • {event.venue}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ================================================================= */
        /* ALTERNATIVE GRID VIEW (TOGGLED VIA TOP GRID BUTTON)               */
        /* ================================================================= */
        <div className="relative z-20 w-full max-w-7xl mx-auto py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event, index) => {
              const titleParts = event.title.split("—");
              const mainTitle = titleParts[0].trim();
              const subTitle = titleParts[1] ? titleParts[1].trim() : event.shortDescription;

              return (
                <div
                  key={event.id}
                  onClick={() => onOpenEventDetails(event)}
                  className="rounded-[28px] overflow-hidden bg-white/[0.08] backdrop-blur-2xl border border-white/[0.18] p-4 flex flex-col justify-between hover:scale-[1.02] transition-all cursor-pointer shadow-xl group"
                >
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 mb-3">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/75 text-[10px] font-mono-code text-white">
                      {event.category}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-heading font-black text-base text-white uppercase tracking-tight group-hover:text-red-400 transition-colors">
                      {mainTitle}
                    </h3>
                    <p className="text-xs font-tech text-amber-400 font-bold uppercase tracking-wider mt-0.5">
                      {subTitle}
                    </p>
                    <p className="text-xs text-slate-300 mt-2 line-clamp-2">
                      {event.shortDescription}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEventDetails(event);
                      }}
                      className="flex-1 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-heading font-bold uppercase tracking-wider"
                    >
                      Dossier
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectForRegistration(event.id);
                      }}
                      className="flex-1 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-heading font-bold uppercase tracking-wider"
                    >
                      Register
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 4. BOTTOM FLOATING GLASS CAPSULE & DOTS (REFERENCE CONTROLS)      */}
      {/* ================================================================= */}
      <div className="relative z-30 w-full max-w-xl mx-auto mt-4 sm:mt-6 flex flex-col items-center">
        {/* Floating Capsule: Left Arrow, Circular Avatar, Label, Heart, Right Arrow */}
        <div className="flex items-center justify-between gap-3 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.12] transition-all backdrop-blur-2xl border border-white/[0.18] shadow-[0_12px_36px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.25)] w-full max-w-sm sm:max-w-md">
          <button
            type="button"
            onClick={handlePrev}
            title="Previous Protocol"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Center Info: Circular Active Avatar + Two-line Text */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-white/30 flex-shrink-0 bg-slate-900 shadow-sm">
              <Image
                src={activeEvent.image}
                alt={activeEvent.title}
                fill
                className="object-cover object-center"
              />
            </div>

            <div className="text-left truncate">
              <p className="font-heading font-black text-xs sm:text-sm text-white uppercase tracking-tight truncate">
                {activeEvent.title.split("—")[0].trim()}
              </p>
              <p className="text-[10px] font-mono-code text-slate-400 truncate">
                TECHNIX 8.0 • BMSIT YELAHANKA
              </p>
            </div>
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={handleNext}
            title="Next Protocol"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Dot Pagination Row */}
        <div className="flex items-center justify-center gap-1.5 mt-3 select-none">
          {filteredEvents.map((ev, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={ev.id}
                onClick={() => setActiveIndex(i)}
                title={`Go to ${ev.title.split("—")[0].trim()}`}
                className={`transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "w-6 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                    : "w-1.5 h-1.5 rounded-full bg-white/30 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
