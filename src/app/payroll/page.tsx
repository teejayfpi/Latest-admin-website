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
import { DollarSign, Download, Upload, Users, FileText, CheckCircle, Clock } from "lucide-react";

interface PayrollRecord {
  id: string;
  memberId: string;
  memberName: string;
  employer: string;
  grossSalary: number;
  deduction: number;
  netSalary: number;
  status: "pending" | "processed" | "paid";
  month: string;
}

const PAYROLL: PayrollRecord[] = [
  { id: "1", memberId: "usr_001", memberName: "John Adebayo", employer: "Tech Corp Ltd", grossSalary: 500000, deduction: 50000, netSalary: 450000, status: "paid", month: "January 2024" },
  { id: "2", memberId: "usr_002", memberName: "Sarah Okonkwo", employer: "Finance Co", grossSalary: 750000, deduction: 75000, netSalary: 675000, status: "processed", month: "January 2024" },
  { id: "3", memberId: "usr_003", memberName: "Michael Eze", employer: "Manufacturing Inc", grossSalary: 350000, deduction: 35000, netSalary: 315000, status: "pending", month: "January 2024" },
  { id: "4", memberId: "usr_004", memberName: "Grace Nwosu", employer: "Healthcare Plus", grossSalary: 600000, deduction: 60000, netSalary: 540000, status: "paid", month: "December 2023" },
];

export default function PayrollPage() {
  const [records] = useState<PayrollRecord[]>(PAYROLL);
  const [showUpload, setShowUpload] = useState(false);

  const formatCurrency = (v: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(v);

  return (
    <MainLayout title="Payroll Management" subtitle="Manage salary deductions and payroll processing">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-cyan-600" /><h2 className="text-lg font-semibold">Salary Deductions</h2></div>
          <div className="flex items-center gap-2">
            <Button variant="outline"><Download className="h-4 w-4 mr-2" />Export</Button>
            <Button variant="outline" onClick={() => setShowUpload(true)}><Upload className="h-4 w-4 mr-2" />Upload</Button>
            <Button className="bg-cyan-600 hover:bg-cyan-700"><FileText className="h-4 w-4 mr-2" />Process Payroll</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-cyan-100 flex items-center justify-center"><Users className="h-5 w-5 text-cyan-600" /></div><div><p className="text-sm text-slate-500">Total Members</p><p className="text-2xl font-bold">{records.length}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center"><DollarSign className="h-5 w-5 text-green-600" /></div><div><p className="text-sm text-slate-500">Total Deductions</p><p className="text-2xl font-bold">{formatCurrency(records.reduce((s, r) => s + r.deduction, 0))}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center"><CheckCircle className="h-5 w-5 text-blue-600" /></div><div><p className="text-sm text-slate-500">Processed</p><p className="text-2xl font-bold">{records.filter((r) => r.status === "processed" || r.status === "paid").length}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center"><Clock className="h-5 w-5 text-yellow-600" /></div><div><p className="text-sm text-slate-500">Pending</p><p className="text-2xl font-bold">{records.filter((r) => r.status === "pending").length}</p></div></div></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Payroll Records</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b"><tr><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Member</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Employer</th><th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Gross Salary</th><th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Deduction (10%)</th><th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Net Salary</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Month</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th></tr></thead>
                <tbody className="divide-y">
                  {records.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3"><div><p className="font-medium">{r.memberName}</p><p className="text-xs text-slate-500">{r.memberId}</p></div></td>
                      <td className="px-4 py-3 text-sm">{r.employer}</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(r.grossSalary)}</td>
                      <td className="px-4 py-3 text-right text-red-600">{formatCurrency(r.deduction)}</td>
                      <td className="px-4 py-3 text-right font-medium">{formatCurrency(r.netSalary)}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{r.month}</td>
                      <td className="px-4 py-3"><Badge className={r.status === "paid" ? "bg-green-100 text-green-700" : r.status === "processed" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}>{r.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent><DialogHeader><DialogTitle>Upload Payroll Data</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-600">Click to upload or drag and drop</p>
              <p className="text-xs text-slate-400">.xlsx, .csv files only</p>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowUpload(false)}>Cancel</Button><Button className="bg-cyan-600 hover:bg-cyan-700" onClick={() => { toast.success("File uploaded"); setShowUpload(false); }}>Upload</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
