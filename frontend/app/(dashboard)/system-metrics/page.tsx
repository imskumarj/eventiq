"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import KpiCard from "@/components/KpiCard";

import {
  Activity,
  Database,
  AlertTriangle,
  Clock,
} from "lucide-react";

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { getSystemMetrics } from "@/services/system-metrics";

export default function SystemMetrics() {

  const [data, setData] = useState<any>(null);

  async function fetchMetrics() {
    const res = await getSystemMetrics();
    setData(res.data);
  }

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-6 max-w-[1400px]">

      <motion.div>
        <h1 className="text-2xl font-bold">System Metrics</h1>
        <p className="text-muted-foreground text-sm">
          Monitor platform health and performance
        </p>
      </motion.div>

      {/* KPI Cards */}

      <div className="grid grid-cols-4 gap-4">

        <KpiCard
          title="API Requests Today"
          value={data.kpis.apiRequests}
          change="Live data"
          changeType="neutral"
          icon={Activity}
        />

        <KpiCard
          title="DB Latency"
          value={`${data.kpis.dbConnections} ms`}
          change="Healthy"
          changeType="positive"
          icon={Database}
        />

        <KpiCard
          title="Error Rate"
          value={`${data.kpis.errorRate}%`}
          change="Live"
          changeType="neutral"
          icon={AlertTriangle}
        />

        <KpiCard
          title="Avg Response Time"
          value={`${data.kpis.avgResponseTime} ms`}
          change="Live"
          changeType="neutral"
          icon={Clock}
        />

      </div>

      {/* Charts */}

      <div className="grid grid-cols-2 gap-4">

        <motion.div className="card-elevated p-6">

          <h3 className="text-sm font-semibold mb-4">
            Traffic Trend
          </h3>

          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data.traffic}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />

              <Area
                type="monotone"
                dataKey="requests"
                stroke="hsl(199,89%,48%)"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>

        </motion.div>

        <motion.div className="card-elevated p-6">

          <h3 className="text-sm font-semibold mb-4">
            Error Rate Trend
          </h3>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data.errors}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="rate"
                stroke="hsl(0,84%,60%)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>

        </motion.div>

      </div>

    </div>
  );
}