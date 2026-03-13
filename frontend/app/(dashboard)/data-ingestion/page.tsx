"use client";

import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import { Upload, FileUp, Key, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useRef } from "react";

export default function DataIngestion() {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    console.log("Selected file:", file);
    // Later: send to API
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6 max-w-[1400px]">

      {/* Header */}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold">Data Ingestion</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Import and manage your event data
        </p>
      </motion.div>

      {/* Upload Section */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* CSV Upload */}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated p-6 lg:col-span-2"
        >
          <h3 className="text-sm font-semibold mb-4">Upload CSV</h3>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={handleBrowse}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
              dragActive
                ? "border-accent bg-accent/5"
                : "border-border hover:border-accent/50"
            }`}
          >
            <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-4" />

            <p className="text-sm font-medium mb-1">
              Drop your CSV file here
            </p>

            <p className="text-xs text-muted-foreground mb-4">
              or click to browse files
            </p>

            <Button
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <FileUp className="w-4 h-4" />
              Browse Files
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
            />
          </div>
        </motion.div>

        {/* Options */}

        <div className="space-y-4">

          {/* Manual Entry */}

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="card-elevated p-6"
          >
            <h3 className="text-sm font-semibold mb-3">
              Manual Entry
            </h3>

            <p className="text-xs text-muted-foreground mb-3">
              Enter data points manually through forms
            </p>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
            >
              Open Form
            </Button>
          </motion.div>

          {/* API Integration */}

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-elevated p-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <Key className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-semibold">
                API Integration
              </h3>
            </div>

            <p className="text-xs text-muted-foreground mb-3">
              Connect external data sources via API
            </p>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
            >
              Configure API
            </Button>
          </motion.div>

        </div>
      </div>

      {/* Recent Imports */}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="card-elevated p-6"
      >
        <h3 className="text-sm font-semibold mb-4">
          Recent Imports
        </h3>

        <div className="space-y-3">

          {[
            {
              name: "events_q4_2024.csv",
              rows: 245,
              status: "success",
              time: "2 hours ago",
            },
            {
              name: "sponsors_jan.csv",
              rows: 38,
              status: "success",
              time: "1 day ago",
            },
            {
              name: "attendees_export.csv",
              rows: 1200,
              status: "error",
              time: "3 days ago",
            },
          ].map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
            >
              <div className="flex items-center gap-3">

                {item.status === "success" ? (
                  <CheckCircle className="w-4 h-4 text-success" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-destructive" />
                )}

                <div>
                  <p className="text-sm font-medium">
                    {item.name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {item.rows} rows • {item.time}
                  </p>
                </div>

              </div>
            </div>
          ))}

        </div>
      </motion.div>

    </div>
  );
}