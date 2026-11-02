from typing import List, Optional, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from pydantic.alias_generators import to_camel

class RegistrationCreate(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, extra="ignore")

    event_id: str = Field(..., min_length=2, description="Unique slug ID of event, e.g. 'stark-protocol'")
    event_title: str = Field(..., min_length=2, description="Display name of event")
    lead_name: str = Field(..., min_length=2, description="Full name of candidate / team lead")
    email: EmailStr = Field(..., description="Active email address for admission pass receipt")
    phone: str = Field(..., min_length=8, max_length=20, description="Active contact phone number")
    college_name: str = Field(..., min_length=2, description="Institution / College name")
    department: str = Field(..., min_length=1, description="Academic department, e.g. 'MCA', 'CSE'")
    year_of_study: str = Field(..., min_length=1, description="Current study year, e.g. '1st Year', '2nd Year'")
    team_name: Optional[str] = Field(None, description="Optional team moniker")
    members: List[str] = Field(default_factory=list, description="Names of teammates / squad allies")
    fee_amount: int = Field(default=150, ge=0, description="Registration fee in INR")
    payment_method: str = Field(default="UPI_QR", description="UPI payment method")
    utr_number: str = Field(..., min_length=6, description="UPI transaction 12-digit reference number")
    screenshot_url: Optional[str] = None
    pass_code: Optional[str] = None

class RegistrationUpdate(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, extra="ignore")

    payment_status: Optional[str] = None
    lead_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    college_name: Optional[str] = None
    department: Optional[str] = None
    year_of_study: Optional[str] = None
    team_name: Optional[str] = None
    members: Optional[List[str]] = None
    event_id: Optional[str] = None
    event_title: Optional[str] = None
    fee_amount: Optional[int] = None
    utr_number: Optional[str] = None

class RegistrationResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True, extra="ignore")

    id: str
    pass_code: str
    event_id: str
    event_title: str
    lead_name: str
    email: str
    phone: str
    college_name: str
    department: str
    year_of_study: str
    team_name: Optional[str] = None
    members: Any = []
    fee_amount: int
    payment_method: str
    utr_number: Optional[str] = None
    screenshot_url: Optional[str] = None
    payment_status: str
    created_at: datetime
    updated_at: datetime

class RegistrationListResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, extra="ignore")

    success: bool = True
    count: int
    total: int
    registrations: List[RegistrationResponse]
