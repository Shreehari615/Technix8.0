"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  X,
  Clock,
  Calendar,
  Sparkles,
  ArrowRight,
  Shield,
  MessageSquare,
  Gamepad2,
  Camera,
  MapPin,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { usePageTransition } from "./PageTransitionContext";

interface Day2NoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEvent?: (eventId: string) => void;
}

export default function Day2NoticeModal({
  isOpen,
  onClose,
  onOpenEvent,
}: Day2NoticeModalProps) {
  const { navigateTo } = usePageTransition();

  const day2Events = [
    {
      id: "shield-command-chaos",
      title: "SHIELD: Command The Chaos",
      subtitle: "IT Manager Challenge",
      character: "NICK FURY",
      venue: "BSN CR 204",
      timing: "Day 2 // 09:00 AM Onwards",
      fee: "₹200",
      feeLabel: "per participant",
      icon: Shield,
      accentColor: "#38BDF8", // Cyan / Tactical Blue
      glowColor: "rgba(56, 189, 248, 0.4)",
      badgeBg: "rgba(56, 189, 248, 0.15)",
    },
    {
      id: "civil-war-battle-of-ideas",
      title: "Civil War: Battle of Ideas",
      subtitle: "Tech Debate",
      character: "CAPTAIN AMERICA & IRON MAN",
      venue: "BSN CR 203",
      timing: "Day 2 // 09:00 AM Onwards",
      fee: "₹250",
      feeLabel: "per team",
      icon: MessageSquare,
      accentColor: "#F59E0B", // Amber Gold
      glowColor: "rgba(245, 158, 11, 0.4)",
      badgeBg: "rgba(245, 158, 11, 0.15)",
    },
    {
      id: "avengers-battleworld",
      title: "Avengers: Battleworld",
      subtitle: "BGMI Esports Tournament",
      character: "THOR & HULK",
      venue: "APJ Abdul Kalam Central Computing Lab CR 404 (Sir CV Raman Block)",
      timing: "Day 2 // 09:00 AM Onwards",
      fee: "₹400",
      feeLabel: "per squad",
      icon: Gamepad2,
      accentColor: "#10B981", // Emerald Gamma Green
      glowColor: "rgba(16, 185, 129, 0.4)",
      badgeBg: "rgba(16, 185, 129, 0.15)",
    },
    {
      id: "marvel-in-motion",
      title: "Marvel in Motion",
      subtitle: "Photography & Videography",
      character: "SPIDER-MAN",
      venue: "BSN CR 104",
      timing: "Day 2 // 09:00 AM Onwards",
      fee: "₹200",
      feeLabel: "per participant",
      icon: Camera,
      accentColor: "#EF4444", // Spider Crimson Red
      glowColor: "rgba(239, 68, 68, 0.4)",
      badgeBg: "rgba(239, 68, 68, 0.15)",
    },
  ];

  const handleRegisterClick = (eventId: string) => {
    onClose();
    if (onOpenEvent) {
      onOpenEvent(eventId);
    } else {
      navigateTo("/events", "OPENING REGISTRATION ARENA...");
    }
  };

  const handleViewAllEvents = () => {
    onClose();
    navigateTo("/events", "OPENING ARENA PROTOCOLS...");
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/85 backdrop-blur-xl animate-in fade-in duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#090C15]/95 border-2 border-red-500/70 shadow-[0_0_80px_rgba(239,68,68,0.45)] text-slate-100 overflow-hidden flex flex-col my-auto animate-in zoom-in-95 duration-200">
        
        {/* Ambient Cosmic Radial Background */}
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-red-600/25 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />

        {/* Header Bar */}
        <div className="relative z-10 px-5 sm:px-7 pt-5 pb-4 border-b border-white/10 bg-gradient-to-r from-red-950/60 via-black/40 to-black/60 flex items-start justify-between gap-4">
          <div>
            {/* Pulsing Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/50 text-red-400 font-mono-code text-[10px] sm:text-[11px] font-bold tracking-widest uppercase mb-2 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>⚡ FLASH DISPATCH // EXTENDED ENTRY</span>
            </div>

            <h2 className="font-heading font-black text-xl sm:text-2xl md:text-3xl uppercase tracking-wide text-white drop-shadow-md">
              DAY 2 REGISTRATIONS <span className="text-amber-400">OPEN</span>
            </h2>

            {/* Crucial Deadline Banner */}
            <div className="flex items-center gap-2 mt-1.5 text-xs sm:text-sm font-mono-code font-bold text-amber-300">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Open till: <span className="underline decoration-red-500 underline-offset-2 text-white">24th November, 8:30 AM</span></span>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-red-600 text-slate-300 hover:text-white transition-all border border-white/15 focus:outline-none cursor-pointer shrink-0 mt-0.5"
            aria-label="Close Announcement"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="relative z-10 p-5 sm:p-7 space-y-4 max-h-[68vh] overflow-y-auto">
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            The following <strong className="text-white">4 high-voltage events</strong> are taking place on <strong className="text-amber-400">Day 2</strong>. Online registrations &amp; spot entries remain open until <strong className="text-red-400 font-mono-code">November 24th at 8:30 AM</strong>:
          </p>

          {/* 4 Events Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {day2Events.map((ev) => {
              const IconComponent = ev.icon;
              return (
                <div
                  key={ev.id}
                  onClick={() => handleRegisterClick(ev.id)}
                  className="group relative p-4 rounded-2xl bg-black/60 border border-white/10 hover:border-white/30 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 hover:scale-[1.02] shadow-lg"
                  style={{
                    boxShadow: `0 8px 24px -8px ${ev.glowColor}`,
                  }}
                >
                  <div className="space-y-2">
                    {/* Top Row: Icon + Character Pill */}
                    <div className="flex items-center justify-between">
                      <div
                        className="p-2 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: ev.badgeBg, color: ev.accentColor }}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span
                        className="text-[9px] font-mono-code font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                        style={{
                          borderColor: `${ev.accentColor}55`,
                          color: ev.accentColor,
                          backgroundColor: "rgba(0,0,0,0.4)",
                        }}
                      >
                        {ev.character}
                      </span>
                    </div>

                    {/* Title & Subtitle */}
                    <div>
                      <h4 className="font-heading font-black text-sm sm:text-base text-white group-hover:text-amber-400 transition-colors uppercase leading-tight">
                        {ev.title}
                      </h4>
                      <p className="text-[11px] font-mono-code text-slate-400 mt-0.5">
                        {ev.subtitle}
                      </p>
                    </div>

                    {/* Venue & Timing */}
                    <div className="pt-1.5 space-y-1 text-[11px] font-mono-code text-slate-300">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2 text-slate-200 font-semibold">{ev.venue}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row: Fee & Quick CTA */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono-code">
                    <span className="font-black text-amber-300">
                      {ev.fee} <span className="text-[10px] text-slate-400 font-normal">({ev.feeLabel})</span>
                    </span>
                    <span className="text-[10px] font-bold text-white group-hover:text-red-400 flex items-center gap-1 transition-colors uppercase">
                      Register <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Important Info Note */}
          <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-[11px] text-amber-200/90 font-mono-code flex items-start gap-2.5">
            <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Note for Participants:</strong> Ensure your team arrives at the assigned venue prior to 8:30 AM with college ID cards. Spot registration counters open at 8:00 AM at the Main Gate.
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="relative z-10 px-5 sm:px-7 py-4 border-t border-white/10 bg-black/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-white/20 hover:border-white/40 text-slate-300 hover:text-white font-mono-code text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-center"
          >
            Acknowledge &amp; Close
          </button>

          <button
            onClick={handleViewAllEvents}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-heading font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all hover:scale-105 cursor-pointer text-center flex items-center justify-center gap-2"
          >
            <span>VIEW &amp; REGISTER NOW</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
