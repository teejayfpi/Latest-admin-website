"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (authData.user) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authData.user.id)
          .single();

        if (profileError || !profile) {
          setError("Profile not found");
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }

        if (profile.role !== "admin" && profile.role !== "superadmin") {
          setError("Access denied. Admin credentials required.");
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }

        localStorage.setItem("admin_user", JSON.stringify(profile));
        router.push("/dashboard");
        return;
      }

      setError("Login failed");
    } catch {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-2xl font-bold text-white shadow-lg shadow-cyan-500/30">
              C
            </div>
            <span className="text-2xl font-bold text-white">Coopvest Africa</span>
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight text-white">
            Enterprise Admin<br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>
          <p className="text-lg text-slate-300 max-w-md">
            Manage users, loans, transactions, and monitor your cooperative financial platform from a single, powerful dashboard.
          </p>
          
          <div className="grid grid-cols-2 gap-4 pt-4">
            {[
              { label: "Total Users", value: "10,000+" },
              { label: "Transactions", value: "₦500M+" },
              { label: "Active Loans", value: "2,500+" },
              { label: "Success Rate", value: "99.9%" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-slate-500">
          © 2024 Coopvest Africa. All rights reserved.
        </p>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex flex-1 items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="flex items-center justify-center gap-3 lg:hidden mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-xl font-bold text-white">
              C
            </div>
            <span className="text-xl font-bold text-slate-900">Coopvest Admin</span>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
            <p className="mt-2 text-slate-500">Enter your credentials to access the admin dashboard</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-700 border border-red-200">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@coopvest.com"
                  className="w-full h-12 rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <a href="#" className="text-sm font-medium text-cyan-600 hover:text-cyan-700">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
              />
              <label htmlFor="remember" className="text-sm text-slate-600">
                Keep me signed in
              </label>
            </div>

            <Button type="submit" className="w-full h-12 text-base" loading={loading}>
              Sign In
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-slate-50 px-4 text-slate-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 h-12 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 h-12 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </button>
          </div>

          <p className="text-center text-sm text-slate-500">
            Need help?{" "}
            <a href="#" className="font-medium text-cyan-600 hover:text-cyan-700">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
