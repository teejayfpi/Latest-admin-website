"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog";
import { toast } from "sonner";
import { Users, Upload, Download, CheckCircle, Send, Bell, Mail, AlertTriangle } from "lucide-react";

interface BulkOperation {
  id: string;
  name: string;
  type: "notification" | "email" | "kyc" | "activation" | "suspension";
  status: "pending" | "in_progress" | "completed" | "failed";
  total: number;
  processed: number;
  createdAt: string;
  createdBy: string;
}

const OPERATIONS: BulkOperation[] = [
  { id: "1", name: "January Statement Notification", type: "notification", status: "completed", total: 1200, processed: 1200, createdAt: "2024-01-15", createdBy: "Admin" },
  { id: "2", name: "KYC Reminder Emails", type: "email", status: "completed", total: 85, processed: 85, createdAt: "2024-01-14", createdBy: "Admin" },
  { id: "3", name: "New Year Promotion", type: "notification", status: "in_progress", total: 1500, processed: 890, createdAt: "2024-01-13", createdBy: "Admin" },
  { id: "4", name: "Account Activation Campaign", type: "activation", status: "pending", total: 45, processed: 0, createdAt: "2024-01-12", createdBy: "Admin" },
];

export default function BulkOperationsPage() {
  const [operations] = useState<BulkOperation[]>(OPERATIONS);
  const [showModal, setShowModal] = useState(false);
  const [operationType, setOperationType] = useState("notification");
  const [operationName, setOperationName] = useState("");
  const [targetCount, setTargetCount] = useState("");
  const [message, setMessage] = useState("");

  const handleCreate = () => {
    if (!operationName || !targetCount) { toast.error("Please fill required fields"); return; }
    toast.success("Bulk operation created successfully");
    setShowModal(false);
    setOperationName("");
    setTargetCount("");
    setMessage("");
  };

  const getStatusColor = (s: string) => ({ pending: "bg-yellow-100 text-yellow-700", in_progress: "bg-blue-100 text-blue-700", completed: "bg-green-100 text-green-700", failed: "bg-red-100 text-red-700" }[s] || "");
  const getTypeIcon = (t: string) => ({ notification: "🔔", email: "📧", kyc: "🪪", activation: "✅", suspension: "🚫" }[t] || "📋");

  return (
    <MainLayout title="Bulk Operations" subtitle="Execute batch operations on multiple members">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><Users className="h-5 w-5 text-cyan-600" /><h2 className="text-lg font-semibold">Bulk Operations</h2></div>
          <Button className="bg-cyan-600 hover:bg-cyan-700" onClick={() => setShowModal(true)}><Upload className="h-4 w-4 mr-2" />Create Operation</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card><CardContent className="p-4"><p className="text-sm text-slate-500">Total Operations</p><p className="text-2xl font-bold">{operations.length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-slate-500">In Progress</p><p className="text-2xl font-bold">{operations.filter((o) => o.status === "in_progress").length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-slate-500">Completed</p><p className="text-2xl font-bold">{operations.filter((o) => o.status === "completed").length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-slate-500">Total Processed</p><p className="text-2xl font-bold">{operations.reduce((s, o) => s + o.processed, 0).toLocaleString()}</p></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Recent Operations</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b"><tr><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Operation</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Progress</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Created</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th></tr></thead>
                <tbody className="divide-y">
                  {operations.map((op) => (
                    <tr key={op.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3"><p className="font-medium">{op.name}</p><p className="text-xs text-slate-500">By {op.createdBy}</p></td>
                      <td className="px-4 py-3"><Badge variant="outline">{getTypeIcon(op.type)} {op.type}</Badge></td>
                      <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-cyan-600 rounded-full" style={{ width: `${(op.processed / op.total) * 100}%` }} /></div><span className="text-xs text-slate-500">{op.processed}/{op.total}</span></div></td>
                      <td className="px-4 py-3"><Badge className={getStatusColor(op.status)}>{op.status}</Badge></td>
                      <td className="px-4 py-3 text-sm text-slate-500">{op.createdAt}</td>
                      <td className="px-4 py-3"><Button variant="ghost" size="sm">View</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Create Bulk Operation</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div><label className="text-sm font-medium">Operation Name</label><Input value={operationName} onChange={(e) => setOperationName(e.target.value)} placeholder="e.g., January Statement Notification" /></div>
            <div><label className="text-sm font-medium">Type</label>
              <select value={operationType} onChange={(e) => setOperationType(e.target.value)} className="w-full border rounded-lg px-3 py-2">
                <option value="notification">🔔 Push Notification</option>
                <option value="email">📧 Email</option>
                <option value="kyc">🪪 KYC Reminder</option>
                <option value="activation">✅ Account Activation</option>
                <option value="suspension">🚫 Account Suspension</option>
              </select>
            </div>
            <div><label className="text-sm font-medium">Target Count</label><Input type="number" value={targetCount} onChange={(e) => setTargetCount(e.target.value)} placeholder="Number of members" /></div>
            <div><label className="text-sm font-medium">Message (for notifications/emails)</label><Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Enter message content..." /></div>
            <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg"><AlertTriangle className="h-5 w-5 text-yellow-600" /><p className="text-sm text-yellow-800">This operation will affect {targetCount || 0} members. Please verify before proceeding.</p></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button><Button className="bg-cyan-600 hover:bg-cyan-700" onClick={handleCreate}>Create Operation</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
