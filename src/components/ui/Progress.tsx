import * as React from "react";
export function Progress({ value = 0, className = "" }: { value?: number; className?: string }) {
  return (
    <div className={`relative h-2 w-full overflow-hidden rounded-full bg-slate-100 ${className}`}>
      <div className="h-full bg-cyan-600 transition-all" style={{ width: `${value}%` }} />
    </div>
  );
}
