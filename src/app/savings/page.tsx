"use client";

import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DataTable } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { formatCurrency, formatDate, getInitials } from "@/lib/utils";
import { Search, PiggyBank, TrendingUp, Award } from "lucide-react";
import type { Savings, Profile } from "@/types";

interface SavingsWithProfile extends Savings {
  profile?: Profile;
}

export default function SavingsPage() {
  const [savings, setSavings] = useState<SavingsWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchSavings = async () => {
      setLoading(true);
      try {
        const { getSavings } = await import("@/lib/db-service");
        const response = await getSavings({
          search: search || undefined,
          page,
          pageSize: 20,
        });
        
        setSavings(response.data as SavingsWithProfile[]);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Error fetching savings:", error);
        setSavings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSavings();
  }, [search, page]);

  const totalAmount = savings.reduce((acc, s) => acc + Number(s.total_saved), 0);
  const avgSavings = totalAmount / savings.length || 0;

  const columns = [
    { key: "user", header: "Member", render: (s: SavingsWithProfile) => (
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white">{getInitials(s.profile?.name)}</div>
        <div><p className="font-medium text-slate-900">{s.profile?.name}</p><p className="text-xs text-slate-500">{s.profile?.user_id}</p></div>
      </div>
    )},
    { key: "total_saved", header: "Total Saved", render: (s: SavingsWithProfile) => (
      <span className="font-semibold text-slate-900">{formatCurrency(Number(s.total_saved))}</span>
    )},
    { key: "monthly", header: "Monthly Savings", render: (s: SavingsWithProfile) => <span className="text-slate-600">{formatCurrency(Number(s.monthly_savings))}</span> },
    { key: "consecutive", header: "Consecutive Months", render: (s: SavingsWithProfile) => (
      <div className="flex items-center gap-2">
        <span className="font-medium text-slate-900">{s.consecutive_months}</span>
        {s.consecutive_months >= 6 && <Award className="h-4 w-4 text-yellow-500" />}
      </div>
    )},
    { key: "first_date", header: "First Savings", render: (s: SavingsWithProfile) => <span className="text-slate-500">{s.first_savings_date ? formatDate(s.first_savings_date) : "N/A"}</span> },
    { key: "last_date", header: "Last Contribution", render: (s: SavingsWithProfile) => <span className="text-slate-500">{s.last_savings_date ? formatDate(s.last_savings_date) : "N/A"}</span> },
  ];

  return (
    <MainLayout title="Savings Management" subtitle="Monitor and manage member savings">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-3"><PiggyBank className="h-6 w-6 text-green-600" /></div>
              <div><p className="text-2xl font-bold text-slate-900">{formatCurrency(totalAmount)}</p><p className="text-sm text-green-700">Total Savings</p></div>
            </div>
          </div>
          <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-3"><TrendingUp className="h-6 w-6 text-blue-600" /></div>
              <div><p className="text-2xl font-bold text-slate-900">{formatCurrency(avgSavings)}</p><p className="text-sm text-blue-700">Average Savings</p></div>
            </div>
          </div>
          <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-purple-100 p-3"><Award className="h-6 w-6 text-purple-600" /></div>
              <div><p className="text-2xl font-bold text-slate-900">{savings.filter((s) => s.consecutive_months >= 6).length}</p><p className="text-sm text-purple-700">Consistent Savers</p></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search by name or user ID..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm focus:border-cyan-500 focus:outline-none" />
          </div>
        </div>

        <DataTable columns={columns} data={savings} loading={loading} emptyMessage="No savings data found" />
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} totalCount={200} pageSize={20} />
      </div>
    </MainLayout>
  );
}
