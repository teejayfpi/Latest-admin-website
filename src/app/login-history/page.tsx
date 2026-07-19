"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Search, Monitor, Smartphone, Globe, AlertTriangle, Clock } from "lucide-react";

interface LoginRecord {
  id: string;
  userId: string;
  userName: string;
  email: string;
  timestamp: string;
  device: "desktop" | "mobile" | "tablet";
  browser: string;
  ip: string;
  location: string;
  status: "success" | "failed";
  failureReason?: string;
}

const LOGINS: LoginRecord[] = [
  { id: "1", userId: "adm_001", userName: "Admin User", email: "admin@coopvest.com", timestamp: "2024-01-15 14:32:15", device: "desktop", browser: "Chrome 120", ip: "102.89.45.12", location: "Lagos, Nigeria", status: "success" },
  { id: "2", userId: "adm_002", userName: "John Manager", email: "john@coopvest.com", timestamp: "2024-01-15 13:45:22", device: "mobile", browser: "Safari iOS", ip: "197.210.78.34", location: "Abuja, Nigeria", status: "success" },
  { id: "3", userId: "adm_003", userName: "Sarah Officer", email: "sarah@coopvest.com", timestamp: "2024-01-15 12:18:09", device: "desktop", browser: "Firefox 121", ip: "105.112.23.56", location: "Port Harcourt, Nigeria", status: "failed", failureReason: "Invalid password" },
  { id: "4", userId: "adm_001", userName: "Admin User", email: "admin@coopvest.com", timestamp: "2024-01-15 09:30:00", device: "tablet", browser: "Chrome Android", ip: "102.89.45.12", location: "Lagos, Nigeria", status: "success" },
  { id: "5", userId: "adm_004", userName: "Mike Staff", email: "mike@coopvest.com", timestamp: "2024-01-15 08:15:33", device: "desktop", browser: "Edge 120", ip: "197.211.45.78", location: "Ibadan, Nigeria", status: "success" },
];

export default function LoginHistoryPage() {
  const [logins] = useState<LoginRecord[]>(LOGINS);
  const [search, setSearch] = useState("");

  const filtered = logins.filter((l) => l.userName.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase()) || l.ip.includes(search));
  const getDeviceIcon = (d: string) => d === "mobile" ? <Smartphone className="h-4 w-4" /> : d === "tablet" ? <Smartphone className="h-4 w-4" /> : <Monitor className="h-4 w-4" />;

  return (
    <MainLayout title="Login History" subtitle="Track admin login activities">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-cyan-100 flex items-center justify-center"><Clock className="h-5 w-5 text-cyan-600" /></div><div><p className="text-sm text-slate-500">Today&apos;s Logins</p><p className="text-2xl font-bold">{logins.length}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center"><Globe className="h-5 w-5 text-green-600" /></div><div><p className="text-sm text-slate-500">Successful</p><p className="text-2xl font-bold">{logins.filter((l) => l.status === "success").length}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center"><AlertTriangle className="h-5 w-5 text-red-600" /></div><div><p className="text-sm text-slate-500">Failed Attempts</p><p className="text-2xl font-bold">{logins.filter((l) => l.status === "failed").length}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center"><Smartphone className="h-5 w-5 text-purple-600" /></div><div><p className="text-sm text-slate-500">Unique Users</p><p className="text-2xl font-bold">{new Set(logins.map((l) => l.userId)).size}</p></div></div></CardContent></Card>
        </div>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent Logins</CardTitle>
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><Input placeholder="Search by name, email, or IP..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 w-64" /></div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b"><tr><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">User</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Device</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Browser</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">IP / Location</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Timestamp</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th></tr></thead>
                <tbody className="divide-y">
                  {filtered.map((login) => (
                    <tr key={login.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3"><div><p className="font-medium">{login.userName}</p><p className="text-xs text-slate-500">{login.email}</p></div></td>
                      <td className="px-4 py-3"><div className="flex items-center gap-2">{getDeviceIcon(login.device)}<span className="text-sm capitalize">{login.device}</span></div></td>
                      <td className="px-4 py-3 text-sm">{login.browser}</td>
                      <td className="px-4 py-3"><div><p className="font-mono text-sm">{login.ip}</p><p className="text-xs text-slate-500">{login.location}</p></div></td>
                      <td className="px-4 py-3 text-sm text-slate-500">{login.timestamp}</td>
                      <td className="px-4 py-3"><Badge className={login.status === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>{login.status}</Badge>{login.failureReason && <p className="text-xs text-red-500 mt-1">{login.failureReason}</p>}</td>
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
