"use client";

import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DataTable } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { formatDateTime, getInitials } from "@/lib/utils";
import { Shield, Edit, Trash2, Plus, CheckCircle, XCircle } from "lucide-react";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockLogs = [
        { id: "log-1", actor: { name: "System Admin", role: "superadmin" }, action: "user.update", entity_type: "profile", entity_id: "1", ip_address: "192.168.1.1", created_at: "2024-06-15T10:30:00Z", changes: { is_active: { from: false, to: true } } },
        { id: "log-2", actor: { name: "KYC Reviewer", role: "staff" }, action: "kyc.approve", entity_type: "kyc", entity_id: "kyc-1", ip_address: "192.168.1.2", created_at: "2024-06-15T09:15:00Z", changes: { status: { from: "pending", to: "verified" } } },
        { id: "log-3", actor: { name: "System Admin", role: "superadmin" }, action: "loan.approve", entity_type: "loan", entity_id: "loan-1", ip_address: "192.168.1.1", created_at: "2024-06-14T16:00:00Z", changes: { status: { from: "pending", to: "approved" } } },
        { id: "log-4", actor: { name: "KYC Reviewer", role: "staff" }, action: "user.flag", entity_type: "profile", entity_id: "3", ip_address: "192.168.1.2", created_at: "2024-06-14T11:30:00Z", changes: { is_flagged: { from: false, to: true } } },
        { id: "log-5", actor: { name: "System Admin", role: "superadmin" }, action: "settings.update", entity_type: "system_settings", entity_id: "settings-1", ip_address: "192.168.1.1", created_at: "2024-06-13T08:00:00Z", changes: { maintenance_mode: { from: false, to: true } } },
      ];

      setLogs(mockLogs);
      setTotalPages(10);
      setLoading(false);
    };

    fetchLogs();
  }, [page]);

  const getActionIcon = (action: string) => {
    if (action.includes("create")) return Plus;
    if (action.includes("update")) return Edit;
    if (action.includes("delete")) return Trash2;
    if (action.includes("approve")) return CheckCircle;
    if (action.includes("reject")) return XCircle;
    return Shield;
  };

  const getActionColor = (action: string) => {
    if (action.includes("create")) return "text-green-600 bg-green-100";
    if (action.includes("update")) return "text-blue-600 bg-blue-100";
    if (action.includes("delete")) return "text-red-600 bg-red-100";
    if (action.includes("approve")) return "text-emerald-600 bg-emerald-100";
    if (action.includes("reject")) return "text-orange-600 bg-orange-100";
    return "text-slate-600 bg-slate-100";
  };

  const columns = [
    { key: "timestamp", header: "Timestamp", render: (log: any) => <span className="text-sm text-slate-600">{formatDateTime(log.created_at)}</span> },
    { key: "actor", header: "Actor", render: (log: any) => (
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-bold text-white">{getInitials(log.actor?.name)}</div>
        <div><p className="text-sm font-medium text-slate-900">{log.actor?.name || "System"}</p><p className="text-xs text-slate-500">{log.actor?.role}</p></div>
      </div>
    )},
    { key: "action", header: "Action", render: (log: any) => {
      const Icon = getActionIcon(log.action);
      const colorClass = getActionColor(log.action);
      return (
        <div className="flex items-center gap-2">
          <div className={`rounded-lg p-1.5 ${colorClass}`}><Icon className="h-3.5 w-3.5" /></div>
          <span className="text-sm font-medium text-slate-900">{log.action.replace(".", " ").replace("_", " ")}</span>
        </div>
      );
    }},
    { key: "entity", header: "Entity", render: (log: any) => (
      <div>
        <p className="text-sm font-medium text-slate-900 capitalize">{log.entity_type.replace("_", " ")}</p>
        <p className="font-mono text-xs text-slate-500">{log.entity_id}</p>
      </div>
    )},
    { key: "ip", header: "IP Address", render: (log: any) => <span className="font-mono text-sm text-slate-600">{log.ip_address || "N/A"}</span> },
  ];

  return (
    <MainLayout title="Audit Logs" subtitle="Track all administrative actions and changes">
      <div className="space-y-6">
        <DataTable columns={columns} data={logs} loading={loading} emptyMessage="No audit logs found" />
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} totalCount={200} pageSize={50} />
      </div>
    </MainLayout>
  );
}
