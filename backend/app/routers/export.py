import json
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, Query, Response
from fastapi.responses import PlainTextResponse
from app.database import get_pool
from app.services.auth_service import verify_admin_key
from app.services.export_service import generate_csv_export, generate_pdf_dossier

router = APIRouter(prefix="/api/admin/export", tags=["Exports"], dependencies=[Depends(verify_admin_key)])

@router.get("/csv")
async def export_csv(
    event_id: Optional[str] = Query(None, alias="eventId"),
    status: Optional[str] = Query(None),
):
    """Generates and downloads an Excel-compatible UTF-8 CSV spreadsheet."""
    pool = get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch("SELECT * FROM registrations ORDER BY created_at DESC;")

    parsed = []
    for r in rows:
        d = dict(r)
        if isinstance(d.get("members"), str):
            try:
                d["members"] = json.loads(d["members"])
            except Exception:
                d["members"] = []
        parsed.append(d)

    if event_id and event_id != "all":
        parsed = [r for r in parsed if r["event_id"] == event_id]
    if status and status != "all":
        parsed = [r for r in parsed if r["payment_status"] == status]

    csv_text = generate_csv_export(parsed)
    filename = f"technix8_registrations_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"

    return Response(
        content=csv_text.encode("utf-8"),
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )

@router.get("/pdf")
async def export_pdf(
    event_id: Optional[str] = Query(None, alias="eventId"),
    status: Optional[str] = Query(None),
):
    """Generates and streams an executive A4 Landscape PDF dossier."""
    pool = get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch("SELECT * FROM registrations ORDER BY created_at DESC;")
        total_reg = len(rows)
        total_rev = sum(r.get("fee_amount", 0) for r in rows)
        verified = sum(1 for r in rows if r.get("payment_status") in ["verified", "paid_verified"])
        pending = sum(1 for r in rows if r.get("payment_status") == "paid_pending_verification")

    parsed = []
    for r in rows:
        d = dict(r)
        if isinstance(d.get("members"), str):
            try:
                d["members"] = json.loads(d["members"])
            except Exception:
                d["members"] = []
        parsed.append(d)

    if event_id and event_id != "all":
        parsed = [r for r in parsed if r["event_id"] == event_id]
    if status and status != "all":
        parsed = [r for r in parsed if r["payment_status"] == status]

    stats = {
        "total_registrations": total_reg,
        "total_revenue": total_rev,
        "verified_count": verified,
        "pending_count": pending,
    }

    pdf_bytes = generate_pdf_dossier(parsed, stats)
    filename = f"technix8_dossier_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
