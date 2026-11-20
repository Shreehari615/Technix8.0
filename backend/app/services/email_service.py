import logging
import httpx
from typing import List, Optional
from app.config import settings

logger = logging.getLogger("technix.email")

BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"

async def send_registration_confirmation(
    to_email: str,
    lead_name: str,
    event_title: str,
    pass_code: str,
    fee_amount: int,
    utr_number: str,
    team_name: Optional[str] = None,
    members: Optional[List[str]] = None,
    college_name: Optional[str] = None,
    department: Optional[str] = None,
    year_of_study: Optional[str] = None,
) -> bool:
    """
    Sends a branded Marvel/BMSITM admission confirmation email via Brevo REST API v3.
    """
    if not settings.BREVO_API_KEY:
        logger.warning("BREVO_API_KEY is not configured. Skipping confirmation email.")
        return False

    members = members or []
    members_html = ""
    if members:
        items = "".join([f"Ally #{i+2}: <strong>{m}</strong><br/>" for i, m in enumerate(members)])
        members_html = f"""
        <tr>
          <td style="padding:10px 16px;background:#111827;border-bottom:1px solid #1f2937;">
            <span style="color:#94a3b8;font-size:11px;font-family:monospace;text-transform:uppercase;letter-spacing:1px;">SQUAD ALLIES</span>
          </td>
          <td style="padding:10px 16px;background:#111827;border-bottom:1px solid #1f2937;color:#e2e8f0;font-size:13px;">
            {items}
          </td>
        </tr>
        """

    team_row = ""
    if team_name:
        team_row = f"""
        <tr>
          <td style="padding:10px 16px;background:#111827;border-bottom:1px solid #1f2937;">
            <span style="color:#94a3b8;font-size:11px;font-family:monospace;text-transform:uppercase;letter-spacing:1px;">TEAM NAME</span>
          </td>
          <td style="padding:10px 16px;background:#111827;border-bottom:1px solid #1f2937;color:#fbbf24;font-size:13px;font-weight:bold;">
            {team_name}
          </td>
        </tr>
        """

    college_row = ""
    if college_name:
        dept_str = f" ({department}, {year_of_study})" if department else ""
        college_row = f"""
        <tr>
          <td style="padding:10px 16px;background:#111827;border-bottom:1px solid #1f2937;">
            <span style="color:#94a3b8;font-size:11px;font-family:monospace;text-transform:uppercase;letter-spacing:1px;">INSTITUTION</span>
          </td>
          <td style="padding:10px 16px;background:#111827;border-bottom:1px solid #1f2937;color:#e2e8f0;font-size:13px;">
            {college_name}{dept_str}
          </td>
        </tr>
        """

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>TECHNIX 8.0 — Registration Confirmed</title>
</head>
<body style="margin:0;padding:0;background:#030712;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#030712;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:16px;overflow:hidden;border:1px solid #1f2937;background:#0b0f19;">

        <!-- HEADER -->
        <tr><td style="background:linear-gradient(135deg,#1a0000 0%,#0d0d1a 50%,#0a0000 100%);padding:0;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:32px 32px 20px;text-align:center;">
              <div style="width:48px;height:4px;background:#dc2626;border-radius:2px;margin:0 auto 20px;"></div>
              <h1 style="margin:0;color:#ffffff;font-size:32px;font-weight:900;letter-spacing:0.15em;font-family:'Arial Black',Arial,sans-serif;text-transform:uppercase;">
                TECHNIX <span style="color:#dc2626;">8.0</span>
              </h1>
              <p style="margin:6px 0 0;color:#94a3b8;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;font-family:monospace;">
                DEPARTMENT OF MCA · BMS INSTITUTE OF TECHNOLOGY
              </p>
            </td></tr>
          </table>
        </td></tr>

        <!-- STATUS BANNER -->
        <tr><td style="background:#052e16;border-top:1px solid #16a34a;border-bottom:1px solid #16a34a;padding:14px 32px;text-align:center;">
          <span style="color:#4ade80;font-size:13px;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;font-family:monospace;">
            🛡️ MISSION DOSSIER CONFIRMED · ADMISSION PASS GENERATED
          </span>
        </td></tr>

        <!-- CANDIDATE INTRO -->
        <tr><td style="padding:28px 32px 16px;">
          <p style="margin:0 0 8px;color:#e2e8f0;font-size:16px;line-height:1.5;">
            Greetings Agent <strong style="color:#ffffff;">{lead_name}</strong>,
          </p>
          <p style="margin:0;color:#94a3b8;font-size:13px;line-height:1.6;">
            Your registration request for <strong style="color:#ffffff;">{event_title}</strong> at TECHNIX 8.0 has been recorded in our central mainframe. Your official pass code and event details are detailed below.
          </p>
        </td></tr>

        <!-- PASS CODE BOX -->
        <tr><td style="padding:0 32px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#030712;border:2px dashed #dc2626;border-radius:12px;">
            <tr><td style="padding:20px;text-align:center;">
              <span style="display:block;color:#94a3b8;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;font-family:monospace;margin-bottom:6px;">
                OFFICIAL ADMISSION PASSCODE
              </span>
              <span style="display:block;color:#fbbf24;font-size:26px;font-weight:900;letter-spacing:0.25em;font-family:monospace;">
                {pass_code}
              </span>
              <span style="display:block;color:#6b7280;font-size:11px;margin-top:6px;font-family:monospace;">
                Show this passcode at the registration counter
              </span>
            </td></tr>
          </table>
        </td></tr>

        <!-- SPECS TABLE -->
        <tr><td style="padding:0 32px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:8px;overflow:hidden;border:1px solid #1f2937;">
            <tr>
              <td width="35%" style="padding:10px 16px;background:#111827;border-bottom:1px solid #1f2937;">
                <span style="color:#94a3b8;font-size:11px;font-family:monospace;text-transform:uppercase;letter-spacing:1px;">EVENT</span>
              </td>
              <td style="padding:10px 16px;background:#111827;border-bottom:1px solid #1f2937;color:#ffffff;font-size:14px;font-weight:bold;">
                {event_title}
              </td>
            </tr>
            {team_row}
            {members_html}
            {college_row}
            <tr>
              <td style="padding:10px 16px;background:#111827;border-bottom:1px solid #1f2937;">
                <span style="color:#94a3b8;font-size:11px;font-family:monospace;text-transform:uppercase;letter-spacing:1px;">FEE PAID</span>
              </td>
              <td style="padding:10px 16px;background:#111827;border-bottom:1px solid #1f2937;color:#4ade80;font-size:13px;font-weight:bold;font-family:monospace;">
                ₹{fee_amount} · UPI
              </td>
            </tr>
            <tr>
              <td style="padding:10px 16px;background:#111827;border-bottom:1px solid #1f2937;">
                <span style="color:#94a3b8;font-size:11px;font-family:monospace;text-transform:uppercase;letter-spacing:1px;">TRANSACTION UTR</span>
              </td>
              <td style="padding:10px 16px;background:#111827;border-bottom:1px solid #1f2937;color:#fbbf24;font-size:12px;font-family:monospace;">
                {utr_number}
              </td>
            </tr>
            <tr>
              <td style="padding:10px 16px;background:#111827;border-bottom:1px solid #1f2937;">
                <span style="color:#94a3b8;font-size:11px;font-family:monospace;text-transform:uppercase;letter-spacing:1px;">VENUE</span>
              </td>
              <td style="padding:10px 16px;background:#111827;border-bottom:1px solid #1f2937;color:#e2e8f0;font-size:13px;">
                BMS Institute of Technology &amp; Management<br/>
                <span style="color:#94a3b8;font-size:11px;">Doddaballapur Main Road, Avalahalli, Yelahanka, Bengaluru – 560064</span>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 16px;background:#111827;">
                <span style="color:#94a3b8;font-size:11px;font-family:monospace;text-transform:uppercase;letter-spacing:1px;">DATES</span>
              </td>
              <td style="padding:10px 16px;background:#111827;color:#e2e8f0;font-size:13px;">
                November 23 – 24, 2026
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- FOOTER -->
        <tr><td style="background:#030712;padding:24px 32px;text-align:center;border-top:1px solid #1f2937;">
          <p style="margin:0 0 6px;color:#64748b;font-size:11px;font-family:monospace;">
            TECHNIX 8.0 · Department of MCA · BMSITM · Yelahanka, Bengaluru
          </p>
          <div style="margin:16px auto 0;width:32px;height:2px;background:#dc2626;border-radius:1px;"></div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>"""

    payload = {
        "sender": {"name": settings.BREVO_SENDER_NAME, "email": settings.BREVO_SENDER_EMAIL},
        "to": [{"email": to_email, "name": lead_name}],
        "bcc": [{"email": "svbhathari@gmail.com", "name": "Admin Notification"}],
        "subject": f"[TECHNIX 8.0] ✅ Registration Confirmed — {pass_code} | {event_title}",
        "htmlContent": html_content,
        "textContent": f"TECHNIX 8.0 — Registration Confirmed for {lead_name}\nPasscode: {pass_code}\nEvent: {event_title}\nFee: INR {fee_amount}\nUTR: {utr_number}\nVenue: BMSITM Yelahanka, Bengaluru\nDates: Nov 23-24, 2026",
    }

    headers = {
        "accept": "application/json",
        "api-key": settings.BREVO_API_KEY,
        "content-type": "application/json",
    }

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            res = await client.post(BREVO_API_URL, headers=headers, json=payload)
            if res.status_code in [200, 201, 202]:
                data = res.json()
                logger.info(f"✅ Brevo email delivered to {to_email} (Msg ID: {data.get('messageId')})")
                return True
            else:
                logger.error(f"❌ Brevo API returned error {res.status_code}: {res.text}")
                return False
    except Exception as e:
        logger.error(f"❌ Exception sending email via Brevo: {e}")
        return False


async def send_otp_email(to_email: str, name: str, otp: str) -> bool:
    """
    Sends a branded TECHNIX 8.0 OTP verification email via Brevo REST API v3.
    The email contains a 6-digit code valid for 10 minutes.
    """
    if not settings.BREVO_API_KEY:
        logger.warning("BREVO_API_KEY is not configured. Skipping OTP email.")
        return False

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>TECHNIX 8.0 — Email Verification OTP</title>
</head>
<body style="margin:0;padding:0;background:#030712;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#030712;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;border-radius:16px;overflow:hidden;border:1px solid #1f2937;background:#0b0f19;">

        <!-- HEADER -->
        <tr><td style="background:linear-gradient(135deg,#1a0000 0%,#0d0d1a 50%,#0a0000 100%);padding:32px 32px 20px;text-align:center;">
          <div style="width:48px;height:4px;background:#dc2626;border-radius:2px;margin:0 auto 18px;"></div>
          <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:900;letter-spacing:0.15em;font-family:'Arial Black',Arial,sans-serif;text-transform:uppercase;">
            TECHNIX <span style="color:#dc2626;">8.0</span>
          </h1>
          <p style="margin:6px 0 0;color:#94a3b8;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;font-family:monospace;">
            DEPARTMENT OF MCA · BMS INSTITUTE OF TECHNOLOGY
          </p>
        </td></tr>

        <!-- STATUS BANNER -->
        <tr><td style="background:#0f172a;border-top:1px solid #dc2626;border-bottom:1px solid #1f2937;padding:12px 32px;text-align:center;">
          <span style="color:#f87171;font-size:12px;font-weight:bold;letter-spacing:0.12em;text-transform:uppercase;font-family:monospace;">
            🔐 EMAIL VERIFICATION · SECURITY PROTOCOL
          </span>
        </td></tr>

        <!-- BODY -->
        <tr><td style="padding:28px 32px 16px;">
          <p style="margin:0 0 8px;color:#e2e8f0;font-size:15px;line-height:1.5;">
            Greetings Agent <strong style="color:#ffffff;">{name}</strong>,
          </p>
          <p style="margin:0;color:#94a3b8;font-size:13px;line-height:1.6;">
            Your one-time verification code for <strong style="color:#ffffff;">TECHNIX 8.0</strong> registration is ready. Enter this code to confirm your email address.
          </p>
        </td></tr>

        <!-- OTP CODE BOX -->
        <tr><td style="padding:8px 32px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#030712;border:2px dashed #dc2626;border-radius:14px;">
            <tr><td style="padding:24px;text-align:center;">
              <span style="display:block;color:#94a3b8;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;font-family:monospace;margin-bottom:10px;">
                ONE-TIME VERIFICATION CODE
              </span>
              <span style="display:block;color:#fbbf24;font-size:38px;font-weight:900;letter-spacing:0.45em;font-family:monospace;">
                {otp}
              </span>
              <span style="display:block;color:#6b7280;font-size:11px;margin-top:10px;font-family:monospace;">
                Valid for <strong style="color:#f87171;">10 minutes</strong> · Do not share this code
              </span>
            </td></tr>
          </table>
        </td></tr>

        <!-- WARNING NOTE -->
        <tr><td style="padding:0 32px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a0a00;border-radius:10px;border:1px solid #92400e;">
            <tr><td style="padding:12px 16px;">
              <span style="color:#fbbf24;font-size:12px;font-family:monospace;display:block;">
                ⚠️ &nbsp;If you did not attempt to register for TECHNIX 8.0, please ignore this email. This code will expire automatically.
              </span>
            </td></tr>
          </table>
        </td></tr>

        <!-- FOOTER -->
        <tr><td style="background:#030712;padding:20px 32px;text-align:center;border-top:1px solid #1f2937;">
          <p style="margin:0 0 4px;color:#64748b;font-size:11px;font-family:monospace;">
            TECHNIX 8.0 · Department of MCA · BMSITM · Yelahanka, Bengaluru
          </p>
          <div style="margin:14px auto 0;width:32px;height:2px;background:#dc2626;border-radius:1px;"></div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>"""

    payload = {
        "sender": {"name": settings.BREVO_SENDER_NAME, "email": settings.BREVO_SENDER_EMAIL},
        "to": [{"email": to_email, "name": name}],
        "subject": f"[TECHNIX 8.0] 🔐 Your Verification Code: {otp}",
        "htmlContent": html_content,
        "textContent": f"TECHNIX 8.0 — Email Verification\n\nYour OTP: {otp}\n\nThis code is valid for 10 minutes. Do not share it with anyone.",
    }

    headers = {
        "accept": "application/json",
        "api-key": settings.BREVO_API_KEY,
        "content-type": "application/json",
    }

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            res = await client.post(BREVO_API_URL, headers=headers, json=payload)
            if res.status_code in [200, 201, 202]:
                data = res.json()
                logger.info(f"✅ OTP email sent to {to_email} (Msg ID: {data.get('messageId')})")
                return True
            else:
                logger.error(f"❌ Brevo OTP email error {res.status_code}: {res.text}")
                return False
    except Exception as e:
        logger.error(f"❌ Exception sending OTP email via Brevo: {e}")
        return False


