import urllib.request
import json

base = "http://localhost:8000"

print("--- 1. Testing GET /api/events ---")
with urllib.request.urlopen(f"{base}/api/events") as r:
    data = json.loads(r.read().decode())
    print(f"Events count: {data['count']}")
    for ev in data["events"]:
        fee = ev.get('feeAmount') or ev.get('fee_amount')
        coords = [c['name'] for c in ev.get('coordinators', [])]
        print(f"  - [{ev['id']}] {ev['title']} | Fee: Rs.{fee} | Coordinators: {coords}")

print("\n--- 2. Testing POST /api/admin/login ---")
req = urllib.request.Request(
    f"{base}/api/admin/login",
    data=json.dumps({"passcode": "technix@8.0"}).encode(),
    headers={"Content-Type": "application/json"}
)
with urllib.request.urlopen(req) as r:
    auth_data = json.loads(r.read().decode())
    token = auth_data["token"]
    print(f"Admin Auth token acquired: {token[:25]}...")

print("\n--- 3. Testing GET /api/admin/events ---")
req2 = urllib.request.Request(
    f"{base}/api/admin/events",
    headers={"Authorization": f"Bearer {token}"}
)
with urllib.request.urlopen(req2) as r:
    adm_ev = json.loads(r.read().decode())
    print(f"Admin events fetched: {len(adm_ev.get('events', []))} events")

print("\n--- 4. Testing GET /api/admin/stats ---")
req3 = urllib.request.Request(
    f"{base}/api/admin/stats",
    headers={"Authorization": f"Bearer {token}"}
)
with urllib.request.urlopen(req3) as r:
    stats = json.loads(r.read().decode())
    print(f"Admin stats: {stats}")

print("\n--- 5. Testing POST /api/contact ---")
req4 = urllib.request.Request(
    f"{base}/api/contact",
    data=json.dumps({
        "name": "Bruce Wayne",
        "email": "bruce@wayne-enterprises.com",
        "phone": "+91 9888877777",
        "subject": "Sponsorship Inquiry",
        "message": "Interested in premier sponsorship for Technix 8.0 AI & ML fest."
    }).encode(),
    headers={"Content-Type": "application/json"}
)
with urllib.request.urlopen(req4) as r:
    contact_res = json.loads(r.read().decode())
    print(f"Contact query submitted: {contact_res}")

print("\n--- 6. Testing GET /api/registrations ---")
with urllib.request.urlopen(f"{base}/api/registrations") as r:
    reg_list = json.loads(r.read().decode())
    print(f"Total registrations retrieved: {reg_list.get('total')}")

print("\nALL 6 ENDPOINT SUITES PASSED FLAWLESSLY!")
