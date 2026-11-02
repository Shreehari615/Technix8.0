"use client";

import React, { Suspense } from "react";
import Navbar from "@/components/Navbar";
import MyPassesLookup from "@/components/MyPassesLookup";
import Footer from "@/components/Footer";

export default function PassesPage() {
  return (
    <div className="min-h-screen bg-transparent text-slate-100 flex flex-col selection:bg-red-600 selection:text-white relative">
      {/* Dark gradient scrim so text stays legible over background image */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/70 pointer-events-none z-0" />

      <Navbar />

      <main className="flex-1 pt-20 sm:pt-24 pb-12 relative z-10">
        {/* Frosted-glass content wrapper */}
        <div className="w-full max-w-2xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl overflow-hidden">
            <Suspense
              fallback={
                <div className="py-24 text-center text-slate-300 font-mono-code text-sm">
                  INITIALIZING PASSES PORTAL...
                </div>
              }
            >
              <MyPassesLookup />
            </Suspense>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
