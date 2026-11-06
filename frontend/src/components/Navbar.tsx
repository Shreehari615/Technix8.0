"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { usePageTransition } from "./PageTransitionContext";
import TechnixGraffitiLogo from "./TechnixGraffitiLogo";
import { Menu, X, Play, Shield } from "lucide-react";

interface NavbarProps {
  onReplaySplash?: () => void;
}

export default function Navbar({ onReplaySplash }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { navigateTo } = usePageTransition();

  useEffect(() => {
    let lastScrolled = false;
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      if (scrolled !== lastScrolled) {
        lastScrolled = scrolled;
        setIsScrolled(scrolled);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "EVENTS", href: "/events" },
    { name: "SCHEDULE", href: "/schedule" },
    { name: "PASSES", href: "/passes" },
    { name: "RULES", href: "/rules" },
  ];

  const handleNavClick = (e: React.MouseEvent, href: string, label: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    navigateTo(href, `OPENING ${label}...`);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 py-3 sm:py-3.5 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-200 ${isScrolled
          ? "bg-[#070A10]/95 backdrop-blur-md border-b border-slate-800/80 shadow-2xl"
          : "bg-transparent border-b border-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left: Stylized Brand Logo */}
          <Link
            href="/"
            onClick={(e) => handleNavClick(e, "/", "HOME")}
            className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none"
            aria-label="Technix 8.0 Home - BMSITM"
          >
            {/* BMSITM Official Seal */}
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 shrink-0 group-hover:scale-105 transition-transform duration-200">
              <Image
                src="/images/bmsit-logo-clean.png"
                alt="BMSITM"
                fill
                priority
                unoptimized
                className="object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
              />
            </div>

            {/* Subtle Divider */}
            <div className="h-6 sm:h-7 w-[1px] bg-white/20 group-hover:bg-red-500/50 transition-colors" />

            {/* Technix 8.0 Logo */}
            <div className="w-24 sm:w-28 md:w-32 h-auto group-hover:scale-105 transition-transform duration-200">
              <TechnixGraffitiLogo mode="nav" className="w-full h-auto" glow={false} />
            </div>
          </Link>

          {/* Center/Right: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-8">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href, link.name)}
                  className={`relative font-sans text-xs sm:text-[13px] tracking-[0.2em] uppercase font-bold transition-all py-1 cursor-pointer ${isActive ? "text-white" : "text-slate-300 hover:text-white"
                    }`}
                >
                  <span>{link.name}</span>
                  {/* Crimson Underline on Active Link */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-red-500 rounded-full shadow-[0_0_8px_#EF4444] animate-in fade-in zoom-in duration-200" />
                  )}
                </a>
              );
            })}

            {/* Admin Command Portal */}
            <a
              href="/admin"
              onClick={(e) => handleNavClick(e, "/admin", "ADMIN COMMAND MAINFRAME")}
              title="Admin Command Center"
              className={`p-1.5 rounded-full transition-all cursor-pointer ${pathname === "/admin"
                  ? "text-red-400 bg-red-950/40 border border-red-500/40"
                  : "text-slate-400 hover:text-red-400 hover:bg-white/5"
                }`}
            >
              <Shield className="w-3.5 h-3.5" />
            </a>

            {/* Replay Splash Intro Trigger */}
            {onReplaySplash && (
              <button
                onClick={onReplaySplash}
                title="Replay Loading Screen"
                className="p-1.5 rounded-full text-slate-400 hover:text-red-400 hover:bg-white/5 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            )}
          </nav>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#04060C]/98 backdrop-blur-xl border-b border-pink-900/30 px-6 py-6 transition-all animate-in fade-in slide-in-from-top-4 duration-200 shadow-2xl">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href, link.name)}
                  className={`font-sans text-sm tracking-[0.2em] uppercase font-bold py-1 border-b border-slate-800/40 ${isActive ? "text-red-400" : "text-slate-300"
                    }`}
                >
                  {link.name}
                </a>
              );
            })}

            {onReplaySplash && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onReplaySplash();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-slate-700 text-slate-300 font-mono-code text-xs"
              >
                <Play className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                REPLAY INTRO SCREEN
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
