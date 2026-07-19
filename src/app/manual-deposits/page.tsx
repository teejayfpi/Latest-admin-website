"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Badge } from "@/components/ui/Badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog";
import { toast } from "sonner";
import { Plus, Search, DollarSign, CheckCircle, XCircle, Filter, Download } from "lucide-react";

interface ManualDeposit {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  date: string;
  status: "pending" | "approved" | "rejected";
  method: string;
  reference: string;
  approvedBy?: string;
  notes?: string;
}

const MOCK_DEPOSITS: ManualDeposit[] = [
  { id: "1", userId: "usr_001", userName: "John Adebayo", amount: 50000, date: "2024-01-15", status: "pending", method: "Bank Transfer", reference: "TRF/2024/001" },
  { id: "2", userId: "usr_002", userName: "Sarah Okonkwo", amount: 75000, date: "2024-01-14", status: "approved", method: "Cash Deposit", reference: "CASH/2024/002", approvedBy: "Admin" },
  { id: "3", userId: "usr_003", userName: "Michael Eze", amount: 100000, date: "2024-01-13", status: "pending", method: "Bank Transfer", reference: "TRF/2024/003" },
  { id: "4", userId: "usr_004", userName: "Grace Nwosu", amount: 25000, date: "2024-01-12", status: "rejected", method: "Cash Deposit", reference: "CASH/2024/004", approvedBy: "Admin", notes: "Invalid reference" },
];

export default function ManualDepositsPage() {
  const [deposits, setDeposits] = useState<ManualDeposit[]>(MOCK_DEPOSITS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDeposit, setSelectedDeposit] = useState<ManualDeposit | null>(null);
  const [newDeposit, setNewDeposit] = useState({ userId: "", userName: "", amount: "", method: "Bank Transfer", reference: "", notes: "" });

  const filteredDeposits = deposits.filter((d) => {
    const matchesSearch = d.userName.toLowerCase().includes(search.toLowerCase()) || d.reference.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (id: string) => {
    setDeposits((prev) => prev.map((d) => d.id === id ? { ...d, status: "approved", approvedBy: "Admin" } : d));
    toast.success("Deposit approved");
  };

  const handleReject = (id: string) => {
    setDeposits((prev) => prev.map((d) => d.id === id ? { ...d, status: "rejected", approvedBy: "Admin" } : d));
    toast.error("Deposit rejected");
  };

  const handleAddDeposit = () => {
    if (!newDeposit.userId || !newDeposit.userName || !newDeposit.amount || !newDeposit.reference) {
      toast.error("Please fill all required fields");
      return;
    }
    const deposit: ManualDeposit = {
      id: Date.now().toString(),
      userId: newDeposit.userId,
      userName: newDeposit.userName,
      amount: Number(newDeposit.amount),
      date: new Date().toISOString().split("T")[0],
      status: "pending",
      method: newDeposit.method,
      reference: newDeposit.reference,
      notes: newDeposit.notes,
    };
    setDeposits((prev) => [deposit, ...prev]);
    setShowAddModal(false);
    setNewDeposit({ userId: "", userName: "", amount: "", method: "Bank Transfer", reference: "", notes: "" });
    toast.success("Manual deposit added");
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amount);

  return (
    <MainLayout title="Manual Deposits" subtitle="Add and verify manual deposits">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Search deposits..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 w-64" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline"><Download className="h-4 w-4 mr-2" />Export</Button>
            <Button className="bg-cyan-600 hover:bg-cyan-700" onClick={() => setShowAddModal(true)}><Plus className="h-4 w-4 mr-2" />Add Deposit</Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Reference</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Member</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Method</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredDeposits.map((deposit) => (
                    <tr key={deposit.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-mono">{deposit.reference}</td>
                      <td className="px-4 py-3 text-sm">
                        <div>
                          <p className="font-medium">{deposit.userName}</p>
                          <p className="text-xs text-slate-500">{deposit.userId}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-green-600">{formatCurrency(deposit.amount)}</td>
                      <td className="px-4 py-3 text-sm">{deposit.method}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{deposit.date}</td>
                      <td className="px-4 py-3">
                        <Badge className={deposit.status === "approved" ? "bg-green-100 text-green-700" : deposit.status === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}>
                          {deposit.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedDeposit(deposit); setShowDetailModal(true); }}>👁️</Button>
                          {deposit.status === "pending" && (
                            <>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600" onClick={() => handleApprove(deposit.id)}><CheckCircle className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => handleReject(deposit.id)}><XCircle className="h-4 w-4" /></Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Add Manual Deposit</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div><Label>Member ID</Label><Input value={newDeposit.userId} onChange={(e) => setNewDeposit({ ...newDeposit, userId: e.target.value })} placeholder="usr_001" /></div>
            <div><Label>Member Name</Label><Input value={newDeposit.userName} onChange={(e) => setNewDeposit({ ...newDeposit, userName: e.target.value })} placeholder="John Doe" /></div>
            <div><Label>Amount (NGN)</Label><Input type="number" value={newDeposit.amount} onChange={(e) => setNewDeposit({ ...newDeposit, amount: e.target.value })} placeholder="50000" /></div>
            <div><Label>Method</Label>
              <select value={newDeposit.method} onChange={(e) => setNewDeposit({ ...newDeposit, method: e.target.value })} className="w-full border rounded-lg px-3 py-2">
                <option>Bank Transfer</option>
                <option>Cash Deposit</option>
                <option>Cheque</option>
              </select>
            </div>
            <div><Label>Reference</Label><Input value={newDeposit.reference} onChange={(e) => setNewDeposit({ ...newDeposit, reference: e.target.value })} placeholder="TRF/2024/001" /></div>
            <div><Label>Notes (Optional)</Label><textarea value={newDeposit.notes} onChange={(e) => setNewDeposit({ ...newDeposit, notes: e.target.value })} className="w-full border rounded-lg px-3 py-2 h-20" placeholder="Additional notes..." /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button className="bg-cyan-600 hover:bg-cyan-700" onClick={handleAddDeposit}><Plus className="h-4 w-4 mr-2" />Add Deposit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Deposit Details</DialogTitle></DialogHeader>
          {selectedDeposit && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-slate-500">Reference</p><p className="font-mono font-medium">{selectedDeposit.reference}</p></div>
                <div><p className="text-sm text-slate-500">Status</p><Badge className={selectedDeposit.status === "approved" ? "bg-green-100 text-green-700" : selectedDeposit.status === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}>{selectedDeposit.status}</Badge></div>
                <div><p className="text-sm text-slate-500">Member</p><p className="font-medium">{selectedDeposit.userName}</p></div>
                <div><p className="text-sm text-slate-500">Member ID</p><p className="font-mono text-sm">{selectedDeposit.userId}</p></div>
                <div><p className="text-sm text-slate-500">Amount</p><p className="font-medium text-green-600">{formatCurrency(selectedDeposit.amount)}</p></div>
                <div><p className="text-sm text-slate-500">Method</p><p className="font-medium">{selectedDeposit.method}</p></div>
                <div><p className="text-sm text-slate-500">Date</p><p className="font-medium">{selectedDeposit.date}</p></div>
                {selectedDeposit.approvedBy && <div><p className="text-sm text-slate-500">Processed By</p><p className="font-medium">{selectedDeposit.approvedBy}</p></div>}
              </div>
              {selectedDeposit.notes && <div className="pt-2 border-t"><p className="text-sm text-slate-500">Notes</p><p className="text-sm">{selectedDeposit.notes}</p></div>}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
