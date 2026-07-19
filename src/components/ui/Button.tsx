import * as React from "react";
import { clsx } from "clsx";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive" | "danger" | "secondary" | "primary";
  size?: "default" | "sm" | "lg" | "icon";
  icon?: React.ElementType;
  loading?: boolean;
  children?: React.ReactNode;
}

export function Button({ className = "", variant = "default", size = "default", icon: Icon, loading = false, children, ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50";
  const variants = {
    default: "bg-cyan-600 text-white hover:bg-cyan-700",
    outline: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
    ghost: "text-slate-600 hover:bg-slate-100",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    primary: "bg-cyan-600 text-white hover:bg-cyan-700",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 text-sm",
    lg: "h-12 px-6",
    icon: "h-10 w-10",
  };
  return (
    <button className={clsx(base, variants[variant], sizes[size], className)} disabled={loading || props.disabled} {...props}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : Icon && <Icon className="h-4 w-4" />}
      {children}
    </button>
  );
}
