"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/Button";
import { formatDateTime } from "@/lib/utils";
import { User, Bell, Shield, Palette, Globe, Key, Save, Plus, Trash2 } from "lucide-react";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "integrations", label: "Integrations", icon: Globe },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
  };

  return (
    <MainLayout title="Settings" subtitle="Manage your account and system preferences">
      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <div className="rounded-xl border border-slate-200 bg-white p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.id ? "bg-cyan-50 text-cyan-600" : "text-slate-600 hover:bg-slate-50"}`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Profile Settings</h2>
              <p className="mt-1 text-sm text-slate-500">Manage your admin account details</p>

              <div className="mt-6 space-y-6">
                <div className="flex items-center gap-6">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl font-bold text-white">A</div>
                  <div>
                    <Button variant="outline" size="sm">Change Photo</Button>
                    <p className="mt-1 text-xs text-slate-500">JPG, PNG. Max 2MB</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Full Name</label>
                    <input type="text" defaultValue="Admin User" className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-cyan-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Email</label>
                    <input type="email" defaultValue="admin@coopvest.com" className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-cyan-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Phone</label>
                    <input type="tel" defaultValue="+2348012345678" className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-cyan-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Role</label>
                    <input type="text" defaultValue="Super Admin" disabled className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500" />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button icon={Save} loading={saving} onClick={handleSave}>Save Changes</Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Password</h2>
                <p className="mt-1 text-sm text-slate-500">Update your password regularly for security</p>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Current Password</label>
                    <input type="password" className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-cyan-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">New Password</label>
                    <input type="password" className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-cyan-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Confirm New Password</label>
                    <input type="password" className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-cyan-500 focus:outline-none" />
                  </div>
                  <Button icon={Key}>Update Password</Button>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Two-Factor Authentication</h2>
                <p className="mt-1 text-sm text-slate-500">Add an extra layer of security to your account</p>

                <div className="mt-4 flex items-center justify-between rounded-lg bg-green-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-green-100 p-2"><Shield className="h-5 w-5 text-green-600" /></div>
                    <div><p className="font-medium text-green-800">2FA is enabled</p><p className="text-sm text-green-600">Your account is protected</p></div>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Active Sessions</h2>
                <p className="mt-1 text-sm text-slate-500">Manage your active login sessions</p>

                <div className="mt-4 space-y-3">
                  {[
                    { device: "Chrome on Windows", location: "Lagos, Nigeria", current: true, last: "Now" },
                    { device: "Safari on iPhone", location: "Lagos, Nigeria", current: false, last: "2 hours ago" },
                  ].map((session, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                      <div>
                        <p className="font-medium text-slate-900">{session.device}</p>
                        <p className="text-sm text-slate-500">{session.location} • {session.last}</p>
                      </div>
                      {session.current && <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">Current</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Notification Preferences</h2>
              <p className="mt-1 text-sm text-slate-500">Choose how you want to be notified</p>

              <div className="mt-6 space-y-4">
                {[
                  { label: "New user registrations", description: "Get notified when a new user signs up" },
                  { label: "KYC verification requests", description: "Notifications for pending KYC reviews" },
                  { label: "Loan applications", description: "Updates on new loan applications" },
                  { label: "Support tickets", description: "New and updated support tickets" },
                  { label: "System alerts", description: "Important system notifications" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                    <div>
                      <p className="font-medium text-slate-900">{item.label}</p>
                      <p className="text-sm text-slate-500">{item.description}</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" defaultChecked className="peer sr-only" />
                      <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-cyan-500 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Appearance</h2>
              <p className="mt-1 text-sm text-slate-500">Customize the look of your dashboard</p>

              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-700">Theme</label>
                <div className="mt-3 grid grid-cols-3 gap-4">
                  {["Light", "Dark", "System"].map((theme) => (
                    <button key={theme} className={`rounded-lg border-2 p-4 text-center transition-all ${theme === "Light" ? "border-cyan-500 bg-cyan-50" : "border-slate-200 hover:border-slate-300"}`}>
                      <div className={`mx-auto h-12 w-12 rounded-lg ${theme === "Dark" ? "bg-slate-800" : theme === "Light" ? "bg-white border border-slate-200" : "bg-gradient-to-r from-white to-slate-800"}`} />
                      <p className="mt-2 text-sm font-medium text-slate-900">{theme}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-700">Accent Color</label>
                <div className="mt-3 flex gap-3">
                  {["#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"].map((color) => (
                    <button key={color} style={{ backgroundColor: color }} className="h-10 w-10 rounded-full ring-2 ring-offset-2 ring-transparent hover:ring-cyan-500" />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "integrations" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">API Keys</h2>
                <p className="mt-1 text-sm text-slate-500">Manage your API keys for integrations</p>

                <div className="mt-4 space-y-3">
                  {[
                    { name: "Production API Key", key: "sk_live_*****************************", created: "2024-01-15" },
                    { name: "Development API Key", key: "sk_test_*****************************", created: "2024-01-15" },
                  ].map((apiKey, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                      <div>
                        <p className="font-medium text-slate-900">{apiKey.name}</p>
                        <p className="font-mono text-sm text-slate-500">{apiKey.key}</p>
                        <p className="mt-1 text-xs text-slate-400">Created: {apiKey.created}</p>
                      </div>
                      <Button variant="outline" size="sm">Regenerate</Button>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="mt-4" icon={Plus}>Create New API Key</Button>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Webhooks</h2>
                <p className="mt-1 text-sm text-slate-500">Configure webhook endpoints for real-time events</p>

                <div className="mt-4 space-y-3">
                  {[
                    { url: "https://api.example.com/webhooks/coopvest", events: ["user.created", "transaction.completed"], active: true },
                  ].map((webhook, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                      <div>
                        <p className="font-mono text-sm text-slate-900 truncate max-w-md">{webhook.url}</p>
                        <p className="mt-1 text-xs text-slate-500">Events: {webhook.events.join(", ")}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${webhook.active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                          {webhook.active ? "Active" : "Inactive"}
                        </span>
                        <Button variant="ghost" size="sm" icon={Trash2} />
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="mt-4" icon={Plus}>Add Webhook</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
