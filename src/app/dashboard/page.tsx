"use client";

import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { TransactionChart } from "@/components/dashboard/TransactionChart";
import { UserGrowthChart } from "@/components/dashboard/UserGrowthChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Users, PiggyBank, CreditCard, Ticket, TrendingUp, DollarSign } from "lucide-react";
import type { DashboardStats } from "@/types";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated data for demonstration
    // In production, this would fetch from Supabase
    const fetchStats = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStats({
        totalUsers: 12453,
        activeUsers: 10892,
        totalSavings: 156789432,
        totalLoans: 2847,
        pendingLoans: 156,
        pendingKYC: 89,
        openTickets: 42,
        monthlyGrowth: 12.5,
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  const chartData = [
    { date: "2024-01", deposits: 12500000, withdrawals: 8500000, loans: 3500000 },
    { date: "2024-02", deposits: 15800000, withdrawals: 9200000, loans: 4200000 },
    { date: "2024-03", deposits: 18200000, withdrawals: 10500000, loans: 5100000 },
    { date: "2024-04", deposits: 14600000, withdrawals: 8800000, loans: 3800000 },
    { date: "2024-05", deposits: 22100000, withdrawals: 12400000, loans: 6800000 },
    { date: "2024-06", deposits: 19800000, withdrawals: 11200000, loans: 5900000 },
  ];

  const userGrowthData = [
    { month: "Jan", users: 245 },
    { month: "Feb", users: 312 },
    { month: "Mar", users: 428 },
    { month: "Apr", users: 367 },
    { month: "May", users: 512 },
    { month: "Jun", users: 489 },
  ];

  const recentActivities = [
    { id: "1", type: "deposit" as const, description: "Monthly contribution from Adebayo Johnson", amount: 50000, status: "completed", time: "2 min ago" },
    { id: "2", type: "loan" as const, description: "New loan application - Olumide Adeyemi", amount: 500000, status: "pending", time: "5 min ago" },
    { id: "3", type: "kyc" as const, description: "KYC verification submitted by Fatima Ibrahim", status: "pending", time: "12 min ago" },
    { id: "4", type: "withdrawal" as const, description: "Withdrawal request - Chinedu Okonkwo", amount: 75000, status: "pending", time: "18 min ago" },
    { id: "5", type: "user" as const, description: "New user registration - Emeka Nwosu", status: "active", time: "25 min ago" },
    { id: "6", type: "ticket" as const, description: "Support ticket escalated by Aisha Mohammed", status: "escalated", time: "1 hour ago" },
  ];

  return (
    <MainLayout title="Dashboard" subtitle="Welcome back! Here's what's happening today.">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={loading ? "..." : formatNumber(stats?.totalUsers || 0)}
            change={8.2}
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

        {/* Quick Stats */}
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
                <p className="mt-2 text-3xl font-bold text-slate-900">{formatCurrency(4567890)}</p>
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

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TransactionChart data={chartData} />
          <UserGrowthChart data={userGrowthData} />
        </div>

        {/* Recent Activity */}
        <RecentActivity activities={recentActivities} />
      </div>
    </MainLayout>
  );
}
