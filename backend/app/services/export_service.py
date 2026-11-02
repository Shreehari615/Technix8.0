import io
import csv
from typing import List, Dict, Any
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_csv_export(records: List[Dict[str, Any]]) -> str:
    """Generates UTF-8 BOM CSV text for participant records."""
    output = io.StringIO()
    # Write UTF-8 BOM for Excel compatibility
    output.write("\ufeff")

    fieldnames = [
        "Sl No",
        "Passcode",
        "Candidate Name",
        "Email Address",
        "Phone Number",
        "College / Institution",
        "Department",
        "Year of Study",
        "Event Title",
        "Team Name",
        "Team Allies",
        "Fee Amount (INR)",
        "Payment Method",
        "UTR Number",
        "Payment Status",
        "Registration Date",
    ]

    writer = csv.DictWriter(output, fieldnames=fieldnames)
    writer.writeheader()

    for idx, r in enumerate(records, start=1):
        members = r.get("members", [])
        if isinstance(members, list):
            members_str = "; ".join(members)
        elif isinstance(members, str):
            members_str = members
        else:
            members_str = ""

        writer.writerow({
            "Sl No": idx,
            "Passcode": r.get("pass_code", ""),
            "Candidate Name": r.get("lead_name", ""),
            "Email Address": r.get("email", ""),
            "Phone Number": r.get("phone", ""),
            "College / Institution": r.get("college_name", ""),
            "Department": r.get("department", ""),
            "Year of Study": r.get("year_of_study", ""),
            "Event Title": r.get("event_title", ""),
            "Team Name": r.get("team_name") or "Solo",
            "Team Allies": members_str or "None",
            "Fee Amount (INR)": r.get("fee_amount", 150),
            "Payment Method": r.get("payment_method", "UPI_QR"),
            "UTR Number": r.get("utr_number") or "N/A",
            "Payment Status": r.get("payment_status", "paid_pending_verification"),
            "Registration Date": str(r.get("created_at", "")),
        })

    return output.getvalue()

def generate_pdf_dossier(records: List[Dict[str, Any]], stats: Dict[str, Any]) -> bytes:
    """Generates an official A4 Landscape PDF dossier using ReportLab."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=landscape(A4),
        rightMargin=20,
        leftMargin=20,
        topMargin=20,
        bottomMargin=20,
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        "HeaderTitle",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=15,
        textColor=colors.HexColor("#0F172A"),
        spaceAfter=4,
    )

    sub_style = ParagraphStyle(
        "HeaderSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8,
        textColor=colors.HexColor("#64748B"),
        spaceAfter=12,
    )

    elements = []

    # Title & Subtitle
    elements.append(Paragraph("TECHNIX 8.0 — OFFICIAL CANDIDATE ROSTER & TRANSACTION DOSSIER", title_style))
    elements.append(Paragraph("DEPARTMENT OF MCA · BMS INSTITUTE OF TECHNOLOGY & MANAGEMENT · BENGALURU", sub_style))

    # Stats Banner Table
    stats_data = [[
        f"Total Candidates: {stats.get('total_registrations', 0)}",
        f"Total Revenue: INR {stats.get('total_revenue', 0):,}",
        f"Verified Passes: {stats.get('verified_count', 0)}",
        f"Pending Audit: {stats.get('pending_count', 0)}",
    ]]
    stats_table = Table(stats_data, colWidths=[200, 200, 200, 200])
    stats_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F1F5F9")),
        ("TEXTCOLOR", (0, 0), (-1, -1), colors.HexColor("#0F172A")),
        ("FONTNAME", (0, 0), (-1, -1), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("LINEBELOW", (0, 0), (-1, -1), 1.5, colors.HexColor("#DC2626")),
    ]))
    elements.append(stats_table)
    elements.append(Spacer(1, 14))

    # Table Header
    headers = ["#", "Passcode", "Candidate", "Email", "Phone", "College", "Event", "Fee", "UTR", "Status"]
    table_data = [headers]

    cell_style = ParagraphStyle(
        "GridCell",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=7.5,
        leading=9,
        textColor=colors.HexColor("#0F172A"),
    )

    for i, r in enumerate(records, start=1):
        status = r.get("payment_status", "pending")
        if status in ["verified", "paid_verified"]:
            status_text = "VERIFIED"
        elif status == "rejected":
            status_text = "REJECTED"
        else:
            status_text = "PENDING"

        row = [
            str(i),
            r.get("pass_code", ""),
            r.get("lead_name", ""),
            r.get("email", ""),
            r.get("phone", ""),
            r.get("college_name", "")[:25],
            r.get("event_title", "")[:25],
            f"INR {r.get('fee_amount', 150)}",
            r.get("utr_number", "N/A"),
            status_text,
        ]
        table_data.append([Paragraph(str(col), cell_style) for col in row])

    roster_table = Table(
        table_data,
        colWidths=[20, 75, 95, 120, 75, 120, 120, 45, 80, 52]
    )

    roster_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0F172A")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 8),
        ("ALIGN", (0, 0), (-1, 0), "LEFT"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
    ]))

    elements.append(roster_table)
    doc.build(elements)
    return buffer.getvalue()
