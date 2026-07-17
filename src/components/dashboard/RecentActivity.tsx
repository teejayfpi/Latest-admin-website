"use client";

import { formatCurrency, timeAgo, getStatusColor } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, CreditCard, UserPlus, FileCheck, Ticket } from "lucide-react";
import Link from "next/link";

interface ActivityItem {
  id: string;
  type: "deposit" | "withdrawal" | "loan" | "user" | "kyc" | "ticket";
  description: string;
  amount?: number;
  status: string;
  time: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

const iconMap = {
  deposit: { icon: ArrowDownRight, color: "text-green-600", bg: "bg-green-100" },
  withdrawal: { icon: ArrowUpRight, color: "text-red-600", bg: "bg-red-100" },
  loan: { icon: CreditCard, color: "text-purple-600", bg: "bg-purple-100" },
  user: { icon: UserPlus, color: "text-blue-600", bg: "bg-blue-100" },
  kyc: { icon: FileCheck, color: "text-cyan-600", bg: "bg-cyan-100" },
  ticket: { icon: Ticket, color: "text-orange-600", bg: "bg-orange-100" },
};

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
        <Link href="/transactions" className="text-sm font-medium text-cyan-600 hover:text-cyan-700">
          View All
        </Link>
      </div>
      <div className="space-y-4">
        {activities.map((activity) => {
          const { icon: Icon, color, bg } = iconMap[activity.type] || iconMap.user;
          return (
            <div key={activity.id} className="flex items-center gap-4">
              <div className={`rounded-lg p-2 ${bg}`}>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">{activity.description}</p>
                <p className="text-xs text-slate-500">{activity.time}</p>
              </div>
              <div className="text-right">
                {activity.amount && (
                  <p className={`text-sm font-semibold ${activity.type === "deposit" ? "text-green-600" : "text-slate-900"}`}>
                    {activity.type === "deposit" ? "+" : activity.type === "withdrawal" ? "-" : ""}
                    {formatCurrency(activity.amount)}
                  </p>
                )}
                <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(activity.status)}`}>
                  {activity.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
