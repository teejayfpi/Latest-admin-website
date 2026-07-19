"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Search, Download, TrendingUp, DollarSign, Calendar, Filter } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Contribution {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  date: string;
  method: "salary_deduction" | "direct" | "bank_transfer" | "ussd";
  status: "completed" | "pending" | "failed";
  reference: string;
}

const MOCK_CONTRIBUTIONS: Contribution[] = [
  { id: "1", memberId: "usr_001", memberName: "John Adebayo", amount: 25000, date: "2024-01-15", method: "salary_deduction", status: "completed", reference: "SD/2024/001" },
  { id: "2", memberId: "usr_002", memberName: "Sarah Okonkwo", amount: 30000, date: "2024-01-14", method: "direct", status: "completed", reference: "DIR/2024/001" },
  { id: "3", memberId: "usr_003", memberName: "Michael Eze", amount: 15000, date: "2024-01-13", method: "bank_transfer", status: "pending", reference: "BT/2024/001" },
  { id: "4", memberId: "usr_004", memberName: "Grace Nwosu", amount: 50000, date: "2024-01-12", method: "ussd", status: "completed", reference: "USSD/2024/001" },
  { id: "5", memberId: "usr_005", memberName: "David Igwe", amount: 20000, date: "2024-01-11", method: "salary_deduction", status: "failed", reference: "SD/2024/002" },
];

const monthlyTrend = [
  { month: "Jul", total: 4200000 },
  { month: "Aug", total: 4800000 },
  { month: "Sep", total: 5100000 },
  { month: "Oct", total: 5600000 },
  { month: "Nov", total: 5300000 },
  { month: "Dec", total: 6200000 },
];

export default function MemberContributionsPage() {
  const [contributions] = useState<Contribution[]>(MOCK_CONTRIBUTIONS);
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = contributions.filter((c) => {
    const matchesSearch = c.memberName.toLowerCase().includes(search.toLowerCase()) || c.reference.toLowerCase().includes(search.toLowerCase());
    const matchesMethod = methodFilter === "all" || c.method === methodFilter;
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesMethod && matchesStatus;
  });

  const totalAmount = filtered.reduce((sum, c) => sum + c.amount, 0);
  const formatCurrency = (v: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(v);
  const getMethodLabel = (m: string) => ({ salary_deduction: "Salary Deduction", direct: "Direct", bank_transfer: "Bank Transfer", ussd: "USSD" }[m] || m);

  return (
    <MainLayout title="Member Contributions" subtitle="Track and manage all member contributions">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center"><DollarSign className="h-5 w-5 text-green-600" /></div><div><p className="text-sm text-slate-500">Total Contributions</p><p className="text-xl font-bold">{formatCurrency(totalAmount)}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-cyan-100 flex items-center justify-center"><TrendingUp className="h-5 w-5 text-cyan-600" /></div><div><p className="text-sm text-slate-500">This Month</p><p className="text-xl font-bold">{formatCurrency(6200000)}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center"><Calendar className="h-5 w-5 text-purple-600" /></div><div><p className="text-sm text-slate-500">Pending</p><p className="text-xl font-bold">12</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center"><Filter className="h-5 w-5 text-red-600" /></div><div><p className="text-sm text-slate-500">Failed</p><p className="text-xl font-bold">3</p></div></div></CardContent></Card>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="salary_deduction">Salary Deduction</TabsTrigger>
            <TabsTrigger value="direct">Direct</TabsTrigger>
            <TabsTrigger value="bank_transfer">Bank Transfer</TabsTrigger>
            <TabsTrigger value="ussd">USSD</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle>All Contributions</CardTitle>
                <Button variant="outline"><Download className="h-4 w-4 mr-2" />Export</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><Input placeholder="Search by name or reference..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" /></div>
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border rounded-lg px-3 py-2 text-sm"><option value="all">All Status</option><option value="completed">Completed</option><option value="pending">Pending</option><option value="failed">Failed</option></select>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b"><tr><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Member</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Amount</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Method</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Reference</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th></tr></thead>
                    <tbody className="divide-y">
                      {filtered.map((c) => (<tr key={c.id} className="hover:bg-slate-50"><td className="px-4 py-3"><div><p className="font-medium">{c.memberName}</p><p className="text-xs text-slate-500">{c.memberId}</p></div></td><td className="px-4 py-3 font-medium text-green-600">{formatCurrency(c.amount)}</td><td className="px-4 py-3"><Badge variant="outline">{getMethodLabel(c.method)}</Badge></td><td className="px-4 py-3 text-slate-500 text-sm">{c.date}</td><td className="px-4 py-3 font-mono text-sm">{c.reference}</td><td className="px-4 py-3"><Badge className={c.status === "completed" ? "bg-green-100 text-green-700" : c.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}>{c.status}</Badge></td></tr>))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {["salary_deduction", "direct", "bank_transfer", "ussd"].map((method) => (
            <TabsContent key={method} value={method}>
              <Card><CardHeader><CardTitle>{getMethodLabel(method)} Contributions</CardTitle></CardHeader><CardContent><p className="text-slate-500">Showing all {getMethodLabel(method).toLowerCase()} contributions...</p></CardContent></Card>
            </TabsContent>
          ))}
        </Tabs>

        <Card>
          <CardHeader><CardTitle>Contribution Trends</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(v) => `₦${(v / 1000000).toFixed(1)}M`} />
                  <Tooltip formatter={(v) => formatCurrency(v as number)} />
                  <Line type="monotone" dataKey="total" stroke="#0891b2" strokeWidth={2} name="Total Contributions" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
