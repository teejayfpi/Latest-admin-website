"use client";

import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DataTable } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { formatDate, getInitials, timeAgo } from "@/lib/utils";
import { Search, CheckCircle, XCircle, Eye, FileCheck, Clock, AlertTriangle, Image } from "lucide-react";
import type { KYC, Profile } from "@/types";

interface KYCWithProfile extends KYC {
  profile?: Profile;
}

export default function KYCPage() {
  const [kycList, setKycList] = useState<KYCWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedKYC, setSelectedKYC] = useState<KYCWithProfile | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [actionModal, setActionModal] = useState<{ type: "approve" | "reject"; kyc: KYCWithProfile } | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    const fetchKYC = async () => {
      setLoading(true);
      try {
        const { getKYCApplications } = await import("@/lib/db-service");
        const response = await getKYCApplications({
          status: statusFilter || undefined,
          search: search || undefined,
          page,
          pageSize: 20,
        });
        
        setKycList(response.data as KYCWithProfile[]);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Error fetching KYC:", error);
        setKycList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchKYC();
  }, [statusFilter, search, page]);

  const handleApprove = async () => {
    if (!actionModal) return;
    try {
      const { updateKYCStatus } = await import("@/lib/db-service");
      await updateKYCStatus(actionModal.kyc.id, "verified");
      setKycList((prev) => prev.map((k) => k.id === actionModal.kyc.id ? { ...k, status: "verified" as const } : k));
      setActionModal(null);
    } catch (error) {
      console.error("Error approving KYC:", error);
    }
  };

  const handleReject = async () => {
    if (!actionModal) return;
    try {
      const { updateKYCStatus } = await import("@/lib/db-service");
      await updateKYCStatus(actionModal.kyc.id, "rejected", rejectionReason);
      setKycList((prev) => prev.map((k) => k.id === actionModal.kyc.id ? { ...k, status: "rejected" as const, rejection_reason: rejectionReason } : k));
      setActionModal(null);
      setRejectionReason("");
    } catch (error) {
      console.error("Error rejecting KYC:", error);
    }
  };

  const columns = [
    {
      key: "user",
      header: "User",
      render: (kyc: KYCWithProfile) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white">
            {getInitials(kyc.profile?.name)}
          </div>
          <div>
            <p className="font-medium text-slate-900">{kyc.profile?.name || "N/A"}</p>
            <p className="text-xs text-slate-500">{kyc.profile?.user_id}</p>
          </div>
        </div>
      ),
    },
    {
      key: "document",
      header: "Document",
      render: (kyc: KYCWithProfile) => (
        <span className="text-slate-600">{kyc.national_id || "N/A"}</span>
      ),
    },
    {
      key: "level",
      header: "Verification Level",
      render: (kyc: KYCWithProfile) => (
        <div className="flex items-center gap-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`h-2 w-6 rounded-full ${i < kyc.verification_level ? "bg-cyan-500" : "bg-slate-200"}`}
            />
          ))}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (kyc: KYCWithProfile) => {
        const statusConfig = {
          pending: { label: "Pending", class: "bg-yellow-100 text-yellow-700", icon: Clock },
          in_review: { label: "In Review", class: "bg-blue-100 text-blue-700", icon: FileCheck },
          verified: { label: "Verified", class: "bg-green-100 text-green-700", icon: CheckCircle },
          rejected: { label: "Rejected", class: "bg-red-100 text-red-700", icon: XCircle },
          expired: { label: "Expired", class: "bg-slate-100 text-slate-700", icon: AlertTriangle },
        };
        const config = statusConfig[kyc.status];
        const Icon = config.icon;
        return (
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.class}`}>
            <Icon className="h-3 w-3" />
            {config.label}
          </span>
        );
      },
    },
    {
      key: "submitted",
      header: "Submitted",
      render: (kyc: KYCWithProfile) => (
        <span className="text-slate-600">{timeAgo(kyc.submitted_at || kyc.created_at)}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (kyc: KYCWithProfile) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedKYC(kyc);
              setShowDetailModal(true);
            }}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <Eye className="h-4 w-4" />
          </button>
          {kyc.status === "pending" && (
            <>
              <button
                onClick={() => setActionModal({ type: "approve", kyc })}
                className="rounded-lg p-2 text-green-600 hover:bg-green-50"
              >
                <CheckCircle className="h-4 w-4" />
              </button>
              <button
                onClick={() => setActionModal({ type: "reject", kyc })}
                className="rounded-lg p-2 text-red-600 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <MainLayout title="KYC Verification" subtitle="Review and verify user identity documents">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-slate-900">{kycList.filter((k) => k.status === "pending").length}</p>
                <p className="text-sm text-yellow-700">Pending</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center gap-3">
              <FileCheck className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-slate-900">{kycList.filter((k) => k.status === "in_review").length}</p>
                <p className="text-sm text-blue-700">In Review</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-slate-900">{kycList.filter((k) => k.status === "verified").length}</p>
                <p className="text-sm text-green-700">Verified</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-3">
              <XCircle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-slate-900">{kycList.filter((k) => k.status === "rejected").length}</p>
                <p className="text-sm text-red-700">Rejected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or document number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:border-cyan-500 focus:outline-none"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_review">In Review</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Table */}
        <DataTable columns={columns} data={kycList} loading={loading} emptyMessage="No KYC applications found" />

        {/* Pagination */}
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} totalCount={50} pageSize={20} />
      </div>

      {/* Detail Modal */}
      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="KYC Details" size="lg">
        {selectedKYC && selectedKYC.profile && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 rounded-lg bg-slate-50 p-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-xl font-bold text-white">
                {getInitials(selectedKYC.profile.name)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedKYC.profile.name}</h3>
                <p className="text-slate-500">{selectedKYC.profile.email}</p>
                <p className="text-sm text-slate-400">ID: {selectedKYC.profile.user_id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900">Personal Information</h4>
                <div className="rounded-lg bg-slate-50 p-3 space-y-2 text-sm">
                  <p><span className="text-slate-500">Full Name:</span> <span className="font-medium">{(selectedKYC.personal_info as any)?.firstName} {(selectedKYC.personal_info as any)?.lastName}</span></p>
                  <p><span className="text-slate-500">Date of Birth:</span> <span className="font-medium">{selectedKYC.date_of_birth || "N/A"}</span></p>
                  <p><span className="text-slate-500">National ID:</span> <span className="font-medium">{selectedKYC.national_id || "N/A"}</span></p>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900">Employment Details</h4>
                <div className="rounded-lg bg-slate-50 p-3 space-y-2 text-sm">
                  <p><span className="text-slate-500">Employer:</span> <span className="font-medium">{(selectedKYC.employment_info as any)?.employer || "N/A"}</span></p>
                  <p><span className="text-slate-500">Position:</span> <span className="font-medium">{(selectedKYC.employment_info as any)?.position || "N/A"}</span></p>
                  <p><span className="text-slate-500">Income:</span> <span className="font-medium">₦{((selectedKYC.employment_info as any)?.income || 0).toLocaleString()}</span></p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900">Bank Information</h4>
              <div className="rounded-lg bg-slate-50 p-3 space-y-2 text-sm">
                <p><span className="text-slate-500">Bank:</span> <span className="font-medium">{(selectedKYC.bank_info as any)?.bank || "N/A"}</span></p>
                <p><span className="text-slate-500">Account Number:</span> <span className="font-medium">{(selectedKYC.bank_info as any)?.accountNumber || "N/A"}</span></p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-slate-900">Selfie</h4>
                <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50">
                  <div className="text-center text-slate-400">
                    <Image className="mx-auto h-8 w-8" />
                    <p className="mt-1 text-xs">Selfie Photo</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-slate-900">ID Document</h4>
                <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50">
                  <div className="text-center text-slate-400">
                    <Image className="mx-auto h-8 w-8" />
                    <p className="mt-1 text-xs">ID Document</p>
                  </div>
                </div>
              </div>
            </div>

            {selectedKYC.status === "rejected" && selectedKYC.rejection_reason && (
              <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                <p className="font-medium text-red-700">Rejection Reason</p>
                <p className="mt-1 text-sm text-red-600">{selectedKYC.rejection_reason}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Approve Modal */}
      <Modal
        isOpen={actionModal?.type === "approve"}
        onClose={() => setActionModal(null)}
        title="Approve KYC"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setActionModal(null)}>Cancel</Button>
            <Button icon={CheckCircle} onClick={handleApprove}>Approve</Button>
          </>
        }
      >
        <p className="text-slate-600">Are you sure you want to approve this KYC verification for <span className="font-medium">{actionModal?.kyc.profile?.name}</span>?</p>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={actionModal?.type === "reject"}
        onClose={() => setActionModal(null)}
        title="Reject KYC"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setActionModal(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleReject}>Reject KYC</Button>
          </>
        }
      >
        <p className="mb-4 text-slate-600">Please provide a reason for rejecting this KYC verification.</p>
        <textarea
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder="Enter rejection reason..."
          className="h-32 w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
        />
      </Modal>
    </MainLayout>
  );
}
