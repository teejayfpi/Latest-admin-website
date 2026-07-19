"use client";

import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DataTable } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { formatCurrency, formatDate, getStatusColor, getRoleColor, getInitials } from "@/lib/utils";
import { Search, Filter, MoreVertical, Ban, CheckCircle, Flag, Eye, Mail, Phone, ChevronRight } from "lucide-react";
import { getUsers, getUserById, updateUser, flagUser, unflagUser } from "@/lib/db-service";
import type { Profile, Wallet, Savings, KYC } from "@/types";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UserWithDetails extends Profile {
  wallet?: Wallet;
  savings?: Savings;
  kyc?: KYC;
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
  const [userModalLoading, setUserModalLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagReason, setFlagReason] = useState("");

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
        <Link href={`/users/${user.id}`} className="flex items-center gap-3 hover:bg-slate-50 -mx-2 px-2 py-1 rounded-lg transition-colors">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white">
            {getInitials(user.name)}
          </div>
          <div>
            <p className="font-medium text-slate-900">{user.name || "N/A"}</p>
            <p className="text-xs text-slate-500">{user.user_id}</p>
          </div>
        </Link>
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
            onClick={() => handleOpenUserModal(user)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  // Fetch full user details when opening modal
  const handleOpenUserModal = async (user: UserWithDetails) => {
    setUserModalLoading(true);
    setSelectedUser(user);
    setShowUserModal(true);
    try {
      const fullUser = await getUserById(user.id);
      if (fullUser) {
        setSelectedUser(fullUser as UserWithDetails);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setUserModalLoading(false);
    }
  };

  // Handle activate/suspend user
  const handleToggleUserStatus = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      await updateUser(selectedUser.id, { is_active: !selectedUser.is_active });
      setSelectedUser((prev) => prev ? { ...prev, is_active: !prev.is_active } : null);
      setUsers((prev) => prev.map((u) => u.id === selectedUser.id ? { ...u, is_active: !u.is_active } : u));
      toast.success(`User ${selectedUser.is_active ? "suspended" : "activated"} successfully`);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle flag user
  const handleFlagUser = async () => {
    if (!selectedUser || !flagReason) return;
    setActionLoading(true);
    try {
      await flagUser(selectedUser.id, flagReason);
      setSelectedUser((prev) => prev ? { ...prev, is_flagged: true, flagged_reason: flagReason } : null);
      setUsers((prev) => prev.map((u) => u.id === selectedUser.id ? { ...u, is_flagged: true, flagged_reason: flagReason } : u));
      setShowFlagModal(false);
      setFlagReason("");
      toast.success("User flagged successfully");
    } catch (error) {
      console.error("Error flagging user:", error);
      toast.error("Failed to flag user");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle unflag user
  const handleUnflagUser = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      await unflagUser(selectedUser.id);
      setSelectedUser((prev) => prev ? { ...prev, is_flagged: false, flagged_reason: null } : null);
      setUsers((prev) => prev.map((u) => u.id === selectedUser.id ? { ...u, is_flagged: false, flagged_reason: null } : u));
      toast.success("User unflagged successfully");
    } catch (error) {
      console.error("Error unflagging user:", error);
      toast.error("Failed to unflag user");
    } finally {
      setActionLoading(false);
    }
  };

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
            {selectedUser?.is_flagged ? (
              <Button onClick={handleUnflagUser} loading={actionLoading}>Unflag User</Button>
            ) : (
              <Button variant="danger" icon={Flag} onClick={() => setShowFlagModal(true)}>Flag User</Button>
            )}
            <Button 
              variant={selectedUser?.is_active ? "danger" : "primary"} 
              icon={selectedUser?.is_active ? Ban : CheckCircle} 
              onClick={handleToggleUserStatus}
              loading={actionLoading}
            >
              {selectedUser?.is_active ? "Suspend User" : "Activate User"}
            </Button>
          </>
        }
      >
        {userModalLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-200 border-t-cyan-600"></div>
          </div>
        ) : selectedUser ? (
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
                  {selectedUser.is_flagged && (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">Flagged</span>
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

            {/* KYC Details */}
            {selectedUser.kyc && (
              <div className="rounded-lg border border-slate-200 p-4 space-y-4">
                <h4 className="font-medium text-slate-900">KYC & Registration Details</h4>
                
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">National ID</p>
                    <p className="font-medium text-slate-900">{selectedUser.kyc.national_id || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">KYC Status</p>
                    <p className="font-medium text-slate-900 capitalize">{selectedUser.kyc.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Date of Birth</p>
                    <p className="font-medium text-slate-900">{selectedUser.kyc.date_of_birth || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Address</p>
                    <p className="font-medium text-slate-900">{selectedUser.kyc.address || "N/A"}</p>
                  </div>
                </div>

                {/* Personal Info */}
                {selectedUser.kyc.personal_info && Object.keys(selectedUser.kyc.personal_info).length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-2">Personal Information</p>
                    <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg">
                      {Object.entries(selectedUser.kyc.personal_info).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-xs text-slate-500 capitalize">{key.replace(/_/g, " ")}</p>
                          <p className="font-medium text-slate-900">{String(value)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Info */}
                {selectedUser.kyc.contact_info && Object.keys(selectedUser.kyc.contact_info).length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-2">Contact Information</p>
                    <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg">
                      {Object.entries(selectedUser.kyc.contact_info).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-xs text-slate-500 capitalize">{key.replace(/_/g, " ")}</p>
                          <p className="font-medium text-slate-900">{String(value)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Employment Info */}
                {selectedUser.kyc.employment_info && Object.keys(selectedUser.kyc.employment_info).length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-2">Employment Information</p>
                    <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg">
                      {Object.entries(selectedUser.kyc.employment_info).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-xs text-slate-500 capitalize">{key.replace(/_/g, " ")}</p>
                          <p className="font-medium text-slate-900">{String(value)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bank Info */}
                {selectedUser.kyc.bank_info && Object.keys(selectedUser.kyc.bank_info).length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-2">Bank Information</p>
                    <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg">
                      {Object.entries(selectedUser.kyc.bank_info).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-xs text-slate-500 capitalize">{key.replace(/_/g, " ")}</p>
                          <p className="font-medium text-slate-900">{String(value)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selfie */}
                {selectedUser.kyc.selfie && (selectedUser.kyc.selfie as any).url && (
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-2">Selfie Verification</p>
                    <img 
                      src={(selectedUser.kyc.selfie as any).url} 
                      alt="Selfie" 
                      className="h-32 w-32 rounded-lg object-cover border border-slate-200"
                    />
                  </div>
                )}

                {/* Submission Info */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                  <div>
                    <p className="text-sm text-slate-500">Submitted At</p>
                    <p className="font-medium text-slate-900">{selectedUser.kyc.submitted_at ? formatDate(selectedUser.kyc.submitted_at) : "Not submitted"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Verification Level</p>
                    <p className="font-medium text-slate-900">Level {selectedUser.kyc.verification_level}</p>
                  </div>
                </div>
              </div>
            )}

            {selectedUser.is_flagged && selectedUser.flagged_reason && (
              <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                <p className="font-medium text-red-700">Flagged Reason</p>
                <p className="mt-1 text-sm text-red-600">{selectedUser.flagged_reason}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-slate-500 py-8">No user selected</p>
        )}
      </Modal>

      {/* Flag User Modal */}
      <Modal
        isOpen={showFlagModal}
        onClose={() => setShowFlagModal(false)}
        title="Flag User"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowFlagModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleFlagUser} loading={actionLoading} disabled={!flagReason}>
              Flag User
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-slate-600">Please provide a reason for flagging this user.</p>
          <textarea
            value={flagReason}
            onChange={(e) => setFlagReason(e.target.value)}
            placeholder="Enter flag reason..."
            className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            rows={4}
          />
        </div>
      </Modal>
    </MainLayout>
  );
}
