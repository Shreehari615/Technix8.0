import { NextRequest, NextResponse } from "next/server";
import { getDb, isDatabaseConfigured, mockRegistrations, RegistrationRow } from "@/lib/db";
import { isAuthorizedAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized access. Valid clearance token required." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("q")?.toLowerCase() || "";
    const eventId = searchParams.get("eventId");
    const status = searchParams.get("status");

    if (isDatabaseConfigured()) {
      const sql = getDb();
      // Fetch all registrations ordered by creation time
      const rows = await sql`
        SELECT * FROM registrations ORDER BY created_at DESC;
      `;

      let filtered = rows as unknown as RegistrationRow[];

      if (eventId && eventId !== "all") {
        filtered = filtered.filter((r) => r.event_id === eventId);
      }

      if (status && status !== "all") {
        filtered = filtered.filter((r) => r.payment_status === status);
      }

      if (search) {
        filtered = filtered.filter((r) => {
          const membersStr = Array.isArray(r.members)
            ? r.members.join(" ")
            : typeof r.members === "string"
            ? r.members
            : "";
          return (
            r.lead_name.toLowerCase().includes(search) ||
            r.email.toLowerCase().includes(search) ||
            r.phone.toLowerCase().includes(search) ||
            r.pass_code.toLowerCase().includes(search) ||
            (r.utr_number && r.utr_number.toLowerCase().includes(search)) ||
            r.college_name.toLowerCase().includes(search) ||
            r.event_title.toLowerCase().includes(search) ||
            (r.team_name && r.team_name.toLowerCase().includes(search)) ||
            membersStr.toLowerCase().includes(search)
          );
        });
      }

      return NextResponse.json({
        success: true,
        count: filtered.length,
        total: rows.length,
        registrations: filtered,
      });
    }

    // Fallback in-memory
    let all = Array.from(mockRegistrations.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    if (eventId && eventId !== "all") {
      all = all.filter((r) => r.event_id === eventId);
    }
    if (status && status !== "all") {
      all = all.filter((r) => r.payment_status === status);
    }
    if (search) {
      all = all.filter((r) => {
        const membersStr = Array.isArray(r.members) ? r.members.join(" ") : String(r.members || "");
        return (
          r.lead_name.toLowerCase().includes(search) ||
          r.email.toLowerCase().includes(search) ||
          r.phone.toLowerCase().includes(search) ||
          r.pass_code.toLowerCase().includes(search) ||
          (r.utr_number && r.utr_number.toLowerCase().includes(search)) ||
          r.college_name.toLowerCase().includes(search) ||
          r.event_title.toLowerCase().includes(search)
        );
      });
    }

    return NextResponse.json({
      success: true,
      count: all.length,
      total: mockRegistrations.size,
      registrations: all,
    });
  } catch (error) {
    console.error("Error in GET /api/admin/registrations:", error);
    return NextResponse.json(
      { error: "Failed to fetch registrations", details: String(error) },
      { status: 500 }
    );
  }
}
