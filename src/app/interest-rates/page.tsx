"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog";
import { Label } from "@/components/ui/Label";
import { toast } from "sonner";
import { Percent, Edit3, Save, TrendingUp, DollarSign, Clock } from "lucide-react";

interface InterestRate {
  id: string;
  name: string;
  type: "loan" | "savings" | "investment";
  rate: number;
  tenure: string;
  description: string;
  effectiveDate: string;
  status: "active" | "inactive";
}

const RATES: InterestRate[] = [
  { id: "1", name: "Standard Loan", type: "loan", rate: 2.5, tenure: "12 months", description: "Standard interest rate for regular loans", effectiveDate: "2024-01-01", status: "active" },
  { id: "2", name: "Emergency Loan", type: "loan", rate: 3.0, tenure: "6 months", description: "Higher rate for emergency short-term loans", effectiveDate: "2024-01-01", status: "active" },
  { id: "3", name: "Business Loan", type: "loan", rate: 1.5, tenure: "24 months", description: "Lower rate for business expansion loans", effectiveDate: "2024-01-01", status: "active" },
  { id: "4", name: "Regular Savings", type: "savings", rate: 5.0, tenure: "Annual", description: "Annual interest on regular savings", effectiveDate: "2024-01-01", status: "active" },
  { id: "5", name: "Fixed Deposit", type: "savings", rate: 8.5, tenure: "12 months", description: "Higher rate for fixed deposits", effectiveDate: "2024-01-01", status: "active" },
  { id: "6", name: "Investment Pool", type: "investment", rate: 12.0, tenure: "Annual", description: "Annual returns on investment pools", effectiveDate: "2024-01-01", status: "active" },
];

export default function InterestRatesPage() {
  const [rates, setRates] = useState<InterestRate[]>(RATES);
  const [editing, setEditing] = useState<InterestRate | null>(null);
  const [showEdit, setShowEdit] = useState(false);

  const handleEdit = (rate: InterestRate) => { setEditing({ ...rate }); setShowEdit(true); };
  const handleSave = () => {
    if (!editing) return;
    setRates((prev) => prev.map((r) => r.id === editing.id ? editing : r));
    setShowEdit(false);
    toast.success("Interest rate updated successfully");
  };

  const getTypeColor = (t: string) => ({ loan: "bg-cyan-100 text-cyan-700", savings: "bg-green-100 text-green-700", investment: "bg-purple-100 text-purple-700" }[t] || "");

  return (
    <MainLayout title="Interest Rates" subtitle="Manage loan, savings, and investment interest rates">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-cyan-100 flex items-center justify-center"><Percent className="h-5 w-5 text-cyan-600" /></div><div><p className="text-sm text-slate-500">Active Rates</p><p className="text-2xl font-bold">{rates.filter((r) => r.status === "active").length}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center"><TrendingUp className="h-5 w-5 text-green-600" /></div><div><p className="text-sm text-slate-500">Avg Loan Rate</p><p className="text-2xl font-bold">{rates.filter((r) => r.type === "loan").reduce((s, r) => s + r.rate, 0) / rates.filter((r) => r.type === "loan").length}%</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center"><DollarSign className="h-5 w-5 text-purple-600" /></div><div><p className="text-sm text-slate-500">Avg Savings Rate</p><p className="text-2xl font-bold">{rates.filter((r) => r.type === "savings").reduce((s, r) => s + r.rate, 0) / rates.filter((r) => r.type === "savings").length}%</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center"><Clock className="h-5 w-5 text-yellow-600" /></div><div><p className="text-sm text-slate-500">Last Updated</p><p className="text-2xl font-bold">Jan 1</p></div></div></CardContent></Card>
        </div>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2"><Percent className="h-5 w-5 text-cyan-600" />All Interest Rates</CardTitle>
            <Button className="bg-cyan-600 hover:bg-cyan-700"><Save className="h-4 w-4 mr-2" />Save Changes</Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b"><tr><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Name</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th><th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Rate</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tenure</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Effective Date</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th></tr></thead>
                <tbody className="divide-y">
                  {rates.map((rate) => (
                    <tr key={rate.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3"><div><p className="font-medium">{rate.name}</p><p className="text-xs text-slate-500">{rate.description}</p></div></td>
                      <td className="px-4 py-3"><Badge className={getTypeColor(rate.type)}>{rate.type}</Badge></td>
                      <td className="px-4 py-3 text-center"><span className="text-xl font-bold text-cyan-600">{rate.rate}%</span></td>
                      <td className="px-4 py-3 text-sm">{rate.tenure}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{rate.effectiveDate}</td>
                      <td className="px-4 py-3"><Badge className={rate.status === "active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"}>{rate.status}</Badge></td>
                      <td className="px-4 py-3"><Button variant="ghost" size="sm" onClick={() => handleEdit(rate)}><Edit3 className="h-4 w-4 mr-1" />Edit</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Interest Rate</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4 py-4">
              <div><Label>Rate Name</Label><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Rate (%)</Label><Input type="number" step="0.1" value={editing.rate} onChange={(e) => setEditing({ ...editing, rate: Number(e.target.value) })} /></div>
                <div><Label>Tenure</Label><Input value={editing.tenure} onChange={(e) => setEditing({ ...editing, tenure: e.target.value })} /></div>
              </div>
              <div><Label>Description</Label><Input value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setShowEdit(false)}>Cancel</Button><Button className="bg-cyan-600 hover:bg-cyan-700" onClick={handleSave}>Save Changes</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
