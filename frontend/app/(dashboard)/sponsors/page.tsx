"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import {
  getSponsors,
  createSponsor,
  updateLeads,
} from "@/services/sponsors";

export default function Sponsors() {

  const [sponsors, setSponsors] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const formRef = useRef<HTMLDivElement | null>(null);

  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [selectedSponsorId, setSelectedSponsorId] = useState<string | null>(null);

  const [leadForm, setLeadForm] = useState({
    leads: 0,
    boothVisits: 0,
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    eventId: "",
    amount: 0,
  });

  function openLeadModal(id: string) {
    setSelectedSponsorId(id);
    setLeadForm({
      leads: 0,
      boothVisits: 0,
    });
    setLeadModalOpen(true);
  }

  async function handleLeadUpdate() {
    if (!selectedSponsorId) return;

    try {
      await updateLeads(selectedSponsorId, leadForm);

      setLeadModalOpen(false);
      fetchSponsors(); // refresh table
    } catch {
      alert("Failed to update leads");
    }
  }

  /* ---------------- Fetch ---------------- */

  async function fetchSponsors() {
    try {
      const res = await getSponsors(search);
      setSponsors(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch {
      setSponsors([]);
    }
  }

  useEffect(() => {
    fetchSponsors();
  }, [search]);

  /* ---------------- Create ---------------- */

  async function handleCreate() {
    setError("");

    if (!form.email || !form.name) {
      setError("All fields are required");
      return;
    }

    try {
      await createSponsor(form);

      // ✅ success
      setForm({
        name: "",
        email: "",
        eventId: "",
        amount: 0,
      });

      setShowForm(false);
      fetchSponsors();

    } catch (err: any) {
      // 🔥 THIS IS KEY
      setError(err.message || "User not registered as sponsor");
    }
  }

  /* ---------------- UI ---------------- */

  const getStatusStyle = (roi: number) => {
    if (roi > 100) return "bg-green-600";
    return "bg-red-600";
  };

  useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showForm]);

  return (
    <div className="relative space-y-6 max-w-[1400px]">

      {/* HEADER */}
      <motion.div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sponsors</h1>
          <p className="text-muted-foreground text-sm">
            Track sponsor performance and ROI
          </p>
        </div>

        <Button
          onClick={() => setShowForm((prev) => !prev)}
          className="gap-2 gradient-accent text-accent-foreground"
        >
          <Plus className="w-4 h-4" />
          Add Sponsor
        </Button>
      </motion.div>

      {/* SEARCH */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />

        <Input
          className="pl-9"
          placeholder="Search sponsors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="card-elevated overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="py-4 text-center">Sponsor</TableHead>
              <TableHead className="py-4 text-center">Event</TableHead>
              <TableHead className="py-4 text-center">Investment</TableHead>
              <TableHead className="py-4 text-center">Leads</TableHead>
              <TableHead className="py-4 text-center">ROI</TableHead>
              <TableHead className="py-4 text-center">Status</TableHead>
              <TableHead className="py-4 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sponsors.map((s) => (
              <TableRow key={s.id} className="text-center">
                <TableCell className="py-4">{s.name}</TableCell>
                <TableCell className="py-4">{s.event}</TableCell>
                <TableCell className="py-4">₹{s.amount}</TableCell>
                <TableCell className="py-4">{s.leads}</TableCell>
                <TableCell className="py-4">{s.roi}%</TableCell>

                <TableCell className="py-4">
                  <Badge 
                    className={`${getStatusStyle(s.roi)} px-3 py-1`}
                    style={{ color: "white" }}
                  >
                    {s.roi > 100 ? "Active" : "Low"}
                  </Badge>
                </TableCell>

                <TableCell className="py-4 flex items-center justify-center gap-4">
                  <Button 
                    style={{ color: "blue" }}
                    onClick={() => openLeadModal(s.id)}
                  >
                    Update Leads
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* CREATE FORM */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="card-elevated p-6"
          >
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold text-lg">Add Sponsor</h2>

              <button onClick={() => setShowForm(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">

              {/* ❌ ERROR MESSAGE */}
              {error && (
                <p className="text-sm text-destructive font-medium">
                  {error}
                </p>
              )}

              <div>
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Email (must be registered as sponsor)</Label>
                <Input
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Event ID</Label>
                <Input
                  value={form.eventId}
                  onChange={(e) =>
                    setForm({ ...form, eventId: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Investment</Label>
                <Input
                  type="number"
                  value={form.amount}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      amount: Number(e.target.value),
                    })
                  }
                />
              </div>

              <Button
                onClick={handleCreate}
                className="gradient-accent text-accent-foreground"
              >
                Create Sponsor
              </Button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {leadModalOpen && (
          <motion.div
            className="card-elevated p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Update Leads</h2>

                <button onClick={() => setLeadModalOpen(false)}>
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* FORM */}
              <div className="space-y-4">

                <div>
                  <Label>Booth Visits</Label>
                  <Input
                    type="number"
                    value={leadForm.boothVisits}
                    onChange={(e) =>
                      setLeadForm({
                        ...leadForm,
                        boothVisits: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Leads Generated</Label>
                  <Input
                    type="number"
                    value={leadForm.leads}
                    onChange={(e) =>
                      setLeadForm({
                        ...leadForm,
                        leads: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <Button
                  onClick={handleLeadUpdate}
                  className="w-full gradient-accent text-accent-foreground"
                >
                  Save
                </Button>

              </div>
            </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}