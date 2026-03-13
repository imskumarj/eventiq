"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* ---------------- MOCK DATA ---------------- */

const eventsData = [
  { id: 1, name: "Tech Summit 2025", date: "2025-03-15", location: "San Francisco, CA", attendees: 2450, revenue: 125000, engagement: 92 },
  { id: 2, name: "Data Conference", date: "2025-04-20", location: "New York, NY", attendees: 1800, revenue: 98000, engagement: 87 },
  { id: 3, name: "AI Expo Global", date: "2025-05-10", location: "London, UK", attendees: 3200, revenue: 210000, engagement: 95 },
  { id: 4, name: "DevOps World", date: "2025-06-05", location: "Austin, TX", attendees: 1500, revenue: 78000, engagement: 81 },
  { id: 5, name: "Cloud Innovation Forum", date: "2025-07-18", location: "Seattle, WA", attendees: 2100, revenue: 145000, engagement: 89 },
  { id: 6, name: "Cybersecurity Week", date: "2025-08-22", location: "Washington, DC", attendees: 1700, revenue: 92000, engagement: 84 },
  { id: 7, name: "Startup Showcase", date: "2025-09-12", location: "Berlin, DE", attendees: 900, revenue: 45000, engagement: 78 },
  { id: 8, name: "FinTech Connect", date: "2025-10-30", location: "Singapore", attendees: 2800, revenue: 180000, engagement: 91 },
];

/* ---------------- PAGE ---------------- */

export default function Events() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const perPage = 6;

  /* ---------------- Filtering ---------------- */

  const filtered = eventsData.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.location.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  const paginated = filtered.slice(
    (page - 1) * perPage,
    page * perPage
  );

  /* ---------------- Engagement Badge ---------------- */

  const getEngagementColor = (score: number) => {
    if (score >= 90) return "bg-success/10 text-success";
    if (score >= 80) return "bg-info/10 text-info";
    return "bg-warning/10 text-warning";
  };

  return (
    <div className="space-y-6 max-w-[1400px]">

      {/* Header */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold">Events</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage and track all events
          </p>
        </div>

        {/* Add Event */}

        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2 gradient-accent text-accent-foreground hover:opacity-90">
              <Plus className="w-4 h-4" />
              Add Event
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-lg">

            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-2">

              <div className="space-y-2">
                <Label>Event Name</Label>
                <Input placeholder="Tech Summit 2025" />
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" />
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input placeholder="San Francisco, CA" />
                </div>

              </div>

              <div className="grid grid-cols-2 gap-4">

                <div className="space-y-2">
                  <Label>Expected Attendees</Label>
                  <Input type="number" placeholder="1000" />
                </div>

                <div className="space-y-2">
                  <Label>Budget</Label>
                  <Input type="number" placeholder="50000" />
                </div>

              </div>

              <Button className="w-full gradient-accent text-accent-foreground hover:opacity-90">
                Create Event
              </Button>

            </div>
          </DialogContent>
        </Dialog>

      </motion.div>

      {/* Search */}

      <div className="flex gap-3">

        <div className="relative flex-1 max-w-sm">

          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

          <Input
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />

        </div>

      </div>

      {/* Table */}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-elevated overflow-hidden"
      >

        <div className="overflow-x-auto">

          <Table>

            <TableHeader>
              <TableRow className="bg-muted/30">

                <TableHead>Event Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Attendees</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-center">Engagement</TableHead>
                <TableHead className="text-center">Actions</TableHead>

              </TableRow>
            </TableHeader>

            <TableBody>

              {paginated.map((event) => (

                <TableRow key={event.id} className="hover:bg-muted/20">

                  <TableCell className="font-medium">
                    {event.name}
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {new Date(event.date).toLocaleDateString()}
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {event.location}
                  </TableCell>

                  <TableCell className="text-right">
                    {event.attendees.toLocaleString()}
                  </TableCell>

                  <TableCell className="text-right font-medium">
                    ${event.revenue.toLocaleString()}
                  </TableCell>

                  <TableCell className="text-center">

                    <Badge
                      variant="secondary"
                      className={getEngagementColor(event.engagement)}
                    >
                      {event.engagement}%
                    </Badge>

                  </TableCell>

                  <TableCell>

                    <div className="flex items-center justify-center gap-1">

                      <button className="p-1.5 rounded-md hover:bg-muted">
                        <Eye className="w-4 h-4" />
                      </button>

                      <button className="p-1.5 rounded-md hover:bg-muted">
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button className="p-1.5 rounded-md hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>

                  </TableCell>

                </TableRow>

              ))}

            </TableBody>

          </Table>

        </div>

        {/* Pagination */}

        <div className="flex items-center justify-between px-6 py-4 border-t border-border">

          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * perPage + 1} -{" "}
            {Math.min(page * perPage, filtered.length)} of {filtered.length}
          </p>

          <div className="flex items-center gap-2">

            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <span className="text-sm font-medium px-2">
              {page} / {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

          </div>

        </div>

      </motion.div>

    </div>
  );
}