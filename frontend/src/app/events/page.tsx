"use client";

import React, { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import EventsSection from "@/components/EventsSection";
import EventDetailModal from "@/components/EventDetailModal";
import EventRegistrationModal from "@/components/EventRegistrationModal";
import Footer from "@/components/Footer";
import EventsLoading from "@/components/EventsLoading";
import Day2NoticeModal from "@/components/Day2NoticeModal";
import { FestEvent } from "@/types";
import { eventsData } from "@/data/eventsData";
import { usePageTransition } from "@/components/PageTransitionContext";

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<FestEvent | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [registrationEvent, setRegistrationEvent] = useState<FestEvent | null>(null);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [showDay2Notice, setShowDay2Notice] = useState(false);
  const { navigateTo } = usePageTransition();

  // Events Loading Lifecycle: One-time smooth portal summon
  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const handleRetry = useCallback(() => {
    setIsLoading(true);
    setIsFadingOut(false);
    setLoadError(null);
  }, []);

  useEffect(() => {
    if (!eventsData || eventsData.length === 0) {
      setLoadError("No event protocols were found in the local dossier.");
      return;
    }

    const tFade = setTimeout(() => {
      setIsFadingOut(true);
      const tEnd = setTimeout(() => {
        setIsLoading(false);
      }, 350);
      return () => clearTimeout(tEnd);
    }, 650);

    return () => clearTimeout(tFade);
  }, []);

  const handleOpenEventDetails = (event: FestEvent) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };

  const handleOpenEventById = (eventId: string) => {
    const found = eventsData.find((e) => e.id === eventId);
    if (found) {
      setSelectedEvent(found);
      setIsDetailModalOpen(true);
    }
  };

  const handleSelectForRegistration = (eventId?: string) => {
    const found = eventsData.find((e) => e.id === eventId) || selectedEvent || eventsData[0];
    if (found) {
      setRegistrationEvent(found);
      setIsDetailModalOpen(false);
      setIsRegistrationModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-100 flex flex-col selection:bg-pink-600 selection:text-white relative">
      {/* Golden Spark Vortex Portal Loading Animation (Active only during Events Loading) */}
      {isLoading && (
        <EventsLoading
          error={loadError}
          onRetry={handleRetry}
          isFadingOut={isFadingOut}
        />
      )}

      <Navbar />

      <main className="flex-1 pt-20">
        <EventsSection
          onOpenEventDetails={handleOpenEventDetails}
          onSelectForRegistration={handleSelectForRegistration}
        />
      </main>

      <Footer onOpenEventDetails={handleOpenEventById} />

      {/* Floating Day 2 Events Notice Trigger */}
      <div className="fixed bottom-5 right-5 z-40 animate-in fade-in duration-300">
        <button
          onClick={() => setShowDay2Notice(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-600 to-amber-600 text-white font-mono-code text-xs font-black uppercase tracking-wider shadow-[0_0_25px_rgba(239,68,68,0.5)] hover:scale-105 transition-all border border-amber-300/40 cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span>⚡ Day 2 Events Notice</span>
        </button>
      </div>

      {/* Day 2 Announcement Modal */}
      <Day2NoticeModal
        isOpen={showDay2Notice}
        onClose={() => setShowDay2Notice(false)}
        onOpenEvent={(id) => {
          setShowDay2Notice(false);
          handleSelectForRegistration(id);
        }}
      />

      {/* Dossier Detail Modal */}
      <EventDetailModal
        event={selectedEvent}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onSelectForRegistration={handleSelectForRegistration}
      />

      {/* Hero Themed Registration Modal */}
      <EventRegistrationModal
        event={registrationEvent}
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
      />
    </div>
  );
}
