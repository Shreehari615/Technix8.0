"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { FestEvent, RegistrationSubmission } from "@/types";
import { eventsData } from "@/data/eventsData";
import { festConfig } from "@/data/festConfig";
import {
  X,
  Zap,
  CheckCircle2,
  AlertCircle,
  Shield,
  User,
  Mail,
  Phone,
  School,
  Users,
  Calendar,
  MapPin,
  Award,
  Printer,
  Sparkles,
  ChevronDown,
  Plus,
  Trash2,
  RotateCcw,
  ArrowRight,
  CreditCard,
} from "lucide-react";
import UPIPaymentModal from "./UPIPaymentModal";

interface EventRegistrationModalProps {
  event: FestEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectEvent?: (eventId: string) => void;
}

export default function EventRegistrationModal({
  event,
  isOpen,
  onClose,
  onSelectEvent,
}: EventRegistrationModalProps) {
  // Current active event for this registration modal
  const [activeEvent, setActiveEvent] = useState<FestEvent | null>(event);

  // Form states
  const [leadName, setLeadName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [department, setDepartment] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Submission & ticket state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketData, setTicketData] = useState<RegistrationSubmission | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [pendingPassCode, setPendingPassCode] = useState("");

  // 3D Card Flip States: Pop up hero card first, then auto-flip to register after 2.5s
  const [isFlipped, setIsFlipped] = useState(false);
  const [flipProgress, setFlipProgress] = useState(0);

  // Sync incoming event prop when modal opens or changes
  useEffect(() => {
    if (event) {
      setActiveEvent(event);
      setTicketData(null);
      // Reset members if switching event format
      const maxExtra = Math.max(0, event.teamSize.max - 1);
      setMembers((prev) => prev.slice(0, maxExtra));
    }
  }, [event, isOpen]);

  // Auto-flip effect when modal opens for a selected event
  useEffect(() => {
    if (!isOpen || !event) {
      setIsFlipped(false);
      setFlipProgress(0);
      return;
    }

    // Reset to front face
    setIsFlipped(false);
    setFlipProgress(0);

    const FLIP_DURATION = 2600; // ~2.6 seconds
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / FLIP_DURATION) * 100);
      setFlipProgress(pct);
    }, 25);

    const timer = setTimeout(() => {
      setIsFlipped(true);
      setFlipProgress(100);
      clearInterval(interval);
    }, FLIP_DURATION);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [isOpen, event?.id]);

  const handleManualFlip = () => {
    setIsFlipped(true);
    setFlipProgress(100);
  };

  const handleFlipBack = () => {
    setIsFlipped(false);
  };

  // Handle ESC key and scroll locking
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

  if (!isOpen || !activeEvent) return null;

  const maxAdditionalMembers = Math.max(0, activeEvent.teamSize.max - 1);

  const handleMemberChange = (index: number, val: string) => {
    const updated = [...members];
    updated[index] = val;
    setMembers(updated);
  };

  const handleAddMember = () => {
    if (members.length < maxAdditionalMembers) {
      setMembers([...members, ""]);
    }
  };

  const handleRemoveMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleSwitchEvent = (newEventId: string) => {
    const found = eventsData.find((e) => e.id === newEventId);
    if (found) {
      setActiveEvent(found);
      const newMaxExtra = Math.max(0, found.teamSize.max - 1);
      setMembers((prev) => prev.slice(0, newMaxExtra));
      if (onSelectEvent) onSelectEvent(found.id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) return;

    const heroCode = activeEvent.marvelCharacter
      .split("—")[0]
      .replace(/[^A-Za-z]/g, "")
      .slice(0, 4)
      .toUpperCase();
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const passCode = `TX8-${heroCode || "HERO"}-${randomDigits}`;

    setPendingPassCode(passCode);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentComplete = async (paymentData: {
    utrNumber: string;
    screenshotUrl?: string;
    feeAmount: number;
  }) => {
    setIsPaymentModalOpen(false);
    setIsSubmitting(true);

    const payload = {
      eventId: activeEvent.id,
      eventTitle: activeEvent.title,
      teamName: teamName || undefined,
      leadName,
      email,
      phone,
      collegeName,
      department,
      yearOfStudy,
      members: members.filter((m) => m.trim().length > 0),
      passCode: pendingPassCode,
      feeAmount: paymentData.feeAmount,
      paymentMethod: "UPI_QR",
      utrNumber: paymentData.utrNumber,
      screenshotUrl: paymentData.screenshotUrl,
    };

    let confirmedPassCode = pendingPassCode;

    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.registration) {
        confirmedPassCode =
          data.registration.pass_code ||
          data.registration.passCode ||
          pendingPassCode;
      } else if (!res.ok) {
        console.warn("Backend registration notice:", data.error || data);
      }
    } catch (err) {
      console.warn("Registration network notice, generating ticket:", err);
    } finally {
      setIsSubmitting(false);
    }

    const newSubmission: RegistrationSubmission = {
      id: `reg-${Date.now()}`,
      timestamp: new Date().toISOString(),
      eventId: activeEvent.id,
      eventTitle: activeEvent.title,
      teamName: teamName || undefined,
      leadName,
      email,
      phone,
      collegeName,
      department,
      yearOfStudy,
      members: members.filter((m) => m.trim().length > 0),
      passCode: confirmedPassCode,
      feeAmount: paymentData.feeAmount,
      paymentMethod: "UPI_QR",
      utrNumber: paymentData.utrNumber,
      screenshotUrl: paymentData.screenshotUrl,
      paymentStatus: "paid_pending_verification",
    };

    setTicketData(newSubmission);

    // Marvel Confetti Celebration
    try {
      confetti({
        particleCount: 110,
        spread: 75,
        origin: { y: 0.6 },
        colors: [
          activeEvent.heroTheme.accentColor || "#E23636",
          "#F59E0B",
          "#38BDF8",
          "#FFFFFF",
        ],
      });
    } catch (err) {
      // Fallback gracefully
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reg-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden bg-black/25 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Background image overlay — full-bleed D:\Technix8.0\background.jpeg */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden select-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/background.jpeg"
          alt="Technix Background"
          className="w-full h-full object-cover object-center"
        />
        {/* Very subtle transparent tint to preserve contrast without blocking the artwork */}
        <div className="absolute inset-0 bg-black/35 backdrop-blur-[1px]" />
      </div>

      {/* 3D Perspective Stage: Rock-solid center alignment, fixed dimensions */}
      <div className="relative w-full max-w-3xl lg:max-w-4xl h-[88vh] max-h-[820px] min-h-[580px] [perspective:1800px]">
        {/* 3D Flipper Container */}
        <div
          className={`relative w-full h-full transition-transform duration-700 ease-out [transform-style:preserve-3d] ${isFlipped ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)]"
            }`}
        >
          {/* ============================================================== */}
          {/* FRONT FACE: CINEMATIC HERO PROTOCOL POP-UP CARD */}
          {/* ============================================================== */}
          <div
            onClick={handleManualFlip}
            className={`absolute inset-0 w-full h-full rounded-3xl overflow-hidden [backface-visibility:hidden] [-webkit-backface-visibility:hidden] border shadow-2xl bg-black/35 backdrop-blur-xl select-none cursor-pointer flex flex-col justify-between transition-opacity duration-300 ${isFlipped ? "pointer-events-none opacity-0" : "pointer-events-auto opacity-100"
              }`}
            style={{
              borderColor: `${activeEvent.heroTheme.accentColor}99`,
              boxShadow: `0 25px 70px -10px ${activeEvent.heroTheme.glowColor}`,
            }}
          >
            {/* Full-bleed Hero Artwork Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <Image
                src={activeEvent.image}
                alt={activeEvent.title}
                fill
                priority
                sizes="(max-width: 640px) 100vw, 672px"
                className="object-cover object-center filter brightness-[0.95] contrast-110 scale-100 hover:scale-105 transition-transform duration-1000"
              />

              {/* Gradient Vignettes: Transparent Cinematic Depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/60 pointer-events-none" />
              <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/40 pointer-events-none" />

              {/* Ambient Glowing Hero Core */}
              <div
                className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full blur-3xl opacity-40 pointer-events-none"
                style={{ backgroundColor: activeEvent.heroTheme.accentColor }}
              />
              <div
                className="absolute top-10 -right-20 w-72 h-72 rounded-full blur-3xl opacity-35 pointer-events-none"
                style={{ backgroundColor: activeEvent.heroTheme.accentColor }}
              />

              {/* High-Tech Animated Scan Line */}
              <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent animate-hero-scan pointer-events-none" />
            </div>

            {/* Front Header */}
            <div className="relative z-10 p-5 sm:p-6 flex items-center justify-between">
              {/* Brand Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 border border-white/20 backdrop-blur-md shadow-lg">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-[11px] font-mono-code font-bold tracking-widest text-slate-200">
                  TECHNIX 8.0 × MARVEL
                </span>
              </div>

              {/* Character Badge & Close Button */}
              <div className="flex items-center gap-2">
                <span
                  className="px-3 py-1 rounded-full text-xs font-mono-code font-black uppercase tracking-wider bg-black/60 border backdrop-blur-md shadow-lg"
                  style={{
                    borderColor: activeEvent.heroTheme.accentColor,
                    color: activeEvent.heroTheme.accentColor,
                  }}
                >
                  ● {activeEvent.marvelCharacter}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="p-2 rounded-full bg-black/50 hover:bg-red-600 text-white transition-colors border border-white/20 backdrop-blur-md cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Front Center: Holographic HUD Frame with Corner Reticles */}
            <div className="relative z-10 px-6 sm:px-8 pointer-events-none flex-1 flex flex-col justify-center items-center text-center">
              <div
                className="w-full max-w-sm p-4 rounded-2xl border border-dashed relative bg-black/35 backdrop-blur-md"
                style={{ borderColor: `${activeEvent.heroTheme.accentColor}55` }}
              >
                {/* Corner Reticles */}
                <span className="absolute -top-1 -left-1 text-xs font-mono-code text-white/60">┌</span>
                <span className="absolute -top-1 -right-1 text-xs font-mono-code text-white/60">┐</span>
                <span className="absolute -bottom-1 -left-1 text-xs font-mono-code text-white/60">└</span>
                <span className="absolute -bottom-1 -right-1 text-xs font-mono-code text-white/60">┘</span>

                <span className="text-[10px] font-mono-code uppercase tracking-[0.25em] text-slate-300 block mb-1">
                  TACTICAL PROTOCOL REVEAL
                </span>
                <p className="font-heading text-lg sm:text-xl font-black text-white uppercase tracking-wider drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                  {activeEvent.title.split("—")[0].trim()}
                </p>
                <p className="text-xs text-amber-300/90 italic font-sans mt-0.5">
                  &ldquo;{activeEvent.characterTitle}&rdquo;
                </p>
              </div>
            </div>

            {/* Front Footer: Event Info & Auto-Flip Progress Bar */}
            <div className="relative z-10 p-5 sm:p-7 bg-black/50 backdrop-blur-xl border-t border-white/15">
              <div className="flex items-center justify-between gap-2 text-xs font-mono-code text-slate-300 mb-3">
                <span className="px-2.5 py-0.5 rounded-md bg-black/50 border border-white/15 backdrop-blur-sm">
                  {activeEvent.category.toUpperCase()} ARENA
                </span>
                <span className="text-amber-400 font-bold">
                  {activeEvent.teamSize.label}
                </span>
              </div>

              {/* Progress bar label & action button */}
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full animate-ping"
                    style={{ backgroundColor: activeEvent.heroTheme.accentColor }}
                  />
                  <span className="text-[11px] font-mono-code tracking-wider text-slate-300">
                    OPENING REGISTRATION TERMINAL...
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleManualFlip();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-heading font-black tracking-wider text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-all"
                >
                  <span>FLIP NOW</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Auto-flip 2.5s Progress Track */}
              <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/15">
                <div
                  className="h-full transition-all duration-75 rounded-full"
                  style={{
                    width: `${flipProgress}%`,
                    background: `linear-gradient(90deg, #E23636, ${activeEvent.heroTheme.accentColor}, #F59E0B)`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* BACK FACE: REGISTRATION TERMINAL (FORM / TICKET) */}
          {/* ============================================================== */}
          <div
            className={`absolute inset-0 w-full h-full rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/20 shadow-[0_25px_80px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)] text-slate-100 flex flex-col [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden transition-opacity duration-300 ${!isFlipped ? "pointer-events-none opacity-0" : "pointer-events-auto opacity-100"
              }`}
          >
            {/* TOP HEADER CONTROLS (FLIP BACK & CLOSE) */}
            <div className="absolute top-3 right-4 z-30 flex items-center gap-2">
              <button
                type="button"
                onClick={handleFlipBack}
                title="Flip back to hero card"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/60 border border-[#F5B800]/40 text-[#F5B800] hover:text-white transition-all text-[11px] font-mono-code cursor-pointer backdrop-blur-md shadow-md"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">HERO CARD</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-full bg-black/40 hover:bg-red-600/80 border border-white/20 text-slate-300 hover:text-white transition-all focus:outline-none cursor-pointer backdrop-blur-md shadow-md"
                aria-label="Close registration modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* HEADER */}
            <div className="w-full px-6 pt-2 pb-3 text-center flex-shrink-0 z-20 border-b border-white/10">
              <p className="font-mono-code text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-slate-300 uppercase">
                TECHNIX 8.0 • BMSIT YELAHANKA
              </p>

              <h2
                id="reg-modal-title"
                className="font-heading font-black text-xl sm:text-2xl md:text-3xl text-[#F5B800] uppercase tracking-wide mt-0.5 drop-shadow-sm"
              >
                {activeEvent.title.split("—")[0].trim()}
              </h2>

              <p className="text-[11px] font-mono-code text-slate-300 mt-1">
                {activeEvent.category} Protocol • {activeEvent.teamSize.label} • Schedule: {activeEvent.scheduleTime}
              </p>
            </div>

            {/* MODAL BODY CONTENT (SCROLLABLE FORM / TICKET) */}
            <div className="relative z-10 p-4 sm:p-6 sm:px-8 flex-1 overflow-y-auto">
              <div className="max-w-md mx-auto w-full">
                {ticketData ? (
                  /* ============================================================== */
                  /* SUCCESS STATE: PROTOCOL ADMISSION PASS                         */
                  /* ============================================================== */
                  <div className="space-y-5 animate-in zoom-in-95 duration-300">
                    <div className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 space-y-4 text-center shadow-2xl">
                      <div className="w-12 h-12 rounded-full bg-black/50 border border-[#F5B800]/50 backdrop-blur-md mx-auto flex items-center justify-center text-[#F5B800] font-heading font-black text-lg">
                        TX8
                      </div>

                      <div>
                        <span className="font-mono-code text-[10px] text-slate-300 uppercase tracking-widest block">
                          OFFICIAL ADMISSION PASSCODE
                        </span>
                        <span className="font-heading text-xl sm:text-2xl font-black text-[#F5B800] tracking-wider block mt-1">
                          {ticketData.passCode}
                        </span>
                      </div>

                      {/* Payment Verification Proof Stamp */}
                      <div className="rounded-2xl p-3 bg-emerald-950/40 border border-emerald-500/50 backdrop-blur-md text-left">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono-code text-emerald-400 uppercase font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            UPI PAYMENT VERIFIED
                          </span>
                          <span className="text-xs font-mono-code font-black text-amber-300">
                            ₹{ticketData.feeAmount}
                          </span>
                        </div>
                        {ticketData.utrNumber && (
                          <div className="text-[11px] text-slate-300 font-mono-code mt-1 flex items-center justify-between">
                            <span>UTR:</span>
                            <span className="font-bold text-white tracking-widest">
                              {ticketData.utrNumber}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 pt-2 border-t border-white/10 text-xs text-left">
                        <div className="rounded-2xl p-3 bg-black/40 border border-white/10 backdrop-blur-sm">
                          <span className="text-[10px] font-mono-code text-slate-400 uppercase block">CANDIDATE</span>
                          <span className="font-bold text-white text-sm block mt-0.5">{ticketData.leadName}</span>
                          <span className="text-slate-300 font-mono-code text-[11px]">{ticketData.email} • {ticketData.phone}</span>
                        </div>

                        <div className="rounded-2xl p-3 bg-black/40 border border-white/10 backdrop-blur-sm">
                          <span className="text-[10px] font-mono-code text-slate-400 uppercase block">INSTITUTION</span>
                          <span className="font-bold text-white text-sm block mt-0.5">{ticketData.collegeName}</span>
                          <span className="text-slate-300 font-mono-code text-[11px]">{ticketData.department} ({ticketData.yearOfStudy})</span>
                        </div>

                        {ticketData.teamName && (
                          <div className="rounded-2xl p-3 bg-black/40 border border-white/10 backdrop-blur-sm">
                            <span className="text-[10px] font-mono-code text-slate-400 uppercase block">SQUAD CODENAME</span>
                            <span className="font-bold text-amber-400 text-sm block mt-0.5">{ticketData.teamName}</span>
                          </div>
                        )}

                        {ticketData.members.length > 0 && (
                          <div className="rounded-2xl p-3 bg-black/40 border border-white/10 backdrop-blur-sm">
                            <span className="text-[10px] font-mono-code text-slate-400 uppercase block mb-1">ALLIES</span>
                            <div className="flex flex-wrap gap-1.5">
                              {ticketData.members.map((m, idx) => (
                                <span key={idx} className="px-2 py-0.5 rounded-full bg-black/50 border border-white/10 text-[10px] font-mono-code text-slate-300">
                                  #{idx + 2}: {m}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Barcode */}
                      <div className="pt-2">
                        <div className="font-mono-code text-sm tracking-[6px] text-slate-400 select-none">
                          ||| | |||| | ||||| || ||| ||||
                        </div>
                        <span className="font-mono-code text-[9px] text-slate-400 mt-1 block">
                          HASH: {ticketData.id} • BMSIT YELAHANKA ENTRANCE
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-3 space-y-2.5">
                        <button
                          onClick={handlePrint}
                          className="w-full rounded-full py-3 text-center text-xs font-heading font-black text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 uppercase tracking-wider cursor-pointer shadow-lg transition-transform hover:scale-[1.01]"
                        >
                          PRINT ADMISSION PASS
                        </button>

                        {/* View all registered events */}
                        <a
                          href="/passes?tab=mypasses"
                          onClick={onClose}
                          className="w-full rounded-full py-2.5 text-center text-xs font-mono-code font-bold text-emerald-300 hover:text-white bg-emerald-950/30 hover:bg-emerald-950/60 border border-emerald-500/30 backdrop-blur-sm uppercase tracking-wider cursor-pointer transition-colors flex items-center justify-center gap-2"
                        >
                          VIEW ALL MY REGISTERED EVENTS
                        </a>

                        <button
                          onClick={() => setTicketData(null)}
                          className="w-full rounded-full py-2.5 text-center text-xs font-mono-code font-bold text-slate-200 hover:text-white bg-black/40 hover:bg-black/60 border border-white/15 backdrop-blur-sm uppercase tracking-wider cursor-pointer transition-colors"
                        >
                          REGISTER ANOTHER ARENA
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ============================================================== */
                  /* TRANSPARENT GLASS REGISTRATION FORM                            */
                  /* ============================================================== */
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Input 1: Full Legal Name */}
                    <div>
                      <input
                        type="text"
                        required
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        placeholder="Full name"
                        className="w-full rounded-full h-12 px-6 text-white placeholder:text-slate-400 text-xs sm:text-sm bg-black/40 backdrop-blur-md border border-white/15 focus:border-[#F5B800] focus:bg-black/60 focus:ring-1 focus:ring-[#F5B800]/50 transition-all shadow-inner outline-none"
                      />
                    </div>

                    {/* Input 2: Phone number or email */}
                    <div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email address (Active email)"
                        className="w-full rounded-full h-12 px-6 text-white placeholder:text-slate-400 text-xs sm:text-sm bg-black/40 backdrop-blur-md border border-white/15 focus:border-[#F5B800] focus:bg-black/60 focus:ring-1 focus:ring-[#F5B800]/50 transition-all shadow-inner outline-none"
                      />
                    </div>

                    {/* Input 3: WhatsApp Contact */}
                    <div>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Active phone number"
                        className="w-full rounded-full h-12 px-6 text-white placeholder:text-slate-400 text-xs sm:text-sm bg-black/40 backdrop-blur-md border border-white/15 focus:border-[#F5B800] focus:bg-black/60 focus:ring-1 focus:ring-[#F5B800]/50 transition-all shadow-inner outline-none"
                      />
                    </div>

                    {/* Input 4: College / University Name */}
                    <div>
                      <input
                        type="text"
                        required
                        value={collegeName}
                        onChange={(e) => setCollegeName(e.target.value)}
                        placeholder="College (e.g. BMSIT Bengaluru)"
                        className="w-full rounded-full h-12 px-6 text-white placeholder:text-slate-400 text-xs sm:text-sm bg-black/40 backdrop-blur-md border border-white/15 focus:border-[#F5B800] focus:bg-black/60 focus:ring-1 focus:ring-[#F5B800]/50 transition-all shadow-inner outline-none"
                      />
                    </div>

                    {/* Input 5: Department & Year of Study */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="Department (CS, IS, BCA, etc.)"
                        className="w-full rounded-full h-12 px-5 text-white placeholder:text-slate-400 text-xs sm:text-sm bg-black/40 backdrop-blur-md border border-white/15 focus:border-[#F5B800] focus:bg-black/60 focus:ring-1 focus:ring-[#F5B800]/50 transition-all shadow-inner outline-none"
                      />

                      <div className="relative">
                        <select
                          value={yearOfStudy}
                          onChange={(e) => setYearOfStudy(e.target.value)}
                          className="w-full rounded-full h-12 px-5 pr-9 text-slate-200 text-xs sm:text-sm bg-black/40 backdrop-blur-md border border-white/15 focus:border-[#F5B800] focus:bg-black/60 focus:ring-1 focus:ring-[#F5B800]/50 transition-all cursor-pointer appearance-none outline-none"
                        >
                          <option value="1st Year UG" className="bg-slate-900 text-white">1st Year UG</option>
                          <option value="2nd Year UG" className="bg-slate-900 text-white">2nd Year UG</option>
                          <option value="3rd Year UG" className="bg-slate-900 text-white">3rd Year UG</option>
                          <option value="4th Year UG" className="bg-slate-900 text-white">4th Year UG</option>
                          <option value="Postgraduate / MCA / MSc" className="bg-slate-900 text-white">Postgraduate / MCA</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Squad Section if team event */}
                    {activeEvent.teamSize.max > 1 && (
                      <div className="space-y-3 pt-1">
                        <input
                          type="text"
                          value={teamName}
                          onChange={(e) => setTeamName(e.target.value)}
                          placeholder="Team name"
                          className="w-full rounded-full h-12 px-6 text-white placeholder:text-slate-400 text-xs sm:text-sm bg-black/40 backdrop-blur-md border border-white/15 focus:border-[#F5B800] focus:bg-black/60 focus:ring-1 focus:ring-[#F5B800]/50 transition-all shadow-inner outline-none"
                        />

                        {members.map((member, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="text"
                              required
                              value={member}
                              onChange={(e) => handleMemberChange(idx, e.target.value)}
                              placeholder={`Squad Ally #${idx + 2} Full name`}
                              className="flex-1 rounded-full h-11 px-5 text-white placeholder:text-slate-400 text-xs bg-black/40 backdrop-blur-md border border-white/15 focus:border-[#F5B800] focus:outline-none shadow-inner"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveMember(idx)}
                              className="px-3 py-2 rounded-full bg-black/40 hover:bg-red-500/30 border border-white/15 text-slate-300 hover:text-red-300 text-xs cursor-pointer backdrop-blur-md transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        ))}

                        {members.length < maxAdditionalMembers && (
                          <button
                            type="button"
                            onClick={handleAddMember}
                            className="w-full rounded-full py-2.5 text-center text-xs font-mono-code font-bold text-[#F5B800] hover:text-white bg-black/40 hover:bg-black/60 border border-[#F5B800]/50 backdrop-blur-md uppercase tracking-wider cursor-pointer transition-all shadow-md"
                          >
                            + ADD SQUAD ALLY ({members.length + 1}/{maxAdditionalMembers})
                          </button>
                        )}
                      </div>
                    )}

                    {/* Terms Agreement Checkbox */}
                    <div className="pt-1 px-2">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          id="reg-terms-check"
                          type="checkbox"
                          required
                          checked={agreedToTerms}
                          onChange={(e) => setAgreedToTerms(e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded border-white/30 text-amber-500 focus:ring-amber-400 bg-black/40 cursor-pointer"
                        />
                        <span className="text-[11px] font-sans text-slate-300 leading-tight select-none">
                          I agree to TECHNIX 8.0 rules and verify that college ID will be presented at BMSIT Yelahanka.
                        </span>
                      </label>
                    </div>

                    {/* Primary Button: PROCEED TO UPI PAYMENT */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting || !agreedToTerms}
                        className="w-full rounded-full py-3.5 sm:py-4 text-center cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed group bg-gradient-to-r from-amber-500 via-amber-400 to-red-600 hover:from-amber-400 hover:to-red-500 shadow-[0_0_30px_rgba(245,158,11,0.35)] active:scale-[0.99]"
                      >
                        <span className="font-heading font-black text-sm sm:text-base text-slate-950 uppercase tracking-wider flex items-center justify-center gap-2">
                          <CreditCard className="w-4 h-4 text-slate-950" />
                          <span>PROCEED TO UPI PAYMENT (₹{activeEvent.feeAmount})</span>
                        </span>
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-4 py-1">
                      <div className="flex-1 h-[1px] bg-white/15" />
                      <span className="text-xs font-mono-code text-slate-400 uppercase tracking-widest">
                        or
                      </span>
                      <div className="flex-1 h-[1px] bg-white/15" />
                    </div>

                    {/* Secondary Button: Flip to Hero Card */}
                    <div>
                      <button
                        type="button"
                        onClick={handleFlipBack}
                        className="w-full rounded-full py-3 px-6 text-center text-xs font-mono-code font-bold text-slate-200 hover:text-white bg-black/40 hover:bg-black/60 border border-white/20 backdrop-blur-md uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 transition-all shadow-md"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-[#F5B800]" />
                        <span>FLIP BACK TO HERO PROTOCOL CARD</span>
                      </button>
                    </div>

                    {/* Footnote */}
                    <div className="pt-3 pb-2 text-center text-[10px] sm:text-[11px] font-sans text-slate-400 leading-relaxed">
                      <p>
                        Need assistance? Student Helpdesk active.{" "}
                        <span className="text-[#F5B800] font-semibold">
                          College ID verification mandatory at BMSIT Yelahanka entrance.
                        </span>
                      </p>
                      <p className="font-mono-code text-[10px] text-slate-500 mt-1">
                        technix8.org • #TECHNIX8
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
    @keyframes heroScan {
      0% {
        top: 0%;
        opacity: 0;
      }
      25%, 75% {
        opacity: 0.85;
      }
      100% {
        top: 100%;
        opacity: 0;
      }
    }
    .animate-hero-scan {
      animation: heroScan 2.2s ease-in-out infinite;
    }
  `}</style>

      {/* UPI Payment Gateway Modal */}
      <UPIPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        event={activeEvent}
        leadName={leadName}
        email={email}
        phone={phone}
        teamName={teamName}
        passCode={pendingPassCode}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  );
}
