"use client";

import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DataTable } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { formatCurrency, formatDate, getStatusColor, getRoleColor, getInitials } from "@/lib/utils";
import { Search, Filter, MoreVertical, Ban, CheckCircle, Flag, Eye, Mail, Phone } from "lucide-react";
import { getUsers } from "@/lib/db-service";
import type { Profile, Wallet, Savings } from "@/types";

interface UserWithDetails extends Profile {
  wallet?: Wallet;
  savings?: Savings;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedUser, setSelectedUser] = useState<UserWithDetails | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const status = statusFilter === "active" ? "active" : statusFilter === "inactive" ? "inactive" : statusFilter === "flagged" ? "flagged" : undefined;
        const response = await getUsers({
          search: search || undefined,
          role: roleFilter || undefined,
          status,
          page,
          pageSize: 20,
        });
        
        setUsers(response.data as UserWithDetails[]);
        setTotalPages(response.totalPages);
        setTotalCount(response.count);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [search, statusFilter, roleFilter, page]);

  const columns = [
    {
      key: "user",
      header: "User",
      render: (user: UserWithDetails) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white">
            {getInitials(user.name)}
          </div>
          <div>
            <p className="font-medium text-slate-900">{user.name || "N/A"}</p>
            <p className="text-xs text-slate-500">{user.user_id}</p>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (user: UserWithDetails) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-slate-400" />
          <span className="text-slate-600">{user.email}</span>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      render: (user: UserWithDetails) => (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-slate-400" />
          <span className="text-slate-600">{user.phone || "N/A"}</span>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (user: UserWithDetails) => (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleColor(user.role)}`}>
          {user.role}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (user: UserWithDetails) => (
        <div className="flex flex-wrap gap-1">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
            {user.is_active ? "Active" : "Inactive"}
          </span>
          {user.is_flagged && (
            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
              Flagged
            </span>
          )}
          {user.kyc_verified && (
            <span className="inline-flex items-center rounded-full bg-cyan-100 px-2.5 py-0.5 text-xs font-medium text-cyan-700">
              KYC Verified
            </span>
          )}
        </div>
      ),
    },
    {
      key: "balance",
      header: "Balance",
      render: (user: UserWithDetails) => (
        <span className="font-medium text-slate-900">
          {user.wallet ? formatCurrency(user.wallet.balance) : "N/A"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (user: UserWithDetails) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedUser(user);
              setShowUserModal(true);
            }}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout title="Users" subtitle="Manage all registered users and their accounts">
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or user ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:border-cyan-500 focus:outline-none"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="flagged">Flagged</option>
            </select>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:border-cyan-500 focus:outline-none"
            >
              <option value="">All Roles</option>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">Total Users</p>
            <p className="text-2xl font-bold text-slate-900">{users.length}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">Active</p>
            <p className="text-2xl font-bold text-green-600">{users.filter((u) => u.is_active).length}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">Flagged</p>
            <p className="text-2xl font-bold text-red-600">{users.filter((u) => u.is_flagged).length}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">KYC Verified</p>
            <p className="text-2xl font-bold text-cyan-600">{users.filter((u) => u.kyc_verified).length}</p>
          </div>
        </div>

        {/* Table */}
        <DataTable columns={columns} data={users} loading={loading} emptyMessage="No users found" />

        {/* Pagination */}
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} totalCount={totalCount} pageSize={20} />
      </div>

      {/* User Detail Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title="User Details"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowUserModal(false)}>Close</Button>
            <Button variant="danger" icon={Ban}>Suspend User</Button>
            <Button icon={CheckCircle}>Activate</Button>
          </>
        }
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-2xl font-bold text-white">
                {getInitials(selectedUser.name)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{selectedUser.name}</h3>
                <p className="text-slate-500">{selectedUser.email}</p>
                <div className="mt-1 flex gap-2">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleColor(selectedUser.role)}`}>
                    {selectedUser.role}
                  </span>
                  {selectedUser.is_active ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">Active</span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">Inactive</span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-slate-500">User ID</p>
                <p className="font-medium text-slate-900">{selectedUser.user_id}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Phone</p>
                <p className="font-medium text-slate-900">{selectedUser.phone || "N/A"}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Wallet Balance</p>
                <p className="font-medium text-slate-900">{selectedUser.wallet ? formatCurrency(selectedUser.wallet.balance) : "N/A"}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Total Savings</p>
                <p className="font-medium text-slate-900">{selectedUser.savings ? formatCurrency(selectedUser.savings.total_saved) : "N/A"}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Member Since</p>
                <p className="font-medium text-slate-900">{formatDate(selectedUser.created_at)}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-slate-500">KYC Status</p>
                <p className="font-medium text-slate-900">{selectedUser.kyc_verified ? "Verified" : "Pending"}</p>
              </div>
            </div>

            {selectedUser.is_flagged && (
              <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                <p className="font-medium text-red-700">Flagged Reason</p>
                <p className="mt-1 text-sm text-red-600">{selectedUser.flagged_reason}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </MainLayout>
  );
}
