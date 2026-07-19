import * as React from "react";
import { clsx } from "clsx";

interface CardProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export function Card({ className = "", children, onClick }: CardProps) {
  return <div className={clsx("rounded-xl border border-slate-200 bg-white shadow-sm", className)} onClick={onClick}>{children}</div>;
}

export function CardHeader({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={clsx("px-6 py-4 border-b border-slate-100", className)}>{children}</div>;
}

export function CardTitle({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <h3 className={clsx("text-lg font-semibold text-slate-900", className)}>{children}</h3>;
}

export function CardContent({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={clsx("px-6 py-4", className)}>{children}</div>;
}
