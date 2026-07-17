"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { formatDate, getInitials } from "@/lib/utils";
import { Plus, Bell, Megaphone, AlertTriangle, Info, Settings, Trash2, Edit } from "lucide-react";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([
    { id: "1", title: "System Maintenance Scheduled", content: "The platform will be undergoing scheduled maintenance on Saturday from 2 AM to 6 AM. All services will be temporarily unavailable.", category: "maintenance", priority: "high", target_audience: "all", is_active: true, starts_at: "2024-06-20T02:00:00Z", expires_at: "2024-06-20T06:00:00Z", created_by: "admin-1", created_at: "2024-06-15T10:00:00Z" },
    { id: "2", title: "New Loan Products Available", content: "We're excited to announce new loan products with lower interest rates. Check out the updated loan options in the app.", category: "promotion", priority: "normal", target_audience: "all", is_active: true, starts_at: "2024-06-10T00:00:00Z", expires_at: "2024-07-10T00:00:00Z", created_by: "admin-1", created_at: "2024-06-10T08:00:00Z" },
    { id: "3", title: "Important Security Update", content: "Please ensure you have enabled two-factor authentication on your account for enhanced security.", category: "alert", priority: "high", target_audience: "members", is_active: true, starts_at: "2024-06-01T00:00:00Z", expires_at: null, created_by: "admin-2", created_at: "2024-06-01T12:00:00Z" },
    { id: "4", title: "Updated Terms of Service", content: "We've updated our terms of service. Please review the changes which take effect from July 1, 2024.", category: "update", priority: "normal", target_audience: "all", is_active: false, starts_at: "2024-06-15T00:00:00Z", expires_at: "2024-07-15T00:00:00Z", created_by: "admin-1", created_at: "2024-06-15T09:00:00Z" },
  ]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = { maintenance: Settings, promotion: Megaphone, alert: AlertTriangle, update: Info, general: Bell };
    return icons[category] || Bell;
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = { low: "bg-slate-100 text-slate-600", normal: "bg-blue-100 text-blue-700", high: "bg-orange-100 text-orange-700", urgent: "bg-red-100 text-red-700" };
    return colors[priority] || colors.normal;
  };

  return (
    <MainLayout title="Announcements" subtitle="Create and manage system announcements">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            {["all", "active", "scheduled"].map((filter) => (
              <button key={filter} className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${filter === "all" ? "bg-cyan-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
          <Button icon={Plus} onClick={() => setShowCreateModal(true)}>New Announcement</Button>
        </div>

        <div className="space-y-4">
          {announcements.map((ann) => {
            const Icon = getCategoryIcon(ann.category);
            return (
              <div key={ann.id} className={`rounded-xl border p-6 transition-all hover:shadow-md ${ann.is_active ? "border-cyan-200 bg-white" : "border-slate-200 bg-slate-50 opacity-75"}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`rounded-lg p-3 ${ann.is_active ? "bg-cyan-100 text-cyan-600" : "bg-slate-200 text-slate-500"}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-slate-900">{ann.title}</h3>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ann.is_active ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-600"}`}>
                          {ann.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="mt-2 text-slate-600">{ann.content}</p>
                      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getPriorityColor(ann.priority)}`}>{ann.priority}</span>
                        <span>Target: <span className="capitalize">{ann.target_audience}</span></span>
                        <span>Starts: {formatDate(ann.starts_at)}</span>
                        {ann.expires_at && <span>Expires: {formatDate(ann.expires_at)}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"><Edit className="h-4 w-4" /></button>
                    <button className="rounded-lg p-2 text-red-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Announcement" size="lg"
        footer={<><Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button><Button icon={Bell}>Publish</Button></>}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Title</label>
            <input type="text" placeholder="Enter announcement title" className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-cyan-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Content</label>
            <textarea placeholder="Enter announcement content" className="mt-1 h-32 w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-cyan-500 focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Category</label>
              <select className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-cyan-500 focus:outline-none">
                <option value="general">General</option>
                <option value="promotion">Promotion</option>
                <option value="alert">Alert</option>
                <option value="update">Update</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Priority</label>
              <select className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-cyan-500 focus:outline-none">
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Target Audience</label>
              <select className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-cyan-500 focus:outline-none">
                <option value="all">All Users</option>
                <option value="members">Members Only</option>
                <option value="admins">Admins Only</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Status</label>
              <select className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-cyan-500 focus:outline-none">
                <option value="true">Active</option>
                <option value="false">Draft</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
}
