import json
import urllib.request

base_url = "http://localhost:8000"

print("--- 1. Health check ---")
with urllib.request.urlopen(f"{base_url}/health") as res:
    print(res.read().decode())

print("\n--- 2. Events list ---")
with urllib.request.urlopen(f"{base_url}/api/events") as res:
    data = json.loads(res.read().decode())
    print(f"Total events: {data.get('total')}")
    for ev in data.get("events", [])[:3]:
        print(f" - {ev['id']}: {ev['title']} (Fee: {ev['registrationFee']}, Status: {ev['status']})")

print("\n--- 3. Admin login test ---")
req = urllib.request.Request(
    f"{base_url}/api/admin/login",
    data=json.dumps({"secret_key": "technix@8.0"}).encode(),
    headers={"Content-Type": "application/json"}
)
with urllib.request.urlopen(req) as res:
    login_data = json.loads(res.read().decode())
    print("Login successful! Token preview:", login_data.get("token")[:20] + "...")
    token = login_data.get("token")

print("\n--- 4. Admin stats test ---")
req = urllib.request.Request(
    f"{base_url}/api/admin/stats",
    headers={"Authorization": f"Bearer {token}"}
)
with urllib.request.urlopen(req) as res:
    stats_data = json.loads(res.read().decode())
    print("Dashboard stats:", json.dumps(stats_data, indent=2))
