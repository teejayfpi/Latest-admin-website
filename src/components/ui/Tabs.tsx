"use client";
import * as React from "react";
import { clsx } from "clsx";

export function Tabs({ defaultValue, className = "", children }: { defaultValue?: string; className?: string; children: React.ReactNode }) {
  return <div className={className}>{children}</div>;
}
export function TabsList({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={clsx("inline-flex h-10 items-center justify-center rounded-lg bg-slate-100 p-1", className)}>{children}</div>;
}
export function TabsTrigger({ value, className = "", children }: { value: string; className?: string; children: React.ReactNode }) {
  return <button className={clsx("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm", className)}>{children}</button>;
}
export function TabsContent({ value, className = "", children }: { value: string; className?: string; children: React.ReactNode }) {
  return <div className={clsx("mt-4", className)}>{children}</div>;
}
