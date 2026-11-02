import time
from fastapi import APIRouter, HTTPException
from app.database import get_pool

router = APIRouter(tags=["Health"])

START_TIME = time.time()

@router.get("/health")
@router.get("/api/health")
async def health_check():
    """Returns the operational status of the FastAPI backend and Neon PostgreSQL."""
    db_status = "connected"
    try:
        pool = get_pool()
        async with pool.acquire() as conn:
            await conn.fetchval("SELECT 1")
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "service": "TECHNIX 8.0 FastAPI Backend",
        "database": db_status,
        "uptime_seconds": round(time.time() - START_TIME, 2),
    }
