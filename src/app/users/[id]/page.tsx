"use client";

import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatCurrency, formatDate, getInitials, getStatusColor } from "@/lib/utils";
import { getUserById, updateUser, flagUser, unflagUser } from "@/lib/db-service";
import type { UserProfile } from "@/types";
import toast from "react-hot-toast";
import Link from "next/link";
import { 
  ArrowLeft, User, Mail, Phone, MapPin, Calendar, Building2, 
  CreditCard, Wallet, PiggyBank, Shield, FileCheck, Smartphone,
  Activity, Clock, CheckCircle, XCircle, AlertTriangle, 
  TrendingUp, ArrowUpRight, ArrowDownRight, ExternalLink,
  Ticket, Gift, FileText, Banknote
} from "lucide-react";

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const data = await getUserById(params.id);
        setUser(data as UserProfile);
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Failed to load user");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [params.id]);

  const handleToggleStatus = async () => {
    if (!user) return;
    setActionLoading(true);
    try {
      await updateUser(user.id, { is_active: !user.is_active });
      setUser({ ...user, is_active: !user.is_active });
      toast.success(`User ${user.is_active ? "suspended" : "activated"} successfully`);
    } catch (error) {
      toast.error("Failed to update user");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleFlag = async () => {
    if (!user) return;
    setActionLoading(true);
    try {
      if (user.is_flagged) {
        await unflagUser(user.id);
        setUser({ ...user, is_flagged: false, flagged_reason: null });
        toast.success("User unflagged");
      } else {
        await flagUser(user.id, "Flagged by admin");
        setUser({ ...user, is_flagged: true, flagged_reason: "Flagged by admin" });
        toast.success("User flagged");
      }
    } catch (error) {
      toast.error("Failed to update flag status");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout title="User Details" subtitle="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout title="User Details" subtitle="User not found">
        <div className="text-center py-12">
          <p className="text-slate-500">User not found</p>
          <Link href="/users" className="mt-4 inline-block text-cyan-600 hover:underline">
            Back to Users
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="User Details" subtitle={user.name || user.email}>
      <div className="space-y-6">
        {/* Back Button */}
        <Link href="/users" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </Link>

        {/* Header Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl font-bold text-white">
                  {getInitials(user.name || user.email)}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <h1 className="text-2xl font-bold text-slate-900">{user.name || "N/A"}</h1>
                  <Badge className={user.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}>
                    {user.is_active ? "Active" : "Inactive"}
                  </Badge>
                  {user.kyc_verified && (
                    <Badge className="bg-cyan-100 text-cyan-700">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      KYC Verified
                    </Badge>
                  )}
                  {user.is_flagged && (
                    <Badge className="bg-red-100 text-red-700">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Flagged
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span>{user.phone || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Building2 className="h-4 w-4 text-slate-400" />
                    <span className="capitalize">{user.department || user.role}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span>Joined {formatDate(user.created_at)}</span>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    variant={user.is_active ? "outline" : "default"}
                    icon={user.is_active ? XCircle : CheckCircle}
                    onClick={handleToggleStatus}
                    loading={actionLoading}
                  >
                    {user.is_active ? "Suspend User" : "Activate User"}
                  </Button>
                  <Button
                    variant={user.is_flagged ? "default" : "outline"}
                    icon={user.is_flagged ? CheckCircle : AlertTriangle}
                    onClick={handleToggleFlag}
                    loading={actionLoading}
                  >
                    {user.is_flagged ? "Unflag User" : "Flag User"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flag Reason */}
        {user.is_flagged && user.flagged_reason && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800">Flagged Reason</p>
                  <p className="text-sm text-red-700 mt-1">{user.flagged_reason}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-green-100">
                  <Wallet className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Wallet Balance</p>
                  <p className="text-xl font-bold text-slate-900">
                    {user.wallet ? formatCurrency(user.wallet.balance) : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-cyan-100">
                  <PiggyBank className="h-5 w-5 text-cyan-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Savings</p>
                  <p className="text-xl font-bold text-slate-900">
                    {user.savings ? formatCurrency(user.savings.total_saved) : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-blue-100">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Active Loans</p>
                  <p className="text-xl font-bold text-slate-900">
                    {user.loans?.filter(l => l.status === "active" || l.status === "disbursed").length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-purple-100">
                  <Gift className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Referrals</p>
                  <p className="text-xl font-bold text-slate-900">
                    {user.referral?.referral_count || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="kyc">KYC & Registration</TabsTrigger>
            <TabsTrigger value="mobile">Mobile App</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="loans">Loans</TabsTrigger>
            <TabsTrigger value="deposits">Deposits</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Profile Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500">User ID</p>
                      <p className="font-mono text-sm">{user.user_id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Role</p>
                      <p className="capitalize">{user.role}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Department</p>
                      <p>{user.department || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Access Level</p>
                      <p>{user.access_level || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">MFA Enabled</p>
                      <p>{user.mfa_enabled ? "Yes" : "No"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Last Updated</p>
                      <p>{formatDate(user.updated_at)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Wallet Details */}
              {user.wallet && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Wallet Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-500">Balance</p>
                        <p className="text-xl font-bold text-green-600">
                          {formatCurrency(user.wallet.balance)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Currency</p>
                        <p>{user.wallet.currency}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Status</p>
                        <Badge className={user.wallet.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                          {user.wallet.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Last Updated</p>
                        <p>{formatDate(user.wallet.last_updated)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Savings Details */}
              {user.savings && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PiggyBank className="h-5 w-5" />
                      Savings Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-500">Total Saved</p>
                        <p className="text-xl font-bold text-cyan-600">
                          {formatCurrency(user.savings.total_saved)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Monthly Savings</p>
                        <p>{formatCurrency(user.savings.monthly_savings)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Consecutive Months</p>
                        <p>{user.savings.consecutive_months}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">First Savings Date</p>
                        <p>{user.savings.first_savings_date ? formatDate(user.savings.first_savings_date) : "N/A"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Referral Details */}
              {user.referral && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gift className="h-5 w-5" />
                      Referral Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-500">Referral Code</p>
                        <p className="font-mono font-bold">{user.referral.my_referral_code}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Total Referrals</p>
                        <p className="text-xl font-bold">{user.referral.referral_count}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Confirmed Referrals</p>
                        <p>{user.referral.confirmed_referral_count}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Current Tier Bonus</p>
                        <p>{user.referral.current_tier_bonus}%</p>
                      </div>
                      {user.referral.referred_by_code && (
                        <div className="col-span-2">
                          <p className="text-sm text-slate-500">Referred By</p>
                          <p className="font-mono">{user.referral.referred_by_code}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* KYC Tab */}
          <TabsContent value="kyc" className="space-y-4">
            {user.kyc ? (
              <div className="space-y-4">
                {/* KYC Status Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      KYC Verification Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-slate-500">Status</p>
                        <Badge className={`mt-1 ${getStatusColor(user.kyc.status)}`}>
                          {user.kyc.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Verification Level</p>
                        <p className="font-medium">Level {user.kyc.verification_level}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Verified At</p>
                        <p>{user.kyc.verified_at ? formatDate(user.kyc.verified_at) : "Not verified"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Submitted At</p>
                        <p>{user.kyc.submitted_at ? formatDate(user.kyc.submitted_at) : "Not submitted"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Basic KYC Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-slate-500">National ID</p>
                        <p className="font-medium">{user.kyc.national_id || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Date of Birth</p>
                        <p className="font-medium">{user.kyc.date_of_birth || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Address</p>
                        <p className="font-medium">{user.kyc.address || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Rejection Reason</p>
                        <p className="font-medium text-red-600">{user.kyc.rejection_reason || "None"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Personal Info */}
                {user.kyc.personal_info && Object.keys(user.kyc.personal_info).length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {Object.entries(user.kyc.personal_info).map(([key, value]) => (
                          <div key={key}>
                            <p className="text-sm text-slate-500 capitalize">{key.replace(/_/g, " ")}</p>
                            <p className="font-medium">{String(value)}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Contact Info */}
                {user.kyc.contact_info && Object.keys(user.kyc.contact_info).length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {Object.entries(user.kyc.contact_info).map(([key, value]) => (
                          <div key={key}>
                            <p className="text-sm text-slate-500 capitalize">{key.replace(/_/g, " ")}</p>
                            <p className="font-medium">{String(value)}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Employment Info */}
                {user.kyc.employment_info && Object.keys(user.kyc.employment_info).length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Employment Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {Object.entries(user.kyc.employment_info).map(([key, value]) => (
                          <div key={key}>
                            <p className="text-sm text-slate-500 capitalize">{key.replace(/_/g, " ")}</p>
                            <p className="font-medium">{String(value)}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Bank Info */}
                {user.kyc.bank_info && Object.keys(user.kyc.bank_info).length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Bank Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {Object.entries(user.kyc.bank_info).map(([key, value]) => (
                          <div key={key}>
                            <p className="text-sm text-slate-500 capitalize">{key.replace(/_/g, " ")}</p>
                            <p className="font-medium">{String(value)}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Selfie Verification */}
                {user.kyc.selfie && (user.kyc.selfie as any)?.url && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Selfie Verification</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <img 
                        src={(user.kyc.selfie as any).url} 
                        alt="Selfie" 
                        className="h-48 w-auto rounded-lg border border-slate-200"
                      />
                    </CardContent>
                  </Card>
                )}

                {/* KYC Documents */}
                {user.kyc_documents && user.kyc_documents.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>KYC Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {user.kyc_documents.map((doc: any) => (
                          <div key={doc.id} className="border border-slate-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-medium capitalize">{doc.type.replace(/_/g, " ")}</p>
                              <Badge className={getStatusColor(doc.status)}>{doc.status}</Badge>
                            </div>
                            {doc.document_number && (
                              <p className="text-sm text-slate-500">Document #: {doc.document_number}</p>
                            )}
                            {doc.front_image_url && (
                              <a 
                                href={doc.front_image_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-cyan-600 hover:underline mt-2 inline-flex items-center gap-1"
                              >
                                View Document <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                            <p className="text-xs text-slate-400 mt-2">
                              Uploaded: {formatDate(doc.uploaded_at)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Shield className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No KYC information found</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Mobile App Tab */}
          <TabsContent value="mobile" className="space-y-4">
            {user.mobile_registration ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5" />
                      Device Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-500">Device ID</p>
                        <p className="font-mono text-sm">{user.mobile_registration.device_id || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Device Model</p>
                        <p className="font-medium">{user.mobile_registration.device_model || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">OS Version</p>
                        <p className="font-medium">{user.mobile_registration.device_os || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">App Version</p>
                        <p className="font-medium">{user.mobile_registration.app_version || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Registration Method</p>
                        <p className="font-medium capitalize">{user.mobile_registration.registration_method}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Referral Code Used</p>
                        <p className="font-mono">{user.mobile_registration.referral_code_used || "None"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      App Settings & Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4 text-slate-400" />
                          <span className="text-sm">Push Notifications</span>
                        </div>
                        <Badge className={user.mobile_registration.push_notifications_enabled ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}>
                          {user.mobile_registration.push_notifications_enabled ? "On" : "Off"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          <span className="text-sm">Location</span>
                        </div>
                        <Badge className={user.mobile_registration.location_enabled ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}>
                          {user.mobile_registration.location_enabled ? "On" : "Off"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-slate-400" />
                          <span className="text-sm">Biometric</span>
                        </div>
                        <Badge className={user.mobile_registration.biometric_enabled ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}>
                          {user.mobile_registration.biometric_enabled ? "On" : "Off"}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Last Active</p>
                        <p>{user.mobile_registration.last_active_at ? formatDate(user.mobile_registration.last_active_at) : "N/A"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Smartphone className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No mobile registration data found</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-4">
            {user.transactions && user.transactions.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {user.transactions.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${tx.type === "deposit" || tx.type === "savings" || tx.type === "refund" ? "bg-green-100" : "bg-red-100"}`}>
                            {tx.type === "deposit" || tx.type === "savings" || tx.type === "refund" ? (
                              <ArrowUpRight className={`h-4 w-4 text-green-600`} />
                            ) : (
                              <ArrowDownRight className={`h-4 w-4 text-red-600`} />
                            )}
                          </div>
                          <div>
                            <p className="font-medium capitalize">{tx.type.replace(/_/g, " ")}</p>
                            <p className="text-sm text-slate-500">{tx.description || tx.reference}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${tx.type === "deposit" || tx.type === "savings" || tx.type === "refund" ? "text-green-600" : "text-red-600"}`}>
                            {tx.type === "deposit" || tx.type === "savings" || tx.type === "refund" ? "+" : "-"}
                            {formatCurrency(tx.amount)}
                          </p>
                          <p className="text-sm text-slate-500">{formatDate(tx.created_at)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Activity className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No transactions found</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Loans Tab */}
          <TabsContent value="loans" className="space-y-4">
            {user.loans && user.loans.length > 0 ? (
              <div className="space-y-4">
                {user.loans.map((loan) => (
                  <Card key={loan.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium capitalize">{loan.loan_type.replace(/_/g, " ")}</h3>
                            <Badge className={getStatusColor(loan.status)}>{loan.status}</Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-slate-500">Principal</p>
                              <p className="font-medium">{formatCurrency(loan.principal_amount)}</p>
                            </div>
                            <div>
                              <p className="text-slate-500">Interest Rate</p>
                              <p className="font-medium">{loan.interest_rate}%</p>
                            </div>
                            <div>
                              <p className="text-slate-500">Outstanding</p>
                              <p className="font-medium text-red-600">{formatCurrency(loan.outstanding_balance)}</p>
                            </div>
                            <div>
                              <p className="text-slate-500">Monthly Repayment</p>
                              <p className="font-medium">{formatCurrency(loan.monthly_repayment)}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-slate-500">
                          Applied: {formatDate(loan.application_date)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <CreditCard className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No loans found</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Deposits Tab */}
          <TabsContent value="deposits" className="space-y-4">
            {user.deposits && user.deposits.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Proofs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {user.deposits.map((deposit) => (
                      <div key={deposit.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-full bg-cyan-100">
                            <Banknote className="h-4 w-4 text-cyan-600" />
                          </div>
                          <div>
                            <p className="font-medium">{formatCurrency(deposit.amount)}</p>
                            <p className="text-sm text-slate-500 capitalize">{deposit.payment_type.replace(/_/g, " ")}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(deposit.status)}>{deposit.status}</Badge>
                          <p className="text-sm text-slate-500 mt-1">{formatDate(deposit.created_at)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No deposits found</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Support Tickets */}
        {user.tickets && user.tickets.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5" />
                Recent Support Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {user.tickets.map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div>
                      <p className="font-medium">{ticket.subject}</p>
                      <p className="text-sm text-slate-500">{ticket.category} • {formatDate(ticket.created_at)}</p>
                    </div>
                    <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
