"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";
import { Search, Monitor, Smartphone, Globe, LogOut, AlertTriangle } from "lucide-react";

interface Session {
  id: string;
  userId: string;
  userName: string;
  email: string;
  device: "desktop" | "mobile" | "tablet";
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  createdAt: string;
  isCurrent: boolean;
}

const SESSIONS: Session[] = [
  { id: "1", userId: "adm_001", userName: "Admin User", email: "admin@coopvest.com", device: "desktop", browser: "Chrome 120", ip: "102.89.45.12", location: "Lagos, Nigeria", lastActive: "Just now", createdAt: "2024-01-15 08:00:00", isCurrent: true },
  { id: "2", userId: "adm_001", userName: "Admin User", email: "admin@coopvest.com", device: "mobile", browser: "Safari iOS", ip: "197.210.78.34", location: "Lagos, Nigeria", lastActive: "2 hours ago", createdAt: "2024-01-14 16:30:00", isCurrent: false },
  { id: "3", userId: "adm_002", userName: "John Manager", email: "john@coopvest.com", device: "desktop", browser: "Firefox 121", ip: "105.112.23.56", location: "Abuja, Nigeria", lastActive: "5 minutes ago", createdAt: "2024-01-15 10:00:00", isCurrent: true },
  { id: "4", userId: "adm_002", userName: "John Manager", email: "john@coopvest.com", device: "tablet", browser: "Chrome Android", ip: "54.85.123.45", location: "Unknown", lastActive: "1 day ago", createdAt: "2024-01-10 09:00:00", isCurrent: false },
  { id: "5", userId: "adm_003", userName: "Sarah Officer", email: "sarah@coopvest.com", device: "desktop", browser: "Edge 120", ip: "197.211.45.78", location: "Ibadan, Nigeria", lastActive: "30 minutes ago", createdAt: "2024-01-15 11:00:00", isCurrent: true },
];

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>(SESSIONS);
  const [search, setSearch] = useState("");

  const filtered = sessions.filter((s) => s.userName.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()));
  const getDeviceIcon = (d: string) => d === "mobile" ? <Smartphone className="h-4 w-4" /> : d === "tablet" ? <Smartphone className="h-4 w-4" /> : <Monitor className="h-4 w-4" />;

  const terminateSession = (id: string) => { setSessions((prev) => prev.filter((s) => s.id !== id)); toast.success("Session terminated"); };
  const terminateAllOther = (userId: string) => { setSessions((prev) => prev.filter((s) => s.userId !== userId || s.isCurrent)); toast.success("All other sessions terminated"); };

  return (
    <MainLayout title="Active Sessions" subtitle="Manage admin login sessions">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-cyan-100 flex items-center justify-center"><Monitor className="h-5 w-5 text-cyan-600" /></div><div><p className="text-sm text-slate-500">Active Sessions</p><p className="text-2xl font-bold">{sessions.length}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center"><Globe className="h-5 w-5 text-green-600" /></div><div><p className="text-sm text-slate-500">Unique Users</p><p className="text-2xl font-bold">{new Set(sessions.map((s) => s.userId)).size}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center"><Smartphone className="h-5 w-5 text-purple-600" /></div><div><p className="text-sm text-slate-500">Mobile Sessions</p><p className="text-2xl font-bold">{sessions.filter((s) => s.device === "mobile").length}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center"><AlertTriangle className="h-5 w-5 text-yellow-600" /></div><div><p className="text-sm text-slate-500">Suspicious Locations</p><p className="text-2xl font-bold">{sessions.filter((s) => s.location === "Unknown").length}</p></div></div></CardContent></Card>
        </div>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>All Active Sessions</CardTitle>
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 w-64" /></div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b"><tr><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">User</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Device</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Location</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Last Active</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th></tr></thead>
                <tbody className="divide-y">
                  {filtered.map((session) => (
                    <tr key={session.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3"><div><div className="flex items-center gap-2"><p className="font-medium">{session.userName}</p>{session.isCurrent && <Badge className="bg-green-100 text-green-700">Current</Badge>}</div><p className="text-xs text-slate-500">{session.email}</p></div></td>
                      <td className="px-4 py-3"><div className="flex items-center gap-2">{getDeviceIcon(session.device)}<span className="text-sm capitalize">{session.device}</span></div><p className="text-xs text-slate-500">{session.browser}</p></td>
                      <td className="px-4 py-3"><div className="flex items-center gap-2"><Globe className="h-4 w-4 text-slate-400" /><span className="text-sm">{session.location}</span></div><p className="text-xs text-slate-500 font-mono">{session.ip}</p></td>
                      <td className="px-4 py-3 text-sm text-slate-500">{session.lastActive}</td>
                      <td className="px-4 py-3"><Badge className={session.location === "Unknown" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}>{session.location === "Unknown" ? "Suspicious" : "Normal"}</Badge></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {!session.isCurrent && <Button variant="ghost" size="sm" className="text-red-600" onClick={() => terminateSession(session.id)}><LogOut className="h-4 w-4 mr-1" />Terminate</Button>}
                          {!session.isCurrent && <Button variant="ghost" size="sm" onClick={() => terminateAllOther(session.userId)}>Terminate Others</Button>}
                        </div>
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
