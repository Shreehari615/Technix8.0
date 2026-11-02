import json
from typing import List, Optional
from fastapi import APIRouter, HTTPException
from app.database import get_pool
from app.schemas.event import EventSchema, EventListResponse, CoordinatorSchema

router = APIRouter(prefix="/api/events", tags=["Events"])

DEFAULT_EVENTS = [
    {
        "id": "stark-protocol",
        "title": "STARK PROTOCOL — Coding & Debugging",
        "subtitle": "Coding & Debugging Challenge",
        "marvel_character": "IRON MAN — Tony Stark",
        "character_title": "Genius. Billionaire. Code Architect.",
        "category": "Technical",
        "fee_amount": 250,
        "registration_fee": "₹250 per team",
        "winning_prize": "₹2,000",
        "runner_up_prize": "₹1,000",
        "venue": "Main Computer Center - Lab 301",
        "schedule_time": "Day 1 & Day 2",
        "is_open": True,
        "coordinators": [
            {"name": "Shreehari S V", "role": "Event Lead", "phone": "+91 93539 19651", "email": "shreehari.technix@bmsit.in"},
            {"name": "Keerthana", "role": "Student Coordinator", "phone": "+91 85534 86995", "email": "keerthana.technix@bmsit.in"},
        ],
    },
    {
        "id": "shield-command-chaos",
        "title": "SHIELD: COMMAND THE CHAOS — IT Manager",
        "subtitle": "IT Manager Challenge",
        "marvel_character": "NICK FURY — Strategic Director",
        "character_title": "Director of Strategic Operations",
        "category": "Technical",
        "fee_amount": 150,
        "registration_fee": "₹150 per participant",
        "winning_prize": "₹2,000",
        "runner_up_prize": "None",
        "venue": "S.H.I.E.L.D. Boardroom - Seminar Hall 2",
        "schedule_time": "Day 1 - Morning",
        "is_open": True,
        "coordinators": [
            {"name": "Sharique Raza", "role": "Event Lead", "phone": "+91 62075 84187", "email": "sharique.technix@bmsit.in"},
            {"name": "Anusha K", "role": "Student Coordinator", "phone": "+91 63632 62375", "email": "anusha.technix@bmsit.in"},
        ],
    },
    {
        "id": "infinity-iq-challenge",
        "title": "THE INFINITY IQ CHALLENGE — IT Quiz",
        "subtitle": "IT Quiz",
        "marvel_character": "DOCTOR STRANGE — Master of the Mystic Arts",
        "character_title": "Sorcerer Supreme of Knowledge",
        "category": "Technical",
        "fee_amount": 250,
        "registration_fee": "₹250 per team",
        "winning_prize": "₹2,000",
        "runner_up_prize": "₹1,000",
        "venue": "Sanctum Auditorium - Hall A",
        "schedule_time": "Day 1 - Afternoon",
        "is_open": True,
        "coordinators": [
            {"name": "Rahul Jangir", "role": "Event Lead", "phone": "+91 75045 54709", "email": "rahul.technix@bmsit.in"},
            {"name": "Srigouri Nadig", "role": "Student Coordinator", "phone": "+91 81232 80889", "email": "srigouri.technix@bmsit.in"},
        ],
    },
    {
        "id": "interface-infinity",
        "title": "STARK LABS: INTERFACE INFINITY — Web Designing",
        "subtitle": "Web Designing Challenge",
        "marvel_character": "STARK & ALLIES — Interface Protocol",
        "character_title": "Architects of the Next-Gen Digital Experience",
        "category": "Technical",
        "fee_amount": 250,
        "registration_fee": "₹250 per team",
        "winning_prize": "₹2,000",
        "runner_up_prize": "₹1,000",
        "venue": "Design Lab 204 - Computing Wing",
        "schedule_time": "Day 1 - Morning",
        "is_open": True,
        "coordinators": [
            {"name": "Samarth S Patil", "role": "Event Lead", "phone": "+91 63602 36750", "email": "samarth.technix@bmsit.in"},
            {"name": "Harshitha", "role": "Student Coordinator", "phone": "+91 70190 67719", "email": "harshitha.technix@bmsit.in"},
        ],
    },
    {
        "id": "ultron-digital-dominion",
        "title": "ULTRON: DIGITAL DOMINION — Cybersecurity",
        "subtitle": "Cybersecurity Challenge",
        "marvel_character": "ULTRON — Sovereign of the Machine Mind",
        "character_title": "Trace the Threat. Crack the Code. Stop the System.",
        "category": "Technical",
        "fee_amount": 400,
        "registration_fee": "₹400 per team",
        "winning_prize": "₹3,000",
        "runner_up_prize": "None",
        "venue": "Cyber Defense Wing - Lab 402",
        "schedule_time": "Day 1 - Afternoon",
        "is_open": True,
        "coordinators": [
            {"name": "M Thanmay", "role": "Event Lead", "phone": "+91 93911 20323", "email": "thanmay.technix@bmsit.in"},
            {"name": "Nishitha", "role": "Student Coordinator", "phone": "+91 80731 67665", "email": "nishitha.technix@bmsit.in"},
        ],
    },
    {
        "id": "civil-war-battle-of-ideas",
        "title": "CIVIL WAR: BATTLE OF IDEAS — Tech Debate",
        "subtitle": "Technical Debate Competition",
        "marvel_character": "CAPTAIN AMERICA & IRON MAN",
        "character_title": "Choose Your Side. Defend Your Ideas. Win the Debate.",
        "category": "Technical",
        "fee_amount": 250,
        "registration_fee": "₹250 per team",
        "winning_prize": "₹2,000",
        "runner_up_prize": "₹1,000",
        "venue": "Main Moot Court / Seminar Hall 3",
        "schedule_time": "Day 2 - Morning",
        "is_open": True,
        "coordinators": [
            {"name": "Madeneni Chetan Sivaram", "role": "Event Lead", "phone": "+91 95159 97994", "email": "chetan.technix@bmsit.in"},
            {"name": "Shehnaaz Begum", "role": "Student Coordinator", "phone": "+91 89713 88110", "email": "shehnaaz.technix@bmsit.in"},
        ],
    },
    {
        "id": "marvel-in-motion",
        "title": "MARVEL IN MOTION — Photo & Video",
        "subtitle": "Photography & Videography Challenge",
        "marvel_character": "SPIDER-MAN — Peter Parker",
        "character_title": "Visual Storyteller & Bugle Journalist",
        "category": "Non-Technical",
        "fee_amount": 150,
        "registration_fee": "₹150 per participant",
        "winning_prize": "₹2,000",
        "runner_up_prize": "₹1,000",
        "venue": "Media Center - Room 102 & Campus-Wide",
        "schedule_time": "Day 1 & Day 2",
        "is_open": True,
        "coordinators": [
            {"name": "Shashank Kodiya", "role": "Event Lead", "phone": "+91 80505 63255", "email": "shashank.technix@bmsit.in"},
            {"name": "Rajeev", "role": "Student Coordinator", "phone": "+91 93537 72342", "email": "rajeev.technix@bmsit.in"},
        ],
    },
    {
        "id": "tesseract-heist",
        "title": "THE TESSERACT HEIST — Treasure Hunt",
        "subtitle": "Marvel-Themed Treasure Hunt",
        "marvel_character": "LOKI — God of Stories & Mischief",
        "character_title": "Architect of Mischief & Timelines",
        "category": "Non-Technical",
        "fee_amount": 400,
        "registration_fee": "₹400 per team",
        "winning_prize": "₹3,000",
        "runner_up_prize": "None",
        "venue": "Central Plaza - Assembly Flagpole",
        "schedule_time": "Day 1 - 01:30 PM",
        "is_open": True,
        "coordinators": [
            {"name": "Prajwal Kumar Ponarkar", "role": "Event Lead", "phone": "+91 76769 70816", "email": "prajwal.technix@bmsit.in"},
            {"name": "Gnanesh K C", "role": "Student Coordinator", "phone": "+91 95351 97496", "email": "gnanesh.technix@bmsit.in"},
        ],
    },
    {
        "id": "avengers-battleworld",
        "title": "AVENGERS: BATTLEWORLD — BGMI Tournament",
        "subtitle": "BGMI – Mobile Gaming Tournament",
        "marvel_character": "THOR & HULK — Battleworld Champions",
        "character_title": "Gladiators of the Grandmaster Arena",
        "category": "Gaming",
        "fee_amount": 400,
        "registration_fee": "₹400 per team",
        "winning_prize": "₹3,000",
        "runner_up_prize": "₹1,500",
        "venue": "Main Esports Arena - Seminar Hall 1",
        "schedule_time": "Day 1 & Day 2",
        "is_open": True,
        "coordinators": [
            {"name": "Aditya Wagh", "role": "Event Lead", "phone": "+91 70199 432437", "email": "aditya.technix@bmsit.in"},
            {"name": "Mehrooz Zehra", "role": "Student Coordinator", "phone": "+91 63637 17806", "email": "mehrooz.technix@bmsit.in"},
        ],
    },
    {
        "id": "cosmic-showcase",
        "title": "COSMIC SHOWCASE — Dance Competition",
        "subtitle": "Marvel-Themed Dance Competition",
        "marvel_character": "STAR-LORD — Peter Quill & Guardians",
        "character_title": "Leader of the Galactic Sound & Stage",
        "category": "Cultural",
        "fee_amount": 300,
        "registration_fee": "₹300 per team",
        "winning_prize": "₹3,000",
        "runner_up_prize": "None",
        "venue": "Open Air Amphitheatre - Main Festival Stage",
        "schedule_time": "Day 2 - 04:30 PM",
        "is_open": True,
        "coordinators": [
            {"name": "Aishwarya", "role": "Event Lead", "phone": "+91 78993 12975", "email": "aishwarya.technix@bmsit.in"},
            {"name": "Mahima Raj", "role": "Student Coordinator", "phone": "+91 79758 53550", "email": "mahima.technix@bmsit.in"},
        ],
    },
    {
        "id": "project-what-if",
        "title": "PROJECT: WHAT IF...? — Surprise Event",
        "subtitle": "Marvel-Themed Surprise Event",
        "marvel_character": "THE WATCHER & MULTIVERSE",
        "character_title": "Observer of Infinite Possibilities",
        "category": "Non-Technical",
        "fee_amount": 400,
        "registration_fee": "₹400 per team",
        "winning_prize": "₹3,000",
        "runner_up_prize": "₹1,500",
        "venue": "Multiverse Arena - Revealed on Spot",
        "schedule_time": "Day 2 - 02:00 PM",
        "is_open": True,
        "coordinators": [
            {"name": "Khushi Poonja", "role": "Event Lead", "phone": "+91 95900 12306", "email": "khushi.technix@bmsit.in"},
            {"name": "Vivek Baheti", "role": "Student Coordinator", "phone": "+91 88299 24009", "email": "vivek.technix@bmsit.in"},
        ],
    },
]

