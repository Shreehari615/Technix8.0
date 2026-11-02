"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-transparent text-slate-100 flex flex-col selection:bg-red-600 selection:text-white relative">
      <Navbar />

      <main className="flex-1 pt-28 pb-12 flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-md mx-auto p-8 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md">
          <p className="font-mono-code text-xs tracking-[0.25em] text-red-400 uppercase mb-2">
            MULTIVERSE ARCHIVES
          </p>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-wide mb-3">
            GALLERY COMING SOON
          </h1>
          <p className="text-xs text-slate-400 font-mono-code leading-relaxed">
            Exclusive festival captures, drone reels, and competition footage will be archived here during the event.
          </p>
        </div>
        <div className="w-full mt-12">
          <ContactSection />
        </div>
      </main>

      <Footer />
    </div>
  );
}
