"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { TrendingUp, TrendingDown, DollarSign, Users, Wallet, PiggyBank, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const monthlyData = [
  { month: "Jul", deposits: 4500000, loans: 3200000, withdrawals: 1200000 },
  { month: "Aug", deposits: 5200000, loans: 3800000, withdrawals: 1400000 },
  { month: "Sep", deposits: 4800000, loans: 3500000, withdrawals: 1100000 },
  { month: "Oct", deposits: 6100000, loans: 4200000, withdrawals: 1600000 },
  { month: "Nov", deposits: 5500000, loans: 3900000, withdrawals: 1300000 },
  { month: "Dec", deposits: 7200000, loans: 5100000, withdrawals: 1900000 },
];

const portfolioData = [
  { name: "Loans", value: 45, color: "#0891b2" },
  { name: "Savings", value: 30, color: "#22c55e" },
  { name: "Investments", value: 15, color: "#8b5cf6" },
  { name: "Cash", value: 10, color: "#f59e0b" },
];

const topMembers = [
  { name: "John Adebayo", savings: 2500000, loans: 1500000, contributions: 125000 },
  { name: "Sarah Okonkwo", savings: 3200000, loans: 0, contributions: 160000 },
  { name: "Michael Eze", savings: 1800000, loans: 2000000, contributions: 90000 },
  { name: "Grace Nwosu", savings: 4100000, loans: 500000, contributions: 205000 },
  { name: "David Igwe", savings: 950000, loans: 800000, contributions: 47500 },
];

export default function FinancialDashboardPage() {
  const [period, setPeriod] = useState("6m");
  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `₦${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `₦${(value / 1000).toFixed(0)}K`;
    return `₦${value}`;
  };

  return (
    <MainLayout title="Financial Dashboard" subtitle="Comprehensive financial overview and analytics">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Financial Overview</h2>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Deposits</p>
                  <p className="text-2xl font-bold">₦33.3M</p>
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <TrendingUp className="h-4 w-4" />
                    <span>+12.5%</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <PiggyBank className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Loans</p>
                  <p className="text-2xl font-bold">₦23.7M</p>
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <TrendingUp className="h-4 w-4" />
                    <span>+8.3%</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-cyan-100 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-cyan-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Withdrawals</p>
                  <p className="text-2xl font-bold">₦8.5M</p>
                  <div className="flex items-center gap-1 text-red-600 text-sm">
                    <TrendingDown className="h-4 w-4" />
                    <span>-3.2%</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Active Members</p>
                  <p className="text-2xl font-bold">1,247</p>
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <TrendingUp className="h-4 w-4" />
                    <span>+45</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="trends" className="space-y-4">
          <TabsList>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="members">Top Members</TabsTrigger>
          </TabsList>

          <TabsContent value="trends">
            <Card>
              <CardHeader><CardTitle>Financial Trends</CardTitle></CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={formatCurrency} />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                      <Line type="monotone" dataKey="deposits" stroke="#22c55e" strokeWidth={2} name="Deposits" />
                      <Line type="monotone" dataKey="loans" stroke="#0891b2" strokeWidth={2} name="Loans" />
                      <Line type="monotone" dataKey="withdrawals" stroke="#ef4444" strokeWidth={2} name="Withdrawals" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle>Portfolio Distribution</CardTitle></CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={portfolioData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                          {portfolioData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Monthly Summary</CardTitle></CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={formatCurrency} />
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Bar dataKey="deposits" fill="#22c55e" name="Deposits" />
                        <Bar dataKey="loans" fill="#0891b2" name="Loans" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="members">
            <Card>
              <CardHeader><CardTitle>Top Members by Savings</CardTitle></CardHeader>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Member</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Savings</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Loans</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Monthly Contribution</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {topMembers.map((member, index) => (
                      <tr key={index} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 font-medium">{index + 1}</div>
                            <span className="font-medium">{member.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-green-600">₦{member.savings.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right font-medium text-cyan-600">₦{member.loans.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right font-medium">₦{member.contributions.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
