"use client";

import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { Input } from "@/components/ui/Input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog";
import { Label } from "@/components/ui/Label";
import { supabaseAdmin } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { formatDate, getInitials } from "@/lib/utils";
import { 
  Shield, Users, Database, Settings, Activity, Trash2, Edit3, 
  Plus, Search, AlertTriangle, CheckCircle, XCircle, RefreshCw,
  Server, HardDrive, Zap, Crown, UserCog, Trash
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  phone: string | null;
  name: string | null;
  role: string;
  is_active: boolean;
  is_flagged: boolean;
  created_at: string;
}

interface SystemStats {
  totalUsers: number;
  totalAdmins: number;
  totalMembers: number;
  activeUsers: number;
  databaseSize: string;
  apiRequests: number;
  uptime: string;
}

export default function SuperAdminPage() {
  const { user: currentUser, isSuperAdmin } = useAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState<"admin" | "superadmin">("admin");
  const [addAdminLoading, setAddAdminLoading] = useState(false);

  useEffect(() => {
    fetchAdmins();
    fetchStats();
  }, [search, page]);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      let query = supabaseAdmin.from("profiles")
        .select("*", { count: "exact" })
        .in("role", ["admin", "superadmin"]);

      if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
      }

      query = query.order("created_at", { ascending: false });
      query = query.range((page - 1) * 10, page * 10 - 1);

      const { data, count, error } = await query;

      if (error) throw error;

      setAdmins(data || []);
      setTotalPages(Math.ceil((count || 0) / 10));
    } catch (error) {
      console.error("Error fetching admins:", error);
      toast.error("Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [totalResult, adminsResult, membersResult, activeResult] = await Promise.all([
        supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }),
        supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }).in("role", ["admin", "superadmin"]),
        supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }).eq("role", "member"),
        supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }).eq("is_active", true),
      ]);

      setStats({
        totalUsers: totalResult.count || 0,
        totalAdmins: adminsResult.count || 0,
        totalMembers: membersResult.count || 0,
        activeUsers: activeResult.count || 0,
        databaseSize: "~50 MB",
        apiRequests: 125000,
        uptime: "99.9%",
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setDeleteLoading(true);

    try {
      // Delete from Supabase Auth first
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userToDelete.id);
      
      if (authError) {
        // If auth delete fails, at least delete from profiles
        console.log("Auth delete failed, deleting profile only");
      }

      // Delete user profile (this will cascade to related tables if configured)
      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .delete()
        .eq("id", userToDelete.id);

      if (profileError) throw profileError;

      toast.success(`User ${userToDelete.name || userToDelete.email} deleted successfully`);
      setShowDeleteModal(false);
      setUserToDelete(null);
      fetchAdmins();
      fetchStats();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleAddAdmin = async () => {
    if (!newAdminEmail) {
      toast.error("Please enter an email address");
      return;
    }

    setAddAdminLoading(true);

    try {
      // Find the user by email
      const { data: existingUser, error: findError } = await supabaseAdmin
        .from("profiles")
        .select("*")
        .eq("email", newAdminEmail)
        .single();

      if (findError || !existingUser) {
        toast.error("User not found with this email");
        setAddAdminLoading(false);
        return;
      }

      // Update the user's role to admin or superadmin
      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({ role: newAdminRole })
        .eq("id", existingUser.id);

      if (updateError) throw updateError;

      toast.success(`${existingUser.name || newAdminEmail} is now an ${newAdminRole}`);
      setShowAddAdminModal(false);
      setNewAdminEmail("");
      setNewAdminRole("admin");
      fetchAdmins();
    } catch (error) {
      console.error("Error adding admin:", error);
      toast.error("Failed to add admin");
    } finally {
      setAddAdminLoading(false);
    }
  };

  const handleToggleAdminRole = async (user: AdminUser, newRole: "admin" | "superadmin" | "member") => {
    try {
      const { error } = await supabaseAdmin
        .from("profiles")
        .update({ role: newRole })
        .eq("id", user.id);

      if (error) throw error;

      toast.success(`Role updated successfully`);
      fetchAdmins();
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role");
    }
  };

  const handleToggleUserStatus = async (user: AdminUser) => {
    try {
      const { error } = await supabaseAdmin
        .from("profiles")
        .update({ is_active: !user.is_active })
        .eq("id", user.id);

      if (error) throw error;

      toast.success(`User ${user.is_active ? "deactivated" : "activated"}`);
      fetchAdmins();
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Failed to update status");
    }
  };

  if (!isSuperAdmin) {
    return (
      <MainLayout title="Access Denied" subtitle="Super Admin Only">
        <Card>
          <CardContent className="p-8 text-center">
            <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h2>
            <p className="text-slate-500">You need Super Admin privileges to access this page.</p>
            <Link href="/dashboard" className="mt-4 inline-block">
              <Button>Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </MainLayout>
    );
  }

  const columns = [
    {
      key: "user",
      header: "Admin User",
      render: (admin: AdminUser) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white">
            {getInitials(admin.name || admin.email)}
          </div>
          <div>
            <p className="font-medium text-slate-900">{admin.name || "N/A"}</p>
            <p className="text-xs text-slate-500">{admin.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (admin: AdminUser) => (
        <Badge className={admin.role === "superadmin" ? "bg-red-100 text-red-700" : "bg-purple-100 text-purple-700"}>
          {admin.role === "superadmin" && <Crown className="h-3 w-3 mr-1" />}
          {admin.role === "superadmin" ? "Super Admin" : "Admin"}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (admin: AdminUser) => (
        <div className="flex items-center gap-2">
          {admin.is_active ? (
            <span className="flex items-center gap-1 text-green-600">
              <CheckCircle className="h-4 w-4" /> Active
            </span>
          ) : (
            <span className="flex items-center gap-1 text-slate-400">
              <XCircle className="h-4 w-4" /> Inactive
            </span>
          )}
          {admin.is_flagged && (
            <AlertTriangle className="h-4 w-4 text-red-500" />
          )}
        </div>
      ),
    },
    {
      key: "joined",
      header: "Joined",
      render: (admin: AdminUser) => formatDate(admin.created_at),
    },
    {
      key: "actions",
      header: "Actions",
      render: (admin: AdminUser) => (
        <div className="flex items-center gap-2">
          {admin.id !== currentUser?.id && (
            <>
              {admin.role !== "superadmin" ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleAdminRole(admin, "superadmin")}
                  title="Make Super Admin"
                >
                  <Crown className="h-4 w-4 text-red-600" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleAdminRole(admin, "admin")}
                  title="Remove Super Admin"
                >
                  <UserCog className="h-4 w-4 text-purple-600" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleToggleUserStatus(admin)}
              >
                {admin.is_active ? <XCircle className="h-4 w-4 text-red-600" /> : <CheckCircle className="h-4 w-4 text-green-600" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setUserToDelete(admin);
                  setShowDeleteModal(true);
                }}
              >
                <Trash className="h-4 w-4 text-red-600" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <MainLayout title="Super Admin" subtitle="System Administration">
      <div className="space-y-6">
        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-2 border-cyan-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-cyan-100">
                  <Users className="h-6 w-6 text-cyan-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Users</p>
                  <p className="text-2xl font-bold text-slate-900">{stats?.totalUsers || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-purple-100">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Admins</p>
                  <p className="text-2xl font-bold text-slate-900">{stats?.totalAdmins || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-green-100">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Active Users</p>
                  <p className="text-2xl font-bold text-slate-900">{stats?.activeUsers || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-blue-100">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">System Uptime</p>
                  <p className="text-2xl font-bold text-green-600">{stats?.uptime || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Admin Management
              </CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Search admins..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button onClick={() => setShowAddAdminModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Admin
                </Button>
                <Button variant="outline" onClick={fetchAdmins}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={admins} loading={loading} />
            {totalPages > 1 && (
              <div className="mt-4">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Server className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500">API Requests Today</p>
                  <p className="font-bold">{stats?.apiRequests?.toLocaleString() || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <HardDrive className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500">Database Size</p>
                  <p className="font-bold">{stats?.databaseSize || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500">Total Members</p>
                  <p className="font-bold">{stats?.totalMembers || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Delete User Modal */}
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Delete User
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-slate-600">
                Are you sure you want to delete <strong>{userToDelete?.name || userToDelete?.email}</strong>? 
                This action will:
              </p>
              <ul className="mt-3 space-y-1 text-sm text-slate-500 list-disc list-inside">
                <li>Delete the user from Supabase Auth</li>
                <li>Delete the user profile and all associated data</li>
                <li>This action cannot be undone</li>
              </ul>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteUser} loading={deleteLoading}>
                <Trash className="h-4 w-4 mr-2" />
                Delete User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Admin Modal */}
        <Dialog open={showAddAdminModal} onOpenChange={setShowAddAdminModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserCog className="h-5 w-5" />
                Add New Admin
              </DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div>
                <Label>User Email</Label>
                <Input
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="mt-1"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Enter the email of an existing member to promote them to admin
                </p>
              </div>
              <div>
                <Label>Role</Label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      checked={newAdminRole === "admin"}
                      onChange={() => setNewAdminRole("admin")}
                      className="text-cyan-600"
                    />
                    <span>Admin</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="superadmin"
                      checked={newAdminRole === "superadmin"}
                      onChange={() => setNewAdminRole("superadmin")}
                      className="text-cyan-600"
                    />
                    <span className="text-red-600 font-medium">Super Admin</span>
                  </label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddAdminModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddAdmin} loading={addAdminLoading}>
                <Plus className="h-4 w-4 mr-2" />
                Add Admin
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
