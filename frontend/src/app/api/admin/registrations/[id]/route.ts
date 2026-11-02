import { NextRequest, NextResponse } from "next/server";
import { getDb, isDatabaseConfigured, mockRegistrations, RegistrationRow } from "@/lib/db";
import { isAuthorizedAdmin } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized access. Valid clearance token required." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    const {
      payment_status,
      lead_name,
      email,
      phone,
      college_name,
      department,
      year_of_study,
      team_name,
      members,
      event_id,
      event_title,
      fee_amount,
      utr_number,
    } = body;

    if (isDatabaseConfigured()) {
      const sql = getDb();

      // Check existence
      const existing = await sql`
        SELECT * FROM registrations WHERE id = ${id} OR pass_code = ${id} LIMIT 1;
      `;

      if (existing.length === 0) {
        return NextResponse.json({ error: "Registration record not found." }, { status: 404 });
      }

      const row = existing[0];
      const newStatus = payment_status !== undefined ? payment_status : row.payment_status;
      const newLeadName = lead_name !== undefined ? lead_name.trim() : row.lead_name;
      const newEmail = email !== undefined ? email.trim().toLowerCase() : row.email;
      const newPhone = phone !== undefined ? phone.trim() : row.phone;
      const newCollege = college_name !== undefined ? college_name.trim() : row.college_name;
      const newDept = department !== undefined ? department.trim() : row.department;
      const newYear = year_of_study !== undefined ? year_of_study : row.year_of_study;
      const newTeamName = team_name !== undefined ? (team_name ? team_name.trim() : null) : row.team_name;
      const newMembers = members !== undefined ? (Array.isArray(members) ? JSON.stringify(members) : members) : (typeof row.members === "string" ? row.members : JSON.stringify(row.members || []));
      const newEventId = event_id !== undefined ? event_id : row.event_id;
      const newEventTitle = event_title !== undefined ? event_title : row.event_title;
      const newFee = fee_amount !== undefined ? Number(fee_amount) : row.fee_amount;
      const newUtr = utr_number !== undefined ? (utr_number ? utr_number.trim() : null) : row.utr_number;

      const updated = await sql`
        UPDATE registrations
        SET
          payment_status = ${newStatus},
          lead_name = ${newLeadName},
          email = ${newEmail},
          phone = ${newPhone},
          college_name = ${newCollege},
          department = ${newDept},
          year_of_study = ${newYear},
          team_name = ${newTeamName},
          members = ${newMembers}::jsonb,
          event_id = ${newEventId},
          event_title = ${newEventTitle},
          fee_amount = ${newFee},
          utr_number = ${newUtr},
          updated_at = NOW()
        WHERE id = ${row.id}
        RETURNING *;
      `;

      return NextResponse.json({
        success: true,
        message: "Registration updated successfully.",
        registration: updated[0],
      });
    }

    // Fallback in-memory
    let foundKey: string | null = null;
    let foundRow: RegistrationRow | null = null;
    for (const [key, row] of mockRegistrations.entries()) {
      if (row.id === id || row.pass_code === id) {
        foundKey = key;
        foundRow = row;
        break;
      }
    }

    if (!foundKey || !foundRow) {
      return NextResponse.json({ error: "Registration record not found." }, { status: 404 });
    }

    const updatedRow: RegistrationRow = {
      ...foundRow,
      payment_status: payment_status !== undefined ? payment_status : foundRow.payment_status,
      lead_name: lead_name !== undefined ? lead_name.trim() : foundRow.lead_name,
      email: email !== undefined ? email.trim().toLowerCase() : foundRow.email,
      phone: phone !== undefined ? phone.trim() : foundRow.phone,
      college_name: college_name !== undefined ? college_name.trim() : foundRow.college_name,
      department: department !== undefined ? department.trim() : foundRow.department,
      year_of_study: year_of_study !== undefined ? year_of_study : foundRow.year_of_study,
      team_name: team_name !== undefined ? team_name : foundRow.team_name,
      members: members !== undefined ? members : foundRow.members,
      event_id: event_id !== undefined ? event_id : foundRow.event_id,
      event_title: event_title !== undefined ? event_title : foundRow.event_title,
      fee_amount: fee_amount !== undefined ? Number(fee_amount) : foundRow.fee_amount,
      utr_number: utr_number !== undefined ? utr_number : foundRow.utr_number,
      updated_at: new Date().toISOString(),
    };

    mockRegistrations.set(foundKey, updatedRow);

    return NextResponse.json({
      success: true,
      message: "Registration updated in fallback store.",
      registration: updatedRow,
    });
  } catch (error) {
    console.error("Error in PATCH /api/admin/registrations/[id]:", error);
    return NextResponse.json(
      { error: "Failed to update registration", details: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized access. Valid clearance token required." }, { status: 401 });
  }

  try {
    const { id } = await params;

    if (isDatabaseConfigured()) {
      const sql = getDb();
      const res = await sql`
        DELETE FROM registrations WHERE id = ${id} OR pass_code = ${id} RETURNING id;
      `;
      if (res.length === 0) {
        return NextResponse.json({ error: "Registration record not found." }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: "Registration deleted successfully." });
    }

    // Fallback in-memory
    let foundKey: string | null = null;
    for (const [key, row] of mockRegistrations.entries()) {
      if (row.id === id || row.pass_code === id) {
        foundKey = key;
        break;
      }
    }

    if (!foundKey) {
      return NextResponse.json({ error: "Registration record not found." }, { status: 404 });
    }

    mockRegistrations.delete(foundKey);
    return NextResponse.json({ success: true, message: "Registration deleted from fallback store." });
  } catch (error) {
    console.error("Error in DELETE /api/admin/registrations/[id]:", error);
    return NextResponse.json(
      { error: "Failed to delete registration", details: String(error) },
      { status: 500 }
    );
  }
}
