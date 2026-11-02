# Technix 8.0 — Standalone FastAPI Backend

High-performance, async Python backend powering the **TECHNIX 8.0** National Level Technical Fest (Department of AI & ML, BMSIT&M).

---

## ⚡ Tech Stack & Architecture

- **Framework:** [FastAPI](https://fastapi.tiangolo.com/) (Python 3.12+)
- **ASGI Server:** [Uvicorn](https://www.uvicorn.org/) with hot-reloading
- **Database:** [Neon Serverless PostgreSQL](https://neon.tech/) via async driver [`asyncpg`](https://magicstack.github.io/asyncpg/)
- **Validation & Serialization:** [Pydantic v2](https://docs.pydantic.dev/) + `pydantic-settings`
- **Transactional Email:** Brevo REST API v3 via async [`httpx`](https://www.python-httpx.org/)
- **Document Generation:** [ReportLab](https://www.reportlab.com/) (PDF event dossier & tickets) + standard CSV writer
- **Interactive Documentation:** Automated OpenAPI 3.0 (Swagger UI at `/docs`, ReDoc at `/redoc`)

---

## 📂 Directory Structure

```text
backend/
├── app/
│   ├── __init__.py
│   ├── config.py                 # Pydantic Settings & environment variables
│   ├── database.py               # asyncpg connection pool & schema auto-initialization
│   ├── main.py                   # FastAPI app instance, CORS & router registrations
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── health.py             # Database ping, uptime, readiness checks
│   │   ├── registrations.py      # Registration creation & pass lookup by email/passcode
│   │   ├── events.py             # Event listings merged with dynamic database overrides
│   │   ├── admin.py              # Admin authentication, analytics, registrant CRUD, event edit
│   │   └── export.py             # Streaming CSV and ReportLab PDF downloads
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── registration.py       # Pydantic schemas for registrations
│   │   ├── event.py              # Pydantic schemas for events and overrides
│   │   └── admin.py              # Pydantic schemas for auth and stats
│   └── services/
│       ├── __init__.py
│       ├── auth_service.py       # Admin token generation and bearer verification
│       ├── email_service.py      # Async Brevo transactional email dispatcher
│       └── export_service.py     # CSV and ReportLab PDF dossier generation
├── .env                          # Local credentials (git-ignored)
├── .env.example                  # Template configuration
├── requirements.txt              # Pinned Python package dependencies
├── run.py                        # Server launcher
└── README.md                     # Documentation
```

---

## 🚀 Quick Start

### 1. Requirements
Ensure Python 3.10+ (tested on Python 3.12) is installed.

### 2. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 3. Environment Configuration
Verify that `backend/.env` contains your Neon Database URL and Brevo API credentials:
```env
DATABASE_URL=postgresql://<user>:<password>@<host>/neondb?sslmode=require
BREVO_API_KEY=xkeysib-<your-brevo-api-key>
BREVO_SENDER_EMAIL=your-email@example.com
BREVO_SENDER_NAME=TECHNIX 8.0 Team
ADMIN_SECRET_KEY=your-strong-secret-key
PORT=8000
HOST=0.0.0.0
CORS_ORIGINS=["http://localhost:3000","http://127.0.0.1:3000"]
```

### 4. Run the Server
```bash
python run.py
```
Or with uvicorn directly:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 📖 API Documentation & Endpoints

Open your browser to:
- **Interactive Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

### Key Endpoints:

| Category | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **System** | `GET` | `/health` | Server and Neon DB live connection status |
| **Registrations** | `POST` | `/api/registrations` | Register user for events, generate TXN/passcode, dispatch Brevo email |
| **Registrations** | `GET` | `/api/registrations/my-passes` | Retrieve confirmed passes via email + passcode |
| **Events** | `GET` | `/api/events` | List all 11 festival events with dynamic DB price/slot overrides |
| **Events** | `GET` | `/api/events/{event_id}` | Fetch a single event's details |
| **Admin** | `POST` | `/api/admin/login` | Authenticate using admin secret key |
| **Admin** | `GET` | `/api/admin/stats` | Festival analytics (revenue, attendee counts, popular events) |
| **Admin** | `GET` | `/api/admin/registrations` | Paginated registrant records with multi-field search and filters |
| **Admin** | `PATCH` | `/api/admin/registrations/{id}` | Update attendee status or payment verification |
| **Admin** | `DELETE`| `/api/admin/registrations/{id}` | Remove a registration record |
| **Admin** | `PATCH` | `/api/admin/events/{event_id}` | Update event fee, registration open status, or max slots in DB |
| **Export** | `GET` | `/api/admin/export/csv` | Download full attendee records as Excel-compatible CSV |
| **Export** | `GET` | `/api/admin/export/pdf` | Download formatted Technix 8.0 attendee dossier report as PDF |

---

## 🛡️ Database Auto-Migration
On server startup, `app/database.py` verifies and provisions:
1. `registrations` table (with indexes on `email`, `passcode`, `transaction_id`, `created_at`).
2. `contact_queries` table for helpdesk queries.
3. `event_overrides` table for live admin modifications of event fees and capacities.
