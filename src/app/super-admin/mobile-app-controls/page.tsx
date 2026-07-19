"use client";

import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog";
import { supabaseAdmin } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Smartphone, Settings, Bell, Shield, CreditCard, Users, 
  RefreshCw, Save, AlertTriangle, DollarSign, Gift, Zap,
  FileText, TrendingUp
} from "lucide-react";
import toast from "react-hot-toast";

interface AppSettings {
  id: string;
  key: string;
  value: string | boolean | number;
  description: string;
  category: string;
  updated_at: string;
}

const DEFAULT_SETTINGS: AppSettings[] = [
  { id: "1", key: "maintenance_mode", value: false, description: "Enable/disable app maintenance mode", category: "general", updated_at: "" },
  { id: "2", key: "force_update", value: false, description: "Force users to update the app", category: "general", updated_at: "" },
  { id: "3", key: "registration_enabled", value: true, description: "Allow new user registration", category: "features", updated_at: "" },
  { id: "4", key: "savings_enabled", value: true, description: "Enable savings feature", category: "features", updated_at: "" },
  { id: "5", key: "loans_enabled", value: true, description: "Enable loans feature", category: "features", updated_at: "" },
  { id: "6", key: "investments_enabled", value: true, description: "Enable investments feature", category: "features", updated_at: "" },
  { id: "7", key: "referrals_enabled", value: true, description: "Enable referral program", category: "features", updated_at: "" },
  { id: "8", key: "min_deposit_amount", value: 1000, description: "Minimum deposit amount (₦)", category: "deposits", updated_at: "" },
  { id: "9", key: "monthly_contribution_required", value: true, description: "Require monthly contributions", category: "deposits", updated_at: "" },
  { id: "10", key: "contribution_amount", value: 5000, description: "Required monthly contribution (₦)", category: "deposits", updated_at: "" },
  { id: "11", key: "push_notifications", value: true, description: "Enable push notifications", category: "notifications", updated_at: "" },
  { id: "12", key: "biometric_required", value: false, description: "Require biometric authentication", category: "security", updated_at: "" },
  { id: "13", key: "mfa_required", value: false, description: "Require multi-factor authentication", category: "security", updated_at: "" },
];

export default function MobileAppControlsPage() {
  const { isSuperAdmin } = useAuth();
  const [settings, setSettings] = useState<AppSettings[]>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabaseAdmin
        .from("app_settings")
        .select("*")
        .order("category", { ascending: true });

      if (error || !data || data.length === 0) {
        setSettings(DEFAULT_SETTINGS);
      } else {
        setSettings(data as AppSettings[]);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      setSettings(DEFAULT_SETTINGS);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key: string) => {
    setSettings(prev => prev.map(s => 
      s.key === key ? { ...s, value: !s.value } : s
    ));
  };

  const handleValueChange = (key: string, value: string | number) => {
    setSettings(prev => prev.map(s => 
      s.key === key ? { ...s, value } : s
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const setting of settings) {
        await supabaseAdmin
          .from("app_settings")
          .upsert({
            key: setting.key,
            value: setting.value,
            description: setting.description,
            category: setting.category,
            updated_at: new Date().toISOString(),
          }, { onConflict: "key" });
      }
      toast.success("Settings saved successfully!");
      setShowSaveModal(false);
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "general": return Settings;
      case "features": return Zap;
      case "deposits": return DollarSign;
      case "notifications": return Bell;
      case "security": return Shield;
      default: return Settings;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "general": return "text-slate-600 bg-slate-100";
      case "features": return "text-purple-600 bg-purple-100";
      case "deposits": return "text-green-600 bg-green-100";
      case "notifications": return "text-blue-600 bg-blue-100";
      case "security": return "text-red-600 bg-red-100";
      default: return "text-slate-600 bg-slate-100";
    }
  };

  const categories = ["general", "features", "deposits", "notifications", "security"];

  if (!isSuperAdmin) {
    return (
      <MainLayout title="Mobile App Controls" subtitle="Access Denied">
        <Card>
          <CardContent className="p-8 text-center">
            <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h2>
            <p className="text-slate-500">Only Super Admins can access mobile app controls.</p>
          </CardContent>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Mobile App Controls" subtitle="Configure mobile app settings and features">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600">
              <Smartphone className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">App Configuration</h2>
              <p className="text-sm text-slate-500">Control mobile app features and settings</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={fetchSettings} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button onClick={() => setShowSaveModal(true)} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6 h-48 bg-slate-100"><div className="h-full"></div></CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {categories.map(category => {
              const categorySettings = settings.filter(s => s.category === category);
              const Icon = getCategoryIcon(category);
              if (categorySettings.length === 0) return null;
              
              return (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className={`p-2 rounded-lg ${getCategoryColor(category)}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="capitalize">{category} Settings</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {categorySettings.map(setting => (
                      <div key={setting.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 capitalize">{setting.key.replace(/_/g, " ")}</p>
                          <p className="text-xs text-slate-500">{setting.description}</p>
                        </div>
                        <div className="ml-4">
                          {typeof setting.value === "boolean" ? (
                            <button
                              onClick={() => handleToggle(setting.key)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                setting.value ? "bg-cyan-600" : "bg-slate-300"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  setting.value ? "translate-x-6" : "translate-x-1"
                                }`}
                              />
                            </button>
                          ) : (
                            <Input
                              type="number"
                              value={setting.value as number}
                              onChange={(e) => handleValueChange(setting.key, Number(e.target.value))}
                              className="w-32 text-right"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Connected Mobile App
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-slate-50 text-center">
                <Users className="h-6 w-6 text-cyan-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-slate-900">-</p>
                <p className="text-xs text-slate-500">Active Users</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 text-center">
                <CreditCard className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-slate-900">-</p>
                <p className="text-xs text-slate-500">Transactions</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 text-center">
                <FileText className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-slate-900">-</p>
                <p className="text-xs text-slate-500">Pending Deposits</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 text-center">
                <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-slate-900">-</p>
                <p className="text-xs text-slate-500">Monthly Growth</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Dialog open={showSaveModal} onOpenChange={setShowSaveModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Confirm Save Changes
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-slate-600">
                Save changes to <strong>{settings.length}</strong> settings? These changes will affect all mobile app users immediately.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSaveModal(false)}>Cancel</Button>
              <Button onClick={handleSave} loading={saving}><Save className="h-4 w-4 mr-2" />Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
