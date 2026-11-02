import { NextRequest, NextResponse } from "next/server";
import { eventsData } from "@/data/eventsData";
import { getDb, isDatabaseConfigured } from "@/lib/db";
import { isAuthorizedAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    let overridesMap: Record<string, any> = {};

    if (isDatabaseConfigured()) {
      try {
        const sql = getDb();
        const rows = await sql`SELECT * FROM event_overrides;`;
        rows.forEach((r: any) => {
          overridesMap[r.event_id] = r;
        });
      } catch (e) {
        console.warn("Could not read event_overrides from DB:", e);
      }
    }

    const merged = eventsData.map((ev) => {
      const override = overridesMap[ev.id];
      if (!override) return { ...ev, isOpen: true };

      return {
        ...ev,
        title: override.custom_title || ev.title,
        subtitle: override.custom_subtitle || ev.subtitle,
        feeAmount: override.custom_fee !== null && override.custom_fee !== undefined ? override.custom_fee : ev.feeAmount,
        winningPrize: override.winning_prize || ev.winningPrize,
        runnerUpPrize: override.runner_up_prize || ev.runnerUpPrize,
        venue: override.venue || ev.venue,
        scheduleTime: override.schedule_time || ev.scheduleTime,
        isOpen: override.is_open !== undefined ? override.is_open : true,
        coordinators: override.coordinators ? (typeof override.coordinators === "string" ? JSON.parse(override.coordinators) : override.coordinators) : ev.coordinators,
      };
    });

    return NextResponse.json({ success: true, events: merged });
  } catch (error) {
    console.error("Error in GET /api/admin/events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events", details: String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized access. Valid clearance token required." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      eventId,
      customTitle,
      customSubtitle,
      customFee,
      winningPrize,
      runnerUpPrize,
      venue,
      scheduleTime,
      isOpen,
      coordinators,
    } = body;

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required." }, { status: 400 });
    }

    if (isDatabaseConfigured()) {
      const sql = getDb();
      const coordJson = coordinators ? JSON.stringify(coordinators) : null;

      await sql`
        INSERT INTO event_overrides (
          event_id, custom_title, custom_subtitle, custom_fee, winning_prize, runner_up_prize,
          venue, schedule_time, is_open, coordinators, updated_at
        )
        VALUES (
          ${eventId},
          ${customTitle || null},
          ${customSubtitle || null},
          ${customFee !== undefined ? Number(customFee) : null},
          ${winningPrize || null},
          ${runnerUpPrize || null},
          ${venue || null},
          ${scheduleTime || null},
          ${isOpen !== undefined ? Boolean(isOpen) : true},
          ${coordJson}::jsonb,
          NOW()
        )
        ON CONFLICT (event_id) DO UPDATE SET
          custom_title = COALESCE(EXCLUDED.custom_title, event_overrides.custom_title),
          custom_subtitle = COALESCE(EXCLUDED.custom_subtitle, event_overrides.custom_subtitle),
          custom_fee = COALESCE(EXCLUDED.custom_fee, event_overrides.custom_fee),
          winning_prize = COALESCE(EXCLUDED.winning_prize, event_overrides.winning_prize),
          runner_up_prize = COALESCE(EXCLUDED.runner_up_prize, event_overrides.runner_up_prize),
          venue = COALESCE(EXCLUDED.venue, event_overrides.venue),
          schedule_time = COALESCE(EXCLUDED.schedule_time, event_overrides.schedule_time),
          is_open = COALESCE(EXCLUDED.is_open, event_overrides.is_open),
          coordinators = COALESCE(EXCLUDED.coordinators, event_overrides.coordinators),
          updated_at = NOW();
      `;

      return NextResponse.json({
        success: true,
        message: "Event configurations updated successfully in Neon DB.",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Event configuration updated (fallback mode).",
    });
  } catch (error) {
    console.error("Error in PATCH /api/admin/events:", error);
    return NextResponse.json(
      { error: "Failed to update event configuration", details: String(error) },
      { status: 500 }
    );
  }
}
