"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog";
import { toast } from "sonner";
import { RefreshCw, Search, DollarSign, Calendar, CheckCircle, XCircle } from "lucide-react";

interface RolloverRequest {
  id: string;
  loanId: string;
  memberName: string;
  memberId: string;
  originalAmount: number;
  rolloverAmount: number;
  newTenure: number;
  interestRate: number;
  requestDate: string;
  status: "pending" | "approved" | "rejected";
}

const REQUESTS: RolloverRequest[] = [
  { id: "1", loanId: "LN-001", memberName: "John Adebayo", memberId: "usr_001", originalAmount: 500000, rolloverAmount: 50000, newTenure: 3, interestRate: 2.5, requestDate: "2024-01-15", status: "pending" },
  { id: "2", loanId: "LN-002", memberName: "Sarah Okonkwo", memberId: "usr_002", originalAmount: 750000, rolloverAmount: 75000, newTenure: 6, interestRate: 2.0, requestDate: "2024-01-14", status: "approved" },
  { id: "3", loanId: "LN-003", memberName: "Michael Eze", memberId: "usr_003", originalAmount: 1000000, rolloverAmount: 150000, newTenure: 12, interestRate: 1.5, requestDate: "2024-01-13", status: "pending" },
  { id: "4", loanId: "LN-004", memberName: "Grace Nwosu", memberId: "usr_004", originalAmount: 250000, rolloverAmount: 25000, newTenure: 3, interestRate: 2.5, requestDate: "2024-01-12", status: "rejected" },
];

export default function RolloverManagementPage() {
  const [requests, setRequests] = useState<RolloverRequest[]>(REQUESTS);
  const [search, setSearch] = useState("");

  const filtered = requests.filter((r) => r.memberName.toLowerCase().includes(search.toLowerCase()) || r.loanId.toLowerCase().includes(search.toLowerCase()));

  const handleApprove = (id: string) => { setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: "approved" } : r)); toast.success("Rollover approved"); };
  const handleReject = (id: string) => { setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: "rejected" } : r)); toast.error("Rollover rejected"); };

  const formatCurrency = (v: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(v);

  return (
    <MainLayout title="Rollover Management" subtitle="Manage loan rollover requests">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center"><RefreshCw className="h-5 w-5 text-yellow-600" /></div><div><p className="text-sm text-slate-500">Pending</p><p className="text-2xl font-bold">{requests.filter((r) => r.status === "pending").length}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center"><CheckCircle className="h-5 w-5 text-green-600" /></div><div><p className="text-sm text-slate-500">Approved</p><p className="text-2xl font-bold">{requests.filter((r) => r.status === "approved").length}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-cyan-100 flex items-center justify-center"><DollarSign className="h-5 w-5 text-cyan-600" /></div><div><p className="text-sm text-slate-500">Total Rollover Amount</p><p className="text-2xl font-bold">{formatCurrency(requests.reduce((s, r) => s + r.rolloverAmount, 0))}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center"><Calendar className="h-5 w-5 text-purple-600" /></div><div><p className="text-sm text-slate-500">Avg Tenure</p><p className="text-2xl font-bold">{Math.round(requests.reduce((s, r) => s + r.newTenure, 0) / requests.length)} mo</p></div></div></CardContent></Card>
        </div>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2"><RefreshCw className="h-5 w-5 text-cyan-600" />Rollover Requests</CardTitle>
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 w-64" /></div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b"><tr><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Loan ID</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Member</th><th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Original Amount</th><th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Rollover Amount</th><th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">New Tenure</th><th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Interest Rate</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th></tr></thead>
                <tbody className="divide-y">
                  {filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono">{r.loanId}</td>
                      <td className="px-4 py-3"><div><p className="font-medium">{r.memberName}</p><p className="text-xs text-slate-500">{r.memberId}</p></div></td>
                      <td className="px-4 py-3 text-right">{formatCurrency(r.originalAmount)}</td>
                      <td className="px-4 py-3 text-right font-medium text-cyan-600">{formatCurrency(r.rolloverAmount)}</td>
                      <td className="px-4 py-3 text-center">{r.newTenure} months</td>
                      <td className="px-4 py-3 text-center">{r.interestRate}%</td>
                      <td className="px-4 py-3"><Badge className={r.status === "approved" ? "bg-green-100 text-green-700" : r.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}>{r.status}</Badge></td>
                      <td className="px-4 py-3">
                        {r.status === "pending" && <div className="flex items-center gap-1"><Button variant="ghost" size="icon" className="h-8 w-8 text-green-600" onClick={() => handleApprove(r.id)}><CheckCircle className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => handleReject(r.id)}><XCircle className="h-4 w-4" /></Button></div>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
