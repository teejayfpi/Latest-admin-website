"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Progress } from "@/components/ui/Progress";
import { Search, TrendingUp, AlertTriangle, Shield, Eye } from "lucide-react";

interface MemberRisk {
  id: string;
  memberId: string;
  memberName: string;
  score: number;
  factors: { name: string; impact: number; description: string }[];
  tier: "low" | "medium" | "high";
  lastUpdated: string;
}

const RISK_DATA: MemberRisk[] = [
  { id: "1", memberId: "usr_001", memberName: "John Adebayo", score: 85, tier: "low", lastUpdated: "2024-01-15", factors: [{ name: "On-time payments", impact: 20, description: "100% payment history" }, { name: "Savings ratio", impact: 15, description: "Maintains 6+ months savings" }] },
  { id: "2", memberId: "usr_002", memberName: "Sarah Okonkwo", score: 72, tier: "low", lastUpdated: "2024-01-14", factors: [{ name: "Active contributions", impact: 18, description: "Regular monthly contributions" }] },
  { id: "3", memberId: "usr_003", memberName: "Michael Eze", score: 45, tier: "medium", lastUpdated: "2024-01-13", factors: [{ name: "Late payments", impact: -15, description: "2 late payments in 6 months" }, { name: "Low savings", impact: -10, description: "Below minimum threshold" }] },
  { id: "4", memberId: "usr_004", memberName: "Grace Nwosu", score: 92, tier: "low", lastUpdated: "2024-01-12", factors: [{ name: "Excellent history", impact: 25, description: "5+ years member" }, { name: "High savings", impact: 20, description: "Above target savings" }] },
  { id: "5", memberId: "usr_005", memberName: "David Igwe", score: 28, tier: "high", lastUpdated: "2024-01-11", factors: [{ name: "Default history", impact: -25, description: "Previous loan default" }, { name: "Flagged account", impact: -15, description: "Under investigation" }] },
];

export default function RiskScoringPage() {
  const [members] = useState<MemberRisk[]>(RISK_DATA);
  const [search, setSearch] = useState("");

  const filtered = members.filter((m) => m.memberName.toLowerCase().includes(search.toLowerCase()));
  const getTierColor = (t: string) => ({ low: "bg-green-100 text-green-700", medium: "bg-yellow-100 text-yellow-700", high: "bg-red-100 text-red-700" }[t] || "");
  const getScoreColor = (s: number) => s >= 70 ? "text-green-600" : s >= 40 ? "text-yellow-600" : "text-red-600";

  return (
    <MainLayout title="Risk Scoring" subtitle="Member risk assessment and scoring">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center"><Shield className="h-5 w-5 text-green-600" /></div><div><p className="text-sm text-slate-500">Low Risk</p><p className="text-2xl font-bold">{members.filter((m) => m.tier === "low").length}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center"><TrendingUp className="h-5 w-5 text-yellow-600" /></div><div><p className="text-sm text-slate-500">Medium Risk</p><p className="text-2xl font-bold">{members.filter((m) => m.tier === "medium").length}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center"><AlertTriangle className="h-5 w-5 text-red-600" /></div><div><p className="text-sm text-slate-500">High Risk</p><p className="text-2xl font-bold">{members.filter((m) => m.tier === "high").length}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-cyan-100 flex items-center justify-center"><TrendingUp className="h-5 w-5 text-cyan-600" /></div><div><p className="text-sm text-slate-500">Avg Score</p><p className="text-2xl font-bold">{Math.round(members.reduce((s, m) => s + m.score, 0) / members.length)}</p></div></div></CardContent></Card>
        </div>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Member Risk Scores</CardTitle>
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><Input placeholder="Search members..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 w-64" /></div>
          </CardHeader>
          <CardContent className="space-y-4">
            {filtered.map((member) => (
              <div key={member.id} className="p-4 border rounded-lg hover:bg-slate-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-medium">{member.memberName.charAt(0)}</div>
                    <div>
                      <p className="font-medium">{member.memberName}</p>
                      <p className="text-xs text-slate-500">{member.memberId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getTierColor(member.tier)}>{member.tier.toUpperCase()} RISK</Badge>
                    <div className="text-right"><p className={`text-2xl font-bold ${getScoreColor(member.score)}`}>{member.score}</p><p className="text-xs text-slate-500">/ 100</p></div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1"><span>Risk Score</span><span className={getScoreColor(member.score)}>{member.score}%</span></div>
                  <Progress value={member.score} className="h-2" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {member.factors.map((f, i) => (
                    <div key={i} className={`px-3 py-1 rounded-full text-xs ${f.impact > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {f.name} ({f.impact > 0 ? "+" : ""}{f.impact})
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
