"use client";

import { useAuth } from "../contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Calendar,
  Users,
  BarChart3,
  FileText,
  Database,
  Activity,
  Zap,
  ChevronLeft,
  ChevronRight,
  LogOut,
  TrendingUp,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  roles: string[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, path: "/dashboard", roles: ["admin", "sponsor", "organizer"] },
  { label: "Events", icon: <Calendar className="w-5 h-5" />, path: "/events", roles: ["admin", "organizer"] },
  { label: "My Events", icon: <Calendar className="w-5 h-5" />, path: "/events", roles: ["sponsor"] },
  { label: "Sponsors", icon: <Users className="w-5 h-5" />, path: "/sponsors", roles: ["admin", "organizer"] },
  { label: "Analytics", icon: <BarChart3 className="w-5 h-5" />, path: "/analytics", roles: ["admin"] },
  { label: "ROI Analytics", icon: <TrendingUp className="w-5 h-5" />, path: "/analytics", roles: ["sponsor"] },
  { label: "Reports", icon: <FileText className="w-5 h-5" />, path: "/reports", roles: ["admin", "sponsor", "organizer"] },
  { label: "Data Ingestion", icon: <Database className="w-5 h-5" />, path: "/data-ingestion", roles: ["admin"] },
  { label: "System Metrics", icon: <Activity className="w-5 h-5" />, path: "/system-metrics", roles: ["admin"] },
];

export default function AppSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const filteredItems = navItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-y-0 left-0 h-screen w-[260px] flex flex-col bg-sidebar border-r border-sidebar-border z-30 overflow-hidden"
    >
      {/* 🔥 HEADER */}
      <div className="h-16 py-4 flex items-center justify-between px-4 border-b border-sidebar-border gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl gradient-accent flex items-center justify-center shadow-md">
            <Zap className="w-4 h-4 text-white" color="white" />
          </div>

          {!collapsed && (
            <span className="text-lg font-semibold text-sidebar-primary-foreground">
              EventIQ
            </span>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-sidebar-accent/50 transition"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* 🔥 NAV */}
      <nav className="flex-1 min-h-0 py-4 px-3 space-y-1 overflow-y-auto">
        {filteredItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.label}
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "gradient-accent text-white shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              {item.icon}

              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* 🔥 USER */}
      <div className="sticky bottom-0 p-3 border-t border-sidebar-border bg-sidebar">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-sidebar-accent transition">
          <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center text-xs font-bold text-white">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          {!collapsed && (
            <>
              <div className="flex-1">
                <p className="text-sm font-medium text-sidebar-primary-foreground truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-sidebar-muted capitalize">
                  {user?.role}
                </p>
              </div>

              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="hover:text-white text-sidebar-muted"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.aside>
  );
}