/**
 * Email Service for TECHNIX 8.0
 * Uses Brevo (Sendinblue) Transactional API (v3) for fast, reliable delivery.
 * Falls back gracefully if credentials are not configured.
 */

export function isEmailConfigured(): boolean {
  return Boolean(process.env.BREVO_API_KEY);
}

export interface RegistrationEmailData {
  toEmail: string;
  leadName: string;
  eventTitle: string;
  eventCategory?: string;
  passCode: string;
  feeAmount: number;
  utrNumber: string;
  teamName?: string;
  members?: string[];
  collegeName?: string;
  department?: string;
  yearOfStudy?: string;
  marvelCharacter?: string;
}

export async function sendRegistrationConfirmationEmail(
  data: RegistrationEmailData
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn("[Email] BREVO_API_KEY not configured — skipping email send.");
    return { success: false, error: "Email service not configured." };
  }

  const senderEmail = process.env.BREVO_SENDER_EMAIL || "technix8.0team@gmail.com";
  const senderName = process.env.BREVO_SENDER_NAME || "TECHNIX 8.0 — BMSIT";

  const membersHtml =
    data.members && data.members.length > 0
      ? `<tr>
          <td style="padding:10px 16px;background:#111827;border-bottom:1px solid #1f2937;">
            <span style="color:#94a3b8;font-size:11px;font-family:monospace;text-transform:uppercase;letter-spacing:1px;">SQUAD ALLIES</span>
          </td>
          <td style="padding:10px 16px;background:#111827;border-bottom:1px solid #1f2937;color:#e2e8f0;font-size:13px;">
            ${data.members.map((m, i) => `Ally #${i + 2}: <strong>${m}</strong>`).join("<br/>")}
          </td>
        </tr>`
      : "";

  const teamRow = data.teamName
    ? `<tr>
        <td style="padding:10px 16px;background:#111827;border-bottom:1px solid #1f2937;">
          <span style="color:#94a3b8;font-size:11px;font-family:monospace;text-transform:uppercase;letter-spacing:1px;">TEAM NAME</span>
        </td>
        <td style="padding:10px 16px;background:#111827;border-bottom:1px solid #1f2937;color:#fbbf24;font-size:13px;font-weight:bold;">
          ${data.teamName}
        </td>
      </tr>`
    : "";

  const html = `<!DOCTYPE html>
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
            Greetings Agent <strong style="color:#ffffff;">${data.leadName}</strong>,
          </p>
          <p style="margin:0;color:#94a3b8;font-size:13px;line-height:1.6;">
            Your clearance request for <strong style="color:#ffffff;">${data.eventTitle}</strong> at TECHNIX 8.0 has been successfully recorded in our central mainframe. Your official pass code and event details are detailed below.
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
                ${data.passCode}
              </span>
              <span style="display:block;color:#6b7280;font-size:11px;margin-top:6px;font-family:monospace;">
                Quote this code or show this email at the registration desk
              </span>
            </td></tr>
          </table>
        </td></tr>

        <!-- REGISTRATION DETAILS TABLE -->
        <tr><td style="padding:0 32px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:8px;overflow:hidden;border:1px solid #1f2937;">
            <tr>
              <td colspan="2" style="padding:10px 16px;background:#1e293b;border-bottom:1px solid #334155;">
                <span style="color:#94a3b8;font-size:11px;font-weight:bold;letter-spacing:0.15em;text-transform:uppercase;font-family:monospace;">
                  MISSION CLEARANCE SPECIFICATIONS
                </span>
              </td>
            </tr>

            <tr>
              <td width="35%" style="padding:10px 16px;background:#111827;border-bottom:1px solid #1f2937;">
                <span style="color:#94a3b8;font-size:11px;font-family:monospace;text-transform:uppercase;letter-spacing:1px;">EVENT</span>
              </td>
              <td style="padding:10px 16px;background:#111827;border-bottom:1px solid #1f2937;color:#ffffff;font-size:14px;font-weight:bold;">
                ${data.eventTitle}
              </td>
            </tr>

            ${teamRow}
            ${membersHtml}

            ${data.collegeName ? `
            <tr>
              <td style="padding:10px 16px;background:#111827;border-bottom:1px solid #1f2937;">
                <span style="color:#94a3b8;font-size:11px;font-family:monospace;text-transform:uppercase;letter-spacing:1px;">INSTITUTION</span>
              </td>
              <td style="padding:10px 16px;background:#111827;border-bottom:1px solid #1f2937;color:#e2e8f0;font-size:13px;">
                ${data.collegeName} (${data.department || "Dept"}, ${data.yearOfStudy || "Year"})
              </td>
            </tr>` : ""}

            <tr>
              <td style="padding:10px 16px;background:#111827;border-bottom:1px solid #1f2937;">
                <span style="color:#94a3b8;font-size:11px;font-family:monospace;text-transform:uppercase;letter-spacing:1px;">FEE PAID</span>
              </td>
              <td style="padding:10px 16px;background:#111827;border-bottom:1px solid #1f2937;color:#4ade80;font-size:13px;font-weight:bold;font-family:monospace;">
                ₹${data.feeAmount} · UPI
              </td>
            </tr>

            <tr>
              <td style="padding:10px 16px;background:#111827;border-bottom:1px solid #1f2937;">
                <span style="color:#94a3b8;font-size:11px;font-family:monospace;text-transform:uppercase;letter-spacing:1px;">TRANSACTION UTR</span>
              </td>
              <td style="padding:10px 16px;background:#111827;border-bottom:1px solid #1f2937;color:#fbbf24;font-size:12px;font-family:monospace;">
                ${data.utrNumber}
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
                November 17 – 18, 2026
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- MY PASSES LINK BUTTON -->
        <tr><td style="padding:0 32px 28px;text-align:center;">
          <a href="http://localhost:3000/passes?tab=mypasses"
             style="display:inline-block;background:linear-gradient(90deg,#dc2626,#991b1b);color:#ffffff;text-decoration:none;font-weight:900;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;padding:12px 28px;border-radius:9999px;font-family:monospace;box-shadow:0 0 20px rgba(220,38,38,0.4);">
            VIEW MY PASSES ON PORTAL →
          </a>
        </td></tr>

        <!-- CRITICAL INSTRUCTIONS -->
        <tr><td style="padding:0 32px 24px;">
          <div style="background:#0f172a;border-left:4px solid #dc2626;border-radius:0 8px 8px 0;padding:16px 20px;">
            <p style="margin:0 0 8px;color:#f87171;font-size:11px;font-weight:bold;letter-spacing:0.15em;text-transform:uppercase;font-family:monospace;">
              ⚠️ IMPORTANT PROTOCOLS FOR EVENT DAY
            </p>
            <ul style="margin:0;padding-left:18px;color:#cbd5e1;font-size:12px;line-height:1.8;">
              <li>Carry a valid <strong>Original College Identity Card</strong> (Mandatory).</li>
              <li>Present this admission email or your passcode at the registration counter.</li>
              <li>Be present at the venue at least 30 minutes prior to scheduled start.</li>
              <li>Disqualification may occur for rule violations or ID mismatch.</li>
            </ul>
          </div>
        </td></tr>

        <!-- FOOTER -->
        <tr><td style="background:#030712;padding:24px 32px;text-align:center;border-top:1px solid #1f2937;">
          <p style="margin:0 0 6px;color:#64748b;font-size:11px;font-family:monospace;">
            TECHNIX 8.0 · Department of MCA · BMSIT&amp;M · Yelahanka, Bengaluru
          </p>
          <p style="margin:0;color:#475569;font-size:10px;font-family:monospace;">
            This is an automated confirmation sent via Brevo. For queries, contact the coordinators.
          </p>
          <div style="margin:16px auto 0;width:32px;height:2px;background:#dc2626;border-radius:1px;"></div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `TECHNIX 8.0 — Registration Confirmed

Hey ${data.leadName},

Your clearance request for ${data.eventTitle} at TECHNIX 8.0 has been successfully recorded.

ADMISSION PASSCODE: ${data.passCode}
Event: ${data.eventTitle}
Fee Paid: ₹${data.feeAmount} (UPI)
UTR: ${data.utrNumber}
${data.teamName ? `Team: ${data.teamName}\n` : ""}${data.members && data.members.length > 0 ? `Allies: ${data.members.join(", ")}\n` : ""}
Venue: BMS Institute of Technology & Management, Yelahanka, Bengaluru
Dates: November 17 – 18, 2026

Please carry your original College ID card.
View your pass anytime: http://localhost:3000/passes?tab=mypasses

— TECHNIX 8.0 Team`;

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: data.toEmail, name: data.leadName }],
        subject: `[TECHNIX 8.0] ✅ Registration Confirmed — ${data.passCode} | ${data.eventTitle}`,
        htmlContent: html,
        textContent: text,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error("[Email] ❌ Brevo API error:", result);
      return {
        success: false,
        error: result.message || "Failed to send transactional email via Brevo",
      };
    }

    console.log(`[Email] ✅ Brevo confirmation sent to ${data.toEmail} — Message ID: ${result.messageId}`);
    return { success: true, messageId: result.messageId };
  } catch (err) {
    console.error("[Email] ❌ Failed to call Brevo API:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown email error",
    };
  }
}
