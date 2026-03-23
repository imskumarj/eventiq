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
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "@/services/events";

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  attendees: number;
  revenue: number;
  engagement: number;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const formRef = useRef<HTMLDivElement | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    date: "",
    location: "",
    attendees: 0,
    revenue: 0,
  });

  const perPage = 6;

  /* ---------------- Fetch Events ---------------- */

  async function fetchEvents() {
    try {
      const res = await getEvents();
      setEvents(Array.isArray(res?.data?.events) ? res.data.events : []);
    } catch (err) {
      console.error("Failed to fetch events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  /* ---------------- Create Event ---------------- */
  async function handleSubmit() {
    try {
      if (editingEventId) {
        // ✏️ UPDATE
        await updateEvent(editingEventId, form);
      } else {
        await createEvent(form);
        setForm({
          name: "",
          date: "",
          location: "",
          attendees: 0,
          revenue: 0,
        });

        setShowCreateForm(false);
        fetchEvents();
      }

      // reset
      setForm({
        name: "",
        date: "",
        location: "",
        attendees: 0,
        revenue: 0,
      });

      setEditingEventId(null);
      setShowCreateForm(false);
      fetchEvents();

    } catch (err) {
      console.error("Failed to submit event");
    }
  }

  /* ---------------- Delete Event ---------------- */

  async function handleDelete(id: string) {
    try {
      await deleteEvent(id);
      fetchEvents();
    } catch {
      console.error("Delete failed");
    }
  }

  /* ---------------- Filtering ---------------- */

  const filtered = events.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const getEngagementColor = (score: number) => {
    if (score >= 90) return "bg-success/10 text-success";
    if (score >= 80) return "bg-info/10 text-info";
    return "bg-warning/10 text-warning";
  };

  useEffect(() => {
    if (showCreateForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showCreateForm]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        Loading events...
      </div>
    );
  }

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

        <Button
          onClick={() => setShowCreateForm((prev) => !prev)}
          className="gap-2 gradient-accent text-accent-foreground"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </Button>
      </motion.div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />

        <Input
          className="pl-9"
          placeholder="Search events..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card-elevated overflow-hidden"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="py-4 bg-muted">Event</TableHead>
              <TableHead className="py-4 bg-muted">Date</TableHead>
              <TableHead className="py-4 bg-muted">Location</TableHead>
              <TableHead className="text-right py-4 bg-muted">Attendees</TableHead>
              <TableHead className="text-right py-4 bg-muted">Revenue</TableHead>
              <TableHead className="text-center py-4 bg-muted">Engagement</TableHead>
              <TableHead className="text-center py-4 bg-muted">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginated.map((event) => (
              <TableRow key={event.id} className="text-center">

                <TableCell className="font-medium text-center">
                  {event.name}
                </TableCell>

                <TableCell className="text-center">
                  {new Date(event.date).toLocaleDateString()}
                </TableCell>

                <TableCell className="text-center">
                  {event.location}
                </TableCell>

                <TableCell className="text-center">
                  {event.attendees.toLocaleString()}
                </TableCell>

                <TableCell className="text-center">
                  ₹{event.revenue.toLocaleString()}
                </TableCell>

                <TableCell className="text-center">
                  <Badge
                    variant="secondary"
                    className={getEngagementColor(event.engagement)}
                  >
                    {event.engagement}%
                  </Badge>
                </TableCell>

                <TableCell className="text-center">
                  <div className="flex justify-center gap-1">
                    <button
                      onClick={() => {
                        setEditingEventId(event.id);
                        setForm({
                          name: event.name,
                          date: event.date.split("T")[0], // important for input[type=date]
                          location: event.location,
                          attendees: event.attendees,
                          revenue: event.revenue,
                        });
                        setShowCreateForm(true);
                      }}
                      className="p-1.5 rounded-md hover:bg-muted"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(event.id)}
                      className="p-1.5 rounded-md hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * perPage + 1} -{" "}
            {Math.min(page * perPage, filtered.length)} of {filtered.length}
          </p>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <Button
              size="sm"
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* In-page Create Event Module */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="card-elevated p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold">
                  {editingEventId ? "Edit Event" : "Create New Event"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Add event details below
                </p>
              </div>

              <button
                onClick={() => setShowCreateForm(false)}
                className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-muted transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Event Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={form.date}
                    onChange={(e) =>
                      setForm({ ...form, date: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Expected Attendees</Label>
                  <Input
                    type="number"
                    value={form.attendees}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        attendees: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Revenue</Label>
                  <Input
                    type="number"
                    value={form.revenue}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        revenue: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleSubmit}
                  className="gradient-accent text-accent-foreground"
                >
                  {editingEventId ? "Update Event" : "Create Event"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingEventId(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}