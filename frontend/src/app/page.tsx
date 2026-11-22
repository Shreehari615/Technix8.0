"use client";

import React, { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Day2NoticeModal from "@/components/Day2NoticeModal";
import EventRegistrationModal from "@/components/EventRegistrationModal";
import { eventsData } from "@/data/eventsData";
import { FestEvent } from "@/types";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [splashKey, setSplashKey] = useState(0);
  const [showDay2Notice, setShowDay2Notice] = useState(false);
  const [registrationEvent, setRegistrationEvent] = useState<FestEvent | null>(null);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  const handleReplaySplash = () => {
    setSplashKey((prev) => prev + 1);
    setShowSplash(true);
    setShowDay2Notice(false);
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
    // Automatically trigger the Day 2 Notice popup after splash screen transition
    setTimeout(() => {
      setShowDay2Notice(true);
    }, 450);
  };

  const handleOpenEventRegistration = (eventId: string) => {
    const found = eventsData.find((e) => e.id === eventId);
    if (found) {
      setRegistrationEvent(found);
      setShowDay2Notice(false);
      setIsRegistrationModalOpen(true);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#04060C] text-slate-100 flex flex-col selection:bg-pink-600 selection:text-white overflow-hidden">
      {/* Starting Flash Screen: Cinematic MARVEL × TECHNIX 8.0 FLIP Intro */}
      {showSplash && (
        <SplashScreen
          key={splashKey}
          onComplete={handleSplashComplete}
          holdDurationMs={3200}
          transitionDurationMs={1100}
          showLoadingBar={false}
        />
      )}

      {/* Sticky Navigation (Falak 26 Header Style) */}
      <Navbar onReplaySplash={handleReplaySplash} />

      {/* Floating Re-Open Badge for Day 2 Announcement */}
      {!showSplash && !showDay2Notice && (
        <div className="fixed bottom-5 right-5 z-40 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <button
            onClick={() => setShowDay2Notice(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-600 to-amber-600 text-white font-mono-code text-xs font-black uppercase tracking-wider shadow-[0_0_25px_rgba(239,68,68,0.5)] hover:scale-105 transition-all border border-amber-300/40 cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>⚡ Day 2 Events Notice</span>
          </button>
        </div>
      )}

      {/* Pure Falak-Style Hero Screen (Standalone, no clutter below) */}
      <main className="flex-1 flex flex-col">
        <HeroSection
          onReplaySplash={handleReplaySplash}
          isSplashActive={showSplash}
          onOpenDay2Notice={() => setShowDay2Notice(true)}
        />
      </main>

      {/* Beginning of Website Announcement Popup: Day 2 Events Open till 24th Nov 8:30 AM */}
      <Day2NoticeModal
        isOpen={showDay2Notice}
        onClose={() => setShowDay2Notice(false)}
        onOpenEvent={handleOpenEventRegistration}
      />

      {/* Instant Direct Event Registration Modal */}
      <EventRegistrationModal
        event={registrationEvent}
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
      />
    </div>
  );
}
