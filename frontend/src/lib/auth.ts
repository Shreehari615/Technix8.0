import crypto from "crypto";
import { NextRequest } from "next/server";

const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || "technix@8.0";

/**
 * Creates a cryptographically signed session token using HMAC-SHA256.
 * Format: TX8_ADMIN_<timestamp>_<hmac_signature>
 */
export function createAdminSessionToken(secret: string = ADMIN_SECRET): string {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const hmac = crypto.createHmac("sha256", secret.trim());
  hmac.update(`admin_session_${timestamp}`);
  const signature = hmac.digest("hex");
  return `TX8_ADMIN_${timestamp}_${signature}`;
}

/**
 * Validates an incoming admin request with constant-time cryptographic checks.
 * Rejects expired tokens (default: 7 days) and invalid signatures.
 */
export function isAuthorizedAdmin(req: NextRequest): boolean {
  const authHeader = req.headers.get("x-admin-key") || req.headers.get("authorization");
  if (!authHeader) return false;

  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  const secret = (process.env.ADMIN_SECRET_KEY || "technix@8.0").trim();

  // 1. Direct secret match using constant-time comparison
  if (token.length === secret.length) {
    try {
      if (crypto.timingSafeEqual(Buffer.from(token), Buffer.from(secret))) {
        return true;
      }
    } catch {
      // Length mismatch or comparison failure
    }
  }

  // 2. Validate signed session token: TX8_ADMIN_<timestamp>_<signature>
  if (token.startsWith("TX8_ADMIN_")) {
    const parts = token.split("_");
    if (parts.length === 4) {
      const timestampStr = parts[2];
      const signature = parts[3];

      const timestamp = parseInt(timestampStr, 10);
      const now = Math.floor(Date.now() / 1000);

      // Verify token age: max 7 days (604800 seconds)
      if (isNaN(timestamp) || now - timestamp > 604800 || timestamp > now + 300) {
        return false;
      }

      // Recompute expected HMAC
      const hmac = crypto.createHmac("sha256", secret);
      hmac.update(`admin_session_${timestampStr}`);
      const expectedSignature = hmac.digest("hex");

      if (signature.length === expectedSignature.length) {
        try {
          return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
        } catch {
          return false;
        }
      }
    }
  }

  return false;
}
