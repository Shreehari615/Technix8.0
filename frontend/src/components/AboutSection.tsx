"use client";

import React from "react";
import { festConfig } from "@/data/festConfig";
import { Shield, MapPin, Calendar, Users, Award, BookOpen, Layers } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="relative py-20 sm:py-28 px-4 bg-[#070912] border-t border-slate-900 overflow-hidden">
      {/* Background Marvel Ambient Lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-950/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-950/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/60 border border-red-500/30 text-red-400 font-mono-code text-xs tracking-widest uppercase mb-4">
            <Shield className="w-3.5 h-3.5 text-red-400" />
            THE FESTIVAL MANIFESTO
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase text-metallic-silver mb-6">
            MORE THAN A FEST. <span className="text-metallic-red">IT&apos;S AN ASSEMBLY.</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-sans">
            TECHNIX 8.0 brings together technology, creativity, competition, and culture. From coding challenges and strategic missions to gaming and stage performances, every participant has a chance to showcase their abilities.
          </p>
        </div>

        {/* Feature Pillars: Technology, Strategy, Culture */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {/* Pillar 1 */}
          <div className="relative p-8 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-red-500/50 transition-all duration-300 group shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-red-950/50 border border-red-500/40 flex items-center justify-center text-red-400 mb-6 group-hover:scale-110 group-hover:bg-red-900/40 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-xl font-bold text-white mb-3 tracking-wide">
              Cutting-Edge Technology
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Stress-test algorithms under Stark Tech protocol, build next-gen interfaces with Shuri, and dive into high-stakes debugging challenges designed for true engineers.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="relative p-8 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 group shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/50 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 group-hover:bg-cyan-900/40 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-xl font-bold text-white mb-3 tracking-wide">
              Strategic Command
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Under Nick Fury&apos;s S.H.I.E.L.D. directive, simulate enterprise crisis management, lead IT resource allocation, and defend your executive IT roadmap before the council.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="relative p-8 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 transition-all duration-300 group shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-amber-950/50 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 group-hover:bg-amber-900/40 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-xl font-bold text-white mb-3 tracking-wide">
              Culture &amp; Entertainment
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Rock out with Peter Quill&apos;s Guardians stage showdown, capture raw photojournalism as Peter Parker, and unleash pure esports adrenaline in the Hulk Smash Arena.
            </p>
          </div>
        </div>

        {/* Institutional Coordinates & Organization Dossier (Placeholders) */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-950/90 border border-red-900/40 backdrop-blur-md shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
            <div>
              <span className="font-mono-code text-xs text-amber-400 tracking-widest uppercase">
                HOST INSTITUTION DOSSIER
              </span>
              <h4 className="font-heading text-2xl sm:text-3xl font-black text-white mt-1">
                {festConfig.institution.collegeName}
              </h4>
              <p className="text-slate-400 text-sm mt-1">
                {festConfig.institution.universityName}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono-code">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-red-400" />
                <span>{festConfig.eventDateDisplay}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>{festConfig.institution.campus}</span>
              </div>
            </div>
          </div>

          {/* Committee Contacts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8 text-sm">
            <div>
              <span className="font-mono-code text-[11px] text-slate-500 uppercase tracking-wider block mb-1">
                Chief Patron
              </span>
              <p className="font-medium text-slate-200">{festConfig.coordination.patron}</p>
            </div>

            <div>
              <span className="font-mono-code text-[11px] text-slate-500 uppercase tracking-wider block mb-1">
                Fest Convenor
              </span>
              <p className="font-medium text-slate-200">{festConfig.coordination.convenor}</p>
            </div>

            <div>
              <span className="font-mono-code text-[11px] text-slate-500 uppercase tracking-wider block mb-1">
                Faculty Coordinators
              </span>
              {festConfig.coordination.facultyCoordinators.map((fac) => (
                <p key={fac.name} className="font-medium text-slate-300 text-xs mt-0.5">
                  {fac.name}
                </p>
              ))}
            </div>

            <div>
              <span className="font-mono-code text-[11px] text-slate-500 uppercase tracking-wider block mb-1">
                Student Presidents
              </span>
              {festConfig.coordination.studentPresidents.map((stu) => (
                <p key={stu.name} className="font-medium text-slate-300 text-xs mt-0.5">
                  {stu.name} ({stu.role})
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
