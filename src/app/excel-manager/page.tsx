"use client";

import { useState, useRef } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { toast } from "sonner";
import { Upload, Download, FileSpreadsheet, Trash2, Eye, CheckCircle, Clock, XCircle } from "lucide-react";

interface ExcelUpload {
  id: string;
  fileName: string;
  type: "deposits" | "loans" | "members" | "contributions";
  uploadedAt: string;
  status: "processing" | "completed" | "failed";
  records: number;
  processed: number;
  errors: number;
}

const MOCK_UPLOADS: ExcelUpload[] = [
  { id: "1", fileName: "january_deposits.xlsx", type: "deposits", uploadedAt: "2024-01-15 10:30", status: "completed", records: 150, processed: 148, errors: 2 },
  { id: "2", fileName: "loan_repayments.xlsx", type: "loans", uploadedAt: "2024-01-14 14:20", status: "completed", records: 75, processed: 75, errors: 0 },
  { id: "3", fileName: "new_members.xlsx", type: "members", uploadedAt: "2024-01-13 09:15", status: "failed", records: 50, processed: 30, errors: 20 },
  { id: "4", fileName: "january_contributions.xlsx", type: "contributions", uploadedAt: "2024-01-12 16:45", status: "processing", records: 200, processed: 120, errors: 0 },
];

export default function ExcelManagerPage() {
  const [uploads, setUploads] = useState<ExcelUpload[]>(MOCK_UPLOADS);
  const [uploadType, setUploadType] = useState<string>("deposits");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      toast.error("Please upload an Excel file (.xlsx or .xls)");
      return;
    }

    setIsUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      const newUpload: ExcelUpload = {
        id: Date.now().toString(),
        fileName: file.name,
        type: uploadType as ExcelUpload["type"],
        uploadedAt: new Date().toLocaleString(),
        status: "processing",
        records: Math.floor(Math.random() * 200) + 50,
        processed: 0,
        errors: 0,
      };
      setUploads((prev) => [newUpload, ...prev]);
      
      // Simulate processing
      let processed = 0;
      const interval = setInterval(() => {
        processed += Math.floor(Math.random() * 20) + 10;
        if (processed >= newUpload.records) {
          processed = newUpload.records;
          clearInterval(interval);
          setUploads((prev) => prev.map((u) => u.id === newUpload.id ? { ...u, status: "completed", processed: u.records, errors: Math.floor(Math.random() * 5) } : u));
          toast.success(`${file.name} processed successfully`);
        } else {
          setUploads((prev) => prev.map((u) => u.id === newUpload.id ? { ...u, processed } : u));
        }
      }, 500);

      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }, 1500);
  };

  const downloadTemplate = (type: string) => {
    toast.success(`Downloading ${type} template...`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "failed": return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  return (
    <MainLayout title="Excel Manager" subtitle="Upload and manage bulk data via Excel">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Upload className="h-5 w-5 text-cyan-600" />Upload Excel</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Upload Type</Label>
                <select value={uploadType} onChange={(e) => setUploadType(e.target.value)} className="w-full border rounded-lg px-3 py-2 mt-1">
                  <option value="deposits">Deposits</option>
                  <option value="loans">Loans</option>
                  <option value="members">Members</option>
                  <option value="contributions">Contributions</option>
                </select>
              </div>
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center">
                <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleUpload} className="hidden" id="excel-upload" />
                <label htmlFor="excel-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <FileSpreadsheet className="h-12 w-12 text-slate-400" />
                    <p className="text-sm text-slate-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-slate-400">.xlsx, .xls files only</p>
                  </div>
                </label>
              </div>
              {isUploading && <div className="text-center text-sm text-cyan-600">Uploading...</div>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Download className="h-5 w-5 text-cyan-600" />Download Templates</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-slate-500">Download Excel templates for bulk uploads</p>
              {["deposits", "loans", "members", "contributions"].map((type) => (
                <Button key={type} variant="outline" className="w-full justify-between" onClick={() => downloadTemplate(type)}>
                  <span className="capitalize">{type} Template</span>
                  <Download className="h-4 w-4" />
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Recent Uploads</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">File Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Uploaded</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Progress</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {uploads.map((upload) => (
                    <tr key={upload.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FileSpreadsheet className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-sm">{upload.fileName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><Badge variant="outline" className="capitalize">{upload.type}</Badge></td>
                      <td className="px-4 py-3 text-sm text-slate-500">{upload.uploadedAt}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-600 rounded-full" style={{ width: `${(upload.processed / upload.records) * 100}%` }} />
                          </div>
                          <span className="text-xs text-slate-500">{upload.processed}/{upload.records}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(upload.status)}
                          <span className="text-sm capitalize">{upload.status}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600"><Trash2 className="h-4 w-4" /></Button>
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
    </MainLayout>
  );
}
