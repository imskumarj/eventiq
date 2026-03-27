"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  FileText,
  Download,
  Eye,
  FileSpreadsheet,
  File,
} from "lucide-react";

import {
  generateReport,
  getReports,
  downloadReport,
} from "@/services/reports";

/* ---------------- TYPES ---------------- */

const reportTypes = [
  {
    title: "ROI Report",
    type: "roi",
    desc: "Comprehensive sponsor return on investment analysis",
    icon: FileText,
    color: "bg-accent/10 text-accent",
  },
];

export default function Reports() {

  const [reports, setReports] = useState<any[]>([]);
  const [format, setFormat] = useState("PDF");
  const [loading, setLoading] = useState(false);
  const API_DOC = process.env.NEXT_PUBLIC_DOCS_URL || "http://localhost:5000";

  /* ---------------- Fetch Reports ---------------- */

  async function fetchReports() {
    try {
      const res = await getReports();
      setReports(res.data.data || res.data);
    } catch {
      console.error("Failed to fetch reports");
    }
  }

  useEffect(() => {
    fetchReports();
  }, []);

  /* ---------------- Generate Report ---------------- */

  async function handleGenerate(type: string) {
    setLoading(true);

    try {
      await generateReport(type, format);
      await fetchReports();
    } catch {
      console.error("Report generation failed");
    }

    setLoading(false);
  }

  /* ---------------- Download ---------------- */

  async function handleDownload(id: string) {
    try {
      const res = await downloadReport(id);
      window.open(res.data.url, "_blank"); // ✅ now works
    } catch {
      console.error("Download failed");
    }
  }

  return (
    <div className="space-y-6 max-w-[1400px]">

      {/* Header */}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Generate and download analytics reports
        </p>
      </motion.div>

      {/* Report Types */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {reportTypes.map((report, i) => {
          const Icon = report.icon;

          return (
            <motion.div
              key={report.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-interactive p-6 flex flex-col"
            >

              <div
                className={`w-11 h-11 rounded-xl ${report.color} flex items-center justify-center mb-4`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <h3 className="font-semibold text-sm mb-1">
                {report.title}
              </h3>

              <p className="text-xs text-muted-foreground flex-1 mb-4">
                {report.desc}
              </p>

              <Button
                variant="outline"
                size="sm"
                className="w-full py-2"
                onClick={() => handleGenerate(report.type)}
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate"}
              </Button>

            </motion.div>
          );
        })}

      </div>

      {/* Export Format */}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-elevated p-6"
      >
        <h3 className="text-sm font-semibold mb-4">
          Export Format
        </h3>

        <div className="flex gap-3">

          {["CSV", "Excel", "PDF"].map((fmt) => (

            <button
              key={fmt}
              onClick={() => setFormat(fmt)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                format === fmt
                  ? "border-accent text-accent"
                  : "border-border hover:border-accent hover:text-accent"
              }`}
            >
              {fmt}
            </button>

          ))}

        </div>

      </motion.div>

      {/* Recent Reports */}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-elevated p-6"
      >

        <h3 className="text-sm font-semibold mb-4">
          Recent Reports
        </h3>

        <div className="space-y-3">

          {reports.map((r) => (

            <div
              key={r.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50"
            >

              <div>

                <p className="text-sm font-medium">
                  {r.name}
                </p>

                <p className="text-xs text-muted-foreground">
                  {r.type} •{" "}
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>

              </div>

              <div className="flex items-center gap-2">

                <Badge variant="secondary" className="text-xs">
                  {r.format}
                </Badge>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(`${API_DOC}/${r.fileUrl}`, "_blank")}
                >
                  <Eye className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(r.id)}
                >
                  <Download className="w-4 h-4" />
                </Button>

              </div>

            </div>

          ))}

        </div>

      </motion.div>

    </div>
  );
}