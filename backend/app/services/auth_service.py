import time
import hmac
import hashlib
from typing import Optional
from fastapi import Header, HTTPException, status
from app.config import settings

def create_admin_token(secret: str) -> str:
    """
    Creates an HMAC-SHA256 signed admin session token.
    Format: TX8_ADMIN_<timestamp>_<hmac_signature>
    """
    timestamp = str(int(time.time()))
    secret_bytes = secret.strip().encode("utf-8")
    payload = f"admin_session_{timestamp}".encode("utf-8")
    signature = hmac.new(secret_bytes, payload, hashlib.sha256).hexdigest()
    return f"TX8_ADMIN_{timestamp}_{signature}"

def is_valid_admin_token(token: Optional[str]) -> bool:
    """
    Constant-time cryptographic validation of admin keys and signed session tokens.
    """
    if not token:
        return False

    clean_token = token.replace("Bearer ", "").replace("bearer ", "").strip()
    secret = settings.ADMIN_SECRET_KEY.strip()

    # 1. Direct secret match using timing-safe comparison
    if hmac.compare_digest(clean_token, secret):
        return True

    # 2. Signed session token format: TX8_ADMIN_<timestamp>_<signature>
    if clean_token.startswith("TX8_ADMIN_"):
        parts = clean_token.split("_")
        if len(parts) == 4:
            timestamp_str, signature = parts[2], parts[3]
            try:
                timestamp = int(timestamp_str)
                now = int(time.time())
                # Check expiration: max 7 days (604,800 seconds)
                if now - timestamp > 604800 or timestamp > now + 300:
                    return False

                secret_bytes = secret.encode("utf-8")
                payload = f"admin_session_{timestamp_str}".encode("utf-8")
                expected_sig = hmac.new(secret_bytes, payload, hashlib.sha256).hexdigest()
                return hmac.compare_digest(signature, expected_sig)
            except (ValueError, TypeError):
                return False

    return False

def verify_admin_key(
    x_admin_key: Optional[str] = Header(None, alias="x-admin-key"),
    authorization: Optional[str] = Header(None, alias="authorization"),
) -> bool:
    """
    FastAPI dependency that enforces admin security clearance.
    """
    token = x_admin_key or authorization
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing security clearance key.",
        )

    if is_valid_admin_token(token):
        return True

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired security clearance key.",
    )
