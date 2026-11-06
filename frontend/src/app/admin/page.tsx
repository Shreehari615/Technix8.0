"use client";

import React, { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Shield,
  Lock,
  Unlock,
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  RefreshCw,
  CheckCircle2,
  Clock,
  XCircle,
  Edit3,
  Trash2,
  Users,
  CreditCard,
  Building,
  Mail,
  Phone,
  Calendar,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  Layers,
  Settings,
  X,
  Plus,
} from "lucide-react";
import { RegistrationRow } from "@/lib/db";
import { exportToCSV, exportToPDF } from "@/lib/exportUtils";

interface AdminEvent {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  feeAmount: number;
  winningPrize?: string;
  runnerUpPrize?: string;
  venue: string;
  scheduleTime: string;
  isOpen: boolean;
  coordinators: Array<{ name: string; role: string; phone: string; email: string }>;
}

export default function AdminPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Dashboard Data State
  const [registrations, setRegistrations] = useState<RegistrationRow[]>([]);
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  // Filters & Tabs
  const [activeTab, setActiveTab] = useState<"registrations" | "events" | "export">("registrations");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEventFilter, setSelectedEventFilter] = useState("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");

  // Modals State
  const [editingRegistration, setEditingRegistration] = useState<RegistrationRow | null>(null);
  const [editingEvent, setEditingEvent] = useState<AdminEvent | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Check saved session on mount
  useEffect(() => {
    const savedToken = sessionStorage.getItem("tx8_admin_token");
    if (savedToken) {
      setIsAuthenticated(true);
      fetchData(savedToken);
    }
  }, []);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  // Auth Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsAuthenticating(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: passcode.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setAuthError(data.error || "Incorrect clearance passcode.");
        return;
      }

      sessionStorage.setItem("tx8_admin_token", data.token);
      setIsAuthenticated(true);
      fetchData(data.token);
    } catch (err) {
      setAuthError("Network error during authorization.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("tx8_admin_token");
    setIsAuthenticated(false);
    setRegistrations([]);
    setEvents([]);
  };

  // Data Fetching
  const fetchData = async (token?: string) => {
    const adminToken = token || sessionStorage.getItem("tx8_admin_token") || "";
    setIsLoading(true);
    setFetchError("");

    try {
      const [regRes, eventRes] = await Promise.all([
        fetch("/api/admin/registrations", {
          headers: { "x-admin-key": adminToken },
        }),
        fetch("/api/admin/events", {
          headers: { "x-admin-key": adminToken },
        }),
      ]);

      if (regRes.status === 401 || eventRes.status === 401) {
        handleLogout();
        setAuthError("Session expired. Please log in again.");
        return;
      }

      const regData = await regRes.json();
      const eventData = await eventRes.json();

      if (regData.success) {
        setRegistrations(regData.registrations || []);
      }
      if (eventData.success) {
        setEvents(eventData.events || []);
      }
    } catch (err) {
      setFetchError("Failed to fetch dashboard records.");
    } finally {
      setIsLoading(false);
    }
  };

  // Update Status Quick Action
  const handleStatusChange = async (regId: string, newStatus: string) => {
    const adminToken = sessionStorage.getItem("tx8_admin_token") || "";
    try {
      const res = await fetch(`/api/admin/registrations/${regId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminToken,
        },
        body: JSON.stringify({ payment_status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        setRegistrations((prev) =>
          prev.map((r) => (r.id === regId ? { ...r, payment_status: newStatus } : r))
        );
        showToast(`Pass status changed to ${newStatus.toUpperCase()}`);
      } else {
        alert(data.error || "Failed to update status.");
      }
    } catch (err) {
      alert("Error updating status.");
    }
  };

  // Delete Registration
  const handleDeleteRegistration = async (reg: RegistrationRow) => {
    if (!confirm(`Are you sure you want to permanently delete pass ${reg.pass_code} for ${reg.lead_name}?`)) {
      return;
    }

    const adminToken = sessionStorage.getItem("tx8_admin_token") || "";
    try {
      const res = await fetch(`/api/admin/registrations/${reg.id}`, {
        method: "DELETE",
        headers: { "x-admin-key": adminToken },
      });

      const data = await res.json();
      if (data.success) {
        setRegistrations((prev) => prev.filter((r) => r.id !== reg.id));
        showToast(`Registration ${reg.pass_code} deleted successfully.`);
      } else {
        alert(data.error || "Failed to delete record.");
      }
    } catch (err) {
      alert("Error deleting record.");
    }
  };

  // Save Registration Edits
  const handleSaveRegistrationEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRegistration) return;

    setIsUpdating(true);
    const adminToken = sessionStorage.getItem("tx8_admin_token") || "";

    try {
      const res = await fetch(`/api/admin/registrations/${editingRegistration.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminToken,
        },
        body: JSON.stringify(editingRegistration),
      });

      const data = await res.json();
      if (data.success) {
        setRegistrations((prev) =>
          prev.map((r) => (r.id === editingRegistration.id ? editingRegistration : r))
        );
        setEditingRegistration(null);
        showToast("Registration updated successfully.");
      } else {
        alert(data.error || "Failed to update registration.");
      }
    } catch (err) {
      alert("Error saving registration edits.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Save Event Edits
  const handleSaveEventEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    setIsUpdating(true);
    const adminToken = sessionStorage.getItem("tx8_admin_token") || "";

    try {
      const res = await fetch("/api/admin/events", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminToken,
        },
        body: JSON.stringify({
          eventId: editingEvent.id,
          customTitle: editingEvent.title,
          customSubtitle: editingEvent.subtitle,
          customFee: editingEvent.feeAmount,
          winningPrize: editingEvent.winningPrize,
          runnerUpPrize: editingEvent.runnerUpPrize,
          venue: editingEvent.venue,
          scheduleTime: editingEvent.scheduleTime,
          isOpen: editingEvent.isOpen,
          coordinators: editingEvent.coordinators,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setEvents((prev) =>
          prev.map((ev) => (ev.id === editingEvent.id ? editingEvent : ev))
        );
        setEditingEvent(null);
        showToast("Event specifications updated successfully.");
      } else {
        alert(data.error || "Failed to update event.");
      }
    } catch (err) {
      alert("Error saving event changes.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Derived Statistics
  const stats = useMemo(() => {
    const totalRegistrations = registrations.length;
    const totalRevenue = registrations.reduce((sum, r) => sum + (Number(r.fee_amount) || 0), 0);
    const verifiedCount = registrations.filter(
      (r) => r.payment_status === "verified" || r.payment_status === "paid_verified"
    ).length;
    const pendingCount = registrations.filter(
      (r) => r.payment_status === "paid_pending_verification"
    ).length;
    const rejectedCount = registrations.filter(
      (r) => r.payment_status === "rejected"
    ).length;

    return { totalRegistrations, totalRevenue, verifiedCount, pendingCount, rejectedCount };
  }, [registrations]);

  // Filtered Registrations
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((r) => {
      // Event filter
      if (selectedEventFilter !== "all" && r.event_id !== selectedEventFilter) {
        return false;
      }
      // Status filter
      if (selectedStatusFilter !== "all" && r.payment_status !== selectedStatusFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const membersStr = Array.isArray(r.members)
          ? r.members.join(" ")
          : typeof r.members === "string"
            ? r.members
            : "";
        const matches =
          r.lead_name.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.phone.toLowerCase().includes(q) ||
          r.pass_code.toLowerCase().includes(q) ||
          (r.utr_number && r.utr_number.toLowerCase().includes(q)) ||
          r.college_name.toLowerCase().includes(q) ||
          r.event_title.toLowerCase().includes(q) ||
          (r.team_name && r.team_name.toLowerCase().includes(q)) ||
          membersStr.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [registrations, selectedEventFilter, selectedStatusFilter, searchQuery]);

  // =========================================================================
  // VIEW: AUTHENTICATION GATE
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen text-white flex flex-col justify-between selection:bg-red-500 selection:text-white relative z-10"
        style={{ backgroundColor: "#060913" }}
      >
        <Navbar />

        <div className="flex-1 flex items-center justify-center px-4 py-20 relative">
          <div className="w-full max-w-md relative z-10">
            {/* Marvel SHIELD / Stark Card */}
            <div className="rounded-3xl bg-[#0E1528] border-2 border-slate-700/80 p-8 sm:p-10 shadow-2xl">
              {/* Header Badge */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-red-600/20 border-2 border-red-500 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                  <Shield className="w-8 h-8 text-red-500" />
                </div>
              </div>

              <div className="text-center mb-8">
                <span className="font-mono-code text-xs font-bold text-red-400 uppercase tracking-widest bg-red-950 border border-red-500/60 px-3 py-1 rounded-full">
                  RESTRICTED COMMAND CLEARANCE
                </span>
                <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-wider mt-4">
                  TECHNIX <span className="text-red-500">8.0</span> ADMIN
                </h1>
                <p className="font-sans text-xs text-slate-300 mt-2 font-medium">
                  Enter master security key to access candidates, financial transactions, and event controls.
                </p>
              </div>

              {authError && (
                <div className="mb-6 p-3.5 rounded-xl bg-red-950 border-2 border-red-500 flex items-center gap-2.5 text-xs text-white font-mono-code font-bold">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block font-mono-code text-xs font-bold text-white uppercase tracking-wider mb-2">
                    Security Passcode
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="Enter security key..."
                      required
                      autoFocus
                      className="w-full rounded-xl bg-[#070B16] border-2 border-slate-600 px-4 py-3.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500 font-mono-code transition-all"
                    />
                    <Lock className="w-4 h-4 text-slate-300 absolute right-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full rounded-xl bg-gradient-to-r from-red-600 to-amber-600 py-3.5 text-xs font-mono-code font-black uppercase tracking-widest text-white hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isAuthenticating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>AUTHENTICATING...</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4" />
                      <span>ACCESS MAINFRAME</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // =========================================================================
  // VIEW: AUTHENTICATED ADMIN DASHBOARD
  // =========================================================================
  return (
    <div
      className="min-h-screen text-white selection:bg-red-500 selection:text-white flex flex-col justify-between relative z-10"
      style={{ backgroundColor: "#060913" }}
    >
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* SUCCESS TOAST */}
        {successToast && (
          <div className="fixed top-20 right-6 z-50 rounded-xl bg-[#072414] border-2 border-emerald-500 px-4 py-3 text-xs font-mono-code text-emerald-200 font-bold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* TOP COMMAND HEADER BANNER - SOLID BACKGROUND */}
        <div className="bg-[#0E1528] border-2 border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-xl mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono-code text-xs font-extrabold uppercase tracking-widest bg-red-950 text-red-300 border border-red-500/70 px-3 py-1 rounded-full shadow-sm">
                  SHIELD LEVEL 8
                </span>
                <span className="font-mono-code text-xs text-emerald-300 font-bold flex items-center gap-1.5 bg-emerald-950 border border-emerald-500/70 px-3 py-1 rounded-full shadow-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  NEON DB ONLINE
                </span>
              </div>
              <h1 className="font-heading font-black text-2xl sm:text-4xl text-white tracking-wide mt-3 drop-shadow-md">
                COMMAND MAINFRAME <span className="text-red-500">//</span> DASHBOARD
              </h1>
              <p className="font-sans text-xs sm:text-sm text-slate-200 mt-1 font-semibold">
                Department of MCA · BMS Institute of Technology &amp; Management · Central Records
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => fetchData()}
                disabled={isLoading}
                className="rounded-xl bg-[#1A233A] hover:bg-[#233050] border-2 border-slate-600 px-4 py-2.5 text-xs font-mono-code font-bold text-white flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-amber-400" : "text-white"}`} />
                <span>Refresh</span>
              </button>

              <button
                onClick={() => exportToCSV(filteredRegistrations)}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-xs font-mono-code font-black text-white flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-white" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => exportToPDF(filteredRegistrations, stats)}
                className="rounded-xl bg-red-600 hover:bg-red-500 px-4 py-2.5 text-xs font-mono-code font-black text-white flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4 text-white" />
                <span>Export PDF</span>
              </button>

              <button
                onClick={handleLogout}
                className="rounded-xl bg-slate-800 hover:bg-red-900 border-2 border-slate-600 hover:border-red-500 px-4 py-2.5 text-xs font-mono-code font-bold text-white transition-all cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* METRICS OVERVIEW CARDS - 100% SOLID BACKGROUND */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 mb-6">
          <StatCard
            label="Total Candidates"
            value={stats.totalRegistrations}
            subtitle="Registered participants"
            icon={<Users className="w-5 h-5 text-sky-400" />}
            color="border-sky-500 bg-[#0E1528]"
          />
          <StatCard
            label="Total Revenue"
            value={`₹${stats.totalRevenue.toLocaleString("en-IN")}`}
            subtitle="Calculated UPI intake"
            icon={<CreditCard className="w-5 h-5 text-emerald-400" />}
            color="border-emerald-500 bg-[#0E1528]"
          />
          <StatCard
            label="Verified Passes"
            value={stats.verifiedCount}
            subtitle="Approved transactions"
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            color="border-emerald-500 bg-[#0E1528]"
          />
          <StatCard
            label="Pending Review"
            value={stats.pendingCount}
            subtitle="Awaiting UTR audit"
            icon={<Clock className="w-5 h-5 text-amber-400" />}
            color="border-amber-500 bg-[#0E1528]"
          />
          <StatCard
            label="Active Events"
            value={events.length || 11}
            subtitle="Battle arenas live"
            icon={<Layers className="w-5 h-5 text-red-400" />}
            color="border-red-500 bg-[#0E1528]"
          />
        </div>

        {/* NAVIGATION TABS - SOLID PILL BUTTONS */}
        <div className="flex gap-2 mb-6 overflow-x-auto bg-[#0E1528] border-2 border-slate-700/80 p-2 rounded-2xl shadow-lg">
          <button
            onClick={() => setActiveTab("registrations")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono-code text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${activeTab === "registrations"
                ? "bg-red-600 text-white shadow-md"
                : "bg-transparent text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
          >
            <Users className="w-4 h-4" />
            <span>Registrations &amp; Transactions ({filteredRegistrations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("events")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono-code text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${activeTab === "events"
                ? "bg-red-600 text-white shadow-md"
                : "bg-transparent text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
          >
            <Settings className="w-4 h-4" />
            <span>Event Controls &amp; Edit ({events.length || 11})</span>
          </button>

          <button
            onClick={() => setActiveTab("export")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono-code text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${activeTab === "export"
                ? "bg-red-600 text-white shadow-md"
                : "bg-transparent text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
          >
            <Download className="w-4 h-4" />
            <span>Export Dossier (CSV &amp; PDF)</span>
          </button>
        </div>

        {/* ================================================================= */}
        {/* TAB 1: REGISTRATIONS & TRANSACTIONS TABLE */}
        {/* ================================================================= */}
        {activeTab === "registrations" && (
          <div className="space-y-4">
            {/* Search & Filter Bar - 100% Solid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 bg-[#0E1528] border-2 border-slate-700/80 rounded-2xl p-4 shadow-xl">
              {/* Search input */}
              <div className="sm:col-span-2 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search candidate name, email, phone, passcode, UTR, college..."
                  className="w-full rounded-xl bg-[#070B16] border-2 border-slate-600 px-4 py-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-red-500 font-mono-code font-bold transition-all"
                />
                <Search className="w-4 h-4 text-slate-300 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>

              {/* Event Filter */}
              <div>
                <select
                  value={selectedEventFilter}
                  onChange={(e) => setSelectedEventFilter(e.target.value)}
                  className="w-full rounded-xl bg-[#070B16] border-2 border-slate-600 px-3 py-3 text-xs text-white font-bold focus:outline-none focus:border-red-500 font-mono-code cursor-pointer"
                >
                  <option value="all" className="bg-[#0E1528] text-white">All Events ({events.length})</option>
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id} className="bg-[#0E1528] text-white">
                      {ev.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="w-full rounded-xl bg-[#070B16] border-2 border-slate-600 px-3 py-3 text-xs text-white font-bold focus:outline-none focus:border-red-500 font-mono-code cursor-pointer"
                >
                  <option value="all" className="bg-[#0E1528] text-white">All Statuses</option>
                  <option value="verified" className="bg-[#0E1528] text-emerald-400 font-bold">Verified</option>
                  <option value="paid_pending_verification" className="bg-[#0E1528] text-amber-400 font-bold">Pending Audit</option>
                  <option value="rejected" className="bg-[#0E1528] text-red-400 font-bold">Rejected</option>
                </select>
              </div>
            </div>

            {/* Records Count Bar */}
            <div className="flex items-center justify-between text-xs font-mono-code text-white px-2 font-bold">
              <span>
                Showing <strong className="text-amber-300 font-black text-sm">{filteredRegistrations.length}</strong> of{" "}
                <strong className="text-white font-black text-sm">{registrations.length}</strong> registered participants
              </span>
              {(searchQuery || selectedEventFilter !== "all" || selectedStatusFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedEventFilter("all");
                    setSelectedStatusFilter("all");
                  }}
                  className="text-red-400 hover:text-red-300 font-bold underline cursor-pointer"
                >
                  Reset filters
                </button>
              )}
            </div>

            {/* Data Table */}
            {filteredRegistrations.length === 0 ? (
              <div className="rounded-2xl border-2 border-slate-700/80 bg-[#0E1528] p-12 text-center shadow-xl">
                <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="font-heading font-bold text-white text-lg">No registrations found</h3>
                <p className="font-sans text-xs sm:text-sm text-slate-300 mt-2 max-w-sm mx-auto font-medium">
                  {registrations.length === 0
                    ? "Candidates registering through the registration forms will automatically be recorded here in Neon PostgreSQL."
                    : "No records match your active search or filter criteria. Try clearing filters."}
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-slate-700/80 bg-[#0E1528] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-[#070B16] border-b-2 border-slate-700 font-mono-code text-xs uppercase tracking-wider text-white font-extrabold">
                      <tr>
                        <th className="py-4 px-4 text-white">Passcode</th>
                        <th className="py-4 px-4 text-white">Candidate &amp; Contact</th>
                        <th className="py-4 px-4 text-white">Institution</th>
                        <th className="py-4 px-4 text-white">Event &amp; Squad</th>
                        <th className="py-4 px-4 text-white">Fee &amp; UTR</th>
                        <th className="py-4 px-4 text-white">Status</th>
                        <th className="py-4 px-4 text-right text-white">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredRegistrations.map((reg) => {
                        const members: string[] = (() => {
                          if (!reg.members) return [];
                          if (Array.isArray(reg.members)) return reg.members.filter(Boolean);
                          try {
                            return JSON.parse(reg.members as string);
                          } catch {
                            return [];
                          }
                        })();

                        const isVerified =
                          reg.payment_status === "verified" || reg.payment_status === "paid_verified";
                        const isPending = reg.payment_status === "paid_pending_verification";
                        const isRejected = reg.payment_status === "rejected";

                        return (
                          <tr key={reg.id} className="hover:bg-slate-800/40 transition-colors">
                            {/* Passcode */}
                            <td className="py-4 px-4 font-mono-code whitespace-nowrap">
                              <span className="font-black text-amber-300 bg-amber-950 border-2 border-amber-500/70 px-2.5 py-1 rounded text-xs shadow-sm">
                                {reg.pass_code}
                              </span>
                              <div className="text-xs text-slate-300 mt-1.5 font-bold">
                                {new Date(reg.created_at).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </div>
                            </td>

                            {/* Candidate & Contact */}
                            <td className="py-4 px-4">
                              <div className="font-black text-white text-sm">{reg.lead_name}</div>
                              <div className="text-slate-200 text-xs flex items-center gap-1.5 mt-1 font-semibold">
                                <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                                <span>{reg.email}</span>
                              </div>
                              <div className="text-slate-200 text-xs flex items-center gap-1.5 mt-0.5 font-semibold">
                                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span>{reg.phone}</span>
                              </div>
                            </td>

                            {/* Institution */}
                            <td className="py-4 px-4 text-xs">
                              <div className="text-white font-extrabold max-w-[200px] truncate" title={reg.college_name}>
                                {reg.college_name}
                              </div>
                              <div className="text-slate-300 text-xs mt-1 font-semibold">
                                {reg.department} · {reg.year_of_study}
                              </div>
                            </td>

                            {/* Event & Squad */}
                            <td className="py-4 px-4">
                              <div className="font-black text-red-400 text-xs max-w-[220px] truncate" title={reg.event_title}>
                                {reg.event_title}
                              </div>
                              {reg.team_name ? (
                                <div className="text-amber-300 text-xs font-mono-code mt-1 font-bold">
                                  Team: <span className="text-white font-black">{reg.team_name}</span>
                                </div>
                              ) : null}
                              {members.length > 0 && (
                                <div className="text-xs text-slate-200 mt-1 font-semibold">
                                  <span className="text-amber-300 font-mono-code">Allies ({members.length}):</span> {members.join(", ")}
                                </div>
                              )}
                            </td>

                            {/* Fee & UTR */}
                            <td className="py-4 px-4 whitespace-nowrap">
                              <div className="font-mono-code font-black text-emerald-400 text-base">
                                ₹{reg.fee_amount}
                              </div>
                              <div className="font-mono-code text-xs text-slate-200 flex items-center gap-1 mt-1 font-bold" title={reg.utr_number || "No UTR"}>
                                <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                                <span>{reg.utr_number || "N/A"}</span>
                              </div>
                            </td>

                            {/* Status & Quick Toggle */}
                            <td className="py-4 px-4 whitespace-nowrap">
                              {isVerified && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono-code font-black uppercase bg-[#052E16] text-emerald-300 border-2 border-emerald-500">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verified
                                </span>
                              )}
                              {isPending && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono-code font-black uppercase bg-[#3E2305] text-amber-300 border-2 border-amber-500 animate-pulse">
                                  <Clock className="w-3.5 h-3.5 text-amber-400" /> Pending Audit
                                </span>
                              )}
                              {isRejected && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono-code font-black uppercase bg-[#3B0707] text-red-300 border-2 border-red-500">
                                  <XCircle className="w-3.5 h-3.5 text-red-400" /> Rejected
                                </span>
                              )}

                              {/* Quick Action Buttons */}
                              <div className="flex items-center gap-2 mt-2.5">
                                {!isVerified && (
                                  <button
                                    onClick={() => handleStatusChange(reg.id, "verified")}
                                    className="px-2.5 py-1 text-xs font-mono-code font-bold rounded bg-emerald-700 hover:bg-emerald-600 text-white transition-all cursor-pointer shadow-sm"
                                    title="Verify Payment"
                                  >
                                    Approve
                                  </button>
                                )}
                                {!isRejected && (
                                  <button
                                    onClick={() => handleStatusChange(reg.id, "rejected")}
                                    className="px-2.5 py-1 text-xs font-mono-code font-bold rounded bg-red-700 hover:bg-red-600 text-white transition-all cursor-pointer shadow-sm"
                                    title="Reject Payment"
                                  >
                                    Reject
                                  </button>
                                )}
                                {!isPending && (
                                  <button
                                    onClick={() => handleStatusChange(reg.id, "paid_pending_verification")}
                                    className="px-2.5 py-1 text-xs font-mono-code font-bold rounded bg-amber-700 hover:bg-amber-600 text-white transition-all cursor-pointer shadow-sm"
                                    title="Mark as Pending"
                                  >
                                    Pending
                                  </button>
                                )}
                              </div>
                            </td>

                            {/* Actions (Edit / Delete) */}
                            <td className="py-4 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setEditingRegistration(reg)}
                                  className="p-2 rounded-xl bg-slate-700 hover:bg-sky-600 text-white transition-all cursor-pointer shadow-md"
                                  title="Edit Participant Details"
                                >
                                  <Edit3 className="w-4 h-4 text-white" />
                                </button>
                                <button
                                  onClick={() => handleDeleteRegistration(reg)}
                                  className="p-2 rounded-xl bg-red-800 hover:bg-red-600 text-white transition-all cursor-pointer shadow-md"
                                  title="Delete Record"
                                >
                                  <Trash2 className="w-4 h-4 text-white" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: EVENT CONTROLS & EDIT OPTIONS */}
        {/* ================================================================= */}
        {activeTab === "events" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#0E1528] border-2 border-slate-700/80 rounded-2xl p-6 shadow-xl">
              <div>
                <h2 className="font-heading font-black text-xl text-white">Event Customization Matrix</h2>
                <p className="font-sans text-xs sm:text-sm text-slate-200 mt-1 font-semibold">
                  Update event fees, prize pool, venues, schedules, coordinators, or toggle registration availability.
                </p>
              </div>
              <div className="text-xs font-mono-code text-white font-bold bg-[#070B16] border border-slate-600 px-3 py-1.5 rounded-xl">
                Total Arenas: <strong className="text-amber-300 font-black text-sm">{events.length}</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {events.map((event) => {
                const regCount = registrations.filter((r) => r.event_id === event.id).length;

                return (
                  <div
                    key={event.id}
                    className="rounded-2xl bg-[#0E1528] border-2 border-slate-700/80 hover:border-red-500 p-5 flex flex-col justify-between transition-all group shadow-xl"
                  >
                    <div>
                      {/* Top Bar */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono-code text-xs font-black text-red-300 uppercase tracking-widest bg-red-950 border border-red-500/70 px-2.5 py-1 rounded">
                          {event.category}
                        </span>
                        <span
                          className={`font-mono-code text-xs font-black px-3 py-1 rounded border-2 ${event.isOpen
                              ? "bg-emerald-950 text-emerald-300 border-emerald-500"
                              : "bg-red-950 text-red-300 border-red-500"
                            }`}
                        >
                          {event.isOpen ? "REGISTRATION OPEN" : "CLOSED"}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-heading font-black text-lg text-white group-hover:text-red-400 transition-colors line-clamp-1">
                        {event.title}
                      </h3>
                      {event.subtitle && (
                        <p className="font-sans text-xs text-slate-200 mt-1 line-clamp-1 font-semibold">
                          {event.subtitle}
                        </p>
                      )}

                      {/* Specs */}
                      <div className="mt-4 pt-3 border-t-2 border-slate-800 space-y-2 text-xs font-mono-code">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300 font-bold">Entry Fee:</span>
                          <span className="text-emerald-400 font-black text-base">₹{event.feeAmount}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300 font-bold">Prizes:</span>
                          <span className="text-amber-300 font-black">
                            1st: {event.winningPrize || "TBD"} · 2nd: {event.runnerUpPrize || "TBD"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300 font-bold">Venue:</span>
                          <span className="text-white font-black truncate max-w-[170px]" title={event.venue}>
                            {event.venue}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300 font-bold">Schedule:</span>
                          <span className="text-white font-black">{event.scheduleTime}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300 font-bold">Registered:</span>
                          <span className="text-sky-300 font-black">{regCount} Candidates</span>
                        </div>
                      </div>

                      {/* Coordinators preview */}
                      {event.coordinators && event.coordinators.length > 0 && (
                        <div className="mt-4 pt-3 border-t-2 border-slate-800 text-xs text-slate-200 font-sans">
                          <span className="text-xs font-mono-code uppercase text-amber-300 font-black block mb-1.5">
                            Coordinators:
                          </span>
                          {event.coordinators.slice(0, 2).map((c, i) => (
                            <div key={i} className="truncate font-semibold text-slate-100 mt-1">
                              • <strong className="text-white">{c.name}</strong> {c.phone ? `(${c.phone})` : ""}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Edit button */}
                    <div className="mt-6 pt-4 border-t-2 border-slate-800">
                      <button
                        onClick={() => setEditingEvent(event)}
                        className="w-full rounded-xl bg-slate-800 hover:bg-red-600 border border-slate-600 hover:border-red-500 py-3 text-xs font-mono-code font-black uppercase tracking-wider text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                      >
                        <Edit3 className="w-4 h-4 text-white" />
                        <span>Edit Event Specs</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: EXPORT DOSSIER (CSV & PDF) */}
        {/* ================================================================= */}
        {activeTab === "export" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-[#0E1528] border-2 border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-xl">
              <span className="font-mono-code text-xs font-black text-emerald-300 uppercase tracking-widest bg-emerald-950 border border-emerald-500/70 px-3 py-1 rounded-full">
                OFFICIAL REPORT GENERATOR
              </span>
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-white mt-3">
                Export Candidate Records &amp; Transactions
              </h2>
              <p className="font-sans text-xs sm:text-sm text-slate-200 mt-2 max-w-2xl font-semibold leading-relaxed">
                Generate official spreadsheets and printable admission dossiers for the TECHNIX 8.0 registration desk, faculty audit, and finance record keeping.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CSV Export Card */}
              <div className="rounded-2xl bg-[#0E1528] border-2 border-slate-700/80 hover:border-emerald-500 p-6 flex flex-col justify-between transition-all group shadow-xl">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-emerald-950 border-2 border-emerald-500 flex items-center justify-center mb-5 shadow-md">
                    <FileSpreadsheet className="w-7 h-7 text-emerald-400" />
                  </div>
                  <h3 className="font-heading font-black text-xl text-white group-hover:text-emerald-400 transition-colors">
                    Excel &amp; CSV Spreadsheet
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed font-medium">
                    Downloads an Excel-ready UTF-8 CSV containing all registration fields: Candidate details, Passcode, Phone, Institution, Event, Squad allies, Payment Method, and UTR.
                  </p>
                  <ul className="mt-4 space-y-2 text-xs font-mono-code text-slate-200 font-bold">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Compatible with MS Excel &amp; Google Sheets</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Includes full squad member arrays</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span><strong className="text-amber-300">{registrations.length}</strong> Total records queued</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-5 border-t-2 border-slate-800 space-y-3">
                  <button
                    onClick={() => exportToCSV(registrations)}
                    className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3.5 text-xs font-mono-code font-black uppercase tracking-wider text-white flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-white" />
                    <span>Download All Records (CSV)</span>
                  </button>
                  {filteredRegistrations.length !== registrations.length && (
                    <button
                      onClick={() => exportToCSV(filteredRegistrations, `technix8_filtered_${Date.now()}.csv`)}
                      className="w-full rounded-xl bg-[#070B16] hover:bg-slate-800 border-2 border-slate-600 py-3 text-xs font-mono-code font-bold text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Filter className="w-4 h-4 text-emerald-400" />
                      <span>Download Filtered Only ({filteredRegistrations.length})</span>
                    </button>
                  )}
                </div>
              </div>

              {/* PDF Export Card */}
              <div className="rounded-2xl bg-[#0E1528] border-2 border-slate-700/80 hover:border-red-500 p-6 flex flex-col justify-between transition-all group shadow-xl">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-red-950 border-2 border-red-500 flex items-center justify-center mb-5 shadow-md">
                    <FileText className="w-7 h-7 text-red-400" />
                  </div>
                  <h3 className="font-heading font-black text-xl text-white group-hover:text-red-400 transition-colors">
                    Executive PDF Dossier
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed font-medium">
                    Generates a formal A4 Landscape PDF with BMSITM institutional branding, executive financial summary bar, participant roster, and transaction statuses.
                  </p>
                  <ul className="mt-4 space-y-2 text-xs font-mono-code text-slate-200 font-bold">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
                      <span>Formal BMSITM Department of MCA Header</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
                      <span>Color-coded Verification status labels</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
                      <span>Ready for print desk submission</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-5 border-t-2 border-slate-800 space-y-3">
                  <button
                    onClick={() => exportToPDF(registrations, stats)}
                    className="w-full rounded-xl bg-red-600 hover:bg-red-500 py-3.5 text-xs font-mono-code font-black uppercase tracking-wider text-white flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-white" />
                    <span>Download Official PDF Dossier</span>
                  </button>
                  {filteredRegistrations.length !== registrations.length && (
                    <button
                      onClick={() => exportToPDF(filteredRegistrations, stats, `technix8_filtered_${Date.now()}.pdf`)}
                      className="w-full rounded-xl bg-[#070B16] hover:bg-slate-800 border-2 border-slate-600 py-3 text-xs font-mono-code font-bold text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Filter className="w-4 h-4 text-red-400" />
                      <span>Download Filtered PDF ({filteredRegistrations.length})</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* =================================================================== */}
      {/* MODAL 1: EDIT REGISTRATION */}
      {/* =================================================================== */}
      {editingRegistration && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#0E1528] border-2 border-slate-600 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setEditingRegistration(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="font-mono-code text-xs font-bold text-amber-300 uppercase tracking-widest bg-amber-950 border border-amber-500 px-3 py-1 rounded-full">
                EDIT PARTICIPANT DOSSIER · {editingRegistration.pass_code}
              </span>
              <h2 className="font-heading font-black text-2xl text-white mt-3">
                Modify Registration Record
              </h2>
            </div>

            <form onSubmit={handleSaveRegistrationEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono-code text-xs font-bold text-white mb-1.5">Candidate Lead Name</label>
                  <input
                    type="text"
                    value={editingRegistration.lead_name}
                    onChange={(e) =>
                      setEditingRegistration({ ...editingRegistration, lead_name: e.target.value })
                    }
                    className="w-full rounded-xl bg-[#070B16] border-2 border-slate-600 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-sans font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-mono-code text-xs font-bold text-white mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={editingRegistration.email}
                    onChange={(e) =>
                      setEditingRegistration({ ...editingRegistration, email: e.target.value })
                    }
                    className="w-full rounded-xl bg-[#070B16] border-2 border-slate-600 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-sans font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-mono-code text-xs font-bold text-white mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    value={editingRegistration.phone}
                    onChange={(e) =>
                      setEditingRegistration({ ...editingRegistration, phone: e.target.value })
                    }
                    className="w-full rounded-xl bg-[#070B16] border-2 border-slate-600 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-mono-code font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-mono-code text-xs font-bold text-white mb-1.5">College / Institution</label>
                  <input
                    type="text"
                    value={editingRegistration.college_name}
                    onChange={(e) =>
                      setEditingRegistration({ ...editingRegistration, college_name: e.target.value })
                    }
                    className="w-full rounded-xl bg-[#070B16] border-2 border-slate-600 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-sans font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-mono-code text-xs font-bold text-white mb-1.5">Department</label>
                  <input
                    type="text"
                    value={editingRegistration.department}
                    onChange={(e) =>
                      setEditingRegistration({ ...editingRegistration, department: e.target.value })
                    }
                    className="w-full rounded-xl bg-[#070B16] border-2 border-slate-600 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-sans font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-mono-code text-xs font-bold text-white mb-1.5">Year of Study</label>
                  <input
                    type="text"
                    value={editingRegistration.year_of_study}
                    onChange={(e) =>
                      setEditingRegistration({ ...editingRegistration, year_of_study: e.target.value })
                    }
                    className="w-full rounded-xl bg-[#070B16] border-2 border-slate-600 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-sans font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-mono-code text-xs font-bold text-white mb-1.5">Event Registration</label>
                  <select
                    value={editingRegistration.event_id}
                    onChange={(e) => {
                      const selected = events.find((ev) => ev.id === e.target.value);
                      setEditingRegistration({
                        ...editingRegistration,
                        event_id: e.target.value,
                        event_title: selected ? selected.title : editingRegistration.event_title,
                      });
                    }}
                    className="w-full rounded-xl bg-[#070B16] border-2 border-slate-600 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-sans font-bold cursor-pointer"
                  >
                    {events.map((ev) => (
                      <option key={ev.id} value={ev.id} className="bg-[#0E1528] text-white">
                        {ev.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono-code text-xs font-bold text-white mb-1.5">Team Name (Optional)</label>
                  <input
                    type="text"
                    value={editingRegistration.team_name || ""}
                    onChange={(e) =>
                      setEditingRegistration({ ...editingRegistration, team_name: e.target.value })
                    }
                    placeholder="Solo if blank"
                    className="w-full rounded-xl bg-[#070B16] border-2 border-slate-600 px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-red-500 font-sans font-bold"
                  />
                </div>

                <div>
                  <label className="block font-mono-code text-xs font-bold text-white mb-1.5">Fee Amount (₹)</label>
                  <input
                    type="number"
                    value={editingRegistration.fee_amount}
                    onChange={(e) =>
                      setEditingRegistration({
                        ...editingRegistration,
                        fee_amount: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-xl bg-[#070B16] border-2 border-slate-600 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-mono-code font-black"
                    required
                  />
                </div>

                <div>
                  <label className="block font-mono-code text-xs font-bold text-white mb-1.5">UPI UTR Reference</label>
                  <input
                    type="text"
                    value={editingRegistration.utr_number || ""}
                    onChange={(e) =>
                      setEditingRegistration({ ...editingRegistration, utr_number: e.target.value })
                    }
                    className="w-full rounded-xl bg-[#070B16] border-2 border-slate-600 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-mono-code font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-mono-code text-xs font-bold text-white mb-1.5">Verification Status</label>
                  <select
                    value={editingRegistration.payment_status}
                    onChange={(e) =>
                      setEditingRegistration({
                        ...editingRegistration,
                        payment_status: e.target.value,
                      })
                    }
                    className="w-full rounded-xl bg-[#070B16] border-2 border-slate-600 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-mono-code font-bold cursor-pointer"
                  >
                    <option value="paid_pending_verification" className="bg-[#0E1528] text-amber-400 font-bold">Pending Audit (paid_pending_verification)</option>
                    <option value="verified" className="bg-[#0E1528] text-emerald-400 font-bold">Verified &amp; Approved (verified)</option>
                    <option value="rejected" className="bg-[#0E1528] text-red-400 font-bold">Rejected (rejected)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-5 border-t-2 border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingRegistration(null)}
                  className="rounded-xl px-4 py-2.5 text-xs font-mono-code font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="rounded-xl bg-gradient-to-r from-red-600 to-amber-600 px-6 py-2.5 text-xs font-mono-code font-black uppercase tracking-wider text-white hover:brightness-110 transition-all disabled:opacity-50 cursor-pointer shadow-lg"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 2: EDIT EVENT */}
      {/* =================================================================== */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#0E1528] border-2 border-slate-600 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setEditingEvent(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="font-mono-code text-xs font-bold text-red-300 uppercase tracking-widest bg-red-950 border border-red-500 px-3 py-1 rounded-full">
                EDIT EVENT SPECIFICATIONS
              </span>
              <h2 className="font-heading font-black text-2xl text-white mt-3">
                {editingEvent.title}
              </h2>
            </div>

            <form onSubmit={handleSaveEventEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-mono-code text-xs font-bold text-white mb-1.5">Event Title</label>
                  <input
                    type="text"
                    value={editingEvent.title}
                    onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                    className="w-full rounded-xl bg-[#070B16] border-2 border-slate-600 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-sans font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-mono-code text-xs font-bold text-white mb-1.5">Registration Fee (₹)</label>
                  <input
                    type="number"
                    value={editingEvent.feeAmount}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, feeAmount: Number(e.target.value) })
                    }
                    className="w-full rounded-xl bg-[#070B16] border-2 border-slate-600 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-mono-code font-black"
                    required
                  />
                </div>

                <div>
                  <label className="block font-mono-code text-xs font-bold text-white mb-1.5">Registration Status</label>
                  <select
                    value={editingEvent.isOpen ? "true" : "false"}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, isOpen: e.target.value === "true" })
                    }
                    className="w-full rounded-xl bg-[#070B16] border-2 border-slate-600 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-mono-code font-bold cursor-pointer"
                  >
                    <option value="true" className="bg-[#0E1528] text-emerald-400 font-bold">Open for Registrations</option>
                    <option value="false" className="bg-[#0E1528] text-red-400 font-bold">Closed / Sold Out</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono-code text-xs font-bold text-white mb-1.5">Winning Prize</label>
                  <input
                    type="text"
                    value={editingEvent.winningPrize || ""}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, winningPrize: e.target.value })
                    }
                    placeholder="e.g. ₹2,000"
                    className="w-full rounded-xl bg-[#070B16] border-2 border-slate-600 px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-red-500 font-sans font-bold"
                  />
                </div>

                <div>
                  <label className="block font-mono-code text-xs font-bold text-white mb-1.5">Runner Up Prize</label>
                  <input
                    type="text"
                    value={editingEvent.runnerUpPrize || ""}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, runnerUpPrize: e.target.value })
                    }
                    placeholder="e.g. ₹1,000"
                    className="w-full rounded-xl bg-[#070B16] border-2 border-slate-600 px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-red-500 font-sans font-bold"
                  />
                </div>

                <div>
                  <label className="block font-mono-code text-xs font-bold text-white mb-1.5">Venue / Arena</label>
                  <input
                    type="text"
                    value={editingEvent.venue}
                    onChange={(e) => setEditingEvent({ ...editingEvent, venue: e.target.value })}
                    className="w-full rounded-xl bg-[#070B16] border-2 border-slate-600 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-sans font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-mono-code text-xs font-bold text-white mb-1.5">Schedule / Time</label>
                  <input
                    type="text"
                    value={editingEvent.scheduleTime}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, scheduleTime: e.target.value })
                    }
                    className="w-full rounded-xl bg-[#070B16] border-2 border-slate-600 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-sans font-bold"
                    required
                  />
                </div>
              </div>

              {/* Coordinators Section */}
              <div className="pt-2">
                <label className="block font-mono-code text-xs font-bold text-amber-300 mb-2">
                  Event Coordinators (Name &amp; Phone)
                </label>
                <div className="space-y-2.5">
                  {(editingEvent.coordinators || []).map((coord, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={coord.name}
                        onChange={(e) => {
                          const updated = [...editingEvent.coordinators];
                          updated[idx] = { ...updated[idx], name: e.target.value };
                          setEditingEvent({ ...editingEvent, coordinators: updated });
                        }}
                        placeholder="Coordinator Name"
                        className="flex-1 rounded-xl bg-[#070B16] border-2 border-slate-600 px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-sans font-bold"
                      />
                      <input
                        type="text"
                        value={coord.phone}
                        onChange={(e) => {
                          const updated = [...editingEvent.coordinators];
                          updated[idx] = { ...updated[idx], phone: e.target.value };
                          setEditingEvent({ ...editingEvent, coordinators: updated });
                        }}
                        placeholder="Phone Number"
                        className="w-40 rounded-xl bg-[#070B16] border-2 border-slate-600 px-3 py-2 text-xs text-amber-300 focus:outline-none focus:border-red-500 font-mono-code font-black"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-5 border-t-2 border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="rounded-xl px-4 py-2.5 text-xs font-mono-code font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="rounded-xl bg-gradient-to-r from-red-600 to-amber-600 px-6 py-2.5 text-xs font-mono-code font-black uppercase tracking-wider text-white hover:brightness-110 transition-all disabled:opacity-50 cursor-pointer shadow-lg"
                >
                  {isUpdating ? "Saving..." : "Save Event Specs"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

function StatCard({
  label,
  value,
  subtitle,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className={`rounded-2xl border-2 ${color} p-4 sm:p-5 flex flex-col justify-between shadow-xl`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono-code text-xs font-black text-slate-200 uppercase tracking-wider truncate">
          {label}
        </span>
        <div className="p-2 rounded-xl bg-[#070B16] border border-slate-700">{icon}</div>
      </div>
      <div>
        <div className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">{value}</div>
        <div className="font-sans text-xs text-slate-200 mt-1 truncate font-semibold">{subtitle}</div>
      </div>
    </div>
  );
}
