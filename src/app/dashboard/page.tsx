"use client";

import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { TransactionChart } from "@/components/dashboard/TransactionChart";
import { UserGrowthChart } from "@/components/dashboard/UserGrowthChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Users, PiggyBank, CreditCard, Ticket, TrendingUp, DollarSign } from "lucide-react";
import { getDashboardStats, getTransactionsChartData, getUserGrowthData, getTransactions, getTickets } from "@/lib/db-service";
import type { DashboardStats } from "@/types";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const dashboardStats = await getDashboardStats();
        setStats(dashboardStats);

        const txChartData = await getTransactionsChartData(30);
        setChartData(txChartData);

        const growthData = await getUserGrowthData(6);
        setUserGrowthData(growthData);

        const [transactionsResponse, ticketsResponse] = await Promise.all([
          getTransactions({ pageSize: 5 }),
          getTickets({ status: "open", pageSize: 5 }),
        ]);

        const activities: any[] = [];
        
        // Add transactions to activities
        transactionsResponse.data?.slice(0, 3).forEach((tx: any) => {
          activities.push({
            id: tx.id,
            type: "transaction",
            description: `${tx.type} from ${tx.profile?.name || "User"}`,
            amount: tx.amount,
            status: tx.status,
            time: tx.created_at,
          });
        });

        // Add tickets to activities
        ticketsResponse.data?.slice(0, 2).forEach((ticket: any) => {
          activities.push({
            id: ticket.id,
            type: "ticket",
            description: `New ticket: ${ticket.subject}`,
            status: ticket.status,
            priority: ticket.priority,
            time: ticket.created_at,
          });
        });

        // Sort by time and take top 5
        activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        setRecentActivities(activities.slice(0, 5));
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || "Failed to load dashboard data");
        setStats({
          totalUsers: 0,
          activeUsers: 0,
          totalSavings: 0,
          totalLoans: 0,
          pendingLoans: 0,
          pendingKYC: 0,
          openTickets: 0,
          monthlyGrowth: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <MainLayout title="Dashboard" subtitle="Welcome back! Here's what's happening today.">
      <div className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={loading ? "..." : formatNumber(stats?.totalUsers || 0)}
            change={stats?.monthlyGrowth || 0}
            changeLabel="from last month"
            icon={Users}
            iconColor="text-blue-600"
            iconBg="bg-blue-100"
          />
          <StatCard
            title="Total Savings"
            value={loading ? "..." : formatCurrency(stats?.totalSavings || 0)}
            change={stats?.monthlyGrowth}
            changeLabel="from last month"
            icon={PiggyBank}
            iconColor="text-green-600"
            iconBg="bg-green-100"
          />
          <StatCard
            title="Active Loans"
            value={loading ? "..." : formatNumber(stats?.totalLoans || 0)}
            change={5.4}
            changeLabel="from last month"
            icon={CreditCard}
            iconColor="text-purple-600"
            iconBg="bg-purple-100"
          />
          <StatCard
            title="Open Tickets"
            value={loading ? "..." : stats?.openTickets || 0}
            change={-12.3}
            changeLabel="from last week"
            icon={Ticket}
            iconColor="text-orange-600"
            iconBg="bg-orange-100"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Pending Loans</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{stats?.pendingLoans || 0}</p>
              </div>
              <div className="rounded-full bg-yellow-100 p-3">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 h-2 w-full rounded-full bg-slate-100">
              <div className="h-2 w-1/4 rounded-full bg-yellow-500" />
            </div>
            <p className="mt-2 text-sm text-slate-500">Awaiting approval</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Pending KYC</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{stats?.pendingKYC || 0}</p>
              </div>
              <div className="rounded-full bg-cyan-100 p-3">
                <Users className="h-6 w-6 text-cyan-600" />
              </div>
            </div>
            <div className="mt-4 h-2 w-full rounded-full bg-slate-100">
              <div className="h-2 w-1/6 rounded-full bg-cyan-500" />
            </div>
            <p className="mt-2 text-sm text-slate-500">Requires verification</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Monthly Interest</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{loading ? "..." : formatCurrency(stats?.totalSavings || 0)}</p>
              </div>
              <div className="rounded-full bg-emerald-100 p-3">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4 h-2 w-full rounded-full bg-slate-100">
              <div className="h-2 w-3/4 rounded-full bg-emerald-500" />
            </div>
            <p className="mt-2 text-sm text-slate-500">Interest earned this month</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TransactionChart data={chartData.length > 0 ? chartData : [{ date: "No data", deposits: 0, withdrawals: 0, loans: 0 }]} />
          <UserGrowthChart data={userGrowthData.length > 0 ? userGrowthData : [{ month: "No data", users: 0 }]} />
        </div>

        <RecentActivity activities={recentActivities.length > 0 ? recentActivities : []} />
      </div>
    </MainLayout>
  );
}
