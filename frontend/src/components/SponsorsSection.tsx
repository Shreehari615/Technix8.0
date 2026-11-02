"use client";

import React, { useState } from "react";
import Image from "next/image";
import { sponsorsData, sponsorTiersInfo } from "@/data/sponsorsData";
import { Sponsor, SponsorTier } from "@/types";
import { ExternalLink, Handshake, Shield, Sparkles, Asterisk } from "lucide-react";
import SponsorInquiryModal from "./SponsorInquiryModal";

export default function SponsorsSection() {
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  return (
    <section id="sponsors" className="relative py-24 px-4 bg-[#070912] border-t border-slate-900 overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-red-950/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-amber-500/30 text-amber-400 font-mono-code text-xs tracking-widest uppercase mb-4">
            <Handshake className="w-3.5 h-3.5 text-amber-400" />
            STRATEGIC ALLIANCES
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black uppercase text-metallic-silver tracking-tight mb-4">
            POWERED BY <span className="text-metallic-gold">OUR PARTNERS</span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Behind every great assembly are the visionaries who fuel the innovation. We extend our deepest gratitude to our industry partners, technology leaders, and patrons powering TECHNIX 8.0.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setIsInquiryOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-heading text-xs font-black tracking-wider shadow-lg shadow-amber-950/40 glow-gold transition-transform hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              BECOME A SPONSOR // PARTNER DECK
            </button>
          </div>
        </div>

        {/* Sponsor Tiers (Falak MIT Bengaluru Structure) */}
        <div className="space-y-16">
          {sponsorTiersInfo.map((tierInfo) => {
            const tierSponsors = sponsorsData.filter((s) => s.tier === tierInfo.tier);
            if (tierSponsors.length === 0) return null;

            return (
              <div key={tierInfo.tier} className="space-y-6">
                {/* Tier Header with Horizontal Rules */}
                <div className="flex items-center justify-center gap-4">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-slate-700 to-slate-800" />
                  <div className="flex flex-col items-center text-center px-4">
                    <span className="font-heading text-lg sm:text-xl font-black uppercase tracking-wider text-slate-100 flex items-center gap-2">
                      <Asterisk className="w-4 h-4 text-red-500" />
                      {tierInfo.title}
                      <Asterisk className="w-4 h-4 text-red-500" />
                    </span>
                    <span className="font-mono-code text-[11px] text-slate-400 max-w-md mt-1">
                      {tierInfo.subtitle}
                    </span>
                  </div>
                  <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-slate-700 to-slate-800" />
                </div>

                {/* Tier Grid of Signboards */}
                <div
                  className={`grid gap-6 ${
                    tierInfo.tier === "title"
                      ? "grid-cols-1 max-w-lg mx-auto"
                      : tierInfo.tier === "powered-by"
                      ? "grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto"
                      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto"
                  }`}
                >
                  {tierSponsors.map((sponsor) => (
                    <div
                      key={sponsor.id}
                      className="group relative rounded-2xl bg-slate-950/80 border border-slate-800/90 hover:border-slate-600 transition-all duration-300 overflow-hidden shadow-xl hover:-translate-y-1 flex flex-col"
                    >
                      {/* Signboard Top Bar */}
                      <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Asterisk className="w-3.5 h-3.5 text-red-400" />
                          <span className="font-mono-code text-[10px] uppercase tracking-wider font-semibold">
                            {tierInfo.badge}
                          </span>
                        </div>
                        <span className="font-mono-code text-[9px] uppercase px-2 py-0.5 rounded bg-slate-900 text-amber-400 border border-slate-700">
                          DEV PLACEHOLDER
                        </span>
                      </div>

                      {/* Generous Logo Frame Space */}
                      <div className="relative h-32 sm:h-36 p-6 flex items-center justify-center bg-slate-950/60">
                        <div className="relative w-full h-full max-w-[280px]">
                          <Image
                            src={sponsor.logo}
                            alt={`${sponsor.name} logo`}
                            fill
                            className="object-contain filter group-hover:brightness-110 transition-all duration-300"
                          />
                        </div>
                      </div>

                      {/* Signboard Caption */}
                      <div className="p-4 bg-slate-900/40 border-t border-slate-800/60 flex items-center justify-between gap-2 mt-auto">
                        <div className="min-w-0">
                          <h4 className="font-heading text-sm font-bold text-white truncate group-hover:text-amber-300 transition-colors">
                            {sponsor.name}
                          </h4>
                          <p className="font-mono-code text-xs text-slate-400 truncate mt-0.5">
                            {sponsor.role}
                          </p>
                        </div>

                        {sponsor.websiteUrl && (
                          <a
                            href={sponsor.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-600/80 text-slate-300 hover:text-white transition-colors flex-shrink-0"
                            aria-label={`Visit ${sponsor.name} website (placeholder)`}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Falak-Inspired Salute / Gratitude Outro Card */}
        <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-red-950/40 via-slate-950 to-blue-950/40 border border-slate-800 text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <span className="font-mono-code text-xs text-red-400 tracking-widest uppercase">
              TO OUR ALLIES &amp; INDUSTRY SPONSORS
            </span>
            <h3 className="font-heading text-3xl sm:text-4xl font-black uppercase text-white tracking-wide">
              THE AVENGERS <span className="text-amber-400">SALUTE</span>
            </h3>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto font-sans leading-relaxed">
              For backing our vision. For empowering collegiate student talent. For making this technological convergence possible. Together, we make TECHNIX 8.0.
            </p>
            <div className="pt-2">
              <span className="font-tech text-base font-bold text-amber-300 tracking-wider">
                — DEPARTMENT OF COMPUTER APPLICATIONS &amp; TECHNIX COMMITTEE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      <SponsorInquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
      />
    </section>
  );
}
