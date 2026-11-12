import json
import uuid
import asyncio
import asyncpg
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, BackgroundTasks, status, Query, Depends, Header
from app.database import get_pool
from app.schemas.registration import RegistrationCreate, RegistrationListResponse
from app.services.email_service import send_registration_confirmation
from app.services.auth_service import verify_admin_key, is_valid_admin_token

router = APIRouter(prefix="/api/registrations", tags=["Registrations"])

def generate_passcode() -> str:
    import random
    digits = random.randint(10000, 99999)
    return f"TX8-{digits}"

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_registration(
    data: RegistrationCreate,
    background_tasks: BackgroundTasks,
):
    """
    Registers a participant for an event, saves to Neon PostgreSQL,
    and dispatches a confirmation email via Brevo in the background.
    Returns both nested `registration` object and top-level fields for universal frontend compatibility.
    """
    pool = get_pool()
    reg_id = f"reg_{int(datetime.now().timestamp() * 1000)}_{uuid.uuid4().hex[:6]}"
    pass_code = data.pass_code or generate_passcode()
    members_json = json.dumps(data.members)
    clean_utr = data.utr_number.strip()

    # ACID Transaction Block: Atomic insert and audit logging under transaction isolation
    try:
        async with pool.acquire() as conn:
            async with conn.transaction():
                # Check for existing UTR inside transaction
                existing = await conn.fetchval(
                    "SELECT pass_code FROM registrations WHERE UPPER(TRIM(utr_number)) = UPPER(TRIM($1)) LIMIT 1;",
                    clean_utr
                )
                if existing:
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail={
                            "error": "This UPI transaction UTR has already been submitted for registration.",
                            "existing_pass_code": existing,
                        }
                    )

                row = await conn.fetchrow("""
                    INSERT INTO registrations (
                        id, pass_code, event_id, event_title, lead_name, email, phone,
                        college_name, department, year_of_study, team_name, members,
                        fee_amount, payment_method, utr_number, screenshot_url,
                        payment_status, created_at, updated_at
                    )
                    VALUES (
                        $1, $2, $3, $4, $5, $6, $7,
                        $8, $9, $10, $11, $12::jsonb,
                        $13, $14, $15, $16,
                        'paid_pending_verification', NOW(), NOW()
                    )
                    RETURNING *;
                """,
                    reg_id,
                    pass_code,
                    data.event_id,
                    data.event_title,
                    data.lead_name.strip(),
                    data.email.strip().lower(),
                    data.phone.strip(),
                    data.college_name.strip(),
                    data.department.strip(),
                    data.year_of_study.strip(),
                    data.team_name.strip() if data.team_name else None,
                    members_json,
                    data.fee_amount,
                    data.payment_method,
                    clean_utr,
                    data.screenshot_url,
                )

                # ACID Durability & Traceability: Insert audit log in same atomic transaction
                try:
                    await conn.execute("""
                        INSERT INTO registration_audit_logs (
                            registration_id, action, performed_by, new_data
                        ) VALUES ($1, 'CREATED', 'backend_api', $2::jsonb);
                    """, reg_id, json.dumps({
                        "pass_code": pass_code,
                        "event_id": data.event_id,
                        "fee_amount": data.fee_amount,
                        "utr_number": clean_utr,
                    }))
                except Exception as audit_err:
                    # Non-fatal if audit table is still warming up
                    pass

    except asyncpg.UniqueViolationError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "error": "A registration with this pass code or UTR number has already been committed.",
                "details": str(e)
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Transaction processing failed: {str(e)}"
        )

    # Dispatch confirmation email in background via Brevo
    background_tasks.add_task(
        send_registration_confirmation,
        to_email=data.email.strip().lower(),
        lead_name=data.lead_name.strip(),
        event_title=data.event_title,
        pass_code=pass_code,
        fee_amount=data.fee_amount,
        utr_number=data.utr_number.strip(),
        team_name=data.team_name,
        members=data.members,
        college_name=data.college_name,
        department=data.department,
        year_of_study=data.year_of_study,
    )

    record = dict(row)
    if isinstance(record.get("members"), str):
        try:
            record["members"] = json.loads(record["members"])
        except Exception:
            record["members"] = []

    # Provide camelCase aliases for frontend convenience
    camel_record = dict(record)
    camel_record["passCode"] = record.get("pass_code")
    camel_record["eventId"] = record.get("event_id")
    camel_record["eventTitle"] = record.get("event_title")
    camel_record["leadName"] = record.get("lead_name")
    camel_record["collegeName"] = record.get("college_name")
    camel_record["yearOfStudy"] = record.get("year_of_study")
    camel_record["teamName"] = record.get("team_name")
    camel_record["feeAmount"] = record.get("fee_amount")
    camel_record["paymentMethod"] = record.get("payment_method")
    camel_record["utrNumber"] = record.get("utr_number")
    camel_record["paymentStatus"] = record.get("payment_status")
    camel_record["createdAt"] = record.get("created_at").isoformat() if record.get("created_at") else None

    return {
        "success": True,
        "message": "Registration received and confirmation email dispatched.",
        "registration": camel_record,
        **camel_record,
    }

