"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Upload,
  FileUp,
  Key,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";

import { useState, useRef, useEffect } from "react";

import {
  uploadCsv,
  getImports,
} from "@/services/ingestion";

/* ---------------- HELPERS ---------------- */

function parseCSVPreview(file: File): Promise<string[][]> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;

      const rows = text
        .split("\n")
        .slice(0, 6)
        .map((row) => row.split(","));

      resolve(rows);
    };

    reader.readAsText(file);
  });
}

/* ---------------- PAGE ---------------- */

export default function DataIngestion() {
  const [dragActive, setDragActive] = useState(false);
  const [imports, setImports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [preview, setPreview] = useState<string[][] | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---------------- Fetch Imports ---------------- */

  const fetchImports = async () => {
    try {
      const res = await getImports();
      setImports(res.data.data || res.data);
    } catch {
      console.error("Failed to load imports");
    }
  };

  useEffect(() => {
    fetchImports();
  }, []);

  /* ---------------- VALIDATION ---------------- */

  const validateFile = (file: File) => {
    if (!file.name.endsWith(".csv")) {
      setError("Only CSV files are allowed");
      return false;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File must be less than 10MB");
      return false;
    }

    setError("");
    return true;
  };

  /* ---------------- FILE SELECT ---------------- */

  const handleFileSelect = async (file: File) => {
    if (!validateFile(file)) return;

    setSelectedFile(file);

    const previewData = await parseCSVPreview(file);
    setPreview(previewData);
  };

  /* ---------------- UPLOAD ---------------- */

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);

    try {
      await uploadCsv(selectedFile);
      await fetchImports();

      setSelectedFile(null);
      setPreview(null);
    } catch {
      setError("Upload failed");
    }

    setLoading(false);
  };

  /* ---------------- DRAG ---------------- */

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
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
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

            <Button variant="outline" size="sm" disabled={loading} className="py-2">
              <FileUp className="w-4 h-4" color="blue"/>
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

          {/* ERROR */}
          {error && (
            <p className="text-sm text-destructive mt-3">{error}</p>
          )}

          {/* PREVIEW */}
          <div className="mt-6 max-h-[300px] overflow-auto">
            {preview && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-semibold">Preview</h4>

                  <button
                    onClick={() => {
                      setPreview(null);
                      setSelectedFile(null);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="overflow-auto border rounded-lg text-xs">
                  <table className="w-full">
                    <tbody>
                      {preview.map((row, i) => (
                        <tr key={i} className="border-b">
                          {row.map((cell, j) => (
                            <td key={j} className="p-2">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Button
                  className="mt-4 w-full bg-accent text-accent-foreground hover:opacity-90"
                  onClick={handleUpload}
                  disabled={loading}
                >
                  {loading ? "Uploading..." : "Confirm Upload"}
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Options */}
        <div className="space-y-6">
          <motion.div className="card-elevated p-6">
            <h3 className="text-sm font-semibold mb-3">
              Manual Entry
            </h3>

            <p className="text-xs text-muted-foreground mb-3">
              Enter data manually
            </p>

            <Button variant="outline" size="sm" className="w-full py-2">
              Open Form
            </Button>
          </motion.div>

          <motion.div className="card-elevated p-6">
            <div className="flex items-center gap-2 mb-3">
              <Key className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-semibold">
                API Integration
              </h3>
            </div>

            <p className="text-xs text-muted-foreground mb-3">
              Connect external data sources
            </p>

            <Button variant="outline" size="sm" className="w-full py-2">
              Configure API
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Recent Imports */}
      <motion.div className="card-elevated p-6">
        <h3 className="text-sm font-semibold mb-4">
          Recent Imports
        </h3>

        {imports.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No imports yet
          </p>
        ) : (
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
        )}
      </motion.div>

    </div>
  );
}