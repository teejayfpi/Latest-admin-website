"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog";
import { Label } from "@/components/ui/Label";
import { toast } from "sonner";
import { Bell, Send, Users, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "alert";
  sentAt: string;
  recipients: number;
  status: "sent" | "pending" | "failed";
}

const NOTIFICATIONS: Notification[] = [
  { id: "1", title: "System Maintenance", message: "Scheduled maintenance on Saturday 2AM-4AM", type: "info", sentAt: "2024-01-15 10:00", recipients: 1250, status: "sent" },
  { id: "2", title: "New Interest Rates", message: "Updated interest rates effective from February", type: "success", sentAt: "2024-01-14 09:00", recipients: 980, status: "sent" },
  { id: "3", title: "KYC Deadline Reminder", message: "Complete your KYC verification by end of month", type: "warning", sentAt: "2024-01-13 14:00", recipients: 85, status: "sent" },
  { id: "4", title: "Loan Approval Alert", message: "Your loan application has been approved", type: "success", sentAt: "2024-01-12 11:00", recipients: 1, status: "sent" },
];

export default function NotificationsPage() {
  const [notifications] = useState<Notification[]>(NOTIFICATIONS);
  const [showCompose, setShowCompose] = useState(false);
  const [newNotification, setNewNotification] = useState({ title: "", message: "", type: "info", recipients: "all" });

  const handleSend = () => {
    if (!newNotification.title || !newNotification.message) { toast.error("Please fill all fields"); return; }
    toast.success("Notification sent successfully");
    setShowCompose(false);
    setNewNotification({ title: "", message: "", type: "info", recipients: "all" });
  };

  const getTypeColor = (t: string) => ({ info: "bg-blue-100 text-blue-700", warning: "bg-yellow-100 text-yellow-700", success: "bg-green-100 text-green-700", alert: "bg-red-100 text-red-700" }[t] || "");

  return (
    <MainLayout title="Notifications" subtitle="Send push notifications to members">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><Bell className="h-5 w-5 text-cyan-600" /><h2 className="text-lg font-semibold">Push Notifications</h2></div>
          <Button className="bg-cyan-600 hover:bg-cyan-700" onClick={() => setShowCompose(true)}><Send className="h-4 w-4 mr-2" />Compose</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-cyan-100 flex items-center justify-center"><Bell className="h-5 w-5 text-cyan-600" /></div><div><p className="text-sm text-slate-500">Total Sent</p><p className="text-2xl font-bold">{notifications.length}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center"><CheckCircle className="h-5 w-5 text-green-600" /></div><div><p className="text-sm text-slate-500">Delivered</p><p className="text-2xl font-bold">{notifications.filter((n) => n.status === "sent").length}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center"><Users className="h-5 w-5 text-blue-600" /></div><div><p className="text-sm text-slate-500">Total Recipients</p><p className="text-2xl font-bold">{notifications.reduce((s, n) => s + n.recipients, 0).toLocaleString()}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center"><Clock className="h-5 w-5 text-yellow-600" /></div><div><p className="text-sm text-slate-500">Pending</p><p className="text-2xl font-bold">{notifications.filter((n) => n.status === "pending").length}</p></div></div></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Notification History</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {notifications.map((n) => (
              <div key={n.id} className="p-4 border rounded-lg hover:bg-slate-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${getTypeColor(n.type)}`}><Bell className="h-4 w-4" /></div>
                    <div>
                      <div className="flex items-center gap-2"><p className="font-medium">{n.title}</p><Badge className={getTypeColor(n.type)}>{n.type}</Badge></div>
                      <p className="text-sm text-slate-600 mt-1">{n.message}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-400"><span>Sent: {n.sentAt}</span><span>Recipients: {n.recipients}</span></div>
                    </div>
                  </div>
                  <Badge className={n.status === "sent" ? "bg-green-100 text-green-700" : n.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}>{n.status}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showCompose} onOpenChange={setShowCompose}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Compose Notification</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div><Label>Title</Label><Input value={newNotification.title} onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })} placeholder="Notification title" /></div>
            <div><Label>Message</Label><Textarea value={newNotification.message} onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })} rows={4} placeholder="Notification message..." /></div>
            <div><Label>Type</Label>
              <select value={newNotification.type} onChange={(e) => setNewNotification({ ...newNotification, type: e.target.value })} className="w-full border rounded-lg px-3 py-2">
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="success">Success</option>
                <option value="alert">Alert</option>
              </select>
            </div>
            <div><Label>Recipients</Label>
              <select value={newNotification.recipients} onChange={(e) => setNewNotification({ ...newNotification, recipients: e.target.value })} className="w-full border rounded-lg px-3 py-2">
                <option value="all">All Members (1,250)</option>
                <option value="active">Active Members Only</option>
                <option value="pending_kyc">Pending KYC</option>
                <option value="with_loans">Members with Loans</option>
              </select>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowCompose(false)}>Cancel</Button><Button className="bg-cyan-600 hover:bg-cyan-700" onClick={handleSend}><Send className="h-4 w-4 mr-2" />Send Notification</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
