import uuid
from typing import Optional, List
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr, ConfigDict, Field
from pydantic.alias_generators import to_camel
from app.database import get_pool
from app.services.auth_service import verify_admin_key

router = APIRouter(prefix="/api/contact", tags=["Contact & Support"])

class ContactQueryCreate(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, extra="ignore")

    name: str = Field(..., min_length=2, description="Inquirer name")
    email: EmailStr = Field(..., description="Reply email address")
    phone: Optional[str] = None
    subject: Optional[str] = "General Inquiry"
    message: str = Field(..., min_length=5, description="Inquiry message body")

class ContactQueryResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, extra="ignore")

    id: str
    name: str
    email: str
    phone: Optional[str] = None
    subject: Optional[str] = None
    message: str
    status: str
    created_at: datetime

@router.post("", status_code=status.HTTP_201_CREATED)
async def submit_contact_query(data: ContactQueryCreate):
    """
    Submits a user or sponsor inquiry and stores it in the Neon DB contact_queries table.
    """
    pool = get_pool()
    query_id = f"query_{int(datetime.now().timestamp() * 1000)}_{uuid.uuid4().hex[:6]}"

    async with pool.acquire() as conn:
        row = await conn.fetchrow("""
            INSERT INTO contact_queries (id, name, email, phone, subject, message, status, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, 'pending', NOW())
            RETURNING *;
        """,
            query_id,
            data.name.strip(),
            data.email.strip().lower(),
            data.phone.strip() if data.phone else None,
            data.subject.strip() if data.subject else "General Inquiry",
            data.message.strip(),
        )

    return {
        "success": True,
        "message": "Your inquiry has been transmitted to Technix 8.0 mission desk. We will respond shortly.",
        "query_id": query_id,
    }

@router.get("", dependencies=[Depends(verify_admin_key)])
async def list_contact_queries(status: Optional[str] = None):
    """
    Admin-only endpoint to list incoming contact and helpdesk queries.
    """
    pool = get_pool()
    async with pool.acquire() as conn:
        if status:
            rows = await conn.fetch(
                "SELECT * FROM contact_queries WHERE status = $1 ORDER BY created_at DESC;",
                status.strip()
            )
        else:
            rows = await conn.fetch("SELECT * FROM contact_queries ORDER BY created_at DESC;")

    queries = [dict(r) for r in rows]
    return {
        "success": True,
        "count": len(queries),
        "queries": queries,
    }

@router.patch("/{query_id}", dependencies=[Depends(verify_admin_key)])
async def update_query_status(query_id: str, new_status: str):
    """
    Admin-only endpoint to update query status ('pending', 'resolved', 'in_progress').
    """
    pool = get_pool()
    async with pool.acquire() as conn:
        res = await conn.execute(
            "UPDATE contact_queries SET status = $1 WHERE id = $2;",
            new_status.strip().lower(),
            query_id.strip()
        )
        if res == "UPDATE 0":
            raise HTTPException(status_code=404, detail="Query record not found.")

    return {"success": True, "message": f"Query {query_id} status updated to {new_status}."}
