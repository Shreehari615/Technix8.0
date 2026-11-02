"""
Technix 8.0 FastAPI Backend Runner
Launches Uvicorn server with hot reloading.
"""

import os
import uvicorn

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    print("\n========================================================")
    print("  TECHNIX 8.0 FASTAPI BACKEND SERVER")
    print(f"  API Server:   http://localhost:{port}")
    print(f"  Swagger Docs: http://localhost:{port}/docs")
    print(f"  ReDoc Docs:   http://localhost:{port}/redoc")
    print("========================================================\n")
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=True,
    )
