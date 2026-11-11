"use client";

import React, { useState } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { eventsData } from "@/data/eventsData";
import { festConfig } from "@/data/festConfig";
import { RegistrationSubmission } from "@/types";
import {
  Shield,
  Zap,
  Printer,
  Ticket,
  User,
  Mail,
  Phone,
  School,
  Users,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  CreditCard,
} from "lucide-react";
import UPIPaymentModal from "./UPIPaymentModal";

interface RegistrationSectionProps {
  preSelectedEventId?: string | null;
  onClearPreSelected?: () => void;
}

export default function RegistrationSection({
  preSelectedEventId,
  onClearPreSelected,
}: RegistrationSectionProps) {
  const [selectedEventId, setSelectedEventId] = useState<string>(
    preSelectedEventId || eventsData[0].id
  );

  const [leadName, setLeadName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [department, setDepartment] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("3rd Year");
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketData, setTicketData] = useState<RegistrationSubmission | null>(
    null
  );
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [pendingPassCode, setPendingPassCode] = useState("");

  const [prevPreSelected, setPrevPreSelected] = useState<string | null>(
    preSelectedEventId || null
  );
  if (preSelectedEventId && preSelectedEventId !== prevPreSelected) {
    setPrevPreSelected(preSelectedEventId);
    setSelectedEventId(preSelectedEventId);
  }

  const currentEvent =
    eventsData.find((e) => e.id === selectedEventId) || eventsData[0];
  const maxAdditionalMembers = Math.max(0, currentEvent.teamSize.max - 1);

  const handleMemberChange = (index: number, val: string) => {
    const updated = [...members];
    updated[index] = val;
    setMembers(updated);
  };

  const addMemberField = () => {
    if (members.length < maxAdditionalMembers) {
      setMembers([...members, ""]);
    }
  };

  const removeMemberField = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) return;

    // Generate easily memorable 5-digit pass code: e.g. TX8-54321
    const passCode = `TX8-${Math.floor(10000 + Math.random() * 90000)}`;

    setPendingPassCode(passCode);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentComplete = (paymentData: {
    utrNumber: string;
    screenshotUrl?: string;
    feeAmount: number;
  }) => {
    setIsPaymentModalOpen(false);

    const newTicket: RegistrationSubmission = {
      id: `reg-${Date.now()}`,
      timestamp: new Date().toISOString(),
      eventId: currentEvent.id,
      eventTitle: currentEvent.title,
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
      paymentStatus: "paid_pending_verification",
    };

    setTicketData(newTicket);

    // Confetti Blast
    try {
      confetti({
        particleCount: 110,
        spread: 75,
        origin: { y: 0.6 },
        colors: ["#E23636", "#F59E0B", "#38BDF8", "#FFFFFF"],
      });
    } catch (err) {
      // fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="register" className="relative w-full bg-transparent overflow-hidden">
      {/* ================================================================= */}
      {/* 1. TOP MARVEL ANNOUNCEMENT TICKER                                  */}
      {/* ================================================================= */}
      <div className="w-full bg-black/60 border-b border-white/10 text-[#CCCCCC] py-2 px-4 flex items-center justify-center text-[11px] sm:text-xs font-mono-code tracking-widest uppercase select-none z-20 relative">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          STREAM TECHNIX 8.0 EXCLUSIVELY AT FEST ARENAS • NOVEMBER 23 – 24, 2026 • BMSITM YELAHANKA BENGALURU
        </span>
      </div>

      {/* ================================================================= */}
      {/* 2. CINEMATIC HERO HEADER BANNER (MARVEL MOVIES STYLE)              */}
      {/* ================================================================= */}
      <div className="relative w-full min-h-[300px] sm:min-h-[340px] md:min-h-[380px] bg-gradient-to-b from-black/50 via-black/30 to-transparent flex items-center justify-center overflow-hidden">
        {/* Subtle Architectural Perspective / Glass Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-15">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="passes-hero-grid"
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
            <rect width="100%" height="100%" fill="url(#passes-hero-grid)" />
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

        {/* Centered Typography: PASSES Title */}
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 py-16 sm:py-20 md:py-24 flex flex-col items-center justify-center">
          <h1 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase text-white tracking-widest drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
            PASSES
          </h1>

          <p className="text-slate-200 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mt-4 font-sans font-normal tracking-wide leading-relaxed drop-shadow-md">
            Claim your official festival badge & credentials for TECHNIX 8.0
          </p>

          <div className="mt-5 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white/90 text-xs font-mono-code uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>NOVEMBER 23 – 24, 2026 • BMSITM YELAHANKA BENGALURU</span>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 3. GALLERY SHOWROOM CONTAINER WITH NEUMORPHIC CHASSIS               */}
      {/* ================================================================= */}
      <div className="w-full bg-transparent text-slate-100 pt-8 pb-24 px-4 sm:px-6 lg:px-8 border-t border-white/5 relative z-20">
        <div className="max-w-xl mx-auto">
          {/* Top Status & Security Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 mb-8 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-tech font-bold text-sm tracking-wider uppercase text-slate-300">
                OFFICIAL ADMISSION GATEWAY
              </span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#161719] border border-white/10 text-xs font-mono-code text-slate-300 neu-btn">
              <Shield className="w-3.5 h-3.5 text-red-500" />
              <span>COLLEGE ID CARD VERIFICATION MANDATORY</span>
            </div>
          </div>

          {/* Ticket View If Generated */}
          {ticketData ? (
            <div className="neu-chassis rounded-[36px] p-6 sm:p-8 md:p-10 border border-black/40 text-slate-100 shadow-2xl space-y-6 animate-in zoom-in-95 duration-300">
              {/* Ticket Header */}
              <div className="text-center pt-2 pb-1">
                <div className="w-14 h-14 rounded-full neu-btn mx-auto flex items-center justify-center text-[#F5B800] font-heading font-black text-xl mb-3">
                  TX8
                </div>
                <span className="font-mono-code text-[11px] text-slate-400 uppercase tracking-widest block">
                  OFFICIAL ADMISSION PASSCODE
                </span>
                <span className="font-heading text-2xl sm:text-3xl font-black text-[#F5B800] tracking-wider block mt-1 drop-shadow-sm">
                  {ticketData.passCode}
                </span>
                <span className="font-mono-code text-xs text-amber-300/90 font-bold block mt-1">
                  {festConfig.name} • BMSITM Yelahanka Bengaluru
                </span>
              </div>

              {/* Inset Ticket Cards */}
              <div className="space-y-3 text-xs">
                <div className="neu-inset rounded-2xl p-4">
                  <span className="text-[10px] font-mono-code text-slate-400 uppercase block">
                    REGISTERED PROTOCOL / ARENA
                  </span>
                  <span className="font-heading text-base font-bold text-white block mt-0.5">
                    {ticketData.eventTitle}
                  </span>
                  <span className="text-xs text-[#F5B800] font-mono-code font-bold">
                    {currentEvent.marvelCharacter}
                  </span>
                </div>

                {/* Payment Verification Proof Stamp */}
                <div className="neu-inset rounded-2xl p-4 bg-emerald-950/25 border border-emerald-500/40">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono-code text-emerald-400 uppercase font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      UPI PAYMENT CONFIRMED
                    </span>
                    <span className="text-xs font-mono-code font-black text-amber-300">
                      ₹{ticketData.feeAmount} PAID
                    </span>
                  </div>
                  {ticketData.utrNumber && (
                    <div className="text-xs text-slate-300 font-mono-code mt-1.5 flex items-center justify-between">
                      <span>UTR / REF NO:</span>
                      <span className="font-bold text-white tracking-widest font-mono-code">
                        {ticketData.utrNumber}
                      </span>
                    </div>
                  )}
                </div>

                <div className="neu-inset rounded-2xl p-4">
                  <span className="text-[10px] font-mono-code text-slate-400 uppercase block">
                    PARTICIPANT / TEAM LEAD
                  </span>
                  <span className="font-bold text-white text-sm block mt-0.5">
                    {ticketData.leadName}
                  </span>
                  <span className="text-slate-400 font-mono-code text-xs">
                    {ticketData.email} • {ticketData.phone}
                  </span>
                </div>

                <div className="neu-inset rounded-2xl p-4">
                  <span className="text-[10px] font-mono-code text-slate-400 uppercase block">
                    INSTITUTION / COLLEGE
                  </span>
                  <span className="font-bold text-white text-sm block mt-0.5">
                    {ticketData.collegeName}
                  </span>
                  <span className="text-slate-400 font-mono-code text-xs">
                    {ticketData.department} ({ticketData.yearOfStudy})
                  </span>
                </div>

                {ticketData.teamName && (
                  <div className="neu-inset rounded-2xl p-4">
                    <span className="text-[10px] font-mono-code text-slate-400 uppercase block">
                      SQUAD CODENAME
                    </span>
                    <span className="font-bold text-amber-400 text-sm block mt-0.5">
                      {ticketData.teamName}
                    </span>
                  </div>
                )}

                {ticketData.members.length > 0 && (
                  <div className="neu-inset rounded-2xl p-4">
                    <span className="text-[10px] font-mono-code text-slate-400 uppercase block mb-1.5">
                      ASSEMBLED ALLIES
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {ticketData.members.map((m, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-full bg-black/40 text-xs font-mono-code text-slate-300 border border-white/5"
                        >
                          Ally #{idx + 2}: {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Barcode */}
              <div className="pt-3 text-center">
                <div className="font-mono-code text-base tracking-[8px] text-slate-400 select-none">
                  ||| | |||| | ||||| || ||| ||||
                </div>
                <span className="font-mono-code text-[10px] text-slate-500 mt-1 block">
                  CRYPTOGRAPHIC HASH: {ticketData.id} • BMSITM YELAHANKA ENTRANCE
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 space-y-3">
                <button
                  onClick={handlePrint}
                  className="w-full neu-btn rounded-full py-3.5 text-center text-xs font-heading font-black text-[#F5B800] uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4 text-[#F5B800]" />
                  <span>PRINT ADMISSION PASS</span>
                </button>

                {/* View My Passes — navigates to the My Passes tab */}
                <a
                  href="/passes?tab=mypasses"
                  className="w-full neu-btn rounded-full py-3 text-center text-xs font-mono-code font-bold text-emerald-300 hover:text-white uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
                >
                  <Ticket className="w-4 h-4 text-emerald-400" />
                  <span>VIEW ALL MY REGISTERED EVENTS</span>
                </a>

                <button
                  onClick={() => {
                    setTicketData(null);
                    if (onClearPreSelected) onClearPreSelected();
                  }}
                  className="w-full neu-btn rounded-full py-3 text-center text-xs font-mono-code font-bold text-slate-300 hover:text-white uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>REGISTER ANOTHER PROTOCOL</span>
                </button>
              </div>
            </div>
          ) : (
            /* ============================================================== */
            /* DARK NEUMORPHIC SOFT-UI PHONE FORM (REFERENCE REPLICATION)      */
            /* ============================================================== */
            <div className="neu-chassis rounded-[36px] p-6 sm:p-8 md:p-10 border border-black/40 text-slate-100 shadow-2xl relative overflow-hidden">
              {/* Header: HAPPY ANNIVERSARY -> TECHNIX 8.0 • BMSIT YELAHANKA */}
              <div className="text-center pt-4 pb-4">
                <p className="font-mono-code text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-slate-400 uppercase">
                  TECHNIX 8.0 • BMSITM YELAHANKA
                </p>

                {/* Big Bold Golden Headline (GALERY TYPOGRAPHY -> EVENT TITLE / REGISTRATION) */}
                <h2 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl text-[#F5B800] uppercase tracking-wide mt-1 drop-shadow-sm">
                  {currentEvent.title.split("—")[0].trim()}
                </h2>

                <p className="text-[11px] font-mono-code text-slate-400 mt-1">
                  {currentEvent.category} Protocol • {currentEvent.teamSize.label} • Schedule: {currentEvent.scheduleTime}
                </p>
              </div>

              {/* Form with Inset Pill Inputs */}
              <form onSubmit={handleRegister} className="space-y-4">
                {/* Protocol / Arena Selector */}
                <div>
                  <div className="relative">
                    <select
                      value={selectedEventId}
                      onChange={(e) => setSelectedEventId(e.target.value)}
                      className="w-full neu-inset rounded-full h-12 px-6 text-white text-xs sm:text-sm focus:outline-none cursor-pointer appearance-none bg-[#161719]"
                    >
                      {eventsData.map((ev) => (
                        <option key={ev.id} value={ev.id} className="bg-[#161719] text-white py-1">
                          {ev.title} [{ev.marvelCharacter.split("—")[0].trim()}] — {ev.category}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                      ▼
                    </div>
                  </div>
                </div>

                {/* Event Hero Mini Badge */}
                <div className="neu-inset rounded-2xl p-3 flex items-center gap-3">
                  <div
                    className="relative w-12 h-12 rounded-xl overflow-hidden border flex-shrink-0 bg-slate-900 shadow-sm"
                    style={{ borderColor: currentEvent.heroTheme.accentColor }}
                  >
                    <Image
                      src={currentEvent.image}
                      alt={currentEvent.title}
                      fill
                      className="object-cover object-center"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: currentEvent.heroTheme.accentColor }}
                      />
                      <span className="text-[10px] font-mono-code font-bold text-[#F5B800] uppercase truncate">
                        {currentEvent.marvelCharacter}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-white truncate">
                      {currentEvent.shortDescription}
                    </p>
                    <div className="flex items-center justify-between text-[10px] font-mono-code text-slate-400 mt-1">
                      <span>Venue: {currentEvent.venue}</span>
                      <span className="text-amber-400 font-bold px-2 py-0.5 rounded bg-black/40 border border-amber-500/30">
                        FEE: {currentEvent.registrationFee}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Input 1: Full Legal Name */}
                <div>
                  <input
                    type="text"
                    required
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder="Full name ( Legal / College ID )"
                    className="w-full neu-inset rounded-full h-12 px-6 text-white placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none"
                  />
                </div>

                {/* Input 2: Phone number or email */}
                <div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Phone number or email ( Active email )"
                    className="w-full neu-inset rounded-full h-12 px-6 text-white placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none"
                  />
                </div>

                {/* Input 3: WhatsApp Contact */}
                <div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="WhatsApp / Phone ( Active number )"
                    className="w-full neu-inset rounded-full h-12 px-6 text-white placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none"
                  />
                </div>

                {/* Input 4: College or University */}
                <div>
                  <input
                    type="text"
                    required
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    placeholder="College or University ( e.g. BMSITM Bengaluru )"
                    className="w-full neu-inset rounded-full h-12 px-6 text-white placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none"
                  />
                </div>

                {/* Input 5: Department & Year of Study */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Department ( CS, IS, AI, etc. )"
                    className="w-full neu-inset rounded-full h-12 px-5 text-white placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none"
                  />

                  <div className="relative">
                    <select
                      value={yearOfStudy}
                      onChange={(e) => setYearOfStudy(e.target.value)}
                      className="w-full neu-inset rounded-full h-12 px-5 text-slate-300 text-xs sm:text-sm focus:outline-none cursor-pointer appearance-none bg-[#161719]"
                    >
                      <option value="1st Year" className="bg-[#161719] text-white">1st Year UG</option>
                      <option value="2nd Year" className="bg-[#161719] text-white">2nd Year UG</option>
                      <option value="3rd Year" className="bg-[#161719] text-white">3rd Year UG</option>
                      <option value="4th Year" className="bg-[#161719] text-white">4th Year UG</option>
                      <option value="Postgraduate" className="bg-[#161719] text-white">Postgraduate / MCA</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                      ▼
                    </div>
                  </div>
                </div>

                {/* Team / Squad codename if team event */}
                {currentEvent.teamSize.max > 1 && (
                  <div className="space-y-3 pt-1">
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="Team / Squad codename ( Optional )"
                      className="w-full neu-inset rounded-full h-12 px-6 text-white placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none"
                    />

                    {members.map((member, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          required
                          value={member}
                          onChange={(e) => handleMemberChange(idx, e.target.value)}
                          placeholder={`Squad Ally #${idx + 2} Full name`}
                          className="flex-1 neu-inset rounded-full h-11 px-5 text-white placeholder:text-slate-500 text-xs focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => removeMemberField(idx)}
                          className="neu-btn px-3 py-2 rounded-full text-slate-400 hover:text-red-400 text-xs cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ))}

                    {members.length < maxAdditionalMembers && (
                      <button
                        type="button"
                        onClick={addMemberField}
                        className="w-full neu-btn rounded-full py-2.5 text-center text-xs font-mono-code font-bold text-amber-400 uppercase tracking-wider cursor-pointer"
                      >
                        + ADD SQUAD ALLY ({members.length + 1}/{maxAdditionalMembers})
                      </button>
                    )}
                  </div>
                )}

                {/* Terms Agreement Checkbox */}
                <div className="pt-2 px-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-slate-700 text-amber-500 focus:ring-amber-400 bg-[#161719] cursor-pointer"
                    />
                    <span className="text-[11px] font-sans text-slate-400 leading-tight select-none">
                      I agree to TECHNIX 8.0 rules and verify that college ID will be presented at BMSITM Yelahanka.
                    </span>
                  </label>
                </div>

                {/* Primary Neumorphic Button: PROCEED TO UPI PAYMENT */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !agreedToTerms}
                    className="w-full neu-btn rounded-full py-3.5 sm:py-4 text-center cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <span className="font-heading font-black text-sm sm:text-base text-[#F5B800] uppercase tracking-wider flex items-center justify-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#F5B800]" />
                      <span>PROCEED TO UPI PAYMENT (₹{currentEvent.feeAmount})</span>
                    </span>
                  </button>
                </div>

                {/* Divider (Reference Style: '——— or ———') */}
                <div className="flex items-center gap-4 py-1">
                  <div className="flex-1 h-[1px] bg-black/40" />
                  <span className="text-xs font-mono-code text-slate-500 uppercase tracking-widest">
                    or
                  </span>
                  <div className="flex-1 h-[1px] bg-black/40" />
                </div>

                {/* Secondary Neumorphic Button: Facebook Log In -> BROWSE ALL PROTOCOLS */}
                <div>
                  <a
                    href="/events"
                    className="w-full neu-btn rounded-full py-3 px-6 text-center text-xs font-mono-code font-bold text-slate-300 hover:text-white uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#F5B800]" />
                    <span>BROWSE ALL PROTOCOLS IN EVENTS SHOWROOM</span>
                  </a>
                </div>

                {/* Footnote (Reference Style: 'Mau ngucapin ? bisa banget...') */}
                <div className="pt-3 pb-1 text-center text-[10px] sm:text-[11px] font-sans text-slate-400 leading-relaxed">
                  <p>
                    Need fest clearance? Passes are strictly verified at BMSITM Yelahanka gate entry.{" "}
                    <span className="text-[#F5B800] font-semibold">
                      Ensure your institution ID card is carried throughout November 23 – 24, 2026.
                    </span>
                  </p>
                  <p className="mt-3 font-mono-code text-[10px] text-slate-500">
                    @technix8.0_BMSITM
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* UPI Payment Modal */}
      <UPIPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        event={currentEvent}
        leadName={leadName}
        email={email}
        phone={phone}
        teamName={teamName}
        passCode={pendingPassCode}
        onPaymentComplete={handlePaymentComplete}
      />
    </section>
  );
}
