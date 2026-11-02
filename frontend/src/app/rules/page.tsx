"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Phone } from "lucide-react";

const rules = [
  {
    id: 1,
    title: "Eligibility",
    content:
      "Undergraduate and postgraduate students enrolled in BCA, B.Sc., BBA, B.Com., engineering and MCA programmes are eligible to take part.",
  },
  {
    id: 2,
    title: "Registration",
    content:
      "Participants may register online or offline. On-the-spot registration will also be available, subject to slot availability. The deadline for online registration is 15 November. On-the-spot registration will take place on 17 November, from 8:00 AM to 9:30 AM.",
  },
  {
    id: 3,
    title: "Registration Proof and Identity",
    content:
      "Every participant must carry proof of registration and a valid college identity card. These documents must be produced during registration and whenever requested throughout the event.",
  },
  {
    id: 4,
    title: "Team Composition",
    content:
      "All members of a team must be students of the same college. Teams comprising students from different colleges are not permitted.",
  },
  {
    id: 5,
    title: "Minimum Participation",
    content:
      "An event will be conducted only if at least five teams register. The organisers may cancel or modify an event if this minimum requirement is not met.",
  },
  {
    id: 6,
    title: "Individual Participation",
    content:
      "Each student may register for only one event, as all events will take place simultaneously.",
  },
  {
    id: 7,
    title: "Electronic Devices",
    content:
      "Participants must bring their own laptops, mobile phones and any other electronic devices required for their respective events. Personal devices will not be supplied by the college.",
  },
  {
    id: 8,
    title: "Reporting Time",
    content:
      "Participants must report to the registration desk on time. The registration counter will remain open from 8:00 AM to 9:30 AM on the designated registration day.",
  },
  {
    id: 9,
    title: "Event Schedule",
    content:
      "All events will begin according to the published schedule. Participants are expected to arrive punctually; late arrivals or delays may not be accommodated.",
  },
  {
    id: 10,
    title: "Registration Fee",
    content:
      "Registration fees are non-refundable, unless the organising committee announces otherwise.",
  },
  {
    id: 11,
    title: "Code of Conduct",
    content:
      "Participants are expected to maintain discipline and appropriate conduct throughout the fest. Misbehaviour, indiscipline, vulgarity in attire, communication or conduct, harassment, cheating or malpractice may lead to immediate disqualification.",
  },
  {
    id: 12,
    title: "Prohibited Substances",
    content:
      "Smoking, alcohol, drugs and all other intoxicating or state-altering substances are strictly prohibited on campus. Any violation will result in disqualification.",
  },
  {
    id: 13,
    title: "Food and Accommodation",
    content:
      "Lunch will be provided to registered participants. Accommodation will not be arranged by the organisers.",
  },
  {
    id: 14,
    title: "Personal Belongings",
    content:
      "The organising institution and management will not be liable for the loss, theft or damage of participants' personal belongings or valuables. Participants are responsible for looking after their possessions.",
  },
  {
    id: 15,
    title: "Overall Championship",
    content:
      "Separate overall championship titles will be awarded in the UG and PG categories. In each category, the title will go to the college that earns the highest total points across the events.",
  },
  {
    id: 16,
    title: "Judgement and Results",
    content:
      "Decisions made by the judges, jury and event coordinators will be final and binding on all participants. Any concerns regarding evaluation or results will be handled only through the procedure announced by the organisers.",
  },
  {
    id: 17,
    title: "Changes to Events",
    content:
      "If unforeseen circumstances or administrative requirements arise, the organisers reserve the right to revise event rules, reschedule, postpone or cancel an event. Participants will be informed of any such changes.",
  },
];

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-transparent text-slate-100 flex flex-col selection:bg-red-600 selection:text-white relative">
      <Navbar />

      <main className="flex-1 pt-16">
        {/* Top Ticker */}
        <div className="w-full bg-black/60 border-b border-white/10 text-[#CCCCCC] py-2 px-4 flex items-center justify-center text-[11px] sm:text-xs font-mono-code tracking-widest uppercase select-none z-20 relative">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            TECHNIX 8.0 GENERAL RULES &amp; REGULATIONS • BMSIT YELAHANKA
          </span>
        </div>

        {/* Hero Header */}
        <div className="relative w-full py-12 sm:py-16 bg-gradient-to-b from-black/60 via-black/30 to-transparent flex items-center justify-center">
          <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 font-mono-code text-xs tracking-widest uppercase mb-4">
              <Shield className="w-3.5 h-3.5" />
              DIRECTIVE
            </div>

            <h1 className="font-heading font-black text-4xl sm:text-5xl uppercase text-white tracking-widest drop-shadow-[0_4px_20px_rgba(0,0,0,0.7)]">
              RULES &amp;{" "}
              <span className="text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.6)]">
                REGULATIONS
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base mt-3 max-w-xl mx-auto">
              General guidelines for all participants of Technix 8.0.
            </p>
          </div>
        </div>

        {/* Rules - Simple One by One List */}
        <div className="w-full px-4 sm:px-6 lg:px-8 pb-24 relative z-10">
          <div className="max-w-3xl mx-auto space-y-4">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="p-5 sm:p-6 rounded-2xl bg-black/50 border border-white/10 hover:border-red-500/40 backdrop-blur-sm transition-all"
              >
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="font-mono-code text-red-500 font-bold text-sm sm:text-base flex-shrink-0">
                    {rule.id < 10 ? `0${rule.id}` : rule.id}.
                  </span>
                  <h2 className="font-heading font-bold text-base sm:text-lg text-white uppercase tracking-wide">
                    {rule.title}
                  </h2>
                </div>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed pl-7 sm:pl-8 font-sans">
                  {rule.content}
                </p>
              </div>
            ))}

            {/* Faculty Coordinators Section */}
            <div className="p-6 sm:p-7 rounded-2xl bg-black/55 border border-white/15 hover:border-red-500/40 backdrop-blur-sm transition-all shadow-xl">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <h2 className="font-heading font-black text-base sm:text-lg text-white uppercase tracking-wider">
                  FACULTY COORDINATORS
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white/[0.04] border border-white/10 hover:border-red-500/30 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono-code text-red-500 font-bold text-sm shrink-0">1.</span>
                    <div className="min-w-0">
                      <span className="font-heading font-bold text-white text-sm sm:text-base tracking-wide whitespace-nowrap block">
                        Dr. Drakshaveni G
                      </span>
                      <span className="text-xs font-mono-code text-slate-400 block">Faculty Coordinator</span>
                    </div>
                  </div>
                  <a
                    href="tel:+919972884530"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/15 hover:bg-red-600/30 text-red-300 hover:text-white border border-red-500/30 text-xs font-mono-code transition-all shrink-0 whitespace-nowrap self-start sm:self-auto"
                  >
                    <Phone className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span>+91 99728 84530</span>
                  </a>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white/[0.04] border border-white/10 hover:border-red-500/30 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono-code text-red-500 font-bold text-sm shrink-0">2.</span>
                    <div className="min-w-0">
                      <span className="font-heading font-bold text-white text-sm sm:text-base tracking-wide whitespace-nowrap block">
                        Prof. Nirupama B K
                      </span>
                      <span className="text-xs font-mono-code text-slate-400 block">Faculty Coordinator</span>
                    </div>
                  </div>
                  <a
                    href="tel:+919686773741"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/15 hover:bg-red-600/30 text-red-300 hover:text-white border border-red-500/30 text-xs font-mono-code transition-all shrink-0 whitespace-nowrap self-start sm:self-auto"
                  >
                    <Phone className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span>+91 96867 73741</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
