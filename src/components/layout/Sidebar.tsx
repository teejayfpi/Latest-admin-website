"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  FileCheck,
  CreditCard,
  PiggyBank,
  Ticket,
  TrendingUp,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  Bell,
  Shield,
  Megaphone,
  Activity,
  DollarSign,
  Smartphone,
  Upload,
  FileSpreadsheet,
  PieChart,
  Calculator,
  HeartHandshake,
  AlertTriangle,
  Scale,
  UserCog,
  Clock,
  KeyRound,
  SmartphoneNfc,
  Banknote,
  Building2,
  Gift,
  UserCheck,
  ClipboardList,
  Percent,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/users", icon: Users },
  { name: "KYC Verification", href: "/kyc", icon: FileCheck },
  { name: "Deposits", href: "/deposits", icon: DollarSign },
  { name: "Loans", href: "/loans", icon: CreditCard },
  { name: "Transactions", href: "/transactions", icon: Activity },
  { name: "Savings", href: "/savings", icon: PiggyBank },
  { name: "Tickets", href: "/tickets", icon: Ticket },
  { name: "Investments", href: "/investments", icon: TrendingUp },
  { name: "Announcements", href: "/announcements", icon: Megaphone },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Audit Logs", href: "/audit-logs", icon: Shield },
  // Mobile & Content
  { name: "Mobile Features", href: "/mobile-features", icon: Smartphone },
  { name: "Notifications", href: "/notifications", icon: Bell },
  // Financial
  { name: "Manual Deposits", href: "/manual-deposits", icon: Banknote },
  { name: "Excel Manager", href: "/excel-manager", icon: FileSpreadsheet },
  { name: "Financial Dashboard", href: "/financial-dashboard", icon: PieChart },
  { name: "Accounting", href: "/accounting-spreadsheet", icon: Calculator },
  { name: "Member Contributions", href: "/member-contributions", icon: HeartHandshake },
  { name: "Deposit Verification", href: "/deposit-verification", icon: FileCheck },
  { name: "Interest Rates", href: "/interest-rates", icon: Percent },
  { name: "Payroll", href: "/payroll", icon: DollarSign },
  // Risk & Security
  { name: "Fraud Detection", href: "/fraud-detection", icon: AlertTriangle },
  { name: "Risk Scoring", href: "/risk-scoring", icon: Scale },
  { name: "Bulk Operations", href: "/bulk-operations", icon: ClipboardList },
  { name: "Rollover Management", href: "/rollover-management", icon: Clock },
  { name: "Role Management", href: "/role-management", icon: KeyRound },
  { name: "Login History", href: "/login-history", icon: Clock },
  { name: "Sessions", href: "/sessions", icon: SmartphoneNfc },
  // Organization
  { name: "Organizations", href: "/organizations", icon: Building2 },
  { name: "Referral Program", href: "/referral-program", icon: Gift },
  { name: "Guarantor System", href: "/guarantor-system", icon: UserCheck },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-slate-700 px-4">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 font-bold">
                C
              </div>
              <span className="text-lg font-bold">Coopvest</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-lg p-1.5 hover:bg-slate-700"
          >
            <ChevronLeft className={cn("h-5 w-5 transition-transform", collapsed && "rotate-180")} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                )}
              >
                <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-white")} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-slate-700 p-4">
          <button
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
