"use client";

import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DataTable } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { formatCurrency, formatDate, formatDateTime, getInitials, timeAgo } from "@/lib/utils";
import { Search, CheckCircle, XCircle, Eye, Clock, Image, DollarSign, FileText } from "lucide-react";
import toast from "react-hot-toast";

interface DepositRequest {
  id: string;
  profile_id: string;
  amount: number;
  currency: string;
  payment_type: string;
  payment_method: string;
  status: "pending" | "under_review" | "verified" | "rejected";
  payment_date: string;
  receiving_bank: string;
  bank_account_name: string;
  bank_account_number: string;
  transaction_reference: string;
  proof_url: string;
  proof_type: string;
  original_filename: string;
  rejection_reason: string;
  admin_notes: string;
  member_note: string;
  approved_at: string;
  approved_by: string;
  created_at: string;
  updated_at: string;
  profile?: { id: string; name: string; email: string; user_id: string };
}

export default function DepositsPage() {
  const [deposits, setDeposits] = useState<DepositRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDeposit, setSelectedDeposit] = useState<DepositRequest | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [actionModal, setActionModal] = useState<{ type: "approve" | "reject" | "review"; deposit: DepositRequest } | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchDeposits = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      const mockDeposits: DepositRequest[] = [
        { id: "dep-1", profile_id: "1", amount: 50000, currency: "NGN", payment_type: "monthly_contribution", payment_method: "bank_transfer", status: "pending", payment_date: "2024-06-15T10:00:00Z", receiving_bank: "First Bank of Nigeria", bank_account_name: "Coopvest Africa", bank_account_number: "3014567890", transaction_reference: "TRX-2024-001234", proof_url: "/proof-1.jpg", proof_type: "image/jpeg", original_filename: "transfer-receipt.jpg", rejection_reason: "", admin_notes: "", member_note: "Monthly contribution for June 2024", approved_at: "", approved_by: "", created_at: "2024-06-15T10:30:00Z", updated_at: "2024-06-15T10:30:00Z", profile: { id: "1", name: "Adebayo Johnson", email: "adebayo@email.com", user_id: "USR-001" } },
        { id: "dep-2", profile_id: "2", amount: 100000, currency: "NGN", payment_type: "monthly_contribution", payment_method: "bank_transfer", status: "under_review", payment_date: "2024-06-14T14:00:00Z", receiving_bank: "GTBank", bank_account_name: "Coopvest Africa", bank_account_number: "2045678901", transaction_reference: "TRX-2024-001233", proof_url: "/proof-2.jpg", proof_type: "image/jpeg", original_filename: "screenshot.jpg", rejection_reason: "", admin_notes: "Reviewing proof of payment", member_note: "Contribution for Q2 2024", approved_at: "", approved_by: "", created_at: "2024-06-14T14:30:00Z", updated_at: "2024-06-15T09:00:00Z", profile: { id: "2", name: "Fatima Ibrahim", email: "fatima@email.com", user_id: "USR-002" } },
        { id: "dep-3", profile_id: "3", amount: 25000, currency: "NGN", payment_type: "registration_fee", payment_method: "ussd", status: "verified", payment_date: "2024-06-13T11:00:00Z", receiving_bank: "UBA", bank_account_name: "Coopvest Africa", bank_account_number: "2089012345", transaction_reference: "TRX-2024-001232", proof_url: "", proof_type: "", original_filename: "", rejection_reason: "", admin_notes: "Auto-verified via USSD", member_note: "New member registration fee", approved_at: "2024-06-13T11:05:00Z", approved_by: "system", created_at: "2024-06-13T11:00:00Z", updated_at: "2024-06-13T11:05:00Z", profile: { id: "3", name: "Olumide Adeyemi", email: "olumide@email.com", user_id: "USR-003" } },
        { id: "dep-4", profile_id: "4", amount: 75000, currency: "NGN", payment_type: "loan_repayment", payment_method: "bank_transfer", status: "rejected", payment_date: "2024-06-12T16:00:00Z", receiving_bank: "Access Bank", bank_account_name: "Coopvest Africa", bank_account_number: "2123456789", transaction_reference: "TRX-2024-001231", proof_url: "/proof-4.jpg", proof_type: "image/jpeg", original_filename: "bank-slip.jpg", rejection_reason: "Transaction amount does not match loan repayment schedule. Expected ₦54,000.", admin_notes: "Incorrect amount - partial payment not accepted", member_note: "Loan repayment installment", approved_at: "", approved_by: "", created_at: "2024-06-12T16:30:00Z", updated_at: "2024-06-13T10:00:00Z", profile: { id: "4", name: "Chinedu Okonkwo", email: "chinedu@email.com", user_id: "USR-004" } },
        { id: "dep-5", profile_id: "5", amount: 150000, currency: "NGN", payment_type: "investment", payment_method: "bank_transfer", status: "pending", payment_date: "2024-06-15T08:00:00Z", receiving_bank: "First Bank of Nigeria", bank_account_name: "Coopvest Africa", bank_account_number: "3014567890", transaction_reference: "TRX-2024-001235", proof_url: "/proof-5.jpg", proof_type: "image/jpeg", original_filename: "investment-deposit.jpg", rejection_reason: "", admin_notes: "", member_note: "Investment pool contribution", approved_at: "", approved_by: "", created_at: "2024-06-15T08:30:00Z", updated_at: "2024-06-15T08:30:00Z", profile: { id: "5", name: "Aisha Mohammed", email: "aisha@email.com", user_id: "USR-005" } },
      ];
      setDeposits(mockDeposits);
      setTotalPages(5);
      setLoading(false);
    };
    fetchDeposits();
  }, [search, statusFilter, typeFilter, page]);

  const handleApprove = async () => {
    if (!actionModal) return;
    setProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setDeposits((prev) => prev.map((d) => d.id === actionModal.deposit.id ? { ...d, status: "verified" as const, admin_notes: adminNotes, approved_at: new Date().toISOString(), approved_by: "admin" } : d));
    setActionModal(null);
    setAdminNotes("");
    setProcessing(false);
    toast.success("Deposit approved and wallet credited!");
  };

  const handleReject = async () => {
    if (!actionModal) return;
    setProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setDeposits((prev) => prev.map((d) => d.id === actionModal.deposit.id ? { ...d, status: "rejected" as const, rejection_reason: adminNotes } : d));
    setActionModal(null);
    setAdminNotes("");
    setProcessing(false);
    toast.success("Deposit rejected");
  };

  const handleMarkReview = async () => {
    if (!actionModal) return;
    setProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setDeposits((prev) => prev.map((d) => d.id === actionModal.deposit.id ? { ...d, status: "under_review" as const, admin_notes: adminNotes } : d));
    setActionModal(null);
    setAdminNotes("");
    setProcessing(false);
    toast.success("Marked as under review");
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; color: string; bg: string; icon: any }> = {
      pending: { label: "Pending", color: "text-yellow-600", bg: "bg-yellow-100", icon: Clock },
      under_review: { label: "Under Review", color: "text-blue-600", bg: "bg-blue-100", icon: FileText },
      verified: { label: "Verified", color: "text-green-600", bg: "bg-green-100", icon: CheckCircle },
      rejected: { label: "Rejected", color: "text-red-600", bg: "bg-red-100", icon: XCircle },
    };
    return configs[status] || configs.pending;
  };

  const getPaymentTypeLabel = (type: string) => {
    const labels: Record<string, string> = { monthly_contribution: "Monthly Contribution", loan_repayment: "Loan Repayment", registration_fee: "Registration Fee", investment: "Investment", other: "Other" };
    return labels[type] || type;
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = { bank_transfer: "Bank Transfer", ussd: "USSD", pos: "POS", cash_deposit: "Cash Deposit", card: "Card" };
    return labels[method] || method;
  };

  const totalPending = deposits.filter((d) => d.status === "pending").length;
  const totalUnderReview = deposits.filter((d) => d.status === "under_review").length;
  const totalVerified = deposits.filter((d) => d.status === "verified").length;
  const totalRejected = deposits.filter((d) => d.status === "rejected").length;
  const pendingAmount = deposits.filter((d) => d.status === "pending" || d.status === "under_review").reduce((acc, d) => acc + d.amount, 0);

  const columns = [
    { key: "user", header: "Member", render: (deposit: DepositRequest) => (
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white">{getInitials(deposit.profile?.name || "")}</div>
        <div><p className="font-medium text-slate-900">{deposit.profile?.name || "N/A"}</p><p className="text-xs text-slate-500">{deposit.profile?.user_id || ""}</p></div>
      </div>
    )},
    { key: "amount", header: "Amount", render: (deposit: DepositRequest) => <span className="font-semibold text-slate-900">{formatCurrency(deposit.amount)}</span> },
    { key: "payment_type", header: "Type", render: (deposit: DepositRequest) => <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">{getPaymentTypeLabel(deposit.payment_type)}</span> },
    { key: "payment_method", header: "Method", render: (deposit: DepositRequest) => <span className="text-slate-600">{getPaymentMethodLabel(deposit.payment_method)}</span> },
    { key: "reference", header: "Reference", render: (deposit: DepositRequest) => <span className="font-mono text-sm text-slate-600">{deposit.transaction_reference || "N/A"}</span> },
    { key: "status", header: "Status", render: (deposit: DepositRequest) => {
      const config = getStatusConfig(deposit.status);
      return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.color}`}><config.icon className="h-3 w-3" />{config.label}</span>;
    }},
    { key: "proof", header: "Proof", render: (deposit: DepositRequest) => deposit.proof_url ? <button className="rounded-lg bg-cyan-50 p-2 text-cyan-600 hover:bg-cyan-100"><Image className="h-4 w-4" /></button> : <span className="text-slate-400">-</span> },
    { key: "date", header: "Submitted", render: (deposit: DepositRequest) => <span className="text-sm text-slate-500">{timeAgo(deposit.created_at)}</span> },
    { key: "actions", header: "", render: (deposit: DepositRequest) => (
      <div className="flex items-center gap-2">
        <button onClick={() => { setSelectedDeposit(deposit); setShowDetailModal(true); }} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"><Eye className="h-4 w-4" /></button>
        {(deposit.status === "pending" || deposit.status === "under_review") && (
          <>
            {deposit.status === "pending" && <button onClick={() => setActionModal({ type: "review", deposit })} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"><FileText className="h-4 w-4" /></button>}
            <button onClick={() => setActionModal({ type: "approve", deposit })} className="rounded-lg p-2 text-green-600 hover:bg-green-50"><CheckCircle className="h-4 w-4" /></button>
            <button onClick={() => setActionModal({ type: "reject", deposit })} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><XCircle className="h-4 w-4" /></button>
          </>
        )}
      </div>
    )},
  ];

  return (
    <MainLayout title="Deposits Management" subtitle="Review and manage deposit requests from members">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center gap-3"><div className="rounded-full bg-slate-100 p-2"><DollarSign className="h-5 w-5 text-slate-600" /></div><div><p className="text-2xl font-bold text-slate-900">{deposits.length}</p><p className="text-xs text-slate-500">Total Deposits</p></div></div></div>
          <div className="rounded-xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 p-4"><div className="flex items-center gap-3"><div className="rounded-full bg-yellow-100 p-2"><Clock className="h-5 w-5 text-yellow-600" /></div><div><p className="text-2xl font-bold text-slate-900">{totalPending}</p><p className="text-xs text-yellow-700">Pending</p></div></div></div>
          <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4"><div className="flex items-center gap-3"><div className="rounded-full bg-blue-100 p-2"><FileText className="h-5 w-5 text-blue-600" /></div><div><p className="text-2xl font-bold text-slate-900">{totalUnderReview}</p><p className="text-xs text-blue-700">Under Review</p></div></div></div>
          <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-4"><div className="flex items-center gap-3"><div className="rounded-full bg-green-100 p-2"><CheckCircle className="h-5 w-5 text-green-600" /></div><div><p className="text-2xl font-bold text-slate-900">{totalVerified}</p><p className="text-xs text-green-700">Verified</p></div></div></div>
          <div className="rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-rose-50 p-4"><div className="flex items-center gap-3"><div className="rounded-full bg-red-100 p-2"><XCircle className="h-5 w-5 text-red-600" /></div><div><p className="text-2xl font-bold text-slate-900">{totalRejected}</p><p className="text-xs text-red-700">Rejected</p></div></div></div>
          <div className="rounded-xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50 p-4"><div className="flex items-center gap-3"><div className="rounded-full bg-cyan-100 p-2"><DollarSign className="h-5 w-5 text-cyan-600" /></div><div><p className="text-xl font-bold text-slate-900">{formatCurrency(pendingAmount)}</p><p className="text-xs text-cyan-700">Pending Amount</p></div></div></div>
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="Search by name, reference..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm focus:border-cyan-500 focus:outline-none" /></div>
          <div className="flex gap-3">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"><option value="">All Status</option><option value="pending">Pending</option><option value="under_review">Under Review</option><option value="verified">Verified</option><option value="rejected">Rejected</option></select>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"><option value="">All Types</option><option value="monthly_contribution">Monthly Contribution</option><option value="loan_repayment">Loan Repayment</option><option value="registration_fee">Registration Fee</option><option value="investment">Investment</option></select>
          </div>
        </div>

        <DataTable columns={columns} data={deposits} loading={loading} emptyMessage="No deposit requests found" />
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} totalCount={100} pageSize={20} />
      </div>

      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Deposit Details" size="lg"
        footer={<><Button variant="outline" onClick={() => setShowDetailModal(false)}>Close</Button></>}>
        {selectedDeposit && (
          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
              <div className="flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-xl font-bold text-white">{getInitials(selectedDeposit.profile?.name || "")}</div><div><h3 className="text-lg font-bold text-slate-900">{selectedDeposit.profile?.name || "Unknown"}</h3><p className="text-slate-500">{selectedDeposit.profile?.email || ""}</p><p className="text-sm text-slate-400">ID: {selectedDeposit.profile?.user_id || ""}</p></div></div>
              <div className="text-right"><p className="text-3xl font-bold text-slate-900">{formatCurrency(selectedDeposit.amount)}</p><span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${getStatusConfig(selectedDeposit.status).bg} ${getStatusConfig(selectedDeposit.status).color}`}>{getStatusConfig(selectedDeposit.status).label}</span></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3"><h4 className="font-semibold text-slate-900">Payment Information</h4><div className="rounded-lg bg-slate-50 p-3 space-y-2 text-sm"><div className="flex justify-between"><span className="text-slate-500">Type</span><span className="font-medium">{getPaymentTypeLabel(selectedDeposit.payment_type)}</span></div><div className="flex justify-between"><span className="text-slate-500">Method</span><span className="font-medium">{getPaymentMethodLabel(selectedDeposit.payment_method)}</span></div><div className="flex justify-between"><span className="text-slate-500">Reference</span><span className="font-mono font-medium">{selectedDeposit.transaction_reference}</span></div><div className="flex justify-between"><span className="text-slate-500">Date</span><span className="font-medium">{formatDate(selectedDeposit.payment_date)}</span></div></div></div>
              <div className="space-y-3"><h4 className="font-semibold text-slate-900">Bank Details</h4><div className="rounded-lg bg-slate-50 p-3 space-y-2 text-sm"><div className="flex justify-between"><span className="text-slate-500">Bank</span><span className="font-medium">{selectedDeposit.receiving_bank}</span></div><div className="flex justify-between"><span className="text-slate-500">Account Name</span><span className="font-medium">{selectedDeposit.bank_account_name}</span></div><div className="flex justify-between"><span className="text-slate-500">Account Number</span><span className="font-mono font-medium">{selectedDeposit.bank_account_number}</span></div></div></div>
            </div>
            {selectedDeposit.member_note && <div className="rounded-lg bg-blue-50 p-4 border border-blue-200"><p className="text-sm font-medium text-blue-700">Member's Note</p><p className="mt-1 text-sm text-slate-700">{selectedDeposit.member_note}</p></div>}
            {selectedDeposit.status === "rejected" && selectedDeposit.rejection_reason && <div className="rounded-lg bg-red-50 p-4 border border-red-200"><p className="text-sm font-medium text-red-700">Rejection Reason</p><p className="mt-1 text-sm text-slate-700">{selectedDeposit.rejection_reason}</p></div>}
            {selectedDeposit.proof_url && <div className="space-y-2"><h4 className="font-semibold text-slate-900">Payment Proof</h4><div className="flex items-center gap-4 rounded-lg border border-slate-200 p-3"><div className="h-20 w-32 rounded-lg bg-slate-100 flex items-center justify-center"><Image className="h-8 w-8 text-slate-400" /></div><div><p className="font-medium text-slate-900">{selectedDeposit.original_filename || "Proof of payment"}</p><p className="text-sm text-slate-500">Click to view full image</p></div></div></div>}
          </div>
        )}
      </Modal>

      <Modal isOpen={actionModal?.type === "approve"} onClose={() => { setActionModal(null); setAdminNotes(""); }} title="Approve Deposit" size="md"
        footer={<><Button variant="outline" onClick={() => { setActionModal(null); setAdminNotes(""); }}>Cancel</Button><Button icon={CheckCircle} loading={processing} onClick={handleApprove}>Approve & Credit</Button></>}>
        <div className="space-y-4"><div className="rounded-lg bg-green-50 p-4 border border-green-200"><p className="font-medium text-green-800">Confirm Deposit Approval</p><p className="mt-1 text-sm text-green-700">Approving <strong>{formatCurrency(actionModal?.deposit?.amount || 0)}</strong> from <strong>{actionModal?.deposit?.profile?.name || "Unknown"}</strong></p></div><div><label className="block text-sm font-medium text-slate-700">Admin Notes</label><textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} placeholder="Add notes..." className="mt-1 h-24 w-full rounded-lg border border-slate-200 p-3 text-sm" /></div></div>
      </Modal>

      <Modal isOpen={actionModal?.type === "reject"} onClose={() => { setActionModal(null); setAdminNotes(""); }} title="Reject Deposit" size="md"
        footer={<><Button variant="outline" onClick={() => { setActionModal(null); setAdminNotes(""); }}>Cancel</Button><Button variant="danger" icon={XCircle} loading={processing} onClick={handleReject}>Reject</Button></>}>
        <div className="space-y-4"><div className="rounded-lg bg-red-50 p-4 border border-red-200"><p className="font-medium text-red-800">Confirm Rejection</p><p className="mt-1 text-sm text-red-700">Rejecting <strong>{formatCurrency(actionModal?.deposit?.amount || 0)}</strong> from <strong>{actionModal?.deposit?.profile?.name || "Unknown"}</strong></p></div><div><label className="block text-sm font-medium text-slate-700">Rejection Reason <span className="text-red-500">*</span></label><textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} placeholder="Explain why..." className="mt-1 h-24 w-full rounded-lg border border-slate-200 p-3 text-sm" required /></div></div>
      </Modal>

      <Modal isOpen={actionModal?.type === "review"} onClose={() => { setActionModal(null); setAdminNotes(""); }} title="Mark for Review" size="md"
        footer={<><Button variant="outline" onClick={() => { setActionModal(null); setAdminNotes(""); }}>Cancel</Button><Button variant="secondary" icon={FileText} loading={processing} onClick={handleMarkReview}>Mark as Under Review</Button></>}>
        <div className="space-y-4"><div className="rounded-lg bg-blue-50 p-4 border border-blue-200"><p className="font-medium text-blue-800">Mark for Review</p><p className="mt-1 text-sm text-blue-700">This will notify the system that you're actively reviewing this deposit.</p></div><div><label className="block text-sm font-medium text-slate-700">Notes</label><textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} placeholder="Add notes..." className="mt-1 h-24 w-full rounded-lg border border-slate-200 p-3 text-sm" /></div></div>
      </Modal>
    </MainLayout>
  );
}
