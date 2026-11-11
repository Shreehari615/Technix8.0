"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { festConfig } from "@/data/festConfig";
import { eventsData } from "@/data/eventsData";
import { usePageTransition } from "./PageTransitionContext";
import TechnixGraffitiLogo from "./TechnixGraffitiLogo";
import { ArrowUp, Mail } from "lucide-react";

interface FooterProps {
  onOpenEventDetails?: (eventId: string) => void;
}

export default function Footer({ onOpenEventDetails }: FooterProps) {
  const { navigateTo } = usePageTransition();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Cultural Arena", href: "/cultural" },
    { name: "Sports & Gaming", href: "/sports" },
    { name: "All Events", href: "/events" },
    { name: "Fest Schedule", href: "/schedule" },
    { name: "My Passes", href: "/passes" },
    { name: "Rules & Regulations", href: "/rules" },
  ];

  return (
    <footer className="relative bg-[#030509] border-t border-slate-900 text-slate-400 pt-16 pb-12 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10 pb-12 border-b border-slate-900">
          {/* Brand & Mission Statement */}
          <div className="max-w-md space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 shrink-0">
                <Image
                  src="/images/bmsit-logo-clean.png"
                  alt="BMSITM"
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
              <div className="h-7 w-[1px] bg-slate-800" />
              <div className="w-32 sm:w-36 h-auto">
                <TechnixGraffitiLogo mode="nav" className="w-full h-auto" glow={false} />
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              The premier intercollegiate technical and cultural convergence celebrating innovation, coding mastery, esports tournaments, and creative arts.
            </p>

            <div className="pt-2 text-xs font-mono-code text-pink-400">
              <a
                href={festConfig.institution.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-300 transition-colors underline underline-offset-2"
              >
                VENUE // {festConfig.institution.campus}
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href={festConfig.contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-pink-400 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                <span className="font-mono-code">@technix8.0</span>
              </a>
              <span className="text-slate-700">•</span>
              <a
                href={`mailto:${festConfig.contact.officialEmail}`}
                aria-label="Email"
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-pink-400 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="font-mono-code">{festConfig.contact.officialEmail}</span>
              </a>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div>
            <h4 className="font-heading text-xs font-bold text-white uppercase tracking-wider mb-4">
              QUICK NAVIGATION
            </h4>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2.5 text-xs sm:text-sm font-tech font-semibold">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => navigateTo(link.href, `OPENING ${link.name.toUpperCase()}...`)}
                    className="hover:text-pink-400 transition-colors text-left cursor-pointer"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Theme Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="max-w-2xl leading-relaxed text-center md:text-left">
            <p className="font-mono-code text-[11px] text-slate-500 mb-1 font-semibold uppercase">
              THE CONVERGENCE IS HERE:
            </p>
            <p className="text-[11px] text-slate-500 leading-normal">
              {festConfig.disclaimer}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 flex-shrink-0">
            <span className="text-center sm:text-right font-mono-code text-[11px]">
              © 2026 {festConfig.name} • All Rights Reserved.
            </span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-slate-900 hover:bg-pink-600 text-slate-400 hover:text-white transition-colors border border-slate-800 cursor-pointer"
              aria-label="Scroll back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
