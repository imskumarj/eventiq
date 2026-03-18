"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import KpiCard from "@/components/KpiCard";

import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Download
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { getDashboard } from "@/services/dashboard";

import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {

  const { isLoading, isAuthenticated } = useAuth();
  const [data, setData] = useState<any>(null);

  async function fetchData() {
    try {
      const res = await getDashboard();
      setData(res?.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      fetchData();
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) return <div className="p-6">Loading session...</div>;

  if (!isAuthenticated)
    return <div className="p-6">Please login first</div>;

  if (!data) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="space-y-6 max-w-[1400px]">

      {/* Header */}

      <motion.div className="flex justify-between">

        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Overview of your event analytics
          </p>
        </div>

        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>

      </motion.div>

      {/* KPI */}

      <div className="grid grid-cols-4 gap-4">

        <KpiCard
          title="Total Events"
          value={data.kpis.totalEvents}
          change="Live"
          changeType="neutral"
          icon={Calendar}
        />

        <KpiCard
          title="Total Sponsors"
          value={data.kpis.totalSponsors}
          change="Live"
          changeType="neutral"
          icon={Users}
        />

        <KpiCard
          title="Total Revenue"
          value={`$${data.kpis.totalRevenue}`}
          change="Live"
          changeType="positive"
          icon={DollarSign}
        />

        <KpiCard
          title="Avg ROI"
          value={`${data.kpis.avgROI}%`}
          change="Live"
          changeType="positive"
          icon={TrendingUp}
        />

      </div>

      {/* Charts */}

      <div className="grid grid-cols-2 gap-4">

        {/* Revenue */}

        <motion.div className="card-elevated p-6">

          <h3 className="text-sm font-semibold mb-4">
            Revenue Growth
          </h3>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data.revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="hsl(262,83%,58%)"
                strokeWidth={2}
              />

            </LineChart>
          </ResponsiveContainer>

        </motion.div>

        {/* ROI */}

        <motion.div className="card-elevated p-6">

          <h3 className="text-sm font-semibold mb-4">
            Sponsor ROI
          </h3>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.roiData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sponsor" />
              <YAxis />
              <Tooltip />

              <Bar
                dataKey="roi"
                fill="hsl(199,89%,48%)"
              />

            </BarChart>
          </ResponsiveContainer>

        </motion.div>

      </div>

    </div>
  );
}