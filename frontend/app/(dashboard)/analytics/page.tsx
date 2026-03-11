"use client";

import { motion } from "framer-motion";
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
} from "../../components/ui/table";

import { Badge } from "../../components/ui/badge";

/* ---------------- DATA ---------------- */

const roiRanking = [
  { rank: 1, sponsor: "CloudAI Solutions", roi: 420, events: 5, trend: "up" },
  { rank: 2, sponsor: "TechCorp Global", roi: 340, events: 8, trend: "up" },
  { rank: 3, sponsor: "DevHub Platform", roi: 310, events: 4, trend: "stable" },
  { rank: 4, sponsor: "DataFlow Systems", roi: 280, events: 6, trend: "down" },
  { rank: 5, sponsor: "ByteInc", roi: 260, events: 3, trend: "up" },
];

const topEvents = [
  { name: "AI Expo Global", score: 95, revenue: 210000, attendees: 3200 },
  { name: "FinTech Connect", score: 91, revenue: 180000, attendees: 2800 },
  { name: "Tech Summit 2025", score: 92, revenue: 125000, attendees: 2450 },
  { name: "Cloud Innovation Forum", score: 89, revenue: 145000, attendees: 2100 },
];

const scatterData = [
  { engagement: 72, revenue: 45, z: 900 },
  { engagement: 87, revenue: 98, z: 1800 },
  { engagement: 92, revenue: 125, z: 2450 },
  { engagement: 95, revenue: 210, z: 3200 },
  { engagement: 81, revenue: 78, z: 1500 },
  { engagement: 89, revenue: 145, z: 2100 },
  { engagement: 84, revenue: 92, z: 1700 },
  { engagement: 91, revenue: 180, z: 2800 },
];

const yoyData = [
  { quarter: "Q1", thisYear: 155000, lastYear: 120000 },
  { quarter: "Q2", thisYear: 198000, lastYear: 155000 },
  { quarter: "Q3", thisYear: 237000, lastYear: 180000 },
  { quarter: "Q4", thisYear: 285000, lastYear: 210000 },
];

/* ---------------- PAGE ---------------- */

export default function Analytics() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold">Analytics Engine</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Advanced insights and performance analysis
        </p>
      </motion.div>

      {/* ---------- Tables ---------- */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* ROI Ranking */}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-elevated overflow-hidden"
        >
          <div className="p-6 pb-3">
            <h3 className="text-sm font-semibold">Sponsor ROI Ranking</h3>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold w-16">#</TableHead>
                <TableHead className="font-semibold">Sponsor</TableHead>
                <TableHead className="font-semibold text-right">ROI</TableHead>
                <TableHead className="font-semibold text-right">Events</TableHead>
                <TableHead className="font-semibold text-center">Trend</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {roiRanking.map((r) => (
                <TableRow
                  key={r.rank}
                  className="hover:bg-muted/20 transition-colors"
                >
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
          transition={{ delay: 0.15 }}
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
                <TableHead className="font-semibold">Event</TableHead>
                <TableHead className="font-semibold text-right">
                  Score
                </TableHead>
                <TableHead className="font-semibold text-right">
                  Revenue
                </TableHead>
                <TableHead className="font-semibold text-right">
                  Attendees
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {topEvents.map((e) => (
                <TableRow
                  key={e.name}
                  className="hover:bg-muted/20 transition-colors"
                >
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

      {/* ---------- Charts ---------- */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* YoY Chart */}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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
          transition={{ delay: 0.25 }}
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