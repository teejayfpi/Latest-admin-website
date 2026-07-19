"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({ success: false }),
  logout: async () => {},
  isAdmin: false,
  isSuperAdmin: false,
  refreshUser: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";
  const isSuperAdmin = user?.role === "superadmin";

  const refreshUser = async () => {
    const storedUser = localStorage.getItem("admin_user");
    if (storedUser) {
      try {
        const profile = JSON.parse(storedUser);
        // Re-fetch from Supabase to get latest data
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", profile.id)
          .single();
        if (data) {
          localStorage.setItem("admin_user", JSON.stringify(data));
          setUser(data);
        }
      } catch {
        localStorage.removeItem("admin_user");
        setUser(null);
      }
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("admin_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("admin_user");
      }
    }
    setLoading(false);
  }, []);

  // Protect admin routes
  useEffect(() => {
    if (loading) return;
    
    const publicRoutes = ["/login", "/"];
    const isPublicRoute = publicRoutes.includes(pathname);
    const isAdminRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/users") || 
                         pathname.startsWith("/loans") || pathname.startsWith("/kyc") || 
                         pathname.startsWith("/investments") || pathname.startsWith("/savings") ||
                         pathname.startsWith("/transactions") || pathname.startsWith("/tickets") ||
                         pathname.startsWith("/settings") || pathname.startsWith("/audit-logs") ||
                         pathname.startsWith("/role-management") || pathname.startsWith("/mobile-features") ||
                         pathname.startsWith("/manual-deposits") || pathname.startsWith("/excel-manager") ||
                         pathname.startsWith("/financial-dashboard") || pathname.startsWith("/accounting-spreadsheet") ||
                         pathname.startsWith("/member-contributions") || pathname.startsWith("/deposit-verification") ||
                         pathname.startsWith("/fraud-detection") || pathname.startsWith("/risk-scoring") ||
                         pathname.startsWith("/bulk-operations") || pathname.startsWith("/rollover-management") ||
                         pathname.startsWith("/interest-rates") || pathname.startsWith("/notifications") ||
                         pathname.startsWith("/login-history") || pathname.startsWith("/sessions") ||
                         pathname.startsWith("/payroll") || pathname.startsWith("/organizations") ||
                         pathname.startsWith("/referral-program") || pathname.startsWith("/guarantor-system") ||
                         pathname.startsWith("/announcements") || pathname.startsWith("/reports") ||
                         pathname.startsWith("/deposits") || pathname.startsWith("/super-admin");

    if (isAdminRoute && !user) {
      router.push("/login");
    } else if (pathname === "/login" && user) {
      router.push("/dashboard");
    }
  }, [pathname, user, loading, router]);

  const login = async (email: string, password: string) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        return { success: false, error: authError.message };
      }

      if (authData.user) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authData.user.id)
          .single();

        if (profileError || !profile) {
          return { success: false, error: "Profile not found" };
        }

        if (profile.role !== "admin" && profile.role !== "superadmin") {
          await supabase.auth.signOut();
          return { success: false, error: "Access denied. Admin credentials required." };
        }

        localStorage.setItem("admin_user", JSON.stringify(profile));
        setUser(profile);
        router.push("/dashboard");
        return { success: true };
      }

      return { success: false, error: "Login failed" };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("admin_user");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isSuperAdmin, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
