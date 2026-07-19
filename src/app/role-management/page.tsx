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
import { Shield, Plus, Edit3, Trash2, Users, Key, Check } from "lucide-react";

interface Role {
  id: string;
  name: string;
  displayName: string;
  description: string;
  permissions: string[];
  memberCount: number;
  color: string;
}

const ROLES: Role[] = [
  { id: "1", name: "super_admin", displayName: "Super Admin", description: "Full system access", permissions: ["*"], memberCount: 3, color: "red" },
  { id: "2", name: "admin", displayName: "Admin", description: "Administrative access", permissions: ["users.manage", "loans.approve", "kyc.verify", "reports.view", "transactions.view"], memberCount: 12, color: "purple" },
  { id: "3", name: "manager", displayName: "Manager", description: "Management level access", permissions: ["users.view", "loans.review", "kyc.review", "reports.view"], memberCount: 25, color: "blue" },
  { id: "4", name: "officer", displayName: "Loan Officer", description: "Loan processing access", permissions: ["loans.process", "members.view", "kyc.view"], memberCount: 45, color: "green" },
  { id: "5", name: "viewer", displayName: "Viewer", description: "Read-only access", permissions: ["reports.view", "transactions.view"], memberCount: 8, color: "gray" },
];

const PERMISSIONS = [
  { id: "users.*", name: "User Management", group: "Users" },
  { id: "users.view", name: "View Users", group: "Users" },
  { id: "users.manage", name: "Manage Users", group: "Users" },
  { id: "loans.*", name: "Loan Management", group: "Loans" },
  { id: "loans.approve", name: "Approve Loans", group: "Loans" },
  { id: "loans.process", name: "Process Loans", group: "Loans" },
  { id: "kyc.*", name: "KYC Management", group: "KYC" },
  { id: "kyc.verify", name: "Verify KYC", group: "KYC" },
  { id: "reports.*", name: "Reports", group: "Reports" },
  { id: "reports.view", name: "View Reports", group: "Reports" },
  { id: "transactions.*", name: "Transactions", group: "Transactions" },
  { id: "transactions.view", name: "View Transactions", group: "Transactions" },
  { id: "settings.*", name: "Settings", group: "Settings" },
];

export default function RoleManagementPage() {
  const [roles] = useState<Role[]>(ROLES);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const getColorBadge = (c: string) => ({ red: "bg-red-100 text-red-700", purple: "bg-purple-100 text-purple-700", blue: "bg-blue-100 text-blue-700", green: "bg-green-100 text-green-700", gray: "bg-slate-100 text-slate-700" }[c] || "");

  return (
    <MainLayout title="Role Management" subtitle="Manage roles and permissions">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><Shield className="h-5 w-5 text-cyan-600" /><h2 className="text-lg font-semibold">RBAC Configuration</h2></div>
          <Button className="bg-cyan-600 hover:bg-cyan-700" onClick={() => { setSelectedRole(null); setShowRoleModal(true); }}><Plus className="h-4 w-4 mr-2" />Create Role</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {roles.map((role) => (
            <Card key={role.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => { setSelectedRole(role); setShowRoleModal(true); }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge className={getColorBadge(role.color)}>{role.displayName}</Badge>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); setSelectedRole(role); setShowRoleModal(true); }}><Edit3 className="h-3 w-3" /></Button>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-3">{role.description}</p>
                <div className="flex items-center gap-2 text-sm text-slate-500"><Users className="h-4 w-4" />{role.memberCount} members</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Key className="h-5 w-5 text-cyan-600" />All Permissions</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {["Users", "Loans", "KYC", "Reports", "Transactions", "Settings"].map((group) => (
                <div key={group} className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-3">{group}</h3>
                  <div className="space-y-2">
                    {PERMISSIONS.filter((p) => p.group === group).map((p) => (
                      <div key={p.id} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{p.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showRoleModal} onOpenChange={setShowRoleModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>{selectedRole ? "Edit Role" : "Create Role"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div><Label>Role Name</Label><Input defaultValue={selectedRole?.displayName || ""} placeholder="e.g., Loan Officer" /></div>
            <div><Label>Description</Label><Input defaultValue={selectedRole?.description || ""} placeholder="Brief description" /></div>
            <div>
              <Label>Permissions</Label>
              <div className="mt-2 space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                {PERMISSIONS.map((p) => (
                  <label key={p.id} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked={selectedRole?.permissions.includes(p.id) || selectedRole?.permissions.includes("*")} className="rounded" />
                    <span className="text-sm">{p.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleModal(false)}>Cancel</Button>
            <Button className="bg-cyan-600 hover:bg-cyan-700" onClick={() => { toast.success(selectedRole ? "Role updated" : "Role created"); setShowRoleModal(false); }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
