import { NextRequest, NextResponse } from "next/server";
import { getDb, isDatabaseConfigured, mockRegistrations } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ passCode: string }> }
) {
  try {
    const { passCode } = await context.params;

    if (!passCode) {
      return NextResponse.json({ error: "Passcode is required." }, { status: 400 });
    }

    const cleanPassCode = passCode.trim().toUpperCase();

    if (isDatabaseConfigured()) {
      const sql = getDb();
      const rows = await sql`
        SELECT * FROM registrations WHERE UPPER(pass_code) = ${cleanPassCode} LIMIT 1;
      `;

      if (rows.length === 0) {
        return NextResponse.json(
          { error: `Registration with pass code ${cleanPassCode} not found.` },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, registration: rows[0] });
    }

    // Fallback store
    for (const [code, reg] of mockRegistrations.entries()) {
      if (code.toUpperCase() === cleanPassCode) {
        return NextResponse.json({ success: true, registration: reg });
      }
    }

    return NextResponse.json(
      { error: `Registration with pass code ${cleanPassCode} not found in store.` },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error in GET /api/registrations/[passCode]:", error);
    return NextResponse.json(
      {
        error: "Failed to query registration passcode.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
