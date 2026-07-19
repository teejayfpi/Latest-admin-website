"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog";
import { Label } from "@/components/ui/Label";
import { toast } from "sonner";
import { UserCheck, Users, DollarSign, AlertTriangle, CheckCircle, XCircle, Eye } from "lucide-react";

interface GuarantorRequest {
  id: string;
  loanId: string;
  borrowerId: string;
  borrowerName: string;
  guarantorId: string;
  guarantorName: string;
  amount: number;
  requestDate: string;
  status: "pending" | "accepted" | "rejected" | "expired";
  expiresAt: string;
}

const REQUESTS: GuarantorRequest[] = [
  { id: "1", loanId: "LN-001", borrowerId: "usr_001", borrowerName: "John Adebayo", guarantorId: "usr_005", guarantorName: "David Igwe", amount: 500000, requestDate: "2024-01-15", status: "pending", expiresAt: "2024-01-22" },
  { id: "2", loanId: "LN-002", borrowerId: "usr_002", borrowerName: "Sarah Okonkwo", guarantorId: "usr_006", guarantorName: "Chidi Nwankwo", amount: 750000, requestDate: "2024-01-14", status: "accepted", expiresAt: "2024-01-21" },
  { id: "3", loanId: "LN-003", borrowerId: "usr_003", borrowerName: "Michael Eze", guarantorId: "usr_007", guarantorName: "Emeka Obi", amount: 1000000, requestDate: "2024-01-13", status: "pending", expiresAt: "2024-01-20" },
  { id: "4", loanId: "LN-004", borrowerId: "usr_004", borrowerName: "Grace Nwosu", guarantorId: "usr_008", guarantorName: "Ada Uzoma", amount: 250000, requestDate: "2024-01-12", status: "rejected", expiresAt: "2024-01-19" },
  { id: "5", loanId: "LN-005", borrowerId: "usr_009", borrowerName: "James Okafor", guarantorId: "usr_010", guarantorName: "Ifeanyi Eze", amount: 500000, requestDate: "2024-01-10", status: "expired", expiresAt: "2024-01-17" },
];

export default function GuarantorSystemPage() {
  const [requests] = useState<GuarantorRequest[]>(REQUESTS);
  const [search, setSearch] = useState("");

  const filtered = requests.filter((r) => r.borrowerName.toLowerCase().includes(search.toLowerCase()) || r.guarantorName.toLowerCase().includes(search.toLowerCase()) || r.loanId.toLowerCase().includes(search.toLowerCase()));
  const formatCurrency = (v: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(v);
  const getStatusColor = (s: string) => ({ pending: "bg-yellow-100 text-yellow-700", accepted: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-700", expired: "bg-slate-100 text-slate-700" }[s] || "");

  return (
    <MainLayout title="Guarantor System" subtitle="Manage loan guarantor requests and approvals">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><UserCheck className="h-5 w-5 text-cyan-600" /><h2 className="text-lg font-semibold">Guarantor Requests</h2></div>
          <Button className="bg-cyan-600 hover:bg-cyan-700"><UserCheck className="h-4 w-4 mr-2" />Configure Requirements</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center"><AlertTriangle className="h-5 w-5 text-yellow-600" /></div><div><p className="text-sm text-slate-500">Pending</p><p className="text-2xl font-bold">{requests.filter((r) => r.status === "pending").length}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center"><CheckCircle className="h-5 w-5 text-green-600" /></div><div><p className="text-sm text-slate-500">Accepted</p><p className="text-2xl font-bold">{requests.filter((r) => r.status === "accepted").length}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center"><XCircle className="h-5 w-5 text-red-600" /></div><div><p className="text-sm text-slate-500">Rejected</p><p className="text-2xl font-bold">{requests.filter((r) => r.status === "rejected").length}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-cyan-100 flex items-center justify-center"><DollarSign className="h-5 w-5 text-cyan-600" /></div><div><p className="text-sm text-slate-500">Total Amount</p><p className="text-2xl font-bold">{formatCurrency(requests.reduce((s, r) => s + r.amount, 0))}</p></div></div></CardContent></Card>
        </div>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Guarantor Requests</CardTitle>
            <div className="relative"><UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><Input placeholder="Search by name or loan ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 w-64" /></div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b"><tr><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Loan ID</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Borrower</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Guarantor</th><th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Amount</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Requested</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Expires</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th></tr></thead>
                <tbody className="divide-y">
                  {filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono">{r.loanId}</td>
                      <td className="px-4 py-3"><div><p className="font-medium">{r.borrowerName}</p><p className="text-xs text-slate-500">{r.borrowerId}</p></div></td>
                      <td className="px-4 py-3"><div><p className="font-medium">{r.guarantorName}</p><p className="text-xs text-slate-500">{r.guarantorId}</p></div></td>
                      <td className="px-4 py-3 text-right font-medium text-cyan-600">{formatCurrency(r.amount)}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{r.requestDate}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{r.expiresAt}</td>
                      <td className="px-4 py-3"><Badge className={getStatusColor(r.status)}>{r.status}</Badge></td>
                      <td className="px-4 py-3"><Button variant="ghost" size="sm"><Eye className="h-4 w-4 mr-1" />View</Button></td>
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
