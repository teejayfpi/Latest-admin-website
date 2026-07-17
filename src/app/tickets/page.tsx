"use client";

import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DataTable } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { formatDateTime, getInitials } from "@/lib/utils";
import { Search, Ticket, Clock, CheckCircle, AlertTriangle, MessageSquare, Eye } from "lucide-react";
import type { Ticket as TicketType, Profile } from "@/types";

interface TicketWithProfile extends TicketType {
  profile?: Profile;
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<TicketWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState<TicketWithProfile | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockTickets: TicketWithProfile[] = [
        { id: "t-1", profile_id: "1", subject: "Unable to complete KYC verification", description: "I'm having trouble uploading my ID document. The upload keeps failing.", category: "KYC", priority: "high", status: "open", assigned_to: null, resolution_notes: null, resolved_at: null, closed_at: null, created_at: "2024-06-15T10:00:00Z", updated_at: "2024-06-15T10:00:00Z", profile: { id: "1", user_id: "USR-001", email: "adebayo@email.com", phone: "+2348012345678", name: "Adebayo Johnson", role: "member", is_active: true, is_flagged: false, flagged_reason: null, kyc_verified: false, department: null, access_level: null, mfa_enabled: false, created_at: "", updated_at: "" } },
        { id: "t-2", profile_id: "2", subject: "Loan application not approved", description: "My loan application has been pending for 3 days now. Please assist.", category: "Loans", priority: "medium", status: "in_progress", assigned_to: "admin-1", resolution_notes: "Under review", resolved_at: null, closed_at: null, created_at: "2024-06-14T14:30:00Z", updated_at: "2024-06-15T09:00:00Z", profile: { id: "2", user_id: "USR-002", email: "fatima@email.com", phone: "+2348098765432", name: "Fatima Ibrahim", role: "member", is_active: true, is_flagged: false, flagged_reason: null, kyc_verified: true, department: null, access_level: null, mfa_enabled: true, created_at: "", updated_at: "" } },
        { id: "t-3", profile_id: "3", subject: "Withdrawal delayed", description: "I requested a withdrawal 2 days ago but haven't received the funds.", category: "Transactions", priority: "urgent", status: "escalated", assigned_to: "admin-2", resolution_notes: null, resolved_at: null, closed_at: null, created_at: "2024-06-13T11:00:00Z", updated_at: "2024-06-14T16:00:00Z", profile: { id: "3", user_id: "USR-003", email: "olumide@email.com", phone: "+2348055551234", name: "Olumide Adeyemi", role: "member", is_active: true, is_flagged: false, flagged_reason: null, kyc_verified: true, department: null, access_level: null, mfa_enabled: false, created_at: "", updated_at: "" } },
        { id: "t-4", profile_id: "4", subject: "Savings goal question", description: "How do I set up automatic savings contributions?", category: "Savings", priority: "low", status: "resolved", assigned_to: "admin-1", resolution_notes: "Provided instructions on setting up auto-debit", resolved_at: "2024-06-12T15:00:00Z", closed_at: "2024-06-12T16:00:00Z", created_at: "2024-06-11T09:00:00Z", updated_at: "2024-06-12T16:00:00Z", profile: { id: "4", user_id: "USR-004", email: "chinedu@email.com", phone: "+2348166667890", name: "Chinedu Okonkwo", role: "member", is_active: true, is_flagged: false, flagged_reason: null, kyc_verified: true, department: null, access_level: null, mfa_enabled: true, created_at: "", updated_at: "" } },
      ];

