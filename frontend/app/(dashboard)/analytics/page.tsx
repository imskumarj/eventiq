"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { getAnalyticsDashboard } from "@/services/analytics";

import {
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
} from "recharts";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

/* ---------------- TYPES ---------------- */

interface RoiRanking {
  rank: number;
  sponsor: string;
  roi: number;
  events: number;
  trend: string;
}

interface TopEvent {
  name: string;
  score: number;
  revenue: number;
  attendees: number;
}

interface ScatterData {
  engagement: number;
  revenue: number;
  z: number;
}

interface YoYData {
  quarter: string;
  thisYear: number;
  lastYear: number;
}

/* ---------------- PAGE ---------------- */

export default function Analytics() {
  const [roiRanking, setRoiRanking] = useState<RoiRanking[]>([]);
  const [topEvents, setTopEvents] = useState<TopEvent[]>([]);
  const [scatterData, setScatterData] = useState<ScatterData[]>([]);
  const [yoyData, setYoyData] = useState<YoYData[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await getAnalyticsDashboard();

        const data = res.data;

        setRoiRanking(data.roiRanking);
        setTopEvents(data.topEvents);
        setScatterData(data.scatterData);
        setYoyData(data.yoyData);

      } catch (err: any) {
        setError(err.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive text-center py-20">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px]">

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold">Analytics Engine</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Advanced insights and performance analysis
        </p>
      </motion.div>

      {/* ---------------- TABLES ---------------- */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* ROI Ranking */}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated overflow-hidden"
        >
          <div className="p-6 pb-3">
            <h3 className="text-sm font-semibold">
              Sponsor ROI Ranking
            </h3>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-16">#</TableHead>
                <TableHead>Sponsor</TableHead>
                <TableHead className="text-right">ROI</TableHead>
                <TableHead className="text-right">Events</TableHead>
                <TableHead className="text-center">Trend</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {roiRanking.map((r) => (
                <TableRow key={r.rank}>
                  <TableCell className="font-bold text-accent">
                    {r.rank}
                  </TableCell>

                  <TableCell className="font-medium">
                    {r.sponsor}
                  </TableCell>

                  <TableCell className="text-right font-semibold text-success">
                    {r.roi}%
                  </TableCell>

                  <TableCell className="text-right">
                    {r.events}
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge
                      variant="secondary"
                      className={
                        r.trend === "up"
                          ? "bg-success/10 text-success"
                          : r.trend === "down"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {r.trend === "up"
                        ? "↑"
                        : r.trend === "down"
                        ? "↓"
                        : "→"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

        </motion.div>

        {/* Top Events */}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated overflow-hidden"
        >
          <div className="p-6 pb-3">
            <h3 className="text-sm font-semibold">
              Top Performing Events
            </h3>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Event</TableHead>
                <TableHead className="text-right">Score</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Attendees</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {topEvents.map((e) => (
                <TableRow key={e.name}>
                  <TableCell className="font-medium">
                    {e.name}
                  </TableCell>

                  <TableCell className="text-right">
                    <Badge
                      variant="secondary"
                      className="bg-accent/10 text-accent"
                    >
                      {e.score}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right font-medium">
                    ${(e.revenue / 1000).toFixed(0)}K
                  </TableCell>

                  <TableCell className="text-right">
                    {e.attendees.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

        </motion.div>

      </div>

      {/* ---------------- CHARTS ---------------- */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* YoY Chart */}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated p-6"
        >
          <h3 className="text-sm font-semibold mb-4">
            Year-over-Year Revenue
          </h3>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={yoyData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="quarter" />

              <YAxis tickFormatter={(v: any) => `$${v / 1000}k`} />

              <Tooltip />

              <Bar
                dataKey="lastYear"
                fill="hsl(220, 13%, 85%)"
                radius={[4, 4, 0, 0]}
              />

              <Bar
                dataKey="thisYear"
                fill="hsl(262, 83%, 58%)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Scatter */}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated p-6"
        >
          <h3 className="text-sm font-semibold mb-4">
            Engagement vs Revenue Correlation
          </h3>

          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="engagement"
                label={{
                  value: "Engagement %",
                  position: "bottom",
                }}
              />

              <YAxis
                dataKey="revenue"
                tickFormatter={(v: any) => `$${v}k`}
              />

              <ZAxis dataKey="z" range={[60, 400]} />

              <Tooltip />

              <Scatter
                data={scatterData}
                fill="hsl(262, 83%, 58%)"
                fillOpacity={0.7}
              />

            </ScatterChart>
          </ResponsiveContainer>
        </motion.div>

      </div>

    </div>
  );
}