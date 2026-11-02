from typing import Optional
from pydantic import BaseModel, ConfigDict, model_validator
from pydantic.alias_generators import to_camel

class AdminLoginRequest(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, extra="ignore")

    passcode: Optional[str] = None
    secret_key: Optional[str] = None

    @model_validator(mode="after")
    def resolve_passcode(self):
        val = self.passcode or self.secret_key
        if not val or not val.strip():
            raise ValueError("Admin passcode or secret_key is required.")
        self.passcode = val.strip()
        return self

class AdminTokenResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, extra="ignore")

    success: bool
    token: str
    message: str

class DashboardStatsResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, extra="ignore")

    success: bool = True
    total_registrations: int
    total_revenue: int
    verified_count: int
    pending_count: int
    rejected_count: int
    active_events: int
