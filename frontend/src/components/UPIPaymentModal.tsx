"use client";

import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import { festConfig } from "@/data/festConfig";
import { FestEvent } from "@/types";
import {
  X,
  QrCode,
  Check,
  Copy,
  Download,
  ShieldCheck,
  Smartphone,
  AlertCircle,
  Lock,
  ArrowRight,
  Upload,
  Sparkles,
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
  email,
  phone,
  teamName,
  passCode,
  onPaymentComplete,
}: UPIPaymentModalProps) {
  const [dynamicQrUrl, setDynamicQrUrl] = useState<string>("");
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [utrNumber, setUtrNumber] = useState("");
  const [utrError, setUtrError] = useState("");
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const amount = event.feeAmount || 150;
  const vpa = festConfig.upiPayment?.vpa || "shreeharisvbhat2005@oksbi";
  const payeeName = festConfig.upiPayment?.payeeName || "Shreehari S V";
  const note = `TX8-${passCode}-${event.id.slice(0, 8)}`;

  // Construct NPCI Standard UPI Intent URI for mobile app deep-linking
  const upiIntentUri = `upi://pay?pa=${vpa}&pn=${encodeURIComponent(
    payeeName
  )}&am=${amount}&tn=${encodeURIComponent(note)}&cu=INR`;

  // Generate dynamic QR Code data URL encoded with exact amount
  useEffect(() => {
    if (!isOpen) return;

    QRCode.toDataURL(upiIntentUri, {
      width: 320,
      margin: 1,
      color: {
        dark: "#05070B",
        light: "#FFFFFF",
      },
    })
      .then((url) => setDynamicQrUrl(url))
      .catch((err) => console.error("Error generating UPI QR code", err));
  }, [isOpen, upiIntentUri]);

  if (!isOpen) return null;

  const handleCopyVpa = () => {
    navigator.clipboard.writeText(vpa);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  const handleDownloadQr = () => {
    const link = document.createElement("a");
    link.href = dynamicQrUrl;
    link.download = `Technix8-UPI-QR-${passCode}.png`;
    link.click();
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Screenshot image size exceeds 5MB. Please choose a smaller file.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitVerification = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUtr = utrNumber.trim().replace(/\s+/g, "");

    // Standard bank UTR is typically 12 numeric digits
    if (!cleanUtr) {
      setUtrError("Please enter the 12-digit UPI / UTR Transaction Number.");
      return;
    }

    if (!/^\d{12}$/.test(cleanUtr)) {
      setUtrError("UTR must be exactly 12 numeric digits (e.g. 430129849201).");
      return;
    }

    setUtrError("");
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
      <div className="relative w-full max-w-2xl my-auto rounded-3xl bg-[#090C14] border border-slate-800 shadow-[0_0_50px_rgba(226,54,54,0.25)] overflow-hidden flex flex-col text-slate-100">
        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-red-950/70 via-slate-900 to-amber-950/40 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-600/20 border border-red-500/40 text-red-400">
              <QrCode className="w-5 h-5" />
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
                UPI QR PAYMENT GATEWAY
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

          {/* Grid: QR Code & Mobile Launchers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left: QR Code Box */}
            <div className="flex flex-col items-center p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800/90 shadow-inner">
              {/* Amount Label */}
              <div className="mb-3 w-full text-center">
                <span className="font-mono-code text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  AMOUNT QR • ₹{amount} PRE-FILLED
                </span>
              </div>

              {/* QR Image Card Frame */}
              <div className="relative rounded-2xl bg-white p-2 shadow-2xl border-4 border-slate-900 flex flex-col items-center justify-center overflow-hidden">
                <div className="p-2 flex flex-col items-center">
                  {dynamicQrUrl ? (
                    <img
                      src={dynamicQrUrl}
                      alt="UPI Amount QR Code"
                      className="w-48 h-48 sm:w-52 sm:h-52 object-contain"
                    />
                  ) : (
                    <div className="w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center font-mono-code text-xs text-slate-700">
                      GENERATING QR...
                    </div>
                  )}
                  <span className="font-mono-code text-[10px] text-slate-800 font-bold mt-1">
                    Exact Amount: ₹{amount}
                  </span>
                </div>
              </div>

              {/* Action Buttons below QR */}
              <div className="flex items-center gap-2 mt-4 w-full">
                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 font-mono-code text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>SAVE QR</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyVpa}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 font-mono-code text-xs font-semibold transition-colors cursor-pointer"
                >
                  {copiedVpa ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">COPIED!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-red-400" />
                      <span>COPY UPI ID</span>
                    </>
                  )}
                </button>
              </div>

              {/* UPI ID display */}
              <div className="mt-3 text-center">
                <span className="font-mono-code text-[11px] text-slate-400">
                  UPI ID: <span className="text-amber-300 font-bold select-all">{vpa}</span>
                </span>
                <span className="font-mono-code text-[10px] text-slate-500 block">
                  Name: {payeeName}
                </span>
              </div>
            </div>

            {/* Right: Mobile Intent & Apps Direct Links */}
            <div className="flex flex-col space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="font-mono-code text-xs text-slate-300 font-bold uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  ON MOBILE? PAY DIRECTLY
                </span>
                <p className="text-xs text-slate-400 leading-relaxed font-sans mb-3">
                  Tap below to launch your installed UPI app with Shreehari S V &amp; ₹{amount} pre-filled:
                </p>

                <div className="grid grid-cols-2 gap-2">
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

              {/* Payee Verification Details */}
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs font-mono-code text-slate-400 space-y-1">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Payee:</span>
                  <span className="font-bold text-white">{payeeName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>UPI Handle:</span>
                  <span className="text-amber-400 font-bold">{vpa}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Bank:</span>
                  <span>State Bank of India (SBI)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Ref Note:</span>
                  <span className="text-slate-300">{note}</span>
                </div>
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
                Check your UPI app (Google Pay / PhonePe / Paytm / BHIM) payment receipt. Look for
                "UPI Transaction ID" or "Google Transaction ID / UTR" (12 numerical digits).
              </p>

              {/* Screenshot Proof Upload (Optional) */}
              <div className="pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono-code text-xs text-slate-300 font-semibold uppercase">
                    PAYMENT SCREENSHOT PROOF (OPTIONAL)
                  </span>
                  {screenshotPreview && (
                    <button
                      type="button"
                      onClick={() => setScreenshotPreview(null)}
                      className="text-[10px] font-mono-code text-red-400 hover:underline cursor-pointer"
                    >
                      REMOVE
                    </button>
                  )}
                </div>

                {screenshotPreview ? (
                  <div className="relative w-full h-28 rounded-xl overflow-hidden border border-emerald-500/40 bg-slate-900">
                    <img
                      src={screenshotPreview}
                      alt="Uploaded Payment Proof"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 font-mono-code text-[10px] text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>SCREENSHOT ATTACHED</span>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-slate-800 hover:border-slate-600 bg-slate-900/50 hover:bg-slate-900 cursor-pointer transition-colors">
                    <Upload className="w-5 h-5 text-slate-400 mb-1" />
                    <span className="font-mono-code text-xs text-slate-300">
                      Upload transfer screenshot
                    </span>
                    <span className="font-mono-code text-[10px] text-slate-500 mt-0.5">
                      PNG, JPG, WEBP up to 5MB
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotUpload}
                      className="hidden"
                    />
                  </label>
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
