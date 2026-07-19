"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Download, Printer, Plus, Trash2, Save, FileSpreadsheet } from "lucide-react";

interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  account: string;
  debit: number;
  credit: number;
}

const INITIAL_ENTRIES: LedgerEntry[] = [
  { id: "1", date: "2024-01-15", description: "Member deposit - John Adebayo", account: "Cash", debit: 50000, credit: 0 },
  { id: "2", date: "2024-01-15", description: "Member deposit - John Adebayo", account: "Member Savings", debit: 0, credit: 50000 },
  { id: "3", date: "2024-01-14", description: "Loan disbursement - Sarah", account: "Loan Receivable", debit: 200000, credit: 0 },
  { id: "4", date: "2024-01-14", description: "Loan disbursement - Sarah", account: "Cash", debit: 0, credit: 200000 },
  { id: "5", date: "2024-01-13", description: "Interest earned", account: "Interest Income", debit: 0, credit: 15000 },
  { id: "6", date: "2024-01-13", description: "Interest earned", account: "Interest Receivable", debit: 15000, credit: 0 },
];

const ACCOUNTS = ["Cash", "Bank", "Member Savings", "Loan Receivable", "Interest Income", "Interest Receivable", "Administrative Expenses", "Revenue"];

export default function AccountingSpreadsheetPage() {
  const [entries, setEntries] = useState<LedgerEntry[]>(INITIAL_ENTRIES);
  const [newEntry, setNewEntry] = useState({ date: "", description: "", account: "", debit: "", credit: "" });

  const addEntry = () => {
    if (!newEntry.date || !newEntry.description || !newEntry.account) return;
    setEntries([...entries, { id: Date.now().toString(), ...newEntry, debit: Number(newEntry.debit) || 0, credit: Number(newEntry.credit) || 0 }]);
    setNewEntry({ date: "", description: "", account: "", debit: "", credit: "" });
  };

  const deleteEntry = (id: string) => setEntries(entries.filter((e) => e.id !== id));

  const totalDebits = entries.reduce((sum, e) => sum + e.debit, 0);
  const totalCredits = entries.reduce((sum, e) => sum + e.credit, 0);

  const formatCurrency = (value: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(value);

  return (
    <MainLayout title="Accounting Spreadsheet" subtitle="General ledger and double-entry accounting">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Trial Balance</Badge>
            <span className="text-sm text-slate-500">As of {new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline"><Printer className="h-4 w-4 mr-2" />Print</Button>
            <Button variant="outline"><Download className="h-4 w-4 mr-2" />Export</Button>
            <Button className="bg-cyan-600 hover:bg-cyan-700"><Save className="h-4 w-4 mr-2" />Save</Button>
          </div>
        </div>

        <Tabs defaultValue="ledger" className="space-y-4">
          <TabsList>
            <TabsTrigger value="ledger">Ledger</TabsTrigger>
            <TabsTrigger value="trial-balance">Trial Balance</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="ledger">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-cyan-600" />
                  General Journal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-5 gap-2 p-4 bg-slate-50 rounded-lg">
                  <Input type="date" value={newEntry.date} onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })} className="col-span-1" />
                  <Input placeholder="Description" value={newEntry.description} onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })} className="col-span-1" />
                  <select value={newEntry.account} onChange={(e) => setNewEntry({ ...newEntry, account: e.target.value })} className="col-span-1 border rounded px-2 py-2 text-sm">
                    <option value="">Select Account</option>
                    {ACCOUNTS.map((acc) => <option key={acc} value={acc}>{acc}</option>)}
                  </select>
                  <Input type="number" placeholder="Debit" value={newEntry.debit} onChange={(e) => setNewEntry({ ...newEntry, debit: e.target.value })} className="col-span-1" />
                  <Input type="number" placeholder="Credit" value={newEntry.credit} onChange={(e) => setNewEntry({ ...newEntry, credit: e.target.value })} className="col-span-1" />
                </div>
                <Button onClick={addEntry} className="bg-cyan-600 hover:bg-cyan-700"><Plus className="h-4 w-4 mr-2" />Add Entry</Button>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-100 border-b">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase">Description</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase">Account</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-slate-500 uppercase">Debit</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-slate-500 uppercase">Credit</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-slate-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {entries.map((entry) => (
                        <tr key={entry.id} className="hover:bg-slate-50">
                          <td className="px-3 py-2 text-sm">{entry.date}</td>
                          <td className="px-3 py-2 text-sm">{entry.description}</td>
                          <td className="px-3 py-2 text-sm"><Badge variant="outline">{entry.account}</Badge></td>
                          <td className="px-3 py-2 text-sm text-right font-mono">{entry.debit > 0 ? formatCurrency(entry.debit) : ""}</td>
                          <td className="px-3 py-2 text-sm text-right font-mono">{entry.credit > 0 ? formatCurrency(entry.credit) : ""}</td>
                          <td className="px-3 py-2 text-center"><Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => deleteEntry(entry.id)}><Trash2 className="h-3 w-3 text-red-500" /></Button></td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50 font-bold">
                        <td colSpan={3} className="px-3 py-2 text-right">Totals</td>
                        <td className="px-3 py-2 text-right font-mono">{formatCurrency(totalDebits)}</td>
                        <td className="px-3 py-2 text-right font-mono">{formatCurrency(totalCredits)}</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trial-balance">
            <Card>
              <CardHeader><CardTitle>Trial Balance</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-green-600">Debit Balances</h3>
                    {ACCOUNTS.slice(0, 4).map((acc) => (
                      <div key={acc} className="flex justify-between p-2 bg-slate-50 rounded">
                        <span>{acc}</span>
                        <span className="font-mono">{formatCurrency(Math.random() * 1000000)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-cyan-600">Credit Balances</h3>
                    {ACCOUNTS.slice(4).map((acc) => (
                      <div key={acc} className="flex justify-between p-2 bg-slate-50 rounded">
                        <span>{acc}</span>
                        <span className="font-mono">{formatCurrency(Math.random() * 1000000)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader><CardTitle>Financial Reports</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex-col gap-2"><FileSpreadsheet className="h-6 w-6" />Income Statement</Button>
                  <Button variant="outline" className="h-20 flex-col gap-2"><FileSpreadsheet className="h-6 w-6" />Balance Sheet</Button>
                  <Button variant="outline" className="h-20 flex-col gap-2"><FileSpreadsheet className="h-6 w-6" />Cash Flow</Button>
                  <Button variant="outline" className="h-20 flex-col gap-2"><FileSpreadsheet className="h-6 w-6" />Equity Statement</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
