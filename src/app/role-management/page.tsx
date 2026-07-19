"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog";
import { Label } from "@/components/ui/Label";
import { supabaseAdmin } from "@/lib/supabase";
import { Shield, Plus, Edit3, Trash2, Users, Key, Check, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

interface Role {
  id: string;
  name: string;
  displayName: string;
  description: string;
  permissions: string[];
  memberCount: number;
  color: string;
}

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

const ROLE_COLORS: Record<string, string> = {
  superadmin: "red",
  admin: "purple",
  manager: "blue",
  staff: "green",
  member: "gray",
};

export default function RoleManagementPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      // Get counts for each role
      const { data: profiles, error } = await supabaseAdmin
        .from("profiles")
        .select("role");

      if (error) throw error;

      const roleCounts: Record<string, number> = {};
      profiles?.forEach(p => {
        roleCounts[p.role] = (roleCounts[p.role] || 0) + 1;
      });

      const roleDefinitions: Role[] = [
        { id: "superadmin", name: "superadmin", displayName: "Super Admin", description: "Full system access with all privileges", permissions: ["*"], memberCount: roleCounts["superadmin"] || 0, color: "red" },
        { id: "admin", name: "admin", displayName: "Admin", description: "Administrative access to manage platform", permissions: ["users.manage", "loans.approve", "kyc.verify", "reports.view", "transactions.view", "settings.view"], memberCount: roleCounts["admin"] || 0, color: "purple" },
        { id: "staff", name: "staff", displayName: "Staff", description: "Staff member with limited access", permissions: ["users.view", "kyc.view", "transactions.view"], memberCount: roleCounts["staff"] || 0, color: "blue" },
        { id: "member", name: "member", displayName: "Member", description: "Regular member access", permissions: ["profile.view", "profile.edit"], memberCount: roleCounts["member"] || 0, color: "green" },
      ];

      setRoles(roleDefinitions);
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Failed to load roles");
    } finally {
      setLoading(false);
    }
  };

  const getColorBadge = (c: string) => ({ red: "bg-red-100 text-red-700", purple: "bg-purple-100 text-purple-700", blue: "bg-blue-100 text-blue-700", green: "bg-green-100 text-green-700", gray: "bg-slate-100 text-slate-700" }[c] || "");

  return (
    <MainLayout title="Role Management" subtitle="Manage roles and permissions">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><Shield className="h-5 w-5 text-cyan-600" /><h2 className="text-lg font-semibold">RBAC Configuration</h2></div>
          <Button variant="outline" onClick={fetchRoles}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4 h-32 bg-slate-100">
                  <div className="h-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {roles.map((role) => (
              <Card key={role.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className={getColorBadge(role.color)}>{role.displayName}</Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{role.description}</p>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Users className="h-4 w-4" />
                    {role.memberCount} {role.memberCount === 1 ? "member" : "members"}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Available Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["Users", "Loans", "KYC", "Reports", "Transactions", "Settings"].map(group => (
                <div key={group} className="p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-medium text-slate-900 mb-3">{group}</h4>
                  <div className="space-y-2">
                    {PERMISSIONS.filter(p => p.group === group).map(perm => (
                      <div key={perm.id} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-slate-600">{perm.name}</span>
                      </div>
                    ))}
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
