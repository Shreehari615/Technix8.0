"""
OTP Email Verification Router
Handles sending and verifying 6-digit OTPs for email verification during registration.
OTPs are stored in-memory with a 10-minute TTL.
"""

import random
import string
from datetime import datetime, timezone, timedelta
from typing import Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/api/otp", tags=["OTP Verification"])

# In-memory OTP store: { email: { otp, expires_at, attempts, send_count, first_sent_at } }
_otp_store: dict = {}

OTP_TTL_MINUTES = 10
MAX_SEND_PER_WINDOW = 3   # max resends within OTP_TTL_MINUTES window
MAX_VERIFY_ATTEMPTS = 5   # max wrong attempts before OTP is invalidated


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _clean_expired():
    """Remove all expired OTP entries from the store."""
    cutoff = _now()
    expired = [email for email, rec in _otp_store.items() if rec["expires_at"] <= cutoff]
    for email in expired:
        del _otp_store[email]


def _generate_otp(length: int = 6) -> str:
    return "".join(random.choices(string.digits, k=length))


# ─── Request / Response Schemas ──────────────────────────────────────────────

class OtpSendRequest(BaseModel):
    email: EmailStr
    name: str = "Agent"


class OtpVerifyRequest(BaseModel):
    email: EmailStr
    otp: str


# ─── Endpoints ────────────────────────────────────────────────────────────────

@router.post("/send", status_code=status.HTTP_200_OK)
async def send_otp(data: OtpSendRequest):
    """
    Generates a 6-digit OTP and dispatches it to the given email via Brevo.
    Rate-limited to 3 sends per 10-minute window per email address.
    """
    from app.services.email_service import send_otp_email

    _clean_expired()

    email = data.email.strip().lower()
    name = data.name.strip() or "Agent"
    now = _now()
    expires_at = now + timedelta(minutes=OTP_TTL_MINUTES)

    existing = _otp_store.get(email)

    # Rate-limit: check how many times this email has been sent within the window
    if existing and existing["expires_at"] > now:
        if existing.get("send_count", 1) >= MAX_SEND_PER_WINDOW:
            remaining_secs = int((existing["expires_at"] - now).total_seconds())
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Too many OTP requests. Please wait {remaining_secs // 60}m {remaining_secs % 60}s before requesting a new OTP.",
            )
        # Regenerate OTP but keep the same window expiry and increment send count
        otp = _generate_otp()
        _otp_store[email]["otp"] = otp
        _otp_store[email]["send_count"] = existing.get("send_count", 1) + 1
        _otp_store[email]["attempts"] = 0  # reset wrong attempt counter
    else:
        # New or expired entry — fresh OTP
        otp = _generate_otp()
        _otp_store[email] = {
            "otp": otp,
            "expires_at": expires_at,
            "attempts": 0,
            "send_count": 1,
        }

    # Send email (async)
    sent = await send_otp_email(to_email=email, name=name, otp=otp)
    if not sent:
        # Remove from store so the user can retry
        _otp_store.pop(email, None)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Failed to send OTP email. Please try again in a moment.",
        )

    return {
        "success": True,
        "message": f"OTP sent to {email}. Valid for {OTP_TTL_MINUTES} minutes.",
        "expires_in_minutes": OTP_TTL_MINUTES,
    }


@router.post("/verify", status_code=status.HTTP_200_OK)
async def verify_otp(data: OtpVerifyRequest):
    """
    Validates the submitted OTP against the stored value.
    Invalidates the OTP after 5 wrong attempts or on first successful verification.
    """
    _clean_expired()

    email = data.email.strip().lower()
    submitted_otp = data.otp.strip()

    record = _otp_store.get(email)

    if not record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No OTP found for this email. Please request a new OTP.",
        )

    now = _now()
    if record["expires_at"] <= now:
        _otp_store.pop(email, None)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP has expired. Please request a new one.",
        )

    if record["attempts"] >= MAX_VERIFY_ATTEMPTS:
        _otp_store.pop(email, None)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Too many incorrect attempts. Please request a new OTP.",
        )

    if record["otp"] != submitted_otp:
        _otp_store[email]["attempts"] += 1
        remaining = MAX_VERIFY_ATTEMPTS - _otp_store[email]["attempts"]
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Incorrect OTP. {remaining} attempt(s) remaining.",
        )

    # ✅ OTP is valid — consume it immediately (one-time use)
    _otp_store.pop(email, None)

    return {
        "verified": True,
        "message": "Email verified successfully.",
    }
