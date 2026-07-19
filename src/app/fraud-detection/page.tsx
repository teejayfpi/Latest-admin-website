"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";
import { AlertTriangle, Shield, Search, Eye, Ban, CheckCircle, Flag } from "lucide-react";

interface FraudAlert {
  id: string;
  memberId: string;
  memberName: string;
  type: "suspicious_pattern" | "large_transaction" | "identity_mismatch" | "multiple_accounts";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  date: string;
  status: "pending" | "investigating" | "resolved" | "dismissed";
}

const ALERTS: FraudAlert[] = [
  { id: "1", memberId: "usr_007", memberName: "Unknown User", type: "identity_mismatch", severity: "critical", description: "KYC documents do not match registration details", date: "2024-01-15 14:30", status: "pending" },
  { id: "2", memberId: "usr_012", memberName: "Robert Smith", type: "large_transaction", severity: "high", description: "Unusual transaction of ₦5,000,000 in 24 hours", date: "2024-01-14 09:15", status: "investigating" },
  { id: "3", memberId: "usr_023", memberName: "Jane Doe", type: "suspicious_pattern", severity: "medium", description: "Multiple failed login attempts from different IPs", date: "2024-01-13 18:45", status: "pending" },
  { id: "4", memberId: "usr_031", memberName: "Mike Johnson", type: "multiple_accounts", severity: "medium", description: "3 accounts registered with similar details", date: "2024-01-12 11:20", status: "resolved" },
  { id: "5", memberId: "usr_045", memberName: "Alice Brown", type: "large_transaction", severity: "high", description: "Withdrawal request exceeds typical pattern by 300%", date: "2024-01-11 16:00", status: "pending" },
];

export default function FraudDetectionPage() {
  const [alerts, setAlerts] = useState<FraudAlert[]>(ALERTS);
  const [search, setSearch] = useState("");

  const filtered = alerts.filter((a) => a.memberName.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase()));

  const getSeverityColor = (s: string) => ({ critical: "bg-red-100 text-red-700 border-red-200", high: "bg-orange-100 text-orange-700 border-orange-200", medium: "bg-yellow-100 text-yellow-700 border-yellow-200", low: "bg-blue-100 text-blue-700 border-blue-200" }[s] || "");
  const getStatusColor = (s: string) => ({ pending: "bg-yellow-100 text-yellow-700", investigating: "bg-blue-100 text-blue-700", resolved: "bg-green-100 text-green-700", dismissed: "bg-slate-100 text-slate-700" }[s] || "");

  const handleResolve = (id: string) => { setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, status: "resolved" } : a)); toast.success("Alert marked as resolved"); };
  const handleDismiss = (id: string) => { setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, status: "dismissed" } : a)); toast.info("Alert dismissed"); };
  const handleFlag = (id: string) => { setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, status: "investigating" } : a)); toast.warning("Flagged for investigation"); };

  return (
    <MainLayout title="Fraud Detection" subtitle="Monitor and investigate suspicious activities">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center"><AlertTriangle className="h-5 w-5 text-red-600" /></div><div><p className="text-sm text-slate-500">Critical Alerts</p><p className="text-2xl font-bold">{alerts.filter((a) => a.severity === "critical").length}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center"><AlertTriangle className="h-5 w-5 text-orange-600" /></div><div><p className="text-sm text-slate-500">High Priority</p><p className="text-2xl font-bold">{alerts.filter((a) => a.severity === "high").length}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center"><Shield className="h-5 w-5 text-yellow-600" /></div><div><p className="text-sm text-slate-500">Under Investigation</p><p className="text-2xl font-bold">{alerts.filter((a) => a.status === "investigating").length}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center"><CheckCircle className="h-5 w-5 text-green-600" /></div><div><p className="text-sm text-slate-500">Resolved Today</p><p className="text-2xl font-bold">{alerts.filter((a) => a.status === "resolved").length}</p></div></div></CardContent></Card>
        </div>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-red-600" />Fraud Alerts</CardTitle>
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><Input placeholder="Search alerts..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 w-64" /></div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {filtered.map((alert) => (
                <div key={alert.id} className="p-4 hover:bg-slate-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${alert.severity === "critical" ? "bg-red-100" : alert.severity === "high" ? "bg-orange-100" : "bg-yellow-100"}`}>
                        <AlertTriangle className={`h-5 w-5 ${alert.severity === "critical" ? "text-red-600" : alert.severity === "high" ? "text-orange-600" : "text-yellow-600"}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{alert.memberName}</p>
                          <Badge className={getSeverityColor(alert.severity)} variant="outline">{alert.severity}</Badge>
                          <Badge className={getStatusColor(alert.status)}>{alert.status}</Badge>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">{alert.description}</p>
                        <p className="text-xs text-slate-400 mt-1">ID: {alert.memberId} • {alert.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                      {alert.status === "pending" && <Button variant="ghost" size="sm" onClick={() => handleFlag(alert.id)}><Flag className="h-4 w-4 mr-1" />Flag</Button>}
                      {alert.status === "investigating" && <Button variant="ghost" size="sm" className="text-green-600" onClick={() => handleResolve(alert.id)}><CheckCircle className="h-4 w-4 mr-1" />Resolve</Button>}
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => handleDismiss(alert.id)}><Ban className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
