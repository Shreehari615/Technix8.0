import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import connect_db, disconnect_db
from app.routers import health, registrations, events, admin, export, contact, otp

# Configure logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("technix.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle event handler for database pool connection and cleanup."""
    logger.info("🚀 Booting TECHNIX 8.0 FastAPI Backend Mainframe...")
    await connect_db()
    yield
    logger.info("🛑 Shutting down TECHNIX 8.0 Backend...")
    await disconnect_db()

app = FastAPI(
    title="TECHNIX 8.0 — Mission Control Backend API",
    description="""
# 🛡️ TECHNIX 8.0 Backend Service
The official high-performance Python FastAPI backend for TECHNIX 8.0 — BMS Institute of Technology & Management.

### Features
* **Neon PostgreSQL Async Connection Pool** via `asyncpg`
* **Automated Swagger Documentation** (`/docs` and `/redoc`)
* **Brevo Transactional Confirmation Email Dispatcher**
* **Admin Command Center** (Stats, Roster Filtering, CRUD, Event Overrides)
* **Real-time ReportLab PDF Dossier & Excel CSV Generators**
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# CORS Middleware for Next.js frontend communication
is_wildcard_cors = "*" in settings.CORS_ORIGINS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=not is_wildcard_cors,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "SAMEORIGIN"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response

# Register Routers
app.include_router(health.router)
app.include_router(registrations.router)
app.include_router(events.router)
app.include_router(admin.router)
app.include_router(export.router)
app.include_router(contact.router)
app.include_router(otp.router)

@app.get("/", tags=["Root"])
async def root():
    return {
        "status": "online",
        "service": "TECHNIX 8.0 FastAPI Backend",
        "version": "1.0.0",
        "institution": "BMSITM Department of MCA",
        "documentation": "/docs",
        "redoc": "/redoc",
    }
