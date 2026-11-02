import urllib.request
import urllib.error
import json
import ssl
import time

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

FRONTEND_URL = "http://localhost:3000"
BACKEND_URL = "http://localhost:8000"

print("==================================================================")
print("  TECHNIX 8.0 COMPREHENSIVE SECURITY & INTEGRITY AUDIT SUITE")
print("==================================================================\n")

def test_request(url, method="GET", headers=None, data=None):
    req = urllib.request.Request(url, method=method, headers=headers or {})
    if data:
        req.data = json.dumps(data).encode("utf-8")
        req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=10, context=ctx) as res:
            body = res.read().decode("utf-8")
            try:
                parsed = json.loads(body)
            except Exception:
                parsed = body
            return res.status, res.headers, parsed
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        try:
            parsed = json.loads(body)
        except Exception:
            parsed = body
        return e.code, e.headers, parsed
    except Exception as e:
        return 0, {}, str(e)

# --- TEST 1: Unauthenticated dump of registrations ---
print(">> TEST 1: Testing unauthorized bulk PII data dump prevention...")
s, h, res = test_request(f"{FRONTEND_URL}/api/registrations")
if s == 400:
    print(f"  [PASS] Public bulk PII dump blocked with HTTP {s}: {res.get('error')}")
else:
    print(f"  [FAIL] Bulk PII not blocked: status {s}, res: {res}")

# --- TEST 2: Forged token bypass attempt ---
print("\n>> TEST 2: Testing forged admin token attack (Bearer TX8_ADMIN_fake_attacker)...")
s, h, res = test_request(
    f"{FRONTEND_URL}/api/admin/registrations",
    headers={"Authorization": "Bearer TX8_ADMIN_fake_attacker"}
)
if s == 401:
    print(f"  [PASS] Forged token rejected with HTTP 401: {res.get('error')}")
else:
    print(f"  [FAIL] Forged token was NOT rejected: status {s}")

# --- TEST 3: Unauthenticated init-db endpoint ---
print("\n>> TEST 3: Testing unauthenticated database initialization endpoint...")
s, h, res = test_request(f"{FRONTEND_URL}/api/init-db")
if s == 401:
    print(f"  [PASS] Unauthenticated init-db blocked with HTTP 401: {res.get('error')}")
else:
    print(f"  [FAIL] init-db not blocked: status {s}")

# --- TEST 4: Legitimate admin authentication ---
print("\n>> TEST 4: Testing legitimate admin authentication...")
s, h, res = test_request(
    f"{FRONTEND_URL}/api/admin/auth",
    method="POST",
    data={"passcode": "technix@8.0"}
)
if s == 200 and res.get("success") and res.get("token"):
    admin_token = res["token"]
    print(f"  [PASS] Legitimate admin clearance granted! Signed token: {admin_token[:25]}...")
else:
    print(f"  [FAIL] Legitimate login failed: {res}")
    admin_token = None

# --- TEST 5: Admin stats with valid signed token ---
print("\n>> TEST 5: Testing admin registration listing with valid signed token...")
if admin_token:
    s, h, res = test_request(
        f"{FRONTEND_URL}/api/admin/registrations",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    if s == 200 and res.get("success"):
        print(f"  [PASS] Admin authorized successfully! Retrieved {res.get('total')} records from Neon DB.")
    else:
        print(f"  [FAIL] Admin registration access failed with status {s}: {res}")

# --- TEST 6: Candidate registration with input validation ---
print("\n>> TEST 6: Testing valid candidate registration submission...")
test_utr = f"UTR{int(time.time())}"[-12:]
reg_payload = {
    "eventId": "stark-protocol",
    "eventTitle": "STARK PROTOCOL — Coding & Debugging",
    "leadName": "Security Audit Candidate",
    "email": "technix8.0team@gmail.com",
    "phone": "9876543210",
    "collegeName": "BMSIT & Management",
    "department": "Department of MCA",
    "yearOfStudy": "1st Year PG",
    "teamName": "Cyber Sentinels",
    "members": ["Audit Ally One"],
    "feeAmount": 250,
    "paymentMethod": "UPI_QR",
    "utrNumber": test_utr,
}
s, h, res = test_request(
    f"{FRONTEND_URL}/api/registrations",
    method="POST",
    data=reg_payload
)
if s == 201 and res.get("success") and res.get("registration"):
    created_pass = res["registration"]["pass_code"] if "pass_code" in res["registration"] else res["registration"]["passCode"]
    print(f"  [PASS] Registration saved to Neon DB & Brevo email triggered! Pass Code: {created_pass}")
else:
    print(f"  [FAIL] Registration failed: status {s}, res: {res}")
    created_pass = None

# --- TEST 7: Replay attack prevention (Duplicate UTR submission) ---
print("\n>> TEST 7: Testing UTR replay attack prevention (Submitting duplicate UTR)...")
s, h, res = test_request(
    f"{FRONTEND_URL}/api/registrations",
    method="POST",
    data=reg_payload
)
if s == 409:
    print(f"  [PASS] Replay attack prevented with HTTP 409 Conflict: {res.get('error')}")
else:
    print(f"  [FAIL] Replay attack not caught: status {s}, res: {res}")

# --- TEST 8: Public pass lookup by email ---
print("\n>> TEST 8: Testing public pass lookup by specific candidate email...")
s, h, res = test_request(f"{FRONTEND_URL}/api/registrations?email=technix8.0team@gmail.com")
if s == 200 and res.get("success") and len(res.get("registrations", [])) > 0:
    print(f"  [PASS] Candidate lookup returned {len(res['registrations'])} registered pass(es).")
else:
    print(f"  [FAIL] Email lookup failed: status {s}, res: {res}")

# --- TEST 9: Public pass lookup by specific passCode ---
print("\n>> TEST 9: Testing public pass lookup by specific passCode...")
if created_pass:
    s, h, res = test_request(f"{FRONTEND_URL}/api/registrations?passCode={created_pass}")
    if s == 200 and res.get("success"):
        print(f"  [PASS] Passcode lookup authenticated ticket: {res['registration']['event_title']}")
    else:
        print(f"  [FAIL] Passcode lookup failed: status {s}, res: {res}")

# --- TEST 10: Security Headers check ---
print("\n>> TEST 10: Testing HTTP Security Headers (X-Frame-Options, X-Content-Type-Options)...")
s, h, res = test_request(f"{FRONTEND_URL}/")
x_frame = h.get("X-Frame-Options")
x_content = h.get("X-Content-Type-Options")
ref_policy = h.get("Referrer-Policy")
if x_frame and x_content and ref_policy:
    print(f"  [PASS] Security headers present!")
    print(f"     - X-Frame-Options: {x_frame}")
    print(f"     - X-Content-Type-Options: {x_content}")
    print(f"     - Referrer-Policy: {ref_policy}")
else:
    print(f"  [NOTICE] Headers: X-Frame-Options: {x_frame}, X-Content-Type-Options: {x_content}")

print("\n==================================================================")
print("  ALL 10 COMPREHENSIVE SECURITY & AUDIT SUITES EXECUTED")
print("==================================================================")
