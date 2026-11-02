import json
import time
import hmac
from typing import Optional, List, Dict
from fastapi import APIRouter, Depends, HTTPException, Query, status, Request
from app.config import settings
from app.database import get_pool
from app.schemas.admin import AdminLoginRequest, AdminTokenResponse, DashboardStatsResponse
from app.schemas.registration import RegistrationResponse, RegistrationUpdate, RegistrationListResponse
from app.schemas.event import EventOverrideUpdate, EventListResponse
from app.services.auth_service import verify_admin_key, create_admin_token
from app.routers.events import get_merged_events

router = APIRouter(prefix="/api/admin", tags=["Admin Command"])

_admin_attempts: Dict[str, Dict[str, int]] = {}

@router.post("/auth", response_model=AdminTokenResponse)
@router.post("/login", response_model=AdminTokenResponse)
async def admin_login(data: AdminLoginRequest, request: Request):
    """Authenticates admin security clearance passcode and issues a cryptographically signed authorization token."""
    client_ip = request.client.host if request.client else "unknown"
    now = int(time.time())

    # Check lockout
    attempt = _admin_attempts.get(client_ip)
    if attempt and attempt.get("locked_until", 0) > now:
        remaining = attempt["locked_until"] - now
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Too many failed clearance attempts. Command console locked for {remaining} seconds.",
        )

    if not hmac.compare_digest(data.passcode.strip(), settings.ADMIN_SECRET_KEY.strip()):
        count = (attempt.get("count", 0) + 1) if attempt else 1
        locked_until = now + 300 if count >= 5 else 0
        _admin_attempts[client_ip] = {"count": count, "locked_until": locked_until}
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect admin clearance key.",
        )

    # Success: reset attempts
    if client_ip in _admin_attempts:
        del _admin_attempts[client_ip]

    token = create_admin_token(data.passcode.strip())
    return {
        "success": True,
        "token": token,
        "message": "Clearance granted. Welcome to Technix 8.0 Command Mainframe.",
    }

@router.get("/stats", response_model=DashboardStatsResponse, dependencies=[Depends(verify_admin_key)])
async def get_dashboard_stats():
    """Calculates executive dashboard stats from Neon PostgreSQL."""
    pool = get_pool()
    async with pool.acquire() as conn:
        total_reg = await conn.fetchval("SELECT COUNT(*) FROM registrations;")
        total_rev = await conn.fetchval("SELECT COALESCE(SUM(fee_amount), 0) FROM registrations;")
        verified = await conn.fetchval("SELECT COUNT(*) FROM registrations WHERE payment_status IN ('verified', 'paid_verified');")
        pending = await conn.fetchval("SELECT COUNT(*) FROM registrations WHERE payment_status = 'paid_pending_verification';")
        rejected = await conn.fetchval("SELECT COUNT(*) FROM registrations WHERE payment_status = 'rejected';")

    return {
        "success": True,
        "total_registrations": total_reg,
        "total_revenue": total_rev,
        "verified_count": verified,
        "pending_count": pending,
        "rejected_count": rejected,
        "active_events": 11,
    }

@router.get("/registrations", response_model=RegistrationListResponse, dependencies=[Depends(verify_admin_key)])
async def admin_list_registrations(
    q: Optional[str] = Query(None, description="Search query across candidate, phone, email, pass, UTR, college"),
    event_id: Optional[str] = Query(None, alias="eventId", description="Filter by event slug"),
    status: Optional[str] = Query(None, description="Filter by payment status"),
):
    """Retrieves all registrations with live search and multi-criteria filters."""
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

    # In-memory filter
    filtered = parsed
    if event_id and event_id != "all":
        filtered = [r for r in filtered if r["event_id"] == event_id]
    if status and status != "all":
        filtered = [r for r in filtered if r["payment_status"] == status]
    if q and q.strip():
        search = q.strip().lower()
        filtered = [
            r for r in filtered
            if search in r["lead_name"].lower()
            or search in r["email"].lower()
            or search in r["phone"].lower()
            or search in r["pass_code"].lower()
            or (r.get("utr_number") and search in r["utr_number"].lower())
            or search in r["college_name"].lower()
            or search in r["event_title"].lower()
            or (r.get("team_name") and search in r["team_name"].lower())
            or search in " ".join(r.get("members", [])).lower()
        ]

    return {
        "success": True,
        "count": len(filtered),
        "total": len(parsed),
        "registrations": filtered,
    }

