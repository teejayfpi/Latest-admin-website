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
import { Gift, Users, DollarSign, TrendingUp, Copy, Eye } from "lucide-react";

interface Referral {
  id: string;
  referrerId: string;
  referrerName: string;
  refereeId: string;
  refereeName: string;
  referralCode: string;
  rewardAmount: number;
  status: "pending" | "completed" | "paid";
  referredAt: string;
  completedAt?: string;
}

const REFERRALS: Referral[] = [
  { id: "1", referrerId: "usr_001", referrerName: "John Adebayo", refereeId: "usr_010", refereeName: "Peter Adeyemi", referralCode: "REF-JA-001", rewardAmount: 5000, status: "completed", referredAt: "2024-01-10", completedAt: "2024-01-12" },
  { id: "2", referrerId: "usr_002", referrerName: "Sarah Okonkwo", refereeId: "usr_011", refereeName: "Blessing Eze", referralCode: "REF-SO-002", rewardAmount: 5000, status: "pending", referredAt: "2024-01-14" },
  { id: "3", referrerId: "usr_003", referrerName: "Michael Eze", refereeId: "usr_012", refereeName: "Emmanuel Obi", referralCode: "REF-ME-003", rewardAmount: 5000, status: "paid", referredAt: "2024-01-05", completedAt: "2024-01-08" },
  { id: "4", referrerId: "usr_004", referrerName: "Grace Nwosu", refereeId: "usr_013", refereeName: "Joy Nwachukwu", referralCode: "REF-GN-004", rewardAmount: 5000, status: "completed", referredAt: "2024-01-08", completedAt: "2024-01-15" },
];

export default function ReferralProgramPage() {
  const [referrals] = useState<Referral[]>(REFERRALS);
  const [search, setSearch] = useState("");

  const filtered = referrals.filter((r) => r.referrerName.toLowerCase().includes(search.toLowerCase()) || r.refereeName.toLowerCase().includes(search.toLowerCase()));
  const formatCurrency = (v: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(v);
  const totalPaid = referrals.filter((r) => r.status === "paid").reduce((s, r) => s + r.rewardAmount, 0);
  const totalPending = referrals.filter((r) => r.status === "pending" || r.status === "completed").reduce((s, r) => s + r.rewardAmount, 0);

  return (
    <MainLayout title="Referral Program" subtitle="Manage member referral rewards">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><Gift className="h-5 w-5 text-cyan-600" /><h2 className="text-lg font-semibold">Referral Rewards</h2></div>
          <Button className="bg-cyan-600 hover:bg-cyan-700"><Gift className="h-4 w-4 mr-2" />Configure Program</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-cyan-100 flex items-center justify-center"><Gift className="h-5 w-5 text-cyan-600" /></div><div><p className="text-sm text-slate-500">Total Referrals</p><p className="text-2xl font-bold">{referrals.length}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center"><DollarSign className="h-5 w-5 text-green-600" /></div><div><p className="text-sm text-slate-500">Rewards Paid</p><p className="text-2xl font-bold">{formatCurrency(totalPaid)}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center"><TrendingUp className="h-5 w-5 text-yellow-600" /></div><div><p className="text-sm text-slate-500">Pending Rewards</p><p className="text-2xl font-bold">{formatCurrency(totalPending)}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center"><Users className="h-5 w-5 text-purple-600" /></div><div><p className="text-sm text-slate-500">Success Rate</p><p className="text-2xl font-bold">{Math.round((referrals.filter((r) => r.status === "completed" || r.status === "paid").length / referrals.length) * 100)}%</p></div></div></CardContent></Card>
        </div>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Referral History</CardTitle>
            <div className="relative"><Gift className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><Input placeholder="Search referrals..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 w-64" /></div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b"><tr><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Referrer</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Referee</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Code</th><th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Reward</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Referred</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th></tr></thead>
                <tbody className="divide-y">
                  {filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3"><div><p className="font-medium">{r.referrerName}</p><p className="text-xs text-slate-500">{r.referrerId}</p></div></td>
                      <td className="px-4 py-3"><div><p className="font-medium">{r.refereeName}</p><p className="text-xs text-slate-500">{r.refereeId}</p></div></td>
                      <td className="px-4 py-3"><code className="text-sm bg-slate-100 px-2 py-1 rounded">{r.referralCode}</code></td>
                      <td className="px-4 py-3 text-right font-medium text-green-600">{formatCurrency(r.rewardAmount)}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{r.referredAt}</td>
                      <td className="px-4 py-3"><Badge className={r.status === "paid" ? "bg-green-100 text-green-700" : r.status === "completed" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}>{r.status}</Badge></td>
                      <td className="px-4 py-3"><div className="flex items-center gap-1"><Button variant="ghost" size="icon" className="h-8 w-8"><Copy className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button></div></td>
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
