import { NextRequest, NextResponse } from "next/server";
import { createAdminSessionToken } from "@/lib/auth";

// In-memory rate limiting map: IP -> { attempts, lastAttempt }
const loginAttempts = new Map<string, { count: number; lockedUntil: number }>();

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local_client";
    const now = Date.now();

    // Check rate limiting / brute-force lockout
    const attempt = loginAttempts.get(ip);
    if (attempt && attempt.lockedUntil > now) {
      const waitSeconds = Math.ceil((attempt.lockedUntil - now) / 1000);
      return NextResponse.json(
        {
          success: false,
          error: `Too many failed attempts. Security clearance locked for ${waitSeconds} seconds.`,
        },
        { status: 429 }
      );
    }

    const { passcode } = await req.json();
    const adminSecret = (process.env.ADMIN_SECRET_KEY || "technix@8.0").trim();

    if (!passcode || passcode.trim() !== adminSecret) {
      // Increment failed attempts
      const currentCount = (attempt?.count || 0) + 1;
      const lockedUntil = currentCount >= 5 ? now + 5 * 60 * 1000 : 0; // Lock for 5 mins after 5 attempts
      loginAttempts.set(ip, { count: currentCount, lockedUntil });

      return NextResponse.json(
        { success: false, error: "Invalid admin clearance passcode." },
        { status: 401 }
      );
    }

    // Reset attempts on successful authentication
    loginAttempts.delete(ip);

    // Issue HMAC-signed cryptographic session token
    const token = createAdminSessionToken(adminSecret);

    return NextResponse.json({
      success: true,
      message: "Clearance granted. Welcome to Technix 8.0 Command Mainframe.",
      token,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Authentication processing error." },
      { status: 500 }
    );
  }
}
