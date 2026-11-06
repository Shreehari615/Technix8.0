/**
 * In-Memory OTP Store with Rate-Limiting & Expiration
 * Attached to globalThis to survive Next.js Fast Refresh cycles during development.
 */

export interface OtpRecord {
  otp: string;
  expiresAt: number;
  attempts: number;
  sendCount: number;
  windowExpiresAt: number;
}

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_SEND_PER_WINDOW = 3;
const MAX_VERIFY_ATTEMPTS = 5;

// Preserve in-memory store across Next.js development HMR reloads
const globalForOtp = globalThis as unknown as {
  technixOtpStore?: Map<string, OtpRecord>;
};

export const otpStore = globalForOtp.technixOtpStore || new Map<string, OtpRecord>();

if (process.env.NODE_ENV !== "production") {
  globalForOtp.technixOtpStore = otpStore;
}

function cleanExpired() {
  const now = Date.now();
  for (const [email, record] of otpStore.entries()) {
    if (record.windowExpiresAt <= now && record.expiresAt <= now) {
      otpStore.delete(email);
    }
  }
}

export function generateOtpCode(length = 6): string {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
}

export function requestOtp(email: string): {
  success: boolean;
  otp?: string;
  error?: string;
  remainingSeconds?: number;
} {
  cleanExpired();
  const normalizedEmail = email.trim().toLowerCase();
  const now = Date.now();

  const existing = otpStore.get(normalizedEmail);

  if (existing && existing.windowExpiresAt > now) {
    if (existing.sendCount >= MAX_SEND_PER_WINDOW) {
      const remainingSeconds = Math.ceil((existing.windowExpiresAt - now) / 1000);
      const mins = Math.floor(remainingSeconds / 60);
      const secs = remainingSeconds % 60;
      return {
        success: false,
        error: `Too many OTP requests. Please wait ${mins}m ${secs}s before requesting a new OTP.`,
        remainingSeconds,
      };
    }

    const otp = generateOtpCode();
    existing.otp = otp;
    existing.sendCount += 1;
    existing.expiresAt = now + OTP_TTL_MS;
    existing.attempts = 0; // reset attempts for fresh OTP
    otpStore.set(normalizedEmail, existing);
    return { success: true, otp };
  }

  // New OTP window
  const otp = generateOtpCode();
  otpStore.set(normalizedEmail, {
    otp,
    expiresAt: now + OTP_TTL_MS,
    attempts: 0,
    sendCount: 1,
    windowExpiresAt: now + OTP_TTL_MS,
  });

  return { success: true, otp };
}

export function verifySubmittedOtp(
  email: string,
  submittedOtp: string
): { success: boolean; error?: string } {
  cleanExpired();
  const normalizedEmail = email.trim().toLowerCase();
  const cleanOtp = submittedOtp.trim();

  const record = otpStore.get(normalizedEmail);

  if (!record) {
    return {
      success: false,
      error: "No OTP found for this email. Please request a new OTP.",
    };
  }

  const now = Date.now();
  if (record.expiresAt <= now) {
    otpStore.delete(normalizedEmail);
    return {
      success: false,
      error: "OTP has expired. Please request a new one.",
    };
  }

  if (record.attempts >= MAX_VERIFY_ATTEMPTS) {
    otpStore.delete(normalizedEmail);
    return {
      success: false,
      error: "Too many incorrect attempts. Please request a new OTP.",
    };
  }

  if (record.otp !== cleanOtp) {
    record.attempts += 1;
    const remaining = MAX_VERIFY_ATTEMPTS - record.attempts;
    return {
      success: false,
      error: `Incorrect OTP. ${remaining} attempt(s) remaining.`,
    };
  }

  // Valid OTP! Consume immediately so it cannot be reused
  otpStore.delete(normalizedEmail);
  return { success: true };
}

