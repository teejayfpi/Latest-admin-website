"use client";
import * as React from "react";
import { clsx } from "clsx";
export function Dialog({ open, onOpenChange, children }: { open?: boolean; onOpenChange?: (open: boolean) => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange?.(false)} />
      <div className="relative z-50 w-full max-w-lg rounded-xl bg-white p-6 shadow-lg">{children}</div>
    </div>
  );
}
export function DialogContent({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={clsx("", className)}>{children}</div>;
}
export function DialogHeader({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={clsx("mb-4", className)}>{children}</div>;
}
export function DialogTitle({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <h2 className={clsx("text-lg font-semibold", className)}>{children}</h2>;
}
export function DialogFooter({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={clsx("mt-6 flex justify-end gap-3", className)}>{children}</div>;
}
