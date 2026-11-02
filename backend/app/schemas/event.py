from typing import List, Optional, Any
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

class CoordinatorSchema(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, extra="ignore")

    name: str
    role: str = "Coordinator"
    phone: str
    email: Optional[str] = ""

class EventOverrideUpdate(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, extra="ignore")

    event_id: str
    custom_title: Optional[str] = None
    custom_subtitle: Optional[str] = None
    custom_fee: Optional[int] = None
    winning_prize: Optional[str] = None
    runner_up_prize: Optional[str] = None
    venue: Optional[str] = None
    schedule_time: Optional[str] = None
    is_open: Optional[bool] = None
    coordinators: Optional[List[CoordinatorSchema]] = None

class EventSchema(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, extra="ignore")

    id: str
    title: str
    subtitle: Optional[str] = None
    marvel_character: Optional[str] = None
    character_title: Optional[str] = None
    category: str
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    team_size_min: int = 1
    team_size_max: int = 2
    team_size_label: str = "Individual or Duo"
    fee_amount: int
    registration_fee: str
    winning_prize: Optional[str] = None
    runner_up_prize: Optional[str] = None
    venue: str
    schedule_time: str
    is_open: bool = True
    coordinators: List[CoordinatorSchema] = []

class EventListResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, extra="ignore")

    success: bool = True
    count: int
    events: List[EventSchema]
