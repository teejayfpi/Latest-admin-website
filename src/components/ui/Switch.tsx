"use client";
import * as React from "react";
import { clsx } from "clsx";
export function Switch({ checked, onCheckedChange, className = "" }: { checked?: boolean; onCheckedChange?: (checked: boolean) => void; className?: string }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange?.(!checked)}
      className={clsx("peer inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500", checked ? "bg-cyan-600" : "bg-slate-200", className)}
    >
      <span className={clsx("pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform", checked ? "translate-x-5" : "translate-x-0")} />
    </button>
  );
}
