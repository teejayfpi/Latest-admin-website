"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog";
import { toast } from "sonner";
import { Search, CheckCircle, XCircle, Eye, FileText, Clock } from "lucide-react";

interface PendingVerification {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  bank: string;
  accountNumber: string;
  receiptUrl: string;
  submittedAt: string;
  notes?: string;
}

const PENDING: PendingVerification[] = [
  { id: "1", memberId: "usr_001", memberName: "John Adebayo", amount: 50000, bank: "First Bank", accountNumber: "301****789", receiptUrl: "#", submittedAt: "2024-01-15 10:30" },
  { id: "2", memberId: "usr_002", memberName: "Sarah Okonkwo", amount: 75000, bank: "GTBank", accountNumber: "204****123", receiptUrl: "#", submittedAt: "2024-01-14 14:20" },
  { id: "3", memberId: "usr_003", memberName: "Michael Eze", amount: 100000, bank: "UBA", accountNumber: "208****456", receiptUrl: "#", submittedAt: "2024-01-13 09:15" },
];

export default function DepositVerificationPage() {
  const [pending, setPending] = useState<PendingVerification[]>(PENDING);
  const [selected, setSelected] = useState<PendingVerification | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const handleApprove = (id: string) => {
    setPending((prev) => prev.filter((p) => p.id !== id));
    toast.success("Deposit verified and credited to member account");
  };

  const handleReject = (id: string) => {
    if (!rejectReason) { toast.error("Please provide a rejection reason"); return; }
    setPending((prev) => prev.filter((p) => p.id !== id));
    setShowDetail(false);
    setRejectReason("");
    toast.error("Deposit verification rejected");
  };

  const openDetail = (item: PendingVerification) => { setSelected(item); setShowDetail(true); };

  return (
    <MainLayout title="Deposit Verification" subtitle="Verify and approve pending deposits">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center"><Clock className="h-5 w-5 text-yellow-600" /></div><div><p className="text-sm text-slate-500">Pending</p><p className="text-2xl font-bold">{pending.length}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center"><CheckCircle className="h-5 w-5 text-green-600" /></div><div><p className="text-sm text-slate-500">Verified Today</p><p className="text-2xl font-bold">15</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-cyan-100 flex items-center justify-center"><FileText className="h-5 w-5 text-cyan-600" /></div><div><p className="text-sm text-slate-500">This Week</p><p className="text-2xl font-bold">87</p></div></div></CardContent></Card>
        </div>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Pending Verifications</CardTitle>
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><Input placeholder="Search..." className="pl-10 w-64" /></div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b"><tr><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Member</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Amount</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Bank</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Submitted</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Receipt</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th></tr></thead>
                <tbody className="divide-y">
                  {pending.map((item) => (<tr key={item.id} className="hover:bg-slate-50"><td className="px-4 py-3"><div><p className="font-medium">{item.memberName}</p><p className="text-xs text-slate-500">{item.memberId}</p></div></td><td className="px-4 py-3 font-medium text-green-600">₦{item.amount.toLocaleString()}</td><td className="px-4 py-3 text-sm">{item.bank}</td><td className="px-4 py-3 text-sm text-slate-500">{item.submittedAt}</td><td className="px-4 py-3"><Button variant="ghost" size="sm"><Eye className="h-4 w-4 mr-1" />View</Button></td><td className="px-4 py-3"><div className="flex items-center gap-1"><Button variant="ghost" size="icon" className="h-8 w-8 text-green-600" onClick={() => handleApprove(item.id)}><CheckCircle className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => openDetail(item)}><XCircle className="h-4 w-4" /></Button></div></td></tr>))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reject Deposit Verification</DialogTitle></DialogHeader>
          {selected && (<div className="space-y-4 py-4"><div className="grid grid-cols-2 gap-4"><div><p className="text-sm text-slate-500">Member</p><p className="font-medium">{selected.memberName}</p></div><div><p className="text-sm text-slate-500">Amount</p><p className="font-medium text-green-600">₦{selected.amount.toLocaleString()}</p></div><div><p className="text-sm text-slate-500">Bank</p><p className="font-medium">{selected.bank}</p></div><div><p className="text-sm text-slate-500">Account</p><p className="font-mono">{selected.accountNumber}</p></div></div><div><Label>Rejection Reason</Label><Textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Enter reason for rejection..." rows={4} /></div></div>)}
          <DialogFooter><Button variant="outline" onClick={() => setShowDetail(false)}>Cancel</Button><Button variant="destructive" onClick={() => selected && handleReject(selected.id)}>Reject</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
