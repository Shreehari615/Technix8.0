"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import EventsSection from "@/components/EventsSection";
import EventDetailModal from "@/components/EventDetailModal";
import EventRegistrationModal from "@/components/EventRegistrationModal";
import Footer from "@/components/Footer";
import { FestEvent } from "@/types";
import { eventsData } from "@/data/eventsData";
import { usePageTransition } from "@/components/PageTransitionContext";

export default function CulturalPage() {
  const [selectedEvent, setSelectedEvent] = useState<FestEvent | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [registrationEvent, setRegistrationEvent] = useState<FestEvent | null>(null);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const { navigateTo } = usePageTransition();

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
      <Navbar />

      <main className="flex-1 pt-20">
        <EventsSection
          onOpenEventDetails={handleOpenEventDetails}
          onSelectForRegistration={handleSelectForRegistration}
          initialCategory="cultural"
        />
      </main>

      <Footer onOpenEventDetails={handleOpenEventById} />

      <EventDetailModal
        event={selectedEvent}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onSelectForRegistration={handleSelectForRegistration}
      />

      <EventRegistrationModal
        event={registrationEvent}
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
      />
    </div>
  );
}
