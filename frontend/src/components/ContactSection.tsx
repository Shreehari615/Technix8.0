"use client";

import React, { useState } from "react";
import { festConfig } from "@/data/festConfig";
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2, Navigation, Compass } from "lucide-react";

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="relative py-24 px-4 bg-transparent overflow-hidden">
      {/* Background Marvel Ambient Lighting */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-950/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-cyan-500/30 text-cyan-400 font-mono-code text-xs tracking-widest uppercase mb-4">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            S.H.I.E.L.D. HELICARRIER COMMUNICATIONS
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black uppercase text-metallic-silver tracking-tight mb-4">
            DIRECT <span className="text-metallic-red">TRANSMISSION</span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Have questions regarding competition guidelines, accommodation, or transportation? Reach out directly to the TECHNIX 8.0 organizing control center.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column: Coordinates & Information */}
          <div className="space-y-6">
            <div className="p-8 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-xl space-y-6">
              <h3 className="font-heading text-xl font-bold text-white uppercase tracking-wide">
                AVENGERS BASE COMMAND
              </h3>

              <div className="space-y-4 text-sm font-sans">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-red-950/50 border border-red-500/40 text-red-400 flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono-code text-xs text-slate-400 block uppercase">
                      CAMPUS VENUE
                    </span>
                    <p className="font-bold text-white mt-0.5">{festConfig.institution.collegeName}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{festConfig.institution.address}</p>
                    <span className="font-mono-code text-xs text-cyan-400 mt-1 block">
                      COORDINATES: {festConfig.institution.coordinates}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-950/50 border border-cyan-500/40 text-cyan-400 flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono-code text-xs text-slate-400 block uppercase">
                      OFFICIAL DISPATCH
                    </span>
                    <a
                      href={`mailto:${festConfig.contact.officialEmail}`}
                      className="font-bold text-white hover:text-cyan-400 transition-colors block mt-0.5"
                    >
                      {festConfig.contact.officialEmail}
                    </a>
                    <span className="text-slate-400 text-xs">
                      Helpdesk: {festConfig.contact.inquiryEmail}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-950/50 border border-amber-500/40 text-amber-400 flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono-code text-xs text-slate-400 block uppercase">
                      EMERGENCY HOTLINE
                    </span>
                    <p className="font-bold text-white mt-0.5">{festConfig.contact.phonePrimary}</p>
                    <p className="text-slate-400 text-xs">
                      Alternate Line: {festConfig.contact.phoneSecondary}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tactical Map Mockup Container */}
            <div className="relative h-56 rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center p-6 text-center">
              <div className="absolute inset-0 bg-hex-grid opacity-30" />
              <div className="relative z-10 flex flex-col items-center">
                <Navigation className="w-8 h-8 text-cyan-400 animate-pulse mb-2" />
                <a
                  href={festConfig.institution.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-heading text-sm font-bold text-white hover:text-cyan-400 transition-colors"
                >
                  CAMPUS SECTOR GRID: BMSITM YELAHANKA BENGALURU
                </a>
                <span className="font-mono-code text-xs text-slate-400 mt-1">
                  GPS: {festConfig.institution.coordinates}
                </span>
                <a
                  href={festConfig.institution.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-mono-code text-cyan-400 mt-2 px-3 py-1 rounded bg-slate-950 border border-slate-800 hover:border-cyan-500 transition-colors"
                >
                  📍 OPEN IN GOOGLE MAPS
                </a>
                <span className="text-[11px] font-mono-code text-amber-400 mt-2 px-3 py-1 rounded bg-slate-950 border border-slate-800">
                  SHUTTLE BUS SERVICE AVAILABLE FROM METRO STATION
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="p-8 sm:p-10 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-xl">
            <h3 className="font-heading text-xl font-bold text-white uppercase tracking-wide mb-2 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-red-500" />
              TRANSMIT A MESSAGE
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mb-6">
              Our student coordinators respond within 2 to 4 hours during fest registration days.
            </p>

            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-heading text-xl font-bold text-white">TRANSMISSION RECEIVED</h4>
                <p className="text-slate-300 text-xs sm:text-sm max-w-sm mx-auto">
                  Thank you, <strong className="text-white">{name}</strong>. Your query has been forwarded to the fest desk. We will respond to <span className="text-cyan-400 font-mono-code">{email}</span>.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setName("");
                    setEmail("");
                    setSubject("");
                    setMessage("");
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-heading font-bold hover:bg-slate-700"
                >
                  SEND ANOTHER TRANSMISSION
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono-code text-slate-400 uppercase mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Peter Parker"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-slate-400 uppercase mb-1">
                    Your Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="peter.parker@dailybugle.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-slate-400 uppercase mb-1">
                    Subject / Topic *
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Question about Hulk Smash Gaming Hardware Rules"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-slate-400 uppercase mb-1">
                    Message Details *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details on your query..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-red-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-heading font-extrabold tracking-wider glow-red shadow-lg transition-all"
                >
                  <Send className="w-3.5 h-3.5 text-amber-300" />
                  DISPATCH TRANSMISSION
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
