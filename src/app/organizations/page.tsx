"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog";
import { Label } from "@/components/ui/Label";
import { toast } from "sonner";
import { Building2, Plus, Edit3, Users, DollarSign, CheckCircle } from "lucide-react";

interface Organization {
  id: string;
  name: string;
  type: "employer" | "cooperative" | "association";
  address: string;
  contactEmail: string;
  contactPhone: string;
  memberCount: number;
  totalSavings: number;
  status: "active" | "inactive";
  joinedAt: string;
}

const ORGS: Organization[] = [
  { id: "1", name: "Tech Corp Ltd", type: "employer", address: "123 Tech Avenue, Lagos", contactEmail: "hr@techcorp.com", contactPhone: "08012345678", memberCount: 45, totalSavings: 12500000, status: "active", joinedAt: "2023-01-15" },
  { id: "2", name: "Nigerian Teachers Union", type: "association", address: "45 Education Lane, Abuja", contactEmail: "info@ntu.org", contactPhone: "08098765432", memberCount: 120, totalSavings: 35000000, status: "active", joinedAt: "2022-06-20" },
  { id: "3", name: "Lagos Medical Cooperative", type: "cooperative", address: "78 Health Street, Ikeja", contactEmail: "contact@lagmedcoop.ng", contactPhone: "08055544433", memberCount: 85, totalSavings: 22000000, status: "active", joinedAt: "2023-03-10" },
  { id: "4", name: "Finance Professionals Assoc", type: "association", address: "12 Banking Road, Port Harcourt", contactEmail: "admin@finpro.org", contactPhone: "08077788899", memberCount: 32, totalSavings: 8900000, status: "inactive", joinedAt: "2022-11-05" },
];

export default function OrganizationsPage() {
  const [orgs] = useState<Organization[]>(ORGS);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = orgs.filter((o) => o.name.toLowerCase().includes(search.toLowerCase()));
  const formatCurrency = (v: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(v);
  const getTypeColor = (t: string) => ({ employer: "bg-blue-100 text-blue-700", cooperative: "bg-green-100 text-green-700", association: "bg-purple-100 text-purple-700" }[t] || "");

  return (
    <MainLayout title="Organizations" subtitle="Manage employer organizations and cooperatives">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><Building2 className="h-5 w-5 text-cyan-600" /><h2 className="text-lg font-semibold">Partner Organizations</h2></div>
          <Button className="bg-cyan-600 hover:bg-cyan-700" onClick={() => setShowModal(true)}><Plus className="h-4 w-4 mr-2" />Add Organization</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-cyan-100 flex items-center justify-center"><Building2 className="h-5 w-5 text-cyan-600" /></div><div><p className="text-sm text-slate-500">Total Organizations</p><p className="text-2xl font-bold">{orgs.length}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center"><Users className="h-5 w-5 text-green-600" /></div><div><p className="text-sm text-slate-500">Total Members</p><p className="text-2xl font-bold">{orgs.reduce((s, o) => s + o.memberCount, 0)}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center"><DollarSign className="h-5 w-5 text-yellow-600" /></div><div><p className="text-sm text-slate-500">Total Savings</p><p className="text-2xl font-bold">{formatCurrency(orgs.reduce((s, o) => s + o.totalSavings, 0))}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center"><CheckCircle className="h-5 w-5 text-purple-600" /></div><div><p className="text-sm text-slate-500">Active</p><p className="text-2xl font-bold">{orgs.filter((o) => o.status === "active").length}</p></div></div></CardContent></Card>
        </div>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>All Organizations</CardTitle>
            <div className="relative"><Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><Input placeholder="Search organizations..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 w-64" /></div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b"><tr><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Organization</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Contact</th><th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Members</th><th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Total Savings</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th></tr></thead>
                <tbody className="divide-y">
                  {filtered.map((org) => (
                    <tr key={org.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3"><div><p className="font-medium">{org.name}</p><p className="text-xs text-slate-500">{org.address}</p></div></td>
                      <td className="px-4 py-3"><Badge className={getTypeColor(org.type)}>{org.type}</Badge></td>
                      <td className="px-4 py-3"><div><p className="text-sm">{org.contactEmail}</p><p className="text-xs text-slate-500">{org.contactPhone}</p></div></td>
                      <td className="px-4 py-3 text-right font-medium">{org.memberCount}</td>
                      <td className="px-4 py-3 text-right font-medium text-green-600">{formatCurrency(org.totalSavings)}</td>
                      <td className="px-4 py-3"><Badge className={org.status === "active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"}>{org.status}</Badge></td>
                      <td className="px-4 py-3"><Button variant="ghost" size="sm"><Edit3 className="h-4 w-4 mr-1" />Edit</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Add Organization</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div><Label>Organization Name</Label><Input placeholder="e.g., Tech Corp Ltd" /></div>
            <div><Label>Type</Label>
              <select className="w-full border rounded-lg px-3 py-2">
                <option>Employer</option><option>Cooperative</option><option>Association</option>
              </select>
            </div>
            <div><Label>Address</Label><Input placeholder="Organization address" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Email</Label><Input type="email" placeholder="contact@org.com" /></div>
              <div><Label>Phone</Label><Input placeholder="08012345678" /></div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button><Button className="bg-cyan-600 hover:bg-cyan-700" onClick={() => { toast.success("Organization added"); setShowModal(false); }}>Add</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
