// User & Authentication Types
export interface Profile {
  id: string;
  user_id: string;
  email: string;
  phone: string | null;
  name: string | null;
  role: "member" | "admin" | "superadmin" | "staff";
  is_active: boolean;
  is_flagged: boolean;
  flagged_reason: string | null;
  kyc_verified: boolean;
  department: string | null;
  access_level: string | null;
  mfa_enabled: boolean;
  created_at: string;
  updated_at: string;
}

// KYC Types
export interface KYC {
  id: string;
  profile_id: string;
  status: "pending" | "in_review" | "verified" | "rejected" | "expired";
  verified: boolean;
  verified_at: string | null;
  verification_level: number;
  rejection_reason: string | null;
  national_id: string | null;
  address: string | null;
  date_of_birth: string | null;
  personal_info: Record<string, unknown>;
  contact_info: Record<string, unknown>;
  employment_info: Record<string, unknown>;
  bank_info: Record<string, unknown>;
  selfie: Record<string, unknown>;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface KYCDocument {
  id: string;
  kyc_id: string;
  profile_id: string;
  type: "national_id" | "passport" | "drivers_license" | "voters_card" | "utility_bill" | "bank_statement";
  document_number: string | null;
  expiry_date: string | null;
  front_image_url: string | null;
  back_image_url: string | null;
  status: "pending" | "verified" | "rejected" | "expired";
  rejection_reason: string | null;
  uploaded_at: string;
  verified_at: string | null;
}

// Wallet & Transactions
export interface Wallet {
  id: string;
  profile_id: string;
  balance: number;
  currency: string;
  is_active: boolean;
  last_updated: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  profile_id: string;
  wallet_id: string;
  type: "deposit" | "withdrawal" | "transfer" | "loan_disbursement" | "loan_repayment" | "interest" | "fee" | "savings" | "refund" | "rollover_payment";
  amount: number;
  balance_before: number;
  balance_after: number;
  status: "pending" | "completed" | "failed" | "cancelled";
  reference: string;
  description: string | null;
  metadata: Record<string, unknown>;
  processed_at: string | null;
  created_at: string;
  profile?: Profile;
}

// Savings Types
export interface Savings {
  id: string;
  profile_id: string;
  total_saved: number;
  monthly_savings: number;
  first_savings_date: string | null;
  consecutive_months: number;
  last_savings_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface SavingsGoal {
  id: string;
  profile_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
  frequency: "daily" | "weekly" | "biweekly" | "monthly" | null;
  status: "active" | "completed" | "paused" | "cancelled";
  auto_debit: boolean;
  created_at: string;
  updated_at: string;
}

// Loan Types
export interface Loan {
  id: string;
  profile_id: string;
  loan_type: string;
  principal_amount: number;
  interest_rate: number;
  tenure_months: number;
  monthly_repayment: number;
  total_repayment: number;
  total_interest: number;
  amount_disbursed: number;
  outstanding_balance: number;
  status: "pending" | "approved" | "disbursed" | "active" | "completed" | "defaulted" | "cancelled";
  repayment_status: "pending" | "partial" | "active" | "completed" | "defaulted";
  application_date: string;
  approval_date: string | null;
  disbursement_date: string | null;
  first_repayment_date: string | null;
  next_repayment_date: string | null;
  maturity_date: string | null;
  rejection_reason: string | null;
  approved_by: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export interface LoanGuarantor {
  id: string;
  loan_id: string;
  guarantor_id: string;
  borrower_id: string;
  consent_given: boolean;
  consent_date: string | null;
  status: "pending" | "confirmed" | "declined";
  relationship: string | null;
  created_at: string;
  updated_at: string;
}

// Support Tickets
export interface Ticket {
  id: string;
  profile_id: string;
  subject: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "pending" | "resolved" | "closed" | "escalated";
  assigned_to: string | null;
  resolution_notes: string | null;
  resolved_at: string | null;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

// Referral Types
export interface Referral {
  id: string;
  profile_id: string;
  my_referral_code: string;
  referred_by_id: string | null;
  referred_by_code: string | null;
  referral_count: number;
  confirmed_referral_count: number;
  current_tier_bonus: number;
  created_at: string;
  updated_at: string;
}

export interface ReferralEvent {
  id: string;
  referral_id: string;
  referrer_id: string;
  referrer_name: string | null;
  referred_id: string | null;
  referred_name: string | null;
  referral_code: string;
  confirmed: boolean;
  confirmed_at: string | null;
  is_flagged: boolean;
  flagged_reason: string | null;
  tier_bonus_percent: number;
  created_at: string;
  updated_at: string;
}

// Investment Types
export interface InvestmentPool {
  id: string;
  name: string;
  description: string;
  min_amount: number;
  max_amount: number;
  interest_rate: number;
  tenure_days: number;
  total_slots: number;
  filled_slots: number;
  status: "active" | "closed" | "completed" | "upcoming";
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export interface InvestmentParticipation {
  id: string;
  profile_id: string;
  pool_id: string;
  amount: number;
  expected_return: number;
  status: "active" | "completed" | "cancelled" | "defaulted";
  start_date: string;
  maturity_date: string;
  payout_date: string | null;
  created_at: string;
  updated_at: string;
  profile?: Profile;
  pool?: InvestmentPool;
}

// Announcement Types
export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: "general" | "promotion" | "alert" | "update" | "maintenance";
  target_audience: "all" | "members" | "admins" | "specific";
  target_user_ids: string[];
  priority: "low" | "normal" | "high" | "urgent";
  is_active: boolean;
  starts_at: string;
  expires_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Audit Log Types
export interface AuditLog {
  id: string;
  actor_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  old_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  actor?: Profile;
}

// Dashboard Stats
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalSavings: number;
  totalLoans: number;
  pendingLoans: number;
  pendingKYC: number;
  openTickets: number;
  monthlyGrowth: number;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filter Options
export interface FilterOptions {
  search?: string;
  status?: string;
  type?: string;
  priority?: string;
  dateFrom?: string;
  dateTo?: string;
  role?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  action?: string;
  entityType?: string;
}

// Deposit Types
export type DepositStatus = "pending" | "under_review" | "verified" | "rejected";
export type PaymentProofType = "monthly_contribution" | "loan_repayment" | "registration_fee" | "investment" | "other";
export type PaymentMethod = "bank_transfer" | "ussd" | "pos" | "cash_deposit" | "card";

export interface DepositRequest {
  id: string;
  profile_id: string;
  payment_type: PaymentProofType | string;
  amount: number;
  currency: string;
  payment_date: string;
  payment_method: PaymentMethod | string | null;
  receiving_bank: string | null;
  bank_account_name: string | null;
  bank_account_number: string | null;
  transaction_reference: string | null;
  proof_url: string | null;
  proof_type: string | null;
  original_filename: string | null;
  file_size: number | null;
  status: DepositStatus;
  rejection_reason: string | null;
  admin_notes: string | null;
  member_note: string | null;
  reviewed_by: string | null;
  approved_at: string | null;
  approved_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface DepositStats {
  total: number;
  pending: number;
  under_review: number;
  verified: number;
  rejected: number;
  total_amount: number;
  pending_amount: number;
  verified_amount: number;
}
