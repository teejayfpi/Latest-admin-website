"use client";

import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DataTable } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { formatCurrency, formatDateTime, getInitials } from "@/lib/utils";
import { Search, ArrowDownLeft, ArrowUpRight, CreditCard, RefreshCw, DollarSign, Filter } from "lucide-react";
import type { Transaction, Profile } from "@/types";

interface TransactionWithProfile extends Transaction {
  profile?: Profile;
}

const transactionTypes = [
  { value: "deposit", label: "Deposit", icon: ArrowDownLeft, color: "text-green-600", bg: "bg-green-100" },
  { value: "withdrawal", label: "Withdrawal", icon: ArrowUpRight, color: "text-red-600", bg: "bg-red-100" },
  { value: "loan_disbursement", label: "Loan Disbursement", icon: CreditCard, color: "text-purple-600", bg: "bg-purple-100" },
  { value: "loan_repayment", label: "Loan Repayment", icon: RefreshCw, color: "text-blue-600", bg: "bg-blue-100" },
  { value: "savings", label: "Savings", icon: DollarSign, color: "text-cyan-600", bg: "bg-cyan-100" },
  { value: "transfer", label: "Transfer", icon: RefreshCw, color: "text-orange-600", bg: "bg-orange-100" },
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockTransactions: TransactionWithProfile[] = [
        { id: "tx-1", profile_id: "1", wallet_id: "w1", type: "deposit", amount: 50000, balance_before: 195000, balance_after: 245000, status: "completed", reference: "TXN-001234", description: "Monthly contribution", metadata: {}, processed_at: "2024-06-15T10:00:00Z", created_at: "2024-06-15T10:00:00Z", profile: { id: "1", user_id: "USR-001", email: "adebayo@email.com", phone: "+2348012345678", name: "Adebayo Johnson", role: "member", is_active: true, is_flagged: false, flagged_reason: null, kyc_verified: true, department: null, access_level: null, mfa_enabled: false, created_at: "", updated_at: "" } },
        { id: "tx-2", profile_id: "2", wallet_id: "w2", type: "withdrawal", amount: 25000, balance_before: 114000, balance_after: 89000, status: "completed", reference: "TXN-001235", description: "ATM withdrawal", metadata: {}, processed_at: "2024-06-15T09:30:00Z", created_at: "2024-06-15T09:30:00Z", profile: { id: "2", user_id: "USR-002", email: "fatima@email.com", phone: "+2348098765432", name: "Fatima Ibrahim", role: "member", is_active: true, is_flagged: false, flagged_reason: null, kyc_verified: true, department: null, access_level: null, mfa_enabled: true, created_at: "", updated_at: "" } },
        { id: "tx-3", profile_id: "1", wallet_id: "w1", type: "loan_disbursement", amount: 500000, balance_before: 245000, balance_after: 745000, status: "completed", reference: "TXN-001236", description: "Quick Loan disbursement", metadata: {}, processed_at: "2024-06-03T16:00:00Z", created_at: "2024-06-03T16:00:00Z", profile: { id: "1", user_id: "USR-001", email: "adebayo@email.com", phone: "+2348012345678", name: "Adebayo Johnson", role: "member", is_active: true, is_flagged: false, flagged_reason: null, kyc_verified: true, department: null, access_level: null, mfa_enabled: false, created_at: "", updated_at: "" } },
        { id: "tx-4", profile_id: "3", wallet_id: "w3", type: "savings", amount: 15000, balance_before: 60000, balance_after: 75000, status: "completed", reference: "TXN-001237", description: "Savings contribution", metadata: {}, processed_at: "2024-06-14T14:00:00Z", created_at: "2024-06-14T14:00:00Z", profile: { id: "3", user_id: "USR-003", email: "olumide@email.com", phone: "+2348055551234", name: "Olumide Adeyemi", role: "member", is_active: true, is_flagged: false, flagged_reason: null, kyc_verified: true, department: null, access_level: null, mfa_enabled: false, created_at: "", updated_at: "" } },
        { id: "tx-5", profile_id: "4", wallet_id: "w4", type: "deposit", amount: 100000, balance_before: 0, balance_after: 100000, status: "pending", reference: "TXN-001238", description: "Initial deposit", metadata: {}, processed_at: null, created_at: "2024-06-15T11:00:00Z", profile: { id: "4", user_id: "USR-004", email: "chinedu@email.com", phone: "+2348166667890", name: "Chinedu Okonkwo", role: "member", is_active: true, is_flagged: false, flagged_reason: null, kyc_verified: true, department: null, access_level: null, mfa_enabled: true, created_at: "", updated_at: "" } },
        { id: "tx-6", profile_id: "5", wallet_id: "w5", type: "loan_repayment", amount: 137500, balance_before: 192500, balance_after: 55000, status: "completed", reference: "TXN-001239", description: "Loan repayment - June", metadata: {}, processed_at: "2024-06-03T08:00:00Z", created_at: "2024-06-03T08:00:00Z", profile: { id: "5", user_id: "USR-005", email: "aisha@email.com", phone: "+2348033334567", name: "Aisha Mohammed", role: "member", is_active: true, is_flagged: false, flagged_reason: null, kyc_verified: true, department: null, access_level: null, mfa_enabled: false, created_at: "", updated_at: "" } },
      ];

      setTransactions(mockTransactions);
      setTotalPages(10);
      setLoading(false);
    };

    fetchTransactions();
  }, [typeFilter, statusFilter, search, page]);

  const getTypeConfig = (type: string) => transactionTypes.find((t) => t.value === type) || transactionTypes[0];

  const columns = [
    {
      key: "reference",
      header: "Reference",
      render: (tx: TransactionWithProfile) => (
        <div>
          <p className="font-mono text-sm font-medium text-slate-900">{tx.reference}</p>
          <p className="text-xs text-slate-500">{tx.type.replace(/_/g, " ")}</p>
        </div>
      ),
    },
    {
      key: "user",
      header: "User",
      render: (tx: TransactionWithProfile) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-bold text-white">
            {getInitials(tx.profile?.name)}
          </div>
          <span className="text-sm text-slate-900">{tx.profile?.name || "N/A"}</span>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (tx: TransactionWithProfile) => {
        const config = getTypeConfig(tx.type);
        return (
          <div className={`inline-flex items-center gap-2 rounded-lg px-2.5 py-1 ${config.bg}`}>
            <config.icon className={`h-4 w-4 ${config.color}`} />
            <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>
          </div>
        );
      },
    },
    {
      key: "amount",
      header: "Amount",
      render: (tx: TransactionWithProfile) => {
        const isPositive = ["deposit", "loan_disbursement", "refund"].includes(tx.type);
        return (
          <p className={`font-semibold ${isPositive ? "text-green-600" : "text-slate-900"}`}>
            {isPositive ? "+" : "-"}{formatCurrency(tx.amount)}
          </p>
        );
      },
    },
    {
      key: "balance",
      header: "Balance After",
      render: (tx: TransactionWithProfile) => (
        <span className="text-slate-600">{formatCurrency(tx.balance_after)}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (tx: TransactionWithProfile) => {
        const statusConfig: Record<string, string> = {
          completed: "bg-green-100 text-green-700",
          pending: "bg-yellow-100 text-yellow-700",
          failed: "bg-red-100 text-red-700",
          cancelled: "bg-slate-100 text-slate-700",
        };
        return (
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig[tx.status] || "bg-slate-100 text-slate-700"}`}>
            {tx.status}
          </span>
        );
      },
    },
    {
      key: "date",
      header: "Date",
      render: (tx: TransactionWithProfile) => (
        <span className="text-sm text-slate-500">{formatDateTime(tx.created_at)}</span>
      ),
    },
  ];

  const totalDeposits = transactions.filter((t) => t.type === "deposit" && t.status === "completed").reduce((acc, t) => acc + t.amount, 0);
  const totalWithdrawals = transactions.filter((t) => ["withdrawal", "loan_repayment"].includes(t.type) && t.status === "completed").reduce((acc, t) => acc + t.amount, 0);

  return (
    <MainLayout title="Transactions" subtitle="View and manage all financial transactions">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Total Deposits</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{formatCurrency(totalDeposits)}</p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <ArrowDownLeft className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-orange-50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">Total Withdrawals</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{formatCurrency(totalWithdrawals)}</p>
              </div>
              <div className="rounded-full bg-red-100 p-3">
                <ArrowUpRight className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Net Flow</p>
                <p className={`mt-2 text-2xl font-bold ${totalDeposits - totalWithdrawals >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {totalDeposits - totalWithdrawals >= 0 ? "+" : ""}{formatCurrency(totalDeposits - totalWithdrawals)}
                </p>
              </div>
              <div className="rounded-full bg-slate-200 p-3">
                <RefreshCw className="h-6 w-6 text-slate-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search by reference or description..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm focus:border-cyan-500 focus:outline-none" />
          </div>
          <div className="flex gap-3">
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:border-cyan-500 focus:outline-none">
              <option value="">All Types</option>
              {transactionTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:border-cyan-500 focus:outline-none">
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <DataTable columns={columns} data={transactions} loading={loading} emptyMessage="No transactions found" />
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} totalCount={200} pageSize={20} />
      </div>
    </MainLayout>
  );
}
