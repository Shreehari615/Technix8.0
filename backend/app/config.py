import json
from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True

    # Neon PostgreSQL
    DATABASE_URL: str = Field(
        default=""  # Set in backend/.env
    )

    # Brevo API
    BREVO_API_KEY: str = Field(
        default=""  # Set in backend/.env
    )
    BREVO_SENDER_EMAIL: str = "technix8.0team@gmail.com"
    BREVO_SENDER_NAME: str = "TECHNIX 8.0 — BMSIT"

    # Admin Passcode
    ADMIN_SECRET_KEY: str = ""  # Set in backend/.env

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
    ]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
