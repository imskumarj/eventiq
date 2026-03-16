"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Upload, FileUp, Key, CheckCircle, AlertCircle } from "lucide-react";

import { useState, useRef, useEffect } from "react";

import {
  uploadCsv,
  getImports,
} from "@/services/dataingestion";

export default function DataIngestion() {
  const [dragActive, setDragActive] = useState(false);
  const [imports, setImports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---------------- Fetch Imports ---------------- */

  const fetchImports = async () => {
    try {
      const res = await getImports();
      setImports(res.data);
    } catch (err) {
      console.error("Failed to load imports");
    }
  };

  useEffect(() => {
    fetchImports();
  }, []);

  /* ---------------- Upload CSV ---------------- */

  const handleFileSelect = async (file: File) => {
    setLoading(true);

    try {
      await uploadCsv(file);
      await fetchImports();
    } catch (err) {
      console.error("Upload failed");
    }

    setLoading(false);
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
          <h3 className="text-sm font-semibold mb-4">
            Upload CSV
          </h3>

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
              disabled={loading}
            >
              <FileUp className="w-4 h-4" />
              {loading ? "Uploading..." : "Browse Files"}
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

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
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

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
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
        className="card-elevated p-6"
      >
        <h3 className="text-sm font-semibold mb-4">
          Recent Imports
        </h3>

        <div className="space-y-3">

          {imports.map((item: any) => (
            <div
              key={item.id}
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
                    {item.filename}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {item.rows} rows •{" "}
                    {new Date(item.createdAt).toLocaleString()}
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