"use client";

import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DataTable } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { formatCurrency, formatDate, getInitials } from "@/lib/utils";
import { TrendingUp, Users, DollarSign, Calendar, Eye, TrendingDown } from "lucide-react";

export default function InvestmentsPage() {
  const [pools, setPools] = useState<any[]>([]);
  const [participations, setParticipations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [participationsLoading, setParticipationsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"pools" | "participations">("pools");
  const [participationPage, setParticipationPage] = useState(1);
  const [participationTotalPages, setParticipationTotalPages] = useState(1);
  const [participationTotalCount, setParticipationTotalCount] = useState(0);

  useEffect(() => {
    const fetchPools = async () => {
      setLoading(true);
      try {
        const { getInvestmentPools } = await import("@/lib/db-service");
        const data = await getInvestmentPools();
        setPools(data);
      } catch (error) {
        console.error("Error fetching investment pools:", error);
        setPools([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPools();
  }, []);

  useEffect(() => {
    if (activeTab === "participations") {
      fetchParticipations();
    }
  }, [activeTab, participationPage]);

  const fetchParticipations = async () => {
    setParticipationsLoading(true);
    try {
      const { getInvestmentParticipations } = await import("@/lib/db-service");
      const response = await getInvestmentParticipations({
        page: participationPage,
        pageSize: 20,
      });
      setParticipations(response.data);
      setParticipationTotalPages(response.totalPages);
      setParticipationTotalCount(response.count);
    } catch (error) {
      console.error("Error fetching participations:", error);
      setParticipations([]);
    } finally {
      setParticipationsLoading(false);
    }
  };

  const totalInvested = pools.reduce((acc, p) => acc + (p.filled_slots * ((p.min_amount + p.max_amount) / 2)), 0);

  const participationColumns = [
    {
      key: "user",
      header: "Participant",
      render: (p: any) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white">
            {getInitials(p.profile?.name)}
          </div>
          <div>
            <p className="font-medium text-slate-900">{p.profile?.name || "N/A"}</p>
            <p className="text-xs text-slate-500">{p.profile?.user_id}</p>
          </div>
        </div>
      ),
    },
    {
      key: "pool",
      header: "Pool",
      render: (p: any) => (
        <span className="text-slate-900">{p.pool?.name || "N/A"}</span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      render: (p: any) => (
        <span className="font-medium text-slate-900">{formatCurrency(p.amount)}</span>
      ),
    },
    {
      key: "returns",
      header: "Expected Returns",
      render: (p: any) => (
        <span className="font-medium text-green-600">{formatCurrency(p.expected_returns)}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (p: any) => {
        const statusColors: Record<string, string> = {
          active: "bg-green-100 text-green-700",
          completed: "bg-blue-100 text-blue-700",
          cancelled: "bg-slate-100 text-slate-600",
        };
        return (
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[p.status] || "bg-slate-100 text-slate-600"}`}>
            {p.status}
          </span>
        );
      },
    },
    {
      key: "date",
      header: "Date",
      render: (p: any) => (
        <span className="text-sm text-slate-500">{formatDate(p.created_at)}</span>
      ),
    },
  ];

  return (
    <MainLayout title="Investment Pools" subtitle="Manage investment pools and participations">
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex gap-4 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("pools")}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${activeTab === "pools" ? "border-b-2 border-cyan-600 text-cyan-600" : "text-slate-500 hover:text-slate-700"}`}
          >
            Investment Pools
          </button>
          <button
            onClick={() => setActiveTab("participations")}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${activeTab === "participations" ? "border-b-2 border-cyan-600 text-cyan-600" : "text-slate-500 hover:text-slate-700"}`}
          >
            Participations
          </button>
        </div>

        {activeTab === "pools" ? (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-cyan-100 p-3"><TrendingUp className="h-6 w-6 text-cyan-600" /></div>
                  <div><p className="text-2xl font-bold text-slate-900">{pools.length}</p><p className="text-sm text-cyan-700">Total Pools</p></div>
                </div>
              </div>
              <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-100 p-3"><Users className="h-6 w-6 text-green-600" /></div>
                  <div><p className="text-2xl font-bold text-slate-900">{pools.filter((p) => p.status === "active").length}</p><p className="text-sm text-green-700">Active Pools</p></div>
                </div>
              </div>
              <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-purple-100 p-3"><DollarSign className="h-6 w-6 text-purple-600" /></div>
                  <div><p className="text-2xl font-bold text-slate-900">{formatCurrency(totalInvested / 1000000)}M</p><p className="text-sm text-purple-700">Total Value</p></div>
                </div>
              </div>
              <div className="rounded-xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-yellow-100 p-3"><Calendar className="h-6 w-6 text-yellow-600" /></div>
                  <div><p className="text-2xl font-bold text-slate-900">{pools.filter((p) => p.status === "upcoming").length}</p><p className="text-sm text-yellow-700">Upcoming</p></div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {pools.map((pool) => (
                <div key={pool.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{pool.name}</h3>
                      <p className="mt-1 text-sm text-slate-500">{pool.description}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${pool.status === "active" ? "bg-green-100 text-green-700" : pool.status === "upcoming" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
                      {pool.status}
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Interest Rate</p>
                      <p className="text-xl font-bold text-slate-900">{pool.interest_rate}%</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Tenure</p>
                      <p className="text-xl font-bold text-slate-900">{pool.tenure_days} days</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Min Amount</p>
                      <p className="text-lg font-semibold text-slate-900">{formatCurrency(pool.min_amount)}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Max Amount</p>
                      <p className="text-lg font-semibold text-slate-900">{formatCurrency(pool.max_amount)}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Filled Slots</span>
                      <span className="font-medium text-slate-900">{pool.filled_slots} / {pool.total_slots}</span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                      <div className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600" style={{ width: `${(pool.filled_slots / pool.total_slots) * 100}%` }} />
                    </div>
                    <p className="mt-2 text-xs text-slate-500">Ends: {formatDate(pool.end_date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <DataTable 
              columns={participationColumns} 
              data={participations} 
              loading={participationsLoading} 
              emptyMessage="No participations found" 
            />
            <Pagination 
              currentPage={participationPage} 
              totalPages={participationTotalPages} 
              onPageChange={setParticipationPage} 
              totalCount={participationTotalCount} 
              pageSize={20} 
            />
          </>
        )}
      </div>
    </MainLayout>
  );
}
