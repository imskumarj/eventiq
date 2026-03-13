"use client";

import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import { FileText, Download, Eye, FileSpreadsheet, File } from "lucide-react";
import { Badge } from "../../components/ui/badge";

const reportTypes = [
  {
    title: "ROI Report",
    desc: "Comprehensive sponsor return on investment analysis",
    icon: FileText,
    color: "bg-accent/10 text-accent",
  },
  {
    title: "Sponsor Performance",
    desc: "Detailed sponsor engagement and lead metrics",
    icon: FileSpreadsheet,
    color: "bg-info/10 text-info",
  },
  {
    title: "Event Summary",
    desc: "Complete event overview with attendee analytics",
    icon: File,
    color: "bg-success/10 text-success",
  },
  {
    title: "Custom Report",
    desc: "Build a custom report with selected metrics",
    icon: FileText,
    color: "bg-warning/10 text-warning",
  },
];

const recentReports = [
  {
    name: "Q4 2024 ROI Report",
    type: "ROI Report",
    date: "2025-01-15",
    format: "PDF",
  },
  {
    name: "Tech Summit Sponsor Analysis",
    type: "Sponsor Performance",
    date: "2025-01-10",
    format: "Excel",
  },
  {
    name: "Annual Event Summary 2024",
    type: "Event Summary",
    date: "2025-01-05",
    format: "PDF",
  },
];

export default function Reports() {
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

              <Button variant="outline" size="sm" className="w-full">
                Generate
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
              className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:border-accent hover:text-accent transition-colors"
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
          {recentReports.map((r) => (
            <div
              key={r.name}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div>
                <p className="text-sm font-medium">{r.name}</p>

                <p className="text-xs text-muted-foreground">
                  {r.type} • {new Date(r.date).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {r.format}
                </Badge>

                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>

                <Button variant="ghost" size="sm">
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