"use client";

import React, { useState } from "react";
import {
  Mail,
  Search,
  CheckCircle2,
  Clock,
  Ticket,
  ChevronDown,
  ChevronUp,
  CalendarDays,
  MapPin,
  CreditCard,
  User,
  Building,
  Users,
  Printer,
} from "lucide-react";

interface RegistrationRow {
  id: string;
  pass_code: string;
  event_id: string;
  event_title: string;
  lead_name: string;
  email: string;
  phone: string;
  college_name: string;
  department: string;
  year_of_study: string;
  team_name?: string | null;
  members?: string[] | string | null;
  fee_amount: number;
  payment_method: string;
  utr_number?: string | null;
  payment_status: string;
  created_at: string;
}

function RegistrationCard({ reg }: { reg: RegistrationRow }) {
  const [expanded, setExpanded] = useState(false);

  const members: string[] = (() => {
    if (!reg.members) return [];
    if (Array.isArray(reg.members)) return reg.members.filter(Boolean);
    try { return JSON.parse(reg.members as string); } catch { return []; }
  })();

  const isVerified = reg.payment_status === "verified" || reg.payment_status === "paid_verified";
  const isPending = reg.payment_status === "paid_pending_verification";

  return (
    <div className="rounded-2xl bg-black/50 border border-white/10 hover:border-white/20 transition-all overflow-hidden">
      {/* Card Header */}
      <div className="flex items-start justify-between p-5 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Status dot */}
          <div className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1 ${isVerified ? "bg-emerald-500" : "bg-amber-400 animate-pulse"}`} />
          <div className="min-w-0">
            <p className="font-heading font-black text-white text-base sm:text-lg leading-tight truncate">
              {reg.event_title}
            </p>
            <p className="font-mono-code text-xs text-amber-400 font-bold mt-0.5 truncate">
              PASS: {reg.pass_code}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono-code font-bold uppercase tracking-widest border ${isVerified
              ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/40"
              : "bg-amber-950/40 text-amber-400 border-amber-500/40"
            }`}>
            {isVerified ? "✓ Verified" : "⏳ Pending"}
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
        </div>
      </div>

      {/* Collapsed preview row */}
      <div className="px-5 pb-4 flex flex-wrap gap-4 text-xs font-mono-code text-slate-200 font-medium border-t border-white/10 pt-3">
        <span className="flex items-center gap-1.5">
          <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
          ₹{reg.fee_amount} Paid
        </span>
        <span className="flex items-center gap-1.5">
          <CalendarDays className="w-3.5 h-3.5 text-amber-400" />
          Nov 23–24, 2026
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-blue-400" />
          BMSITM Yelahanka
        </span>
        {members.length > 0 && (
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-purple-400" />
            {members.length + 1} members
          </span>
        )}
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-white/10 p-5 space-y-3 bg-black/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DetailRow icon={<User className="w-3.5 h-3.5 text-blue-400" />} label="Participant" value={reg.lead_name} />
            <DetailRow icon={<Mail className="w-3.5 h-3.5 text-sky-400" />} label="Email" value={reg.email} />
            <DetailRow icon={<Building className="w-3.5 h-3.5 text-purple-400" />} label="College" value={`${reg.college_name} — ${reg.department} (${reg.year_of_study})`} />
            {reg.team_name && <DetailRow icon={<Users className="w-3.5 h-3.5 text-amber-400" />} label="Team" value={reg.team_name} />}
            {reg.utr_number && <DetailRow icon={<CreditCard className="w-3.5 h-3.5 text-emerald-400" />} label="UTR / Ref No." value={reg.utr_number} />}
          </div>

          {members.length > 0 && (
            <div className="pt-1">
              <p className="text-[11px] font-mono-code text-amber-300 font-bold uppercase tracking-widest mb-2">Squad Members</p>
              <div className="flex flex-wrap gap-2">
                {members.map((m, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-mono-code text-white font-medium">
                    #{i + 2}: {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Barcode-style pass */}
          <div className="mt-4 p-4 rounded-xl bg-black/80 border border-amber-500/30 text-center">
            <p className="font-mono-code text-[11px] text-slate-300 font-bold uppercase tracking-widest mb-1">Admission Passcode</p>
            <p className="font-heading font-black text-amber-400 text-2xl tracking-wider">{reg.pass_code}</p>
            <p className="font-mono-code text-[10px] tracking-[6px] text-slate-400 mt-2 select-none">||| | |||| | ||||| || ||| ||||</p>
          </div>

          <button
            onClick={() => window.print()}
            className="w-full mt-2 py-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center gap-2 text-xs font-mono-code font-bold text-white cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            PRINT THIS PASS
          </button>
        </div>
      )}
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[11px] font-mono-code text-slate-300 font-bold uppercase tracking-widest">{label}</p>
        <p className="text-xs text-white font-medium break-words mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function MyPassesLookup() {
  const [mode, setMode] = useState<"email" | "passcode">("email");
  const [lookupInput, setLookupInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [registrations, setRegistrations] = useState<RegistrationRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = lookupInput.trim();
    if (!query) return;

    setIsLoading(true);
    setError(null);
    setRegistrations(null);
    setSearched(false);

    try {
      if (mode === "email") {
        const res = await fetch(
          `/api/registrations?email=${encodeURIComponent(query.toLowerCase())}`
        );
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to look up registrations.");
        } else {
          setRegistrations(data.registrations || []);
          setSearched(true);
        }
      } else {
        const res = await fetch(
          `/api/registrations/${encodeURIComponent(query.toUpperCase())}`
        );
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || `No registration found with pass code ${query.toUpperCase()}`);
        } else if (data.registration) {
          setRegistrations([data.registration]);
          setSearched(true);
        } else {
          setRegistrations([]);
          setSearched(true);
        }
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full px-4 sm:px-6 pb-8 pt-6">
      {/* Section Header */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-7 h-7 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center">
          <Ticket className="w-4 h-4 text-red-400" />
        </div>
        <div>
          <h2 className="font-heading font-black text-white text-lg sm:text-xl uppercase tracking-wide">
            My Passes
          </h2>
          <p className="text-slate-300 text-xs font-mono-code">
            Look up your registered events by email or pass code
          </p>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex gap-2 p-1 bg-black/40 border border-white/10 rounded-xl mb-4 max-w-xs">
        <button
          type="button"
          onClick={() => {
            setMode("email");
            setError(null);
            setSearched(false);
          }}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-mono-code font-bold transition-all cursor-pointer ${
            mode === "email"
              ? "bg-red-600 text-white shadow-md"
              : "text-slate-400 hover:text-white"
          }`}
        >
          By Email
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("passcode");
            setError(null);
            setSearched(false);
          }}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-mono-code font-bold transition-all cursor-pointer ${
            mode === "passcode"
              ? "bg-red-600 text-white shadow-md"
              : "text-slate-400 hover:text-white"
          }`}
        >
          By Passcode
        </button>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <div className="relative flex-1">
          {mode === "email" ? (
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          ) : (
            <Ticket className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          )}
          <input
            type={mode === "email" ? "email" : "text"}
            required
            value={lookupInput}
            onChange={(e) => setLookupInput(e.target.value)}
            placeholder={
              mode === "email"
                ? "Enter your registration email..."
                : "Enter Passcode (e.g. TX8-12345)..."
            }
            className="w-full bg-black/60 border border-white/20 hover:border-white/30 focus:border-red-500/70 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-slate-400 outline-none transition-colors font-mono-code"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !lookupInput.trim()}
          className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-heading font-bold text-sm uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Search className="w-4 h-4" />
          {isLoading ? "..." : "Lookup"}
        </button>
      </form>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/30 text-red-300 text-sm font-mono-code mb-4">
          {error}
        </div>
      )}

      {/* No results */}
      {searched && registrations !== null && registrations.length === 0 && (
        <div className="text-center py-14 space-y-3">
          <div className="w-14 h-14 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center mx-auto">
            <Ticket className="w-6 h-6 text-slate-600" />
          </div>
          <p className="text-slate-400 text-sm font-mono-code">No registrations found for this email.</p>
          <p className="text-slate-300 text-xs">
            Make sure you used the same email during registration.
          </p>
        </div>
      )}

      {/* Results */}
      {registrations && registrations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-mono-code text-slate-400">
              <span className="text-white font-bold">{registrations.length}</span> registration{registrations.length !== 1 ? "s" : ""} found
            </p>
            <div className="flex items-center gap-4 text-[10px] font-mono-code text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Verified
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Pending
              </span>
            </div>
          </div>

          {registrations.map((reg) => (
            <RegistrationCard key={reg.id} reg={reg} />
          ))}

          <p className="text-center text-[10px] font-mono-code text-slate-400 pt-2">
            Payment verification may take up to 24 hours. Contact coordinators for urgent queries.
          </p>
        </div>
      )}

      {/* Default prompt */}
      {!searched && !isLoading && (
        <div className="text-center py-10 space-y-2">
          <div className="w-12 h-12 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center mx-auto">
            <Search className="w-5 h-5 text-slate-600" />
          </div>
          <p className="text-slate-300 text-sm font-mono-code">
            Enter your email to view your registered events
          </p>
        </div>
      )}
    </section>
  );
}
