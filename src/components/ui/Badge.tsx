import * as React from "react";
import { clsx } from "clsx";

interface BadgeProps {
  className?: string;
  variant?: "default" | "secondary" | "outline" | "destructive";
  children: React.ReactNode;
}

export function Badge({ className = "", variant = "default", children }: BadgeProps) {
  const variants = {
    default: "bg-cyan-600 text-white",
    secondary: "bg-slate-100 text-slate-700",
    outline: "border border-slate-200 bg-white text-slate-700",
    destructive: "bg-red-600 text-white",
  };

  return (
    <span className={clsx(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
