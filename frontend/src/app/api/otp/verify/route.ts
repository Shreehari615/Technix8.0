import { NextRequest, NextResponse } from "next/server";
import { verifySubmittedOtp } from "@/lib/otpStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required." }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedOtp = otp.trim();

    const result = verifySubmittedOtp(trimmedEmail, trimmedOtp);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "OTP verification failed." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        verified: true,
        message: "Email verified successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /api/otp/verify:", error);
    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}
