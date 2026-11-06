"""
Technix 8.0 FastAPI Backend Runner
Production-grade launcher with robust environment variable and port parsing.
"""

import os
import sys
import uvicorn

if __name__ == "__main__":
    # Robust port resolution: handles Render, Railway, Cloud Run, Heroku, Docker
    raw_port = os.getenv("PORT", "8000")
    try:
        # Strip any accidental whitespace or quotes
        cleaned_port = str(raw_port).strip().strip("'\"")
        port = int(cleaned_port)
    except (ValueError, TypeError):
        print(f"[Warning] PORT value '{raw_port}' could not be parsed as integer. Falling back to port 8000.")
        port = 8000

    host = os.getenv("HOST", "0.0.0.0")
    is_debug = os.getenv("DEBUG", "false").lower() in ("true", "1")

    print("\n========================================================")
    print("  🚀 TECHNIX 8.0 FASTAPI BACKEND SERVER")
    print(f"  Bound Address: http://{host}:{port}")
    print(f"  Interactive Docs: http://{host}:{port}/docs")
    print(f"  Debug/Reload:  {is_debug}")
    print("========================================================\n", flush=True)

    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=is_debug,
        proxy_headers=True,
        forwarded_allow_ips="*",
    )
