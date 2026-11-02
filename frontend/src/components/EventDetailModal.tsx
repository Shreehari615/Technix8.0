"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { FestEvent } from "@/types";
import { X, Users, Award, Shield, CheckCircle2, Phone, Mail, Zap, AlertCircle } from "lucide-react";

interface EventDetailModalProps {
  event: FestEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectForRegistration: (eventId: string) => void;
}

export default function EventDetailModal({
  event,
  isOpen,
  onClose,
  onSelectForRegistration,
}: EventDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !event) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-event-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/25 animate-in fade-in duration-200"
    >
      {/* Background image overlay — full-bleed D:\Technix8.0\background.jpeg */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden select-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/background.jpeg"
          alt="Technix Background"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-black/60 backdrop-blur-2xl border border-white/20 shadow-2xl text-slate-100 flex flex-col my-auto">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 hover:bg-red-600/80 text-white transition-colors border border-white/20 focus:outline-none focus:ring-2 focus:ring-red-400"
          aria-label="Close event details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Banner Header with Event SVG Visual */}
        <div className="relative w-full h-56 sm:h-72 bg-slate-950 overflow-hidden border-b border-slate-800">
          <Image
            src={event.image}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, 896px"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090D1A] via-[#090D1A]/50 to-transparent" />

          {/* Badge & Marvel Character Floating on Banner */}
          <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/70 border border-slate-700 text-xs font-mono-code text-amber-400 mb-2 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: event.heroTheme.accentColor }} />
                <span>{event.category.toUpperCase()} PROTOCOL</span>
                <span>•</span>
                <span className="text-white font-bold">{event.marvelCharacter}</span>
              </div>
              <h2
                id="modal-event-title"
                className="font-heading text-2xl sm:text-4xl font-black uppercase text-white tracking-wide drop-shadow-lg"
              >
                {event.title}
              </h2>
            </div>

            <div className="hidden sm:block">
              <span className="font-mono-code text-xs px-3 py-1.5 rounded-lg bg-red-950/80 border border-red-500/50 text-red-300 font-bold uppercase">
                {event.teamSize.label}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-8 space-y-8 flex-1">
          {/* TBD Alert Notice if applicable */}
          {event.isTBD && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-950/40 border border-amber-500/50 text-amber-200">
              <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0" />
              <div>
                <h4 className="font-heading font-bold text-sm tracking-wide">CLASSIFIED DOSSIER NOTICE</h4>
                <p className="text-xs text-amber-300/90 mt-0.5">
                  EVENT DETAILS COMING SOON. This slot is reserved for {event.marvelCharacter}. The final category, guidelines, and registration deadlines will be revealed shortly by the organizing committee.
                </p>
              </div>
            </div>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs font-mono-code">
            <div>
              <span className="text-slate-500 block mb-1">TEAM SIZE</span>
              <span className="text-white font-bold flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                {event.teamSize.label}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block mb-1">REGISTRATION FEE</span>
              <span className="text-white font-bold flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                {event.registrationFee}
              </span>
            </div>
          </div>

          {/* Prize Pool & Category Metadata */}
          {(event.winningPrize || event.runnerUpPrize || event.categoriesNote || event.maxEntries || event.eventFormat) && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-900/60 to-slate-900/40 border border-amber-500/30 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-6">
                {event.winningPrize && (
                  <div>
                    <span className="text-[10px] font-mono-code text-amber-400 block tracking-wider uppercase">
                      WINNING PRIZE
                    </span>
                    <span className="text-xl font-heading font-black text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">
                      {event.winningPrize}
                    </span>
                  </div>
                )}
                {event.runnerUpPrize && (
                  <div>
                    <span className="text-[10px] font-mono-code text-slate-400 block tracking-wider uppercase">
                      RUNNER-UP PRIZE
                    </span>
                    <span className="text-lg font-heading font-bold text-slate-200">
                      {event.runnerUpPrize}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {event.categoriesNote && (
                  <span className="px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono-code font-bold">
                    {event.categoriesNote}
                  </span>
                )}
                {event.maxEntries && (
                  <span className="px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300 text-[11px] font-mono-code font-bold">
                    Max: {event.maxEntries}
                  </span>
                )}
                {event.eventFormat && (
                  <span className="px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-[11px] font-mono-code font-bold">
                    {event.eventFormat}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Full Mission Narrative */}
          <div>
            <h3 className="font-heading text-lg font-bold text-white mb-2 tracking-wide flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-400" />
              EVENT DESCRIPTION
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
              {event.fullDescription}
            </p>
          </div>

          {/* Tagline Callout */}
          {event.tagline && (
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-red-950/40 via-amber-950/20 to-transparent border border-red-500/30 text-amber-300 font-heading text-xs sm:text-sm font-bold tracking-wide italic text-center">
              "{event.tagline}"
            </div>
          )}

          {/* Rules and Regulations (Listed in Two Parts) */}
          {event.rules && event.rules.length > 0 && (() => {
            const half = Math.ceil(event.rules.length / 2);
            const part1 = event.rules.slice(0, half);
            const part2 = event.rules.slice(half);

            return (
              <div>
                <h3 className="font-heading text-base sm:text-lg font-bold text-white mb-3 tracking-wide flex items-center gap-2">
                  <Shield className="w-4 h-4 text-red-400" />
                  RULES AND REGULATIONS
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {/* Part 1 */}
                  <div className="space-y-2.5">
                    {part1.map((rule, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800"
                      >
                        <span className="font-mono-code text-red-500 font-bold text-xs mt-0.5 flex-shrink-0">
                          {idx + 1}.
                        </span>
                        <span className="leading-relaxed">{rule}</span>
                      </div>
                    ))}
                  </div>

                  {/* Part 2 */}
                  <div className="space-y-2.5">
                    {part2.map((rule, idx) => {
                      const actualIdx = half + idx;
                      return (
                        <div
                          key={actualIdx}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800"
                        >
                          <span className="font-mono-code text-red-500 font-bold text-xs mt-0.5 flex-shrink-0">
                            {actualIdx + 1}.
                          </span>
                          <span className="leading-relaxed">{rule}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Coordinators (Below the Rules) */}
          {event.coordinators && event.coordinators.length > 0 && (
            <div className="pt-2">
              <h4 className="font-heading text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                COORDINATORS
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {event.coordinators.map((c, i) => (
                  <div
                    key={i}
                    className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/70 border border-slate-800"
                  >
                    <div>
                      <span className="font-bold text-slate-200 text-xs sm:text-sm block">{c.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono-code">Coordinator</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-300 font-mono-code text-xs">
                      <a
                        href={`tel:${c.phone}`}
                        className="flex items-center gap-1.5 hover:text-red-400 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-red-400" />
                        <span>{c.phone}</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="p-6 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-mono-code text-xs text-slate-400 text-center sm:text-left">
            <span>SECTOR: TECHNIX 8.0 // </span>
            <span className="text-amber-400 font-bold">{event.title}</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 text-xs font-heading font-bold"
            >
              CLOSE
            </button>
            <button
              onClick={() => {
                onClose();
                onSelectForRegistration(event.id);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-heading font-extrabold tracking-wider glow-red shadow-lg transition-transform hover:scale-105"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              REGISTER FOR THIS PROTOCOL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
