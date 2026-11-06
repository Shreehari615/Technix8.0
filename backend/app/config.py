import json
from typing import List, Union
from pydantic_settings import BaseSettings
from pydantic import Field, field_validator

class Settings(BaseSettings):
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = False

    # Neon PostgreSQL
    DATABASE_URL: str = Field(
        default=""  # Set in backend/.env
    )

    # Brevo API
    BREVO_API_KEY: str = Field(
        default=""  # Set in backend/.env
    )
    BREVO_SENDER_EMAIL: str = "technix8.0team@gmail.com"
    BREVO_SENDER_NAME: str = "TECHNIX 8.0 — BMSITM"

    # Admin Passcode
    ADMIN_SECRET_KEY: str = ""  # Set in backend/.env

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            v = v.strip()
            if v.startswith("[") and v.endswith("]"):
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
