"use client";

import React, { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import EventsSection from "@/components/EventsSection";
import EventDetailModal from "@/components/EventDetailModal";
import EventRegistrationModal from "@/components/EventRegistrationModal";
import Footer from "@/components/Footer";
import EventsLoading from "@/components/EventsLoading";
import { FestEvent } from "@/types";
import { eventsData } from "@/data/eventsData";
import { usePageTransition } from "@/components/PageTransitionContext";

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<FestEvent | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [registrationEvent, setRegistrationEvent] = useState<FestEvent | null>(null);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
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
