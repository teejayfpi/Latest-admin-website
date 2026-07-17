"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Download, FileText, Calendar, TrendingUp, Users, DollarSign, CreditCard } from "lucide-react";

const reportTypes = [
  { id: "users", name: "User Report", description: "Complete list of all registered users with details", icon: Users },
  { id: "transactions", name: "Transaction Report", description: "All financial transactions with filters", icon: DollarSign },
  { id: "loans", name: "Loan Report", description: "Loan applications, approvals, and repayments", icon: CreditCard },
  { id: "savings", name: "Savings Report", description: "User savings summary and contributions", icon: TrendingUp },
  { id: "kyc", name: "KYC Report", description: "KYC verification status and documents", icon: FileText },
];

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!selectedReport) return;
    setGenerating(true);
    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setGenerating(false);
    alert(`Report "${selectedReport}" generated successfully!`);
  };

  return (
    <MainLayout title="Reports & Analytics" subtitle="Generate and download detailed reports">
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-500">Total Revenue</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{formatCurrency(15750000)}</p>
            <p className="text-xs text-green-600">+12.5% from last month</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-500">Total Users</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{formatNumber(12453)}</p>
            <p className="text-xs text-green-600">+8.2% from last month</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-500">Active Loans</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{formatNumber(2847)}</p>
            <p className="text-xs text-slate-600">Total: {formatCurrency(456000000)}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-500">Total Savings</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{formatCurrency(156789432)}</p>
            <p className="text-xs text-green-600">+15.3% from last month</p>
          </div>
        </div>

        {/* Report Generation */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Generate Report</h2>
          <p className="mt-1 text-sm text-slate-500">Select a report type and date range to generate</p>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">Report Type</label>
              <div className="mt-3 space-y-3">
                {reportTypes.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report.id)}
                    className={`flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-all ${selectedReport === report.id ? "border-cyan-500 bg-cyan-50" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"}`}
                  >
                    <div className={`rounded-lg p-2 ${selectedReport === report.id ? "bg-cyan-500 text-white" : "bg-slate-100 text-slate-600"}`}>
                      <report.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{report.name}</p>
                      <p className="text-sm text-slate-500">{report.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Date Range</label>
                <div className="mt-2 flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs text-slate-500">From</label>
                    <input type="date" value={dateRange.from} onChange={(e) => setDateRange((p) => ({ ...p, from: e.target.value }))}
                      className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-cyan-500 focus:outline-none" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-slate-500">To</label>
                    <input type="date" value={dateRange.to} onChange={(e) => setDateRange((p) => ({ ...p, to: e.target.value }))}
                      className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-cyan-500 focus:outline-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Format</label>
                <div className="mt-2 flex gap-3">
                  {["PDF", "Excel", "CSV"].map((format) => (
                    <button key={format}
                      className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                      <FileText className="h-4 w-4" />
                      {format}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={handleGenerate} loading={generating} disabled={!selectedReport} icon={Download} className="w-full">
                  Generate Report
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Recent Reports</h2>
          <div className="mt-4 space-y-3">
            {[
              { name: "User Report - June 2024", date: "2024-06-15", format: "PDF", size: "2.4 MB" },
              { name: "Transaction Summary - May 2024", date: "2024-05-31", format: "Excel", size: "5.1 MB" },
              { name: "Loan Portfolio Report", date: "2024-05-15", format: "PDF", size: "3.2 MB" },
            ].map((report, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-slate-100 p-4 hover:bg-slate-50">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-slate-100 p-2">
                    <FileText className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{report.name}</p>
                    <p className="text-sm text-slate-500">{report.date} • {report.format} • {report.size}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" icon={Download}>Download</Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
