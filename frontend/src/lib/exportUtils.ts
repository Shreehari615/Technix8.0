import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { RegistrationRow } from "@/lib/db";

/**
 * Generates and downloads a clean, Excel-compatible CSV file of user records & transactions.
 */
export function exportToCSV(
  registrations: RegistrationRow[],
  filename = `technix8_registrations_${new Date().toISOString().slice(0, 10)}.csv`
) {
  if (!registrations || registrations.length === 0) {
    alert("No records available to export.");
    return;
  }

  const headers = [
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
    "Team Allies / Members",
    "Fee Amount (INR)",
    "Payment Method",
    "UTR Reference",
    "Payment Status",
    "Registration Date (UTC)",
  ];

  const escapeCsv = (val: any) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = registrations.map((r, index) => {
    const membersList: string[] = (() => {
      if (!r.members) return [];
      if (Array.isArray(r.members)) return r.members.filter(Boolean);
      try {
        return JSON.parse(r.members as string);
      } catch {
        return [];
      }
    })();

    const membersStr = membersList.join("; ");

    return [
      index + 1,
      r.pass_code,
      r.lead_name,
      r.email,
      r.phone,
      r.college_name,
      r.department,
      r.year_of_study,
      r.event_title,
      r.team_name || "N/A",
      membersStr || "None (Solo)",
      r.fee_amount,
      r.payment_method,
      r.utr_number || "N/A",
      r.payment_status,
      new Date(r.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    ]
      .map(escapeCsv)
      .join(",");
  });

  // UTF-8 BOM prefix (\uFEFF) ensures Excel renders special characters properly
  const csvContent = "\uFEFF" + [headers.map(escapeCsv).join(","), ...rows].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates and downloads an executive PDF document of user registrations and transaction details.
 */
export function exportToPDF(
  registrations: RegistrationRow[],
  stats: { totalRegistrations: number; totalRevenue: number; verifiedCount: number; pendingCount: number },
  filename = `technix8_dossier_${new Date().toISOString().slice(0, 10)}.pdf`
) {
  if (!registrations || registrations.length === 0) {
    alert("No records available to export.");
    return;
  }

  // Create landscape A4 document for maximum table readability
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // 1. Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 28, "F");

  // Red accent stripe
  doc.setFillColor(220, 38, 38); // crimson red
  doc.rect(0, 26, pageWidth, 2, "F");

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text("TECHNIX 8.0 — CANDIDATE ROSTER & TRANSACTION DOSSIER", 14, 12);

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(
    "DEPARTMENT OF MCA · BMS INSTITUTE OF TECHNOLOGY & MANAGEMENT · BENGALURU | GENERATED: " +
      new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    14,
    19
  );

  // 2. Metrics Summary Bar
  doc.setFillColor(241, 245, 249); // slate-100
  doc.roundedRect(14, 32, pageWidth - 28, 16, 2, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);

  const colWidth = (pageWidth - 28) / 4;
  doc.text(`TOTAL CANDIDATES: ${stats.totalRegistrations}`, 18, 42);
  doc.text(`TOTAL REVENUE: INR ${stats.totalRevenue.toLocaleString("en-IN")}`, 18 + colWidth, 42);
  doc.text(`VERIFIED PASSES: ${stats.verifiedCount}`, 18 + colWidth * 2, 42);
  doc.text(`PENDING VERIFICATION: ${stats.pendingCount}`, 18 + colWidth * 3, 42);

  // 3. Table Rows
  const tableRows = registrations.map((r, i) => {
    const membersList: string[] = (() => {
      if (!r.members) return [];
      if (Array.isArray(r.members)) return r.members.filter(Boolean);
      try {
        return JSON.parse(r.members as string);
      } catch {
        return [];
      }
    })();

    const membersStr = membersList.length > 0 ? membersList.join(", ") : "-";

    return [
      i + 1,
      r.pass_code,
      r.lead_name,
      r.email,
      r.phone,
      r.college_name,
      r.event_title,
      r.team_name ? `${r.team_name} (${membersStr})` : "Solo",
      `₹${r.fee_amount}`,
      r.utr_number || "N/A",
      r.payment_status === "verified"
        ? "VERIFIED"
        : r.payment_status === "rejected"
        ? "REJECTED"
        : "PENDING",
    ];
  });

  autoTable(doc, {
    startY: 52,
    head: [
      [
        "#",
        "Passcode",
        "Candidate Name",
        "Email",
        "Phone",
        "College",
        "Event Title",
        "Team & Squad",
        "Fee",
        "UTR Number",
        "Status",
      ],
    ],
    body: tableRows,
    theme: "grid",
    headStyles: {
      fillColor: [17, 24, 39], // gray-900
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: "bold",
      halign: "left",
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 2,
      textColor: [15, 23, 42],
      overflow: "linebreak",
    },
    columnStyles: {
      0: { cellWidth: 8, halign: "center" },
      1: { cellWidth: 22, fontStyle: "bold", textColor: [180, 83, 9] }, // Amber passcode
      2: { cellWidth: 28, fontStyle: "bold" },
      3: { cellWidth: 32 },
      4: { cellWidth: 22 },
      5: { cellWidth: 32 },
      6: { cellWidth: 32 },
      7: { cellWidth: 32 },
      8: { cellWidth: 14, halign: "right", fontStyle: "bold" },
      9: { cellWidth: 24, fontStyle: "bold" },
      10: { cellWidth: 18, halign: "center", fontStyle: "bold" },
    },
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 10) {
        if (data.cell.raw === "VERIFIED") {
          data.cell.styles.textColor = [22, 101, 52]; // green-800
        } else if (data.cell.raw === "REJECTED") {
          data.cell.styles.textColor = [185, 28, 28]; // red-700
        } else {
          data.cell.styles.textColor = [180, 83, 9]; // amber-700
        }
      }
    },
    foot: [
      [
        "",
        "",
        `Total: ${registrations.length} Records`,
        "",
        "",
        "",
        "",
        "",
        `₹${stats.totalRevenue}`,
        "",
        "",
      ],
    ],
    footStyles: {
      fillColor: [241, 245, 249],
      textColor: [15, 23, 42],
      fontStyle: "bold",
      fontSize: 8,
    },
    margin: { left: 14, right: 14 },
  });

  // Save PDF
  doc.save(filename);
}