async def get_merged_events() -> List[dict]:
    """Fetches event overrides from Neon PostgreSQL and merges with defaults."""
    pool = get_pool()
    overrides_map = {}
    try:
        async with pool.acquire() as conn:
            rows = await conn.fetch("SELECT * FROM event_overrides;")
            for r in rows:
                overrides_map[r["event_id"]] = dict(r)
    except Exception as e:
        pass

    merged_list = []
    for ev in DEFAULT_EVENTS:
        ev_copy = dict(ev)
        override = overrides_map.get(ev["id"])
        if override:
            if override.get("custom_title"):
                ev_copy["title"] = override["custom_title"]
            if override.get("custom_subtitle"):
                ev_copy["subtitle"] = override["custom_subtitle"]
            if override.get("custom_fee") is not None:
                ev_copy["fee_amount"] = override["custom_fee"]
                ev_copy["registration_fee"] = f"₹{override['custom_fee']} per team"
            if override.get("winning_prize"):
                ev_copy["winning_prize"] = override["winning_prize"]
            if override.get("runner_up_prize"):
                ev_copy["runner_up_prize"] = override["runner_up_prize"]
            if override.get("venue"):
                ev_copy["venue"] = override["venue"]
            if override.get("schedule_time"):
                ev_copy["schedule_time"] = override["schedule_time"]
            if override.get("is_open") is not None:
                ev_copy["is_open"] = override["is_open"]
            if override.get("coordinators"):
                coords = override["coordinators"]
                if isinstance(coords, str):
                    try:
                        coords = json.loads(coords)
                    except Exception:
                        pass
                if isinstance(coords, list):
                    ev_copy["coordinators"] = coords
        merged_list.append(ev_copy)
    return merged_list

@router.get("", response_model=EventListResponse)
async def list_events(category: Optional[str] = None):
    """
    Returns full list of 11 Technix 8.0 events merged dynamically with live Neon DB overrides.
    """
    events = await get_merged_events()
    if category and category.lower() != "all":
        events = [e for e in events if e.get("category", "").lower() == category.lower()]
    return {
        "success": True,
        "count": len(events),
        "events": events,
    }

@router.get("/{event_id}", response_model=EventSchema)
async def get_event(event_id: str):
    """Retrieves single event details by its slug ID."""
    events = await get_merged_events()
    for ev in events:
        if ev["id"] == event_id:
            return ev
    raise HTTPException(status_code=404, detail=f"Event '{event_id}' not found.")