@router.patch("/registrations/{reg_id}", response_model=RegistrationResponse, dependencies=[Depends(verify_admin_key)])
async def update_registration(reg_id: str, data: RegistrationUpdate):
    """Updates candidate registration details or payment verification status."""
    pool = get_pool()
    async with pool.acquire() as conn:
        existing = await conn.fetchrow(
            "SELECT * FROM registrations WHERE id = $1 OR pass_code = $1 LIMIT 1;",
            reg_id
        )
        if not existing:
            raise HTTPException(status_code=404, detail="Registration record not found.")

        row = dict(existing)
        new_status = data.payment_status if data.payment_status is not None else row["payment_status"]
        new_lead = data.lead_name if data.lead_name is not None else row["lead_name"]
        new_email = data.email if data.email is not None else row["email"]
        new_phone = data.phone if data.phone is not None else row["phone"]
        new_college = data.college_name if data.college_name is not None else row["college_name"]
        new_dept = data.department if data.department is not None else row["department"]
        new_year = data.year_of_study if data.year_of_study is not None else row["year_of_study"]
        new_team = data.team_name if data.team_name is not None else row["team_name"]
        new_members = json.dumps(data.members) if data.members is not None else row["members"]
        if isinstance(new_members, list):
            new_members = json.dumps(new_members)
        new_event_id = data.event_id if data.event_id is not None else row["event_id"]
        new_event_title = data.event_title if data.event_title is not None else row["event_title"]
        new_fee = data.fee_amount if data.fee_amount is not None else row["fee_amount"]
        new_utr = data.utr_number if data.utr_number is not None else row["utr_number"]

        updated = await conn.fetchrow("""
            UPDATE registrations
            SET
                payment_status = $1,
                lead_name = $2,
                email = $3,
                phone = $4,
                college_name = $5,
                department = $6,
                year_of_study = $7,
                team_name = $8,
                members = $9::jsonb,
                event_id = $10,
                event_title = $11,
                fee_amount = $12,
                utr_number = $13,
                updated_at = NOW()
            WHERE id = $14
            RETURNING *;
        """,
            new_status, new_lead, new_email, new_phone, new_college, new_dept,
            new_year, new_team, new_members, new_event_id, new_event_title,
            new_fee, new_utr, row["id"]
        )

    res_dict = dict(updated)
    if isinstance(res_dict.get("members"), str):
        try:
            res_dict["members"] = json.loads(res_dict["members"])
        except Exception:
            res_dict["members"] = []

    return res_dict

@router.delete("/registrations/{reg_id}", dependencies=[Depends(verify_admin_key)])
async def delete_registration(reg_id: str):
    """Deletes a registration record permanently from Neon PostgreSQL."""
    pool = get_pool()
    async with pool.acquire() as conn:
        res = await conn.execute(
            "DELETE FROM registrations WHERE id = $1 OR pass_code = $1;",
            reg_id
        )
        if res == "DELETE 0":
            raise HTTPException(status_code=404, detail="Registration record not found.")

    return {"success": True, "message": f"Registration {reg_id} deleted successfully."}

@router.get("/events", dependencies=[Depends(verify_admin_key)])
async def get_admin_events():
    """Retrieves all 11 events merged with dynamic Neon DB overrides for admin dashboard."""
    events = await get_merged_events()
    return {"success": True, "events": events}

@router.patch("/events", dependencies=[Depends(verify_admin_key)])
async def update_event_overrides(data: EventOverrideUpdate):
    """Updates event overrides (prizes, venue, schedules, fees, open status, coordinators)."""
    pool = get_pool()
    coord_json = json.dumps([c.model_dump() for c in data.coordinators]) if data.coordinators is not None else None

    async with pool.acquire() as conn:
        await conn.execute("""
            INSERT INTO event_overrides (
                event_id, custom_title, custom_subtitle, custom_fee,
                winning_prize, runner_up_prize, venue, schedule_time,
                is_open, coordinators, updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb, NOW())
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
        """,
            data.event_id,
            data.custom_title,
            data.custom_subtitle,
            data.custom_fee,
            data.winning_prize,
            data.runner_up_prize,
            data.venue,
            data.schedule_time,
            data.is_open if data.is_open is not None else True,
            coord_json,
        )

    return {"success": True, "message": f"Event {data.event_id} configuration saved to Neon DB."}
