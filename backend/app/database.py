import ssl
import json
import logging
from urllib.parse import urlparse, parse_qs
from typing import Optional, List, Dict, Any
import asyncpg
from app.config import settings

logger = logging.getLogger("technix.database")

_pool: Optional[asyncpg.Pool] = None

def get_connection_kwargs(database_url: str) -> dict:
    """
    Parses a Postgres DSN and returns asyncpg compatible kwargs.
    Handles Neon DB SSL configuration smoothly.
    """
    parsed = urlparse(database_url)
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE

    return {
        "user": parsed.username,
        "password": parsed.password,
        "database": parsed.path.lstrip("/"),
        "host": parsed.hostname,
        "port": parsed.port or 5432,
        "ssl": ssl_context,
        "min_size": 2,
        "max_size": 10,
        "command_timeout": 60,
    }

async def connect_db():
    """Initializes the asyncpg connection pool to Neon PostgreSQL."""
    global _pool
    try:
        kwargs = get_connection_kwargs(settings.DATABASE_URL)
        _pool = await asyncpg.create_pool(**kwargs)
        logger.info("✅ Connected to Neon PostgreSQL pool successfully.")
        await init_db()
    except Exception as e:
        logger.error(f"❌ Failed to connect to Neon PostgreSQL pool: {e}")
        raise e

async def disconnect_db():
    """Closes the asyncpg connection pool."""
    global _pool
    if _pool:
        await _pool.close()
        logger.info("Closed Neon PostgreSQL connection pool.")

def get_pool() -> asyncpg.Pool:
    """Returns the active asyncpg connection pool."""
    if not _pool:
        raise RuntimeError("Database pool has not been initialized.")
    return _pool

async def init_db():
    """Ensures tables and indexes exist in Neon PostgreSQL."""
    pool = get_pool()
    async with pool.acquire() as conn:
        # 1. Registrations table
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS registrations (
                id VARCHAR(64) PRIMARY KEY,
                pass_code VARCHAR(32) NOT NULL UNIQUE,
                event_id VARCHAR(64) NOT NULL,
                event_title VARCHAR(255) NOT NULL,
                lead_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(32) NOT NULL,
                college_name VARCHAR(255) NOT NULL,
                department VARCHAR(128) NOT NULL,
                year_of_study VARCHAR(64) NOT NULL,
                team_name VARCHAR(255),
                members JSONB NOT NULL DEFAULT '[]'::jsonb,
                fee_amount INTEGER NOT NULL DEFAULT 150,
                payment_method VARCHAR(32) NOT NULL DEFAULT 'UPI_QR',
                utr_number VARCHAR(64),
                screenshot_url TEXT,
                payment_status VARCHAR(32) NOT NULL DEFAULT 'paid_pending_verification',
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        """)

        # Indexes
        await conn.execute("CREATE INDEX IF NOT EXISTS idx_reg_pass_code ON registrations(pass_code);")
        await conn.execute("CREATE INDEX IF NOT EXISTS idx_reg_email ON registrations(email);")
        await conn.execute("CREATE INDEX IF NOT EXISTS idx_reg_event_id ON registrations(event_id);")
        await conn.execute("CREATE INDEX IF NOT EXISTS idx_reg_utr ON registrations(utr_number);")
        await conn.execute("CREATE INDEX IF NOT EXISTS idx_reg_created ON registrations(created_at DESC);")

        # Check-in support
        await conn.execute("ALTER TABLE registrations ADD COLUMN IF NOT EXISTS checked_in BOOLEAN DEFAULT false;")
        await conn.execute("ALTER TABLE registrations ADD COLUMN IF NOT EXISTS checked_in_at TIMESTAMPTZ;")

        # 2. Contact queries table
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS contact_queries (
                id VARCHAR(64) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(32),
                subject VARCHAR(255),
                message TEXT NOT NULL,
                status VARCHAR(32) NOT NULL DEFAULT 'pending',
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        """)

        # 3. Event overrides table
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS event_overrides (
                event_id VARCHAR(64) PRIMARY KEY,
                custom_title VARCHAR(255),
                custom_subtitle VARCHAR(255),
                custom_fee INTEGER,
                winning_prize VARCHAR(64),
                runner_up_prize VARCHAR(64),
                venue VARCHAR(255),
                schedule_time VARCHAR(255),
                is_open BOOLEAN DEFAULT true,
                coordinators JSONB,
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        """)

        logger.info("✅ Database tables and indexes verified in Neon PostgreSQL.")
