"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import KpiCard from "@/components/KpiCard";

import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Download,
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

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { isLoading, isAuthenticated, isInitialized } = useAuth();
  const [data, setData] = useState<any>(null);
  const router = useRouter();

  async function fetchData() {
    try {
      const res = await getDashboard();
      setData(res?.data);
    } catch (err: any) {
      if (err.message === "Unauthorized") {
        router.replace("/login");
      }
    }
  }

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("eventiq_token")
        : null;

    if (isInitialized && isAuthenticated && token) {
      fetchData();
    }
  }, [isInitialized, isAuthenticated]);

  if (!isInitialized) {
    return <div className="p-6 text-muted-foreground">Initializing...</div>;
  }

  if (isLoading) {
    return <div className="p-6 text-muted-foreground">Loading session...</div>;
  }

  if (!data) {
    return <div className="p-6 text-muted-foreground">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto my-auto px-2">

      {/* 🔥 HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track performance, revenue, and sponsor engagement
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 px-3 py-2.5 bg-color-foreground/10 hover:bg-foreground/20 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </motion.div>

      {/* 🔥 KPI SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard
          title="Total Events"
          value={data.kpis.totalEvents}
          change="Live"
          changeType="neutral"
          icon={Calendar}
          delay={0}
        />

        <KpiCard
          title="Total Sponsors"
          value={data.kpis.totalSponsors}
          change="Live"
          changeType="neutral"
          icon={Users}
          delay={0.1}
        />

        <KpiCard
          title="Total Revenue"
          value={`$${data.kpis.totalRevenue}`}
          change="Live"
          changeType="positive"
          icon={DollarSign}
          delay={0.2}
        />

        <KpiCard
          title="Avg ROI"
          value={`${data.kpis.avgROI}%`}
          change="Live"
          changeType="positive"
          icon={TrendingUp}
          delay={0.3}
        />
      </div>

      {/* 🔥 CHART SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Revenue Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Revenue Growth</h3>
            <span className="text-xs text-muted-foreground">Monthly</span>
          </div>

          <ResponsiveContainer width="100%" height={270}>
            <LineChart data={data.revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
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

        {/* ROI Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-elevated p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Sponsor ROI</h3>
            <span className="text-xs text-muted-foreground">Top Sponsors</span>
          </div>

          <ResponsiveContainer width="100%" height={270}>
            <BarChart data={data.roiData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sponsor" />
              <YAxis />
              <Tooltip />

              <Bar
                dataKey="roi"
                fill="hsl(199,89%,48%)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}