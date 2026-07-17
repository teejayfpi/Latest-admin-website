import { supabaseAdmin } from "./supabase";
import type {
  Profile,
  KYC,
  Wallet,
  Transaction,
  Loan,
  Ticket,
  Savings,
  InvestmentPool,
  InvestmentParticipation,
  AuditLog,
  DashboardStats,
  PaginatedResponse,
  FilterOptions,
} from "@/types";

// Dashboard Stats
export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    usersResult,
    activeUsersResult,
    savingsResult,
    loansResult,
    pendingLoansResult,
    pendingKYCResult,
    openTicketsResult,
    lastMonthSavingsResult,
  ] = await Promise.all([
    supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabaseAdmin.from("savings").select("total_saved").then((r) => r.data?.reduce((acc, s) => acc + Number(s.total_saved), 0) || 0),
    supabaseAdmin.from("loans").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("loans").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabaseAdmin.from("kyc").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabaseAdmin.from("tickets").select("*", { count: "exact", head: true }).in("status", ["open", "in_progress", "escalated"]),
    supabaseAdmin.from("savings").select("total_saved").lt("created_at", thisMonth.toISOString()).then((r) => r.data?.reduce((acc, s) => acc + Number(s.total_saved), 0) || 0),
  ]);

  const currentSavings = savingsResult || 0;
  const previousSavings = lastMonthSavingsResult || 0;
  const monthlyGrowth = previousSavings > 0 ? (((currentSavings - previousSavings) / previousSavings) * 100).toFixed(1) : "0";

  return {
    totalUsers: usersResult.count || 0,
    activeUsers: activeUsersResult.count || 0,
    totalSavings: currentSavings,
    totalLoans: loansResult.count || 0,
    pendingLoans: pendingLoansResult.count || 0,
    pendingKYC: pendingKYCResult.count || 0,
    openTickets: openTicketsResult.count || 0,
    monthlyGrowth: Number(monthlyGrowth),
  };
}

