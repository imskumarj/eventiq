import { motion } from 'framer-motion';
import KpiCard from '@/components/KpiCard';
import { Activity, Database, AlertTriangle, Clock } from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';

const trafficData = [
  { hour: '00', requests: 120 }, { hour: '04', requests: 45 }, { hour: '08', requests: 380 },
  { hour: '12', requests: 520 }, { hour: '16', requests: 490 }, { hour: '20', requests: 310 },
  { hour: '24', requests: 180 },
];

const errorData = [
  { hour: '00', rate: 0.2 }, { hour: '04', rate: 0.1 }, { hour: '08', rate: 0.8 },
  { hour: '12', rate: 1.2 }, { hour: '16', rate: 0.5 }, { hour: '20', rate: 0.3 },
  { hour: '24', rate: 0.4 },
];

export default function SystemMetrics() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold">System Metrics</h1>
        <p className="text-muted-foreground text-sm mt-1">Monitor platform health and performance</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="API Requests Today" value="12,847" change="+18% from yesterday" changeType="positive" icon={Activity} delay={0} />
        <KpiCard title="DB Connections" value="24" change="Normal range" changeType="neutral" icon={Database} delay={0.05} />
        <KpiCard title="Error Rate" value="0.3%" change="-12% from yesterday" changeType="positive" icon={AlertTriangle} delay={0.1} />
        <KpiCard title="Avg Response Time" value="142ms" change="+5ms from yesterday" changeType="negative" icon={Clock} delay={0.15} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-elevated p-6">
          <h3 className="text-sm font-semibold mb-4">Traffic Trend (Today)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="hour" tick={{ fontSize: 12, fill: 'hsl(220, 9%, 46%)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(220, 9%, 46%)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(220,13%,91%)' }} />
              <defs>
                <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="requests" stroke="hsl(199, 89%, 48%)" strokeWidth={2.5} fill="url(#trafficGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card-elevated p-6">
          <h3 className="text-sm font-semibold mb-4">Error Rate Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={errorData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="hour" tick={{ fontSize: 12, fill: 'hsl(220, 9%, 46%)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(220, 9%, 46%)' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(220,13%,91%)' }} formatter={(v: number) => [`${v}%`, 'Error Rate']} />
              <Line type="monotone" dataKey="rate" stroke="hsl(0, 84%, 60%)" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
