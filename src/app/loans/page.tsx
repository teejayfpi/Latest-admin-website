"use client";

import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DataTable } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { formatCurrency, formatDate, getInitials, timeAgo } from "@/lib/utils";
import { Search, CheckCircle, XCircle, Eye, DollarSign, Clock, TrendingUp, AlertTriangle } from "lucide-react";
import type { Loan, Profile } from "@/types";

interface LoanWithProfile extends Loan {
  profile?: Profile;
}

const loanTypes = ["Quick Loan", "Term Loan", "Emergency Loan", "Business Loan", "Salary Advance"];

export default function LoansPage() {
  const [loans, setLoans] = useState<LoanWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedLoan, setSelectedLoan] = useState<LoanWithProfile | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailModalLoading, setDetailModalLoading] = useState(false);
  const [actionModal, setActionModal] = useState<{ type: "approve" | "reject" | "disburse"; loan: LoanWithProfile } | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    const fetchLoans = async () => {
      setLoading(true);
      try {
        const { getLoans } = await import("@/lib/db-service");
        const response = await getLoans({
          status: statusFilter || undefined,
          type: typeFilter || undefined,
          search: search || undefined,
          page,
          pageSize: 20,
        });
        
        setLoans(response.data as LoanWithProfile[]);
        setTotalPages(response.totalPages);
        setTotalCount(response.count);
      } catch (error) {
        console.error("Error fetching loans:", error);
        setLoans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, [statusFilter, typeFilter, search, page]);

  // Fetch full loan details when opening modal
  const handleOpenLoanDetail = async (loan: LoanWithProfile) => {
    setDetailModalLoading(true);
    setSelectedLoan(loan);
    setShowDetailModal(true);
    try {
      const { getLoanById } = await import("@/lib/db-service");
      const fullLoan = await getLoanById(loan.id);
      if (fullLoan) {
        setSelectedLoan(fullLoan as LoanWithProfile);
      }
    } catch (error) {
      console.error("Error fetching loan details:", error);
    } finally {
      setDetailModalLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!actionModal) return;
    try {
      const { updateLoanStatus } = await import("@/lib/db-service");
      await updateLoanStatus(actionModal.loan.id, "approved");
      setLoans((prev) => prev.map((l) => l.id === actionModal.loan.id ? { ...l, status: "approved" as any, approval_date: new Date().toISOString() } : l));
      setActionModal(null);
    } catch (error) {
      console.error("Error approving loan:", error);
    }
  };

  const handleDisburse = async () => {
    if (!actionModal) return;
    try {
      const { updateLoanStatus } = await import("@/lib/db-service");
      await updateLoanStatus(actionModal.loan.id, "disbursed");
      setLoans((prev) => prev.map((l) => l.id === actionModal.loan.id ? { ...l, status: "disbursed" as any, disbursement_date: new Date().toISOString(), amount_disbursed: actionModal.loan.principal_amount, outstanding_balance: actionModal.loan.total_repayment } : l));
      setActionModal(null);
    } catch (error) {
      console.error("Error disbursing loan:", error);
    }
  };

  const handleReject = async () => {
    if (!actionModal) return;
    try {
      const { updateLoanStatus } = await import("@/lib/db-service");
      await updateLoanStatus(actionModal.loan.id, "rejected", rejectionReason);
      setLoans((prev) => prev.map((l) => l.id === actionModal.loan.id ? { ...l, status: "rejected" as any, rejection_reason: rejectionReason } : l));
      setActionModal(null);
      setRejectionReason("");
    } catch (error) {
      console.error("Error rejecting loan:", error);
    }
  };

  const columns = [
    {
      key: "user",
      header: "Borrower",
      render: (loan: LoanWithProfile) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white">
            {getInitials(loan.profile?.name)}
          </div>
          <div>
            <p className="font-medium text-slate-900">{loan.profile?.name || "N/A"}</p>
            <p className="text-xs text-slate-500">{loan.profile?.user_id}</p>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Loan Type",
      render: (loan: LoanWithProfile) => <span className="text-slate-600">{loan.loan_type}</span>,
    },
    {
      key: "amount",
      header: "Principal",
      render: (loan: LoanWithProfile) => <span className="font-medium text-slate-900">{formatCurrency(loan.principal_amount)}</span>,
    },
    {
      key: "repayment",
      header: "Monthly",
      render: (loan: LoanWithProfile) => <span className="text-slate-600">{formatCurrency(loan.monthly_repayment)}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (loan: LoanWithProfile) => {
        const config: Record<string, { label: string; class: string; icon: any }> = {
          pending: { label: "Pending", class: "bg-yellow-100 text-yellow-700", icon: Clock },
          approved: { label: "Approved", class: "bg-blue-100 text-blue-700", icon: CheckCircle },
          disbursed: { label: "Disbursed", class: "bg-purple-100 text-purple-700", icon: DollarSign },
          active: { label: "Active", class: "bg-green-100 text-green-700", icon: TrendingUp },
          completed: { label: "Completed", class: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
          rejected: { label: "Rejected", class: "bg-red-100 text-red-700", icon: XCircle },
          defaulted: { label: "Defaulted", class: "bg-red-100 text-red-700", icon: AlertTriangle },
        };
        const { label, class: className, icon: Icon } = config[loan.status] || config.pending;
        return (
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
            <Icon className="h-3 w-3" />
            {label}
          </span>
        );
      },
    },
    {
      key: "balance",
      header: "Outstanding",
      render: (loan: LoanWithProfile) => (
        <span className={`font-medium ${loan.outstanding_balance > 0 ? "text-slate-900" : "text-green-600"}`}>
          {formatCurrency(loan.outstanding_balance)}
        </span>
      ),
    },
    {
      key: "date",
      header: "Applied",
      render: (loan: LoanWithProfile) => <span className="text-slate-500 text-sm">{timeAgo(loan.application_date)}</span>,
    },
    {
      key: "actions",
      header: "",
      render: (loan: LoanWithProfile) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleOpenLoanDetail(loan)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <Eye className="h-4 w-4" />
          </button>
          {loan.status === "pending" && (
            <>
              <button onClick={() => setActionModal({ type: "approve", loan })} className="rounded-lg p-2 text-green-600 hover:bg-green-50">
                <CheckCircle className="h-4 w-4" />
              </button>
              <button onClick={() => setActionModal({ type: "reject", loan })} className="rounded-lg p-2 text-red-600 hover:bg-red-50">
                <XCircle className="h-4 w-4" />
              </button>
            </>
          )}
          {loan.status === "approved" && (
            <button onClick={() => setActionModal({ type: "disburse", loan })} className="rounded-lg p-2 text-purple-600 hover:bg-purple-50">
              <DollarSign className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <MainLayout title="Loans Management" subtitle="Review, approve, and manage all loan applications">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {[
            { label: "Pending", count: loans.filter((l) => l.status === "pending").length, color: "yellow" },
            { label: "Approved", count: loans.filter((l) => l.status === "approved").length, color: "blue" },
            { label: "Disbursed", count: loans.filter((l) => ["disbursed", "active"].includes(l.status)).length, color: "purple" },
            { label: "Completed", count: loans.filter((l) => l.status === "completed").length, color: "green" },
            { label: "Defaulted", count: loans.filter((l) => l.status === "defaulted").length, color: "red" },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-lg border border-${stat.color}-200 bg-${stat.color}-50 p-4`}>
              <p className="text-2xl font-bold text-slate-900">{stat.count}</p>
              <p className={`text-sm text-${stat.color}-700`}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search by name or loan ID..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm focus:border-cyan-500 focus:outline-none" />
          </div>
          <div className="flex gap-3">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:border-cyan-500 focus:outline-none">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="disbursed">Disbursed</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:border-cyan-500 focus:outline-none">
              <option value="">All Types</option>
              {loanTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        <DataTable columns={columns} data={loans} loading={loading} emptyMessage="No loans found" />
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} totalCount={totalCount} pageSize={20} />
      </div>

      {/* Detail Modal */}
      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Loan Details" size="lg"
        footer={<><Button variant="outline" onClick={() => setShowDetailModal(false)}>Close</Button></>}>
        {detailModalLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-200 border-t-cyan-600"></div>
          </div>
        )}
        {!detailModalLoading && selectedLoan && selectedLoan.profile && (
          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-lg font-bold text-white">
                  {getInitials(selectedLoan.profile.name)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{selectedLoan.profile.name}</h3>
                  <p className="text-sm text-slate-500">{selectedLoan.profile.email}</p>
                </div>
              </div>
              <span className={`rounded-full px-3 py-1 text-sm font-medium ${selectedLoan.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                {selectedLoan.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Principal Amount</p>
                <p className="text-lg font-bold text-slate-900">{formatCurrency(selectedLoan.principal_amount)}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Interest Rate</p>
                <p className="text-lg font-bold text-slate-900">{selectedLoan.interest_rate}%</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Tenure</p>
                <p className="text-lg font-bold text-slate-900">{selectedLoan.tenure_months} months</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Monthly Repayment</p>
                <p className="text-lg font-bold text-slate-900">{formatCurrency(selectedLoan.monthly_repayment)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Total Repayment</p>
                <p className="text-lg font-bold text-slate-900">{formatCurrency(selectedLoan.total_repayment)}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Disbursed</p>
                <p className="text-lg font-bold text-slate-900">{formatCurrency(selectedLoan.amount_disbursed)}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Outstanding</p>
                <p className="text-lg font-bold text-slate-900">{formatCurrency(selectedLoan.outstanding_balance)}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Loan Type</p>
                <p className="text-lg font-bold text-slate-900">{selectedLoan.loan_type}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-slate-500">Application Date</p>
                <p className="font-medium text-slate-900">{formatDate(selectedLoan.application_date)}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-slate-500">Maturity Date</p>
                <p className="font-medium text-slate-900">{selectedLoan.maturity_date ? formatDate(selectedLoan.maturity_date) : "N/A"}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Action Modals */}
      <Modal isOpen={actionModal?.type === "approve"} onClose={() => setActionModal(null)} title="Approve Loan" size="sm"
        footer={<><Button variant="outline" onClick={() => setActionModal(null)}>Cancel</Button><Button icon={CheckCircle} onClick={handleApprove}>Approve</Button></>}>
        <p className="text-slate-600">Approve this loan of <span className="font-medium">{formatCurrency(actionModal?.loan.principal_amount || 0)}</span> for <span className="font-medium">{actionModal?.loan.profile?.name}</span>?</p>
      </Modal>

      <Modal isOpen={actionModal?.type === "disburse"} onClose={() => setActionModal(null)} title="Disburse Loan" size="sm"
        footer={<><Button variant="outline" onClick={() => setActionModal(null)}>Cancel</Button><Button icon={DollarSign} onClick={handleDisburse}>Disburse Funds</Button></>}>
        <p className="text-slate-600">Disburse <span className="font-medium">{formatCurrency(actionModal?.loan.principal_amount || 0)}</span> to <span className="font-medium">{actionModal?.loan.profile?.name}</span>?</p>
      </Modal>

      <Modal isOpen={actionModal?.type === "reject"} onClose={() => setActionModal(null)} title="Reject Loan" size="md"
        footer={<><Button variant="outline" onClick={() => setActionModal(null)}>Cancel</Button><Button variant="danger" onClick={handleReject}>Reject</Button></>}>
        <p className="mb-4 text-slate-600">Please provide a reason for rejection.</p>
        <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)}
          placeholder="Enter rejection reason..."
          className="h-32 w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-cyan-500 focus:outline-none" />
      </Modal>
    </MainLayout>
  );
}
