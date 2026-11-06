import { NextRequest, NextResponse } from "next/server";
import { requestOtp } from "@/lib/otpStore";
import { sendOtpEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const candidateName = (name || "Agent").trim();

    const otpResult = requestOtp(trimmedEmail);
    if (!otpResult.success || !otpResult.otp) {
      return NextResponse.json(
        { error: otpResult.error || "Failed to generate OTP." },
        { status: 429 }
      );
    }

    // Dispatch OTP email via Brevo transactional API
    const emailResult = await sendOtpEmail({
      toEmail: trimmedEmail,
      name: candidateName,
      otp: otpResult.otp,
    });

    if (!emailResult.success) {
      console.warn(`[OTP Backup] Could not send via Brevo for ${trimmedEmail}. Error: ${emailResult.error}`);
      return NextResponse.json(
        { error: emailResult.error || "Failed to send OTP email. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `OTP sent to ${trimmedEmail}. Valid for 10 minutes.`,
        expires_in_minutes: 10,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /api/otp/send:", error);
    return NextResponse.json(
      { error: "Failed to send OTP. Please try again." },
      { status: 500 }
    );
  }
}
