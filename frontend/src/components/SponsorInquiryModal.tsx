"use client";

import React, { useState, useEffect } from "react";
import { X, CheckCircle2, Shield, Send, Download, Award, Zap } from "lucide-react";
import { sponsorshipTiersPricing } from "@/data/sponsorsData";
import { festConfig } from "@/data/festConfig";

interface SponsorInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SponsorInquiryModal({ isOpen, onClose }: SponsorInquiryModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    interestedTier: "Vibranium Title Sponsor",
    message: "",
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sponsor-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#090D1A] border border-slate-700 shadow-2xl text-slate-100 p-6 sm:p-10 my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-900 hover:bg-red-600 text-white transition-colors border border-slate-800"
          aria-label="Close sponsorship inquiry"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-white">
              INQUIRY TRANSMITTED SUCCESSFULLY
            </h3>
            <p className="text-slate-300 text-sm max-w-md mx-auto">
              Thank you for assembling with {festConfig.name}. Our Head of Sponsorship &amp; Corporate Relations will reach out to <span className="text-amber-400 font-mono-code">{formData.email}</span> within 24 hours.
            </p>
            <div className="pt-4">
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="px-6 py-2.5 rounded-xl bg-slate-800 text-white font-heading text-xs font-bold hover:bg-slate-700"
              >
                RETURN TO FESTIVAL
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 font-mono-code text-xs uppercase mb-3">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                PARTNER PROSPECTUS // TECHNIX 8.0
              </div>
              <h2 id="sponsor-modal-title" className="font-heading text-2xl sm:text-3xl font-black text-white uppercase">
                ASSEMBLE AS A SPONSOR
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Align your brand with over 1,500+ top engineering minds, innovators, and creators across South India.
              </p>
            </div>

            {/* Sponsorship Tiers Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
              {sponsorshipTiersPricing.map((tier) => (
                <div
                  key={tier.name}
                  onClick={() => setFormData({ ...formData, interestedTier: tier.name })}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    formData.interestedTier === tier.name
                      ? "bg-red-950/40 border-red-500 shadow-md"
                      : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <span className="font-heading text-xs font-bold text-white block mb-1">
                    {tier.name}
                  </span>
                  <span className="font-mono-code text-xs text-amber-400 font-bold block mb-2">
                    {tier.amount}
                  </span>
                  <ul className="space-y-1">
                    {tier.perks.slice(0, 2).map((p, idx) => (
                      <li key={idx} className="text-[11px] text-slate-400 line-clamp-1">
                        • {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Direct Inquiry Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono-code text-slate-400 uppercase mb-1">
                    Organization / Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-red-500 focus:outline-none"
                    placeholder="e.g. Acme Tech Solutions"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-slate-400 uppercase mb-1">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-red-500 focus:outline-none"
                    placeholder="e.g. Jane Doe"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-slate-400 uppercase mb-1">
                    Official Corporate Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-red-500 focus:outline-none"
                    placeholder="e.g. jane@company.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-slate-400 uppercase mb-1">
                    Contact Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-red-500 focus:outline-none"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-code text-slate-400 uppercase mb-1">
                  Custom Requirements or Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-red-500 focus:outline-none"
                  placeholder="Tell us about your brand engagement goals, student recruitment interest, or custom booth expectations..."
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs font-mono-code text-slate-500">
                  Official Sponsor Desk: {festConfig.contact.sponsorshipEmail}
                </span>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white text-xs font-heading font-extrabold tracking-wider hover:from-red-500 hover:to-amber-500 glow-red transition-all"
                >
                  <Send className="w-3.5 h-3.5 text-amber-300" />
                  SUBMIT PARTNERSHIP INQUIRY
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
