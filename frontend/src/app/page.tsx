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
  };

  const handleOpenEventRegistration = (eventId: string) => {
    const found = eventsData.find((e) => e.id === eventId);
    if (found) {
      setRegistrationEvent(found);
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

      {/* Pure Falak-Style Hero Screen (Standalone, no clutter below) */}
      <main className="flex-1 flex flex-col">
        <HeroSection
          onReplaySplash={handleReplaySplash}
          isSplashActive={showSplash}
        />
      </main>

      {/* Instant Direct Event Registration Modal */}
      <EventRegistrationModal
        event={registrationEvent}
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
      />
    </div>
  );
}
