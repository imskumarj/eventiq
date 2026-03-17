"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Plus, Search } from "lucide-react";

import {
  getSponsors,
  createSponsor
} from "@/services/sponsors";

export default function Sponsors() {

  const [sponsors, setSponsors] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    eventId: "",
    amount: 0,
  });

  /* ---------------- Fetch ---------------- */

  async function fetchSponsors() {
    const res = await getSponsors(search);
    setSponsors(res.data);
  }

  useEffect(() => {
    fetchSponsors();
  }, [search]);

  /* ---------------- Create ---------------- */

  async function handleCreate() {
    await createSponsor(form);
    fetchSponsors();
  }

  const getStatusStyle = (status: string) => {
    if (status === "Active") return "bg-success/10 text-success";
    if (status === "Pending") return "bg-warning/10 text-warning";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-6 max-w-[1400px]">

      {/* Header */}

      <motion.div className="flex justify-between">

        <div>
          <h1 className="text-2xl font-bold">Sponsors</h1>
          <p className="text-muted-foreground text-sm">
            Track sponsor performance and ROI
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Sponsor
            </Button>
          </DialogTrigger>

          <DialogContent>

            <DialogHeader>
              <DialogTitle>Add Sponsor</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">

              <Input
                placeholder="Sponsor name"
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <Input
                placeholder="Event ID"
                onChange={(e) =>
                  setForm({ ...form, eventId: e.target.value })
                }
              />

              <Input
                type="number"
                placeholder="Investment"
                onChange={(e) =>
                  setForm({
                    ...form,
                    amount: Number(e.target.value),
                  })
                }
              />

              <Button onClick={handleCreate}>
                Create
              </Button>

            </div>

          </DialogContent>
        </Dialog>

      </motion.div>

      {/* Search */}

      <Input
        placeholder="Search sponsors..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}

      <Table>

        <TableHeader>
          <TableRow>
            <TableHead>Sponsor</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Leads</TableHead>
            <TableHead>ROI</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>

          {sponsors.map((s) => (

            <TableRow key={s.id}>

              <TableCell>{s.name}</TableCell>
              <TableCell>{s.event}</TableCell>
              <TableCell>${s.amount}</TableCell>
              <TableCell>{s.leads}</TableCell>
              <TableCell>{s.roi}%</TableCell>

              <TableCell>
                <Badge className={getStatusStyle(s.status)}>
                  {s.status}
                </Badge>
              </TableCell>

            </TableRow>

          ))}

        </TableBody>

      </Table>

    </div>
  );
}