async def send_admin_error_alert(
    error_type: str,
    error_message: str,
    endpoint: Optional[str] = None,
    context: Optional[dict] = None,
    stack_trace: Optional[str] = None,
) -> bool:
    """
    Dispatches a critical error alert email directly to the admin (svbhathari@gmail.com)
    via Brevo REST API v3 when a backend or database exception occurs.
    """
    if not settings.BREVO_API_KEY:
        logger.warning("BREVO_API_KEY not configured. Cannot dispatch admin error alert.")
        return False

    admin_email = "svbhathari@gmail.com"
    context_rows = ""
    if context:
        for k, v in context.items():
            context_rows += f"<tr><td style='padding:6px 12px;color:#94a3b8;font-weight:bold;width:160px;vertical-align:top;'>{k}:</td><td style='padding:6px 12px;color:#f1f5f9;'>{v}</td></tr>"
    else:
        context_rows = "<tr><td colspan='2' style='padding:8px 12px;color:#94a3b8;'>No context provided</td></tr>"

    stack_block = ""
    if stack_trace:
        stack_block = f"""
        <span style="color:#94a3b8;font-size:12px;font-family:monospace;text-transform:uppercase;font-weight:bold;display:block;margin-bottom:8px;">Stack Details</span>
        <pre style="background:#050811;border:1px solid #1e293b;border-radius:8px;padding:12px;font-size:11px;color:#fca5a5;overflow-x:auto;max-height:220px;white-space:pre-wrap;">{stack_trace[:1800]}</pre>
        """

    html_content = f"""<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:24px;background:#030712;font-family:'Segoe UI',Arial,monospace;color:#f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center">
      <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;background:#0b0f19;border:2px solid #ef4444;border-radius:16px;overflow:hidden;box-shadow:0 0 40px rgba(239,68,68,0.3);">
        <tr>
          <td style="background:linear-gradient(135deg,#7f1d1d 0%,#1e1b4b 100%);padding:20px 24px;text-align:center;">
            <span style="font-family:monospace;font-size:11px;font-weight:bold;letter-spacing:2px;color:#fca5a5;text-transform:uppercase;background:#450a0a;padding:4px 12px;border-radius:99px;border:1px solid #dc2626;">
              🚨 CRITICAL BACKEND SYSTEM ALERT
            </span>
            <h1 style="margin:12px 0 0;color:#ffffff;font-size:22px;font-weight:900;">
              {error_type}
            </h1>
          </td>
        </tr>
        <tr>
          <td style="padding:24px;">
            <p style="margin:0 0 16px;color:#cbd5e1;font-size:14px;line-height:1.6;">
              A critical backend exception was captured by the TECHNIX 8.0 server mainframe. Payload and stack trace details:
            </p>
            <div style="background:#1e1b4b;border-left:4px solid #ef4444;padding:12px 16px;border-radius:8px;margin-bottom:20px;">
              <span style="color:#fca5a5;font-size:11px;font-family:monospace;text-transform:uppercase;font-weight:bold;display:block;margin-bottom:4px;">Error Message</span>
              <span style="color:#ffffff;font-size:14px;font-weight:bold;font-family:monospace;">{error_message}</span>
            </div>
            <div style="background:#090d16;border:1px solid #1e293b;border-radius:10px;padding:12px;margin-bottom:20px;">
              <span style="color:#38bdf8;font-size:11px;font-family:monospace;text-transform:uppercase;font-weight:bold;display:block;margin-bottom:8px;">Endpoint / Action</span>
              <span style="color:#e2e8f0;font-family:monospace;font-size:13px;">{endpoint or "N/A"}</span>
            </div>
            <span style="color:#fbbf24;font-size:12px;font-family:monospace;text-transform:uppercase;font-weight:bold;display:block;margin-bottom:8px;">Execution Context</span>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#090d16;border:1px solid #1e293b;border-radius:10px;font-size:12px;margin-bottom:20px;">
              {context_rows}
            </table>
            {stack_block}
            <div style="margin-top:24px;padding-top:16px;border-top:1px solid #1e293b;text-align:center;">
              <a href="https://technix8.vercel.app/admin" style="display:inline-block;background:#dc2626;color:#ffffff;text-decoration:none;font-weight:bold;font-size:12px;font-family:monospace;padding:10px 20px;border-radius:8px;">
                OPEN ADMIN DASHBOARD
              </a>
              <p style="margin:12px 0 0;font-size:10px;font-family:monospace;color:#64748b;">
                Dispatched automatically to svbhathari@gmail.com
              </p>
            </div>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>"""

    payload = {
        "sender": {"name": settings.BREVO_SENDER_NAME or "TECHNIX 8.0 — System Monitor", "email": settings.BREVO_SENDER_EMAIL or "technix8.0team@gmail.com"},
        "to": [{"email": admin_email, "name": "Technix Admin (Shreehari)"}],
        "subject": f"[CRITICAL ALERT] 🚨 TECHNIX 8.0 Backend Issue: {error_type}",
        "htmlContent": html_content,
        "textContent": f"CRITICAL ALERT: {error_type}\n\nEndpoint: {endpoint}\nError: {error_message}\n\nCheck admin dashboard: https://technix8.vercel.app/admin",
    }

    headers = {
        "accept": "application/json",
        "api-key": settings.BREVO_API_KEY,
        "content-type": "application/json",
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            res = await client.post(BREVO_API_URL, headers=headers, json=payload)
            if res.status_code in [200, 201, 202]:
                logger.info(f"✅ Admin critical error alert email sent to {admin_email}")
                return True
            else:
                logger.error(f"❌ Brevo admin alert email failed: {res.status_code} {res.text}")
                return False
    except Exception as e:
        logger.error(f"❌ Exception sending admin alert email: {e}")
        return False

