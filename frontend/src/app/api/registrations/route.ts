import { NextRequest, NextResponse } from "next/server";
import { getDb, isDatabaseConfigured, mockRegistrations, RegistrationRow } from "@/lib/db";
import { sendRegistrationConfirmationEmail, isEmailConfigured } from "@/lib/email";
import { isAuthorizedAdmin } from "@/lib/auth";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      eventId,
      eventTitle,
      leadName,
      email,
      phone,
      collegeName,
      department,
      yearOfStudy,
      teamName,
      members = [],
      passCode,
      feeAmount = 150,
      paymentMethod = "UPI_QR",
      utrNumber,
      screenshotUrl,
    } = body;

    // 1. Validation
    if (!eventId || !eventTitle) {
      return NextResponse.json({ error: "Event details are required." }, { status: 400 });
    }
    if (!leadName || typeof leadName !== "string" || leadName.trim().length < 2) {
      return NextResponse.json({ error: "A valid candidate name is required." }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }
    if (!phone || phone.trim().length < 8) {
      return NextResponse.json({ error: "A valid active phone number is required." }, { status: 400 });
    }
    if (!collegeName || !department || !yearOfStudy) {
      return NextResponse.json(
        { error: "College institution, department, and year of study are required." },
        { status: 400 }
      );
    }
    if (!utrNumber || utrNumber.trim().length < 6) {
      return NextResponse.json(
        { error: "A valid UPI transaction UTR number is required." },
        { status: 400 }
      );
    }

    const cleanUtr = utrNumber.trim();
    const cleanPassCode = passCode || `TX8-${Math.floor(10000 + Math.random() * 90000)}`;
    const id = `reg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const nowIso = new Date().toISOString();

    // 2. Insert into Neon PostgreSQL if configured
    if (isDatabaseConfigured()) {
      const sql = getDb();

      // Check if UTR was already submitted to prevent replay
      const existingUtr = await sql`
        SELECT id, pass_code FROM registrations WHERE utr_number = ${cleanUtr} LIMIT 1;
      `;
      if (existingUtr.length > 0) {
        return NextResponse.json(
          {
            error: "This UPI UTR number has already been submitted for registration.",
            existingPassCode: existingUtr[0].pass_code,
          },
          { status: 409 }
        );
      }

      try {
        const inserted = await sql`
          INSERT INTO registrations (
            id,
            pass_code,
            event_id,
            event_title,
            lead_name,
            email,
            phone,
            college_name,
            department,
            year_of_study,
            team_name,
            members,
            fee_amount,
            payment_method,
            utr_number,
            screenshot_url,
            payment_status,
            created_at,
            updated_at
          ) VALUES (
            ${id},
            ${cleanPassCode},
            ${eventId},
            ${eventTitle},
            ${leadName.trim()},
            ${email.trim().toLowerCase()},
            ${phone.trim()},
            ${collegeName.trim()},
            ${department.trim()},
            ${yearOfStudy},
            ${teamName ? teamName.trim() : null},
            ${JSON.stringify(members)},
            ${Number(feeAmount) || 150},
            ${paymentMethod},
            ${cleanUtr},
            ${screenshotUrl || null},
            'paid_pending_verification',
            NOW(),
            NOW()
          )
          RETURNING *;
        `;

        // ACID Audit Record (Durability & Traceability)
        try {
          await sql`
            INSERT INTO registration_audit_logs (
              registration_id,
              action,
              performed_by,
              new_data
            ) VALUES (
              ${id},
              'CREATED',
              'participant_checkout',
              ${JSON.stringify({ pass_code: cleanPassCode, utr: cleanUtr, fee: feeAmount, lead: leadName })}
            );
          `;
        } catch (auditErr) {
          console.warn("Non-fatal: Audit log entry skipped:", auditErr);
        }

        // Send confirmation email (non-blocking — failure never rolls back valid DB commit)
        const emailResult = await sendRegistrationConfirmationEmail({
          toEmail: email.trim().toLowerCase(),
          leadName: leadName.trim(),
          eventTitle,
          eventCategory: "",
          passCode: cleanPassCode,
          feeAmount: Number(feeAmount) || 150,
          utrNumber: cleanUtr,
          teamName: teamName ? teamName.trim() : undefined,
          members: Array.isArray(members) ? members.filter(Boolean) : [],
          collegeName: collegeName.trim(),
          department: department.trim(),
          yearOfStudy,
        }).catch((e) => ({ success: false, error: String(e) }));

        return NextResponse.json(
          {
            success: true,
            message: "Registration successfully recorded in Neon PostgreSQL database.",
            registration: inserted[0],
            source: "neon_database",
            emailSent: emailResult.success,
          },
          { status: 201 }
        );
      } catch (dbErr: any) {
        // ACID Protection: Check for Unique Constraint Violations (UTR collision or Passcode collision)
        const errStr = String(dbErr || "");
        if (errStr.includes("unique") || errStr.includes("uq_registrations_utr") || errStr.includes("23505")) {
          return NextResponse.json(
            {
              error: "This UPI transaction UTR has already been committed to the database. Duplicate submissions are strictly prevented.",
              code: "UTR_ALREADY_COMMITTED",
            },
            { status: 409 }
          );
        }
        throw dbErr; // Forward to global handler
      }
    }

    // 3. Fallback in-memory mode when DATABASE_URL is not yet set
    const fallbackRow: RegistrationRow = {
      id,
      pass_code: cleanPassCode,
      event_id: eventId,
      event_title: eventTitle,
      lead_name: leadName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      college_name: collegeName.trim(),
      department: department.trim(),
      year_of_study: yearOfStudy,
      team_name: teamName ? teamName.trim() : null,
      members: members,
      fee_amount: Number(feeAmount) || 150,
      payment_method: paymentMethod,
      utr_number: cleanUtr,
      screenshot_url: screenshotUrl || null,
      payment_status: "paid_pending_verification",
      created_at: nowIso,
      updated_at: nowIso,
    };

    mockRegistrations.set(cleanPassCode, fallbackRow);

    // Send confirmation email (non-blocking)
    const emailResult = await sendRegistrationConfirmationEmail({
      toEmail: email.trim().toLowerCase(),
      leadName: leadName.trim(),
      eventTitle,
      eventCategory: "",
      passCode: cleanPassCode,
      feeAmount: Number(feeAmount) || 150,
      utrNumber: cleanUtr,
      teamName: teamName ? teamName.trim() : undefined,
      members: Array.isArray(members) ? members.filter(Boolean) : [],
      collegeName: collegeName.trim(),
      department: department.trim(),
      yearOfStudy,
    }).catch((e) => ({ success: false, error: String(e) }));

    return NextResponse.json(
      {
        success: true,
        message: "Registration saved in fallback store (Configure DATABASE_URL for permanent Neon persistence).",
        registration: fallbackRow,
        source: "local_fallback",
        emailSent: emailResult.success,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/registrations:", error);
    return NextResponse.json(
      {
        error: "Failed to process registration submission.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const passCode = searchParams.get("passCode");
    const email = searchParams.get("email");
    const eventId = searchParams.get("eventId");

    if (isDatabaseConfigured()) {
      const sql = getDb();

      if (passCode) {
        const rows = await sql`
          SELECT * FROM registrations WHERE pass_code = ${passCode.trim()} LIMIT 1;
        `;
        if (rows.length === 0) {
          return NextResponse.json({ error: "Passcode not found in dossier." }, { status: 404 });
        }
        return NextResponse.json({ success: true, registration: rows[0] });
      }

      if (email) {
        const rows = await sql`
          SELECT * FROM registrations WHERE email = ${email.trim().toLowerCase()} ORDER BY created_at DESC;
        `;
        return NextResponse.json({ success: true, count: rows.length, registrations: rows });
      }

      // Restrict bulk / unconstrained queries to authorized admins only
      if (!isAuthorizedAdmin(req)) {
        return NextResponse.json(
          { error: "Email or passcode query parameter is required to view registrations." },
          { status: 400 }
        );
      }

      if (eventId) {
        const rows = await sql`
          SELECT * FROM registrations WHERE event_id = ${eventId} ORDER BY created_at DESC;
        `;
        return NextResponse.json({ success: true, count: rows.length, registrations: rows });
      }

      const rows = await sql`
        SELECT * FROM registrations ORDER BY created_at DESC LIMIT 100;
      `;
      return NextResponse.json({ success: true, count: rows.length, registrations: rows });
    }

    // Fallback in-memory
    const all = Array.from(mockRegistrations.values());
    if (passCode) {
      const found = mockRegistrations.get(passCode.trim());
      if (!found) {
        return NextResponse.json({ error: "Passcode not found in fallback store." }, { status: 404 });
      }
      return NextResponse.json({ success: true, registration: found });
    }

    if (email) {
      const filtered = all.filter((r) => r.email === email.trim().toLowerCase());
      return NextResponse.json({ success: true, count: filtered.length, registrations: filtered });
    }

    if (!isAuthorizedAdmin(req)) {
      return NextResponse.json(
        { error: "Email or passcode query parameter is required to view registrations." },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, count: all.length, registrations: all });
  } catch (error) {
    console.error("Error in GET /api/registrations:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch registrations.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