// Users
export async function getUsers(options: FilterOptions = {}): Promise<PaginatedResponse<Profile & { wallet?: Wallet; savings?: Savings }>> {
  const { search, status, role, dateFrom, dateTo, page = 1, pageSize = 20, sortBy = "created_at", sortOrder = "desc" } = options;

  let query = supabaseAdmin.from("profiles").select("*", { count: "exact" });

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,user_id.ilike.%${search}%`);
  }
  if (status === "active") query = query.eq("is_active", true);
  if (status === "inactive") query = query.eq("is_active", false);
  if (status === "flagged") query = query.eq("is_flagged", true);
  if (role) query = query.eq("role", role);
  if (dateFrom) query = query.gte("created_at", dateFrom);
  if (dateTo) query = query.lte("created_at", dateTo);

  query = query.order(sortBy as any, { ascending: sortOrder === "asc" });
  query = query.range((page - 1) * pageSize, page * pageSize - 1);

  const { data, count, error } = await query;

  if (error) throw error;

  // Fetch wallets and savings for users
  const userIds = data?.map((u) => u.id) || [];
  const [walletsResult, savingsResult] = await Promise.all([
    supabaseAdmin.from("wallets").select("*").in("profile_id", userIds),
    supabaseAdmin.from("savings").select("*").in("profile_id", userIds),
  ]);

  const walletsMap = new Map(walletsResult.data?.map((w) => [w.profile_id, w]) || []);
  const savingsMap = new Map(savingsResult.data?.map((s) => [s.profile_id, s]) || []);

  const enrichedData = data?.map((user) => ({
    ...user,
    wallet: walletsMap.get(user.id),
    savings: savingsMap.get(user.id),
  })) || [];

  return {
    data: enrichedData as any,
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

export async function getUserById(id: string): Promise<(Profile & { wallet?: Wallet; savings?: Savings; kyc?: KYC }) | null> {
  const { data: profile, error } = await supabaseAdmin.from("profiles").select("*").eq("id", id).single();
  if (error || !profile) return null;

  const [walletResult, savingsResult, kycResult] = await Promise.all([
    supabaseAdmin.from("wallets").select("*").eq("profile_id", id).single(),
    supabaseAdmin.from("savings").select("*").eq("profile_id", id).single(),
    supabaseAdmin.from("kyc").select("*").eq("profile_id", id).single(),
  ]);

  return {
    ...profile,
    wallet: walletResult.data,
    savings: savingsResult.data,
    kyc: kycResult.data,
  };
}

export async function updateUser(id: string, updates: Partial<Profile>): Promise<Profile> {
  const { data, error } = await supabaseAdmin.from("profiles").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function flagUser(id: string, reason: string): Promise<void> {
  await supabaseAdmin.from("profiles").update({ is_flagged: true, flagged_reason: reason }).eq("id", id);
}

export async function unflagUser(id: string): Promise<void> {
  await supabaseAdmin.from("profiles").update({ is_flagged: false, flagged_reason: null }).eq("id", id);
}

// KYC
export async function getKYCApplications(options: FilterOptions = {}): Promise<PaginatedResponse<KYC & { profile?: Profile }>> {
  const { status, search, page = 1, pageSize = 20 } = options;

  let query = supabaseAdmin.from("kyc").select("*, profile:profiles(*)", { count: "exact" });

  if (status) query = query.eq("status", status);
  if (search) {
    query = query.or(`profile:profiles(name).ilike.%${search}%,profile:profiles(email).ilike.%${search}%`);
  }

  query = query.order("created_at", { ascending: false }).range((page - 1) * pageSize, page * pageSize - 1);

  const { data, count, error } = await query;
  if (error) throw error;

  return {
    data: data as any,
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

export async function updateKYCStatus(id: string, status: string, rejectionReason?: string): Promise<void> {
  const updates: Record<string, any> = { status };
  if (status === "verified") updates.verified_at = new Date().toISOString();
  if (status === "rejected" && rejectionReason) updates.rejection_reason = rejectionReason;
  await supabaseAdmin.from("kyc").update(updates).eq("id", id);
}

// Loans
export async function getLoans(options: FilterOptions = {}): Promise<PaginatedResponse<Loan & { profile?: Profile }>> {
  const { status, search, page = 1, pageSize = 20, sortBy = "created_at", sortOrder = "desc" } = options;

  let query = supabaseAdmin.from("loans").select("*, profile:profiles(*)", { count: "exact" });

  if (status) query = query.eq("status", status);
  if (search) {
    query = query.or(`profile:profiles(name).ilike.%${search}%,profile:profiles(email).ilike.%${search}%`);
  }

  query = query.order(sortBy as any, { ascending: sortOrder === "asc" }).range((page - 1) * pageSize, page * pageSize - 1);

  const { data, count, error } = await query;
  if (error) throw error;

  return {
    data: data as any,
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

export async function getLoanById(id: string): Promise<(Loan & { profile?: Profile; guarantors?: any[] }) | null> {
  const { data: loan, error } = await supabaseAdmin.from("loans").select("*, profile:profiles(*)").eq("id", id).single();
  if (error || !loan) return null;

  const { data: guarantors } = await supabaseAdmin.from("loan_guarantors").select("*, guarantor:profiles(*), borrower:profiles(*)").eq("loan_id", id);

  return { ...loan, guarantors: guarantors || [] };
}

export async function updateLoanStatus(id: string, status: string, notes?: string): Promise<void> {
  const updates: Record<string, any> = { status };
  if (status === "approved") updates.approval_date = new Date().toISOString();
  if (status === "disbursed") updates.disbursement_date = new Date().toISOString();
  if (notes) updates.notes = notes;
  await supabaseAdmin.from("loans").update(updates).eq("id", id);
}

// Transactions
export async function getTransactions(options: FilterOptions = {}): Promise<PaginatedResponse<Transaction>> {
  const { type, status, search, dateFrom, dateTo, page = 1, pageSize = 20 } = options;

  let query = supabaseAdmin.from("transactions").select("*, profile:profiles(*)", { count: "exact" });

  if (type) query = query.eq("type", type);
  if (status) query = query.eq("status", status);
  if (search) query = query.or(`reference.ilike.%${search}%,description.ilike.%${search}%`);
  if (dateFrom) query = query.gte("created_at", dateFrom);
  if (dateTo) query = query.lte("created_at", dateTo);

  query = query.order("created_at", { ascending: false }).range((page - 1) * pageSize, page * pageSize - 1);

  const { data, count, error } = await query;
  if (error) throw error;

  return {
    data: data as any,
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

// Savings
export async function getSavings(options: FilterOptions = {}): Promise<PaginatedResponse<Savings & { profile?: Profile }>> {
  const { search, page = 1, pageSize = 20 } = options;

  let query = supabaseAdmin.from("savings").select("*, profile:profiles(*)", { count: "exact" });
  if (search) query = query.or(`profile:profiles(name).ilike.%${search}%,profile:profiles(email).ilike.%${search}%`);

  query = query.order("total_saved", { ascending: false }).range((page - 1) * pageSize, page * pageSize - 1);

  const { data, count, error } = await query;
  if (error) throw error;

  return {
    data: data as any,
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

// Tickets
export async function getTickets(options: FilterOptions = {}): Promise<PaginatedResponse<Ticket & { profile?: Profile }>> {
  const { status, priority, search, page = 1, pageSize = 20 } = options;

  let query = supabaseAdmin.from("tickets").select("*, profile:profiles(*)", { count: "exact" });

  if (status) query = query.eq("status", status);
  if (priority) query = query.eq("priority", priority);
  if (search) query = query.or(`subject.ilike.%${search}%,description.ilike.%${search}%`);

  query = query.order("created_at", { ascending: false }).range((page - 1) * pageSize, page * pageSize - 1);

  const { data, count, error } = await query;
  if (error) throw error;

  return {
    data: data as any,
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

export async function updateTicketStatus(id: string, status: string, resolutionNotes?: string): Promise<void> {
  const updates: Record<string, any> = { status };
  if (status === "resolved") {
    updates.resolved_at = new Date().toISOString();
    if (resolutionNotes) updates.resolution_notes = resolutionNotes;
  }
  if (status === "closed") updates.closed_at = new Date().toISOString();
  await supabaseAdmin.from("tickets").update(updates).eq("id", id);
}

// Investments
export async function getInvestmentPools(): Promise<InvestmentPool[]> {
  const { data, error } = await supabaseAdmin.from("investment_pools").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getInvestmentParticipations(options: FilterOptions = {}): Promise<PaginatedResponse<InvestmentParticipation>> {
  const { status, page = 1, pageSize = 20 } = options;

  let query = supabaseAdmin.from("investment_participations").select("*, profile:profiles(*), pool:investment_pools(*)", { count: "exact" });
  if (status) query = query.eq("status", status);

  query = query.order("created_at", { ascending: false }).range((page - 1) * pageSize, page * pageSize - 1);

  const { data, count, error } = await query;
  if (error) throw error;

  return {
    data: data as any,
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

// Audit Logs
export async function getAuditLogs(options: FilterOptions = {}): Promise<PaginatedResponse<AuditLog>> {
  const { action, entityType, dateFrom, dateTo, page = 1, pageSize = 50 } = options;

  let query = supabaseAdmin.from("audit_logs").select("*, actor:profiles(*)", { count: "exact" });

  if (action) query = query.eq("action", action);
  if (entityType) query = query.eq("entity_type", entityType);
  if (dateFrom) query = query.gte("created_at", dateFrom);
  if (dateTo) query = query.lte("created_at", dateTo);

  query = query.order("created_at", { ascending: false }).range((page - 1) * pageSize, page * pageSize - 1);

  const { data, count, error } = await query;
  if (error) throw error;

  return {
    data: data as any,
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

// Chart Data
export async function getTransactionsChartData(days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabaseAdmin
    .from("transactions")
    .select("created_at, amount, type")
    .gte("created_at", startDate.toISOString())
    .eq("status", "completed");

  if (error) throw error;

  // Group by date
  const grouped: Record<string, Record<string, number>> = {};
  data?.forEach((t) => {
    const date = t.created_at.split("T")[0];
    if (!grouped[date]) grouped[date] = { deposits: 0, withdrawals: 0, loans: 0 };
    if (t.type === "deposit" || t.type === "savings") grouped[date].deposits += Number(t.amount);
    else if (t.type === "withdrawal") grouped[date].withdrawals += Number(t.amount);
    else if (t.type === "loan_disbursement") grouped[date].loans += Number(t.amount);
  });

  return Object.entries(grouped).map(([date, values]) => ({
    date,
    ...values,
  }));
}

export async function getUserGrowthData(months: number = 6) {
  const result = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

    const { count } = await supabaseAdmin
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", monthStart.toISOString())
      .lte("created_at", monthEnd.toISOString());

    result.push({
      month: monthStart.toLocaleString("default", { month: "short" }),
      users: count || 0,
    });
  }

  return result;
}
