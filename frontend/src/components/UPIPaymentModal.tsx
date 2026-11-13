"use client";

import React, { useState } from "react";
import { festConfig } from "@/data/festConfig";
import { FestEvent } from "@/types";
import {
  X,
  CreditCard,
  Check,
  Copy,
  ShieldCheck,
  Smartphone,
  AlertCircle,
  Lock,
  ArrowRight,
  Upload,
} from "lucide-react";

interface UPIPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: FestEvent;
  leadName: string;
  email: string;
  phone: string;
  teamName?: string;
  passCode: string;
  onPaymentComplete: (paymentData: {
    utrNumber: string;
    screenshotUrl?: string;
    feeAmount: number;
  }) => void;
}

export default function UPIPaymentModal({
  isOpen,
  onClose,
  event,
  leadName,
  teamName,
  passCode,
  onPaymentComplete,
}: UPIPaymentModalProps) {
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [utrNumber, setUtrNumber] = useState("");
  const [utrError, setUtrError] = useState("");
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [screenshotError, setScreenshotError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const amount = event.feeAmount || 150;
  const vpa = process.env.NEXT_PUBLIC_UPI_VPA || festConfig.upiPayment?.vpa || "bmsit@indianbk";
  const payeeName = process.env.NEXT_PUBLIC_UPI_PAYEE_NAME || festConfig.upiPayment?.payeeName || "BMSITM";
  const note = `TX8-${passCode}-${event.id.slice(0, 8)}`;

  // Construct NPCI Standard UPI Intent URI for mobile app deep-linking
  const upiIntentUri = `upi://pay?pa=${vpa}&pn=${encodeURIComponent(
    payeeName
  )}&am=${amount}&tn=${encodeURIComponent(note)}&cu=INR`;

  if (!isOpen) return null;

  const handleCopyVpa = () => {
    navigator.clipboard.writeText(vpa);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setScreenshotError("Screenshot image size exceeds 5MB. Please choose a smaller file.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
        setScreenshotError("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitVerification = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUtr = utrNumber.trim().replace(/\s+/g, "");
    let hasError = false;

    // Standard bank UTR is typically 12 numeric digits
    if (!cleanUtr) {
      setUtrError("Please enter the 12-digit UPI / UTR Transaction Number.");
      hasError = true;
    } else if (!/^\d{12}$/.test(cleanUtr)) {
      setUtrError("UTR must be exactly 12 numeric digits (e.g. 430129849201).");
      hasError = true;
    } else {
      setUtrError("");
    }

    // Screenshot is mandatory
    if (!screenshotPreview) {
      setScreenshotError("Payment screenshot is mandatory. Please upload a screenshot showing successful transfer with UTR.");
      hasError = true;
    } else {
      setScreenshotError("");
    }

    if (hasError) return;

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      onPaymentComplete({
        utrNumber: cleanUtr,
        screenshotUrl: screenshotPreview || undefined,
        feeAmount: amount,
      });
    }, 1200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl my-auto rounded-3xl bg-[#090C14] border border-slate-800 shadow-[0_0_50px_rgba(226,54,54,0.25)] overflow-hidden flex flex-col text-slate-100">
        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-red-950/70 via-slate-900 to-amber-950/40 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-600/20 border border-red-500/40 text-red-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono-code text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  STEP 2 OF 2 • SECURE CHECKOUT
                </span>
                <span className="px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono-code text-[9px] uppercase font-bold">
                  DIRECT UPI (0% FEE)
                </span>
              </div>
              <h3 className="font-heading text-lg sm:text-xl font-black text-white tracking-wide">
                UPI PAYMENT GATEWAY
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-900/80 hover:bg-red-600 text-slate-400 hover:text-white transition-colors border border-slate-800 cursor-pointer"
            aria-label="Close Payment Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-7 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Order Summary Ribbon */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="min-w-0">
              <span className="font-mono-code text-[11px] text-slate-400 uppercase tracking-wider block">
                REGISTERING ARENA
              </span>
              <h4 className="font-heading text-base sm:text-lg font-bold text-white truncate">
                {event.title}
              </h4>
              <p className="font-mono-code text-xs text-slate-400 mt-0.5">
                Delegate: <span className="text-white font-semibold">{leadName}</span>{" "}
                {teamName ? `• Team: ${teamName}` : ""}
              </p>
            </div>

            <div className="text-left sm:text-right flex-shrink-0 bg-slate-900/90 px-4 py-2.5 rounded-xl border border-slate-800">
              <span className="font-mono-code text-[10px] text-amber-400 uppercase tracking-wider block font-bold">
                AMOUNT DUE
              </span>
              <span className="font-heading text-2xl sm:text-3xl font-black text-white">
                ₹{amount}
              </span>
            </div>
          </div>

          {/* UPI ID Transfer Box */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/90 shadow-inner space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono-code text-xs font-bold uppercase tracking-wider text-amber-400">
                OFFICIAL UPI ID
              </span>
              <span className="text-[11px] font-mono-code text-slate-400">
                Bank: Indian Bank
              </span>
            </div>

            {/* Prominent Copyable UPI ID Box */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono-code text-slate-400 uppercase block">
                  Payee: {payeeName}
                </span>
                <span className="font-mono-code text-lg sm:text-xl font-black text-amber-300 tracking-wider select-all">
                  {vpa}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyVpa}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-mono-code text-xs font-bold transition-all shadow-md cursor-pointer flex-shrink-0"
              >
                {copiedVpa ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>COPIED!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>COPY UPI ID</span>
                  </>
                )}
              </button>
            </div>

            {/* Mobile Intent App Buttons */}
            <div className="pt-2">
              <span className="font-mono-code text-xs text-slate-300 font-bold uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                ON MOBILE? PAY DIRECTLY VIA APP
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <a
                  href={upiIntentUri}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-blue-950/40 border border-slate-800 hover:border-blue-500/50 flex items-center justify-center gap-2 text-xs font-mono-code font-bold text-slate-200 transition-all hover:scale-[1.02]"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Google Pay</span>
                </a>

                <a
                  href={upiIntentUri}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/50 flex items-center justify-center gap-2 text-xs font-mono-code font-bold text-slate-200 transition-all hover:scale-[1.02]"
                >
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <span>PhonePe</span>
                </a>

                <a
                  href={upiIntentUri}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/50 flex items-center justify-center gap-2 text-xs font-mono-code font-bold text-slate-200 transition-all hover:scale-[1.02]"
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>Paytm</span>
                </a>

                <a
                  href={upiIntentUri}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-amber-950/40 border border-slate-800 hover:border-amber-500/50 flex items-center justify-center gap-2 text-xs font-mono-code font-bold text-slate-200 transition-all hover:scale-[1.02]"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>BHIM / Other</span>
                </a>
              </div>
            </div>
          </div>

          {/* Form Step: Enter 12-Digit UTR Number & Screenshot Proof */}
          <form onSubmit={handleSubmitVerification} className="space-y-4 pt-2">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-heading font-black text-white uppercase tracking-wider">
                  ENTER 12-DIGIT UPI / UTR TRANSACTION NUMBER *
                </label>
                <span className="text-[10px] font-mono-code text-amber-400">
                  MANDATORY
                </span>
              </div>

              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength={12}
                  value={utrNumber}
                  onChange={(e) => {
                    setUtrNumber(e.target.value.replace(/[^0-9]/g, ""));
                    if (utrError) setUtrError("");
                  }}
                  placeholder="e.g. 430129849201"
                  className={`w-full px-4 py-3 rounded-xl bg-slate-900 border text-base sm:text-lg font-mono-code tracking-[0.2em] font-bold text-white placeholder-slate-600 focus:outline-none transition-colors ${
                    utrError
                      ? "border-red-500 focus:border-red-400"
                      : "border-slate-800 focus:border-red-500"
                  }`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 font-mono-code text-xs text-slate-500">
                  {utrNumber.length}/12
                </div>
              </div>

              {utrError && (
                <p className="text-xs font-mono-code text-red-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{utrError}</span>
                </p>
              )}

              <p className="text-[11px] font-sans text-slate-400 leading-normal">
                After completing payment, check your UPI app receipt for the 12-digit &quot;UPI Transaction ID&quot; or &quot;UTR&quot;.
              </p>

              {/* Screenshot Proof Upload (Mandatory) */}
              <div className="pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono-code text-xs text-amber-300 font-bold uppercase tracking-wide flex items-center gap-1.5">
                    <span>PAYMENT SCREENSHOT PROOF</span>
                    <span className="text-red-500 text-sm font-black">* (MANDATORY)</span>
                  </span>
                  {screenshotPreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setScreenshotPreview(null);
                        setScreenshotError("Payment screenshot is mandatory. Please upload a screenshot showing successful transfer with UTR.");
                      }}
                      className="text-[10px] font-mono-code text-red-400 hover:underline cursor-pointer"
                    >
                      REMOVE
                    </button>
                  )}
                </div>

                <p className="text-[11px] font-sans text-slate-400 mb-2.5">
                  Upload a clear screenshot of your UPI receipt showing the successful transaction amount and 12-digit UTR number.
                </p>

                {screenshotPreview ? (
                  <div className="relative w-full h-32 rounded-xl overflow-hidden border-2 border-emerald-500/60 bg-slate-900 shadow-md">
                    <img
                      src={screenshotPreview}
                      alt="Uploaded Payment Proof"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-black/85 font-mono-code text-[10px] text-emerald-400 font-bold flex items-center gap-1.5 border border-emerald-500/40">
                      <Check className="w-3.5 h-3.5" />
                      <span>SCREENSHOT ATTACHED &amp; VERIFIED</span>
                    </div>
                  </div>
                ) : (
                  <label className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed ${
                    screenshotError ? "border-red-500/80 bg-red-950/20" : "border-slate-700 hover:border-amber-500/70 bg-slate-900/50 hover:bg-slate-900"
                  } cursor-pointer transition-colors`}>
                    <Upload className={`w-6 h-6 mb-1.5 ${screenshotError ? "text-red-400" : "text-amber-400"}`} />
                    <span className="font-mono-code text-xs text-white font-bold">
                      Click to upload payment screenshot *
                    </span>
                    <span className="font-mono-code text-[10px] text-slate-400 mt-0.5">
                      Must clearly display 12-digit UTR • PNG, JPG, WEBP (Max 5MB)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotUpload}
                      className="hidden"
                    />
                  </label>
                )}

                {screenshotError && (
                  <p className="mt-2 text-xs font-mono-code text-red-400 flex items-center gap-1.5 font-semibold">
                    <span>⚠</span>
                    <span>{screenshotError}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full group relative inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-heading font-black text-sm sm:text-base tracking-widest uppercase transition-all duration-300 shadow-[0_0_25px_rgba(239,68,68,0.4)] hover:shadow-[0_0_35px_rgba(245,158,11,0.6)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>VERIFYING UPI CREDENTIALS...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>COMPLETE PAYMENT &amp; GENERATE PASS</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info note */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-900 flex items-center justify-between text-[11px] font-mono-code text-slate-500">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            Verified Payee: {payeeName} ({vpa})
          </span>
          <span>Helpdesk: {festConfig.contact.phonePrimary}</span>
        </div>
      </div>
    </div>
  );
}