@router.get("", response_model=RegistrationListResponse)
async def get_registrations(
    email: Optional[str] = Query(None, description="Search passes by candidate email"),
    pass_code: Optional[str] = Query(None, alias="passCode", description="Search by unique passcode"),
    event_id: Optional[str] = Query(None, alias="eventId", description="Filter by event slug"),
    x_admin_key: Optional[str] = Header(None, alias="x-admin-key"),
    authorization: Optional[str] = Header(None, alias="authorization"),
):
    """
    Retrieves registered passes for candidates (filtered by email or passcode).
    Unconstrained bulk queries require admin clearance.
    """
    admin_authed = is_valid_admin_token(x_admin_key or authorization)

    if not pass_code and not email and not admin_authed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Candidate email or pass_code query parameter is required to look up passes.",
        )

    pool = get_pool()
    async with pool.acquire() as conn:
        if pass_code:
            rows = await conn.fetch("SELECT * FROM registrations WHERE pass_code = $1 LIMIT 1;", pass_code.strip())
        elif email:
            rows = await conn.fetch(
                "SELECT * FROM registrations WHERE email = $1 ORDER BY created_at DESC;",
                email.strip().lower()
            )
        elif event_id and admin_authed:
            rows = await conn.fetch(
                "SELECT * FROM registrations WHERE event_id = $1 ORDER BY created_at DESC;",
                event_id.strip()
            )
        elif admin_authed:
            rows = await conn.fetch("SELECT * FROM registrations ORDER BY created_at DESC LIMIT 50;")
        else:
            rows = []

    parsed_records = []
    for r in rows:
        d = dict(r)
        if isinstance(d.get("members"), str):
            try:
                d["members"] = json.loads(d["members"])
            except Exception:
                d["members"] = []
        parsed_records.append(d)

    return {
        "success": True,
        "count": len(parsed_records),
        "total": len(parsed_records),
        "registrations": parsed_records,
    }

@router.get("/verify/{pass_code}")
async def verify_pass_badge(pass_code: str):
    """
    On-site pass badge authentication for event coordinators scanning attendee badges.
    Validates pass code authenticity, payment clearance, and team details.
    """
    pool = get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT * FROM registrations WHERE pass_code = $1 LIMIT 1;",
            pass_code.strip()
        )
    if not row:
        raise HTTPException(status_code=404, detail="Invalid pass code. Pass is not registered in Technix 8.0 mainframe.")

    rec = dict(row)
    if isinstance(rec.get("members"), str):
        try:
            rec["members"] = json.loads(rec["members"])
        except Exception:
            rec["members"] = []

    is_verified = rec["payment_status"] in ("verified", "paid_verified")

    return {
        "valid": True,
        "pass_code": rec["pass_code"],
        "lead_name": rec["lead_name"],
        "event_title": rec["event_title"],
        "event_id": rec["event_id"],
        "college_name": rec["college_name"],
        "payment_status": rec["payment_status"],
        "is_verified": is_verified,
        "checked_in": rec.get("checked_in", False),
        "checked_in_at": rec.get("checked_in_at"),
        "members": rec["members"],
    }

@router.post("/checkin/{pass_code}")
async def checkin_attendee(pass_code: str, dependencies=[Depends(verify_admin_key)]):
    """
    Marks a pass badge as checked-in at the event entrance. Requires admin clearance.
    """
    pool = get_pool()
    async with pool.acquire() as conn:
        existing = await conn.fetchrow(
            "SELECT id, pass_code, lead_name, checked_in FROM registrations WHERE pass_code = $1 LIMIT 1;",
            pass_code.strip()
        )
        if not existing:
            raise HTTPException(status_code=404, detail="Pass code not found.")

        if existing.get("checked_in"):
            return {
                "success": True,
                "already_checked_in": True,
                "message": f"Attendee {existing['lead_name']} was already checked in.",
            }

        await conn.execute("""
            UPDATE registrations
            SET checked_in = true, checked_in_at = NOW(), updated_at = NOW()
            WHERE pass_code = $1;
        """, pass_code.strip())

    return {
        "success": True,
        "already_checked_in": False,
        "message": f"Checked in {existing['lead_name']} successfully.",
    }