      setTickets(mockTickets);
      setTotalPages(3);
      setLoading(false);
    };

    fetchTickets();
  }, [statusFilter, priorityFilter, search, page]);

  const handleResolve = () => {
    if (!selectedTicket) return;
    setTickets((prev) => prev.map((t) => t.id === selectedTicket.id ? { ...t, status: "resolved" as const, resolution_notes: resolutionNotes, resolved_at: new Date().toISOString() } : t));
    setShowDetailModal(false);
    setResolutionNotes("");
  };

  const columns = [
    { key: "id", header: "Ticket ID", render: (t: TicketWithProfile) => <span className="font-mono text-sm text-slate-600">#{t.id.split("-")[1]}</span> },
    { key: "subject", header: "Subject", render: (t: TicketWithProfile) => <span className="font-medium text-slate-900">{t.subject}</span> },
    { key: "user", header: "User", render: (t: TicketWithProfile) => (
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-bold text-white">{getInitials(t.profile?.name)}</div>
        <span className="text-sm text-slate-600">{t.profile?.name}</span>
      </div>
    )},
    { key: "category", header: "Category", render: (t: TicketWithProfile) => <span className="rounded-lg bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">{t.category}</span> },
    { key: "priority", header: "Priority", render: (t: TicketWithProfile) => {
      const config: Record<string, string> = { low: "bg-slate-100 text-slate-600", medium: "bg-blue-100 text-blue-700", high: "bg-orange-100 text-orange-700", urgent: "bg-red-100 text-red-700" };
      return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${config[t.priority] || ""}`}>{t.priority}</span>;
    }},
    { key: "status", header: "Status", render: (t: TicketWithProfile) => {
      const config: Record<string, { class: string; icon: any }> = { open: { class: "bg-blue-100 text-blue-700", icon: Ticket }, in_progress: { class: "bg-purple-100 text-purple-700", icon: Clock }, escalated: { class: "bg-red-100 text-red-700", icon: AlertTriangle }, resolved: { class: "bg-green-100 text-green-700", icon: CheckCircle }, closed: { class: "bg-slate-100 text-slate-600", icon: CheckCircle } };
      const c = config[t.status] || { class: "", icon: Ticket };
      return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${c.class}`}><c.icon className="h-3 w-3" />{t.status.replace("_", " ")}</span>;
    }},
    { key: "date", header: "Created", render: (t: TicketWithProfile) => <span className="text-sm text-slate-500">{formatDateTime(t.created_at)}</span> },
    { key: "actions", header: "", render: (t: TicketWithProfile) => (
      <button onClick={() => { setSelectedTicket(t); setShowDetailModal(true); }} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"><Eye className="h-4 w-4" /></button>
    )},
  ];

  return (
    <MainLayout title="Support Tickets" subtitle="Manage and resolve user support requests">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Open", count: tickets.filter((t) => t.status === "open").length, color: "blue" },
            { label: "In Progress", count: tickets.filter((t) => t.status === "in_progress").length, color: "purple" },
            { label: "Escalated", count: tickets.filter((t) => t.status === "escalated").length, color: "red" },
            { label: "Resolved", count: tickets.filter((t) => ["resolved", "closed"].includes(t.status)).length, color: "green" },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-lg border border-${stat.color}-200 bg-${stat.color}-50 p-4`}>
              <p className="text-2xl font-bold text-slate-900">{stat.count}</p>
              <p className={`text-sm text-${stat.color}-700`}>{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search tickets..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm focus:border-cyan-500 focus:outline-none" />
          </div>
          <div className="flex gap-3">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:border-cyan-500 focus:outline-none">
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="escalated">Escalated</option>
              <option value="resolved">Resolved</option>
            </select>
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:border-cyan-500 focus:outline-none">
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        <DataTable columns={columns} data={tickets} loading={loading} emptyMessage="No tickets found" />
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} totalCount={50} pageSize={20} />
      </div>

      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Ticket Details" size="lg"
        footer={<><Button variant="outline" onClick={() => setShowDetailModal(false)}>Close</Button>{selectedTicket && !["resolved", "closed"].includes(selectedTicket.status) && <><Button variant="secondary">Assign</Button><Button icon={CheckCircle} onClick={handleResolve}>Resolve</Button></>}</>}>
        {selectedTicket && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white">{getInitials(selectedTicket.profile?.name)}</div>
                <div><p className="font-medium text-slate-900">{selectedTicket.profile?.name}</p><p className="text-sm text-slate-500">{selectedTicket.profile?.email}</p></div>
              </div>
              <span className={`rounded-full px-3 py-1 text-sm font-medium ${selectedTicket.priority === "urgent" ? "bg-red-100 text-red-700" : selectedTicket.priority === "high" ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-700"}`}>{selectedTicket.priority} priority</span>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <h3 className="font-semibold text-slate-900">{selectedTicket.subject}</h3>
              <p className="mt-2 text-slate-600">{selectedTicket.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-slate-500">Category</p><p className="font-medium text-slate-900">{selectedTicket.category}</p></div>
              <div><p className="text-slate-500">Status</p><p className="font-medium text-slate-900 capitalize">{selectedTicket.status.replace("_", " ")}</p></div>
              <div><p className="text-slate-500">Created</p><p className="font-medium text-slate-900">{formatDateTime(selectedTicket.created_at)}</p></div>
              {selectedTicket.resolved_at && <div><p className="text-slate-500">Resolved</p><p className="font-medium text-slate-900">{formatDateTime(selectedTicket.resolved_at)}</p></div>}
            </div>

            {selectedTicket.status !== "resolved" && selectedTicket.status !== "closed" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Resolution Notes</label>
                <textarea value={resolutionNotes} onChange={(e) => setResolutionNotes(e.target.value)} placeholder="Enter resolution notes..."
                  className="h-24 w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-cyan-500 focus:outline-none" />
              </div>
            )}

            {selectedTicket.resolution_notes && (
              <div className="rounded-lg bg-green-50 p-4 border border-green-200">
                <p className="font-medium text-green-700">Resolution</p>
                <p className="mt-1 text-sm text-green-600">{selectedTicket.resolution_notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </MainLayout>
  );
}
