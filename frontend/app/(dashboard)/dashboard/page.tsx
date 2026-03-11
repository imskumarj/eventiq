"use client";

import { motion } from "framer-motion";
import KpiCard from "../../components/KpiCard";
import { Calendar, Users, DollarSign, TrendingUp, Download } from "lucide-react";
import { Button } from "../../components/ui/button";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

/* ---------------- DATA ---------------- */

const revenueData = [
  { month: "Jan", revenue: 42000 },
  { month: "Feb", revenue: 48000 },
  { month: "Mar", revenue: 55000 },
  { month: "Apr", revenue: 51000 },
  { month: "May", revenue: 63000 },
  { month: "Jun", revenue: 71000 },
  { month: "Jul", revenue: 68000 },
  { month: "Aug", revenue: 79000 },
  { month: "Sep", revenue: 85000 },
  { month: "Oct", revenue: 92000 },
  { month: "Nov", revenue: 88000 },
  { month: "Dec", revenue: 105000 },
];

const roiData = [
  { sponsor: "TechCorp", roi: 340 },
  { sponsor: "DataFlow", roi: 280 },
  { sponsor: "CloudAI", roi: 420 },
  { sponsor: "NetSys", roi: 190 },
  { sponsor: "DevHub", roi: 310 },
  { sponsor: "ByteInc", roi: 260 },
];

const categoryData = [
  { name: "Technology", value: 35 },
  { name: "Finance", value: 25 },
  { name: "Healthcare", value: 20 },
  { name: "Education", value: 12 },
  { name: "Other", value: 8 },
];

const engagementData = [
  { week: "W1", engagement: 72 },
  { week: "W2", engagement: 78 },
  { week: "W3", engagement: 85 },
  { week: "W4", engagement: 82 },
  { week: "W5", engagement: 90 },
  { week: "W6", engagement: 95 },
  { week: "W7", engagement: 88 },
  { week: "W8", engagement: 102 },
];

const COLORS = [
  "hsl(262,83%,58%)",
  "hsl(199,89%,48%)",
  "hsl(142,71%,45%)",
  "hsl(38,92%,50%)",
  "hsl(0,84%,60%)",
];

/* ---------------- PAGE ---------------- */

export default function Dashboard() {
  return (
    <div className="space-y-6 max-w-[1400px]">

      {/* Header */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Overview of your event analytics
          </p>
        </div>

        <div className="flex gap-3">
          <select className="h-9 px-3 rounded-lg border border-border bg-card text-sm">
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
          </select>

          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
        </div>
      </motion.div>

      {/* KPI Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <KpiCard
          title="Total Events"
          value="127"
          change="+12% from last month"
          changeType="positive"
          icon={Calendar}
        />

        <KpiCard
          title="Total Sponsors"
          value="84"
          change="+8% from last month"
          changeType="positive"
          icon={Users}
        />

        <KpiCard
          title="Total Revenue"
          value="$847K"
          change="+23% from last month"
          changeType="positive"
          icon={DollarSign}
        />

        <KpiCard
          title="Avg Sponsor ROI"
          value="312%"
          change="+5% from last month"
          changeType="positive"
          icon={TrendingUp}
        />

      </div>

      {/* Charts */}

      {/* Revenue */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated p-6"
        >
          <h3 className="text-sm font-semibold mb-4">
            Revenue Growth
          </h3>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={revenueData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis tickFormatter={(v:any) => `$${v / 1000}k`} />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="hsl(262,83%,58%)"
                strokeWidth={2.5}
                dot={false}
              />

            </LineChart>
          </ResponsiveContainer>

        </motion.div>

        {/* ROI */}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated p-6"
        >
          <h3 className="text-sm font-semibold mb-4">
            Sponsor ROI Comparison
          </h3>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={roiData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="sponsor" />

              <YAxis tickFormatter={(v:any) => `${v}%`} />

              <Tooltip />

              <Bar dataKey="roi" fill="hsl(199,89%,48%)" />

            </BarChart>
          </ResponsiveContainer>

        </motion.div>

      </div>
    </div>
  );
}